const resultsDiv = document.getElementById("results");
const dashboardBtn = document.getElementById("dashboardBtn");
const backBtn = document.getElementById("backBtn");
const landing = document.getElementById("landing");
const app = document.getElementById("app");
const scanBtn = document.getElementById("scanBtn");

let dashboardData = {};
let lastScanHTML = ""; // ✅ store previous scan

// 🚀 START BUTTON
document.getElementById("startBtn").addEventListener("click", () => {
  landing.style.display = "none";
  app.style.display = "block";
  scan();
});

// ⏱ Time
function getCurrentTime() {
  return new Date().toLocaleTimeString();
}

// 🔐 Tips
function getTip(type) {
  if (type.includes("JWT") || type.includes("Token"))
    return "Avoid storing tokens in localStorage. Use HTTP-only cookies.";
  if (type.includes("Email"))
    return "Avoid storing personal data in browser storage.";
  return "Limit storing sensitive data on client-side.";
}

// 🔍 MAIN SCAN
function scan() {

  resultsDiv.innerHTML = "";
  dashboardBtn.style.display = "none";
  backBtn.style.display = "none";

  let totalSensitive = 0;
  let cookiesCount = 0;
  let sessionCount = 0;
  let localCount = 0;

  const timeBox = document.createElement("div");
  timeBox.className = "card";
  timeBox.innerHTML = `<strong>Scan Time:</strong> ${getCurrentTime()}`;
  resultsDiv.appendChild(timeBox);

  chrome.runtime.sendMessage({ action: "scanCookies" }, (cookieResponse) => {

    const cookieSection = document.createElement("div");
    cookieSection.innerHTML = "<h4>🍪 Cookies</h4>";
    resultsDiv.appendChild(cookieSection);

    if (cookieResponse?.cookies?.length) {
      cookieResponse.cookies.forEach(cookie => {

        if (cookie.isSensitive) {
          totalSensitive++;
          cookiesCount++;
        }

        const item = document.createElement("div");
        item.className = "card";
        item.classList.add(cookie.isSensitive ? "high-risk" : "low-risk");

        item.innerHTML = `
          <div><strong>Name:</strong> ${cookie.name}</div>
          <div><strong>Type:</strong> ${cookie.sensitiveType}</div>
          <div><strong>Sensitive:</strong> ${cookie.isSensitive ? "Yes" : "No"}</div>
          <div><strong>Value:</strong> ${cookie.maskedValue}</div>
          ${cookie.isSensitive ? `<div><em>Tip:</em> ${getTip(cookie.sensitiveType)}</div>` : ""}
        `;

        cookieSection.appendChild(item);
      });
    } else {
      cookieSection.innerHTML += "<p>No sensitive data detected</p>";
    }

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {

      chrome.tabs.sendMessage(tabs[0].id, { action: "scanSessionStorage" }, (sessionResponse) => {

        const sessionSection = document.createElement("div");
        sessionSection.innerHTML = "<h4>📦 Session Storage</h4>";
        resultsDiv.appendChild(sessionSection);

        if (sessionResponse?.sessionStorage?.length) {
          sessionResponse.sessionStorage.forEach(entry => {

            totalSensitive++;
            sessionCount++;

            const item = document.createElement("div");
            item.className = "card high-risk";

            item.innerHTML = `
              <div><strong>Key:</strong> ${entry.name}</div>
              <div><strong>Type:</strong> ${entry.sensitiveType}</div>
              <div><strong>Encrypted:</strong> Yes</div>
              <div><strong>Value:</strong> ${entry.maskedValue}</div>
              <div><em>Tip:</em> ${getTip(entry.sensitiveType)}</div>
            `;

            sessionSection.appendChild(item);
          });
        } else {
          sessionSection.innerHTML += "<p>No sensitive data detected</p>";
        }

        chrome.tabs.sendMessage(tabs[0].id, { action: "scanLocalStorage" }, (localResponse) => {

          const localSection = document.createElement("div");
          localSection.innerHTML = "<h4>🗂️ Local Storage</h4>";
          resultsDiv.appendChild(localSection);

          if (localResponse?.localStorage?.length) {
            localResponse.localStorage.forEach(entry => {

              totalSensitive++;
              localCount++;

              const item = document.createElement("div");
              item.className = "card high-risk";

              item.innerHTML = `
                <div><strong>Key:</strong> ${entry.name}</div>
                <div><strong>Type:</strong> ${entry.sensitiveType}</div>
                <div><strong>Encrypted:</strong> Yes</div>
                <div><strong>Value:</strong> ${entry.maskedValue}</div>
                <div><em>Tip:</em> ${getTip(entry.sensitiveType)}</div>
              `;

              localSection.appendChild(item);
            });
          } else {
            localSection.innerHTML += "<p>No sensitive data detected</p>";
          }

          // ✅ NO RISK
          if (totalSensitive === 0) {
            const safeMsg = document.createElement("div");
            safeMsg.className = "card";
            safeMsg.innerHTML = "✅ No security risks detected";
            resultsDiv.prepend(safeMsg);
          }

          // 🔥 ALERT
          if (totalSensitive > 0) {
            const alertBox = document.createElement("div");
            alertBox.className = "card high-risk-animate";

            let msg = "⚠️ LOW RISK";
            if (totalSensitive > 3) msg = "🚨 HIGH RISK";
            else if (totalSensitive > 1) msg = "⚠️ MEDIUM RISK";

            alertBox.innerHTML = `<strong>${msg}: Sensitive data detected</strong>`;
            resultsDiv.prepend(alertBox);
          }

          // 📊 SUMMARY
          let risk = "Low";
          let color = "#22c55e";

          if (totalSensitive > 3) {
            risk = "High";
            color = "#ef4444";
          } else if (totalSensitive > 1) {
            risk = "Medium";
            color = "#facc15";
          }

          const summaryBox = document.createElement("div");
          summaryBox.className = "card";
          summaryBox.innerHTML = `
            <div><strong>Sensitive Items:</strong> ${totalSensitive}</div>
            <div><strong>Risk Level:</strong> <span style="color:${color}">${risk}</span></div>
          `;

          resultsDiv.prepend(summaryBox);

          // 🧠 LEGEND
          const legend = document.createElement("div");
          legend.className = "card";
          legend.innerHTML = `
            🔴 High Risk → Tokens<br>
            🟡 Medium → Some exposure<br>
            🟢 Low → Minimal data
          `;

          resultsDiv.appendChild(legend);

          // 📊 store
          dashboardData = { totalSensitive, cookiesCount, sessionCount, localCount };

          dashboardBtn.style.display = "block";

          // ✅ SAVE FULL UI FOR BACK BUTTON
          lastScanHTML = resultsDiv.innerHTML;

        });

      });

    });

  });

}

