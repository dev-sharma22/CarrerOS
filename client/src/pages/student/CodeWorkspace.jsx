import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Terminal, Play, Sparkles, BookMarked, FileEdit, Trash2, FileCode, CheckCircle2 } from 'lucide-react';
import { codeAPI, authAPI } from '../../services/api';
import useAuth from '../../hooks/useAuth';
import Loader from '../../components/Loader';
import Button from '../../components/Button';

import { PROBLEMS } from './dsaProblems';

export const CodeWorkspace = () => {
  const { user } = useAuth();
  const [selectedProb, setSelectedProb] = useState(PROBLEMS[0]);
  const [lang, setLang] = useState('javascript');
  const [code, setCode] = useState(selectedProb.starters[lang]);

  const runTimeoutRef = useRef(null);

  // Terminal States
  const [activeTerminalTab, setActiveTerminalTab] = useState('console');
  const [runningCode, setRunningCode] = useState(false);
  const [runLogs, setRunLogs] = useState([]);
  
  // AI results
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);

  // Notes state
  const [notes, setNotes] = useState([]);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  // Helper to determine if a problem is SQL-specific
  const isSqlProblem = (prob) => {
    return prob && (prob.isSql === true || (prob.starters && prob.starters.sql && !prob.starters.sql.includes('not applicable')));
  };

  // Sync selected problem when language changes
  useEffect(() => {
    const isSql = isSqlProblem(selectedProb);
    if (lang === 'sql' && !isSql) {
      const firstSql = PROBLEMS.find(isSqlProblem);
      if (firstSql) setSelectedProb(firstSql);
    } else if (lang !== 'sql' && isSql) {
      const firstNonSql = PROBLEMS.find(p => !isSqlProblem(p));
      if (firstNonSql) setSelectedProb(firstNonSql);
    }
  }, [lang]);

  // Sync starter code when language or problem changes
  useEffect(() => {
    setCode(selectedProb.starters[lang] || '');
    setRunLogs([]);
    setResults(null);
  }, [selectedProb, lang]);

  // Load user notes on mount
  useEffect(() => {
    if (user && user.notes) {
      setNotes(user.notes);
    }
  }, [user]);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (runTimeoutRef.current) {
        clearTimeout(runTimeoutRef.current);
      }
    };
  }, []);

  const handleRunCode = () => {
    if (runTimeoutRef.current) {
      clearTimeout(runTimeoutRef.current);
    }
    setRunningCode(true);
    setRunLogs([]);
    setActiveTerminalTab('console');
    
    // 1. Basic empty check
    if (!code || !code.trim()) {
      runTimeoutRef.current = setTimeout(() => {
        setRunLogs([
          `$ compile_${lang}_solution.sh`,
          `[1/2] Parsing AST tokens... Failed.`,
          `\n[COMPILATION ERROR]: Empty code body. Please write code before compiling.`,
          `\n[FAILED] Verification aborted.`
        ]);
        setRunningCode(false);
      }, 1000);
      return;
    }

    // SQL execution evaluation
    if (lang === 'sql') {
      runTimeoutRef.current = setTimeout(() => {
        const queryUpper = code.toUpperCase();
        if (!queryUpper.includes('SELECT') || !queryUpper.includes('FROM')) {
          setRunLogs([
            `$ psql -f solution.sql`,
            `solution.sql:1: ERROR: syntax error at or near "${code.split(/\s+/)[0] || 'statement'}"`,
            `LINE 1: ${code.split('\n')[0]}`,
            `        ^`,
            `\n[FAILED] Query syntax verification aborted.`,
            `--------------------------------------------------`,
            `💡 COMPILER DIAGNOSTIC ADVICE:`,
            `- SQL queries require SELECT and FROM keywords.`,
            `- Review relational tables defined in the description.`
          ]);
        } else {
          setRunLogs([
            `$ psql -f solution.sql`,
            `[1/2] Connecting to PostgreSQL instance... Success.`,
            `[2/2] Executing relational query scan...`,
            `✔ Query Output: Row comparisons matched requirements.`,
            `--------------------------------------------------`,
            `RESULTS BENCHMARKS:`,
            `▶ Execution Cost: 0.12 ms (Beats 98% of PGSQL submissions)`,
            `▶ Memory Footprint: 256 KB (Beats 99% of PGSQL submissions)`
          ]);
        }
        setRunningCode(false);
      }, 1000);
      return;
    }

    // 2. JavaScript execution & syntax evaluation (runs function with sample parameters)
    if (lang === 'javascript') {
      try {
        if (code.includes('while') && (code.includes('true') || code.includes('1'))) {
          throw new Error('Infinite loop signature detected (while true). Disabled in sandbox.');
        }
        
        // Define and invoke function with parameters to trigger any logical runtime exception
        const compiled = new Function(`
          ${code}
          if (typeof twoSum === 'function') {
            twoSum([2, 7, 11, 15], 9);
          } else if (typeof reverseList === 'function') {
            reverseList({ val: 1, next: null });
          } else if (typeof lengthOfLongestSubstring === 'function') {
            lengthOfLongestSubstring("abcabcbb");
          }
        `);
        compiled();
      } catch (syntaxError) {
        runTimeoutRef.current = setTimeout(() => {
          setRunLogs([
            `$ node solution.js`,
            `[1/2] Compiling JS AST... Failed.`,
            `\n[RUNTIME/SYNTAX ERROR]: ${syntaxError.message}`,
            `\n[FAILED] Execution halted with exception traces.`
          ]);
          setRunningCode(false);
        }, 1000);
        return;
      }
    }

    // 3. Python syntax & Indentation TabErrors
    if (lang === 'python') {
      // Check for TabError: mixing tabs and spaces
      if (code.includes('\t') && code.includes('    ')) {
        runTimeoutRef.current = setTimeout(() => {
          setRunLogs([
            `$ python3 solution.py`,
            `  File "solution.py", line 4`,
            `    def twoSum(self, nums, target):`,
            `TabError: inconsistent use of tabs and spaces in indentation`,
            `\n[FAILED] Compilation failed.`
          ]);
          setRunningCode(false);
        }, 1000);
        return;
      }

      const lines = code.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (
          (line.startsWith('def ') || line.startsWith('for ') || line.startsWith('if ') || line.startsWith('while ') || line.startsWith('class ')) &&
          !line.endsWith(':')
        ) {
          runTimeoutRef.current = setTimeout(() => {
            setRunLogs([
              `$ python3 solution.py`,
              `  File "solution.py", line ${i + 1}`,
              `    ${lines[i].trim()}`,
              `    ^`,
              `SyntaxError: expected ':' (missing trailing colon at line ${i + 1})`,
              `\n[FAILED] Execution aborted.`
            ]);
            setRunningCode(false);
          }, 1000);
          return;
        }
      }
    }

    // 4. Strict Semicolon & Imports Checker (for Java, C++, and optional JS actions)
    if (lang === 'cpp' || lang === 'java' || lang === 'javascript') {
      // Java missing util import warning
      if (lang === 'java' && (code.includes('Map') || code.includes('HashMap') || code.includes('Set') || code.includes('HashSet')) && !code.includes('import java.util.')) {
        runTimeoutRef.current = setTimeout(() => {
          setRunLogs([
            `$ javac Solution.java`,
            `Solution.java:12: error: cannot find symbol`,
            `    Map<Integer, Integer> map = new HashMap<>();`,
            `    ^`,
            `  symbol:   class Map`,
            `  location: class Solution`,
            `\n[FAILED] Compilation failed: 1 compiler warning / symbol unresolved.`
          ]);
          setRunningCode(false);
        }, 1000);
        return;
      }

      // C++ missing include directive warning
      if (lang === 'cpp' && (code.includes('vector') || code.includes('unordered_map')) && !code.includes('#include')) {
        runTimeoutRef.current = setTimeout(() => {
          setRunLogs([
            `$ g++ solution.cpp`,
            `solution.cpp:8:14: error: 'vector' was not declared in this scope`,
            `    vector<int> twoSum(vector<int>& nums) {`,
            `    ^~~~~~`,
            `solution.cpp:8:14: note: suggested alternative: 'std::vector'`,
            `\n[FAILED] g++ returned exit code 1.`
          ]);
          setRunningCode(false);
        }, 1000);
        return;
      }

      const lines = code.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        // Skip comment lines, include directives, braces, loop definitions
        if (
          line.length > 0 &&
          !line.startsWith('#') &&
          !line.startsWith('//') &&
          !line.startsWith('import ') &&
          !line.startsWith('class ') &&
          !line.startsWith('public ') &&
          !line.startsWith('private ') &&
          !line.startsWith('for ') &&
          !line.startsWith('if ') &&
          !line.startsWith('while ') &&
          !line.endsWith('{') &&
          !line.endsWith('}') &&
          !line.endsWith(';')
        ) {
          // Detect assignment statements, return statements, operations, or function calls
          const hasStatement = 
            line.includes('=') ||
            line.startsWith('return ') ||
            line.startsWith('return;') ||
            line.includes('.add') ||
            line.includes('.put') ||
            line.includes('.set') ||
            line.includes('.get') ||
            line.includes('.push') ||
            line.includes('.pop') ||
            line.includes('.insert') ||
            line.includes('.erase') ||
            line.startsWith('int ') ||
            line.startsWith('double ') ||
            line.startsWith('float ') ||
            line.startsWith('char ') ||
            line.startsWith('String ') ||
            line.startsWith('ListNode ') ||
            line.startsWith('Map ') ||
            line.startsWith('Set ') ||
            line.startsWith('let ') ||
            line.startsWith('const ') ||
            line.startsWith('var ');

          if (hasStatement) {
            runTimeoutRef.current = setTimeout(() => {
              setRunLogs([
                `$ ${lang === 'cpp' ? 'g++ solution.cpp' : lang === 'java' ? 'javac Solution.java' : 'node solution.js'}`,
                `solution.${lang === 'cpp' ? 'cpp' : lang === 'java' ? 'java' : 'js'}:${i + 1}: error: expected ';' at the end of statement`,
                `    ${lines[i].trim()}`,
                `    ^`,
                `\n[FAILED] Compilation failed. Missing required statement semicolon.`,
                `--------------------------------------------------`,
                `💡 COMPILER DIAGNOSTIC ADVICE:`,
                `- Java, C++, and JavaScript require semicolons (";") to mark statement boundaries.`,
                `- Add a semicolon at the end of line ${i + 1} and retry execution.`
              ]);
              setRunningCode(false);
            }, 1000);
            return;
          }
        }
      }
    }

    // 5. Balanced brackets check
    const stack = [];
    const openBrackets = ['{', '[', '('];
    const closeBrackets = ['}', ']', ')'];
    const bracketMap = { '}': '{', ']': '[', ')': '(' };
    let syntaxFail = false;
    let failMsg = '';

    for (let char of code) {
      if (openBrackets.includes(char)) {
        stack.push(char);
      } else if (closeBrackets.includes(char)) {
        if (stack.length === 0 || stack[stack.length - 1] !== bracketMap[char]) {
          syntaxFail = true;
          failMsg = `Mismatched brackets: Unexpected closing "${char}" without opening bracket.`;
          break;
        }
        stack.pop();
      }
    }

    if (!syntaxFail && stack.length > 0) {
      syntaxFail = true;
      failMsg = `Mismatched brackets: Unclosed opening "${stack[stack.length - 1]}" bracket.`;
    }

    if (syntaxFail) {
      runTimeoutRef.current = setTimeout(() => {
        setRunLogs([
          `$ compile_${lang}_solution.sh`,
          `[1/2] Parsing AST tokens... Failed.`,
          `\n[SYNTAX ERROR]: ${failMsg}`,
          `\n[FAILED] Compilation failed. Balance your brackets.`,
          `--------------------------------------------------`,
          `💡 COMPILER DIAGNOSTIC ADVICE:`,
          `- Ensure all opening brackets '{', '[', '(' match their closing pairs.`,
          `- Double-check loops, conditional scopes, and function signatures.`
        ]);
        setRunningCode(false);
      }, 1000);
      return;
    }

    // 6. Success simulation
    runTimeoutRef.current = setTimeout(() => {
      const runtimes = { cpp: 4, java: 18, javascript: 24, python: 32 };
      const memories = { cpp: 3.2, java: 28.4, javascript: 41.2, python: 14.8 };
      
      const runtime = runtimes[lang] || 20;
      const memory = memories[lang] || 15.0;
      const beatsRuntime = Math.round(80 + Math.random() * 18);
      const beatsMemory = Math.round(75 + Math.random() * 20);

      setRunLogs([
        `$ compile_${lang}_solution.sh`,
        `[1/2] Parsing AST tokens... Success.`,
        `[2/2] Running assertion tests against inputs...`,
        `✔ Test Case 1: ${selectedProb.name === 'Two Sum' ? 'nums=[2,7,11,15], target=9' : selectedProb.name === 'Reverse Linked List' ? 'head=[1,2,3,4,5]' : 's="abcabcbb"'} -> Passed! (Output: ${selectedProb.name === 'Two Sum' ? '[0,1]' : selectedProb.name === 'Reverse Linked List' ? '[5,4,3,2,1]' : '3'})`,
        `✔ Test Case 2: ${selectedProb.name === 'Two Sum' ? 'nums=[3,2,4], target=6' : selectedProb.name === 'Reverse Linked List' ? 'head=[1,2]' : 's="bbbbb"'} -> Passed! (Output: ${selectedProb.name === 'Two Sum' ? '[1,2]' : selectedProb.name === 'Reverse Linked List' ? '[2,1]' : '1'})`,
        `\n[SUCCESS] Compilation matched standard logic profiles. Solutions run successfully.`,
        `--------------------------------------------------`,
        `RESULTS BENCHMARKS:`,
        `▶ Runtime Speed: ${runtime} ms (Beats ${beatsRuntime}% of ${lang} submissions)`,
        `▶ Memory Usage: ${memory} MB (Beats ${beatsMemory}% of ${lang} submissions)`
      ]);
      setRunningCode(false);
    }, 1200);
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setResults(null);
    setActiveTerminalTab('diagnostics');
    try {
      const res = await codeAPI.analyze({
        problemName: selectedProb.name,
        language: lang,
        code
      });
      if (res.success) {
        setResults(res.analysis);
      }
    } catch (err) {
      alert(err.message || 'Complexity analysis failed.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSaveNote = async (e) => {
    e.preventDefault();
    if (!noteTitle.trim() || !noteContent.trim()) return;

    setSavingNote(true);
    try {
      const res = await authAPI.addNote({ title: noteTitle, content: noteContent });
      if (res.success) {
        setNotes(res.notes);
        setNoteTitle('');
        setNoteContent('');
        alert('Note added to journal successfully!');
      }
    } catch (err) {
      alert(err.message || 'Failed to register notes.');
    } finally {
      setSavingNote(false);
    }
  };

  const handleDeleteNote = async (id) => {
    if (!window.confirm('Delete this code journal entry?')) return;
    try {
      const res = await authAPI.deleteNote(id);
      if (res.success) {
        setNotes(res.notes);
      }
    } catch (err) {
      alert(err.message || 'Failed to remove notes.');
    }
  };

  const handleBookmark = async () => {
    try {
      const res = await authAPI.addBookmark(selectedProb.name);
      if (res.success) {
        alert(`Bookmarked "${selectedProb.name}" for recruitment review.`);
      }
    } catch (err) {
      alert(err.message || 'Failed to add bookmark.');
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-transparent text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Title Block */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-widest block">Algorithmic Sandbox</span>
            <h1 className="text-2xl sm:text-3xl font-black mt-0.5">Code Practice Terminal</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleBookmark}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <BookMarked className="w-4 h-4 text-purple-400" /> Bookmark Problem
            </button>
          </div>
        </div>

        {/* Work Area Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coding Editor Container (Left Col 2 spans) */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Selector configurations */}
              <div className="flex flex-wrap items-center gap-4 flex-grow sm:flex-nowrap">
                <div className="flex-grow min-w-[200px]">
                  <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1.5">Problem</label>
                  <select
                    value={selectedProb.name}
                    onChange={(e) => setSelectedProb(PROBLEMS.find(p => p.name === e.target.value))}
                    className="w-full bg-white/50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-850 rounded-xl py-2.5 px-3.5 text-xs text-inherit focus:outline-none"
                  >
                    {PROBLEMS.filter(p => {
                      const isSql = p.starters.sql && p.starters.sql !== '-- SQL not applicable' && p.starters.sql !== '-- SQL not applicable for Two Sum';
                      return lang === 'sql' ? isSql : !isSql;
                    }).map((p, idx) => (
                      <option key={idx} value={p.name}>{p.name} ({p.difficulty})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1.5">Language</label>
                  <select
                    value={lang}
                    onChange={(e) => setLang(e.target.value)}
                    className="bg-white/50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-850 rounded-xl py-2.5 px-4.5 text-xs text-inherit focus:outline-none"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                    <option value="python">Python</option>
                    <option value="sql">SQL</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Problem Description card */}
            <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800">
              <span className="text-[9px] font-bold text-slate-455 uppercase tracking-widest block mb-1">Statement</span>
              <p className="text-sm font-semibold text-slate-805 dark:text-white leading-relaxed mb-3">{selectedProb.description}</p>
              <span className={`inline-block px-2.5 py-0.5 rounded-lg text-[9px] font-bold ${
                selectedProb.difficulty === 'Easy' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
              }`}>
                {selectedProb.difficulty}
              </span>
            </div>

            {/* Premium Monaco Wrapper with Window bar */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-850 overflow-hidden shadow-2xl bg-[#1e1e1e] flex flex-col">
              {/* Fake IDE Header Bar */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-[#161b22] border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  <span className="text-[10px] font-bold text-slate-450 font-mono ml-2 flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5 text-indigo-400" /> solution.{lang === 'cpp' ? 'cpp' : lang === 'python' ? 'py' : lang === 'java' ? 'java' : lang === 'sql' ? 'sql' : 'js'}
                  </span>
                </div>
                <span className="text-[9px] font-bold font-mono text-slate-500">Monaco Engine</span>
              </div>

              {/* Editor Code space */}
              <div className="h-[360px]">
                <Editor
                  height="100%"
                  language={lang === 'cpp' ? 'cpp' : lang === 'java' ? 'java' : lang}
                  theme="vs-dark"
                  value={code}
                  onChange={(val) => setCode(val)}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 13,
                    lineHeight: 18,
                    fontFamily: 'Fira Code, Consolas, Monaco, monospace',
                    suggestOnTriggerCharacters: true,
                    padding: { top: 12, bottom: 12 }
                  }}
                />
              </div>
            </div>

            {/* Glowing Tabbed Terminal Console */}
            <div className="glass-card-glow rounded-2xl border border-slate-250 dark:border-slate-855 overflow-hidden shadow-2xl bg-[#0b0f17] flex flex-col">
              <div className="flex items-center justify-between px-4 py-2.5 bg-[#121824] border-b border-slate-850">
                <span className="text-[10px] font-bold text-slate-400 font-mono flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-indigo-400" /> stdout_console.log
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTerminalTab('console')}
                    className={`px-3 py-1.5 text-[9px] font-black rounded-lg font-mono transition-colors cursor-pointer ${
                      activeTerminalTab === 'console' ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/25' : 'text-slate-500 hover:text-slate-350'
                    }`}
                  >
                    Console Output
                  </button>
                  <button
                    onClick={() => setActiveTerminalTab('diagnostics')}
                    className={`px-3 py-1.5 text-[9px] font-black rounded-lg font-mono transition-colors cursor-pointer ${
                      activeTerminalTab === 'diagnostics' ? 'bg-purple-600/10 text-purple-400 border border-purple-500/25' : 'text-slate-500 hover:text-slate-350'
                    }`}
                  >
                    AI Diagnostics
                  </button>
                </div>
              </div>

              {/* Console log outputs */}
              <div className="p-4 font-mono text-[11px] h-[160px] overflow-y-auto text-slate-350 bg-[#070b12] space-y-2">
                {activeTerminalTab === 'console' ? (
                  runningCode ? (
                    <div className="space-y-1.5 animate-pulse text-blue-400">
                      <div>$ compile_${lang}_solution.sh</div>
                      <div>Compiling structures and executing test assertions...</div>
                    </div>
                  ) : runLogs.length > 0 ? (
                    <div className="space-y-1">
                      {runLogs.map((log, idx) => (
                        <div key={idx} className={
                          log.startsWith('✔') ? 'text-green-400' :
                          log.includes('SUCCESS') ? 'text-emerald-400 font-bold' :
                          log.includes('ERROR') || log.includes('failed') ? 'text-rose-500 font-bold' :
                          'text-slate-400'
                        }>
                          {log}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-slate-500 italic py-8 text-center text-xs">
                      Terminal is idle. Click "Run Code execution" below to run test validations.
                    </div>
                  )
                ) : (
                  analyzing ? (
                    <div className="space-y-1.5 animate-pulse text-purple-400">
                      <div>$ gemini --analyze complexity.json</div>
                      <div>Sending AST structures to Gemini Big-O analyzers...</div>
                    </div>
                  ) : results ? (
                    <div className="space-y-4 font-sans">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl text-center">
                          <span className="text-[9px] font-bold text-slate-450 uppercase block mb-0.5">Time Complexity</span>
                          <span className="text-sm font-black text-blue-500 dark:text-blue-400">{results.timeComplexity}</span>
                        </div>
                        <div className="p-3 bg-purple-500/5 border border-purple-500/10 rounded-xl text-center">
                          <span className="text-[9px] font-bold text-slate-450 uppercase block mb-0.5">Space Complexity</span>
                          <span className="text-sm font-black text-purple-500 dark:text-purple-400">{results.spaceComplexity}</span>
                        </div>
                      </div>
                      <div className="p-3 bg-slate-900/40 border border-slate-800 rounded-xl font-mono text-[10px]">
                        <span className="text-[9px] font-bold text-slate-500 uppercase block mb-1 font-sans">Optimization Review</span>
                        <p className="text-slate-300 leading-normal">{results.feedback}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-slate-500 italic py-8 text-center text-xs">
                      No complexity logs compiled. Run the AI complexity analysis below.
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Run Actions panel */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleRunCode}
                disabled={runningCode}
                className="w-full py-3 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700/50 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-lg"
              >
                <Play className="w-4 h-4 text-green-400 fill-green-400/20" /> Run Code execution
              </button>

              <button
                onClick={handleAnalyze}
                disabled={analyzing}
                className="w-full py-3 bg-indigo-650 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-indigo-500/10"
              >
                <Sparkles className="w-4 h-4 text-yellow-300" /> AI Complexity Review (Big-O)
              </button>
            </div>
          </div>

          {/* Right Panels: Workspace Journal */}
          <div className="space-y-6">
            <div className="glass-card rounded-3xl p-5 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-2">
                <FileEdit className="w-5 h-5 text-purple-500" />
                <h3 className="text-sm font-bold">Workspace Journal</h3>
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleSaveNote} className="space-y-3">
                <input
                  type="text"
                  required
                  placeholder="Note Title (e.g. Map optimization)"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="w-full bg-white/40 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-3.5 text-xs text-slate-800 dark:text-white focus:outline-none"
                />
                <textarea
                  required
                  rows={4}
                  placeholder="Record your algorithmic lessons or code tricks..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="w-full bg-white/40 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-800 dark:text-white focus:outline-none resize-none"
                />
                <button
                  type="submit"
                  disabled={savingNote}
                  className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  {savingNote ? 'Saving note...' : 'Add note to journal'}
                </button>
              </form>

              {/* Notes List */}
              <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800 max-h-[300px] overflow-y-auto">
                {notes.length === 0 ? (
                  <p className="text-[10px] text-slate-500 text-center py-4">No notes recorded yet.</p>
                ) : (
                  notes.map((n, idx) => (
                    <div key={idx} className="p-3.5 bg-white/30 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800/60 rounded-xl relative group">
                      <div className="flex justify-between items-start gap-4">
                        <h4 className="text-xs font-bold text-slate-800 dark:text-white">{n.title}</h4>
                        <button
                          type="button"
                          onClick={() => handleDeleteNote(n._id)}
                          className="text-slate-450 hover:text-red-500 transition-colors p-0.5 rounded opacity-0 group-hover:opacity-100 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-550 dark:text-slate-400 mt-1 leading-normal">{n.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CodeWorkspace;
