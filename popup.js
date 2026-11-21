let cachedTabs = { audio: [], active: [], sleep: [] };
let whitelistItems = [];
const fallbackIcon = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23888'%3E%3Cpath d='M8 1a7 7 0 100 14A7 7 0 008 1zm0 1.5a5.5 5.5 0 014.9 3H3.1A5.5 5.5 0 018 2.5zM2.5 8c0-.5.1-1 .2-1.5h10.6c.1.5.2 1 .2 1.5s-.1 1-.2 1.5H2.7c-.1-.5-.2-1-.2-1.5zm.6 3h9.8a5.5 5.5 0 01-9.8 0z'/%3E%3C/svg%3E";
// Иконка локального PDF (красный лист с желтой папкой в углу)
const localPdfIcon = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Crect x='1' y='1' width='11' height='14' rx='2' fill='%23d93025'/%3E%3Ctext x='6.5' y='9.5' font-family='Arial,sans-serif' font-size='4.8' font-weight='bold' fill='white' text-anchor='middle'%3EPDF%3C/text%3E%3Cpath d='M7 10.5h3l1 1h4v3.5a1 1 0 01-1 1H7a1 1 0 01-1-1v-3.5a1 1 0 011-1z' fill='%23fbbc04' stroke='%23fff' stroke-width='0.6'/%3E%3C/svg%3E";
// Иконка любого другого локального файла (серый лист с желтой папкой)
const localFileIcon = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Crect x='1' y='1' width='11' height='14' rx='2' fill='%23757575'/%3E%3Cpath d='M3.5 5h6M3.5 7.5h6M3.5 10h3' stroke='white' stroke-width='1.2' stroke-linecap='round'/%3E%3Cpath d='M7 10.5h3l1 1h4v3.5a1 1 0 01-1 1H7a1 1 0 01-1-1v-3.5a1 1 0 011-1z' fill='%23fbbc04' stroke='%23fff' stroke-width='0.6'/%3E%3C/svg%3E";
// Иконка системных страниц браузера (edge://, chrome://) — синяя шестеренка
const systemPageIcon = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%230078d4'%3E%3Cpath d='M9.4 1.5l.4 1.6c.4.2.8.4 1.1.7l1.6-.5 1.4 2.4-1.2 1.1c.1.4.1.8.1 1.2s0 .8-.1 1.2l1.2 1.1-1.4 2.4-1.6-.5c-.3.3-.7.5-1.1.7l-.4 1.6H6.6l-.4-1.6c-.4-.2-.8-.4-1.1-.7l-1.6.5-1.4-2.4 1.2-1.1c-.1-.4-.1-.8-.1-1.2s0-.8.1-1.2L2.1 5.7l1.4-2.4 1.6.5c.3-.3.7-.5 1.1-.7l.4-1.6h2.8zM8 5.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5z'/%3E%3C/svg%3E";


let currentLang = "en";

const translations = {
  ru: {
    tipToSidepanel: "Переключить в режим боковой панели",
    tipToPopup: "Переключить в режим всплывающего окна",
    confirmCleanAll: "Все незащищенные активные вкладки ({count} шт.) будут усыплены. Продолжить?",
    searchPlaceholder: "Поиск по названию или URL...",
    settingsTitle: "Настройки",
    lblLang: "Язык / Language:",
    lblFont: "Размер шрифта:",
    lblTimer: "Автоусыпление:",
    fontTiny: "Крошечный",
    fontSmall: "Мелкий",
    fontMedium: "Средний",
    fontLarge: "Крупный",
    fontHuge: "Огромный",
    timer30: "30 минут",
    timer60: "1 час",
    timer120: "2 часа",
    timer0: "Отключено",
    lblWlHeader: "Защищенные",
    searchWlPlaceholder: "Поиск по защищенным...",
    wlEmpty: "Список защищенных пуст",
    wlNotFound: "Ничего не найдено",
    wlRemove: "Снять защиту",
    wlWholeSite: "Весь сайт",
    titleAudio: "🔊 Шумящие",
    titleHeavy: "⏱️ Активные",
    titleSleep: "💤 Спящие",
    btnNew: "Новая ＋",
    btnClean: "Усыпить все",
    watching: "смотрим",
    justNow: "только что",
    min: "м",
    hour: "ч",
    tipMute: "Заглушить вкладку",
    tipUnmute: "Включить звук обратно",
       tipWlNone: "Защитить вкладку от усыпления",
    tipWlPage: "Вкладка защищена от усыпления в текущей сессии",
    tipWlDomain: "Все активные вкладки домена {domain} защищены от усыпления в текущей сессии",
    tipSleep: "Усыпить вкладку",
    tipClose: "Закрыть насовсем"
  },
  en: {
    tipToSidepanel: "Switch to side panel mode",
    tipToPopup: "Switch to popup window mode",
    confirmCleanAll: "All unprotected active tabs ({count}) will be suspended. Continue?",
    searchPlaceholder: "Search by title or URL...",
    settingsTitle: "Settings",
    lblLang: "Language / Язык:",
    lblFont: "Font size:",
    lblTimer: "Auto-suspend:",
    fontTiny: "Tiny",
    fontSmall: "Small",
    fontMedium: "Medium",
    fontLarge: "Large",
    fontHuge: "Huge",
    timer30: "30 minutes",
    timer60: "1 hour",
    timer120: "2 hours",
    timer0: "Disabled",
    lblWlHeader: "Protected",
    searchWlPlaceholder: "Search protected...",
    wlEmpty: "Protected list is empty",
    wlNotFound: "Nothing found",
    wlRemove: "Remove protection",
    wlWholeSite: "Entire site",
    titleAudio: "🔊 Playing",
    titleHeavy: "⏱️ Active",
    titleSleep: "💤 Suspended",
    btnNew: "New ＋",
    btnClean: "Suspend all",
    watching: "active",
    justNow: "just now",
    min: "m",
    hour: "h",
    tipMute: "Mute tab",
    tipUnmute: "Unmute tab",
    tipWlNone: "Protect tab from suspension",
    tipWlPage: "Tab protected from suspension during current session",
    tipWlDomain: "All active {domain} tabs are protected from suspension during current session",
    tipSleep: "Suspend tab",
    tipClose: "Close tab"
  }
};

