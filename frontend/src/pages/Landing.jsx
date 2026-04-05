// frontend/src/pages/Landing.jsx
import { Link } from 'react-router-dom'
import { Code2, Zap, Shield, GitBranch, ArrowRight, Terminal } from 'lucide-react'

const FEATURES = [
  {
    icon: <Zap size={20} />,
    title: 'Instant AI Review',
    desc: 'Submit your code and get structured feedback powered by state-of-the-art LLMs in seconds.',
    color: '#D7BA7D',
  },
  {
    icon: <Shield size={20} />,
    title: 'Security Analysis',
    desc: 'Detect vulnerabilities, injection risks, and insecure patterns before they reach production.',
    color: '#F44747',
  },
  {
    icon: <GitBranch size={20} />,
    title: 'Multi-Language',
    desc: 'Python, JavaScript, TypeScript, Go, Rust, Java and more — all in one platform.',
    color: '#6A9955',
  },
  {
    icon: <Code2 size={20} />,
    title: 'Quality Scoring',
    desc: 'Get an objective quality score from 0-100 with detailed breakdown of issues and suggestions.',
    color: '#569CD6',
  },
]

const LANGUAGES = ['Python', 'JavaScript', 'TypeScript', 'Go', 'Rust', 'Java', 'C++', 'SQL']

