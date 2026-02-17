import { Clock, Shield, FileCheck } from 'lucide-react';

export function AboutSection() {
  const values = [
    {
      icon: Clock,
      title: 'Minutes, Not Weeks',
      description: 'Four AI agents process your claim simultaneously and return a complete report in under two minutes.',
    },
    {
      icon: Shield,
      title: 'Photo-Verified Damage',
      description: 'Computer vision analyzes your damage photos and cross-references findings against your claim details.',
    },
    {
      icon: FileCheck,
      title: 'Adjuster-Ready Reports',
      description: 'Every report includes cost estimates, flags, and a settlement disposition ready for human review.',
    },
  ];

  return (
    <section id="about" className="py-20 px-4 bg-slate-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-indigo-400 font-bold text-sm tracking-widest uppercase mb-4">
            Why ClaimLens
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Built for Modern Insurance Operations
          </h2>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Traditional claims processing takes weeks. ClaimLens delivers adjuster-ready reports in minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div key={index} className="bg-slate-800 rounded-xl p-8">
                <Icon className="w-12 h-12 text-indigo-400 mb-4" strokeWidth={2} />
                <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                <p className="text-slate-300 leading-relaxed">{value.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
