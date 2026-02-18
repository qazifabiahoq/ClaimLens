import { useState } from 'react';
import { ClipboardList, Camera, DollarSign, FileCheck, ChevronDown, ChevronUp, MessageSquare, Send, X } from 'lucide-react';

interface ResultsDisplayProps {
  claimId: string;
  claimantName: string;
  results: {
    agent1: string;
    agent2: string;
    agent3: string;
    agent4: string;
  };
  onReset: () => void;
}

function parseAgentOutput(output: string): Array<{ label: string; value: string }> {
  const lines = output.split('\n').filter(line => line.trim());
  return lines
    .map(line => {
      const colonIndex = line.indexOf(':');
      if (colonIndex > -1) {
        return {
          label: line.substring(0, colonIndex).trim(),
          value: line.substring(colonIndex + 1).trim(),
        };
      }
      return null;
    })
    .filter((item): item is { label: string; value: string } => item !== null);
}

function getStatusFromAgent4(agent4: string): { text: string; color: string } {
  const lower = agent4.toLowerCase();
  if (lower.includes('settlement recommended') || lower.includes('approved')) {
    return { text: 'SETTLEMENT RECOMMENDED', color: 'bg-emerald-100 text-emerald-800' };
  } else if (lower.includes('pending') || lower.includes('investigation')) {
    return { text: 'PENDING ADJUSTER REVIEW', color: 'bg-amber-100 text-amber-800' };
  } else if (lower.includes('denied') || lower.includes('reject')) {
    return { text: 'CLAIM DENIED', color: 'bg-red-100 text-red-800' };
  }
  return { text: 'PENDING REVIEW', color: 'bg-amber-100 text-amber-800' };
}

function ReportSection({
  title,
  icon: Icon,
  content,
  borderColor,
  expanded,
  onToggle,
}: {
  title: string;
  icon: any;
  content: string;
  borderColor: string;
  expanded: boolean;
  onToggle: () => void;
}) {
  const parsed = parseAgentOutput(content);

  return (
    <div className="bg-white border-l-4 rounded-lg shadow-sm overflow-hidden">
      <div
        className={`${borderColor} cursor-pointer`}
        style={{
          borderLeftColor: borderColor === 'border-indigo-600' ? '#4f46e5' : borderColor === 'border-blue-600' ? '#2563eb' : borderColor === 'border-amber-600' ? '#d97706' : '#059669',
        }}
      >
        <button
          onClick={onToggle}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition"
        >
          <div className="flex items-center gap-3">
            <Icon className="w-5 h-5" strokeWidth={2} style={{ color: borderColor === 'border-indigo-600' ? '#4f46e5' : borderColor === 'border-blue-600' ? '#2563eb' : borderColor === 'border-amber-600' ? '#d97706' : '#059669' }} />
            <h3 className="font-semibold text-slate-900">{title}</h3>
          </div>
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-slate-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-500" />
          )}
        </button>
      </div>

      {expanded && (
        <div className="px-6 py-4 border-t border-slate-200 space-y-3 bg-slate-50">
          {parsed.length > 0 ? (
            parsed.map((item, index) => (
              <div key={index} className="flex gap-4">
                <div className="text-sm font-semibold text-slate-600 min-w-[150px]">{item.label}</div>
                <div className="text-sm text-slate-900">{item.value}</div>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-600 whitespace-pre-wrap">{content}</p>
          )}
        </div>
      )}
    </div>
  );
}

