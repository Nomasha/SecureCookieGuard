function getSessionStorageData() {
    const data = [];

    for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        const value = sessionStorage.getItem(key);

        data.push({
            name: key,
            value: value
        });
    }

    return data;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    if (request.action === "scanSessionStorage") {

        const storageData = getSessionStorageData();

        sendResponse({ sessionStorage: storageData });
    }

});