// Выделяем корневой домен (например, из ru.wikipedia.org получаем wikipedia.org)
function getRootDomain(hostname) {
  let cleanHost = hostname.replace(/^www\./, '');
  let parts = cleanHost.split('.');
  if (parts.length <= 2) return cleanHost;
  
  // Учитываем составные зоны вроде .co.uk, .com.au, .org.ru
  let secondLevel = parts[parts.length - 2];
  let topLevel = parts[parts.length - 1];
  if (topLevel.length === 2 && ['co', 'com', 'org', 'net', 'gov', 'edu', 'ac'].includes(secondLevel)) {
    return parts.slice(-3).join('.');
  }
  return parts.slice(-2).join('.');
}

function parseTabUrl(url) {
  try {
    let parsed = new URL(url);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      let rootDomain = getRootDomain(parsed.hostname);
      return {
        cleanUrl: parsed.origin + parsed.pathname + parsed.search,
        domainRule: `*.${rootDomain}`,
        hostname: rootDomain
      };
    }
  } catch (e) {}
  return null;
}

// Проверяем статус защиты: передаем весь объект вкладки tab
function getProtectionStatus(tab) {
  let hasTab = whitelistItems.some(item => item.type === 'tab' && item.tabId === tab.id);
  if (hasTab) return 'page'; // Индивидуальная защита всегда приоритетнее общей

  let info = parseTabUrl(tab.url);
  if (info) {
    let hasDomain = whitelistItems.some(item => {
      let ruleDomain = item.rule.replace(/^\*\./, '');
      return ruleDomain === info.hostname || info.hostname.endsWith('.' + ruleDomain);
    });
    if (hasDomain) return 'domain';
  }
  
  return 'none';
}

async function refreshTabsData() {
  let allOpenTabs = await chrome.tabs.query({});
  let openTabMap = new Map(allOpenTabs.map(t => [t.id, t]));

  let needsSave = false;
  let seenKeys = new Set();

  whitelistItems = whitelistItems.filter(item => {
    // 1. Удаляем устаревший формат записей (type === 'page'), который вызывал дубликаты
    if (item.type === 'page') {
      needsSave = true;
      return false;
    }

    // 2. Защита от дубликатов по ID вкладки или по домену
    let uniqueKey = item.type === 'tab' ? `tab_${item.tabId}` : item.rule;
    if (seenKeys.has(uniqueKey)) {
      needsSave = true;
      return false;
    }
    seenKeys.add(uniqueKey);

    // 3. Строгая проверка индивидуальных вкладок
    if (item.type === 'tab') {
      let liveTab = openTabMap.get(item.tabId);
      
      // Если по старому ID вкладка не найдена (например, после перезапуска браузера) — ищем её по сохраненному URL
      if (!liveTab && item.url) {
        liveTab = allOpenTabs.find(t => t.url === item.url);
        if (liveTab) {
          item.tabId = liveTab.id;
          item.rule = `tab_${liveTab.id}`;
          needsSave = true;
        }
      }

      if (!liveTab) {
        needsSave = true;
        return false;
      }

      // Обновляем актуальный URL, заголовок и иконку, пока вкладка жива
      if (liveTab.url && item.url !== liveTab.url) {
        item.url = liveTab.url;
        needsSave = true;
      }
      if (liveTab.title && item.title !== liveTab.title) {
        item.title = liveTab.title;
        needsSave = true;
      }
      if (liveTab.favIconUrl && item.favIconUrl !== liveTab.favIconUrl) {
        item.favIconUrl = liveTab.favIconUrl;
        needsSave = true;
      }
    }
    return true;
  });

  if (needsSave) {
    await chrome.storage.local.set({ whitelist: whitelistItems });
  }

  cachedTabs.audio = allOpenTabs.filter(t => t.audible);
  
  cachedTabs.active = allOpenTabs.filter(tab => {
    if (tab.audible || tab.pinned || tab.discarded || !tab.url) return false;
    return !tab.url.startsWith('edge://settings') && !tab.url.startsWith('chrome://settings');
  });
  cachedTabs.active.sort((a, b) => (b.lastAccessed || 0) - (a.lastAccessed || 0));

  cachedTabs.sleep = allOpenTabs.filter(tab => {
    if (!tab.discarded || !tab.url) return false;
    return !tab.url.startsWith('edge://settings') && !tab.url.startsWith('chrome://settings');
  });
  cachedTabs.sleep.sort((a, b) => (b.lastAccessed || 0) - (a.lastAccessed || 0));

  let currentQuery = document.getElementById('tab-search').value.toLowerCase().trim();
  updateUILists(currentQuery);
}

