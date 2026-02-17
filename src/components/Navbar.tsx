import { Shield } from 'lucide-react';

export function Navbar() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <Shield className="w-6 h-6 text-indigo-600" strokeWidth={2.5} />
            <span className="text-lg font-bold text-slate-900">ClaimLens</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="text-slate-600 hover:text-slate-900 transition text-sm font-medium"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('submit-claim')}
              className="text-slate-600 hover:text-slate-900 transition text-sm font-medium"
            >
              Submit Claim
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-slate-600 hover:text-slate-900 transition text-sm font-medium"
            >
              About
            </button>
          </div>

          <button
            onClick={() => scrollToSection('submit-claim')}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-indigo-700 transition"
          >
            Start a Claim
          </button>
        </div>
      </div>
    </nav>
  );
}
