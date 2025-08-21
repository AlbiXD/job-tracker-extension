const params = new URLSearchParams(window.location.search);
let lastId = null;

chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type !== "JOB_CHANGE") return;

    const id = msg.id;

    const parent = document.querySelector('relativejob-details-jobs-unified-top-card__container--two-pane');

    const mutationObserver = new MutationObserver(async (mutations, obs) => {
        const parentNow = document.querySelector('.jobs-search__job-details--wrapper');
        const hasTitle = parentNow && parentNow.querySelector('a, a');
        console.log(mutations)
        if (!hasTitle) return;          // wait until real content exists
        obs.disconnect();               // <- CALL it (use obs arg)
        send(id);
    });


    if (parent) {
        mutationObserver.observe(parent, { childList: true, subtree: true });
    } else {
        console.log("Parent not found yet");
        setTimeout(() => send(id), 500);   // minimal fallback
    }


});




async function send(id) {
    if (!id) return;
    if (lastId === id) return


    lastId = id;
    let data = null
    try {
        const res = await fetch("http://127.0.0.1:8000/jobs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: id,
                name: "linkedin",
                url: window.location.href,
                html: document.documentElement.outerHTML,
            }),
        });

        data = await res.json();
        console.log("Server response:", data);
    } catch (err) {
        console.log("MongoDB is down!")
    }


    if (data && data.Exists === false) {

        chrome.storage.local.set({
            pendingJob: {
                id: id,
                payload: data.Result
            }
        }, () => {
            console.log("Pending job saved");
            chrome.runtime.sendMessage({ type: "OPEN_POPUP" });
        });

        return;
    }

    await chrome.storage.local.set({ saved: true });
}

