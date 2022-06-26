import { injectStyles, removeStyles } from './styles.js';
import { getOptions } from './config.js';

const tabs = {};

async function activate(tabId) {
  const options = await getOptions();
  chrome.action.setIcon({ path: '../img/icon-on.png', tabId });
  chrome.scripting.executeScript({
    target: { tabId },
    func: injectStyles,
    args: [options],
  });
}

async function deactivate(tabId, styleTagId) {
  if (!styleTagId) {
    const options = await getOptions();
    styleTagId = options.styleTagId;
  }
  chrome.action.setIcon({ path: '../img/icon-off.png', tabId });
  chrome.scripting.executeScript({
    target: { tabId },
    func: removeStyles,
    args: [styleTagId],
  });
}

chrome.action.onClicked.addListener((tab) => {
  const tabId = tab.id;
  tabs[tabId] = tabs[tabId] === 'active' ? 'inactive' : 'active';
  if (tabs[tabId] === 'active') {
    activate(tabId);
  } else {
    deactivate(tabId);
  }
});

chrome.webNavigation.onCompleted.addListener((data) => {
  const { tabId } = data;
  if (tabs[tabId] === 'active') {
    activate(tabId);
  }
});

chrome.storage.onChanged.addListener((changes) => {
  const oldStyleTagId = changes.options.oldValue.styleTagId;
  for (const tabId in tabs) {
    if (tabs[tabId] === 'active') {
      deactivate(parseInt(tabId), oldStyleTagId);
      activate(parseInt(tabId));
    }
  }
});
