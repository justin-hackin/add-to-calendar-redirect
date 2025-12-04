(async () => {
  const form = document.getElementById('settings-form');
  const redirectOriginInput = document.getElementById('redirect-origin');
  const enabledToggle = document.getElementById('enabled-toggle');
  const statusEl = document.getElementById('status');

  // Load existing settings
  const data = await chrome.storage.sync.get(['redirectOrigin', 'enabled']);
  if (data.redirectOrigin) {
    redirectOriginInput.value = data.redirectOrigin;
  } else {
    // Set default value with full path
    redirectOriginInput.value = 'http://localhost:3000/event/add-to';
  }
  
  // Set toggle state (default to enabled)
  enabledToggle.checked = data.enabled !== false;

  // Save settings
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const redirectOrigin = redirectOriginInput.value.trim();
    const enabled = enabledToggle.checked;
    
    // Basic validation
    if (!redirectOrigin) {
      showStatus('Please enter a redirect origin URL.', 'error');
      return;
    }

    // Validate URL format
    try {
      const url = new URL(redirectOrigin);
      if (!url.protocol || (!url.protocol.startsWith('http') && !url.protocol.startsWith('https'))) {
        throw new Error('Invalid protocol');
      }
    } catch (error) {
      showStatus('Please enter a valid URL (e.g., http://localhost:3000/event/add-to)', 'error');
      return;
    }

    // Save to Chrome storage
    try {
      await chrome.storage.sync.set({ redirectOrigin, enabled });
      showStatus('Settings saved successfully!', 'success');
    } catch (error) {
      showStatus('Error saving settings: ' + error.message, 'error');
    }
  });

  function showStatus(message, type) {
    statusEl.textContent = message;
    statusEl.className = type;
    setTimeout(() => {
      statusEl.className = '';
      statusEl.style.display = 'none';
    }, 3000);
  }
})();
