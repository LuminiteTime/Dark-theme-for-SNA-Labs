const COLORS = {
  DARK: {
    BODY: {
      TEXT: '#FFF',
      BACKGROUND: '#333'
    },
    PRE: {
      TEXT: '#E1E1E1',
      BACKGROUND: '#1E1E1E',
      SCROLLBAR: {
        THUMB: '#50FA7B',
        TRACK: '#1E1E1E'
      }
    },
    CODE: {
      TEXT: '#50FA7B'
    },
    BLOCKQUOTE: {
      TEXT: '#A5EC60',
      BORDER: '#A5EC60',
      BACKGROUND: '#2A3A1B'
    },
    WRAPPER: {
      OUTLINE: '#50FA7B'
    },
    POPUP: {
      BACKGROUND: '#1E1E1E',
      TEXT: '#E1E1E1'
    },
    TOGGLE: {
      BACKGROUND: '#6B4BFF',
      HOVER: 'rgba(107, 75, 255, 0.5)'
    }
  },
  LIGHT: {
    BODY: {
      TEXT: '#333',
      BACKGROUND: '#FFF'
    },
    PRE: {
      TEXT: '#333',
      BACKGROUND: '#F5F5F5',
      SCROLLBAR: {
        THUMB: '#0033CC',
        TRACK: '#F5F5F5',
        HOVER: '#999'
      }
    },
    CODE: {
      TEXT: '#0033CC'
    },
    BLOCKQUOTE: {
      TEXT: '#000080',
      BORDER: '#000080',
      BACKGROUND: '#E6E6EE'
    },
    WRAPPER: {
      OUTLINE: '#0033CC'
    },
    POPUP: {
      BACKGROUND: '#1E1E1E',
      TEXT: '#E1E1E1'
    },
    TOGGLE: {
      BACKGROUND: '#6B4BFF',
      HOVER: 'rgba(107, 75, 255, 0.5)'
    }
  }
};

document.addEventListener('DOMContentLoaded', function() {
  const toggle = document.getElementById('themeToggle');
  
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const tab = tabs[0];
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: getCurrentTheme
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
        args: [toggle.checked, COLORS]
      });
    });
  });
});

function getCurrentTheme() {
  const bodyColor = window.getComputedStyle(document.body).backgroundColor;
  return bodyColor === 'rgb(51, 51, 51)' || bodyColor === '#333';
}

function updateTheme(isDark, colors) {
  const theme = isDark ? colors.DARK : colors.LIGHT;

  document.body.style.color = theme.BODY.TEXT;
  document.body.style.backgroundColor = theme.BODY.BACKGROUND;

  const preTags = document.getElementsByTagName('pre');
  for (let pre of preTags) {
    pre.style.backgroundColor = theme.PRE.BACKGROUND;
    pre.style.color = theme.PRE.TEXT;
    
    pre.style.overflowX = 'auto';
    pre.style.scrollbarWidth = 'thin';
    pre.style.scrollbarColor = `${theme.PRE.SCROLLBAR.THUMB} ${theme.PRE.SCROLLBAR.TRACK}`;
    
    pre.style.cssText += `
      &::-webkit-scrollbar {
        height: 8px;
      }
      &::-webkit-scrollbar-track {
        background: ${theme.PRE.SCROLLBAR.TRACK};
      }
      &::-webkit-scrollbar-thumb {
        background: ${theme.PRE.SCROLLBAR.THUMB};
        border-radius: 4px;
      }
    `;
    
    const code = pre.querySelector('code');
    if (code) {
      code.style.color = theme.CODE.TEXT;
    }
  }

  const codeWrappers = document.getElementsByClassName('code-block-wrapper');
  for (let wrapper of codeWrappers) {
    wrapper.style.outline = 'none';
    wrapper.addEventListener('mouseenter', () => {
      wrapper.style.outline = `2px solid ${theme.WRAPPER.OUTLINE}`;
    });
    wrapper.addEventListener('mouseleave', () => {
      wrapper.style.outline = 'none';
    });
  }
  
  const blockquotes = document.getElementsByTagName('blockquote');
  for (let blockquote of blockquotes) {
    blockquote.style.color = theme.BLOCKQUOTE.TEXT;
    blockquote.style.borderLeft = `.25em solid ${theme.BLOCKQUOTE.BORDER}`;
    blockquote.style.backgroundColor = theme.BLOCKQUOTE.BACKGROUND;
  }
} 