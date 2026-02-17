import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { HowItWorks } from './components/HowItWorks';
import { ClaimForm } from './components/ClaimForm';
import { ProcessingState } from './components/ProcessingState';
import { ResultsDisplay } from './components/ResultsDisplay';
import { AboutSection } from './components/AboutSection';
import { Footer } from './components/Footer';

export default function App() {
  const [processingState, setProcessingState] = useState<{
    isProcessing: boolean;
    currentStep: number;
    claimId?: string;
    claimantName?: string;
    results?: {
      agent1: string;
      agent2: string;
      agent3: string;
      agent4: string;
    };
  }>({
    isProcessing: false,
    currentStep: 0,
  });

  const handleClaimSubmit = async (data: any) => {
    setProcessingState({
      isProcessing: true,
      currentStep: 1,
      claimId: `CLM-${Date.now()}`,
      claimantName: data.claimData.name,
    });

    try {
      const apiUrl = `${import.meta.env.VITE_API_URL}/api/process-claim`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const results = await response.json();

      setProcessingState(prev => ({
        ...prev,
        isProcessing: false,
        currentStep: 4,
        results,
      }));

      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error('Error processing claim:', error);
      alert(`Error processing claim: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setProcessingState({
        isProcessing: false,
        currentStep: 0,
      });
    }
  };

  const handleReset = () => {
    setProcessingState({
      isProcessing: false,
      currentStep: 0,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <HowItWorks />

      {!processingState.results ? (
        <>
          {processingState.isProcessing ? (
            <section className="py-20 px-4 bg-slate-50">
              <div className="max-w-2xl mx-auto">
                <ProcessingState currentStep={processingState.currentStep} totalSteps={4} />
              </div>
            </section>
          ) : (
            <ClaimForm onSubmit={handleClaimSubmit} isLoading={processingState.isProcessing} />
          )}
        </>
      ) : (
        <section id="results-section" className="py-20 px-4 bg-slate-50">
          <div className="max-w-5xl mx-auto">
            <ResultsDisplay
              claimId={processingState.claimId!}
              claimantName={processingState.claimantName!}
              results={processingState.results}
              onReset={handleReset}
            />
          </div>
        </section>
      )}

      <AboutSection />
      <Footer />
    </div>
  );
}
