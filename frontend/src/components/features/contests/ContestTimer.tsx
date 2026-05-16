import React, { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';
import { getServerNow } from '@utils/time';

interface ContestTimerProps {
  startedAt: string | null;
  durationMinutes: number;
  onEnd?: () => void;
  status: 'waiting' | 'active' | 'ended';
}

const ContestTimer: React.FC<ContestTimerProps> = ({ 
  startedAt, 
  durationMinutes, 
  onEnd,
  status 
}) => {
  const [timeLeft, setTimeLeft] = useState<string>('00:00:00');

  useEffect(() => {
    if (status !== 'active' || !startedAt) {
      if (status === 'ended') setTimeLeft('00:00:00');
      else setTimeLeft(`${String(durationMinutes).padStart(2, '0')}:00:00`);
      return;
    }

    const calculateTimeLeft = () => {
      const start = new Date(startedAt).getTime();
      const now = getServerNow();
      const totalDuration = durationMinutes * 60 * 1000;
      const elapsed = now - start;
      const remaining = totalDuration - elapsed;

      if (remaining <= 0) {
        setTimeLeft('00:00:00');
        onEnd?.();
        return false;
      }

      const hours = Math.floor(remaining / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

      setTimeLeft(
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      );
      return true;
    };

    calculateTimeLeft();
    const interval = setInterval(() => {
      if (!calculateTimeLeft()) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startedAt, durationMinutes, status, onEnd]);

  return (
    <div className="flex items-center gap-3 bg-black/20 px-4 py-2 rounded-xl border border-white/5 shadow-inner">
      <Timer className="w-5 h-5 text-indigo-400" />
      <span className="font-mono text-xl font-bold text-white tracking-wider">
        {timeLeft}
      </span>
    </div>
  );
};

export default ContestTimer;
