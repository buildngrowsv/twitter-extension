import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Star } from 'lucide-react';
import TweetIdea from './TweetIdea';
import { cn } from '@/lib/utils';
import { generateTweetIdeas } from '@/lib/generate-service';
import { useToast } from '@/hooks/use-toast';

export interface TweetIdeaType {
  id: string;
  content: string;
  isThread: boolean;
  isStarred: boolean;
  thread?: string[];
}

function MainScreen() {
  const [monitoring, setMonitoring] = useState(false);
  const [showStarredOnly, setShowStarredOnly] = useState(false);
  const [tweetIdeas, setTweetIdeas] = useState<TweetIdeaType[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    // Load monitoring state
    chrome.storage.local.get(['monitoring'], (result) => {
      setMonitoring(result.monitoring || false);
    });

    // Load saved tweet ideas
    chrome.storage.local.get(['tweetIdeas'], (result) => {
      if (result.tweetIdeas) {
        setTweetIdeas(result.tweetIdeas);
      }
    });
  }, []);

  useEffect(() => {
    // Save monitoring state
    chrome.storage.local.set({ monitoring });
  }, [monitoring]);

  useEffect(() => {
    // Save tweet ideas
    chrome.storage.local.set({ tweetIdeas });
  }, [tweetIdeas]);

  const handleGenerateIdeas = async () => {
    try {
      // Get recent pages from storage
      const items = await chrome.storage.local.get(null);
      const pages = Object.entries(items)
        .filter(([key]) => key.startsWith('page_'))
        .map(([_, value]) => value as any)
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 5); // Get 5 most recent pages

      const { ideas } = await generateTweetIdeas(pages);
      setTweetIdeas(current => [...ideas, ...current]);
      
      toast({
        title: "Ideas Generated",
        description: `Generated ${ideas.length} new tweet ideas`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate ideas. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedIds.size > 0) {
        setTweetIdeas(ideas => ideas.filter(idea => !selectedIds.has(idea.id)));
        setSelectedIds(new Set());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIds]);

  const handleSelect = (id: string, selected: boolean) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (selected) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  };

  const filteredIdeas = showStarredOnly 
    ? tweetIdeas.filter(idea => idea.isStarred)
    : tweetIdeas;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Switch
            checked={monitoring}
            onCheckedChange={setMonitoring}
          />
          <Label>Website Monitoring</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowStarredOnly(!showStarredOnly)}
            className={cn(showStarredOnly && "bg-yellow-100")}
          >
            <Star className="h-4 w-4" />
          </Button>
          <Button onClick={handleGenerateIdeas}>
            Generate Ideas
          </Button>
        </div>
      </div>

      <div className="space-y-2 max-h-[500px] overflow-y-auto">
        {filteredIdeas.map((idea) => (
          <TweetIdea
            key={idea.id}
            idea={idea}
            isSelected={selectedIds.has(idea.id)}
            onSelect={handleSelect}
            onDelete={(id) => setTweetIdeas(ideas => ideas.filter(i => i.id !== id))}
            onStar={(id) => setTweetIdeas(ideas => 
              ideas.map(i => i.id === id ? { ...i, isStarred: !i.isStarred } : i)
            )}
            onEdit={(id, content) => setTweetIdeas(ideas =>
              ideas.map(i => i.id === id ? { ...i, content } : i)
            )}
          />
        ))}
      </div>
    </div>
  );
}

export default MainScreen;