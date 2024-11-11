import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Filter, Star, Edit2, Trash2, ChevronRight } from 'lucide-react';
import TweetIdea from './TweetIdea';
import { cn } from '@/lib/utils';

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
  const [tweetIdeas, setTweetIdeas] = useState<TweetIdeaType[]>([
    {
      id: '1',
      content: 'Just learned about the amazing world of Chrome extensions! 🚀 #WebDev',
      isThread: false,
      isStarred: true
    },
    {
      id: '2',
      content: 'Thread about building better software',
      isThread: true,
      isStarred: false,
      thread: [
        '1/ Building better software starts with understanding user needs',
        '2/ Always write tests for your code',
        '3/ Document everything clearly'
      ]
    }
  ]);

  const handleGenerateIdeas = () => {
    // Implementation for generating new ideas
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

      <div className="space-y-2">
        {filteredIdeas.map((idea) => (
          <TweetIdea
            key={idea.id}
            idea={idea}
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