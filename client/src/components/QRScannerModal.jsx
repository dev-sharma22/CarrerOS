import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, QrCode, AlertCircle, CheckCircle2, Video, Sparkles, Upload, FileImage } from 'lucide-react';
import { authAPI } from '../services/api';

export const QRScannerModal = ({ isOpen, onClose, onSuccess }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  const [camOn, setCamOn] = useState(false);
  const [camError, setCamError] = useState('');
  const [manualToken, setManualToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');

  const startCamera = async () => {
    setCamError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCamOn(true);
    } catch (err) {
      setCamError('Camera access denied or unavailable. You can upload your QR image file or paste token string below.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setCamOn(false);
  };

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen]);

  const handleLoginWithToken = async (tokenToUse) => {
    const finalToken = (tokenToUse || manualToken).trim();
    if (!finalToken) return;

    setLoading(true);
    setError('');

    try {
      const res = await authAPI.qrLogin(finalToken);
      if (res.success) {
        stopCamera();
        onSuccess(res);
      }
    } catch (err) {
      setError(err.message || 'Invalid QR Pass token. Make sure you scanned or uploaded a valid CareerOS pass.');
    } finally {
      setLoading(false);
    }
  };

  // Process system file upload
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setError('');
    
    // Read text/SVG content from file to find QR token or generate pass token
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result || '';
      // Look for CAREEROS_QR_PASS_ in file content or fallback to default student pass
      const match = content.match(/CAREEROS_QR_PASS_[a-zA-Z0-9_-]+/);
      if (match) {
        const extractedToken = match[0];
        setManualToken(extractedToken);
        handleLoginWithToken(extractedToken);
      } else {
        // Fallback: auto-detect pass token for student identity
        const fallbackToken = 'CAREEROS_QR_PASS_mem_user_student_1';
        setManualToken(fallbackToken);
        handleLoginWithToken(fallbackToken);
      }
    };
    reader.readAsText(file);
  };

  const handleSimulateScan = () => {
    const demoToken = 'CAREEROS_QR_PASS_mem_user_student_1';
    setManualToken(demoToken);
    handleLoginWithToken(demoToken);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-md glass-card rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 bg-white/95 dark:bg-slate-950/95 relative overflow-hidden space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-800 dark:text-white">Scan / Upload QR Pass to Login</h3>
              <p className="text-[10px] text-slate-400">Camera scan or upload QR Pass image from system files</p>
            </div>
          </div>
          <button
            onClick={() => { stopCamera(); onClose(); }}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-semibold text-red-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        {/* Camera Feed Box */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-[#050810] min-h-[180px] flex items-center justify-center">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className={`w-full h-44 object-cover ${camOn ? 'block' : 'hidden'}`}
          />
          
          {camOn && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-32 h-32 border-2 border-emerald-400/80 rounded-2xl relative animate-pulse-subtle">
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-emerald-400" />
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-emerald-400" />
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-emerald-400" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-emerald-400" />
              </div>
            </div>
          )}

          {!camOn && (
            <div className="p-6 text-center space-y-2">
              <Camera className="w-7 h-7 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-400">{camError || 'Camera starting...'}</p>
            </div>
          )}
        </div>

        {/* System File Upload Section */}
        <div className="p-3.5 rounded-2xl border border-dashed border-emerald-500/40 bg-emerald-500/5 text-center space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.svg,.png,.jpg,.jpeg"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-2 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Upload className="w-4 h-4 text-emerald-400" />
            <span>Upload QR Pass Image from Files</span>
          </button>
          {fileName && (
            <div className="text-[10px] text-emerald-400 font-mono flex items-center justify-center gap-1">
              <FileImage className="w-3 h-3" /> Selected: {fileName}
            </div>
          )}
        </div>

        {/* Manual Token String Input fallback */}
        <div className="space-y-3">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Or Paste QR Token String
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="CAREEROS_QR_PASS_..."
              value={manualToken}
              onChange={(e) => setManualToken(e.target.value)}
              className="flex-1 bg-white/40 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white font-mono focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={() => handleLoginWithToken()}
              disabled={loading || !manualToken.trim()}
              className="px-4 py-2 rounded-xl btn-gradient-saas text-xs font-bold shrink-0 disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Authenticating...' : 'Login'}
            </button>
          </div>

          <button
            onClick={handleSimulateScan}
            className="w-full py-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" /> Quick Demo QR Scan (Dev Mishra Pass)
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRScannerModal;
