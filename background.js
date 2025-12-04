// Handle redirects directly using webNavigation (no declarativeNetRequest needed)
chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
  try {
    if (!details.url || details.frameId !== 0) return;
    
    // Check if this is a Google Calendar URL that should be intercepted
    if (details.url.includes('calendar.google.com/calendar/render') && details.url.includes('action=TEMPLATE')) {
      const settings = await chrome.storage.sync.get(['redirectOrigin', 'enabled']);
      
      // Check if extension is enabled
      if (settings.enabled === false) {
        return; // Extension is disabled, allow normal navigation
      }
      
      const redirectUrl = settings.redirectOrigin || 'http://localhost:3000/event/add-to';
      
      try {
        // Parse the Google Calendar URL and extract query parameters
        const url = new URL(details.url);
        const params = new URLSearchParams(url.search);
        
        // Build the redirect URL with all query parameters from the Google Calendar URL
        const handlerUrl = new URL(redirectUrl);
        params.forEach((value, key) => {
          handlerUrl.searchParams.append(key, value);
        });
        
        // Redirect directly to the handler URL before the Google Calendar page loads
        await chrome.tabs.update(details.tabId, { url: handlerUrl.toString() });
      } catch (e) {
        console.error('Error parsing Google Calendar URL:', e);
        // Fallback: redirect with original URL as query parameter
        const handlerUrl = `${redirectUrl}?original=${encodeURIComponent(details.url)}`;
        await chrome.tabs.update(details.tabId, { url: handlerUrl });
      }
    }
  } catch (e) {
    console.error('Error in redirect handler:', e);
  }
});

// Create context menu item for settings
function createContextMenu() {
  // Remove existing menu item if it exists, then create a new one
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "open-settings",
      title: "Open Settings",
      contexts: ["action"] // Only show when right-clicking the extension icon
    });
  });
}

chrome.runtime.onInstalled.addListener(async () => {
  createContextMenu();
});

// Handle context menu click
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "open-settings") {
    chrome.tabs.create({ url: chrome.runtime.getURL("settings.html") });
  }
});

// Also create context menu on startup (in case it wasn't created)
createContextMenu();