let refreshTimeout = null;
function scheduleRefresh() {
  if (refreshTimeout) clearTimeout(refreshTimeout);
  refreshTimeout = setTimeout(() => {
    refreshTabsData();
  }, 120);
}
document.addEventListener('DOMContentLoaded', async () => {
  let settings = await chrome.storage.local.get({
    lang: "en",
    fontSize: "small",
    autoSleepMinutes: 120,
    whitelist: [],
  });

  currentLang = settings.lang;
  whitelistItems = (settings.whitelist || []).map(item => {
    if (typeof item === 'string') {
      return { type: item.startsWith('*.') ? 'domain' : 'page', rule: item, title: item.replace('*.', ''), favIconUrl: '' };
    }
    return item;
  });

  applyFontSize(settings.fontSize);
  applyLanguage(currentLang);

  let selectLang = document.getElementById('setting-lang');
  let selectFont = document.getElementById('setting-font');
  let selectTimer = document.getElementById('setting-timer');

  selectLang.value = settings.lang;
  selectFont.value = settings.fontSize;
  selectTimer.value = String(settings.autoSleepMinutes);

  selectLang.addEventListener('change', async (e) => {
    currentLang = e.target.value;
    await chrome.storage.local.set({ lang: currentLang });
    applyLanguage(currentLang);
    renderWhitelistUI();
    updateUILists(document.getElementById('tab-search').value.toLowerCase().trim());
  });

  selectFont.addEventListener('change', async (e) => {
    let newFont = e.target.value;
    await chrome.storage.local.set({ fontSize: newFont });
    applyFontSize(newFont);
    adjustSidePanelLayout();
  });

  selectTimer.addEventListener('change', async (e) => {
    let newTimer = Number(e.target.value);
    await chrome.storage.local.set({ autoSleepMinutes: newTimer });
  });

  // Переключение режимов: Всплывающее окно <-> Боковая панель
  let modeToggleBtn = document.getElementById('mode-toggle-btn');
  let modeSettings = await chrome.storage.local.get({ displayMode: "sidepanel" });
  
  // Определяем боковую панель по URL-параметру, высоте экрана или настройке по умолчанию
  let isSidePanel = window.location.search.includes('mode=sidepanel') || window.innerHeight > 605 || modeSettings.displayMode === "sidepanel";
  let currentWin = await chrome.windows.getCurrent();

  if (isSidePanel) {
    document.body.classList.add('is-sidepanel');
    if (modeToggleBtn) {
      modeToggleBtn.textContent = '❐';
      modeToggleBtn.title = translations[currentLang].tipToPopup;
    }
  } else {
    if (modeToggleBtn) {
      modeToggleBtn.textContent = '◫';
      modeToggleBtn.title = translations[currentLang].tipToSidepanel;
    }
  }

  if (modeToggleBtn) {
    modeToggleBtn.addEventListener('click', () => {
      if (isSidePanel) {
        // Возвращаем режим всплывающего окна
        chrome.storage.local.set({ displayMode: "popup" });
        chrome.action.setPopup({ popup: "popup.html" });
        if (chrome.sidePanel && chrome.sidePanel.setPanelBehavior) {
          chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: false });
        }
        
        // Вызываем openPopup синхронно в момент клика, затем закрываем панель
        if (chrome.action && chrome.action.openPopup) {
          try {
            chrome.action.openPopup({ windowId: currentWin.id });
          } catch (e) {}
        }
        setTimeout(() => { window.close(); }, 50);
      } else {
        // Включаем постоянный режим боковой панели и открываем её синхронно
        chrome.storage.local.set({ displayMode: "sidepanel" });
        chrome.action.setPopup({ popup: "" });
        if (chrome.sidePanel && chrome.sidePanel.setPanelBehavior) {
          chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
        }
        if (chrome.sidePanel && chrome.sidePanel.open) {
          chrome.sidePanel.open({ windowId: currentWin.id });
        }
        setTimeout(() => { window.close(); }, 50);
      }
    });
  }

  // Автообновление списков в реальном времени без мигания кнопок при смене заголовка (например, в Telegram)
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, updatedTab) => {
    // 1. Если изменился ТОЛЬКО заголовок (например, мигает "Новое сообщение" в Telegram) — обновляем только текст, не перерисовывая кнопки!
    if (changeInfo.title && !changeInfo.status && changeInfo.audible === undefined && changeInfo.discarded === undefined) {
      let row = document.querySelector(`.tab-item[data-tab-id="${tabId}"]`);
      if (row) {
        let titleEl = row.querySelector('.tab-title-text');
        if (titleEl) titleEl.textContent = changeInfo.title;
      }
      // Обновляем заголовок и в кэше
      ['audio', 'active', 'sleep'].forEach(group => {
        let cached = cachedTabs[group].find(t => t.id === tabId);
        if (cached) cached.title = changeInfo.title;
      });
      return;
    }

    // 2. Полное обновление списка делаем только при реальных структурных изменениях
    if (changeInfo.status === 'complete' || changeInfo.audible !== undefined || changeInfo.discarded !== undefined) {
      scheduleRefresh();
    }
  });
  chrome.tabs.onRemoved.addListener(() => scheduleRefresh());
  chrome.tabs.onCreated.addListener(() => scheduleRefresh());
  chrome.tabs.onActivated.addListener(() => scheduleRefresh());

  let settingsBtn = document.getElementById('settings-btn');
  let settingsPanel = document.getElementById('settings-panel');
  let mainView = document.getElementById('main-view');
  let searchInput = document.getElementById('tab-search');

  settingsBtn.addEventListener('click', () => {
    let t = translations[currentLang];
    let isSettingsOpen = settingsPanel.classList.contains('visible');
    if (isSettingsOpen) {
      settingsPanel.classList.remove('visible');
      mainView.classList.remove('hidden');
      settingsBtn.classList.remove('active');
      searchInput.placeholder = t.searchPlaceholder;
      updateUILists(searchInput.value.toLowerCase().trim());
    } else {
      settingsPanel.classList.add('visible');
      mainView.classList.add('hidden');
      settingsBtn.classList.add('active');
      searchInput.placeholder = t.searchWlPlaceholder;
      renderWhitelistUI(searchInput.value.toLowerCase().trim());
    }
  });

  let newTabBtn = document.getElementById('new-tab-btn');
  if (newTabBtn) {
    newTabBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      await chrome.tabs.create({});

      await refreshTabsData();
    });
  }

  let savedQuery = sessionStorage.getItem('tabster_search_query') || "";

  if (searchInput) {
    if (savedQuery) searchInput.value = savedQuery;
    searchInput.focus();
    let strLength = searchInput.value.length;
    searchInput.setSelectionRange(strLength, strLength);

    searchInput.addEventListener('input', (e) => {
      let query = e.target.value.toLowerCase().trim();
      sessionStorage.setItem('tabster_search_query', e.target.value);
      
      // Если открыты настройки — ищем по защищенным; если главный экран — по всем вкладкам
      if (settingsPanel.classList.contains('visible')) {
        renderWhitelistUI(query);
      } else {
        updateUILists(query);
      }
    });
  }

  await refreshTabsData();

  await restoreAccordionState("audio-tabs-list", "arrow-audio", "audio", cachedTabs.audio.length, false);
  await restoreAccordionState("heavy-tabs-list", "arrow-heavy", "active", cachedTabs.active.length, false);
  await restoreAccordionState("sleep-tabs-list", "arrow-sleep", "sleep", cachedTabs.sleep.length, true);

  setupAccordion("header-audio", "audio-tabs-list", "arrow-audio", "audio");
  setupAccordion("header-heavy", "heavy-tabs-list", "arrow-heavy", "active");
  setupAccordion("header-sleep", "sleep-tabs-list", "arrow-sleep", "sleep");
});

