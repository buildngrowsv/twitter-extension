import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface KnowledgeBaseEntry {
  id: string;
  type: 'website' | 'file' | 'note';
  content: string;
  title: string;
  timestamp: number;
}

function KnowledgeBase() {
  const [filter, setFilter] = useState<'all' | 'website' | 'file' | 'note'>('all');
  const [entries, setEntries] = useState<KnowledgeBaseEntry[]>([]);
  const [newEntry, setNewEntry] = useState<Partial<KnowledgeBaseEntry>>({
    type: 'note',
    title: '',
    content: ''
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load entries from storage
    chrome.storage.local.get(['knowledgeBaseEntries'], (result) => {
      if (result.knowledgeBaseEntries) {
        setEntries(result.knowledgeBaseEntries);
      }
    });
  }, []);

  useEffect(() => {
    // Add error handling and logging
    const saveEntries = async () => {
      try {
        await chrome.storage.local.set({ knowledgeBaseEntries: entries });
        console.log('Saved entries:', entries);
      } catch (error) {
        console.error('Error saving entries:', error);
      }
    };
    
    saveEntries();
  }, [entries]);

  const handleAddEntry = () => {
    if (!newEntry.title || !newEntry.content) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const entry: KnowledgeBaseEntry = {
      id: Date.now().toString(),
      type: newEntry.type as 'website' | 'file' | 'note',
      content: newEntry.content,
      title: newEntry.title,
      timestamp: Date.now()
    };

    setEntries(prev => [entry, ...prev]);
    setNewEntry({ type: 'note', title: '', content: '' });
    setIsDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Entry added successfully",
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      setNewEntry(prev => ({
        ...prev,
        type: 'file',
        title: file.name,
        content: text
      }));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to read file",
        variant: "destructive",
      });
    }
  };

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
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Entry</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Knowledge Base Entry</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Select
                value={newEntry.type}
                onValueChange={(value: any) => setNewEntry(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="note">Note</SelectItem>
                  <SelectItem value="file">File</SelectItem>
                  <SelectItem value="website">Website</SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder="Title"
                value={newEntry.title}
                onChange={(e) => setNewEntry(prev => ({ ...prev, title: e.target.value }))}
              />

              {newEntry.type === 'file' ? (
                <Input
                  type="file"
                  onChange={handleFileUpload}
                  accept=".txt,.md"
                />
              ) : (
                <Textarea
                  placeholder="Content"
                  value={newEntry.content}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, content: e.target.value }))}
                  className="min-h-[200px]"
                />
              )}

              <Button onClick={handleAddEntry} className="w-full">
                Add Entry
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2 max-h-[500px] overflow-y-auto">
        {filteredEntries.map((entry) => (
          <Card key={entry.id} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{entry.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{entry.content}</p>
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