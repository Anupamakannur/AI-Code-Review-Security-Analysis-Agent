# OWASP Top 10 Security Guidelines for Python Applications

## 1. Injection (A03:2021-Injection)
Injection vulnerabilities occur when untrusted user input is passed directly to an interpreter (SQL, OS commands, LDAP, etc.) without validation or escaping.
* **SQL Injection**: Using string formatting or concatenation to build SQL queries is extremely dangerous.
  * *Bad*: `cursor.execute("SELECT * FROM users WHERE username = '" + username + "'")`
  * *Good*: `cursor.execute("SELECT * FROM users WHERE username = %s", (username,))` (parameterized query)
* **Command Injection**: Passing untrusted strings to `os.system()` or `subprocess.Popen(..., shell=True)`.
  * *Bad*: `subprocess.Popen("ping -c 1 " + ip, shell=True)`
  * *Good*: `subprocess.Popen(["ping", "-c", "1", ip], shell=False)`

## 2. Broken Authentication (A07:2021-Identification and Authentication Failures)
* Hardcoded credentials must be avoided. Use environment variables.
* Always hash passwords using secure slow algorithms like `bcrypt`, `argon2`, or `pbkdf2`. Never use MD5 or SHA1.
* *Good example*: `bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())`

## 3. Sensitive Data Exposure (A02:2021-Cryptographic Failures)
* Transport data over HTTPS using TLS 1.3.
* Encrypt sensitive fields in database using standard AES-GCM 256-bit encryption.
* Avoid logging sensitive data like passwords, credit cards, or API keys.

## 4. XML External Entities (XXE) (A05:2021-Security Misconfiguration)
* Standard Python `xml.etree.ElementTree` is vulnerable to entity expansion (Billion Laughs attack).
* Use `defusedxml` package to prevent XML parsing security issues.
* Disable DTDs (Document Type Definitions) and entity parsing in third-party parsers like `lxml`.

## 5. Broken Access Control (A01:2021-Broken Access Control)
* Implement Principle of Least Privilege.
* Validate that the logged-in user owns the resource they are trying to access.
* *Good*: Check `if resource.owner_id == current_user.id:` before returning data.

## 6. Security Misconfiguration (A05:2021-Security Misconfiguration)
* Always set `DEBUG = False` in Django/Flask production environments.
* Use secure HTTP headers (e.g. HSTS, Content-Security-Policy, X-Content-Type-Options).

## 7. Cross-Site Scripting (XSS) (A03:2021-Injection)
* Unescaped input rendered in HTML.
* Jinja2 templates escape by default, but using `| safe` bypasses escaping. Ensure any raw HTML output is sanitized using `nh3` or `bleach`.

## 8. Insecure Deserialization (A08:2021-Software and Data Integrity Failures)
* Python `pickle` is highly insecure. A malicious pickle payload can execute arbitrary shell commands upon loading.
* *Bad*: `pickle.loads(user_data)`
* *Good*: Use `json` or safe serializations. If pickle is required, sign payloads with hmac.

## 9. Using Components with Known Vulnerabilities (A06:2021-Vulnerable and Outdated Components)
* Check Python packages using `safety check` or `pip-audit`.
* Lock dependency versions in `requirements.txt` or `Pipfile.lock`.

## 10. Insufficient Logging & Monitoring (A09:2021-Security Logging and Monitoring Failures)
* Log important actions (login failures, high-value transactions, access control checks).
* Use python standard `logging` with structured formats. Avoid printing raw secrets.
