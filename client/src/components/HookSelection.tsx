import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Zap, MessageCircle, Target, Lightbulb, HelpCircle, TrendingUp } from 'lucide-react';
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
  return (
    <div className="py-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold tracking-tight mb-2">
          Select Your Hook
        </h2>
        <p className="text-muted-foreground text-sm">
          Choose the opening that best captures your audience
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {hooks.map((hook) => (
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
  
  return (
    <Card
      className={`
        p-6 cursor-pointer transition-all duration-200
        hover-elevate active-elevate-2
        ${isSelected 
          ? 'border-primary border-2 bg-primary/5' 
          : 'border-card-border'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      onClick={() => !disabled && onSelect()}
      data-testid={`hook-card-${hook.id}`}
    >
      <div className="flex items-start gap-4">
        <div className={`
          p-2 rounded-lg
          ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'}
        `}>
          <Icon className="w-5 h-5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
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
