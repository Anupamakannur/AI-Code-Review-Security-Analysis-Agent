import os
import sys
from pathlib import Path

# Add backend directory to path so we can import app modules
sys.path.append(str(Path(__file__).resolve().parent.parent))

from app.services.rag_service import rag_service

def seed_documents():
    kb_dir = Path(rag_service.kb_dir)
    os.makedirs(kb_dir, exist_ok=True)
    
    # 1. OWASP Top 10 for Python
    python_owasp = """# OWASP Top 10 Security Guidelines for Python Applications

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
"""

    # 2. OWASP Top 10 for Java
    java_owasp = """# OWASP Top 10 Security Guidelines for Java Applications

## 1. Injection (SQL, Command, LDAP)
* **SQL Injection**: Avoid building SQL query strings with variable interpolation.
  * *Bad*: `Statement stmt = conn.createStatement(); stmt.executeQuery("SELECT * FROM users WHERE name = '" + name + "'");`
  * *Good*: `PreparedStatement pstmt = conn.prepareStatement("SELECT * FROM users WHERE name = ?"); pstmt.setString(1, name); pstmt.executeQuery();`
* **JPQL/HQL Injection**: Similarly, avoid concatenating parameters in Hibernate/JPA queries. Use setParameter().

## 2. Cryptographic Failures (Sensitive Data Exposure)
* Avoid weak algorithms (MD5, SHA-1, DES). Use BCrypt, Argon2, or PBKDF2 for passwords and AES-GCM for symmetric encryption.
* Use `SecureRandom` instead of `java.util.Random` for generating cryptographic keys or tokens.

## 3. Broken Access Control
* Ensure Spring Security or custom filters enforce URL access checks and method-level security (e.g., `@PreAuthorize`).
* Avoid exposing raw database IDs (Insecure Direct Object References - IDOR). Validate user ownership on every database fetch.

## 4. XML External Entities (XXE)
* Java standard DOM/SAX parsers resolve external entities by default, leading to server-side file disclosures.
* *Good Configuration*:
  ```java
  DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
  dbf.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
  ```

## 5. Security Misconfiguration
* Disable directory listing in tomcat/jetty configuration.
* Remove stack traces in production error pages. Use custom error handlers to show generic user messages while logging full exceptions internally.

## 6. Software and Data Integrity Failures (Insecure Deserialization)
* Java serialization (`ObjectInputStream.readObject()`) is highly vulnerable to remote code execution.
* Avoid deserializing untrusted data. Use lightweight JSON serialization (Jackson, Gson) with polymorphic type validation disabled.

## 7. Cross-Site Scripting (XSS)
* Clean user input before storing it. Encode characters (`<`, `>`, `&`, `"`, `'`) before outputting them in web pages.
* Use thymeleaf/jsp tag libraries that automatically perform HTML escaping.

## 8. Server-Side Request Forgery (SSRF)
* Restrict outgoing HTTP requests from the backend. Validate and sanitize URLs before passing them to HttpURLConnection or HttpClient.
* Whitelist allowed target hostnames and IPs.

## 9. Security Logging and Monitoring Failures
* Use standard Logback, Log4j2 (ensure patched against Log4Shell), or SLF4J logging wrappers.
* Log login attempts, validation failures, access denials, and critical system events. Do not log passwords, tokens, or PII.

## 10. Identification and Authentication Failures
* Implement multi-factor authentication (MFA) for administrative panels.
* Enforce strong password complexity rules and account lockout mechanisms.
"""

    # 3. Secure Coding Guidelines
    general_guidelines = """# General Secure Coding Guidelines

## Input Validation
* **Rule**: Accept only known good inputs (allowlisting) instead of rejecting bad inputs (blocklisting).
* Validate inputs for: data type, format, length, range, and character sets.
* Implement validation on both frontend (UI) and backend (API layer).

## Output Encoding
* Encode all user-supplied data before inserting it into any output context (HTML body, attribute, Javascript block, SQL, shell).
* Use appropriate encoding schemes (HTML Entity Encoding, URL Encoding, Javascript Hex Escaping).

## Error Handling
* Do not expose detailed stack traces, system paths, server versions, or database structure in API responses.
* Log detailed errors internally with unique correlation IDs, but show user-friendly messages to client applications.

## Cryptography and Key Management
* Use vetted, modern libraries (e.g., PyCryptodome in Python, javax.crypto in Java).
* Securely manage keys. Use specialized Key Management Services (KMS) or Vaults. Never hardcode keys in git repositories.
"""

    # 4. Anti-Patterns and Code Smells
    anti_patterns = """# Code Smells and Design Anti-Patterns

## 1. Hardcoded Secrets and Credentials
* Exposing tokens, API keys, passwords, and private certificates in code repositories.
* *Impact*: Leakage leads to immediate account compromises.
* *Fix*: Move values to environment variables (`.env`) or secure stores (Vault).

## 2. Empty Catch/Except Blocks
* Swallowing errors makes code execution unpredictable and debugging impossible.
* *Bad (Python)*:
  ```python
  try:
      do_something()
  except:
      pass
  ```
* *Bad (Java)*:
  ```java
  try {
      doSomething();
  } catch (Exception e) {}
  ```
* *Fix*: Log the exception and take recovery actions or raise a custom runtime exception.

## 3. God Class / Spaghetti Code
* God Class: A class that does too much, holding hundreds of methods and violating the Single Responsibility Principle.
* Spaghetti Code: Unstructured code with high coupling, circular dependencies, and flow that is hard to follow.
* *Security Impact*: Complex code makes finding security bugs and verifying authorization flows extremely difficult.

## 4. Print Statements for Logging
* Using `print()` or `System.out.println()` for production logging.
* *Impact*: Hard to capture, lacks timestamps/severities, and cannot be forwarded to centralized logging stacks (like ELK).
* *Fix*: Use proper logging frameworks (e.g., standard `logging` library in Python or SLF4J in Java).
"""

    # Write documents to knowledge base directory
    with open(kb_dir / "owasp_top_10_python.md", "w", encoding="utf-8") as f:
        f.write(python_owasp)
    with open(kb_dir / "owasp_top_10_java.md", "w", encoding="utf-8") as f:
        f.write(java_owasp)
    with open(kb_dir / "secure_coding_guidelines.md", "w", encoding="utf-8") as f:
        f.write(general_guidelines)
    with open(kb_dir / "anti_patterns.md", "w", encoding="utf-8") as f:
        f.write(anti_patterns)

    print("Seed markdown files written to knowledge base.")

    # Trigger indexing
    print("Initializing embedding model and indexing documents in ChromaDB...")
    try:
        files_indexed = rag_service.ingest_documents()
        total_chunks = rag_service.get_document_count()
        print(f"Success! Indexed {files_indexed} documents (total {total_chunks} chunks).")
    except Exception as e:
        print(f"Error indexing documents: {e}", file=sys.stderr)

if __name__ == "__main__":
    seed_documents()