// Optional
scanBtn?.addEventListener("click", scan);


// 📊 DASHBOARD
dashboardBtn.addEventListener("click", () => {

  resultsDiv.innerHTML = "";

  let risk = "Low";
  let color = "#22c55e";

  if (dashboardData.totalSensitive > 3) {
    risk = "High";
    color = "#ef4444";
  } else if (dashboardData.totalSensitive > 1) {
    risk = "Medium";
    color = "#facc15";
  }

  resultsDiv.innerHTML = `
    <div class="card"><strong>Total Sensitive Items:</strong> ${dashboardData.totalSensitive}</div>
    <div class="card">🍪 Cookies: ${dashboardData.cookiesCount}</div>
    <div class="card">📦 Session: ${dashboardData.sessionCount}</div>
    <div class="card">🗂️ Local: ${dashboardData.localCount}</div>
    <div class="card ${dashboardData.totalSensitive > 3 ? "high-risk-animate" : ""}">
      <strong>🚨 Risk Level:</strong> <span style="color:${color}">${risk}</span>
    </div>
  `;

  dashboardBtn.style.display = "none";
  backBtn.style.display = "block";
});


// 🔙 BACK (FIXED)
backBtn.addEventListener("click", () => {
  resultsDiv.innerHTML = lastScanHTML;

  dashboardBtn.style.display = "block";
  backBtn.style.display = "none";
});