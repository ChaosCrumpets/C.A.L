import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Film, Settings, Video, MessageSquare } from 'lucide-react';
import type { ContentOutput, ScriptLine, StoryboardFrame, TechSpecs, BRollItem, Caption } from '@shared/schema';

interface OutputPanelsProps {
  output: ContentOutput;
}

export function OutputPanels({ output }: OutputPanelsProps) {
  return (
    <Tabs defaultValue="script" className="h-full flex flex-col">
      <div className="border-b border-border px-4 shrink-0">
        <TabsList className="bg-transparent h-auto p-0 gap-1">
          <TabButton value="script" icon={FileText} label="Script" />
          <TabButton value="storyboard" icon={Film} label="Storyboard" />
          <TabButton value="tech" icon={Settings} label="Tech Specs" />
          <TabButton value="broll" icon={Video} label="B-Roll" />
          <TabButton value="captions" icon={MessageSquare} label="Captions" />
        </TabsList>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-8">
            <TabsContent value="script" className="mt-0">
              <ScriptPanel lines={output.script} />
            </TabsContent>
            
            <TabsContent value="storyboard" className="mt-0">
              <StoryboardPanel frames={output.storyboard} />
            </TabsContent>
            
            <TabsContent value="tech" className="mt-0">
              <TechSpecsPanel specs={output.techSpecs} />
            </TabsContent>
            
            <TabsContent value="broll" className="mt-0">
              <BRollPanel items={output.bRoll} />
            </TabsContent>
            
            <TabsContent value="captions" className="mt-0">
              <CaptionsPanel captions={output.captions} />
            </TabsContent>
          </div>
        </ScrollArea>
      </div>
    </Tabs>
  );
}

interface TabButtonProps {
  value: string;
  icon: typeof FileText;
  label: string;
}

function TabButton({ value, icon: Icon, label }: TabButtonProps) {
  return (
    <TabsTrigger 
      value={value}
      className="px-6 py-3 text-sm font-medium uppercase tracking-wide rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
      data-testid={`tab-${value}`}
    >
      <Icon className="w-4 h-4 mr-2" />
      {label}
    </TabsTrigger>
  );
}

function ScriptPanel({ lines }: { lines: ScriptLine[] }) {
  return (
    <div className="space-y-1" data-testid="panel-script">
      <PanelHeader title="Script" count={lines.length} unit="lines" />
      
      <div className="font-mono text-sm space-y-2 mt-6">
        {lines.map((line) => (
          <div key={line.lineNumber} className="flex gap-4 group">
            <span className="text-xs text-muted-foreground/50 w-8 shrink-0 text-right pt-0.5">
              {line.lineNumber.toString().padStart(2, '0')}
            </span>
            <div className="flex-1">
              {line.speaker && (
                <span className="text-primary font-medium uppercase text-xs tracking-wider block mb-1">
                  {line.speaker}
                </span>
              )}
              <p className="leading-relaxed">{line.text}</p>
              {line.notes && (
                <p className="text-xs text-muted-foreground italic mt-1">
                  [{line.notes}]
                </p>
              )}
            </div>
            {line.timing && (
              <span className="text-xs text-muted-foreground shrink-0 font-mono">
                {line.timing}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function StoryboardPanel({ frames }: { frames: StoryboardFrame[] }) {
  return (
    <div data-testid="panel-storyboard">
      <PanelHeader title="Storyboard" count={frames.length} unit="frames" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {frames.map((frame) => (
          <Card key={frame.frameNumber} className="p-4 border-card-border">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-mono uppercase text-muted-foreground">
                Frame {frame.frameNumber.toString().padStart(2, '0')}
              </span>
              <Badge variant="secondary" className="text-xs">
                {frame.shotType}
              </Badge>
              {frame.duration && (
                <span className="text-xs text-muted-foreground ml-auto font-mono">
                  {frame.duration}
                </span>
              )}
            </div>
            
            <p className="text-sm leading-relaxed mb-2">
              {frame.description}
            </p>
            
            {frame.visualNotes && (
              <p className="text-xs text-muted-foreground italic mt-2">
                {frame.visualNotes}
              </p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

function TechSpecsPanel({ specs }: { specs: TechSpecs }) {
  const specItems = [
    { label: 'Aspect Ratio', value: specs.aspectRatio },
    { label: 'Resolution', value: specs.resolution },
    { label: 'Frame Rate', value: specs.frameRate },
    { label: 'Duration', value: specs.duration },
    { label: 'Audio Format', value: specs.audioFormat },
    { label: 'Export Format', value: specs.exportFormat }
  ].filter(item => item.value);

  return (
    <div data-testid="panel-tech-specs">
      <PanelHeader title="Technical Specifications" />
      
      <div className="space-y-4 mt-6">
        {specItems.map((item) => (
          <div key={item.label} className="flex items-center justify-between py-3 border-b border-border last:border-0">
            <span className="font-medium text-xs uppercase tracking-wide text-muted-foreground">
              {item.label}
            </span>
            <span className="text-sm font-mono">
              {item.value}
            </span>
          </div>
        ))}
        
        {specs.platforms && specs.platforms.length > 0 && (
          <div className="pt-4">
            <span className="font-medium text-xs uppercase tracking-wide text-muted-foreground block mb-3">
              Target Platforms
            </span>
            <div className="flex flex-wrap gap-2">
              {specs.platforms.map((platform) => (
                <Badge key={platform} variant="secondary">
                  {platform}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function BRollPanel({ items }: { items: BRollItem[] }) {
  return (
    <div data-testid="panel-broll">
      <PanelHeader title="B-Roll Suggestions" count={items.length} unit="clips" />
      
      <div className="space-y-4 mt-6">
        {items.map((item) => (
          <Card key={item.id} className="p-4 border-card-border">
            <div className="flex items-start justify-between gap-4 mb-2">
              <span className="text-sm font-medium">{item.description}</span>
              {item.timestamp && (
                <span className="text-xs font-mono text-muted-foreground shrink-0">
                  {item.timestamp}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Source: {item.source}</span>
            </div>
            
            {item.keywords && item.keywords.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {item.keywords.map((keyword) => (
                  <Badge key={keyword} variant="outline" className="text-xs">
                    {keyword}
                  </Badge>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

function CaptionsPanel({ captions }: { captions: Caption[] }) {
  return (
    <div data-testid="panel-captions">
      <PanelHeader title="Captions" count={captions.length} unit="segments" />
      
      <div className="space-y-3 mt-6">
        {captions.map((caption) => (
          <div key={caption.id} className="flex gap-4 py-2">
            <span className="font-mono text-xs text-muted-foreground shrink-0 w-16">
              {caption.timestamp}
            </span>
            <p className="text-sm leading-snug flex-1">
              {caption.text}
            </p>
            {caption.style && (
              <Badge variant="outline" className="text-xs shrink-0">
                {caption.style}
              </Badge>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

interface PanelHeaderProps {
  title: string;
  count?: number;
  unit?: string;
}

function PanelHeader({ title, count, unit }: PanelHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-medium uppercase tracking-wide">
        {title}
      </h3>
      {count !== undefined && unit && (
        <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
          {count} {unit}
        </span>
      )}
    </div>
  );
}