export default function Landing() {
  return (
    <div style={{ background: '#1E1E1E', minHeight: '100vh', color: '#D4D4D4' }}>

      {/* Navbar */}
      <nav style={{
        background: '#252526',
        borderBottom: '1px solid #3C3C3C',
        padding: '0 2rem',
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Terminal size={20} color="#569CD6" />
          <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '1rem', color: '#D4D4D4' }}>
            ai<span style={{ color: '#569CD6' }}>.</span>review
          </span>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/login" style={{
            padding: '6px 16px',
            borderRadius: '6px',
            border: '1px solid #3C3C3C',
            color: '#D4D4D4',
            textDecoration: 'none',
            fontSize: '0.875rem',
            background: 'transparent',
            transition: 'border-color 0.2s',
          }}
            onMouseOver={e => e.target.style.borderColor = '#569CD6'}
            onMouseOut={e => e.target.style.borderColor = '#3C3C3C'}
          >
            Sign In
          </Link>
          <Link to="/register" style={{
            padding: '6px 16px',
            borderRadius: '6px',
            background: '#569CD6',
            color: '#1E1E1E',
            textDecoration: 'none',
            fontSize: '0.875rem',
            fontWeight: 600,
            transition: 'background 0.2s',
          }}
            onMouseOver={e => e.target.style.background = '#4A90D9'}
            onMouseOut={e => e.target.style.background = '#569CD6'}
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '6rem 2rem 4rem', maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>

        {/* Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '4px 14px',
          borderRadius: '20px',
          border: '1px solid #3C3C3C',
          background: '#252526',
          fontSize: '0.75rem',
          color: '#A6A6A6',
          marginBottom: '2rem',
          fontFamily: 'monospace',
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6A9955', display: 'inline-block' }} />
          Powered by Groq · Llama 3.3 70B
        </div>

        <h1 style={{
          fontSize: 'clamp(2.5rem, 6vw, 4rem)',
          fontWeight: 800,
          lineHeight: 1.1,
          marginBottom: '1.5rem',
          color: '#D4D4D4',
          letterSpacing: '-0.02em',
        }}>
          Code review,{' '}
          <span style={{ color: '#569CD6' }}>supercharged</span>
          <br />by AI
        </h1>

        <p style={{
          fontSize: '1.125rem',
          color: '#A6A6A6',
          maxWidth: '560px',
          margin: '0 auto 2.5rem',
          lineHeight: 1.7,
        }}>
          Submit your code and get instant, structured feedback — issues, suggestions,
          and a quality score. Built for developers who care about clean code.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/register" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 24px',
            borderRadius: '8px',
            background: '#569CD6',
            color: '#1E1E1E',
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: '0.9rem',
            transition: 'background 0.2s',
          }}>
            Start reviewing code <ArrowRight size={16} />
          </Link>
          <Link to="/login" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 24px',
            borderRadius: '8px',
            border: '1px solid #3C3C3C',
            background: '#252526',
            color: '#D4D4D4',
            textDecoration: 'none',
            fontSize: '0.9rem',
          }}>
            Sign in
          </Link>
        </div>

        {/* Language pills */}
        <div style={{
          display: 'flex',
          gap: '8px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginTop: '3rem',
        }}>
          {LANGUAGES.map(lang => (
            <span key={lang} style={{
              padding: '4px 12px',
              borderRadius: '20px',
              background: '#2D2D2D',
              border: '1px solid #3C3C3C',
              fontSize: '0.75rem',
              color: '#A6A6A6',
              fontFamily: 'monospace',
            }}>
              {lang}
            </span>
          ))}
        </div>
      </section>

      {/* Code preview block */}
      <section style={{ padding: '0 2rem 5rem', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{
          background: '#252526',
          border: '1px solid #3C3C3C',
          borderRadius: '10px',
          overflow: 'hidden',
        }}>
          {/* Title bar */}
          <div style={{
            padding: '10px 16px',
            borderBottom: '1px solid #3C3C3C',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#2D2D2D',
          }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#F44747' }} />
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#D7BA7D' }} />
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#6A9955' }} />
            </div>
            <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#6A6A6A', marginLeft: '8px' }}>
              example.py
            </span>
          </div>
          <pre style={{
            padding: '1.5rem',
            fontFamily: 'monospace',
            fontSize: '0.875rem',
            lineHeight: 1.7,
            overflowX: 'auto',
            margin: 0,
          }}>
            <code>
              <span style={{ color: '#C586C0' }}>def </span>
              <span style={{ color: '#DCDCAA' }}>divide</span>
              <span style={{ color: '#D4D4D4' }}>(a, b):{'\n'}</span>
              <span style={{ color: '#6A9955' }}>    # ⚠️ No zero-division check{'\n'}</span>
              <span style={{ color: '#C586C0' }}>    return </span>
              <span style={{ color: '#D4D4D4' }}>a / b{'\n'}</span>
            </code>
          </pre>
          {/* AI feedback preview */}
          <div style={{
            borderTop: '1px solid #3C3C3C',
            padding: '1rem 1.5rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
          }}>
            <span style={{
              padding: '2px 8px',
              borderRadius: '4px',
              background: 'rgba(244,71,71,0.15)',
              border: '1px solid rgba(244,71,71,0.3)',
              color: '#F44747',
              fontSize: '0.7rem',
              fontFamily: 'monospace',
              whiteSpace: 'nowrap',
              marginTop: '2px',
            }}>HIGH</span>
            <div>
              <p style={{ fontSize: '0.85rem', color: '#D4D4D4', fontWeight: 600, marginBottom: '2px' }}>
                Division by Zero
              </p>
              <p style={{ fontSize: '0.8rem', color: '#A6A6A6' }}>
                No check for <code style={{ color: '#CE9178' }}>b == 0</code> — will raise <code style={{ color: '#CE9178' }}>ZeroDivisionError</code> at runtime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '0 2rem 6rem', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
        }}>
          {FEATURES.map(({ icon, title, desc, color }) => (
            <div key={title} style={{
              background: '#252526',
              border: '1px solid #3C3C3C',
              borderRadius: '8px',
              padding: '1.25rem',
              transition: 'border-color 0.2s',
            }}
              onMouseOver={e => e.currentTarget.style.borderColor = '#454545'}
              onMouseOut={e => e.currentTarget.style.borderColor = '#3C3C3C'}
            >
              <div style={{ color, marginBottom: '10px' }}>{icon}</div>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '6px', color: '#D4D4D4' }}>
                {title}
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#A6A6A6', lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid #3C3C3C',
        padding: '1.5rem 2rem',
        textAlign: 'center',
        color: '#6A6A6A',
        fontSize: '0.8rem',
        fontFamily: 'monospace',
      }}>
        ai.review · built with Django + React · {new Date().getFullYear()}
      </footer>
    </div>
  )
}