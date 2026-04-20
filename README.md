# 🔐 SecureCookieGuard

SecureCookieGuard is a browser extension designed to detect and reduce the exposure of sensitive data stored in client-side browser 
storage such as cookies, session storage, and local storage.

## Overview

Modern web applications often store sensitive information (tokens, emails, identifiers) in client-side storage. This can lead to 
security risks such as data exposure, especially in shared environments or poorly secured applications.

SecureCookieGuard helps identify these risks by scanning browser storage and presenting findings in a secure and user-friendly way.

## Features

🔍 **Storage Scanning**

  * Cookies
  * Session Storage
  * Local Storage

🧠 **Sensitive Data Detection**

  * Email addresses
  * JWT tokens
  * UUIDs
  * Token-like values

🔐 **Data Masking**

  * Sensitive values are masked before display
  * Prevents accidental exposure

⚠️ **Risk Analysis**

  * Classifies risk levels (Low / Medium / High)
  * Based on detected sensitive data

📊 **Dashboard View**

  * Summary of findings
  * Breakdown by storage type

💡 **Security Recommendations**

  * Provides best practices based on detected data

🎨 **Modern UI**

  * Clean and interactive interface
  * Visual alerts and indicators


## How It Works

1. The extension scans client-side storage.
2. It analyzes stored values using pattern-based detection.
3. Sensitive data is identified and masked.
4. A risk level is calculated.
5. Results are displayed in a dashboard with recommendations.


## Limitations

* Does not intercept or analyze network traffic (data in transit)
* Does not modify actual stored values (masking is visual only)
* Cannot access HTTP-only cookies due to browser security restrictions


## Installation

### Option 1: Load Unpacked (Developer Mode)

1. Download or clone this repository
2. Open Chrome and go to:

   ```
   chrome://extensions/
   ```
3. Enable **Developer Mode**
4. Click **Load unpacked**
5. Select the project folder


## Privacy

SecureCookieGuard does **not collect, store, or transmit any user data**.
All processing is performed locally within the browser.


## Future Enhancements

* Real-time monitoring
* Automated protection mode
* Exportable security reports
* Advanced risk scoring
* Enterprise integration


## Author

Developed as part of an Information Security Project.


## License

This project is for academic and educational purposes.
