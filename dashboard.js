const summaryDiv = document.getElementById("summary");

let total = 0;
let cookiesCount = 0;
let sessionCount = 0;
let localCount = 0;

// COOKIES
chrome.runtime.sendMessage({ action: "scanCookies" }, (cookieResponse) => {

  if (cookieResponse && cookieResponse.cookies) {
    cookieResponse.cookies.forEach(c => {
      if (c.isSensitive) {
        total++;
        cookiesCount++;
      }
    });
  }

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {

    // SESSION
    chrome.tabs.sendMessage(tabs[0].id, { action: "scanSessionStorage" }, function (sessionResponse) {

      if (sessionResponse && sessionResponse.sessionStorage) {
        sessionResponse.sessionStorage.forEach(() => {
          total++;
          sessionCount++;
        });
      }

      // LOCAL
      chrome.tabs.sendMessage(tabs[0].id, { action: "scanLocalStorage" }, function (localResponse) {

        if (localResponse && localResponse.localStorage) {
          localResponse.localStorage.forEach(() => {
            total++;
            localCount++;
          });
        }

        // RISK
        let risk = "Low";
        if (total > 3) risk = "High";
        else if (total > 1) risk = "Medium";

        // DISPLAY
        summaryDiv.innerHTML = `
          <div class="card"><strong>Total Sensitive Items:</strong> ${total}</div>
          <div class="card">🍪 Cookies: ${cookiesCount}</div>
          <div class="card">📦 Session: ${sessionCount}</div>
          <div class="card">🗂️ Local: ${localCount}</div>
          <div class="card"><strong>Risk Level:</strong> ${risk}</div>
        `;
      });

    });

  });

});