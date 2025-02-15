const COLORS = {
  DARK: {
    BODY: {
      TEXT: '#F8F8F2',
      BACKGROUND: '#282A36'
    },
    PRE: {
      TEXT: '#E1E1E1',
      BACKGROUND: '#1A1B23',
      SCROLLBAR: {
        THUMB: '#BD93F9',
        TRACK: '#1A1B23'
      }
    },
    CODE: {
      TEXT: '#BD93F9'
    },
    BLOCKQUOTE: {
      TEXT: '#BD93F9',
      BORDER: '#BD93F9',
      BACKGROUND: '#2A2B3C'
    },
    WRAPPER: {
      OUTLINE: '#BD93F9'
    },
    NAVIGATION: {
      BACKGROUND: '#1A1B23',
      TEXT: '#E1E1E1',
      HOVER: {
        TEXT: '#BD93F9',
        BACKGROUND: '#343746'
      },
      ACTIVE: {
        TEXT: '#BD93F9',
        BACKGROUND: '#343746'
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
        TEXT: '#BD93F9',
        BORDER: '#343746'
      },
      H2: {
        TEXT: '#9580E8',
        BORDER: '#343746'
      },
      H3: {
        TEXT: '#7B6AD8'
      }
    },
    LINK_ICON: {
      COLOR: '#BD93F9'
    }
  },
  LIGHT: {
    BODY: {
      TEXT: '#333',
      BACKGROUND: '#FAFAFA'
    },
    PRE: {
      TEXT: '#333',
      BACKGROUND: '#F5F5F5',
      SCROLLBAR: {
        THUMB: '#6B4BFF',
        TRACK: '#F5F5F5'
      }
    },
    CODE: {
      TEXT: '#6B4BFF'
    },
    BLOCKQUOTE: {
      TEXT: '#6B4BFF',
      BORDER: '#6B4BFF',
      BACKGROUND: '#F5F2FF'
    },
    WRAPPER: {
      OUTLINE: '#6B4BFF'
    },
    NAVIGATION: {
      BACKGROUND: '#F5F5F5',
      TEXT: '#333',
      HOVER: {
        TEXT: '#6B4BFF',
        BACKGROUND: '#F5F2FF'
      },
      ACTIVE: {
        TEXT: '#6B4BFF',
        BACKGROUND: '#F5F2FF'
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
        TEXT: '#6B4BFF',
        BORDER: '#E6E6EE'
      },
      H2: {
        TEXT: '#5B45D6',
        BORDER: '#E6E6EE'
      },
      H3: {
        TEXT: '#4B3AB3'
      }
    },
    LINK_ICON: {
      COLOR: '#6B4BFF'
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
  return bodyColor === 'rgb(40, 42, 54)' || bodyColor === '#282A36';
}

function updateTheme(isDark, colors) {
  const theme = isDark ? colors.DARK : colors.LIGHT;

  document.body.style.color = theme.BODY.TEXT;
  document.body.style.backgroundColor = theme.BODY.BACKGROUND;
  document.body.style.transition = 'all 0.3s ease';
  document.body.style.fontFamily = '"JetBrains Mono", monospace';

  const preTags = document.getElementsByTagName('pre');
  for (let pre of preTags) {
    pre.style.backgroundColor = theme.PRE.BACKGROUND;
    pre.style.color = theme.PRE.TEXT;
    pre.style.fontFamily = '"JetBrains Mono", monospace';
    
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
      code.style.fontFamily = '"JetBrains Mono", monospace';
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
    navigation.style.padding = '15px 20px';
    navigation.style.borderRadius = '12px';
    navigation.style.boxShadow = isDark 
      ? '0 4px 12px rgba(0, 0, 0, 0.3)' 
      : '0 4px 12px rgba(0, 0, 0, 0.1)';
    navigation.style.maxHeight = 'calc(100vh - 50px)';
    navigation.style.overflowY = 'auto';
    navigation.style.marginLeft = '30px';
    navigation.style.transition = 'all 0.3s ease';
    navigation.style.fontFamily = '"JetBrains Mono", monospace';

    const links = navigation.getElementsByTagName('a');
    for (let link of links) {
      link.style.color = theme.NAVIGATION.TEXT;
      link.style.textDecoration = 'none';
      link.style.display = 'block';
      link.style.padding = '8px 12px';
      link.style.margin = '3px 0';
      link.style.borderRadius = '6px';
      link.style.transition = 'all 0.2s ease';
      link.style.fontSize = '0.95em';
      link.style.letterSpacing = '0.3px';
      link.style.fontFamily = '"JetBrains Mono", monospace';

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

  // Создаем и добавляем стили для заголовков
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    h1 {
      position: relative;
    }
    h1::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 3px;
      background: linear-gradient(90deg, 
        ${theme.HEADINGS.H1.TEXT} 0%, 
        ${theme.HEADINGS.H1.BORDER} 100%
      );
      transform-origin: left;
      transition: transform 0.3s ease;
    }
    h1:hover::after {
      transform: scaleX(1.02);
    }

    h2 {
      position: relative;
    }
    h2::after {
      content: '';
      position: absolute;
      left: 15%;
      bottom: 0;
      width: 70%;
      height: 2px;
      background: linear-gradient(90deg, 
        transparent 0%,
        ${theme.HEADINGS.H2.TEXT} 50%,
        transparent 100%
      );
      transform: scaleX(0.95);
      transition: transform 0.3s ease;
    }
    h2:hover::after {
      transform: scaleX(1);
    }

    h3 {
      position: relative;
      display: inline-block;
    }
    h3::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: -2px;
      width: 100%;
      height: 1px;
      background: ${theme.HEADINGS.H3.TEXT};
      transform: scaleX(0);
      transition: transform 0.3s ease;
    }
    h3:hover::after {
      transform: scaleX(1);
    }
  `;

  // Удаляем старые стили, если они есть
  const oldStyle = document.getElementById('theme-styles');
  if (oldStyle) {
    oldStyle.remove();
  }

  // Добавляем новые стили
  styleSheet.id = 'theme-styles';
  document.head.appendChild(styleSheet);

  const h1Tags = document.getElementsByTagName('h1');
  for (let h1 of h1Tags) {
    h1.style.color = theme.HEADINGS.H1.TEXT;
    h1.style.fontSize = '2.5em';
    h1.style.fontWeight = '700';
    h1.style.marginBottom = '0.7em';
    h1.style.paddingBottom = '0.3em';
    h1.style.letterSpacing = '-0.5px';
    h1.style.transition = 'all 0.3s ease';
    h1.style.fontFamily = '"JetBrains Mono", monospace';
  }

  const h2Tags = document.getElementsByTagName('h2');
  for (let h2 of h2Tags) {
    h2.style.color = theme.HEADINGS.H2.TEXT;
    h2.style.fontSize = '2em';
    h2.style.fontWeight = '600';
    h2.style.marginTop = '1.5em';
    h2.style.marginBottom = '0.5em';
    h2.style.paddingBottom = '0.3em';
    h2.style.fontFamily = '"JetBrains Mono", monospace';
  }

  const h3Tags = document.getElementsByTagName('h3');
  for (let h3 of h3Tags) {
    h3.style.color = theme.HEADINGS.H3.TEXT;
    h3.style.fontSize = '1.5em';
    h3.style.fontWeight = '600';
    h3.style.marginTop = '1.3em';
    h3.style.marginBottom = '0.4em';
    h3.style.fontFamily = '"JetBrains Mono", monospace';
  }

  const linkIcons = document.getElementsByClassName('octicon-link');
  for (let icon of linkIcons) {
    icon.style.color = theme.LINK_ICON.COLOR;
  }
} 