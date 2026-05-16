import React from 'react';
import type { ContestStatus } from '@types/contest';
import { cn } from '@utils/cn';
import { Clock, Play, CheckCircle2 } from 'lucide-react';

interface ContestStatusBannerProps {
  status: ContestStatus;
}

const ContestStatusBanner: React.FC<ContestStatusBannerProps> = ({ status }) => {
  const config = {
    waiting: {
      label: 'Waiting for Host',
      icon: Clock,
      className: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    },
    active: {
      label: 'Battle in Progress',
      icon: Play,
      className: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 animate-pulse',
    },
    ended: {
      label: 'Contest Ended',
      icon: CheckCircle2,
      className: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
    },
  };

  const { label, icon: Icon, className } = config[status];

  return (
    <div className={cn(
      "flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest",
      className
    )}>
      <Icon className="w-3 h-3" />
      {label}
    </div>
  );
};

export default ContestStatusBanner;
