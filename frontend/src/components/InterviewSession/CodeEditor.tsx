import React, { useState, useCallback } from 'react'
import Editor from '@monaco-editor/react'
import { Play, RotateCcw, ChevronDown, ChevronUp, Check, X, Terminal, Loader2, FileCode } from 'lucide-react'
import { Language, Problem } from '../../types'

interface CodeEditorProps {
  language: Language
  problem: Problem
  code: string
  onCodeChange: (code: string) => void
  onRun: () => void
}

function getMonacoLanguage(lang: Language): string {
  const map: Record<Language, string> = { javascript: 'javascript', typescript: 'typescript', python: 'python', java: 'java', cpp: 'cpp', go: 'go', rust: 'rust' }
  return map[lang]
}

function getFileName(lang: Language): string {
  const map: Record<Language, string> = { javascript: 'solution.js', typescript: 'solution.ts', python: 'solution.py', java: 'Solution.java', cpp: 'solution.cpp', go: 'solution.go', rust: 'solution.rs' }
  return map[lang]
}

interface TestCase { input: string; expectedOutput: string; passed: boolean | null; actualOutput?: string }

function generateTestCases(problem: Problem, codeLength: number): TestCase[] {
  const passing = codeLength > 200
  return problem.examples.slice(0, 3).map((ex, i) => ({
    input: ex.input, expectedOutput: ex.output,
    passed: passing || i === 0,
    actualOutput: passing || i === 0 ? ex.output : 'Error: unexpected output',
  }))
}

export default function CodeEditor({ language, problem, code, onCodeChange, onRun }: CodeEditorProps) {
  const [consoleOpen, setConsoleOpen] = useState(false)
  const [running, setRunning] = useState(false)
  const [testResults, setTestResults] = useState<TestCase[] | null>(null)

  const handleRun = useCallback(() => {
    setRunning(true); setConsoleOpen(true); setTestResults(null)
    setTimeout(() => {
      setTestResults(generateTestCases(problem, code.trim().length))
      setRunning(false); onRun()
    }, 1500)
  }, [problem, code, onRun])

  const handleReset = useCallback(() => {
    onCodeChange(problem.starterCode[language]); setTestResults(null)
  }, [problem, language, onCodeChange])

  const passCount = testResults ? testResults.filter(t => t.passed).length : 0

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--bg-primary)' }}>
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 h-10 flex-shrink-0" style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-secondary)' }}>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-secondary)' }}>
          <FileCode className="w-3 h-3" style={{ color: 'var(--accent-blue)' }} />
          <span className="font-mono text-[11px] font-medium" style={{ color: 'var(--text-secondary)' }}>{getFileName(language)}</span>
        </div>
        <span className="text-[10px] font-mono uppercase" style={{ color: 'var(--text-quaternary)' }}>{language}</span>

        <div className="flex-1" />

        <button onClick={handleReset} className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors duration-150"
          style={{ color: 'var(--text-tertiary)', border: '1px solid var(--border-secondary)' }}>
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
        <button onClick={handleRun} disabled={running}
          className="flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-semibold text-white transition-all duration-150 disabled:opacity-50"
          style={{ background: 'var(--accent-blue)' }}>
          {running ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3 fill-current" />}
          {running ? 'Running...' : 'Run Code'}
        </button>
      </div>

      {/* Editor */}
      <div className="flex-1 min-h-0">
        <Editor height="100%" language={getMonacoLanguage(language)} value={code}
          onChange={(val) => onCodeChange(val || '')} theme="light"
          options={{
            fontSize: 13, fontFamily: "'JetBrains Mono', monospace", minimap: { enabled: false },
            lineNumbers: 'on', scrollBeyondLastLine: false, wordWrap: 'on',
            padding: { top: 12, bottom: 12 }, automaticLayout: true,
            renderLineHighlight: 'gutter', cursorBlinking: 'smooth', smoothScrolling: true,
            tabSize: 2, insertSpaces: true, folding: true,
            bracketPairColorization: { enabled: true }, lineNumbersMinChars: 3,
            glyphMargin: false, overviewRulerBorder: false, overviewRulerLanes: 0,
            scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 },
          }}
        />
      </div>

      {/* Console */}
      <div className="flex-shrink-0" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-secondary)' }}>
        <button onClick={() => setConsoleOpen(!consoleOpen)}
          className="w-full flex items-center gap-2 px-3 py-2 text-[11px] font-medium transition-colors duration-150"
          style={{ color: 'var(--text-tertiary)' }}>
          <Terminal className="w-3 h-3" /> Output
          {testResults && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold" style={{
              background: passCount === testResults.length ? 'rgba(9,105,218,0.1)' : 'rgba(188,76,0,0.1)',
              color: passCount === testResults.length ? 'var(--accent-blue)' : 'var(--accent-orange)',
            }}>{passCount}/{testResults.length}</span>
          )}
          <span className="ml-auto">{consoleOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}</span>
        </button>
        {consoleOpen && (
          <div className="px-3 pb-3 max-h-[160px] overflow-y-auto">
            {running ? (
              <div className="flex items-center gap-2 py-2 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                <Loader2 className="w-3 h-3 animate-spin" /> Running test cases...
              </div>
            ) : testResults ? (
              <div className="space-y-1.5">
                {testResults.map((tc, i) => (
                  <div key={i} className="rounded-md p-2 text-[11px]" style={{
                    background: tc.passed ? 'rgba(9,105,218,0.04)' : 'rgba(188,76,0,0.04)',
                    border: `1px solid ${tc.passed ? 'rgba(9,105,218,0.15)' : 'rgba(188,76,0,0.15)'}`,
                  }}>
                    <div className="flex items-center gap-1.5 mb-1">
                      {tc.passed ? <Check className="w-3 h-3" style={{ color: 'var(--accent-blue)' }} /> : <X className="w-3 h-3" style={{ color: 'var(--accent-orange)' }} />}
                      <span style={{ color: tc.passed ? 'var(--accent-blue)' : 'var(--accent-orange)', fontWeight: 600 }}>
                        Test {i + 1} — {tc.passed ? 'Passed' : 'Failed'}
                      </span>
                    </div>
                    <div className="font-mono text-[10px] space-y-0.5 ml-[18px]" style={{ color: 'var(--text-tertiary)' }}>
                      <div>Input: <span style={{ color: 'var(--text-secondary)' }}>{tc.input}</span></div>
                      <div>Expected: <span style={{ color: 'var(--accent-blue)', opacity: 0.7 }}>{tc.expectedOutput}</span></div>
                      {!tc.passed && tc.actualOutput && <div>Got: <span style={{ color: 'var(--accent-orange)', opacity: 0.7 }}>{tc.actualOutput}</span></div>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] py-1" style={{ color: 'var(--text-quaternary)' }}>Run code to see results</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
