import React from 'react';
import { Trophy, X, Medal, Timer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { type LeaderboardEntry } from '@store/useLeaderboardStore';

interface ContestEndModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: LeaderboardEntry[];
  contestName: string;
}

const ContestEndModal: React.FC<ContestEndModalProps> = ({ isOpen, onClose, entries, contestName }) => {
  const top3 = entries.slice(0, 3);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-[#2b2d31] w-full max-w-2xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden relative"
          >
            {/* Confetti-like effect background could go here */}
            
            <div className="p-8 text-center">
              <div className="mb-6 inline-flex p-4 bg-amber-500/10 rounded-2xl text-amber-500">
                <Trophy size={48} />
              </div>
              
              <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">Mission Accomplished</h2>
              <p className="text-gray-400 mb-8">{contestName} has come to an end.</p>

              {/* Podium */}
              <div className="grid grid-cols-3 gap-4 items-end mb-12 px-4">
                {/* 2nd Place */}
                {top3[1] && (
                  <div className="space-y-3">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-slate-400/20 border-2 border-slate-400 mx-auto flex items-center justify-center text-xl font-bold text-slate-300">
                        {top3[1].username.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-400 text-[#1e1f22] text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                        2nd
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white truncate">{top3[1].username}</p>
                      <p className="text-xs text-slate-400 font-bold">{top3[1].solvedCount} Solved</p>
                    </div>
                    <div className="h-24 bg-slate-400/10 rounded-t-xl border-t border-x border-slate-400/20" />
                  </div>
                )}

                {/* 1st Place */}
                {top3[0] && (
                  <div className="space-y-3">
                    <div className="relative">
                      <motion.div 
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 3 }}
                        className="w-20 h-20 rounded-full bg-amber-500/20 border-4 border-amber-500 mx-auto flex items-center justify-center text-2xl font-black text-amber-500"
                      >
                        {top3[0].username.slice(0, 2).toUpperCase()}
                      </motion.div>
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-500 text-[#1e1f22] text-xs font-black px-3 py-1 rounded-full uppercase">
                        Winner
                      </div>
                    </div>
                    <div>
                      <p className="text-base font-black text-white truncate">{top3[0].username}</p>
                      <p className="text-sm text-amber-500 font-black">{top3[0].solvedCount} Solved</p>
                    </div>
                    <div className="h-32 bg-amber-500/10 rounded-t-xl border-t border-x border-amber-500/20" />
                  </div>
                )}

                {/* 3rd Place */}
                {top3[2] && (
                  <div className="space-y-3">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-orange-500/20 border-2 border-orange-500 mx-auto flex items-center justify-center text-xl font-bold text-orange-400">
                        {top3[2].username.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-orange-500 text-[#1e1f22] text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                        3rd
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white truncate">{top3[2].username}</p>
                      <p className="text-xs text-orange-400 font-bold">{top3[2].solvedCount} Solved</p>
                    </div>
                    <div className="h-16 bg-orange-500/10 rounded-t-xl border-t border-x border-orange-500/20" />
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={onClose}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-2xl transition-all border border-white/10"
                >
                  View Standings
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 bg-brand hover:bg-brand-hover text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-brand/20"
                >
                  Continue
                </button>
              </div>
            </div>

            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-gray-500 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all"
            >
              <X size={20} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ContestEndModal;
