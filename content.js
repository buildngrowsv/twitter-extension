// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'captureContent') {
    const content = document.body.innerText;
    sendResponse({ content });
  }
});