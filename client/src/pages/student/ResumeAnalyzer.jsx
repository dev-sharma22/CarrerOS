import React, { useEffect, useState } from 'react';
import { UploadCloud, FileWarning, HelpCircle } from 'lucide-react';
import { resumeAPI } from '../../services/api';
import Loader from '../../components/Loader';
import ResumeCard from '../../components/ResumeCard';
import Button from '../../components/Button';

export const ResumeAnalyzer = () => {
  const [report, setReport] = useState(null);
  const [resumeURL, setResumeURL] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const fetchLatestReport = async () => {
      try {
        const res = await resumeAPI.getAnalysis();
        if (res.success) {
          setReport(res.analysis);
          // Wait, where is the resumeURL?
          // Since the user profile keeps the resume URL or the register returns it, let's fetch profile if needed
          // Or let the backend return the resumeURL inside the resume analyzer endpoint.
          // In our resumeController we returned resumeURL in uploadAndAnalyzeResume.
        }
      } catch (err) {
        console.log('No prior resume scanned:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLatestReport();
  }, []);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      if (selected.type !== 'application/pdf') {
        setError('Only standard PDF format is supported.');
        setFile(null);
        return;
      }
      setError('');
      setFile(selected);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setError('Please select a file to upload first.');

    setError('');
    setSuccessMsg('');
    setUploading(true);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await resumeAPI.analyze(formData);
      if (res.success) {
        setReport(res.analysis);
        setResumeURL(res.resumeURL);
        setSuccessMsg('Resume parsed and optimization parameters synced successfully.');
        setFile(null);
      }
    } catch (err) {
      setError(err.message || 'ATS Scanning failed. Try formatting the PDF.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <Loader fullPage />;

  return (
    <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-transparent text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black">AI Resume Analyzer</h1>
          <p className="text-xs text-slate-400 mt-1">Submit your PDF resume to parse professional skills and audit ATS match parameters</p>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-semibold text-red-400">
            <FileWarning className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 flex items-center gap-2 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-xs font-semibold text-green-400">
            <span>{successMsg}</span>
          </div>
        )}

        {/* Upload Container Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Panel: Dropzone */}
          <div className="glass-card rounded-3xl p-6 h-fit">
            <h3 className="text-sm font-bold text-white mb-4">Upload Resume (PDF)</h3>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-blue-500/40 rounded-2xl p-6 text-center cursor-pointer transition-colors relative bg-white/10 dark:bg-slate-950/20">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <UploadCloud className="w-10 h-10 text-slate-500 mx-auto mb-3" />
                <p className="text-xs font-bold text-slate-300">Drag file here or browse</p>
                <p className="text-[10px] text-slate-500 mt-1">Supported: PDF up to 10MB</p>
              </div>

              {file && (
                <div className="p-3 bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300 truncate max-w-[180px]">{file.name}</span>
                  <span className="text-[10px] text-slate-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={!file}
                loading={uploading}
                className="w-full py-2.5 rounded-xl text-xs font-bold"
              >
                Scan with Gemini AI
              </Button>
            </form>

            <div className="mt-6 p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl text-[10px] text-slate-400 leading-normal flex gap-2">
              <HelpCircle className="w-5 h-5 text-blue-400 shrink-0" />
              <span>
                Our AI parser extracts keywords, checks section headers, and suggests key phrasing to improve your screen success.
              </span>
            </div>
          </div>

          {/* Right Panel: Output Report */}
          <div className="md:col-span-2">
            {report ? (
              <ResumeCard analysis={report} resumeURL={resumeURL || report.resumeURL} />
            ) : (
              <div className="glass-card rounded-3xl p-10 text-center flex flex-col items-center justify-center h-full min-h-[300px]">
                <FileWarning className="w-12 h-12 text-slate-600 mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">No Scanning Report Active</h3>
                <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                  You haven't uploaded or scanned a resume document yet. Complete a scan on the left to review parsed skills and suggestions.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalyzer;
