# OWASP Top 10 Security Guidelines for Java Applications

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
