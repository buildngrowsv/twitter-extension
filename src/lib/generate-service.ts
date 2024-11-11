interface GenerationPrompt {
  content: string;
  title: string;
  url: string;
}

export async function generateTweetIdeas(recentPages: GenerationPrompt[]) {
  // Here you would integrate with an AI service (OpenAI, etc)
  // For now, returning mock data
  return {
    ideas: [
      {
        id: Date.now().toString(),
        content: `Just read "${recentPages[0]?.title}": ${recentPages[0]?.content.slice(0, 50)}... 🧵`,
        isThread: true,
        isStarred: false,
        thread: [
          "1/ Key takeaways...",
          "2/ Important points...",
          "3/ Final thoughts..."
        ]
      }
    ]
  };
} 