"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const SmartPiano = dynamic(() => import("@/components/warmup/SmartPiano"), {
    ssr: false,
    loading: () => <div className="fixed inset-0 bg-black flex items-center justify-center text-white">Cargando Piano...</div>
});

export default function MusicalScalePage() {
    const router = useRouter();

    return (
        <SmartPiano 
            isStandalone={true} 
            onClose={() => router.push('/gym')} 
        />
    );
}
