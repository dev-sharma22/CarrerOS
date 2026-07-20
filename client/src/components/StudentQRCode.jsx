import React from 'react';
import { Sparkles, QrCode, Download, Image as ImageIcon, FileCode } from 'lucide-react';
import { generateQRSvgPath } from '../utils/qrGenerator';

export const StudentQRCode = ({ qrToken, userName, userEmail }) => {
  const token = qrToken || `CAREEROS_QR_PASS_STUDENT_IDENTITY`;
  const { viewBox, svgContent } = generateQRSvgPath(token);

  const handleDownloadPNG = () => {
    const svgElement = document.getElementById('student-qr-pass-svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const URL = window.URL || window.webkitURL || window;
    const blobURL = URL.createObjectURL(svgBlob);

    img.onload = () => {
      canvas.width = 600;
      canvas.height = 600;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 30, 30, 540, 540);

      const pngURL = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngURL;
      downloadLink.download = `CareerOS_Pass_${(userName || 'Student').replace(/\s+/g, '_')}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(blobURL);
    };

    img.src = blobURL;
  };

  const handleDownloadSVG = () => {
    const svgElement = document.getElementById('student-qr-pass-svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const URL = window.URL || window.webkitURL || window;
    const blobURL = URL.createObjectURL(svgBlob);

    const downloadLink = document.createElement('a');
    downloadLink.href = blobURL;
    downloadLink.download = `CareerOS_Pass_${(userName || 'Student').replace(/\s+/g, '_')}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(blobURL);
  };

  return (
    <div className="glass-card-glow rounded-3xl p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/90 text-center relative overflow-hidden flex flex-col items-center shadow-xl">
      {/* Top Header Badge */}
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-500 dark:text-emerald-400 mb-4">
        <Sparkles className="w-3 h-3 animate-pulse" /> CareerOS Digital Student Pass
      </div>

      {/* SVG QR Code Box (Instant 0ms client-side render) */}
      <div className="p-3 bg-white rounded-2xl shadow-xl border-2 border-emerald-500/40 mb-4 group hover:scale-105 transition-transform cursor-pointer">
        <svg
          id="student-qr-pass-svg"
          viewBox={viewBox}
          className="w-40 h-40"
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      </div>

      {/* User Information */}
      <h3 className="text-sm font-black text-slate-800 dark:text-white">{userName || 'CareerOS Student Pass'}</h3>
      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">{userEmail || 'devmishraa22@gmail.com'}</p>

      {/* Token preview */}
      <div className="mt-3 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-[9px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 max-w-full truncate">
        <QrCode className="w-3 h-3 shrink-0" />
        <span className="truncate">{token}</span>
      </div>

      {/* Dual Download Actions (PNG Image & SVG Vector) */}
      <div className="mt-4 grid grid-cols-2 gap-2 w-full">
        <button
          onClick={handleDownloadPNG}
          className="py-2.5 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-[10px] font-bold text-emerald-400 flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-emerald-500/5"
          title="Download high-resolution PNG image"
        >
          <ImageIcon className="w-3.5 h-3.5" /> Download PNG
        </button>

        <button
          onClick={handleDownloadSVG}
          className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          title="Download scalable SVG vector file"
        >
          <FileCode className="w-3.5 h-3.5 text-indigo-400" /> Download SVG
        </button>
      </div>
    </div>
  );
};

export default StudentQRCode;