function renderWhitelistUI(query = "") {
  let box = document.getElementById('whitelist-box');
  let headerEl = document.getElementById('lbl-wl-header');
  let t = translations[currentLang];

  let filteredItems = whitelistItems.filter(item => {
    if (!query) return true;
    let titleMatch = (item.title || "").toLowerCase().includes(query);
    let ruleMatch = (item.rule || "").toLowerCase().includes(query);
    return titleMatch || ruleMatch;
  });

  if (headerEl) {
    headerEl.textContent = `${t.lblWlHeader} (${filteredItems.length})`;
  }

  box.innerHTML = '';
  if (filteredItems.length === 0) {
    let emptyText = query ? t.wlNotFound : t.wlEmpty;
    box.innerHTML = `<div style="color:#888; padding:6px; text-align:center;">${emptyText}</div>`;
    return;
  }

  filteredItems.forEach(item => {
    let row = document.createElement('div');
    row.className = 'whitelist-item';

    let infoWrap = document.createElement('div');
    infoWrap.className = 'whitelist-info';

    let icon = document.createElement('img');
    icon.className = 'tab-icon';
    let cleanDomain = item.rule.replace('*.', '');
    let domainIcon = 'https://www.google.com' + '/s2/favicons?sz=64&domain=' + cleanDomain;

    icon.src = item.favIconUrl || domainIcon;
    icon.onerror = () => {
      if (icon.src !== domainIcon) {
        icon.src = domainIcon;
      } else {
        icon.onerror = null;
        icon.src = fallbackIcon;
      }
    };

    let nameSpan = document.createElement('span');
    nameSpan.className = 'whitelist-domain';
    if (item.type === 'domain') {
      nameSpan.textContent = `${item.title} (${t.wlWholeSite})`;
    } else {
      nameSpan.textContent = item.title;
    }
    nameSpan.title = item.rule;

    infoWrap.appendChild(icon);
    infoWrap.appendChild(nameSpan);

    let delBtn = document.createElement('button');
    delBtn.className = 'icon-btn close-btn';
    delBtn.innerHTML = '✕';
    delBtn.title = t.wlRemove;

    delBtn.addEventListener('click', async () => {
      whitelistItems = whitelistItems.filter(entry => entry.rule !== item.rule);
      await chrome.storage.local.set({ whitelist: whitelistItems });
      let currentQ = document.getElementById('tab-search').value.toLowerCase().trim();
      renderWhitelistUI(currentQ);
      updateUILists(currentQ);
    });

    row.appendChild(infoWrap);
    row.appendChild(delBtn);
    box.appendChild(row);
  });
}

function applyFontSize(size) {
  document.body.classList.remove('font-small', 'font-medium', 'font-large', 'font-xlarge', 'font-xxlarge');
  document.body.classList.add(`font-${size}`);
}

function setupAccordion(headerId, listId, arrowId, storageKey) {
  let header = document.getElementById(headerId);
  if (!header) return;

  header.addEventListener('click', async (e) => {
    if (e.target.tagName === 'BUTTON') return;
    let list = document.getElementById(listId);
    let arrow = document.getElementById(arrowId);
    let key = `tabster_expanded_${storageKey}`;
    
    if (list && arrow) {
      if (list.classList.contains('collapsed')) {
        list.classList.remove('collapsed');
        list.style.display = 'block';
        arrow.textContent = "▼";
        await chrome.storage.session.set({ [key]: true });
      } else {
        list.classList.add('collapsed');
        list.style.display = 'none';
        arrow.textContent = "►";
        await chrome.storage.session.set({ [key]: false });
      }
    }
    requestAnimationFrame(() => adjustSidePanelLayout());
  });
}

