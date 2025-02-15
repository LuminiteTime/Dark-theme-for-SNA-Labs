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
    NAVIGATION: {
      BACKGROUND: '#1E1E1E',
      TEXT: '#E1E1E1',
      HOVER: {
        TEXT: '#50FA7B',
        BACKGROUND: '#2A2A2A'
      },
      ACTIVE: {
        TEXT: '#50FA7B',
        BACKGROUND: '#2A2A2A'
      }
    },
    POPUP: {
      BACKGROUND: '#1E1E1E',
      TEXT: '#E1E1E1'
    },
    TOGGLE: {
      BACKGROUND: '#6B4BFF',
      HOVER: 'rgba(107, 75, 255, 0.5)'
    },
    HEADINGS: {
      H1: {
        TEXT: '#50FA7B',
        BORDER: '#2A3A1B'
      },
      H2: {
        TEXT: '#A5EC60',
        BORDER: '#2A3A1B'
      },
      H3: {
        TEXT: '#E1E1E1'
      }
    },
    LINK_ICON: {
      COLOR: '#50FA7B'
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
    NAVIGATION: {
      BACKGROUND: '#F5F5F5',
      TEXT: '#333',
      HOVER: {
        TEXT: '#0033CC',
        BACKGROUND: '#E6E6EE'
      },
      ACTIVE: {
        TEXT: '#0033CC',
        BACKGROUND: '#E6E6EE'
      }
    },
    POPUP: {
      BACKGROUND: '#1E1E1E',
      TEXT: '#E1E1E1'
    },
    TOGGLE: {
      BACKGROUND: '#6B4BFF',
      HOVER: 'rgba(107, 75, 255, 0.5)'
    },
    HEADINGS: {
      H1: {
        TEXT: '#0033CC',
        BORDER: '#E6E6EE'
      },
      H2: {
        TEXT: '#000080',
        BORDER: '#E6E6EE'
      },
      H3: {
        TEXT: '#333'
      }
    },
    LINK_ICON: {
      COLOR: '#0033CC'
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

  const navigation = document.getElementById('ui-toc-affix');
  if (navigation) {
    navigation.style.backgroundColor = theme.NAVIGATION.BACKGROUND;
    navigation.style.padding = '15px';
    navigation.style.borderRadius = '8px';
    navigation.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
    navigation.style.maxHeight = 'calc(100vh - 50px)';
    navigation.style.overflowY = 'auto';
    navigation.style.marginLeft = '30px';

    const links = navigation.getElementsByTagName('a');
    for (let link of links) {
      link.style.color = theme.NAVIGATION.TEXT;
      link.style.textDecoration = 'none';
      link.style.display = 'block';
      link.style.padding = '5px 10px';
      link.style.margin = '2px 0';
      link.style.borderRadius = '4px';
      link.style.transition = 'all 0.2s ease';

      link.addEventListener('mouseenter', () => {
        link.style.color = theme.NAVIGATION.HOVER.TEXT;
        link.style.backgroundColor = theme.NAVIGATION.HOVER.BACKGROUND;
      });
      link.addEventListener('mouseleave', () => {
        if (!link.classList.contains('active')) {
          link.style.color = theme.NAVIGATION.TEXT;
          link.style.backgroundColor = 'transparent';
        }
      });

      if (link.classList.contains('active')) {
        link.style.color = theme.NAVIGATION.ACTIVE.TEXT;
        link.style.backgroundColor = theme.NAVIGATION.ACTIVE.BACKGROUND;
      }
    }

    navigation.style.scrollbarWidth = 'thin';
    navigation.style.scrollbarColor = `${theme.PRE.SCROLLBAR.THUMB} ${theme.PRE.SCROLLBAR.TRACK}`;
    
    navigation.style.cssText += `
      &::-webkit-scrollbar {
        width: 8px;
      }
      &::-webkit-scrollbar-track {
        background: ${theme.PRE.SCROLLBAR.TRACK};
      }
      &::-webkit-scrollbar-thumb {
        background: ${theme.PRE.SCROLLBAR.THUMB};
        border-radius: 4px;
      }
    `;
  }

  const h1Tags = document.getElementsByTagName('h1');
  for (let h1 of h1Tags) {
    h1.style.color = theme.HEADINGS.H1.TEXT;
    h1.style.fontSize = '2.5em';
    h1.style.fontWeight = '600';
    h1.style.marginBottom = '0.7em';
    h1.style.paddingBottom = '0.3em';
    h1.style.borderBottom = `2px solid ${theme.HEADINGS.H1.BORDER}`;
  }

  const h2Tags = document.getElementsByTagName('h2');
  for (let h2 of h2Tags) {
    h2.style.color = theme.HEADINGS.H2.TEXT;
    h2.style.fontSize = '2em';
    h2.style.fontWeight = '600';
    h2.style.marginTop = '1.5em';
    h2.style.marginBottom = '0.5em';
    h2.style.paddingBottom = '0.3em';
    h2.style.borderBottom = `1px solid ${theme.HEADINGS.H2.BORDER}`;
  }

  const h3Tags = document.getElementsByTagName('h3');
  for (let h3 of h3Tags) {
    h3.style.color = theme.HEADINGS.H3.TEXT;
    h3.style.fontSize = '1.5em';
    h3.style.fontWeight = '600';
    h3.style.marginTop = '1.3em';
    h3.style.marginBottom = '0.4em';
  }

  const linkIcons = document.getElementsByClassName('octicon-link');
  for (let icon of linkIcons) {
    icon.style.color = theme.LINK_ICON.COLOR;
  }
} 