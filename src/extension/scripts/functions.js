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