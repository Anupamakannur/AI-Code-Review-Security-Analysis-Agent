# Code Smells and Design Anti-Patterns

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
