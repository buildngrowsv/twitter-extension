import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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

  const selectedPrompt = promptVersions.find(v => v.id === selectedVersion);

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
        <Label>Prompt Version</Label>
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
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default SettingsScreen;