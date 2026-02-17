export function HeroSection() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden pt-16">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1600&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.15,
        }}
      />
      <div className="absolute inset-0 bg-slate-900 opacity-50 z-0" />

      <div className="relative z-10 text-center px-4 max-w-3xl">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
          AI-Powered Claims Processing.
        </h1>
        <h2 className="text-4xl md:text-5xl font-bold text-indigo-400 mb-6">
          Decisions in Minutes.
        </h2>
        <p className="text-slate-300 text-lg md:text-xl mb-10 leading-relaxed">
          Submit your claim and receive a complete settlement recommendation powered by four specialized AI agents.
          No waiting. No manual review. Just answers.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => scrollToSection('submit-claim')}
            className="bg-indigo-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-indigo-700 transition"
          >
            Submit a Claim
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-slate-900 transition"
          >
            See How It Works
          </button>
        </div>
      </div>
    </div>
  );
}
