# Cloudflare R2 Credentials for CloudyVerse

Use these credentials to connect CloudyVerse to your Cloudflare R2 bucket.

---

## R2 Storage Configuration

| Field              | Value (Example)                                      |
|--------------------|------------------------------------------------------|
| **Bucket Name**    | test-bucket                                          |
| **Account ID**     | de96fd7e1101d169abe4e24a0180e88c                     |
| **Access Key ID**  | a0db998e463fe5a16dc575aaaba5508                      |
| **Secret Access Key** | 2135ae56093225c3a86c4b932486b25c6bc9d3a10d1a167be12e65fa451e183e |
| **Endpoint**       | https://de96fd7e1101d169abe4e24a0180e88c.r2.cloudflarestorage.com |

> **Note:**
> - The endpoint is automatically constructed by CloudyVerse using the Account ID, but is shown here for reference.
> - Never share your secret access key publicly.

---

## How to Use in CloudyVerse

1. Go to **Settings → Storage Settings** in CloudyVerse.
2. Select **Cloudflare R2** as the backend.
3. Enter the following values:
   - **Bucket Name:** `test-bucket`
   - **Account ID:** `de96fd7e1101d169abe4e24a0180e88c`
   - **Access Key ID:** `a0db998e463fe5a16dc575aaaba5508`
   - **Secret Access Key:** `2135ae56093225c3a86c4b932486b25c6bc9d3a10d1a167be12e65fa451e183e`
4. Save the configuration and set R2 as the current backend.

---

## Security Reminder
- **Keep your Access Key and Secret Access Key secure.**
- **Do not commit this file to public repositories.**
- Rotate your keys regularly and remove unused credentials.

---

*This file is for internal use only. Do not share these credentials outside your trusted team.* 