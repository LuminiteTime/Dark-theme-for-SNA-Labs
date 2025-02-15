document.addEventListener('DOMContentLoaded', function() {
  const toggle = document.getElementById('themeToggle');
  
  // Проверяем текущую тему при открытии popup
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

// Функция для определения текущей темы
function getCurrentTheme() {
  const bodyColor = window.getComputedStyle(document.body).color;
  // Если цвет текста белый, значит тема тёмная
  return bodyColor === 'rgb(255, 255, 255)';
}

function updateTheme(isDark) {
  if (isDark) {
    document.body.style.color = '#fff';
    document.body.style.backgroundColor = '#333';
  } else {
    document.body.style.color = '#333';
    document.body.style.backgroundColor = '#fff';
  }
} 