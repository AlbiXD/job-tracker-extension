function waitForElement(selector, callback) {
    const observer = new MutationObserver(() => {
      const el = document.querySelector(selector);
      if (el) {
        observer.disconnect(); 
        callback(el); 
      }
    });
  
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  

  waitForElement(".jobs-company__box", (el) => {
    console.log("✅ Company info loaded!", el);
  
    const html_blob = document.documentElement.innerHTML;
  
    fetch("http://127.0.0.1:5000/api/track/linkedin", {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: html_blob
    });
  });
  