export function ResultsDisplay({ claimId, claimantName, results, onReset }: ResultsDisplayProps) {
  const [expandedSections, setExpandedSections] = useState<{ [key: number]: boolean }>({
    0: true,
    1: true,
    2: true,
    3: true,
  });
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const status = getStatusFromAgent4(results.agent4);

  const toggleSection = (index: number) => {
    setExpandedSections(prev => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleDownloadReport = () => {
    const reportContent = `CLAIM REPORT
============
Claim ID: ${claimId}
Claimant: ${claimantName}
Generated: ${new Date().toLocaleString()}

CLAIM INTAKE
============
${results.agent1}

DAMAGE ASSESSMENT
=================
${results.agent2}

COST ESTIMATE
=============
${results.agent3}

SETTLEMENT RECOMMENDATION
=========================
${results.agent4}
`;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${claimId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();
    setChatInput('');

    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setChatLoading(true);

    try {
      const claimContext = `Claim ID: ${claimId}\nClaimant: ${claimantName}\n\nClaim Intake:\n${results.agent1}\n\nDamage Assessment:\n${results.agent2}\n\nCost Estimate:\n${results.agent3}\n\nSettlement Recommendation:\n${results.agent4}`;

      const apiUrl = `${import.meta.env.VITE_API_URL}/api/chat`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          claimContext: claimContext,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      setChatMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      console.error('Chat error:', error);
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Error: Unable to process your message. Please try again.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 text-white rounded-lg p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-slate-400 text-sm mb-1">Claim ID</p>
            <p className="font-mono text-lg font-semibold">{claimId}</p>
            <p className="text-2xl font-bold mt-4">{claimantName}</p>
          </div>
          <div className="md:flex md:flex-col md:items-end md:justify-start">
            <div className={`inline-block px-4 py-2 rounded-lg font-semibold text-sm ${status.color}`}>
              {status.text}
            </div>
            <button onClick={handleDownloadReport} className="mt-4 px-6 py-2 border border-white text-white rounded-lg hover:bg-white hover:text-slate-900 transition font-medium">
              Download Report
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <ReportSection
          title="Claim Intake"
          icon={ClipboardList}
          content={results.agent1}
          borderColor="border-indigo-600"
          expanded={expandedSections[0]}
          onToggle={() => toggleSection(0)}
        />
        <ReportSection
          title="Damage Assessment"
          icon={Camera}
          content={results.agent2}
          borderColor="border-blue-600"
          expanded={expandedSections[1]}
          onToggle={() => toggleSection(1)}
        />
        <ReportSection
          title="Cost Estimate"
          icon={DollarSign}
          content={results.agent3}
          borderColor="border-amber-600"
          expanded={expandedSections[2]}
          onToggle={() => toggleSection(2)}
        />
        <ReportSection
          title="Settlement Recommendation"
          icon={FileCheck}
          content={results.agent4}
          borderColor={status.text === 'CLAIM DENIED' ? 'border-red-600' : 'border-emerald-600'}
          expanded={expandedSections[3]}
          onToggle={() => toggleSection(3)}
        />
      </div>

      <button
        onClick={() => setChatOpen(true)}
        className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
      >
        <MessageSquare className="w-5 h-5" />
        Discuss This Claim
      </button>

      <button
        onClick={() => window.location.href = `mailto:adjuster@claimlens.com?subject=Claim ${claimId} - Human Review Requested&body=Claimant: ${claimantName}%0AClaim ID: ${claimId}%0A%0APlease review this claim.`}
        className="w-full bg-slate-700 text-white px-6 py-4 rounded-lg font-semibold hover:bg-slate-800 transition flex items-center justify-center gap-2"
      >
        Connect to Human Adjuster
      </button>

      <button
        onClick={onReset}
        className="w-full bg-indigo-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-indigo-700 transition"
      >
        Submit Another Claim
      </button>

      {chatOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
          <div className="w-full md:w-96 bg-white rounded-t-lg md:rounded-lg shadow-lg flex flex-col max-h-96 md:max-h-screen">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="font-semibold text-slate-900">Discuss This Claim</h3>
              <button onClick={() => setChatOpen(false)} className="text-slate-500 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.length === 0 && (
                <p className="text-sm text-slate-500 text-center py-8">Ask questions about your claim results...</p>
              )}
              {chatMessages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs px-4 py-2 rounded-lg ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-900'}`}>
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 text-slate-900 px-4 py-2 rounded-lg">
                    <p className="text-sm">Thinking...</p>
                  </div>
                </div>
              )}
            </div>

            <div className="px-4 py-4 border-t border-slate-200 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask a question..."
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={chatLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={chatLoading || !chatInput.trim()}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:bg-slate-300"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
