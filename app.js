document.addEventListener('DOMContentLoaded', function () {
    const upperBtn = document.getElementById('upper-btn');
    const lowerBtn = document.getElementById('lower-btn');
    const textInput = document.getElementById('text-input');
    const statusDiv = document.getElementById('status');
    const manualCopyBtn = document.getElementById('manual-copy-btn');
  
    let currentCase = 'upper';
    let isProgrammaticUpdate = false;
    let statusTimeout = null;
  
    // Start empty (no prefilled text)
    textInput.value = '';
  
    upperBtn.addEventListener('click', function () {
      currentCase = 'upper';
      upperBtn.classList.add('active');
      lowerBtn.classList.remove('active');
      convertAndCopy();
    });
  
    lowerBtn.addEventListener('click', function () {
      currentCase = 'lower';
      lowerBtn.classList.add('active');
      upperBtn.classList.remove('active');
      convertAndCopy();
    });
  
    textInput.addEventListener('paste', function () {
      setTimeout(convertAndCopy, 10);
    });
  
    textInput.addEventListener('input', function () {
      if (isProgrammaticUpdate) return;
      convertAndCopy();
    });
  
    manualCopyBtn.addEventListener('click', async function () {
      const ok = await copyToClipboard(textInput.value);
      if (ok) {
        showStatus('Copied! ✅', 'success');
        setManualCopyVisible(false);
      } else {
        showStatus('Copy blocked 😕 Try selecting text then copy.', 'error');
      }
    });
  
    async function convertAndCopy() {
      const text = textInput.value;
  
      if (!text.trim()) {
        showStatus('Please paste some text', 'error');
        setManualCopyVisible(false);
        return;
      }
  
      const convertedText =
        currentCase === 'upper' ? text.toUpperCase() : text.toLowerCase();
  
      // Update textarea content to converted text
      if (text !== convertedText) {
        isProgrammaticUpdate = true;
        textInput.value = convertedText;
        isProgrammaticUpdate = false;
      }
  
      // Try auto-copy
      const ok = await copyToClipboard(convertedText);
  
      if (ok) {
        showStatus('Text auto-copied to clipboard! ✅', 'success');
        setManualCopyVisible(false);
      } else {
        // Safari / permission case -> show manual red button
        showStatus('Auto-copy blocked. Tap the red button to copy 👇', 'error');
        setManualCopyVisible(true);
      }
    }
  
    function setManualCopyVisible(visible) {
      manualCopyBtn.style.display = visible ? 'inline-block' : 'none';
    }
  
    async function copyToClipboard(text) {
      // Modern clipboard API (works best on HTTPS + user gesture)
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text);
          return true;
        }
      } catch (e) {
        // fall back below
      }
  
      // Fallback (often works when triggered by a click/tap)
      try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textarea);
        return success;
      } catch (e) {
        return false;
      }
    }
  
    function showStatus(message, type) {
      if (statusTimeout) clearTimeout(statusTimeout);
  
      statusDiv.textContent = message;
      statusDiv.className = 'status ' + type;
      statusDiv.style.display = 'block';
  
      statusTimeout = setTimeout(() => {
        statusDiv.style.display = 'none';
      }, 2500);
    }
  });