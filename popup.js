document.addEventListener('DOMContentLoaded', function() {
  const toggle = document.getElementById('themeToggle');
  
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const tab = tabs[0];
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: getCurrentTheme,
    }, (results) => {
      if (results && results[0]) {
        toggle.checked = results[0].result;
      }
    });
  });

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

function getCurrentTheme() {
  const bodyColor = window.getComputedStyle(document.body).color;
  return bodyColor === 'rgb(255, 255, 255)';
}

function updateTheme(isDark) {
  if (isDark) {
    document.body.style.color = '#fff';
    document.body.style.backgroundColor = '#333';
    const preTags = document.getElementsByTagName('pre');
    for (let pre of preTags) {
      pre.style.backgroundColor = '#1E1E1E';
      pre.style.color = '#E1E1E1';
    }
    const blockquotes = document.getElementsByTagName('blockquote');
    for (let blockquote of blockquotes) {
      blockquote.style.color = '#E1E1E1';
      blockquote.style.borderLeft = '.25em solid #6B4BFF';
    }
  } else {
    document.body.style.color = '#333';
    document.body.style.backgroundColor = '#fff';
    const preTags = document.getElementsByTagName('pre');
    for (let pre of preTags) {
      pre.style.backgroundColor = '#f5f5f5';
      pre.style.color = '#333';
    }
    const blockquotes = document.getElementsByTagName('blockquote');
    for (let blockquote of blockquotes) {
      blockquote.style.color = '#777';
      blockquote.style.borderLeft = '.25em solid #6B4BFF';
    }
  }
} 