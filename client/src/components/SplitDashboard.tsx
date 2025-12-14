import { ChatInterface } from './ChatInterface';
import { OutputPanels } from './OutputPanels';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle } from 'lucide-react';
import type { ChatMessage, ContentOutput, Hook } from '@shared/schema';

interface SplitDashboardProps {
  messages: ChatMessage[];
  output: ContentOutput;
  selectedHook?: Hook;
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export function SplitDashboard({ 
  messages, 
  output, 
  selectedHook,
  onSendMessage, 
  isLoading 
}: SplitDashboardProps) {
  return (
    <div className="h-screen flex flex-col lg:grid lg:grid-cols-[2fr_3fr]">
      <div className="lg:border-r lg:border-border flex flex-col h-full lg:h-screen">
        <DashboardHeader 
          title="Chat" 
          status="complete" 
          selectedHook={selectedHook}
        />
        <div className="flex-1 overflow-hidden">
          <ChatInterface
            messages={messages}
            onSendMessage={onSendMessage}
            isLoading={isLoading}
            compact
          />
        </div>
      </div>
      
      <div className="flex flex-col h-full lg:h-screen border-t lg:border-t-0">
        <DashboardHeader title="Content Output" status="complete" />
        <div className="flex-1 overflow-hidden">
          <OutputPanels output={output} />
        </div>
      </div>
    </div>
  );
}

interface DashboardHeaderProps {
  title: string;
  status: 'pending' | 'active' | 'complete';
  selectedHook?: Hook;
}

function DashboardHeader({ title, status, selectedHook }: DashboardHeaderProps) {
  return (
    <div className="shrink-0 px-4 py-3 border-b border-border flex items-center justify-between gap-4 bg-card/50">
      <div className="flex items-center gap-3">
        <StatusIcon status={status} />
        <h2 className="font-medium text-sm uppercase tracking-wide">
          {title}
        </h2>
      </div>
      
      {selectedHook && (
        <Badge variant="secondary" className="text-xs font-mono truncate max-w-[200px]">
          Hook: {selectedHook.type}
        </Badge>
      )}
    </div>
  );
}

function StatusIcon({ status }: { status: 'pending' | 'active' | 'complete' }) {
  switch (status) {
    case 'complete':
      return <CheckCircle2 className="w-4 h-4 text-primary" />;
    case 'active':
      return <Circle className="w-4 h-4 text-amber-500 animate-pulse" />;
    default:
      return <Circle className="w-4 h-4 text-muted-foreground/50" />;
  }
}
