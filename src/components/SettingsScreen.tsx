import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PromptVersion {
  id: string;
  name: string;
  prompt: string;
}

interface SnippetType {
  type: 'Website' | 'Article' | 'Video' | 'Idea' | 'Knowledgebase';
  description: string;
}

function SettingsScreen() {
  const [retentionDays, setRetentionDays] = useState('7');
  const [selectedVersion, setSelectedVersion] = useState('1');
  const [promptVersions, setPromptVersions] = useState<PromptVersion[]>([
    {
      id: '1',
      name: 'Default Version',
      prompt: `Come up with a catchy and fun tweet or twitter thread as appropriate given the below information.

[snippet_description]
[snippet]

Be sure to keep it fun, short and sweet`
    }
  ]);
  const { toast } = useToast();

  const [snippetTypes, setSnippetTypes] = useState<SnippetType[]>([
    {
      type: 'Website',
      description: 'Below is a website I visited and a snippet about the website'
    },
    {
      type: 'Article',
      description: 'Below is a snippet of an article I read'
    },
    {
      type: 'Video',
      description: 'Below is a description of a video I watched'
    },
    {
      type: 'Idea',
      description: 'Below is an idea for a tweet I had'
    },
    {
      type: 'Knowledgebase',
      description: 'Below is a snippet from a knowledgebase about me'
    }
  ]);

  useEffect(() => {
    // Load settings from storage
    chrome.storage.local.get(
      ['retentionDays', 'selectedVersion', 'promptVersions', 'snippetTypes'],
      (result) => {
        if (result.retentionDays) setRetentionDays(result.retentionDays);
        if (result.selectedVersion) setSelectedVersion(result.selectedVersion);
        if (result.promptVersions) setPromptVersions(result.promptVersions);
        if (result.snippetTypes) setSnippetTypes(result.snippetTypes);
      }
    );
  }, []);

  useEffect(() => {
    // Save settings to storage
    chrome.storage.local.set({
      retentionDays,
      selectedVersion,
      promptVersions,
      snippetTypes
    });
  }, [retentionDays, selectedVersion, promptVersions, snippetTypes]);

  const selectedPrompt = promptVersions.find(v => v.id === selectedVersion);

  const handleCreateVersion = () => {
    const newVersion: PromptVersion = {
      id: Date.now().toString(),
      name: `Version ${promptVersions.length + 1}`,
      prompt: ''
    };
    setPromptVersions(prev => [...prev, newVersion]);
    setSelectedVersion(newVersion.id);
    
    toast({
      title: "Success",
      description: "New version created",
    });
  };

  const handleDuplicateVersion = () => {
    if (!selectedPrompt) return;
    
    const newVersion: PromptVersion = {
      id: Date.now().toString(),
      name: `${selectedPrompt.name} (Copy)`,
      prompt: selectedPrompt.prompt
    };
    setPromptVersions(prev => [...prev, newVersion]);
    setSelectedVersion(newVersion.id);
    
    toast({
      title: "Success",
      description: "Version duplicated",
    });
  };

  const handleClearStorage = async () => {
    try {
      await chrome.storage.local.clear();
      toast({
        title: "Storage Cleared",
        description: "All extension data has been cleared",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear storage",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Data Retention (days)</Label>
        <Input
          type="number"
          value={retentionDays}
          onChange={(e) => setRetentionDays(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Prompt Version</Label>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCreateVersion}
            >
              <Plus className="h-4 w-4 mr-1" />
              New Version
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDuplicateVersion}
              disabled={!selectedPrompt}
            >
              <Copy className="h-4 w-4 mr-1" />
              Duplicate
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleClearStorage}
            >
              Clear All Data
            </Button>
          </div>
        </div>
        <Select
          value={selectedVersion}
          onValueChange={setSelectedVersion}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select version" />
          </SelectTrigger>
          <SelectContent>
            {promptVersions.map((version) => (
              <SelectItem key={version.id} value={version.id}>
                {version.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Prompt Template</Label>
        <Textarea
          value={selectedPrompt?.prompt}
          onChange={(e) => {
            setPromptVersions(versions =>
              versions.map(v =>
                v.id === selectedVersion
                  ? { ...v, prompt: e.target.value }
                  : v
              )
            );
          }}
          className="min-h-[200px]"
          placeholder="Enter prompt template..."
        />
      </div>

      <div className="space-y-4">
        <Label>Snippet Type Descriptions</Label>
        {snippetTypes.map((type, index) => (
          <div key={index} className="space-y-2">
            <Label>{type.type}</Label>
            <Textarea
              value={type.description}
              onChange={(e) => {
                setSnippetTypes(types =>
                  types.map(t =>
                    t.type === type.type
                      ? { ...t, description: e.target.value }
                      : t
                  )
                );
              }}
              placeholder={`Enter description for ${type.type}...`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default SettingsScreen;