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
  // Get page content
  const content = document.body.innerText;
  const title = document.title;
  const url = window.location.href;

  // Store the captured content
  chrome.storage.local.set({
    [`page_${Date.now()}`]: {
      content,
      title,
      url,
      timestamp: Date.now()
    }
  });
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