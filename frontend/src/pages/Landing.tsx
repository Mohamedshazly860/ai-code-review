import { Link } from 'react-router-dom'
import Navbar from '../components/ui/Navbar'

const LANGUAGES = ['Python', 'JavaScript', 'TypeScript', 'Go', 'Rust', 'Java', 'C++', 'SQL', 'Bash']

const FEATURES = [
  {
    color: 'bg-[#569CD6]/10',
    iconColor: '#569CD6',
    title: 'Structured Issues',
    desc: 'Every issue comes with severity, line number, and a clear description of what\'s wrong.',
    icon: <path d="M2 4h12M2 8h8M2 12h10" stroke="#569CD6" strokeWidth="1.5" strokeLinecap="round" />,
  },
  {
    color: 'bg-[#6A9955]/10',
    iconColor: '#6A9955',
    title: 'Actionable Suggestions',
    desc: 'Get concrete improvement suggestions with code examples, not vague recommendations.',
    icon: <path d="M3 8l3 3 7-7" stroke="#6A9955" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />,
  },
  {
    color: 'bg-[#F44747]/10',
    iconColor: '#F44747',
    title: 'Security Detection',
    desc: 'Identify injection risks and vulnerabilities before they reach production.',
    icon: <><path d="M8 2v7M8 13v1" stroke="#F44747" strokeWidth="1.5" strokeLinecap="round" /><circle cx="8" cy="8" r="6" stroke="#F44747" strokeWidth="1.5" /></>,
  },
  {
    color: 'bg-[#D7BA7D]/10',
    iconColor: '#D7BA7D',
    title: 'Quality Score',
    desc: 'Receive an objective 0–100 score with a breakdown of what\'s dragging it down.',
    icon: <><circle cx="8" cy="8" r="6" stroke="#D7BA7D" strokeWidth="1.5" /><path d="M8 5v3l2 2" stroke="#D7BA7D" strokeWidth="1.5" strokeLinecap="round" /></>,
  },
]

const STEPS = [
  {
    num: '01 /',
    title: 'Submit your code',
    desc: 'Paste your code snippet, select the language, and optionally describe what you want reviewed. Monaco editor provides a native IDE feel.',
  },
  {
    num: '02 /',
    title: 'AI analyzes it',
    desc: 'Your code is sent to Llama 3.3 70B via Groq for ultra-fast inference. The review runs in the background — no waiting.',
  },
  {
    num: '03 /',
    title: 'Get structured feedback',
    desc: 'Issues ranked by severity, suggestions with examples, and a quality score. Stored so you can revisit anytime.',
  },
]

