chrome.webNavigation.onHistoryStateUpdated.addListener((d) => {
  if (!d.url.includes("linkedin.com/jobs")) return;

  const url = new URL(d.url);
  const id = url.searchParams.get("currentJobId");
  if (!id) return;

  chrome.tabs.sendMessage(d.tabId, {
    type: "JOB_CHANGE",
    id,
    url: d.url
  });
}, { url: [{ hostSuffix: "linkedin.com" }] });

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete") return;
  if (!/linkedin\.com\/jobs\//.test(tab.url || "")) return;

  const u = new URL(tab.url);
  const id = u.searchParams.get("currentJobId") || (u.pathname.match(/\/jobs\/view\/(\d+)/)?.[1] ?? null);

  chrome.tabs.sendMessage(tabId, { type: "JOB_CHANGE", id, url: tab.url }).catch(() => {});
});

chrome.runtime.onMessage.addListener((msg, sender)=>{
    if(msg.type == "OPEN_POPUP")
        chrome.action.openPopup()
})