document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("button");

  btn.addEventListener("click", async () => {
    try {
      const { pendingJob } = await chrome.storage.local.get("pendingJob");
      if (!pendingJob) {
        console.log("This is not a scrapable job");
        return;
      }

      console.log("Loaded job:", pendingJob); 

      try {
        const res = await fetch("http://127.0.0.1:8000/jobs/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(pendingJob.payload),
        });
        const saved = await res.json();
        console.log(saved);
      } catch (err) {
        console.error("Save failed:", err);
      }

      await chrome.storage.local.remove("pendingJob");
    } catch (e) {
      console.error(e);
    }
  });
});