function applyLanguage(lang) {
  let t = translations[lang];
  let settingsPanel = document.getElementById('settings-panel');
  let isSettingsOpen = settingsPanel && settingsPanel.classList.contains('visible');
  
  document.getElementById('tab-search').placeholder = isSettingsOpen ? t.searchWlPlaceholder : t.searchPlaceholder;
  
  let sBtn = document.getElementById('settings-btn');
  sBtn.removeAttribute('data-tooltip');
  sBtn.title = t.settingsTitle;

  document.getElementById('lbl-lang').textContent = t.lblLang;
  document.getElementById('lbl-font').textContent = t.lblFont;
  document.getElementById('lbl-timer').textContent = t.lblTimer;

  document.querySelector('#setting-font option[value="small"]').textContent = t.fontTiny;
  document.querySelector('#setting-font option[value="medium"]').textContent = t.fontSmall;
  document.querySelector('#setting-font option[value="large"]').textContent = t.fontMedium;
  document.querySelector('#setting-font option[value="xlarge"]').textContent = t.fontLarge;
  document.querySelector('#setting-font option[value="xxlarge"]').textContent = t.fontHuge;

  document.querySelector('#setting-timer option[value="30"]').textContent = t.timer30;
  document.querySelector('#setting-timer option[value="60"]').textContent = t.timer60;
  document.querySelector('#setting-timer option[value="120"]').textContent = t.timer120;
  document.querySelector('#setting-timer option[value="0"]').textContent = t.timer0;

  let headerEl = document.getElementById('lbl-wl-header');
  if (headerEl) headerEl.textContent = `${t.lblWlHeader} (${whitelistItems.length})`;

  document.getElementById('title-audio').textContent = t.titleAudio;
  document.getElementById('title-heavy').textContent = t.titleHeavy;
  document.getElementById('title-sleep').textContent = t.titleSleep;
  document.getElementById('new-tab-btn').textContent = t.btnNew;
  document.getElementById('clean-btn').textContent = t.btnClean;

  let mBtn = document.getElementById('mode-toggle-btn');
  if (mBtn) {
    mBtn.removeAttribute('data-tooltip');
    mBtn.title = document.body.classList.contains('is-sidepanel') ? t.tipToPopup : t.tipToSidepanel;
  }

  adjustSidePanelLayout();
}

async function restoreAccordionState(listId, arrowId, storageKey, itemsCount, hideByDefault) {
  let list = document.getElementById(listId);
  let arrow = document.getElementById(arrowId);
  if (!list || !arrow) return;

  // "Шумящие" (audio) всегда должны быть развернуты по умолчанию, чтобы пользователь не пропустил звук
  if (storageKey === "audio") {
    list.classList.remove('collapsed');
    list.style.display = itemsCount > 0 ? 'block' : 'none';
    arrow.textContent = "▼";
    return;
  }

  if (itemsCount === 0) {
    list.classList.add('collapsed');
    list.style.display = 'none';
    arrow.textContent = "►";
    return;
  }

  let key = `tabster_expanded_${storageKey}`;
  let sessionData = await chrome.storage.session.get(key);
  let savedState = sessionData[key];
  
  if (savedState === true || (savedState === undefined && !hideByDefault)) {
    list.classList.remove('collapsed');
    list.style.display = 'block';
    arrow.textContent = "▼";
  } else {
    list.classList.add('collapsed');
    list.style.display = 'none';
    arrow.textContent = "►";
  }
}

function updateUILists(query) {
  let audioList = document.getElementById('audio-tabs-list');
  let audioHeader = document.getElementById('header-audio');
  let audioArrow = document.getElementById('arrow-audio');

  let heavyList = document.getElementById('heavy-tabs-list');
  let heavyHeader = document.getElementById('header-heavy');
  let heavyArrow = document.getElementById('arrow-heavy');

  let sleepList = document.getElementById('sleep-tabs-list');
  let sleepHeader = document.getElementById('header-sleep');
  let sleepArrow = document.getElementById('arrow-sleep');

  let filteredAudio = cachedTabs.audio.filter(tab => matchesQuery(tab, query));
  let filteredActive = cachedTabs.active.filter(tab => matchesQuery(tab, query));
  let filteredSleep = cachedTabs.sleep.filter(tab => matchesQuery(tab, query));

  document.getElementById('count-audio').textContent = `(${filteredAudio.length})`;
  document.getElementById('count-heavy').textContent = `(${filteredActive.length})`;
  document.getElementById('count-sleep').textContent = `(${filteredSleep.length})`;

  // При поиске (query !== "") временно показываем все списки с результатами,
  // но НЕ трогаем класс .collapsed, чтобы после очистки поиска всё вернулось как было!
  if (filteredAudio.length === 0) {
    if (audioList) audioList.style.display = 'none';
    if (audioHeader) audioHeader.style.display = 'none';
  } else {
    if (audioHeader) audioHeader.style.display = 'flex';
    if (audioList) {
      let showAudio = (query !== "") || !audioList.classList.contains('collapsed');
      audioList.style.display = showAudio ? 'block' : 'none';
      if (audioArrow) audioArrow.textContent = showAudio ? "▼" : "►";
      renderTabList(filteredAudio, audioList, "audio");
    }
  }

  if (filteredActive.length === 0) {
    if (heavyList) heavyList.style.display = 'none';
    if (heavyHeader) heavyHeader.style.display = 'none';
  } else {
    if (heavyHeader) heavyHeader.style.display = 'flex';
    if (heavyList) {
      let showHeavy = (query !== "") || !heavyList.classList.contains('collapsed');
      heavyList.style.display = showHeavy ? 'block' : 'none';
      if (heavyArrow) heavyArrow.textContent = showHeavy ? "▼" : "►";
      renderTabList(filteredActive, heavyList, "active");
    }
  }

  if (filteredSleep.length === 0) {
    if (sleepList) sleepList.style.display = 'none';
    if (sleepHeader) sleepHeader.style.display = 'none';
  } else {
    if (sleepHeader) sleepHeader.style.display = 'flex';
    if (sleepList) {
      let showSleep = (query !== "") || !sleepList.classList.contains('collapsed');
      sleepList.style.display = showSleep ? 'block' : 'none';
      if (sleepArrow) sleepArrow.textContent = showSleep ? "▼" : "►";
      renderTabList(filteredSleep, sleepList, "sleep");
    }
  }

  adjustSidePanelLayout();
}

