import { Badge } from '@/components/ui/badge';
import { Circle, ArrowRight } from 'lucide-react';
import type { ProjectStatusType } from '@shared/schema';
import { ProjectStatus } from '@shared/schema';

interface StatusBarProps {
  status: ProjectStatusType;
}

const statusLabels: Record<ProjectStatusType, string> = {
  [ProjectStatus.INPUTTING]: 'Gathering Inputs',
  [ProjectStatus.HOOK_TEXT]: 'Text Hook',
  [ProjectStatus.HOOK_VERBAL]: 'Verbal Hook',
  [ProjectStatus.HOOK_VISUAL]: 'Visual Hook',
  [ProjectStatus.HOOK_OVERVIEW]: 'Review',
  [ProjectStatus.GENERATING]: 'Generating Content',
  [ProjectStatus.COMPLETE]: 'Complete'
};

const statusOrder: ProjectStatusType[] = [
  ProjectStatus.INPUTTING,
  ProjectStatus.HOOK_TEXT,
  ProjectStatus.HOOK_VERBAL,
  ProjectStatus.HOOK_VISUAL,
  ProjectStatus.HOOK_OVERVIEW,
  ProjectStatus.GENERATING,
  ProjectStatus.COMPLETE
];

export function StatusBar({ status }: StatusBarProps) {
  const currentIndex = statusOrder.indexOf(status);
  
  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2 p-3 sm:p-4 bg-card/50 border-b border-border overflow-x-auto">
      {statusOrder.map((step, index) => {
        const isComplete = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isPending = index > currentIndex;
        
        return (
          <div key={step} className="flex items-center gap-1 sm:gap-2 shrink-0">
            <StatusStep 
              label={statusLabels[step]}
              isComplete={isComplete}
              isCurrent={isCurrent}
              isPending={isPending}
            />
            {index < statusOrder.length - 1 && (
              <ArrowRight className={`w-3 h-3 sm:w-4 sm:h-4 ${isComplete ? 'text-primary' : 'text-muted-foreground/30'}`} />
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
        text-[10px] sm:text-xs font-mono uppercase tracking-widest gap-1 sm:gap-2 px-2 py-0.5 sm:px-3 sm:py-1
        ${isPending ? 'opacity-50' : ''}
      `}
      data-testid={`status-step-${label.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <Circle className={`w-1.5 h-1.5 sm:w-2 sm:h-2 ${indicatorClass} rounded-full`} />
      {label}
    </Badge>
  );
}
