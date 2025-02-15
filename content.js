chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.theme === 'dark') {
    document.body.style.color = '#fff';
    document.body.style.backgroundColor = '#333';
  } else {
    document.body.style.color = '#333';
    document.body.style.backgroundColor = '#fff';
  }
}); 