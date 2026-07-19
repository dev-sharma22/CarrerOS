import React, { useEffect, useState } from 'react';
import { Video, HelpCircle } from 'lucide-react';
import { interviewAPI } from '../../services/api';
import Loader from '../../components/Loader';
import InterviewCard from '../../components/InterviewCard';

export const InterviewHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await interviewAPI.getHistory();
        if (res.success) {
          setHistory(res.history);
        }
      } catch (err) {
        console.error('Failed to load past mock history:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) return <Loader fullPage />;

  return (
    <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-transparent text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black">Past Mock Interviews</h1>
          <p className="text-xs text-slate-400 mt-1">Review the overall feedback, question evaluations, and ratings for your previous simulation rounds</p>
        </div>

        {history.length === 0 ? (
          <div className="glass-card rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
            <Video className="w-12 h-12 text-slate-650 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">No Simulation History</h3>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              You haven't run any mock interview sessions yet. Launch the simulator from the workspace sidebar to begin your first round.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {history.map((interview, index) => (
              <InterviewCard key={index} interview={interview} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewHistory;
