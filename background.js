importScripts("utils.js");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "scanCookies") {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (!tabs || !tabs[0] || !tabs[0].url) {
                sendResponse({ cookies: [] });
                return;
            }

            let url = new URL(tabs[0].url);

            chrome.cookies.getAll({ domain: url.hostname }, function (cookies) {
                const processedCookies = cookies.map(cookie => {
                    const sensitiveType = detectSensitiveType(cookie.value);

                    return {
                        name: cookie.name,
                        originalValue: cookie.value,
                        maskedValue: sensitiveType ? maskValue(cookie.value) : cookie.value,
                        isSensitive: !!sensitiveType,
                        sensitiveType: sensitiveType || "Not Sensitive"
                    };
                });

                sendResponse({ cookies: processedCookies });
            });
        });

        return true;
    }
});