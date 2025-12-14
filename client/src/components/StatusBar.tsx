import { Badge } from '@/components/ui/badge';
import { Circle, ArrowRight } from 'lucide-react';
import type { ProjectStatusType } from '@shared/schema';
import { ProjectStatus } from '@shared/schema';

interface StatusBarProps {
  status: ProjectStatusType;
}

const statusLabels: Record<ProjectStatusType, string> = {
  [ProjectStatus.INPUTTING]: 'Gathering Inputs',
  [ProjectStatus.HOOK_SELECTION]: 'Hook Selection',
  [ProjectStatus.GENERATING]: 'Generating Content',
  [ProjectStatus.COMPLETE]: 'Complete'
};

const statusOrder: ProjectStatusType[] = [
  ProjectStatus.INPUTTING,
  ProjectStatus.HOOK_SELECTION,
  ProjectStatus.GENERATING,
  ProjectStatus.COMPLETE
];

export function StatusBar({ status }: StatusBarProps) {
  const currentIndex = statusOrder.indexOf(status);
  
  return (
    <div className="flex items-center justify-center gap-2 p-4 bg-card/50 border-b border-border">
      {statusOrder.map((step, index) => {
        const isComplete = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isPending = index > currentIndex;
        
        return (
          <div key={step} className="flex items-center gap-2">
            <StatusStep 
              label={statusLabels[step]}
              isComplete={isComplete}
              isCurrent={isCurrent}
              isPending={isPending}
            />
            {index < statusOrder.length - 1 && (
              <ArrowRight className={`w-4 h-4 ${isComplete ? 'text-primary' : 'text-muted-foreground/30'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

interface StatusStepProps {
  label: string;
  isComplete: boolean;
  isCurrent: boolean;
  isPending: boolean;
}

function StatusStep({ label, isComplete, isCurrent, isPending }: StatusStepProps) {
  let variant: 'default' | 'secondary' | 'outline' = 'outline';
  let indicatorClass = 'bg-muted-foreground/30';
  
  if (isComplete) {
    variant = 'default';
    indicatorClass = 'bg-primary';
  } else if (isCurrent) {
    variant = 'secondary';
    indicatorClass = 'bg-amber-500 animate-pulse';
  }
  
  return (
    <Badge 
      variant={variant}
      className={`
        text-xs font-mono uppercase tracking-widest gap-2
        ${isPending ? 'opacity-50' : ''}
      `}
      data-testid={`status-step-${label.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <Circle className={`w-2 h-2 ${indicatorClass} rounded-full`} />
      {label}
    </Badge>
  );
}
