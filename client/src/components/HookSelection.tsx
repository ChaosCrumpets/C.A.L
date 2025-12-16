import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Zap, MessageCircle, Target, Lightbulb, HelpCircle, TrendingUp, Crown } from 'lucide-react';
import type { Hook } from '@shared/schema';

interface HookSelectionProps {
  hooks: Hook[];
  onSelectHook: (hook: Hook) => void;
  selectedHookId?: string;
  disabled?: boolean;
}

const hookIcons: Record<string, typeof Sparkles> = {
  question: HelpCircle,
  statistic: TrendingUp,
  story: MessageCircle,
  bold: Zap,
  challenge: Target,
  insight: Lightbulb,
  default: Sparkles
};

export function HookSelection({ 
  hooks, 
  onSelectHook, 
  selectedHookId,
  disabled = false 
}: HookSelectionProps) {
  const hooksWithFallbackRanks = hooks.map((hook, index) => ({
    ...hook,
    rank: hook.rank ?? (index + 1),
    isRecommended: hook.isRecommended ?? (index === 0)
  }));
  
  const sortedHooks = [...hooksWithFallbackRanks].sort((a, b) => a.rank - b.rank);
  
  return (
    <div className="py-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold tracking-tight mb-2">
          Select Your Hook
        </h2>
        <p className="text-muted-foreground text-sm">
          Choose the opening that best captures your audience. Hooks are ranked by predicted performance.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {sortedHooks.map((hook) => (
          <HookCard
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

interface HookCardProps {
  hook: Hook;
  isSelected: boolean;
  onSelect: () => void;
  disabled: boolean;
}

function HookCard({ hook, isSelected, onSelect, disabled }: HookCardProps) {
  const Icon = hookIcons[hook.type.toLowerCase()] || hookIcons.default;
  const isRecommended = hook.isRecommended || hook.rank === 1;
  
  return (
    <Card
      className={`
        p-6 cursor-pointer transition-all duration-200 relative
        hover-elevate active-elevate-2
        ${isRecommended 
          ? 'border-amber-500/50 border-2 ring-1 ring-amber-500/20' 
          : isSelected 
            ? 'border-primary border-2 bg-primary/5' 
            : 'border-card-border'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      onClick={() => !disabled && onSelect()}
      data-testid={`hook-card-${hook.id}`}
    >
      {hook.rank && (
        <div 
          className={`
            absolute -top-2 -left-2 w-7 h-7 rounded-full flex items-center justify-center
            text-xs font-bold shadow-sm
            ${isRecommended 
              ? 'bg-amber-500 text-amber-950' 
              : 'bg-muted text-muted-foreground border border-border'
            }
          `}
          data-testid={`rank-badge-${hook.id}`}
        >
          {hook.rank}
        </div>
      )}
      
      {isRecommended && (
        <div className="absolute -top-2 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500 text-amber-950 text-xs font-semibold shadow-sm" data-testid={`recommended-badge-${hook.id}`}>
          <Crown className="w-3 h-3" />
          <span>Recommended</span>
        </div>
      )}
      
      <div className="flex items-start gap-4 mt-2">
        <div className={`
          p-2 rounded-lg
          ${isRecommended 
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
              {hook.type}
            </Badge>
          </div>
          
          <p className="font-semibold text-lg leading-snug mb-2">
            {hook.text}
          </p>
          
          <p className="text-sm text-muted-foreground leading-relaxed">
            {hook.preview}
          </p>
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
