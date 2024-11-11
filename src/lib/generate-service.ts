import { generateWithAssistant } from './openai-service';

interface GenerationPrompt {
  content: string;
  title: string;
  url: string;
  timestamp: number;
}

interface PromptVersion {
  id: string;
  name: string;
  prompt: string;
}

interface SnippetType {
  type: 'Website' | 'Article' | 'Video' | 'Idea' | 'Knowledgebase';
  description: string;
}

export async function generateTweetIdeas(recentPages: GenerationPrompt[]) {
  try {
    // Get prompt settings from storage
    const settings = await chrome.storage.local.get(['selectedVersion', 'promptVersions', 'snippetTypes']);
    const selectedVersion = settings.selectedVersion || '1';
    const promptVersions: PromptVersion[] = settings.promptVersions || [{
      id: '1',
      name: 'Default Version',
      prompt: `Come up with a catchy and fun tweet or twitter thread as appropriate given the below information.

[snippet_description]
[snippet]

Be sure to keep it fun, short and sweet`
    }];
    const snippetTypes: SnippetType[] = settings.snippetTypes || [];

    // Get the selected prompt template
    const promptTemplate = promptVersions.find(v => v.id === selectedVersion)?.prompt || promptVersions[0].prompt;

    // Generate prompts for each page
    const generatedIdeas = await Promise.all(recentPages.map(async (page) => {
      const snippetType = 'Website'; // For now, assuming all are websites
      const snippetDescription = snippetTypes.find(t => t.type === snippetType)?.description || 
        'Below is a website I visited and a snippet about the website';

      const prompt = promptTemplate
        .replace('[snippet_description]', snippetDescription)
        .replace('[snippet]', `Title: ${page.title}\nURL: ${page.url}\nContent: ${page.content.slice(0, 500)}...`);

      const response = await generateWithAssistant(prompt);
      
      // Parse the response into tweet format
      // Assuming response is in format: "Tweet: [content]" or "Thread: 1/[content] 2/[content]..."
      const isThread = response.toLowerCase().startsWith('thread:');
      if (isThread) {
        const tweets = response.split('\n').filter(t => t.trim());
        return {
          id: Date.now().toString(),
          content: tweets[0].replace('Thread:', '').trim(),
          isThread: true,
          isStarred: false,
          thread: tweets.slice(1)
        };
      }

      return {
        id: Date.now().toString(),
        content: response.replace('Tweet:', '').trim(),
        isThread: false,
        isStarred: false
      };
    }));

    return {
      ideas: generatedIdeas
    };
  } catch (error) {
    console.error('Error generating tweet ideas:', error);
    throw error;
  }
} 