// Динамический расчет идеальной высоты списков в боковой панели без пустоты и вытеснения
function adjustSidePanelLayout() {
  if (!document.body.classList.contains('is-sidepanel')) return;

  let heavyList = document.getElementById('heavy-tabs-list');
  let sleepList = document.getElementById('sleep-tabs-list');
  if (!heavyList || !sleepList) return;

  // Сбрасываем старые ограничения, чтобы узнать реальную высоту контента
  heavyList.style.maxHeight = 'none';
  sleepList.style.maxHeight = 'none';

  // Вычисляем свободную высоту экрана (минус верхняя панель, заголовки секций и отступы)
  let usedByHeaders = 12; // базовые отступы body
  document.querySelectorAll('.top-bar, .section-header, #audio-tabs-list').forEach(el => {
    if (el.offsetParent !== null) {
      usedByHeaders += el.offsetHeight + 4;
    }
  });

  let availableHeight = Math.max(150, window.innerHeight - usedByHeaders);

  let isHeavyOpen = heavyList.offsetParent !== null && !heavyList.classList.contains('collapsed');
  let isSleepOpen = sleepList.offsetParent !== null && !sleepList.classList.contains('collapsed');

  if (isHeavyOpen && !isSleepOpen) {
    // Открыты только активные — забирают весь экран до пола
    heavyList.style.maxHeight = `${availableHeight}px`;
  } else if (!isHeavyOpen && isSleepOpen) {
    // Открыты только спящие — забирают весь экран до пола
    sleepList.style.maxHeight = `${availableHeight}px`;
  } else if (isHeavyOpen && isSleepOpen) {
    // Открыты ОБА списка: смотрим их реальную высоту содержимого
    let heavyNeeded = heavyList.scrollHeight;
    let sleepNeeded = sleepList.scrollHeight;

    if (heavyNeeded + sleepNeeded <= availableHeight) {
      // Оба списка полностью помещаются на экран без скролла!
      heavyList.style.maxHeight = `${heavyNeeded}px`;
      sleepList.style.maxHeight = `${sleepNeeded}px`;
    } else if (sleepNeeded < availableHeight * 0.45) {
      // Спящих мало (например, 2 штуки): отдаем им ровно столько, сколько нужно, а всё остальное — активным!
      sleepList.style.maxHeight = `${sleepNeeded}px`;
      heavyList.style.maxHeight = `${availableHeight - sleepNeeded}px`;
    } else if (heavyNeeded < availableHeight * 0.45) {
      // Активных мало (например, 3 штуки): отдаем им ровно 3 строчки, а всё остальное — спящим!
      heavyList.style.maxHeight = `${heavyNeeded}px`;
      sleepList.style.maxHeight = `${availableHeight - heavyNeeded}px`;
    } else {
      // Оба списка огромные — честно делим доступный экран пополам
      let half = Math.floor(availableHeight / 2);
      heavyList.style.maxHeight = `${half}px`;
      sleepList.style.maxHeight = `${half}px`;
    }
  }
}

window.addEventListener('resize', adjustSidePanelLayout);

function matchesQuery(tab, query) {
  if (!query) return true;
  let title = (tab.title || "").toLowerCase();
  let url = (tab.url || "").toLowerCase();
  return title.includes(query) || url.includes(query);
}

