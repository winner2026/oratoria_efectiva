"use client";

import { useRef, useEffect, useState, useCallback } from "react";

// Tipos para los resultados de Holistic
interface PostureLandmark {
  x: number;
  y: number;
  z: number;
  visibility?: number;
}

interface HolisticResults {
  poseLandmarks?: PostureLandmark[];
  leftHandLandmarks?: PostureLandmark[];
  rightHandLandmarks?: PostureLandmark[];
  faceLandmarks?: PostureLandmark[];
}

// Métricas de postura calculadas
export interface PostureMetrics {
  isPersonDetected: boolean;      // Nueva métrica: ¿Hay alguien ahí?
  postureScore: number;           // 0-100 overall
  shouldersLevel: "balanced" | "uneven";
  shouldersAngle: number;         // grados de desviación
  headPosition: "centered" | "tilted_left" | "tilted_right";
  headTilt: number;               // grados de inclinación
  spineAlignment: number;         // 0-100
  eyeContactPercent: number;      // % del tiempo mirando a cámara
  gesturesUsage: "low" | "optimal" | "excessive";
  handMovementScore: number;      // 0-100
  nervousnessIndicators: {
    closedFists: number;          // % del tiempo con puños cerrados
    handsHidden: number;          // % del tiempo manos no visibles
    excessiveMovement: boolean;
  };
  frameCount: number;
  isTracking: boolean;
}

// Estado inicial de métricas
const initialMetrics: PostureMetrics = {
  isPersonDetected: false, // Inicialmente false
  postureScore: 0,
  shouldersLevel: "balanced",
  shouldersAngle: 0,
  headPosition: "centered",
  headTilt: 0,
  spineAlignment: 0,
  eyeContactPercent: 0,
  gesturesUsage: "low",
  handMovementScore: 0,
  nervousnessIndicators: {
    closedFists: 0,
    handsHidden: 0,
    excessiveMovement: false,
  },
  frameCount: 0,
  isTracking: false,
};

// Acumuladores para promedios
interface MetricsAccumulator {
  shouldersAngles: number[];
  headTilts: number[];
  spineScores: number[];
  eyeContactFrames: number;
  totalFrames: number;
  closedFistFrames: number;
  hiddenHandsFrames: number;
  handMovements: number[];
  lastHandPositions: { left: { x: number; y: number } | null; right: { x: number; y: number } | null };
}

// Definir tipos globales para helpers de dibujo
declare global {
  interface Window {
    drawConnectors: any;
    drawLandmarks: any;
    POSE_CONNECTIONS: any;
    HAND_CONNECTIONS: any;
    FACEMESH_TESSELATION: any;
  }
}

interface UsePostureAnalysisProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef?: React.RefObject<HTMLCanvasElement>;
}

