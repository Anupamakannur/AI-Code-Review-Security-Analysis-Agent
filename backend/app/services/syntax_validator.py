import ast
import re
from typing import List
from app.models import ValidationDetail

def validate_python_syntax(code: str) -> List[ValidationDetail]:
    errors = []
    try:
        ast.parse(code)
    except SyntaxError as e:
        # Extract line and offset
        line = e.lineno if e.lineno is not None else 1
        col = e.offset if e.offset is not None else 1
        msg = e.msg
        errors.append(
            ValidationDetail(
                line=line,
                column=col,
                message=f"Syntax Error: {msg}",
                severity="error"
            )
        )
        return errors
    except Exception as e:
        errors.append(
            ValidationDetail(
                line=1,
                column=1,
                message=f"Failed to parse Python code: {str(e)}",
                severity="error"
            )
        )
        return errors

    # PEP-8 styling / spacing checks
    lines = code.splitlines()
    for idx, line in enumerate(lines, 1):
        stripped = line.strip()
        if not stripped:
            continue
            
        # Skip comment lines
        if stripped.startswith("#"):
            continue
        code_part = line.split("#")[0].rstrip()
        stripped_code = code_part.strip()
        if not stripped_code:
            continue
            
        # Check for double semicolons
        if ";;" in stripped_code:
            errors.append(
                ValidationDetail(
                    line=idx,
                    column=line.find(";;") + 1,
                    message="Unnecessary double semicolon ';;' in Python.",
                    severity="error"
                )
            )
        # Check for trailing semicolon
        elif stripped_code[-1] == ";":
            errors.append(
                ValidationDetail(
                    line=idx,
                    column=len(code_part),
                    message="Unnecessary semicolon ';' at end of line (PEP-8 style violation).",
                    severity="error"
                )
            )
            
        # Check PEP-8 Indentation (Multiple of 4 spaces)
        leading_spaces = len(line) - len(line.lstrip(' '))
        if "\t" in line[:leading_spaces]:
            errors.append(
                ValidationDetail(
                    line=idx,
                    column=1,
                    message="Tab characters used for indentation. Use spaces instead (PEP-8).",
                    severity="error"
                )
            )
        elif leading_spaces % 4 != 0:
            errors.append(
                ValidationDetail(
                    line=idx,
                    column=1,
                    message=f"Indentation of {leading_spaces} spaces is not a multiple of 4 (PEP-8 style violation).",
                    severity="error"
                )
            )
            
    return errors

def is_java_statement(line: str) -> bool:
    line = line.strip()
    if not line:
        return False
    # Skip annotations and definitions
    if line.startswith("@") or line.startswith("class ") or line.startswith("interface ") or line.startswith("enum "):
        return False
    # Executable keywords
    if any(line.startswith(kw) for kw in ["return", "throw", "break", "continue", "import", "package"]):
        return True
    # Assignment
    if "=" in line:
        if line.startswith("for") or line.startswith("while") or line.startswith("if"):
            return False
        return True
    # Method invocation
    if "(" in line:
        if any(line.startswith(kw) for kw in ["if", "for", "while", "switch", "catch", "synchronized"]):
            return False
        # Method declaration filters
        if ("public " in line or "private " in line or "protected " in line) and ("void " in line or "class " in line or "interface " in line or "A(" in line):
            return False
        if "void " in line:
            return False
        return True
    # Declarations (e.g. "int x", "public String message")
    if re.match(r'^(public|private|protected|static|final|transient|volatile)?\s*[\w\<\>\[\]]+\s+\w+$', line):
        return True
    return False

