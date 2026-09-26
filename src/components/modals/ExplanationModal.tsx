'use client';

import React from 'react';
import { useNexus } from '@/lib/store/nexusContext';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Calculator, 
  CheckCircle2, 
  HelpCircle, 
  ShieldCheck, 
  TrendingUp, 
  Zap, 
  Info,
  Clock
} from 'lucide-react';

export const ExplanationModal: React.FC = () => {
  const { isModalOpen, closeModal, simulationResult } = useNexus();

  if (!isModalOpen.explanation) return null;

  return (
    <Modal
      isOpen={isModalOpen.explanation}
      onClose={() => closeModal('explanation')}
      title="Deterministic Simulation Proof & Formulas"
      size="lg"
    >
      <div className="space-y-6 text-sm text-slate-300">
        {/* Intro */}
        <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-900/40 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            Empirical Transparency Standard
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            NEXUS does not generate random or emotional forecasts. All projected completion dates, momentum derivatives, and confidence bounds are computed through verified differential velocity models.
          </p>
        </div>

        {/* Formula 1: Velocity */}
        <div className="space-y-2">
          <h4 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-5 h-5 rounded bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[11px]">1</span>
            Effective Daily Velocity Formula
          </h4>
          <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto">
            V_eff = (H_daily_study + (H_weekly_project / 7)) × C_factor × F_focus
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Where <code className="text-slate-200">C_factor</code> is your historical consistency rate (0.30 to 1.00) and <code className="text-slate-200">F_focus</code> represents the deep work retention coefficient (default 0.90).
          </p>
        </div>

        {/* Formula 2: Projected Days */}
        <div className="space-y-2">
          <h4 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-5 h-5 rounded bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[11px]">2</span>
            Projected Completion Horizon
          </h4>
          <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800 font-mono text-xs text-indigo-300 overflow-x-auto">
            D_projected = ceil( H_remaining / V_eff )
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Remaining hours are divided strictly by your sustained daily rate, generating the exact target arrival date without guesswork.
          </p>
        </div>

        {/* Formula 3: Momentum */}
        <div className="space-y-2">
          <h4 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-5 h-5 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[11px]">3</span>
            Rolling Momentum Vector
          </h4>
          <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto">
            Momentum % = ((V_rolling_7d - V_baseline_28d) / V_baseline_28d) × 100%
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            A positive momentum indicates acceleration over the last week compared to your 4-week average; negative indicates habit decay.
          </p>
        </div>

        {/* Confidence Tier Table */}
        <div className="space-y-2 pt-2">
          <h4 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
            Confidence Rating Classification
          </h4>
          <div className="grid grid-cols-3 gap-2 text-xs font-mono">
            <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-center">
              <span className="text-emerald-400 font-bold block mb-1">HIGH (80%+)</span>
              <span className="text-[10px] text-slate-400">≥21 historical days &amp; ≥80% consistency</span>
            </div>
            <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-center">
              <span className="text-amber-400 font-bold block mb-1">MED (50-79%)</span>
              <span className="text-[10px] text-slate-400">7–20 historical days logged</span>
            </div>
            <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-center">
              <span className="text-rose-400 font-bold block mb-1">LOW (&lt;50%)</span>
              <span className="text-[10px] text-slate-400">&lt;7 days logged (sparse sample)</span>
            </div>
          </div>
        </div>

        {/* Live Values Breakdown */}
        {simulationResult && (
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs">
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Current Live Evaluator State:</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono">
              <div>V_eff: <strong className="text-cyan-400">{(simulationResult.effectiveDailyVelocity ?? simulationResult.calculationExplanation.effectiveDailyVelocity).toFixed(2)}h/d</strong></div>
              <div>Days Req: <strong className="text-white">{simulationResult.projectedDaysTotal ?? simulationResult.calculationExplanation.projectedDaysNeeded}d</strong></div>
              <div>Delta: <strong className="text-amber-400">{(simulationResult.daysVariance ?? simulationResult.daysDifference) > 0 ? `+${simulationResult.daysVariance ?? simulationResult.daysDifference}d` : `${simulationResult.daysVariance ?? simulationResult.daysDifference}d`}</strong></div>
              <div>Confidence: <strong className="text-emerald-400">{(simulationResult.confidenceLevel || simulationResult.confidence).toUpperCase()}</strong></div>
            </div>
          </div>
        )}

        <div className="pt-2 flex justify-end">
          <Button variant="primary" onClick={() => closeModal('explanation')}>
            Understood
          </Button>
        </div>
      </div>
    </Modal>
  );
};
