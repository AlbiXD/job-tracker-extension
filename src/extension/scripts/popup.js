document.addEventListener("DOMContentLoaded", async () => {
  const btn = document.getElementById("button");


  const { saved } = await chrome.storage.local.get("saved");
  if (saved) {
    btn.textContent = "Saved!";
    btn.style.backgroundColor = "green";
    btn.style.border = "none";
    btn.style.outline = "none";
    btn.style.boxShadow = "none";
    btn.classList.remove("btn-border-reveal"); // kill the hover/reveal effect
    btn.classList.add("btn-border-saved")
    await chrome.storage.local.remove("saved");
    return;
  }

  btn.addEventListener("click", async () => {
    try {
      const { pendingJob } = await chrome.storage.local.get("pendingJob");



      if (!pendingJob) {
        console.log("This is not a scrapable job");
        return;
      }

      btn.disabled = true;
      btn.innerText = "Saving..."
      console.log("Loaded job:", pendingJob);

      try {
        const res = await fetch("http://127.0.0.1:8000/jobs/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(pendingJob.payload),
        });
        const saved = await res.json();
        btn.textContent = "Saved!";
        btn.style.backgroundColor = "green";
        btn.style.border = "none";
        btn.style.outline = "none";
        btn.style.boxShadow = "none";
        btn.classList.remove("btn-border-reveal"); // kill the hover/reveal effect
        btn.classList.add("btn-border-saved");             // your solid success style

        console.log(saved);
      } catch (err) {
        console.error("Save failed:", err);
      }
      await chrome.storage.local.set({ saved: true });
      await chrome.storage.local.remove("pendingJob");
    } catch (e) {
      console.error(e);
    }
  });
});
