
(async () => {
  const statusEl = document.getElementById('status');
  const btnGoogle = document.getElementById('btn-google');
  const btnCustom = document.getElementById('btn-custom');
  const settingsLink = document.getElementById('settings-link');

  // Try to get original URL from query parameter first (for bounce redirects)
  const urlParams = new URLSearchParams(window.location.search);
  let original = urlParams.get('original');

  // If not in query params, try to get from current tab's session storage
  // Retry a few times in case storage hasn't been set yet
  if (!original) {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tabs.length) { statusEl.textContent = 'No active tab.'; return; }

    const tabId = tabs[0].id;
    console.log('Chooser loaded, tabId:', tabId);
    
    // Try multiple times with delays to catch storage that might be set asynchronously
    // Also check if URL was updated by background script
    // Increase retries and check URL more frequently since background script updates it
    for (let attempt = 0; attempt < 20; attempt++) {
      // ALWAYS check URL first - background script might have updated it
      const currentUrlParams = new URLSearchParams(window.location.search);
      const urlOriginal = currentUrlParams.get('original');
      if (urlOriginal) {
        console.log(`Attempt ${attempt + 1}: Found original URL in updated URL:`, urlOriginal);
        original = urlOriginal;
        break;
      }
      
      // Check pending_orig FIRST (it's set before tab creation)
      const pendingData = await chrome.storage.session.get('pending_orig');
      if (pendingData.pending_orig) {
        console.log(`Attempt ${attempt + 1}: Found original URL in pending_orig key:`, pendingData.pending_orig);
        original = pendingData.pending_orig;
        break;
      }
      
      const key = `orig_${tabId}`;
      console.log(`Attempt ${attempt + 1}: Looking for key:`, key);
      const data = await chrome.storage.session.get(key);
      console.log('Storage data for key:', data);
      original = data[key];
      
      if (original) {
        console.log('Found original URL from storage:', original);
        break;
      }
      
      // Also check all storage keys - maybe tab ID changed or there's a mismatch
      const allData = await chrome.storage.session.get(null);
      
      // Look for any key that contains an original URL (fallback)
      if (!original) {
        for (const [key, value] of Object.entries(allData)) {
          if (typeof value === 'string' && value.includes('calendar.google.com/calendar/render')) {
            console.log('Found original URL in different key:', key, value);
            original = value;
            break;
          }
        }
      }
      
      if (original) break;
      
      // Wait a bit before retrying - check URL more frequently early on
      if (attempt < 19) {
        const delay = attempt < 10 ? 30 : 50; // Check every 30ms for first 10 attempts
        console.log(`Original URL not found, waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    // If we found it in storage but not in URL, update the URL to include it
    if (original && !urlParams.get('original')) {
      console.log('Found original URL in storage, updating URL. Original:', original);
      // Clean up the pending_orig key since we've used it
      await chrome.storage.session.remove('pending_orig');
      const newUrl = `${window.location.href.split('?')[0]}?original=${encodeURIComponent(original)}`;
      console.log('Updating URL to:', newUrl);
      window.location.href = newUrl;
      return;
    }
  }

  if (!original) { 
    console.error('Original URL not found after all retries');
    // Show error but don't return immediately - give it one more chance
    statusEl.textContent = 'Loading original URL...';
    // Wait a bit more and check one last time
    await new Promise(resolve => setTimeout(resolve, 200));
    const finalUrlParams = new URLSearchParams(window.location.search);
    original = finalUrlParams.get('original');
    if (!original) {
      const finalPending = await chrome.storage.session.get('pending_orig');
      if (finalPending.pending_orig) {
        original = finalPending.pending_orig;
      }
    }
    if (!original) {
      statusEl.textContent = 'Original URL not found.'; 
      return;
    }
  }

  statusEl.textContent = '';

  // Get redirect origin from settings (default to localhost:3000)
  const settings = await chrome.storage.sync.get(['redirectOrigin']);
  const redirectOrigin = settings.redirectOrigin || 'http://localhost:3000';

  const encoded = encodeURIComponent(original);
  const localHandler = `${redirectOrigin}/event/add-to?original=${encoded}`;
  const localBounce = `${redirectOrigin}/event/add-to-bounce?original=${encoded}`;
  console.log('Original URL:', original);
  console.log('Bounce URL:', localBounce);
  console.log('Handler URL:', localHandler);
  
  // Use onclick handlers to create tabs programmatically
  // This ensures we can store the original URL before the tab is created
  btnGoogle.onclick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Creating tab with bounce URL:', localBounce);
    
    // Store the original URL in pending_orig BEFORE creating the tab
    // This ensures it's available immediately when chooser.html loads
    await chrome.storage.session.set({ pending_orig: original });
    console.log('Stored original URL in pending_orig BEFORE creating tab');
    
    // Create the tab
    const newTab = await chrome.tabs.create({ url: localBounce });
    console.log('Created tab with ID:', newTab.id);
    
    // Store the original URL for this new tab immediately with multiple keys for reliability
    const key = `orig_${newTab.id}`;
    
    // Store with tab ID key AND keep pending_orig
    await chrome.storage.session.set({ 
      [key]: original,
      pending_orig: original  // Keep this set
    });
    console.log('Stored original URL for tab:', newTab.id, 'key:', key, 'value:', original);
    
    // Store it multiple times with delays to ensure it persists through redirects
    setTimeout(async () => {
      await chrome.storage.session.set({ 
        [key]: original,
        pending_orig: original
      });
      console.log('Re-stored original URL after 100ms delay');
    }, 100);
    
    setTimeout(async () => {
      await chrome.storage.session.set({ 
        [key]: original,
        pending_orig: original
      });
      console.log('Re-stored original URL after 300ms delay');
    }, 300);
    
    // Verify storage
    const verify = await chrome.storage.session.get([key, 'pending_orig']);
    console.log('Storage verification:', verify);
  };
  
  btnCustom.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    chrome.tabs.create({ url: localHandler });
  };


  // Open settings page
  settingsLink.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    chrome.tabs.create({ url: chrome.runtime.getURL('settings.html') });
  };

})();
