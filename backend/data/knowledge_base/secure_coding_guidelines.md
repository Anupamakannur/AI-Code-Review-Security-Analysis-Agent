# General Secure Coding Guidelines

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
