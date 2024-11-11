import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Star, Edit2, Trash2, ChevronRight } from 'lucide-react';
import type { TweetIdeaType } from './MainScreen';
import { cn } from '@/lib/utils';

interface TweetIdeaProps {
  idea: TweetIdeaType;
  onDelete: (id: string) => void;
  onStar: (id: string) => void;
  onEdit: (id: string, content: string) => void;
}

function TweetIdea({ idea, onDelete, onStar, onEdit }: TweetIdeaProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(idea.content);
  const [showThread, setShowThread] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(idea.content);
  };

  const handleEdit = () => {
    onEdit(idea.id, editContent);
    setIsEditing(false);
  };

  if (showThread && idea.isThread) {
    return (
      <Card className="p-4 space-y-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowThread(false)}
          className="mb-2"
        >
          ← Back
        </Button>
        {idea.thread?.map((tweet, index) => (
          <Card
            key={index}
            className="p-3 cursor-pointer hover:bg-accent"
            onClick={() => navigator.clipboard.writeText(tweet)}
          >
            {tweet}
          </Card>
        ))}
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "p-4 hover:bg-accent/50 transition-colors",
        !isEditing && "cursor-pointer"
      )}
      onClick={!isEditing ? handleCopy : undefined}
    >
      {isEditing ? (
        <div className="space-y-2">
          <Input
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full"
          />
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={handleEdit}>
              Save
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-start justify-between">
          <div className="flex-1">{idea.content}</div>
          <div className="flex items-center space-x-2 ml-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onStar(idea.id);
              }}
            >
              <Star
                className={cn(
                  "h-4 w-4",
                  idea.isStarred && "fill-yellow-400 text-yellow-400"
                )}
              />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(idea.id);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            {idea.isThread && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowThread(true);
                }}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}

export default TweetIdea;