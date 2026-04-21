import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Terminal, LogOut, LayoutDashboard, Plus, Home, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

const NAV_LINKS_PUBLIC = [
  { label: 'Home', href: '/' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Review', href: '/reviews/new' },
]

const NAV_LINKS_AUTH = [
  { label: 'Home', href: '/', icon: <Home size={14} /> },
  { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={14} /> },
  { label: 'Review', href: '/reviews/new', icon: <Plus size={14} /> },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActive = (href: string) => location.pathname === href

  return (
    <nav className="bg-[#252526] border-b border-[#3C3C3C] sticky top-0 z-50">
      <div className="max-w-[1920px] mx-auto px-12 h-14 flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center font-mono font-bold text-xl no-underline text-[#D4D4D4]"
          style={{marginLeft:'15px'}}
>
          <Terminal size={22} className="text-[#569CD6]" />
          Dev<span className="text-[#569CD6]">Insight</span>
        </Link>

        {/* Desktop Nav */}
        <div className=" md:flex items-center gap-6" style={{marginRight:'15px'}}>

          {/* ── Authenticated Links ── */}
          {user ? (
            <>
              {NAV_LINKS_AUTH.map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`inline-flex items-center gap-1.5 text-md transition-colors no-underline font-medium
                    ${isActive(link.href)
                      ? 'text-[#569CD6]'
                      : 'text-[#A6A6A6] hover:text-[#D4D4D4]'
                    }`}
                >
                  {link.icon}
                  {link.label}
                  {isActive(link.href) && (
                    <span className="absolute bottom-0 left-0 right-0 h-px bg-[#569CD6]" />
                  )}
                </Link>
              ))}

              {/* Divider */}
              <div className="w-px h-5 bg-[#3C3C3C]" />

              {/* User Info */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#569CD6]/20 border border-[#569CD6]/40 flex items-center justify-center text-sm font-bold text-[#569CD6] font-mono shrink-0">
                  {user.username?.[0]?.toUpperCase()}
                </div>
                <span className="text-sm text-[#A6A6A6] font-mono">{user.username}</span>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 text-xs text-[#6A6A6A] hover:text-[#F44747] transition-colors cursor-pointer bg-transparent border-none px-0"
              >
                <LogOut size={14} /> Sign out
              </button>
            </>
          ) : (

            /* ── Public Links ── */
            <>
              {NAV_LINKS_PUBLIC.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-md text-[#A6A6A6] hover:text-[#D4D4D4] transition-colors no-underline"
                >
                  {link.label}
                </a>
              ))}

              <div className="w-px h-5 bg-[#3C3C3C]" />

              <Link
                to="/login"
                className="px-4 py-1.5 rounded-md border border-[#3C3C3C] text-[#D4D4D4] text-md no-underline hover:border-[#569CD6] transition-colors w-20 h-8 text-center justify-center flex items-center"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-1.5 rounded-md bg-[#569CD6] text-[#1E1E1E] text-md font-bold no-underline hover:bg-[#4A90D9] transition-colors w-28 h-7 text-center" 
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex items-center justify-center w-8 h-8 text-[#A6A6A6] hover:text-[#D4D4D4] transition-colors bg-transparent border-none cursor-pointer"
          onClick={() => setMobileOpen(prev => !prev)}
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#252526] border-t border-[#3C3C3C] px-6 py-4 flex flex-col gap-3">
          {user ? (
            <>
              <div className="flex items-center gap-2 pb-3 border-b border-[#3C3C3C]">
                <div className="w-8 h-8 rounded-full bg-[#569CD6]/20 border border-[#569CD6]/40 flex items-center justify-center text-sm font-bold text-[#569CD6] font-mono">
                  {user.username?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#D4D4D4]">{user.username}</p>
                  <p className="text-xs text-[#6A6A6A]">{user.email}</p>
                </div>
              </div>
              {NAV_LINKS_AUTH.map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`inline-flex items-center gap-2 text-sm py-1.5 no-underline transition-colors
                    ${isActive(link.href) ? 'text-[#569CD6]' : 'text-[#A6A6A6] hover:text-[#D4D4D4]'}`}
                >
                  {link.icon} {link.label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 text-sm text-[#6A6A6A] hover:text-[#F44747] transition-colors bg-transparent border-none cursor-pointer pt-2 border-t border-[#3C3C3C] text-left"
              >
                <LogOut size={14} /> Sign out
              </button>
            </>
          ) : (
            <>
              {NAV_LINKS_PUBLIC.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-[#A6A6A6] hover:text-[#D4D4D4] no-underline py-1"
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-2 pt-3 border-t border-[#3C3C3C]">
                <Link to="/login" onClick={() => setMobileOpen(false)}
                  className="text-center py-2 rounded-md border border-[#3C3C3C] text-sm text-[#D4D4D4] no-underline hover:border-[#569CD6] transition-colors">
                  Sign In
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)}
                  className="text-center py-2 rounded-md bg-[#569CD6] text-[#1E1E1E] text-sm font-bold no-underline hover:bg-[#4A90D9] transition-colors">
                  Get Started
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </nav>
  )
}