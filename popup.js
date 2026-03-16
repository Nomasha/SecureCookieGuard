document.getElementById("scanBtn").addEventListener("click", () => {

    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";

    // --------- COOKIE SCAN ---------
    chrome.runtime.sendMessage({ action: "scanCookies" }, (response) => {

        if (!response || !response.cookies || response.cookies.length === 0) {
            resultsDiv.innerHTML += "<p>No cookies found.</p>";
        } else {

            const title = document.createElement("h4");
            title.innerText = "Cookies";
            resultsDiv.appendChild(title);

            response.cookies.forEach(cookie => {

                const item = document.createElement("div");
                item.style.border = "1px solid #ccc";
                item.style.padding = "8px";
                item.style.marginBottom = "8px";
                item.style.borderRadius = "6px";

                item.innerHTML = `
                    <strong>Name:</strong> ${cookie.name}<br>
                    <strong>Type:</strong> ${cookie.sensitiveType}<br>
                    <strong>Sensitive:</strong> ${cookie.isSensitive ? "Yes" : "No"}<br>
                    <strong>Displayed Value:</strong> ${cookie.maskedValue}
                `;

                resultsDiv.appendChild(item);
            });
        }

    });


    // --------- SESSION STORAGE SCAN ---------
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){

        chrome.tabs.sendMessage(
            tabs[0].id,
            {action: "scanSessionStorage"},
            function(response){

                if (!response || !response.sessionStorage) return;

                const title = document.createElement("h4");
                title.innerText = "Session Storage";
                resultsDiv.appendChild(title);

                response.sessionStorage.forEach(entry => {

                    const item = document.createElement("div");
                    item.style.border = "1px solid #4CAF50";
                    item.style.padding = "8px";
                    item.style.marginBottom = "8px";
                    item.style.borderRadius = "6px";

                    item.innerHTML = `
                        <strong>Key:</strong> ${entry.name}<br>
                        <strong>Value:</strong> ${entry.value}
                    `;

                    resultsDiv.appendChild(item);

                });

            }
        );

    });

});