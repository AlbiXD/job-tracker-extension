const search = window.location.search.toString()
const id = search.match(/(?<=currentJobId=).*?(?=&discover)/)[0];



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

        const answer = prompt("Save result?:");
        if (answer === "yes") {
            try {
                const res2 = await fetch("http://127.0.0.1:8000/jobs/create", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data.Result),
                });

                const data2 = await res2.json();
                console.log(data2);
            } catch (err) {
                console.error(err);
            }

        }
    }
}, 2000);

