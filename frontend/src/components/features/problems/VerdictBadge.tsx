import React from 'react';
import type { Verdict } from '../../../types/submission';
import { cn } from '@utils/cn';
import { CheckCircle2, XCircle, Clock, AlertTriangle, Zap } from 'lucide-react';

interface VerdictBadgeProps {
  verdict: Verdict;
  className?: string;
  showIcon?: boolean;
}

const VerdictBadge: React.FC<VerdictBadgeProps> = ({ 
  verdict, 
  className, 
  showIcon = true 
}) => {
  const configs = {
    pending: {
      label: 'Pending',
      icon: Clock,
      style: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      animate: 'animate-pulse'
    },
    accepted: {
      label: 'Accepted',
      icon: CheckCircle2,
      style: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      animate: ''
    },
    wrong_answer: {
      label: 'Wrong Answer',
      icon: XCircle,
      style: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      animate: ''
    },
    runtime_error: {
      label: 'Runtime Error',
      icon: AlertTriangle,
      style: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      animate: ''
    },
    time_limit_exceeded: {
      label: 'Time Limit Exceeded',
      icon: Zap,
      style: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
      animate: ''
    },
    rejected: {
      label: 'Rejected',
      icon: XCircle,
      style: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
      animate: ''
    }
  };

  const config = configs[verdict];
  const Icon = config.icon;

  return (
    <div className={cn(
      "flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border",
      config.style,
      config.animate,
      className
    )}>
      {showIcon && <Icon className="w-3 h-3" />}
      {config.label}
    </div>
  );
};

export default VerdictBadge;