async function saveTabPosition(tab) {
  if (tab.url && (tab.url.startsWith('edge://') || tab.url.startsWith('chrome://'))) return;
  if (tab.url && tab.url.includes('://youtube.com')) {
    try {
      let response = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          let video = document.querySelector('video');
          return video ? Math.floor(video.currentTime) : null;
        }
      });
      let seconds = response?.[0]?.result;
      if (seconds && seconds > 0) {
        let baseUrl = tab.url.split('&t=')[0];
        let separator = baseUrl.includes('?') ? '&' : '?';
        let smartUrl = `${baseUrl}${separator}t=${seconds}s`;
        await chrome.tabs.update(tab.id, { url: smartUrl });
      }
    } catch (e) { console.log("Ошибка сохранения:", e); }
  }
}
function renderTabList(tabs, container, type) {
  let now = Date.now();
  let t = translations[currentLang];
  container.innerHTML = '';
  
  tabs.forEach(tab => {
    let item = document.createElement('div');
    item.className = 'tab-item';
    item.dataset.tabId = tab.id; // Пометка ID вкладки для точечного обновления заголовкаx

    let protection = getProtectionStatus(tab);

    if (tab.active && type === "active") {
      item.classList.add('current-active');
    }

    let infoBlock = document.createElement('div');
    infoBlock.className = 'tab-info';
    
    let icon = document.createElement('img');
    icon.className = 'tab-icon';

    let lowerUrl = (tab.url || '').toLowerCase().split('?')[0].split('#')[0];

    if (lowerUrl.startsWith('file://')) {
      // Локальный файл с диска компьютера
      icon.src = lowerUrl.endsWith('.pdf') ? localPdfIcon : localFileIcon;
    } else if (lowerUrl.startsWith('edge://') || lowerUrl.startsWith('chrome://')) {
      // Системные страницы браузера (расширения, настройки, загрузки)
      icon.src = systemPageIcon;
    } else {
      // Обычный сайт
      let urlInfoForIcon = parseTabUrl(tab.url);
      let siteIcon = urlInfoForIcon 
        ? ('https://www.google.com' + '/s2/favicons?sz=64&domain=' + urlInfoForIcon.hostname) 
        : fallbackIcon;

      icon.src = tab.favIconUrl || siteIcon;
      icon.onerror = () => {
        if (icon.src !== siteIcon) {
          icon.src = siteIcon;
        } else {
          icon.onerror = null;
          icon.src = fallbackIcon;
        }
      };
    }
    
    let titleText = document.createElement('span');
    titleText.className = 'tab-title-text';
    
    // Если после сна браузер потерял заголовок или подставил сырой URL — показываем аккуратное имя сайта
    let displayTitle = tab.title || '';
    if (!displayTitle || displayTitle.startsWith('http://') || displayTitle.startsWith('https://')) {
      let infoForTitle = parseTabUrl(tab.url);
      displayTitle = infoForTitle ? `${infoForTitle.hostname} (${tab.url.replace(/^https?:\/\/(www\.)?/, '')})` : (tab.url || 'Tab');
    }
    titleText.textContent = displayTitle;

    infoBlock.appendChild(icon);
    infoBlock.appendChild(titleText);
    item.appendChild(infoBlock);

    // Вешаем клик на ВСЮ строку item целиком, а не только на infoBlock
    item.addEventListener('pointerdown', (e) => {
      if (e.target.closest('button')) return; // Игнорируем клики по любым кнопкам действий справа
      sessionStorage.removeItem('tabster_search_query');
      chrome.runtime.sendMessage({
        action: "switchToTab",
        tabId: tab.id,
        windowId: tab.windowId
      });
      // Закрываем окно только если мы в режиме обычного поп-апа (боковую панель не трогаем)
      if (!document.body.classList.contains('is-sidepanel')) {
        setTimeout(() => { window.close(); }, 100);
      }
    });


    let metaWrapper = document.createElement('div');
    metaWrapper.className = 'meta-and-actions';

    let timeSpan = document.createElement('span');
    timeSpan.className = 'time-idle';
    
    if (tab.active && type === "active") {
      timeSpan.textContent = t.watching;
      timeSpan.style.color = '#0078d4';
      timeSpan.style.fontWeight = 'bold';
    } else if (tab.lastAccessed) {
      let secondsIdle = Math.round((now - tab.lastAccessed) / 1000);
      let minutesIdle = Math.round(secondsIdle / 60);
      
      if (secondsIdle < 60) {
        timeSpan.textContent = t.justNow;
      } else if (minutesIdle < 60) {
        timeSpan.textContent = `${minutesIdle}${t.min}`;
      } else {
        timeSpan.textContent = `${Math.round(minutesIdle / 60)}${t.hour}`;
      }
    } else {
      timeSpan.textContent = '---';
    }
    metaWrapper.appendChild(timeSpan);

    if (type === "audio") {
      let muteBtn = document.createElement('button');
      muteBtn.className = 'icon-btn mute-btn';
      muteBtn.style.position = 'relative'; 
      
      let isMuted = tab.mutedInfo ? tab.mutedInfo.muted : false;
      
      if (isMuted) {
        muteBtn.innerHTML = '🔊'; 
        muteBtn.title = t.tipUnmute;
        
        let strikeLine = document.createElement('div');
        strikeLine.style.position = 'absolute';
        strikeLine.style.top = '9px';  
        strikeLine.style.left = '1px';  
        strikeLine.style.width = '14px';
        strikeLine.style.height = '1.5px'; 
        strikeLine.style.backgroundColor = '#e81123'; 
        strikeLine.style.transform = 'rotate(-45deg)'; 
        strikeLine.style.pointerEvents = 'none'; 
        muteBtn.appendChild(strikeLine);
      } else {
        muteBtn.innerHTML = '🔊';
        muteBtn.title = t.tipMute;
      }
      
      muteBtn.addEventListener('pointerdown', (e) => e.stopPropagation());
      muteBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        await chrome.tabs.update(tab.id, { muted: !isMuted });
        await refreshTabsData(); // Мгновенное обновление без моргания
      });
      metaWrapper.appendChild(muteBtn);
    }

    // 2. Кнопка Белого списка (Щит 🛡️: цикл 3 состояний)
    let urlInfo = parseTabUrl(tab.url);

    if (urlInfo) {
      let wlBtn = document.createElement('button');
      wlBtn.innerHTML = '<span>🛡️</span>';
      
      if (type !== "sleep" && protection === 'domain') {
        wlBtn.className = 'icon-btn wl-btn wl-domain';
        wlBtn.title = t.tipWlDomain.replace('{domain}', urlInfo.hostname);
      } else if (type !== "sleep" && protection === 'page') {
        wlBtn.className = 'icon-btn wl-btn wl-page';
        wlBtn.title = t.tipWlPage;
      } else {
        wlBtn.className = 'icon-btn wl-btn';
        wlBtn.title = t.tipWlNone;
      }

      wlBtn.addEventListener('pointerdown', (e) => e.stopPropagation());

      wlBtn.addEventListener('click', async (e) => {
        e.stopPropagation();

        // Если вкладка спит — будим её и ставим защиту по ID вкладки
        if (type === "sleep") {
          if (!whitelistItems.some(item => item.type === 'tab' && item.tabId === tab.id) && 
              !whitelistItems.some(item => item.rule === urlInfo.domainRule)) {
            whitelistItems.push({
              type: 'tab',
              tabId: tab.id,
              url: tab.url,
              rule: `tab_${tab.id}`,
              title: tab.title || urlInfo.hostname,
              favIconUrl: tab.favIconUrl || ''
            });
            await chrome.storage.local.set({ whitelist: whitelistItems });
          }
          chrome.tabs.reload(tab.id, {}, () => {
            setTimeout(refreshTabsData, 400);
          });
          return;
        }

        // Цикл: Серый -> Зеленый (эта вкладка по ID) -> Синий (весь домен) -> Серый
        if (protection === 'none') {
          whitelistItems.push({
            type: 'tab',
            tabId: tab.id,
            url: tab.url,
            rule: `tab_${tab.id}`,
            title: tab.title || urlInfo.hostname,
            favIconUrl: tab.favIconUrl || ''
          });
        } else if (protection === 'page') {
          whitelistItems = whitelistItems.filter(item => !(item.type === 'tab' && item.tabId === tab.id));
          if (!whitelistItems.some(item => item.rule === urlInfo.domainRule)) {
            whitelistItems.push({
              type: 'domain',
              rule: urlInfo.domainRule,
              title: urlInfo.hostname,
              favIconUrl: tab.favIconUrl || ''
            });
          }
        } else {
          whitelistItems = whitelistItems.filter(item => 
            item.rule !== urlInfo.domainRule && 
            item.rule !== urlInfo.hostname && 
            !(item.type === 'tab' && item.tabId === tab.id)
          );
        }

        await chrome.storage.local.set({ whitelist: whitelistItems });
        updateUILists(document.getElementById('tab-search').value.toLowerCase().trim());
      });

      metaWrapper.appendChild(wlBtn);
    }

    // 3. Кнопка усыпления Zᶻ
    if (type !== "sleep") {
      let sleepBtn = document.createElement('button');
      sleepBtn.className = (type === "audio") ? 'icon-btn sleep-btn danger' : 'icon-btn sleep-btn';
      sleepBtn.innerHTML = 'Z<sup>z</sup>';
      sleepBtn.title = t.tipSleep;
      
      let isSystemPage = tab.url && (tab.url.startsWith('edge://') || tab.url.startsWith('chrome://'));
      let isNewTab = tab.url && (tab.url.includes('//newtab') || tab.url.includes('//new-tab'));
      
      if (tab.active || (isSystemPage && !isNewTab) || protection !== 'none') {
        sleepBtn.disabled = true;
      }
      
      sleepBtn.addEventListener('pointerdown', (e) => e.stopPropagation());
      sleepBtn.addEventListener('click', async (e) => {
        e.stopPropagation(); 
        try {
          await saveTabPosition(tab);
          await chrome.tabs.discard(tab.id); 
          await refreshTabsData();
        } catch (err) { await refreshTabsData(); }
      });
      metaWrapper.appendChild(sleepBtn);
    }

    let closeBtn = document.createElement('button');
    closeBtn.className = 'icon-btn close-btn';
    closeBtn.innerHTML = '✕';
    closeBtn.title = t.tipClose;
    
    if (tab.url && (tab.url.endsWith('//settings') || tab.url.endsWith('//settings/'))) {
      closeBtn.disabled = true;
    }
    
    closeBtn.addEventListener('pointerdown', (e) => e.stopPropagation());
    closeBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      try {
        await chrome.tabs.remove(tab.id);
        await refreshTabsData(); // Мгновенное удаление строки без моргания окна
      } catch (err) { await refreshTabsData(); }
    });

    metaWrapper.appendChild(closeBtn);
    item.appendChild(metaWrapper);
    container.appendChild(item);
  });
}

