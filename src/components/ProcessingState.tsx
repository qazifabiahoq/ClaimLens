import { CheckCircle2 } from 'lucide-react';

interface ProcessingStateProps {
  currentStep: number;
  totalSteps: number;
}

export function ProcessingState({ currentStep, totalSteps }: ProcessingStateProps) {
  const steps = [
    { number: 1, label: 'Extracting claim details' },
    { number: 2, label: 'Analyzing damage photos' },
    { number: 3, label: 'Researching repair costs' },
    { number: 4, label: 'Generating settlement report' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
      <div className="max-w-2xl mx-auto">
        <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">
          Processing Your Claim...
        </h3>

        <div className="mb-8">
          <div className="flex justify-between gap-2">
            {steps.map((step) => (
              <div key={step.number} className="flex-1">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    step.number < currentStep
                      ? 'bg-emerald-600'
                      : step.number === currentStep
                        ? 'bg-indigo-600 animate-pulse'
                        : 'bg-slate-200'
                  }`}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 mb-8">
          {steps.map((step) => (
            <div key={step.number} className="flex items-center gap-4">
              <div className="flex-shrink-0">
                {step.number < currentStep ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" strokeWidth={2} />
                ) : step.number === currentStep ? (
                  <div className="w-6 h-6 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
                ) : (
                  <div className="w-6 h-6 rounded-full border-2 border-slate-300" />
                )}
              </div>
              <div className="flex-1">
                <p
                  className={`text-sm font-medium ${
                    step.number <= currentStep ? 'text-slate-900' : 'text-slate-400'
                  }`}
                >
                  Agent {step.number}: {step.label}...
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-slate-600 text-sm">
          This usually takes 60-90 seconds.
        </p>
      </div>
    </div>
  );
}
