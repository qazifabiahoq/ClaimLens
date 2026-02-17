import { useState } from 'react';
import { ClipboardList, Camera, DollarSign, FileCheck, ChevronDown, ChevronUp } from 'lucide-react';

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

  const status = getStatusFromAgent4(results.agent4);

  const toggleSection = (index: number) => {
    setExpandedSections(prev => ({
      ...prev,
      [index]: !prev[index],
    }));
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
            <button className="mt-4 px-6 py-2 border border-white text-white rounded-lg hover:bg-white hover:text-slate-900 transition font-medium">
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
        onClick={onReset}
        className="w-full bg-indigo-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-indigo-700 transition"
      >
        Submit Another Claim
      </button>
    </div>
  );
}
