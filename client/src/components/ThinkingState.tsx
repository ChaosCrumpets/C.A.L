import { Loader2, Check, Circle } from 'lucide-react';
import type { AgentStatus } from '@shared/schema';

interface ThinkingStateProps {
  agents: AgentStatus[];
  title?: string;
}

const agentDescriptions: Record<string, string> = {
  'Script Architect': 'Crafting your narrative structure',
  'Hook Engineer': 'Designing attention-grabbing openers',
  'Visual Director': 'Planning shot compositions',
  'B-Roll Scout': 'Finding supporting footage',
  'Tech Specialist': 'Optimizing platform specs',
  'Caption Writer': 'Generating accessible text'
};

export function ThinkingState({ agents, title = 'Assembling Content' }: ThinkingStateProps) {
  const completedCount = agents.filter(a => a.status === 'complete').length;
  const progress = agents.length > 0 ? (completedCount / agents.length) * 100 : 0;
  
  return (
    <div className="flex flex-col items-center justify-center py-16 max-w-md mx-auto">
      <div className="relative mb-8">
        <div className="w-16 h-16 rounded-full border-2 border-primary/20 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
        <div 
          className="absolute inset-0 rounded-full border-2 border-primary transition-all duration-500"
          style={{
            clipPath: `polygon(0 0, 100% 0, 100% ${progress}%, 0 ${progress}%)`
          }}
        />
      </div>
      
      <h2 className="text-2xl font-semibold tracking-tight mb-2 text-center">
        {title}
      </h2>
      
      <p className="text-muted-foreground text-sm mb-8 text-center">
        Our agents are working on your content
      </p>
      
      <div className="w-full space-y-4" data-testid="agent-status-list">
        {agents.map((agent) => (
          <AgentStatusRow key={agent.name} agent={agent} />
        ))}
      </div>
      
      <div className="mt-8 text-center">
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          {completedCount} / {agents.length} Complete
        </span>
      </div>
    </div>
  );
}

function AgentStatusRow({ agent }: { agent: AgentStatus }) {
  const description = agent.task || agentDescriptions[agent.name] || 'Processing...';
  
  return (
    <div 
      className="flex items-center gap-3 p-3 rounded-lg bg-card/50"
      data-testid={`agent-status-${agent.name.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <StatusIndicator status={agent.status} />
      
      <div className="flex-1 min-w-0">
        <span className="font-mono text-xs uppercase tracking-widest block">
          {agent.name}
        </span>
        <span className="text-sm text-muted-foreground truncate block">
          {description}
        </span>
      </div>
    </div>
  );
}

function StatusIndicator({ status }: { status: AgentStatus['status'] }) {
  switch (status) {
    case 'working':
      return (
        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
      );
    case 'complete':
      return (
        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
          <Check className="w-3 h-3 text-primary" />
        </div>
      );
    default:
      return (
        <Circle className="w-2 h-2 text-muted-foreground/50" />
      );
  }
}
