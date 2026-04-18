import { Link } from "react-router-dom";
import { Terminal } from "lucide-react";
export default function Navbar(){
    return (
        <nav className="bg-[#252526] border-b border-[#3C3C3C] px-12 h-12 flex items-center justify-between sticky top-0 z-50 ">
         <div className="flex items-center gap-3">
          <Terminal size={28} className="text-[#569CD6]" />
          <span className="font-mono font-bold text-2xl text-[#D4D4D4]">
            Dev<span className="text-[#569CD6]">Insight</span>
          </span>
        </div>
        <div className="flex items-center gap-6" style={{marginRight:'12px'}}>
          <span className="text-[#A6A6A6] text-sm cursor-pointer hover:text-[#D4D4D4] transition-colors">Features</span>
          <span className="text-[#A6A6A6] text-sm cursor-pointer hover:text-[#D4D4D4] transition-colors">Docs</span>
          <span className="text-[#A6A6A6] text-sm cursor-pointer hover:text-[#D4D4D4] transition-colors">Pricing</span>
          <Link to="/login" className="px-3 py-1 rounded-md border border-[#3C3C3C] text-[#D4D4D4] text-sm no-underline hover:border-[#569CD6] transition-colors w-25 h-6 text-center  " style={{paddingTop:'2px'}}>
            Sign In
          </Link>
          <Link to="/register" className="px-4 py-1 rounded-md bg-[#569CD6] text-[#1E1E1E] text-sm font-bold no-underline hover:bg-[#4A90D9] transition-colors w-25 h-6 text-center" style={{paddingTop:'3px'}}>
            Get Started
          </Link>
        </div>
      </nav>
    )
}