export function usePostureAnalysis({ videoRef, canvasRef }: UsePostureAnalysisProps = { videoRef: { current: null } as any }) {
  // videoRef y canvasRef vienen de props ahora
  const holisticRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const accumulatorRef = useRef<MetricsAccumulator>({
    shouldersAngles: [],
    headTilts: [],
    spineScores: [],
    eyeContactFrames: 0,
    totalFrames: 0,
    closedFistFrames: 0,
    hiddenHandsFrames: 0,
    handMovements: [],
    lastHandPositions: { left: null, right: null },
  });

  const [isInitialized, setIsInitialized] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentMetrics, setCurrentMetrics] = useState<PostureMetrics>(initialMetrics);
  const [error, setError] = useState<string | null>(null);

  // Calcular ángulo entre hombros
  const calculateShouldersAngle = (leftShoulder: PostureLandmark | undefined, rightShoulder: PostureLandmark | undefined): number => {
    if (!leftShoulder || !rightShoulder) return 0;
    const deltaY = rightShoulder.y - leftShoulder.y;
    const deltaX = rightShoulder.x - leftShoulder.x;
    return Math.atan2(deltaY, deltaX) * (180 / Math.PI);
  };

  // Calcular inclinación de cabeza
  const calculateHeadTilt = (nose: PostureLandmark | undefined, leftEar: PostureLandmark | undefined, rightEar: PostureLandmark | undefined): number => {
    if (!nose || !leftEar || !rightEar) return 0;
    const earMidpointX = (leftEar.x + rightEar.x) / 2;
    const deviation = nose.x - earMidpointX;
    return deviation * 100; // Normalizado
  };

  // Calcular alineación de columna
  // Calcular alineación de columna (Flexible: Cuerpo Completo o Tronco Superior)
  const calculateSpineAlignment = (
    nose: PostureLandmark | undefined,
    leftShoulder: PostureLandmark | undefined,
    rightShoulder: PostureLandmark | undefined,
    leftHip: PostureLandmark | undefined,
    rightHip: PostureLandmark | undefined
  ): number => {
    // Requisito mínimo: Nariz y Hombros
    if (!nose || !leftShoulder || !rightShoulder) return 0;
    
    const shoulderMidX = (leftShoulder.x + rightShoulder.x) / 2;
    
    // Si tenemos caderas, usamos alineación completa (Hombros vs Caderas)
    if (leftHip && rightHip) {
        const hipMidX = (leftHip.x + rightHip.x) / 2;
        const deviation = Math.abs(shoulderMidX - hipMidX);
        return Math.max(0, 100 - deviation * 500);
    }
    
    // Fallback: Solo Tronco Superior (Nariz vs Hombros)
    // Verificamos que la nariz esté centrada sobre los hombros
    const deviation = Math.abs(nose.x - shoulderMidX);
    // Un desvío pequeño es normal, penalizamos si la cabeza no está sobre el centro del torso
    return Math.max(0, 100 - deviation * 800);
  };

  // Detectar contacto visual (cara mirando a cámara)
  const detectEyeContact = (faceLandmarks: PostureLandmark[], poseLandmarks: PostureLandmark[]): boolean => {
    if (!faceLandmarks || faceLandmarks.length < 10) return false;
    
    // Check de centrado en pantalla
    const noseFace = faceLandmarks[1];
    const isCenteredInScreen = Math.abs(noseFace.x - 0.5) < 0.35;
    if (!isCenteredInScreen) return false;

    if (poseLandmarks && poseLandmarks.length > 8) {
       const leftEye = poseLandmarks[2];
       const rightEye = poseLandmarks[5];
       const leftEar = poseLandmarks[7];
       const rightEar = poseLandmarks[8];
       const nosePose = poseLandmarks[0];

       // Análisis Vertical (Pitch)
       const avgEyeY = (leftEye.y + rightEye.y) / 2;
       const avgEarY = (leftEar.y + rightEar.y) / 2;
       const pitchDiff = avgEyeY - avgEarY; 
       
       // Análisis Horizontal (Yaw)
       const midEarX = (leftEar.x + rightEar.x) / 2;
       const faceWidth = Math.abs(leftEar.x - rightEar.x);
       const yawDeviation = nosePose.x - midEarX;
       const yawRatio = Math.abs(yawDeviation) / (faceWidth || 0.1); 

       // Umbrales de detección
       if (pitchDiff > 0.02) return false; // Mirada abajo
       if (yawRatio > 0.15) return false;  // Mirada lateral
    }
    
    return true;
  };

  // Detectar puños cerrados
  const detectClosedFist = (handLandmarks: PostureLandmark[] | undefined): boolean => {
    if (!handLandmarks || handLandmarks.length < 21) return false;
    
    // Comparar puntas de dedos con nudillos
    // Si las puntas están más cerca de la palma que los nudillos, está cerrado
    const wrist = handLandmarks[0];
    const indexTip = handLandmarks[8];
    const middleTip = handLandmarks[12];
    const ringTip = handLandmarks[16];
    const pinkyTip = handLandmarks[20];
    
    const indexKnuckle = handLandmarks[5];
    const middleKnuckle = handLandmarks[9];
    
    // Distancia de puntas a muñeca
    const tipDistances = [indexTip, middleTip, ringTip, pinkyTip].map(tip => 
      Math.sqrt(Math.pow(tip.x - wrist.x, 2) + Math.pow(tip.y - wrist.y, 2))
    );
    
    // Distancia de nudillos a muñeca
    const knuckleDistance = Math.sqrt(
      Math.pow(middleKnuckle.x - wrist.x, 2) + Math.pow(middleKnuckle.y - wrist.y, 2)
    );
    
    // Si las puntas están más cerca que los nudillos, es puño cerrado
    const avgTipDistance = tipDistances.reduce((a, b) => a + b, 0) / tipDistances.length;
    return avgTipDistance < knuckleDistance * 0.8;
  };

  // Calcular movimiento de manos usando el centroide de todos los puntos para máxima sensibilidad
  const calculateHandMovement = (
    leftHand: PostureLandmark[] | undefined,
    rightHand: PostureLandmark[] | undefined
  ): number => {
    const acc = accumulatorRef.current;
    let movement = 0;

    const getCentroid = (landmarks: PostureLandmark[]) => {
      let x = 0, y = 0;
      landmarks.forEach(l => { x += l.x; y += l.y; });
      return { x: x / landmarks.length, y: y / landmarks.length };
    };
    
    if (leftHand && leftHand.length > 0) {
      const current = getCentroid(leftHand);
      if (acc.lastHandPositions.left) {
        movement += Math.sqrt(
          Math.pow(current.x - acc.lastHandPositions.left.x, 2) +
          Math.pow(current.y - acc.lastHandPositions.left.y, 2)
        );
      }
      acc.lastHandPositions.left = current;
    }
    
    if (rightHand && rightHand.length > 0) {
      const current = getCentroid(rightHand);
      if (acc.lastHandPositions.right) {
        movement += Math.sqrt(
          Math.pow(current.x - acc.lastHandPositions.right.x, 2) +
          Math.pow(current.y - acc.lastHandPositions.right.y, 2)
        );
      }
      acc.lastHandPositions.right = current;
    }
    
    return movement * 100;
  };

  // Los scripts de MediaPipe se cargan mediante <Script> en page.tsx
  // No necesitamos inyectarlos aquí manualmente.

  // Procesar resultados de cada frame
  const processResults = useCallback((results: HolisticResults) => {
    // 🎨 DIBUJO DE GESTOS EN TIEMPO REAL
    if (canvasRef?.current && videoRef.current) {
      const canvasCtx = canvasRef.current.getContext('2d');
      const { width, height } = canvasRef.current;

      if (canvasCtx) {
        // Limpiar canvas
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, width, height);
        
        // Espejo (si el video está espejado)
        canvasCtx.translate(width, 0);
        canvasCtx.scale(-1, 1);

        // Dibujar solo si las funciones globales existen
        if (window.drawConnectors && window.drawLandmarks) {
            // Dibujar Conexiones de Manos (Verde brillante para feedback positivo)
            canvasCtx.lineWidth = 2;
            if (results.leftHandLandmarks) {
                window.drawConnectors(canvasCtx, results.leftHandLandmarks, window.HAND_CONNECTIONS, {color: '#00ff00', lineWidth: 2});
                window.drawLandmarks(canvasCtx, results.leftHandLandmarks, {color: '#ffffff', lineWidth: 1, radius: 3});
            }
            if (results.rightHandLandmarks) {
                window.drawConnectors(canvasCtx, results.rightHandLandmarks, window.HAND_CONNECTIONS, {color: '#00ff00', lineWidth: 2});
                window.drawLandmarks(canvasCtx, results.rightHandLandmarks, {color: '#ffffff', lineWidth: 1, radius: 3});
            }

            // Dibujar Hombros y Pose simplificada (Cyan, solo cuerpo superior)
            if (results.poseLandmarks) {
                window.drawConnectors(canvasCtx, results.poseLandmarks, window.POSE_CONNECTIONS, {color: '#00ccff', lineWidth: 1});
            }
        }
        canvasCtx.restore();
      }
    }

    const acc = accumulatorRef.current;
    acc.totalFrames++;

    const pose = results.poseLandmarks;
    const face = results.faceLandmarks;
    const leftHand = results.leftHandLandmarks;
    const rightHand = results.rightHandLandmarks;

    // Detección más permisiva: Si hay cara o cuerpo superior, hay persona.
    const hasFace = !!face && face.length > 0;
    const hasPose = !!pose && pose.length > 10; // 0-10 son cara, 11-12 hombros. Suficiente.

    if (!hasPose && !hasFace) {
      // DEBUG: Ver por qué falla la detección
      if (acc.totalFrames % 60 === 0) { 
         console.log("⚠️ No person detected (Strict Mode):", { 
             hasPose,
             poseLength: pose?.length,
             hasFace,
         });
      }
      setCurrentMetrics(prev => ({ ...prev, isTracking: false, isPersonDetected: false }));
      return;
    } else {
       if (!acc.lastHandPositions.left && acc.totalFrames % 120 === 0) console.log("✅ Person Detected (Permissive)!"); 
    }

    // Landmarks del cuerpo (índices de MediaPipe Pose)
    // Landmarks del cuerpo (índices de MediaPipe Pose) - Acceso seguro
    const nose = pose?.[0];
    const leftShoulder = pose?.[11];
    const rightShoulder = pose?.[12];
    const leftHip = pose?.[23];
    const rightHip = pose?.[24];
    const leftEar = pose?.[7];
    const rightEar = pose?.[8];

    // Calcular métricas del frame actual
    const shouldersAngle = calculateShouldersAngle(leftShoulder, rightShoulder);
    const headTilt = calculateHeadTilt(nose, leftEar, rightEar);
    const spineScore = calculateSpineAlignment(nose, leftShoulder, rightShoulder, leftHip, rightHip);
    const hasEyeContact = (face && pose) ? detectEyeContact(face, pose) : false;
    const handMovement = calculateHandMovement(leftHand, rightHand);

    // Acumular para reporte final
    acc.shouldersAngles.push(shouldersAngle);
    acc.headTilts.push(headTilt);
    acc.spineScores.push(spineScore);
    acc.handMovements.push(handMovement);
    if (hasEyeContact) acc.eyeContactFrames++;
    
    // Detectar nerviosismo
    const leftFist = detectClosedFist(leftHand);
    const rightFist = detectClosedFist(rightHand);
    if (leftFist || rightFist) acc.closedFistFrames++;
    if (!leftHand && !rightHand) acc.hiddenHandsFrames++;

    // --- MÉTRICAS INTEGRADAS (PARA VIDEO FEEDBACK) ---
    // Usamos valores del frame actual (ligeramente suavizados si se quisiera, pero raw es más reactivo)
    
    // 1. Postura: "Pecho hacia afuera" (Hombros abajo y atrás)
    // Para detectar esto en 2D, miramos la longitud del cuello.
    // Si sacas pecho, los hombros bajan y el cuello se ve más largo.
    // Si te encorvas, los hombros suben y el cuello desaparece.

    // Ancho de cara como referencia de escala
    const faceWidth = Math.abs((leftEar?.x || 0) - (rightEar?.x || 0));
    
    // Distancia Oreja-Hombro (Cuello)
    const neckL = Math.hypot((leftEar?.x || 0) - (leftShoulder?.x || 0), (leftEar?.y || 0) - (leftShoulder?.y || 0));
    const neckR = Math.hypot((rightEar?.x || 0) - (rightShoulder?.x || 0), (rightEar?.y || 0) - (rightShoulder?.y || 0));
    const avgNeck = (neckL + neckR) / 2;

    // Ratio Cuello/Cara. 
    // < 0.35 significa hombros encogidos/joroba.
    // > 0.35 significa hombros relajados/pecho fuera.
    const postureRatio = faceWidth > 0 ? avgNeck / faceWidth : 0;
    const isUpright = postureRatio > 0.35; 

    // Nivelación (que no estés torcido de lado)
    const shoulderDiffY = Math.abs((leftShoulder?.y || 0) - (rightShoulder?.y || 0));
    const isLevel = shoulderDiffY < 0.12; 

    // Estado final: Debe estar nivelado Y erguido
    const shouldersLevel = (isLevel && isUpright) ? "balanced" : "uneven";
    
    // Debug para calibrar si el usuario lo necesita
    // if (acc.totalFrames % 60 === 0) console.log("Posture Ratio:", postureRatio.toFixed(2));

    // 2. Cabeza: Inclinación
    const headPosition = headTilt < -5 ? "tilted_left" : headTilt > 5 ? "tilted_right" : "centered"; // Umbral relajado a 5

    // 3. Gestos: Niveles (low, optimal, excessive)
    let gesturesUsage: "low" | "optimal" | "excessive" = "low";
    // handMovement es delta por frame * 100.
    // > 0.15: Movimiento leve/natural.
    // > 3.0: Movimiento muy rápido/agitado.
    
    // Usamos el acumulado para reporte, o el instantáneo para UI?
    // Para UI usamos window (handMovement instantáneo).
    
    const instantGestures = handMovement > 3.0 ? "excessive" : handMovement > 0.08 ? "optimal" : "low";
    
    gesturesUsage = instantGestures;

    // Calcular score general INSTRANTÁNEO para feedback visual
    const currentPostureScore = Math.round(
      (spineScore * 0.3) +
      (Math.max(0, 100 - Math.abs(shouldersAngle) * 5) * 0.25) +
      (Math.max(0, 100 - Math.abs(headTilt) * 10) * 0.2) +
      ((hasEyeContact ? 100 : 0) * 0.25)
    );

    // Calcular promedios para guardar (estadísticas finales)
    const avgHandMovement = acc.handMovements.reduce((a, b) => a + b, 0) / acc.handMovements.length;
    const avgShouldersAngle = acc.shouldersAngles.reduce((a, b) => a + b, 0) / acc.shouldersAngles.length;

    // Recalcular gesturesUsage final basado en promedio para reporte
    if (avgHandMovement > 3.0) gesturesUsage = "excessive";
    else if (avgHandMovement > 0.08) gesturesUsage = "optimal";
    else gesturesUsage = "low";

    // Actualizar estado UI usando el gesto instantáneo para reactividad
    setCurrentMetrics({
      isPersonDetected: true,
      postureScore: Math.min(100, Math.max(0, currentPostureScore)), 
      shouldersLevel, 
      shouldersAngle: shouldersAngle, 
      headPosition, 
      headTilt: headTilt, 
      spineAlignment: spineScore, 
      eyeContactPercent: (acc.eyeContactFrames / acc.totalFrames) * 100, 
      gesturesUsage: instantGestures, // <--- CAMBIO: Usar instantáneo para feedback
      handMovementScore: Math.min(100, avgHandMovement * 10), 
      nervousnessIndicators: {
        closedFists: (acc.closedFistFrames / acc.totalFrames) * 100,
        handsHidden: (acc.hiddenHandsFrames / acc.totalFrames) * 100,
        excessiveMovement: avgHandMovement > 8,
      },
      frameCount: acc.totalFrames,
      isTracking: true,
    });

    // Dibujar overlay en canvas
    if (canvasRef.current && results.poseLandmarks) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        // Aquí se puede agregar dibujo de landmarks si se desea
      }
    }
  }, []);

  // Inicializar MediaPipe Holistic
  const initialize = useCallback(async () => {
    if (isInitialized) return;

    try {
      // Esperar brevemente por si Next.js aún está hidratando los scripts
      if (!(window as any).Holistic) {
          console.log("⏳ Esperando carga de scripts MediaPipe...");
          let retry = 0;
          while (!(window as any).Holistic && retry < 20) {
              await new Promise(r => setTimeout(r, 200));
              retry++;
          }
      }

      const Holistic = (window as any).Holistic;
      if (!Holistic) {
          throw new Error("Librerías MediaPipe no disponibles en window. Verifica tu conexión.");
      }

      if (!videoRef.current) throw new Error("Elemento de video no encontrado.");

      console.log("✅ Inicializando instancia Holistic...");
      const holistic = new Holistic({
        locateFile: (file: string) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
        },
      });

      holistic.setOptions({
        modelComplexity: 1, // 1=Full (Mejor para manos)
        smoothLandmarks: true,
        enableSegmentation: false,
        smoothSegmentation: false,
        refineFaceLandmarks: false,
        minDetectionConfidence: 0.3, // Máxima sensibilidad de detección
        minTrackingConfidence: 0.3,
      });

      holistic.onResults(processResults);
      holisticRef.current = holistic; // IMPORTANTE: Guardar referencia

      // --- REEMPLAZO DE CAMERA UTILS POR BUCLE MANUAL ---
      // Esto es más robusto porque no depende de la implementación oculta de @mediapipe/camera_utils
      // y nos permite controlar exactamente cuándo enviamos frames.

      const startDetectionLoop = () => {
        const detectView = async () => {
          if (
            videoRef.current && 
            videoRef.current.readyState >= 2 && // HAVE_CURRENT_DATA
            holisticRef.current
            // Eliminado isAnalyzing para permitir warm-up (análisis previo a grabación)
          ) {
            try {
               await holisticRef.current.send({ image: videoRef.current });
            } catch (err) {
               console.warn("Error enviando frame a Holistic:", err);
            }
          }
          
          if (cameraRef.current) { 
             requestAnimationFrame(detectView);
          }
        };
        detectView();
      };

      // Guardamos un objeto "falso" en cameraRef para mantener compatibilidad con stop()
      // y para usarlo como flag de cancelación.
      cameraRef.current = {
        start: async () => {
            console.log("🚀 Iniciando bucle de detección manual");
            startDetectionLoop();
        },
        stop: () => {
            console.log("🛑 Deteniendo bucle de detección");
            cameraRef.current = null; // Esto rompe el bucle en el próximo frame
        }
      };
      
      // ARRANCAR INMEDIATAMENTE PARA EL FEEDBACK EN VIVO
      cameraRef.current.start();

      setIsInitialized(true);
      setError(null);
      console.log("🚀 MediaPipe listo y corriendo (Modo Loop Manual).");

    } catch (err: any) {
      console.error("❌ Error fatal inicializando MediaPipe:", err);
      setError(`Error de inicialización: ${err.message || err}`);
    }
  }, [isInitialized, processResults]); // Eliminado isAnalyzing para evitar re-init innecesario

  // Start analysis
  const startAnalysis = useCallback(async () => {
    if (!isInitialized) {
      await initialize();
    }
    
    // Reset...
    accumulatorRef.current = {
      shouldersAngles: [],
      headTilts: [],
      spineScores: [],
      eyeContactFrames: 0,
      totalFrames: 0,
      closedFistFrames: 0,
      hiddenHandsFrames: 0,
      handMovements: [],
      lastHandPositions: { left: null, right: null },
    };

    if (cameraRef.current) {
        // En nuestro shim manual, start() inicia el rAF loop
        await cameraRef.current.start();
        setIsAnalyzing(true);
    }
  }, [isInitialized, initialize]);

  // Detener análisis y obtener resultados finales
  const stopAnalysis = useCallback((): PostureMetrics => {
    if (cameraRef.current) {
      cameraRef.current.stop(); // Esto setea cameraRef.current a null
    }
    setIsAnalyzing(false);
    return currentMetrics;
  }, [currentMetrics]);


  // Clean up
  useEffect(() => {
    return () => {
      setIsInitialized(false);
      
      // Detener loop
      if (cameraRef.current && typeof cameraRef.current.stop === 'function') {
          cameraRef.current.stop();
      }
      cameraRef.current = null;

      // Limpiar Holistic
      setTimeout(() => {
          if (holisticRef.current) {
            try {
              holisticRef.current.close();
            } catch (e) { /* ignore */ }
            holisticRef.current = null;
          }
      }, 100);
    };
  }, []);

  return {
    videoRef,
    canvasRef,
    isInitialized,
    isAnalyzing,
    currentMetrics,
    error,
    initialize,
    startAnalysis,
    stopAnalysis,
  };
}
