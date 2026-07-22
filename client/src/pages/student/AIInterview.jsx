import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  Play, Sparkles, Terminal, ArrowRight, Video, VideoOff,
  Mic, MicOff, Camera, RefreshCw, AlertCircle, CheckCircle2, Clock, Volume2, ToggleLeft, ToggleRight
} from 'lucide-react';
import { interviewAPI } from '../../services/api';
import { INTERVIEW_ROLES, EXPERIENCE_LEVELS, DIFFICULTY_LEVELS } from '../../utils/constants';
import Loader from '../../components/Loader';
import Button from '../../components/Button';

/* ─────────────────────────────────────────────
   WebcamPanel — real getUserMedia video stream
───────────────────────────────────────────── */
const WebcamPanel = ({ active, liveVideoMode }) => {
  const videoRef   = useRef(null);
  const streamRef  = useRef(null);
  const analyserRef = useRef(null);
  const animRef    = useRef(null);

  const [camOn,     setCamOn]     = useState(false);
  const [micOn,     setMicOn]     = useState(true);
  const [camError,  setCamError]  = useState('');
  const [micLevel,  setMicLevel]  = useState(0);
  const [elapsed,   setElapsed]   = useState(0);
  const [pip,       setPip]       = useState(false);

  // ── start stream ──────────────────────────
  const startStream = useCallback(async () => {
    if (!liveVideoMode) return;
    setCamError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCamOn(true);

      // Audio analyser for mic level bar
      const ctx      = new (window.AudioContext || window.webkitAudioContext)();
      const source   = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = { analyser, ctx };

      const buf = new Uint8Array(analyser.frequencyBinCount);
      let lastUpdate = 0;
      const tick = (now) => {
        if (now - lastUpdate > 100) {
          analyser.getByteFrequencyData(buf);
          const avg = buf.reduce((s, v) => s + v, 0) / buf.length;
          setMicLevel(Math.min(100, Math.round((avg / 128) * 100)));
          lastUpdate = now;
        }
        animRef.current = requestAnimationFrame(tick);
      };
      animRef.current = requestAnimationFrame(tick);
    } catch (err) {
      setCamError(
        err.name === 'NotAllowedError'
          ? 'Camera/mic permission denied in browser.'
          : 'Could not access camera device.'
      );
    }
  }, [liveVideoMode]);

  // ── stop stream ───────────────────────────
  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (analyserRef.current) {
      try { analyserRef.current.ctx.close(); } catch (_) {}
      analyserRef.current = null;
    }
    if (animRef.current) cancelAnimationFrame(animRef.current);
    if (videoRef.current) videoRef.current.srcObject = null;
    setCamOn(false);
    setMicLevel(0);
  }, []);

  const toggleCam = () => {
    if (camOn) stopStream();
    else startStream();
  };

  const toggleMic = () => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(t => { t.enabled = micOn ? false : true; });
      setMicOn(prev => !prev);
    }
  };

  const togglePip = async () => {
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        setPip(false);
      } else if (videoRef.current) {
        await videoRef.current.requestPictureInPicture();
        setPip(true);
      }
    } catch (_) {}
  };

  useEffect(() => {
    if (active && liveVideoMode) {
      startStream();
    } else {
      stopStream();
    }
    return () => stopStream();
  }, [active, liveVideoMode, startStream, stopStream]);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setElapsed(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [active]);

  const fmt = s => `${String(Math.floor(s / 60)).padStart(2,'0')}:${String(s % 60).padStart(2,'0')}`;

  if (!liveVideoMode) {
    return (
      <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-[#050810] shadow-xl flex flex-col justify-center items-center p-6 min-h-[220px]">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3">
          <VideoOff className="w-6 h-6" />
        </div>
        <span className="text-xs font-black text-slate-800 dark:text-white">Live Video Mode OFF</span>
        <span className="text-[10px] text-slate-500 dark:text-slate-400 text-center max-w-[170px] mt-1">
          Operating in classic text & voice dictation mode without camera feed.
        </span>
      </div>
    );
  }

  return (
    <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#050810] shadow-2xl flex flex-col min-h-[230px]">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className={`w-full h-full object-cover flex-1 transition-opacity duration-300 ${camOn ? 'opacity-100' : 'opacity-0 absolute'}`}
        style={{ minHeight: '180px' }}
      />

      {!camOn && (
        <div className="flex flex-col items-center justify-center gap-3 flex-1 p-6 min-h-[180px]">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
            <VideoOff className="w-6 h-6 text-slate-500" />
          </div>
          {camError ? (
            <p className="text-[10px] text-rose-500 dark:text-rose-400 text-center max-w-[160px] leading-tight">{camError}</p>
          ) : (
            <p className="text-[10px] text-slate-500 text-center max-w-[160px]">Live Camera stream idle</p>
          )}
        </div>
      )}

      {camOn && (
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-rose-600/90 text-white text-[8px] font-black px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          REC &nbsp;{fmt(elapsed)}
        </div>
      )}

      {pip && (
        <div className="absolute top-3 right-3 bg-indigo-600/80 text-white text-[8px] font-bold px-2 py-0.5 rounded-full">PiP</div>
      )}

      <div className="absolute bottom-10 left-3 right-3">
        <div className="h-1 rounded-full bg-slate-700/60 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-75"
            style={{
              width: `${micLevel}%`,
              background: micLevel > 70 ? '#f87171' : micLevel > 40 ? '#facc15' : '#10b981'
            }}
          />
        </div>
        <span className="text-[8px] text-slate-600 dark:text-slate-400 font-mono mt-0.5 block">{micOn ? `Mic ${micLevel}%` : 'Mic muted'}</span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between gap-2 px-3 py-2 bg-black/60 backdrop-blur-sm">
        <button
          onClick={toggleCam}
          title={camOn ? 'Turn camera off' : 'Turn camera on'}
          className={`p-1.5 rounded-lg border text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
            camOn ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300' : 'bg-slate-800/60 border-slate-700 text-slate-400'
          }`}
        >
          {camOn ? <Video className="w-3.5 h-3.5" /> : <VideoOff className="w-3.5 h-3.5" />}
          {camOn ? 'Cam On' : 'Cam Off'}
        </button>

        <button
          onClick={toggleMic}
          disabled={!camOn}
          title={micOn ? 'Mute mic' : 'Unmute mic'}
          className={`p-1.5 rounded-lg border text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer disabled:opacity-40 ${
            micOn ? 'bg-emerald-600/20 border-emerald-500/30 text-emerald-400' : 'bg-rose-600/20 border-rose-500/30 text-rose-400'
          }`}
        >
          {micOn ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
          {micOn ? 'Mic Active' : 'Muted'}
        </button>

        <button
          onClick={togglePip}
          disabled={!camOn}
          className="p-1.5 rounded-lg border bg-slate-800/60 border-slate-700 text-slate-400 text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer disabled:opacity-40"
        >
          <Camera className="w-3.5 h-3.5" /> PiP
        </button>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   ScoreRing — SVG circular score indicator
───────────────────────────────────────────── */
const ScoreRing = ({ score }) => {
  const r   = 40;
  const circ = 2 * Math.PI * r;
  const pct  = score / 10;
  const col  = score >= 8 ? '#10b981' : score >= 6 ? '#facc15' : '#f87171';
  return (
    <svg width="100" height="100" viewBox="0 0 100 100" className="mx-auto">
      <circle cx="50" cy="50" r={r} fill="none" stroke="#1e293b" strokeWidth="8" />
      <circle
        cx="50" cy="50" r={r} fill="none"
        stroke={col} strokeWidth="8"
        strokeDasharray={circ}
        strokeDashoffset={circ * (1 - pct)}
        strokeLinecap="round"
        transform="rotate(-90 50 50)"
        style={{ transition: 'stroke-dashoffset 1s ease' }}
      />
      <text x="50" y="55" textAnchor="middle" fill={col} fontSize="22" fontWeight="900">{score}</text>
    </svg>
  );
};

/* ─────────────────────────────────────────────
   Main component
───────────────────────────────────────────── */
export const AIInterview = () => {
  const { id } = useParams();

  const [role,            setRole]            = useState(INTERVIEW_ROLES[0]);
  const [experienceLevel, setExperienceLevel] = useState(EXPERIENCE_LEVELS[0]);
  const [difficulty,      setDifficulty]      = useState(DIFFICULTY_LEVELS[0]);
  const [liveVideoMode,   setLiveVideoMode]   = useState(true);

  const [interviewId,     setInterviewId]     = useState('');
  const [questions,       setQuestions]       = useState([]);
  const [currentIdx,      setCurrentIdx]      = useState(0);
  const [answer,          setAnswer]          = useState('');
  const [feedback,        setFeedback]        = useState([]);
  const [isCompleted,     setIsCompleted]     = useState(false);
  const [overallScore,    setOverallScore]    = useState(0);
  const [overallFeedback, setOverallFeedback] = useState('');

  const [loading,    setLoading]    = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [singleEval, setSingleEval] = useState(null);
  const [error,      setError]      = useState('');
  const [isListening, setIsListening] = useState(false);

  // Web Speech API Voice Dictation
  const handleToggleVoiceDictation = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setAnswer(prev => prev ? `${prev} ${transcript}` : transcript);
      };

      recognition.start();
    } catch (_) {
      setIsListening(false);
    }
  };

  useEffect(() => {
    if (id) {
      const load = async () => {
        setLoading(true);
        try {
          const res = await interviewAPI.getById(id);
          if (res.success) {
            const { interview } = res;
            setInterviewId(interview._id);
            setQuestions(interview.questions);
            setFeedback(interview.feedback);
            setOverallScore(interview.score);
            setOverallFeedback(interview.overallFeedback);
            setIsCompleted(true);
          }
        } catch (err) {
          setError(err.message || 'Failed to load interview.');
        } finally {
          setLoading(false);
        }
      };
      load();
    }
  }, [id]);

  const handleStart = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await interviewAPI.start({ role, experienceLevel, difficulty });
      if (res.success) {
        setInterviewId(res.interviewId);
        setQuestions(res.questions);
        setCurrentIdx(0);
        setFeedback([]);
        setAnswer('');
        setIsCompleted(false);
        setSingleEval(null);
      }
    } catch (err) {
      setError(err.message || 'Failed to start interview session.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!answer.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await interviewAPI.submit(interviewId, currentIdx, answer);
      if (res.success) {
        setSingleEval(res.evaluation);
        setFeedback(prev => [...prev, {
          question: questions[currentIdx],
          answer,
          score: res.evaluation.score,
          comments: res.evaluation.comments
        }]);
        if (res.completed) {
          setIsCompleted(true);
          setOverallScore(res.overallScore);
          setOverallFeedback(res.overallFeedback);
        }
      }
    } catch (err) {
      setError(err.message || 'Submission failed. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    setSingleEval(null);
    setAnswer('');
    setCurrentIdx(prev => prev + 1);
  };

  const handleReset = () => {
    setInterviewId(''); setQuestions([]); setCurrentIdx(0);
    setAnswer(''); setFeedback([]); setIsCompleted(false);
    setSingleEval(null); setError('');
  };

  if (loading) return <Loader fullPage />;

  /* ── 1. Setup screen ─────────────────────── */
  if (!interviewId) {
    return (
      <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-transparent text-slate-800 dark:text-slate-100">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <span className="text-xs font-black text-emerald-500 uppercase tracking-widest block">AI Evaluation Engine</span>
              <h1 className="text-2xl sm:text-3xl font-black mt-0.5">Mock Interview Simulator</h1>
            </div>

            {/* Live Video Mode ON/OFF Toggle */}
            <button
              onClick={() => setLiveVideoMode(!liveVideoMode)}
              className={`px-4 py-2 rounded-2xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                liveVideoMode
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                  : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500'
              }`}
            >
              {liveVideoMode ? <ToggleRight className="w-5 h-5 text-emerald-400" /> : <ToggleLeft className="w-5 h-5 text-slate-400" />}
              <span>Live Video: {liveVideoMode ? 'ON' : 'OFF'}</span>
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-semibold text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />{error}
            </div>
          )}

          <div className="glass-card rounded-3xl p-6 sm:p-8 relative overflow-hidden mb-6 border border-slate-200 dark:border-slate-800">
            <form onSubmit={handleStart} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Target Job Role</label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 px-4 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500"
                >
                  {INTERVIEW_ROLES.map((r, i) => <option key={i} value={r}>{r}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Experience Level</label>
                <select
                  value={experienceLevel}
                  onChange={e => setExperienceLevel(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 px-4 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500"
                >
                  {EXPERIENCE_LEVELS.map((exp, i) => <option key={i} value={exp}>{exp}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Difficulty</label>
                <div className="grid grid-cols-3 gap-2">
                  {DIFFICULTY_LEVELS.map((d, i) => (
                    <button key={i} type="button" onClick={() => setDifficulty(d)}
                      className={`py-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        difficulty === d
                          ? 'btn-gradient-saas text-white shadow-md'
                          : 'bg-white/50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >{d}</button>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full py-4 rounded-2xl btn-gradient-saas flex items-center justify-center gap-2 text-sm">
                <Play className="w-4 h-4 fill-current" /> Begin Mock Interview
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  /* ── 2. Completed report ──────────────────── */
  if (isCompleted) {
    return (
      <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-transparent text-slate-800 dark:text-slate-100">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-2xl sm:text-3xl font-black flex items-center justify-center gap-2 text-slate-800 dark:text-white">
              <Sparkles className="w-8 h-8 text-amber-400 animate-pulse" /> Interview Report
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">AI-powered evaluation of your technical performance</p>
          </div>

          <div className="glass-card rounded-3xl p-8 mb-8 text-center relative overflow-hidden border border-slate-200 dark:border-slate-800">
            <ScoreRing score={overallScore} />
            <h3 className="text-base font-bold mt-2 text-slate-800 dark:text-white">Overall Assessment</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl mx-auto mt-2">{overallFeedback}</p>
          </div>

          <h3 className="text-base font-bold mb-4 text-slate-800 dark:text-white">Question Breakdown</h3>
          <div className="space-y-5 mb-8">
            {feedback.map((item, idx) => (
              <div key={idx} className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800">
                <div className="flex justify-between items-center gap-4 mb-3">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Q{idx + 1}</span>
                  <span className={`px-2.5 py-0.5 text-xs font-bold rounded-lg border ${
                    item.score >= 8 ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                    item.score >= 6 ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                    'bg-red-500/10 text-red-500 border-red-500/20'
                  }`}>{item.score}/10</span>
                </div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-3">"{item.question}"</h4>
                <div className="p-3.5 bg-slate-100 dark:bg-slate-950/40 rounded-xl border border-slate-200 dark:border-slate-800 mb-2">
                  <div className="text-[9px] font-bold text-slate-500 uppercase mb-1">Your Answer</div>
                  <p className="text-xs text-slate-700 dark:text-slate-300">{item.answer || '(No response)'}</p>
                </div>
                <div className="p-3.5 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                  <div className="text-[9px] font-bold text-emerald-500 uppercase mb-1">AI Feedback</div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">{item.comments}</p>
                </div>
              </div>
            ))}
          </div>

          <Button onClick={handleReset} className="w-full py-3 rounded-xl btn-gradient-saas flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4" /> Start New Session
          </Button>
        </div>
      </div>
    );
  }

  /* ── 3. Active interview screen ───────────── */
  const progress = ((currentIdx) / questions.length) * 100;

  return (
    <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-transparent text-slate-800 dark:text-slate-100">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-5">
          <div>
            <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">{role}</span>
            <h1 className="text-xl font-black mt-0.5 text-slate-800 dark:text-white">Live Interview Session</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLiveVideoMode(!liveVideoMode)}
              className="px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              {liveVideoMode ? <ToggleRight className="w-4 h-4 text-emerald-500" /> : <ToggleLeft className="w-4 h-4 text-slate-400" />}
              <span>Video: {liveVideoMode ? 'ON' : 'OFF'}</span>
            </button>
            <span className="text-xs font-bold bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-3 py-1.5 rounded-xl">
              Q {currentIdx + 1} / {questions.length}
            </span>
          </div>
        </div>

        <div className="h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mb-6 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {error && (
          <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-semibold text-red-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />{error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          <div className="md:col-span-2">
            <div className="glass-card-glow rounded-3xl p-6 border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 h-full flex flex-col justify-between min-h-[220px]">
              <div>
                <div className="flex items-center gap-2 mb-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <Terminal className="w-4 h-4 text-emerald-400" /> Technical Question
                </div>
                <h2 className="text-base sm:text-lg font-bold leading-relaxed text-slate-800 dark:text-white">
                  "{questions[currentIdx]}"
                </h2>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                  💡 STAR Framework: State Scenario → Technical Action → Metrics Result
                </p>
              </div>
            </div>
          </div>

          <div className="md:col-span-1">
            <WebcamPanel active={true} liveVideoMode={liveVideoMode} />
          </div>
        </div>

        <form onSubmit={handleSubmitAnswer} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Your Answer
              </label>

              {/* Web Speech API Voice Dictation Button */}
              <button
                type="button"
                onClick={handleToggleVoiceDictation}
                className={`px-3 py-1 rounded-xl border text-[10px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isListening
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-400 animate-pulse'
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 dark:text-emerald-400'
                }`}
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{isListening ? 'Listening (Speak now)...' : 'Dictate with Voice'}</span>
              </button>
            </div>

            <textarea
              required
              rows={6}
              disabled={singleEval !== null}
              placeholder="Structure your answer with technical terminology. Speak using voice dictation or type your response..."
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              className="w-full bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-xs sm:text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors resize-y font-mono"
            />
          </div>

          {singleEval ? (
            <div className="space-y-4">
              <div className="p-5 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">AI Evaluation</h4>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-lg text-xs font-extrabold border ${
                    singleEval.score >= 8 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    singleEval.score >= 6 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                    'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}>Score: {singleEval.score}/10</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{singleEval.comments}</p>
              </div>
              <Button onClick={handleNext} className="w-full py-3 rounded-xl btn-gradient-saas flex items-center justify-center gap-2">
                Next Question <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Button
              type="submit"
              loading={submitting}
              disabled={!answer.trim()}
              className="w-full py-3.5 rounded-xl btn-gradient-saas flex items-center justify-center gap-2"
            >
              Submit Answer for Assessment
            </Button>
          )}
        </form>
      </div>
    </div>
  );
};

export default AIInterview;
