import React, { useState, useEffect } from 'react';
import { Trophy, Award, Target, HelpCircle, Star, Search, ShieldCheck } from 'lucide-react';
import { authAPI } from '../../services/api';
import Loader from '../../components/Loader';

export const Leaderboard = () => {
  const [board, setBoard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchLeaderboard = async () => {
    try {
      const res = await authAPI.getLeaderboard();
      if (res.success) {
        setBoard(res.leaderboard);
      }
    } catch (err) {
      console.error('Failed to load scoreboard:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  if (loading) return <Loader fullPage />;

  // Filter based on search query
  const filtered = board.filter(b => b.name.toLowerCase().includes(search.toLowerCase()));

  // Top 3 Podium
  const top1 = board[0] || null;
  const top2 = board[1] || null;
  const top3 = board[2] || null;
  
  // Ranks 4+
  const rest = filtered.slice(3);

  return (
    <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-transparent text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-205 dark:border-slate-850 pb-5">
          <div>
            <span className="text-xs font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-widest block">Gamified Rankings</span>
            <h1 className="text-2xl sm:text-3xl font-black mt-0.5">Competitive Leaderboard</h1>
            <p className="text-xs text-slate-450 mt-1">Audit ranking benchmarks based on total DSA questions solved and AI interview grades.</p>
          </div>
          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-slate-450 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search candidate name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/40 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3.5 pl-9 text-xs focus:outline-none"
            />
          </div>
        </div>

        {/* Podium Layout for Top 3 */}
        {board.length > 0 && !search && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end max-w-4xl mx-auto pt-6 pb-2">
            
            {/* Rank 2 (Left) */}
            {top2 && (
              <div className="order-2 md:order-1 glass-card rounded-3xl p-5 border border-slate-200 dark:border-slate-800 text-center relative flex flex-col justify-between h-[220px] shadow-lg">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-300 text-slate-800 text-[10px] font-black w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center">
                  2
                </div>
                <div className="pt-2">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white truncate">{top2.name}</h3>
                  <span className="text-[9px] font-mono font-bold text-slate-450 uppercase">Silver League</span>
                </div>
                <div className="space-y-1 text-slate-500 text-[11px] font-medium py-3 border-y border-slate-100 dark:border-slate-850 my-2">
                  <div>✔ {top2.solvedCount} DSA Solved</div>
                  <div>★ {top2.avgScore}/10 Avg Score</div>
                </div>
                <div className="text-xs font-black text-indigo-400 font-mono">
                  {top2.totalPoints} PTS
                </div>
              </div>
            )}

            {/* Rank 1 (Center) */}
            {top1 && (
              <div className="order-1 md:order-2 glass-card rounded-3xl p-6 border-2 border-indigo-500/30 text-center relative flex flex-col justify-between h-[250px] shadow-2xl bg-indigo-500/5 dark:bg-indigo-600/5 ring-4 ring-indigo-500/5 select-none">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 text-xs font-black w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center shadow-lg shadow-amber-500/20">
                  <Trophy className="w-5 h-5 fill-current animate-bounce" />
                </div>
                <div className="pt-4">
                  <h3 className="text-base font-black text-slate-900 dark:text-white truncate">{top1.name}</h3>
                  <span className="text-[9px] font-mono font-bold text-amber-500 dark:text-amber-400 uppercase tracking-widest block mt-0.5">Gold Champion</span>
                </div>
                <div className="space-y-1.5 text-slate-500 text-xs font-medium py-3 border-y border-slate-205 dark:border-slate-850 my-2">
                  <div className="font-bold text-slate-800 dark:text-slate-300">✔ {top1.solvedCount} DSA Exercises</div>
                  <div className="font-bold text-slate-800 dark:text-slate-300">★ {top1.avgScore}/10 Interview avg</div>
                </div>
                <div className="text-sm font-black text-amber-450 dark:text-amber-400 font-mono">
                  {top1.totalPoints} POINTS
                </div>
              </div>
            )}

            {/* Rank 3 (Right) */}
            {top3 && (
              <div className="order-3 glass-card rounded-3xl p-5 border border-slate-200 dark:border-slate-800 text-center relative flex flex-col justify-between h-[200px] shadow-lg">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-700 text-white text-[10px] font-black w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center">
                  3
                </div>
                <div className="pt-2">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white truncate">{top3.name}</h3>
                  <span className="text-[9px] font-mono font-bold text-slate-450 uppercase">Bronze League</span>
                </div>
                <div className="space-y-1 text-slate-500 text-[11px] font-medium py-3 border-y border-slate-100 dark:border-slate-850 my-2">
                  <div>✔ {top3.solvedCount} DSA Solved</div>
                  <div>★ {top3.avgScore}/10 Avg Score</div>
                </div>
                <div className="text-xs font-black text-indigo-400 font-mono">
                  {top3.totalPoints} PTS
                </div>
              </div>
            )}

          </div>
        )}

        {/* Board Ranking Table */}
        <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold text-slate-805 dark:text-white">Active Roster Rankings</h3>
            <span className="px-2.5 py-0.5 rounded bg-green-500/10 text-green-500 border border-green-500/20 text-[8px] font-bold flex items-center gap-0.5 uppercase tracking-wider">
              <ShieldCheck className="w-3 h-3" /> Audited
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-850 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Candidate</th>
                  <th className="py-3 px-4 text-center">DSA Solved</th>
                  <th className="py-3 px-4 text-center">Avg Interview</th>
                  <th className="py-3 px-4 text-center">Skills Count</th>
                  <th className="py-3 px-4 text-right">Aggregated Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-xs text-slate-500 italic">
                      No matching candidate rankings found in roster directory.
                    </td>
                  </tr>
                ) : (
                  filtered.map((item, idx) => {
                    const currentRank = idx + 1;
                    return (
                      <tr key={idx} className="hover:bg-slate-100/30 dark:hover:bg-slate-900/10 transition-colors text-xs text-slate-700 dark:text-slate-300">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-500">
                          #{currentRank}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-850 dark:text-white">
                          {item.name}
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono text-slate-500">
                          {item.solvedCount}
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono text-slate-500">
                          {item.avgScore}/10
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono text-slate-500">
                          {item.skillsCount}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-indigo-400">
                          {item.totalPoints} PTS
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Leaderboard;
