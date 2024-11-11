import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface KnowledgeBaseEntry {
  id: string;
  type: 'website' | 'file' | 'note';
  content: string;
  title: string;
}

function KnowledgeBase() {
  const [filter, setFilter] = useState<'all' | 'website' | 'file' | 'note'>('all');
  const [entries, setEntries] = useState<KnowledgeBaseEntry[]>([
    {
      id: '1',
      type: 'website',
      content: 'Interesting article about AI',
      title: 'ai.example.com'
    },
    {
      id: '2',
      type: 'note',
      content: 'Ideas for improving productivity',
      title: 'Productivity Notes'
    }
  ]);

  const filteredEntries = filter === 'all' 
    ? entries 
    : entries.filter(entry => entry.type === filter);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Select
          value={filter}
          onValueChange={(value: any) => setFilter(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="website">Websites</SelectItem>
            <SelectItem value="file">Files</SelectItem>
            <SelectItem value="note">Notes</SelectItem>
          </SelectContent>
        </Select>
        
        <Button>Add Entry</Button>
      </div>

      <div className="space-y-2">
        {filteredEntries.map((entry) => (
          <Card key={entry.id} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{entry.title}</h3>
                <p className="text-sm text-muted-foreground">{entry.content}</p>
              </div>
              <span className="text-sm text-muted-foreground capitalize">
                {entry.type}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default KnowledgeBase;