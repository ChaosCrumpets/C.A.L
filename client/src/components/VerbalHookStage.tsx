import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Mic, Zap, Heart, AlertTriangle, HelpCircle, Trophy, Clock } from 'lucide-react';
import type { VerbalHook } from '@shared/schema';

interface VerbalHookStageProps {
  hooks: VerbalHook[];
  onSelectHook: (hook: VerbalHook) => void;
  selectedHookId?: string;
  disabled?: boolean;
}

const hookIcons: Record<string, typeof Mic> = {
  effort_condensed: Clock,
  failure: AlertTriangle,
  credibility_arbitrage: Trophy,
  shared_emotion: Heart,
  pattern_interrupt: Zap,
  direct_question: HelpCircle,
  default: Mic
};

const emotionColors: Record<string, string> = {
  curiosity: 'text-blue-500',
  empathy: 'text-pink-500',
  urgency: 'text-red-500',
  surprise: 'text-purple-500',
  validation: 'text-green-500'
};

export function VerbalHookStage({ 
  hooks, 
  onSelectHook, 
  selectedHookId,
  disabled = false 
}: VerbalHookStageProps) {
  const hooksWithFallbackRanks = hooks.map((hook, index) => ({
    ...hook,
    rank: hook.rank ?? (index + 1),
    isRecommended: hook.isRecommended ?? (index === 0)
  }));
  
  const sortedHooks = [...hooksWithFallbackRanks].sort((a, b) => a.rank - b.rank);
  
  return (
    <div className="py-8">
      <div className="text-center mb-8">
        <Badge variant="outline" className="mb-4 text-xs font-mono uppercase tracking-widest">
          Stage 2 of 3
        </Badge>
        <h2 className="text-2xl font-semibold tracking-tight mb-2">
          Select Your Verbal Hook
        </h2>
        <p className="text-muted-foreground text-sm max-w-lg mx-auto">
          Choose the first words you will speak. This script opener hooks viewers in the first 2-5 seconds.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto px-4">
        {sortedHooks.map((hook) => (
          <VerbalHookCard
            key={hook.id}
            hook={hook}
            isSelected={selectedHookId === hook.id}
            onSelect={() => onSelectHook(hook)}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
}

interface VerbalHookCardProps {
  hook: VerbalHook & { rank: number; isRecommended: boolean };
  isSelected: boolean;
  onSelect: () => void;
  disabled: boolean;
}

function VerbalHookCard({ hook, isSelected, onSelect, disabled }: VerbalHookCardProps) {
  const Icon = hookIcons[hook.type.toLowerCase()] || hookIcons.default;
  const emotionColor = emotionColors[hook.emotionalTrigger?.toLowerCase() || ''] || 'text-muted-foreground';
  
  return (
    <Card
      className={`
        p-6 cursor-pointer transition-all duration-200 relative
        hover-elevate active-elevate-2
        ${hook.isRecommended 
          ? 'border-amber-500/50 border-2 ring-1 ring-amber-500/20' 
          : isSelected 
            ? 'border-primary border-2 bg-primary/5' 
            : 'border-card-border'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      onClick={() => !disabled && onSelect()}
      data-testid={`verbal-hook-card-${hook.id}`}
    >
      <div 
        className={`
          absolute -top-2 -left-2 w-7 h-7 rounded-full flex items-center justify-center
          text-xs font-bold shadow-sm
          ${hook.isRecommended 
            ? 'bg-amber-500 text-amber-950' 
            : 'bg-muted text-muted-foreground border border-border'
          }
        `}
        data-testid={`rank-badge-${hook.id}`}
      >
        {hook.rank}
      </div>
      
      {hook.isRecommended && (
        <div className="absolute -top-2 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500 text-amber-950 text-xs font-semibold shadow-sm" data-testid={`recommended-badge-${hook.id}`}>
          <Crown className="w-3 h-3" />
          <span>Recommended</span>
        </div>
      )}
      
      <div className="flex items-start gap-4 mt-2">
        <div className={`
          p-2 rounded-lg
          ${hook.isRecommended 
            ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400' 
            : isSelected 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-muted'
          }
        `}>
          <Icon className="w-5 h-5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Badge 
              variant="secondary" 
              className="text-xs font-mono uppercase tracking-widest"
            >
              {hook.type.replace(/_/g, ' ')}
            </Badge>
          </div>
          
          <p className="font-semibold text-lg leading-snug mb-3 italic">
            "{hook.content}"
          </p>
          
          <div className="flex items-center gap-3 text-xs">
            {hook.emotionalTrigger && (
              <span className={`font-medium ${emotionColor}`}>
                {hook.emotionalTrigger}
              </span>
            )}
            {hook.retentionTrigger && (
              <span className="text-muted-foreground">
                {hook.retentionTrigger.replace(/_/g, ' ')}
              </span>
            )}
          </div>
        </div>
      </div>
      
      {isSelected && (
        <div className="mt-4 pt-4 border-t border-primary/20">
          <span className="text-xs font-mono uppercase tracking-widest text-primary">
            Selected
          </span>
        </div>
      )}
    </Card>
  );
}
