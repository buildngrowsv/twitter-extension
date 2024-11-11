import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const ASSISTANT_ID = 'asst_diACOYQozYcv01tTGdVToehH';

export async function generateWithAssistant(prompt: string) {
  try {
    // Log the initial request details
    console.log('OpenAI API Request:', {
      assistantId: ASSISTANT_ID,
      prompt: prompt,
      timestamp: new Date().toISOString()
    });

    // Create a thread
    const thread = await openai.beta.threads.create();
    console.log('Thread created:', thread);

    // Add a message to the thread
    const message = await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: prompt
    });
    console.log('Message added:', message);

    // Run the assistant
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: ASSISTANT_ID
    });
    console.log('Run started:', run);

    // Wait for completion
    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    while (runStatus.status !== 'completed') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      console.log('Run status:', runStatus.status);
      
      if (runStatus.status === 'failed') {
        console.error('Run failed:', runStatus);
        throw new Error('Assistant run failed');
      }
    }

    // Get the messages
    const messages = await openai.beta.threads.messages.list(thread.id);
    const lastMessage = messages.data[0];
    
    console.log('Final response:', {
      threadId: thread.id,
      runId: run.id,
      response: lastMessage.content[0].text.value
    });

    return lastMessage.content[0].text.value;
  } catch (error) {
    console.error('Error generating with assistant:', error);
    throw error;
  }
} 