let cleanBtn = document.getElementById('clean-btn');
if (cleanBtn) {
  cleanBtn.addEventListener('click', async () => {
    let rawTabs = await chrome.tabs.query({ active: false, audible: false, pinned: false, discarded: false });
    
    let validTabsToSuspend = rawTabs.filter(tab => {
      if (!tab.url) return false;
      let isSystemPage = tab.url.startsWith('edge://') || tab.url.startsWith('chrome://');
      let isNewTab = tab.url.includes('//newtab') || tab.url.includes('//new-tab');
      
      if (isSystemPage && !isNewTab) return false;
      if (getProtectionStatus(tab) !== 'none') return false;
      
      return true;
    });

    if (validTabsToSuspend.length === 0) return;

    let t = translations[currentLang];
    let msg = t.confirmCleanAll.replace('{count}', validTabsToSuspend.length);
    if (!confirm(msg)) return;

    for (let tab of validTabsToSuspend) {
      await saveTabPosition(tab);
      await chrome.tabs.discard(tab.id);
    }

    sessionStorage.removeItem('tabster_search_query');
    document.getElementById('tab-search').value = '';
    await refreshTabsData();
  });
}
// Универсальная система масштабируемых всплывающих подсказок
(function initCustomTooltips() {
  let tooltipEl = document.createElement('div');
  tooltipEl.className = 'custom-tooltip';
  document.body.appendChild(tooltipEl);

  let activeTarget = null;

  document.addEventListener('mouseover', (e) => {
    let target = e.target.closest('[title], [data-tooltip]');
    if (!target) return;

    // Переносим системный title в data-tooltip, чтобы отключить мелкую подсказку ОС
    if (target.hasAttribute('title')) {
      let text = target.getAttribute('title');
      if (text) target.setAttribute('data-tooltip', text);
      target.removeAttribute('title');
    }

    let tipText = target.getAttribute('data-tooltip');
    if (!tipText) return;

    activeTarget = target;
    tooltipEl.textContent = tipText;
    tooltipEl.classList.add('visible');
    positionTooltip(e);
  });

  document.addEventListener('mousemove', (e) => {
    if (activeTarget) positionTooltip(e);
  });

  document.addEventListener('mouseout', (e) => {
    if (activeTarget && (!e.relatedTarget || !activeTarget.contains(e.relatedTarget))) {
      tooltipEl.classList.remove('visible');
      activeTarget = null;
    }
  });

  // Скрываем подсказку при любом клике, чтобы она не зависала при обновлении списка
  document.addEventListener('pointerdown', () => {
    tooltipEl.classList.remove('visible');
    activeTarget = null;
  });

  function positionTooltip(e) {
    let offset = 12;
    let tipWidth = tooltipEl.offsetWidth;
    let tipHeight = tooltipEl.offsetHeight;

    let left = e.clientX + offset;
    let top = e.clientY + offset;

    // Не даем подсказке вылезти за правый или нижний край окна
    if (left + tipWidth > window.innerWidth - 6) {
      left = Math.max(6, e.clientX - tipWidth - offset);
    }
    if (top + tipHeight > window.innerHeight - 6) {
      top = Math.max(6, e.clientY - tipHeight - offset);
    }

    tooltipEl.style.left = `${left}px`;
    tooltipEl.style.top = `${top}px`;
  }
})();