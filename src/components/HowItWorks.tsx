import { ClipboardList, Camera, DollarSign, FileCheck, ArrowRight } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Claim Intake',
      description: 'Extracts and validates all claim details from your submission.',
      icon: ClipboardList,
      color: 'text-indigo-600',
    },
    {
      number: '02',
      title: 'Damage Analysis',
      description: 'Analyzes your damage photos using computer vision.',
      icon: Camera,
      color: 'text-blue-600',
    },
    {
      number: '03',
      title: 'Cost Research',
      description: 'Researches current repair costs in your region.',
      icon: DollarSign,
      color: 'text-amber-600',
    },
    {
      number: '04',
      title: 'Settlement Report',
      description: 'Synthesizes all findings into a final recommendation.',
      icon: FileCheck,
      color: 'text-emerald-600',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-indigo-600 font-bold text-sm tracking-widest uppercase mb-4">
            The Pipeline
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            From Incident to Answer. In Under Two Minutes.
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Upload your details and damage photos. We handle the rest. Damage assessment, repair costs, and a complete settlement recommendation. No phone calls. No waiting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                <div className="border border-slate-200 rounded-xl p-6 hover:shadow-lg transition bg-white h-full">
                  <div className={`${step.color} mb-4`}>
                    <Icon className="w-10 h-10" strokeWidth={2} />
                  </div>
                  <p className="text-sm font-bold text-slate-500 mb-2">{step.number}</p>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                </div>

                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-slate-300" strokeWidth={1.5} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
