document.addEventListener('DOMContentLoaded', function() {
  const toggle = document.getElementById('themeToggle');
  
  toggle.addEventListener('change', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      const tab = tabs[0];
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: updateTheme,
        args: [toggle.checked]
      });
    });
  });
});

function updateTheme(isDark) {
  if (isDark) {
    document.body.style.color = '#fff';
    document.body.style.backgroundColor = '#333';
  } else {
    document.body.style.color = '#333';
    document.body.style.backgroundColor = '#fff';
  }
} 