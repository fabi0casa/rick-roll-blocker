importScripts("rules.js");

chrome.runtime.onInstalled.addListener(updateRules);
chrome.runtime.onStartup.addListener(updateRules);

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && changes.blockedLinks) {
    updateRules();
  }
});

function updateRules() {
  chrome.storage.sync.get(["blockedLinks"], (data) => {
    const links = data.blockedLinks || [];

    const rules = links.map((pattern, index) => {
      return createRule(pattern, index + 1);
    });

    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: rules.map(r => r.id),
      addRules: rules
    });
  });
}