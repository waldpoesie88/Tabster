async function applyDisplayMode() {
  let settings = await chrome.storage.local.get({ displayMode: "sidepanel" });
  if (chrome.sidePanel && chrome.sidePanel.setPanelBehavior) {
    if (settings.displayMode === "sidepanel") {
      await chrome.action.setPopup({ popup: "" });
      await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
    } else {
      await chrome.action.setPopup({ popup: "popup.html" });
      await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: false });
    }
  }
}

chrome.runtime.onInstalled.addListener(() => applyDisplayMode());

chrome.runtime.onStartup.addListener(() => {
  applyDisplayMode();
  restoreGreenTabs();
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.displayMode) {
    applyDisplayMode();
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "switchToTab") {
    chrome.windows.update(message.windowId, { focused: true }, () => {
      chrome.tabs.update(message.tabId, { active: true });
    });
  }
});

function getRootDomain(hostname) {
  let cleanHost = hostname.replace(/^www\./, '');
  let parts = cleanHost.split('.');
  if (parts.length <= 2) return cleanHost;
  
  let secondLevel = parts[parts.length - 2];
  let topLevel = parts[parts.length - 1];
  if (topLevel.length === 2 && ['co', 'com', 'org', 'net', 'gov', 'edu', 'ac'].includes(secondLevel)) {
    return parts.slice(-3).join('.');
  }
  return parts.slice(-2).join('.');
}

function isTabProtected(tab, whitelist) {
  if (!whitelist || whitelist.length === 0) return false;

  if (whitelist.some(entry => entry.type === 'tab' && entry.tabId === tab.id)) {
    return true;
  }

  if (tab.url) {
    try {
      let parsed = new URL(tab.url);
      let tabRoot = getRootDomain(parsed.hostname);
      return whitelist.some(entry => {
        let rawRule = typeof entry === 'string' ? entry : entry.rule;
        let ruleDomain = rawRule.replace(/^\*\./, '');
        return ruleDomain === tabRoot || parsed.hostname === ruleDomain || parsed.hostname.endsWith('.' + ruleDomain);
      });
    } catch (e) {}
  }
  return false;
}

// Бережно будим только индивидуально защищенные (зеленые) вкладки при старте браузера
async function restoreGreenTabs() {
  let data = await chrome.storage.local.get({ whitelist: [] });
  let whitelist = data.whitelist || [];
  let tabRules = whitelist.filter(entry => entry.type === 'tab');
  if (tabRules.length === 0) return;

  let allTabs = await chrome.tabs.query({});
  let updated = false;

  for (let entry of tabRules) {
    let targetTab = allTabs.find(t => t.id === entry.tabId);
    if (!targetTab && entry.url) {
      targetTab = allTabs.find(t => t.url === entry.url);
      if (targetTab) {
        entry.tabId = targetTab.id;
        entry.rule = `tab_${targetTab.id}`;
        updated = true;
      }
    }

    if (targetTab && targetTab.discarded) {
      await chrome.tabs.reload(targetTab.id);
      await new Promise(resolve => setTimeout(resolve, 1200));
    }
  }

  if (updated) {
    await chrome.storage.local.set({ whitelist: whitelist });
  }
}

async function checkAndSuspendTabs() {
  let settings = await chrome.storage.local.get({ 
    autoSleepMinutes: 120,
    whitelist: []
  });
  
  let limitMinutes = Number(settings.autoSleepMinutes);
  if (limitMinutes === 0) return;

  let whitelist = settings.whitelist || [];
  let timeLimitMs = limitMinutes * 60 * 1000;
  let allTabs = await chrome.tabs.query({ active: false, audible: false, pinned: false, discarded: false });
  let now = Date.now();

  for (let tab of allTabs) {
    if (tab.url && !tab.url.startsWith('edge://') && !tab.url.startsWith('chrome://')) {
      if (isTabProtected(tab, whitelist)) continue;

      let idleTime = now - (tab.lastAccessed || now);
      if (idleTime > timeLimitMs) {
        await chrome.tabs.discard(tab.id);
      }
    }
  }
}

chrome.tabs.onRemoved.addListener(async (closedTabId, removeInfo) => {
  if (removeInfo.isWindowClosing) return;
  
  let settings = await chrome.storage.local.get({ whitelist: [] });
  let whitelist = settings.whitelist || [];
  let updated = whitelist.filter(entry => !(entry.type === 'tab' && entry.tabId === closedTabId));
  if (updated.length !== whitelist.length) {
    await chrome.storage.local.set({ whitelist: updated });
  }
});

chrome.alarms.get("memoryCheck", (alarm) => {
  if (!alarm) {
    chrome.alarms.create("memoryCheck", { periodInMinutes: 5 });
  }
});
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "memoryCheck") checkAndSuspendTabs();
});
