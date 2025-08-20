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


chrome.runtime.onMessage.addListener((msg, sender)=>{
    if(msg.type == "OPEN_POPUP")
        chrome.action.openPopup()
})