export default function Landing() {
  return (
    <div className="bg-[#1E1E1E] min-h-screen text-[#D4D4D4] gap-12 flex flex-col">

      {/* Navbar */}
      <Navbar />

      {/* Hero */}
      <div className="w-full flex justify-center">
        <div className="grid grid-cols-2 gap-12 items-center w-full max-w-[1400px] px-12 py-12">

        {/* Left */}
        <div className='flex flex-col gap-3'>
          <div className="inline-flex gap-4 px-3.5 py-1 rounded-full border border-[#3C3C3C] bg-[#252526] text-xs text-[#A6A6A6] mb-4 font-mono w-70 h-6 items-center">
            <span className="w-4 h-4 rounded-full bg-[#6A9955] inline-block" />
            Powered by Groq · Llama 3.3 70B
          </div>

          <h1 className="text-5xl font-extrabold leading-[1.2] tracking-tight mb-3 text-[#D4D4D4]">
            AI-powered code review<br />
            <span className="text-[#569CD6]">in seconds</span>
          </h1>

          <p className="text-md text-[#A6A6A6] leading-relaxed mb-6 max-w-[420px]">
            Submit your code, get structured feedback — issues, suggestions, and a quality score.
            Built for developers who ship clean code.
          </p>

          <div className="flex gap-5 mb-6">
            <Link
              to="/register"
              className="inline-flex items-center px-5 py-2 rounded-3xl text-sm font-bold no-underline transition-colors bg-[#569CD6] text-[#1E1E1E] hover:bg-[#4A90D9] w-32 h-12 items-center justify-center "
            >
              Start reviewing
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-3xl text-sm border no-underline transition-colors bg-[#252526] text-[#D4D4D4] border-[#3C3C3C] hover:border-[#454545] w-32 h-12 items-center justify-center "
            >
              Sign in
            </Link>
          </div>

          <div className="flex flex-wrap gap-3">
            {LANGUAGES.map(lang => (
              <span key={lang} className="rounded-sm text-sm font-mono px-2 py-0.5 bg-[#2D2D2D] border border-[#3C3C3C] text-[#A6A6A6] w-fit h-6 flex items-center justify-center ">
                {lang}
              </span>
            ))}
          </div>
        </div>

        {/* Right — Code Card */}
        <div className="flex flex-col bg-[#252526] border border-[#3C3C3C] rounded-xl overflow-hidden max-h-[400px] gap-6 ">

          {/* Title bar */}
          <div className="bg-[#2D2D2D] border-b border-[#3C3C3C] px-4 py-2.5 flex items-center gap-2 h-7" style={{ paddingLeft: '5px' }}>
            <div className="flex gap-1">
              <span className="w-[11px] h-[11px] rounded-full bg-[#F44747]" />
              <span className="w-[11px] h-[11px] rounded-full bg-[#D7BA7D]" />
              <span className="w-[11px] h-[11px] rounded-full bg-[#6A9955]" />
            </div>
            <span className="bg-[#1E1E1E] border border-[#3C3C3C] border-b-0 px-4 py-1 text-xs text-[#D4D4D4] font-mono rounded-t ml-3">
              divide.py
            </span>
          </div>

          {/* Code */}
          <div className="px-6 py-5 font-mono text-[13px] leading-[1.8]">
            <div>
              <span className="text-[#4A4A4A] mr-5 inline-block w-4 text-right select-none">1</span>
              <span className="text-[#C586C0]"> def </span>
              <span className="text-[#DCDCAA]">divide</span>
              <span className="text-[#D4D4D4]">(a: float, b: float) -{'>'} float:</span>
            </div>
            <div>
              <span className="text-[#4A4A4A] mr-5 inline-block w-4 text-right select-none">2</span>
              <span className="text-[#6A9955]">    # BUG: no zero-division guard</span>
            </div>
            <div>
              <span className="text-[#4A4A4A] mr-5 inline-block w-4 text-right select-none">3</span>
              <span className="text-[#C586C0]">    return </span>
              <span className="text-[#D4D4D4]">a / b</span>
            </div>
            <div className="mt-2">
              <span className="text-[#4A4A4A] mr-5 inline-block w-4 text-right select-none">5</span>
              <span className="text-[#C586C0]"> def </span>
              <span className="text-[#DCDCAA]">process_data</span>
              <span className="text-[#D4D4D4]">(items):</span>
            </div>
            <div>
              <span className="text-[#4A4A4A] mr-5 inline-block w-4 text-right select-none">6</span>
              <span className="text-[#C586C0]">    for </span>
              <span className="text-[#D4D4D4]">i </span>
              <span className="text-[#C586C0]">in </span>
              <span className="text-[#D4D4D4]">items:</span>
            </div>
            <div>
              <span className="text-[#4A4A4A] mr-5 inline-block w-4 text-right select-none">7</span>
              <span className="text-[#D4D4D4]">        result = divide(i[</span>
              <span className="text-[#B5CEA8]">0</span>
              <span className="text-[#D4D4D4]">], i[</span>
              <span className="text-[#B5CEA8]">1</span>
              <span className="text-[#D4D4D4]">])</span>
            </div>
          </div>

          {/* Feedback */}
          <div className="border-t border-[#3C3C3C] pt-0 flex flex-col gap-3" style={{ paddingLeft: '5px' }}>
            <div className="px-5 py-3 flex items-center gap-3 border-b border-[#2D2D2D]">
              <span className="mt-0.5 px-2 py-0.5 rounded bg-[#F44747]/15 border border-[#F44747]/30 text-[#F44747] text-[10px] font-mono whitespace-nowrap ">HIGH</span>
              <div className='flex flex-col gap-0.5' style={{paddingTop:'3px', paddingBottom:'3px'}}>
                <p className="text-[13px] font-semibold text-[#D4D4D4] mb-0.5">Division by Zero</p>
                <p className="text-[11px] text-[#A6A6A6]">
                  No guard for <code className="text-[#CE9178]">b == 0</code> — raises <code className="text-[#CE9178]">ZeroDivisionError</code> at runtime
                </p>
              </div>
            </div>
            <div className="px-5 py-3 flex items-start gap-3">
              <span className="mt-0.5 px-2 py-0.5 rounded bg-[#D7BA7D]/15 border border-[#D7BA7D]/30 text-[#D7BA7D] text-[10px] font-mono whitespace-nowrap">MED</span>
              <div>
                <p className="text-[13px] font-semibold text-[#D4D4D4]">Missing Type Hints</p>
                <p className="text-[11px] text-[#A6A6A6]">
                  <code className="text-[#CE9178]">process_data</code> has no parameter or return type annotations
                </p>
              </div>
            </div>
          </div>

          {/* Score */}
          <div className="px-5 py-3.5 flex items-center gap-4 bg-[#2D2D2D]" style={{paddingLeft:'5px', paddingRight:'5px'}}>
            <div>
              <div className="text-[11px] text-[#6A6A6A] font-mono mb-0.5">Quality Score</div>
              <div className="text-[22px] font-extrabold text-[#D7BA7D] font-mono">22</div>
            </div>
            <div className="flex-1 h-1 bg-[#3C3C3C] rounded-full">
              <div className="w-[22%] h-full bg-[#D7BA7D] rounded-full" />
            </div>
            <div className="text-[11px] text-[#6A6A6A] font-mono">/ 100</div>
          </div>
        </div>
      </div>
      </div>

      {/* Stats */}
      <div className="w-full flex justify-center h-20 ">
      <div className="grid grid-cols-3 border-t border-b border-[#3C3C3C] w-full" style={{ gap: '1px', background: '#3C3C3C' }}>
        {[
          { num: '15+', label: 'Languages supported' },
          { num: '<2s', label: 'Average review time' },
          { num: '3', label: 'Feedback dimensions' },
        ].map(s => (
          <div key={s.label} className="bg-[#252526] py-4 text-center flex flex-col items-center justify-center">
            <div className="text-xl font-extrabold text-[#569CD6] font-mono mb-0.5">{s.num}</div>
            <div className="text-[14px] text-[#A6A6A6]">{s.label}</div>
          </div>
        ))}
      </div>
      </div>

      {/* Features */}
      <div className="w-full flex justify-center">
      <div className="grid grid-cols-4 gap-3 w-full max-w-[1400px] px-12 py-12">
        {FEATURES.map(({ color, title, desc, icon }) => (
          <div key={title} className="bg-[#252526] border border-[#3C3C3C] rounded-lg p-4 hover:border-[#454545] transition-colors flex flex-col items-center gap-1 text-center" style={{padding:'5px'}}>
            <div className={`w-8 h-8 rounded ${color} flex items-center justify-center mb-2`}>
              <svg width="20" height="20" viewBox="0 0 16 16" fill="none">{icon}</svg>
            </div>
            <h3 className="text-md font-bold text-[#D4D4D4] mb-1.5">{title}</h3>
            <p className="text-sm text-[#6A6A6A] leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
      </div>

      {/* How it works */}
      <div className="w-full flex justify-center">
      <div className="w-full max-w-[1400px] px-12 pb-12">
        <div className="text-[14px] font-mono text-[#569CD6] uppercase tracking-widest mb-6">
          // how it works
        </div>
        <div className="grid grid-cols-3 gap-5">
          {STEPS.map(({ num, title, desc }) => (
            <div key={num} className="bg-[#252526] border border-[#3C3C3C] rounded-lg flex flex-col items-start gap-2 p-5 hover:border-[#454545] transition-colors" style={{padding:'5px'}}>
              <div className="text-[12px] font-mono text-[#A6A6A6] mb-2">{num}</div>
              <h3 className="text-md font-bold text-[#D4D4D4] mb-1.5">{title}</h3>
              <p className="text-sm text-[#6A6A6A] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
      </div>

      {/* CTA */}
      <div className="w-full flex justify-center h-40 ">
      <div className="bg-[#252526] border-t border-b border-[#3C3C3C] py-10 text-center w-full flex flex-col items-center justify-center gap-2" style={{padding:'5px'}}>
        <h2 className="text-2xl font-extrabold text-[#D4D4D4] tracking-tight">
          Ready to write cleaner code?
        </h2>
        <p className="text-md text-[#6A6A6A] mb-5">Free to use. No credit card required.</p>
        <Link
          to="/register"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#569CD6] text-[#1E1E1E] no-underline font-bold text-sm hover:bg-[#4A90D9] transition-colors h-8 "
         style={{padding:'5px 20px'}}>
          Create your account
        </Link>
      </div>
      </div>

      {/* Footer */}
      <footer className=" flex items-center justify-between text-sm border-t border-[#3C3C3C] ">
        <div className="font-mono text-[#6A6A6A] flex items-center w-65">
          ai<span className="text-[#569CD6]">.</span>review
        </div>
        <div className="flex gap-6">
          {['GitHub', 'Docs', 'Privacy'].map(l => (
            <span key={l} className="text-[#6A6A6A] cursor-pointer hover:text-[#A6A6A6] transition-colors">{l}</span>
          ))}
        </div>
        <div className="text-[#3C3C3C] font-mono">built with Django + React · 2026</div>
      </footer>
    </div>
  )
}