def validate_java_syntax(code: str) -> List[ValidationDetail]:
    errors = []
    lines = code.splitlines()
    
    # 1. Clean comments and strings to analyze structure
    cleaned_lines = []
    in_block_comment = False
    
    for idx, line in enumerate(lines, 1):
        cleaned_line = ""
        i = 0
        while i < len(line):
            if in_block_comment:
                if line[i:i+2] == "*/":
                    in_block_comment = False
                    cleaned_line += "  "
                    i += 2
                else:
                    cleaned_line += " "
                    i += 1
                continue
            
            if line[i:i+2] == "/*":
                in_block_comment = True
                cleaned_line += "  "
                i += 2
                continue
                
            if line[i:i+2] == "//":
                cleaned_line += " " * (len(line) - i)
                break
                
            if line[i] == '"':
                cleaned_line += '"'
                i += 1
                while i < len(line) and line[i] != '"':
                    if line[i] == '\\' and i + 1 < len(line):
                        cleaned_line += "  "
                        i += 2
                    else:
                        cleaned_line += " "
                        i += 1
                if i < len(line):
                    cleaned_line += '"'
                    i += 1
                continue
                
            if line[i] == "'":
                cleaned_line += "'"
                i += 1
                while i < len(line) and line[i] != "'":
                    if line[i] == '\\' and i + 1 < len(line):
                        cleaned_line += "  "
                        i += 2
                    else:
                        cleaned_line += " "
                        i += 1
                if i < len(line):
                    cleaned_line += "'"
                    i += 1
                continue
                
            cleaned_line += line[i]
            i += 1
        cleaned_lines.append(cleaned_line)

    # 2. Check for unbalanced braces, parentheses, and brackets with line tracking
    stack = []  # Elements: (char, line_num, col_num)
    matching_pairs = {')': '(', '}': '{', ']': '['}
    
    for line_idx, line in enumerate(cleaned_lines, 1):
        for col_idx, char in enumerate(line, 1):
            if char in "({[":
                stack.append((char, line_idx, col_idx))
            elif char in ")}]":
                if not stack:
                    errors.append(
                        ValidationDetail(
                            line=line_idx,
                            column=col_idx,
                            message=f"Mismatched closing bracket '{char}' without opening bracket.",
                            severity="error"
                        )
                    )
                else:
                    top_char, top_line, top_col = stack.pop()
                    if matching_pairs[char] != top_char:
                        errors.append(
                            ValidationDetail(
                                line=line_idx,
                                column=col_idx,
                                message=f"Mismatched bracket: closed '{char}' but expected matching for '{top_char}' from line {top_line}.",
                                severity="error"
                            )
                        )

    while stack:
        char, line, col = stack.pop()
        errors.append(
            ValidationDetail(
                line=line,
                column=col,
                message=f"Unclosed open bracket '{char}'.",
                severity="error"
            )
        )

    # 3. Check for unnecessary semicolons & commas
    for idx, line in enumerate(cleaned_lines, 1):
        stripped = line.strip()
        if not stripped:
            continue
            
        # Check for double semicolons (e.g. ;; )
        if ";;" in stripped:
            errors.append(
                ValidationDetail(
                    line=idx,
                    column=stripped.find(";;") + 1,
                    message="Unnecessary double semicolon ';;'.",
                    severity="error"
                )
            )
            
        # Check for semicolon after control structure followed by block
        # e.g., "if (cond); {" or "while (cond); {"
        if re.search(r'\b(if|for|while)\s*\(.*\)\s*;\s*\{', stripped):
            errors.append(
                ValidationDetail(
                    line=idx,
                    column=stripped.find(";") + 1,
                    message="Unnecessary semicolon ';' after control structure block.",
                    severity="error"
                )
            )
            
        # Check for semicolon directly after class declaration or method definition followed by block
        # e.g., "class A; {" or "public void test(); {"
        if re.search(r'\b(class|interface|void)\b.*;\s*\{', stripped):
            errors.append(
                ValidationDetail(
                    line=idx,
                    column=stripped.find(";") + 1,
                    message="Unnecessary semicolon ';' after header signature.",
                    severity="error"
                )
            )
            
        # Check for missing commas in variable declaration
        # e.g., "int x y;" or "int a b = 5;"
        types = r'\b(int|double|float|long|short|byte|char|boolean|String|var)\b'
        match_comma = re.search(rf'{types}\s+(\w+)\s+(\w+)\b', stripped)
        if match_comma:
            var1 = match_comma.group(2)
            var2 = match_comma.group(3)
            # Make sure var2 is not a keyword like return or class
            if var2 not in {"return", "break", "continue"}:
                errors.append(
                    ValidationDetail(
                        line=idx,
                        column=match_comma.start(3),
                        message=f"Missing comma ',' or operator between variable identifiers '{var1}' and '{var2}'.",
                        severity="error"
                    )
                )

        # Check for missing commas inside method calls
        # e.g., "myMethod(a b)" or "myMethod(a, b c)"
        for m in re.finditer(r'\(([^)]+)\)', stripped):
            args_content = m.group(1)
            words = re.findall(r'\b\w+\b', args_content)
            is_call = not any(w in {"int", "double", "float", "long", "short", "byte", "char", "boolean", "String", "void"} for w in words)
            if is_call:
                match_call_args = re.search(r'\b(\w+)\s+(\w+)\b', args_content)
                if match_call_args:
                    arg1 = match_call_args.group(1)
                    arg2 = match_call_args.group(2)
                    errors.append(
                        ValidationDetail(
                            line=idx,
                            column=line.find(args_content) + match_call_args.start(2) + 1,
                            message=f"Missing comma ',' between parameters '{arg1}' and '{arg2}' in method call.",
                            severity="error"
                        )
                    )

    # 4. Semicolon validation
    paren_depth = 0
    bracket_depth = 0
    
    for idx, line in enumerate(cleaned_lines, 1):
        stripped = line.strip()
        if not stripped:
            continue
            
        line_paren_open = stripped.count("(")
        line_paren_close = stripped.count(")")
        line_bracket_open = stripped.count("[")
        line_bracket_close = stripped.count("]")
        
        # Semicolon validation skip conditions
        if stripped[-1] in {"{", "}", ";", ",", ":", "+", "-", "*", "/", "&", "|", "?", "(", "["}:
            paren_depth += line_paren_open - line_paren_close
            bracket_depth += line_bracket_open - line_bracket_close
            continue
            
        if not is_java_statement(stripped):
            paren_depth += line_paren_open - line_paren_close
            bracket_depth += line_bracket_open - line_bracket_close
            continue
            
        if paren_depth > 0 or bracket_depth > 0:
            paren_depth += line_paren_open - line_paren_close
            bracket_depth += line_bracket_open - line_bracket_close
            continue
            
        # Check if next line is a dot-chain or block open
        next_line_continuation = False
        for next_idx in range(idx, len(cleaned_lines)):
            next_stripped = cleaned_lines[next_idx].strip()
            if not next_stripped:
                continue
            if next_stripped.startswith(".") or next_stripped.startswith("{") or next_stripped.startswith(")") or next_stripped.startswith("]"):
                next_line_continuation = True
            break
            
        if next_line_continuation:
            paren_depth += line_paren_open - line_paren_close
            bracket_depth += line_bracket_open - line_bracket_close
            continue
            
        # Semicolon is missing!
        errors.append(
            ValidationDetail(
                line=idx,
                column=len(lines[idx-1]) if len(lines[idx-1]) > 0 else 1,
                message="Missing semicolon ';'.",
                severity="error"
            )
        )
        
        paren_depth += line_paren_open - line_paren_close
        bracket_depth += line_bracket_open - line_bracket_close

    errors.sort(key=lambda x: (x.line, x.column))
    return errors

def validate_code(code: str, language: str) -> List[ValidationDetail]:
    lang = language.lower()
    if lang in ["python", "py"]:
        return validate_python_syntax(code)
    elif lang in ["java"]:
        return validate_java_syntax(code)
    else:
        return [
            ValidationDetail(
                line=1,
                column=1,
                message=f"Unsupported language for validation: {language}. Supported are 'python' and 'java'.",
                severity="warning"
            )
        ]
