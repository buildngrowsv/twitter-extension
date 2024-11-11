// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    // Check if monitoring is enabled
    chrome.storage.local.get(['monitoring'], (result) => {
      if (result.monitoring) {
        // Inject content script to capture page content
        chrome.scripting.executeScript({
          target: { tabId },
          function: capturePageContent
        });
      }
    });
  }
});

function capturePageContent() {
  try {
    const content = document.body.innerText;
    const title = document.title;
    const url = window.location.href;

    console.log('Capturing page:', { title, url });

    // Get existing knowledge base entries
    chrome.storage.local.get(['knowledgeBaseEntries'], (result) => {
      const entries = result.knowledgeBaseEntries || [];
      
      // Create new entry in the correct format
      const newEntry = {
        id: Date.now().toString(),
        type: 'website',
        content: content,
        title: title,
        timestamp: Date.now(),
        url: url // Optional: add URL if you want to reference it later
      };

      // Add to knowledge base entries
      entries.unshift(newEntry); // Add to beginning of array
      
      // Save back to storage
      chrome.storage.local.set({ 
        knowledgeBaseEntries: entries,
        visitedPages: [...(result.visitedPages || []), newEntry] // Keep visitedPages for tweet generation
      });
    });
  } catch (error) {
    console.error('Error capturing page:', error);
  }
}

// Clean up old data periodically
chrome.alarms.create('cleanup', { periodInMinutes: 1440 }); // Once per day

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'cleanup') {
    chrome.storage.local.get(['retentionDays'], (result) => {
      const retentionDays = result.retentionDays || 7;
      const cutoff = Date.now() - (retentionDays * 24 * 60 * 60 * 1000);

      chrome.storage.local.get(null, (items) => {
        Object.entries(items).forEach(([key, value]) => {
          if (key.startsWith('page_') && value.timestamp < cutoff) {
            chrome.storage.local.remove(key);
          }
        });
      });
    });
  }
});