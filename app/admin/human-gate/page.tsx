"use client";

import { useState } from 'react';

// Mock Proposal Type
interface Proposal {
  id: string;
  metric: string;
  current_value: string;
  proposed_value: string;
  justification: {
    boundary_evidence: string;
    risk_assessment: string;
  };
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export default function HumanGateUI() {
  // In real app, fetch from /api/admin/proposals
  const [proposals, setProposals] = useState<Proposal[]>([
    {
      id: "prop_123",
      metric: "wpm",
      current_value: "[110, 150]",
      proposed_value: "[110, 155]",
      justification: {
        boundary_evidence: "Found 42 successful samples in range 150-155.",
        risk_assessment: "Low risk. 155 is still executive standard."
      },
      status: 'PENDING'
    }
  ]);

  const handleDecision = (id: string, decision: 'APPROVED' | 'REJECTED') => {
      // API Call here to backend HumanGate
      console.log(`Decision for ${id}: ${decision}`);
      setProposals(prev => prev.map(p => p.id === id ? { ...p, status: decision } : p));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 font-sans">
      <header className="mb-8 border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-slate-100">🛡️ ADS Human Gate</h1>
        <p className="text-slate-500 text-sm">Validación humana obligatoria para cambios de umbral.</p>
      </header>

      <div className="grid gap-6">
        {proposals.map(proposal => (
          <div key={proposal.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
            
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
               <div>
                  <span className="text-xs font-mono text-slate-500 uppercase">Proposal ID: {proposal.id}</span>
                  <h2 className="text-lg font-bold mt-1 text-white">
                    Ajuste de Métrica: <span className="text-blue-400">{proposal.metric.toUpperCase()}</span>
                  </h2>
               </div>
               <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                   proposal.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500' :
                   proposal.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-500' :
                   'bg-red-500/10 text-red-500'
               }`}>
                   {proposal.status}
               </div>
            </div>

            {/* Comparison */}
            <div className="grid grid-cols-2 gap-4 mb-6 bg-slate-950/50 p-4 rounded-lg border border-white/5">
                <div>
                    <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Valor Actual</span>
                    <div className="font-mono text-xl text-slate-300 mt-1">{proposal.current_value}</div>
                </div>
                <div className="border-l border-white/10 pl-4">
                    <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Valor Propuesto</span>
                    <div className="font-mono text-xl text-emerald-400 mt-1">{proposal.proposed_value}</div>
                </div>
            </div>

            {/* Evidence */}
            <div className="space-y-3 mb-6">
                <div className="flex gap-3 items-start">
                    <span className="text-lg">📊</span>
                    <div>
                        <h4 className="text-sm font-bold text-slate-300">Evidencia de Límite</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">{proposal.justification.boundary_evidence}</p>
                    </div>
                </div>
                <div className="flex gap-3 items-start">
                    <span className="text-lg">⚖️</span>
                    <div>
                        <h4 className="text-sm font-bold text-slate-300">Evaluación de Riesgo</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">{proposal.justification.risk_assessment}</p>
                    </div>
                </div>
            </div>

            {/* Actions */}
            {proposal.status === 'PENDING' && (
                <div className="flex gap-3 pt-4 border-t border-white/5">
                    <button 
                        onClick={() => handleDecision(proposal.id, 'APPROVED')}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-lg text-sm font-bold transition-colors"
                    >
                        APROBAR CAMBIO
                    </button>
                    <button 
                        onClick={() => handleDecision(proposal.id, 'REJECTED')}
                        className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-lg text-sm font-bold transition-colors"
                    >
                        RECHAZAR
                    </button>
                </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
