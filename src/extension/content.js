let URL = window.location.toString()
const trackAPI = "http://127.0.0.1:5000/api/track"

const htmlContent = document.documentElement.outerHTML;

fetch(trackAPI, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ html: htmlContent })
})


document.addEventListener('click', ()=>{
    let newURL = window.location.toString()
    
    if(newURL !== URL){
        console.log("URL CHANGED")
        URL = newURL
    }else{
        console.log("SAME URL")
    }
});

