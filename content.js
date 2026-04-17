function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isJWT(value) {
  return /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(value);
}

function isLongToken(value) {
  return /^[A-Za-z0-9\-_=.%]{20,}$/.test(value);
}

function isUUID(value) {
  return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(value);
}

function detectSensitiveType(value) {
  if (!value || typeof value !== "string") return null;

  const trimmed = value.trim();

  if (isEmail(trimmed)) return "Email Address";
  if (isJWT(trimmed)) return "JWT Token";
  if (isUUID(trimmed)) return "Unique Identifier";
  if (isLongToken(trimmed)) return "Token / Secret-Like Value";

  return null;
}

function maskValue(value) {
  if (!value || value.length <= 8) return "****";
  return value.substring(0, 4) + "****" + value.substring(value.length - 4);
}

// 🔐 Encryption
async function encryptValue(value) {
  const encoder = new TextEncoder();
  const data = encoder.encode(value);

  const key = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt"]
  );

  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    key,
    data
  );

  return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
}

// SESSION
async function getSessionStorageData() {
  const data = [];

  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    const value = sessionStorage.getItem(key);

    const type = detectSensitiveType(value);

    if (type) {
      const encrypted = await encryptValue(value);

      data.push({
        name: key,
        sensitiveType: type,
        isSensitive: true,
        maskedValue: maskValue(value),
        encryptedValue: encrypted
      });
    }
  }

  return data;
}

// LOCAL
async function getLocalStorageData() {
  const data = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);

    const type = detectSensitiveType(value);

    if (type) {
      const encrypted = await encryptValue(value);

      data.push({
        name: key,
        sensitiveType: type,
        isSensitive: true,
        maskedValue: maskValue(value),
        encryptedValue: encrypted
      });
    }
  }

  return data;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  if (request.action === "scanSessionStorage") {
    getSessionStorageData().then(data => {
      sendResponse({ sessionStorage: data });
    });
    return true;
  }

  if (request.action === "scanLocalStorage") {
    getLocalStorageData().then(data => {
      sendResponse({ localStorage: data });
    });
    return true;
  }

});