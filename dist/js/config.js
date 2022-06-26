export const DEFAULTS = {
  styleTagId: 'dom-x-ray',
  rootSelector: 'html',

  includeBackground: true,
  backgroundColor: '#70BBFF',
  backgroundOpacity: 0.03,

  includeOutline: true,
  outlineColor: '#FF69B4',
  outlineOpacity: 0.25,

  includeText: true,
  textColor: '#FF69B4',
  textOpacity: 1.0,

  includeBorder: true,
  borderColor: '#FF69B4',
  borderOpacity: 1.0,

  includeImages: true,
  imageOpacity: 0.8,

  includeRoot: true,
  includeDescendants: true,
  includePseudo: true,
  useImportant: true,
};

export async function saveOptions(options) {
  return new Promise((resolve) => {
    chrome.storage.sync.set({ options }, resolve);
  });
}

export async function getOptions() {
  return new Promise((resolve) => {
    chrome.storage.sync.get('options', (results) => {
      resolve(Object.keys(results).length > 0 ? results.options : DEFAULTS);
    });
  });
}
