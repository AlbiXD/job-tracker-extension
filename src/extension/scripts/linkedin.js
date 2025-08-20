const params = new URLSearchParams(window.location.search);
const first_id = params.get("currentJobId");

let lastId = null;

chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type !== "JOB_CHANGE") return;
    const id = msg.id;
    send(id);
});



if (first_id) send(first_id)

function send(id) {
    if (!id) return;
    if (lastId === id) return


    lastId = id;
    setTimeout(async () => {
        console.log("test");
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
            console.error("Error:", err);
        }


        if (data.Exists == false) {

            chrome.storage.local.set({
                pendingJob: {
                    id: id,
                    payload: data.Result
                }
            }, () => {
                console.log("Pending job saved");
                chrome.runtime.sendMessage({ type: "OPEN_POPUP" });
            });
        }
    }, 2000);

}

