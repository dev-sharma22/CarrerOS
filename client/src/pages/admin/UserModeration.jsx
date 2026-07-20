import React, { useEffect, useState } from 'react';
import { Trash2, AlertTriangle, ShieldCheck, Mail } from 'lucide-react';
import { adminAPI } from '../../services/api';
import Loader from '../../components/Loader';

export const UserModeration = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadUsers = async () => {
    try {
      const res = await adminAPI.getUsers();
      if (res.success) {
        setUsers(res.users);
      }
    } catch (err) {
      setError(err.message || 'Failed to retrieve registered accounts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDeleteUser = async (id, name, role) => {
    if (role === 'admin') {
      return alert('Administrator accounts cannot be deleted.');
    }

    if (!window.confirm(`Are you sure you want to permanently delete user account: "${name}"? This action removes all linked resume uploads and mock interview records.`)) {
      return;
    }

    try {
      const res = await adminAPI.deleteUser(id);
      if (res.success) {
        setUsers(users.filter(u => u._id !== id));
      }
    } catch (err) {
      alert(err.message || 'Failed to remove user account.');
    }
  };

  if (loading) return <Loader fullPage />;

  return (
    <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-transparent text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">User Account Moderation</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Audit active candidate credentials, recruiter profiles, and delete inactive profiles</p>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-semibold text-red-500 dark:text-red-400">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* User Table container */}
        <div className="glass-card rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900/60 text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Email Address</th>
                  <th className="py-4 px-6">Role</th>
                  <th className="py-4 px-6">Joined Date</th>
                  <th className="py-4 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs text-slate-700 dark:text-slate-300">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-500 font-medium">
                      No registered user accounts found.
                    </td>
                  </tr>
                ) : (
                  users.map((u, idx) => {
                    const joined = new Date(u.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    });

                    const getRoleBadge = (role) => {
                      if (role === 'admin') return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';
                      if (role === 'recruiter') return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
                      return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
                    };

                    return (
                      <tr key={idx} className="hover:bg-slate-100/50 dark:hover:bg-slate-900/40 transition-colors">
                        <td className="py-4.5 px-6 font-bold text-slate-900 dark:text-white">{u.name}</td>
                        <td className="py-4.5 px-6 font-medium text-slate-700 dark:text-slate-300">
                          <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" /> {u.email}</span>
                        </td>
                        <td className="py-4.5 px-6">
                          <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold border capitalize ${getRoleBadge(u.role)}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-4.5 px-6 text-slate-500 dark:text-slate-400 font-mono text-[11px]">{joined}</td>
                        <td className="py-4.5 px-6 text-center">
                          {u.role === 'admin' ? (
                            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
                              <ShieldCheck className="w-4 h-4 text-emerald-500" /> Protected
                            </span>
                          ) : (
                            <button
                              onClick={() => handleDeleteUser(u._id, u.name, u.role)}
                              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-colors inline-flex cursor-pointer"
                              title="Delete Account"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
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

export default UserModeration;
