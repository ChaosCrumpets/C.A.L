import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Type, Mic, Video, Check, Copy, ArrowLeft, Sparkles, Film, Wand2 } from 'lucide-react';
import type { TextHook, VerbalHook, VisualHook } from '@shared/schema';

interface HookOverviewStageProps {
  textHook?: TextHook;
  verbalHook?: VerbalHook;
  visualHook?: VisualHook;
  onEdit: (stage: 'text' | 'verbal' | 'visual') => void;
  onConfirm: () => void;
  disabled?: boolean;
}

export function HookOverviewStage({ 
  textHook, 
  verbalHook, 
  visualHook,
  onEdit,
  onConfirm,
  disabled = false
}: HookOverviewStageProps) {
  const allSelected = textHook && verbalHook && visualHook;
  
  return (
    <div className="py-8">
      <div className="text-center mb-8">
        <Badge variant="outline" className="mb-4 text-xs font-mono uppercase tracking-widest bg-primary/10 text-primary border-primary/30">
          Review & Confirm
        </Badge>
        <h2 className="text-2xl font-semibold tracking-tight mb-2">
          Your Hook Strategy
        </h2>
        <p className="text-muted-foreground text-sm max-w-lg mx-auto">
          Review your selections for all three hook types. Click Edit to change any selection, or Confirm to generate your content.
        </p>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 space-y-4">
        <HookSummaryCard 
          title="Text Hook"
          subtitle="On-Screen / Thumbnail"
          icon={Type}
          content={textHook?.content}
          type={textHook?.type}
          onEdit={() => onEdit('text')}
          isEmpty={!textHook}
        />
        
        <HookSummaryCard 
          title="Verbal Hook"
          subtitle="Script Opener"
          icon={Mic}
          content={verbalHook?.content}
          type={verbalHook?.type}
          emotionalTrigger={verbalHook?.emotionalTrigger}
          onEdit={() => onEdit('verbal')}
          isEmpty={!verbalHook}
        />
        
        <VisualHookSummaryCard 
          title="Visual Hook"
          subtitle="Opening Shot"
          icon={Video}
          hook={visualHook}
          onEdit={() => onEdit('visual')}
          isEmpty={!visualHook}
        />
        
        <div className="pt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            size="lg"
            variant="outline"
            onClick={() => onEdit('text')}
            disabled={disabled}
            data-testid="button-edit-selections"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Edit Selections
          </Button>
          
          <Button 
            size="lg"
            onClick={onConfirm}
            disabled={disabled || !allSelected}
            className="min-w-[200px]"
            data-testid="button-confirm-generate"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {disabled ? 'Generating...' : 'Confirm & Generate Script'}
          </Button>
        </div>
      </div>
    </div>
  );
}

interface HookSummaryCardProps {
  title: string;
  subtitle: string;
  icon: typeof Type;
  content?: string;
  type?: string;
  emotionalTrigger?: string;
  onEdit: () => void;
  isEmpty: boolean;
}

function HookSummaryCard({ 
  title, 
  subtitle, 
  icon: Icon, 
  content, 
  type,
  emotionalTrigger,
  onEdit,
  isEmpty 
}: HookSummaryCardProps) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    if (content) {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  return (
    <Card className={`p-5 ${isEmpty ? 'border-dashed border-2' : ''}`}>
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-lg bg-muted shrink-0">
          <Icon className="w-5 h-5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div>
              <h3 className="font-semibold">{title}</h3>
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            </div>
            
            <div className="flex items-center gap-2">
              {!isEmpty && (
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-8 w-8"
                  onClick={handleCopy}
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </Button>
              )}
              <Button 
                size="sm" 
                variant="outline"
                onClick={onEdit}
              >
                {isEmpty ? 'Select' : 'Edit'}
              </Button>
            </div>
          </div>
          
          {isEmpty ? (
            <p className="text-muted-foreground text-sm italic">No selection made</p>
          ) : (
            <>
              {type && (
                <Badge variant="secondary" className="text-xs font-mono uppercase tracking-widest mb-2">
                  {type.replace(/_/g, ' ')}
                </Badge>
              )}
              <p className="font-medium text-lg">
                {title === 'Verbal Hook' ? `"${content}"` : content}
              </p>
              {emotionalTrigger && (
                <span className="text-xs text-muted-foreground mt-1 block">
                  Trigger: {emotionalTrigger}
                </span>
              )}
            </>
          )}
        </div>
      </div>
    </Card>
  );
}

interface VisualHookSummaryCardProps {
  title: string;
  subtitle: string;
  icon: typeof Video;
  hook?: VisualHook;
  onEdit: () => void;
  isEmpty: boolean;
}

function VisualHookSummaryCard({ 
  title, 
  subtitle, 
  icon: Icon, 
  hook,
  onEdit,
  isEmpty 
}: VisualHookSummaryCardProps) {
  const [showGenAi, setShowGenAi] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    if (hook) {
      const text = showGenAi ? hook.genAiPrompt : hook.fiyGuide;
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  return (
    <Card className={`p-5 ${isEmpty ? 'border-dashed border-2' : ''}`}>
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-lg bg-muted shrink-0">
          <Icon className="w-5 h-5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div>
              <h3 className="font-semibold">{title}</h3>
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            </div>
            
            <div className="flex items-center gap-2">
              {!isEmpty && (
                <>
                  <div className="flex gap-1">
                    <Button 
                      size="sm" 
                      variant={showGenAi ? "outline" : "secondary"}
                      className="text-xs h-7"
                      onClick={() => setShowGenAi(false)}
                    >
                      <Film className="w-3 h-3 mr-1" />
                      FIY
                    </Button>
                    <Button 
                      size="sm" 
                      variant={showGenAi ? "secondary" : "outline"}
                      className="text-xs h-7"
                      onClick={() => setShowGenAi(true)}
                    >
                      <Wand2 className="w-3 h-3 mr-1" />
                      GenAI
                    </Button>
                  </div>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-8 w-8"
                    onClick={handleCopy}
                  >
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </>
              )}
              <Button 
                size="sm" 
                variant="outline"
                onClick={onEdit}
              >
                {isEmpty ? 'Select' : 'Edit'}
              </Button>
            </div>
          </div>
          
          {isEmpty ? (
            <p className="text-muted-foreground text-sm italic">No selection made</p>
          ) : (
            <>
              {hook?.type && (
                <Badge variant="secondary" className="text-xs font-mono uppercase tracking-widest mb-2">
                  {hook.type.replace(/_/g, ' ')}
                </Badge>
              )}
              {hook?.sceneDescription && (
                <p className="font-medium mb-2">{hook.sceneDescription}</p>
              )}
              <div className="bg-muted/50 rounded-lg p-3">
                <span className="text-xs font-mono uppercase text-muted-foreground block mb-1">
                  {showGenAi ? 'AI Prompt' : 'Filming Guide'}
                </span>
                <p className="text-sm">
                  {showGenAi ? hook?.genAiPrompt : hook?.fiyGuide}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
