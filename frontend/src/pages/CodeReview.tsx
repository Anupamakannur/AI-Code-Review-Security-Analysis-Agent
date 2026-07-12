import React, { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import { 
  Upload, 
  Terminal, 
  Play, 
  CheckCircle, 
  XCircle,
  ShieldCheck,
  RefreshCw
} from "lucide-react";
import toast from "react-hot-toast";

export const CodeReview: React.FC = () => {
  const [language, setLanguage] = useState<"python" | "java">("python");
  const [tab, setTab] = useState<"paste" | "upload">("paste");
  const [code, setCode] = useState(
    language === "python" 
      ? `def calculate_sum(a, b):\n    # Python Indentation Syntax Error Example\n   return a + b`
      : `public class Example {\n    public static void main(String[] args) {\n        // Java Missing Semicolon Syntax Error Example\n        System.out.println("Hello World")\n    }\n}`
  );
  
  const [file, setFile] = useState<File | null>(null);
  const [validating, setValidating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    tested: boolean;
    isValid: boolean;
    errors: { line: number; column: number; message: string; severity: string }[];
  }>({
    tested: false,
    isValid: true,
    errors: [],
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    // Trigger initial validation on mount
    setTimeout(() => {
      autoValidateSyntax();
    }, 100);
  };

  useEffect(() => {
    if (!code) {
      updateEditorMarkers([]);
      return;
    }
    const timer = setTimeout(() => {
      autoValidateSyntax();
    }, 1000);
    return () => clearTimeout(timer);
  }, [code, language]);

  const autoValidateSyntax = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/code/validate", {
        code: code,
        language: language,
      });
      
      setValidationResult({
        tested: true,
        isValid: res.data.is_valid,
        errors: res.data.errors,
      });

      updateEditorMarkers(res.data.errors);
    } catch (err) {
      console.error("Auto-validation failed:", err);
    }
  };

  const updateEditorMarkers = (errors: any[]) => {
    if (!editorRef.current || !monacoRef.current) return;
    const model = editorRef.current.getModel();
    if (!model) return;

    // Clear old markers first
    monacoRef.current.editor.setModelMarkers(model, "linter", []);

    if (errors.length === 0) return;

    // Set new red squiggly underlines on the exact coordinate
    const markers = errors.map((err) => {
      const lineContent = model.getLineContent(err.line) || "";
      const colStart = Math.max(1, Math.min(err.column, lineContent.length + 1));
      const colEnd = Math.max(colStart + 1, Math.min(err.column + 4, lineContent.length + 1));

      return {
        startLineNumber: err.line,
        startColumn: colStart,
        endLineNumber: err.line,
        endColumn: colEnd,
        message: err.message,
        severity: monacoRef.current.MarkerSeverity.Error,
      };
    });

    monacoRef.current.editor.setModelMarkers(model, "linter", markers);
  };

  const focusOnError = (line: number, column: number) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    editorRef.current.setPosition({ lineNumber: line, column: column });
    editorRef.current.setSelection({
      startLineNumber: line,
      startColumn: column,
      endLineNumber: line,
      endColumn: column + 5,
    });
    editorRef.current.revealLineInCenter(line);
    toast.success(`Focused editor cursor at Line ${line}, Column ${column}`, { id: "cursor-focus" });
  };

  const handleLanguageChange = (lang: "python" | "java") => {
    setLanguage(lang);
    if (tab === "paste") {
      setCode(
        lang === "python"
          ? `def calculate_sum(a, b):\n    # Python Indentation Syntax Error Example\n   return a + b`
          : `public class Example {\n    public static void main(String[] args) {\n        // Java Missing Semicolon Syntax Error Example\n        System.out.println("Hello World")\n    }\n}`
      );
    }
    setValidationResult({ tested: false, isValid: true, errors: [] });
    
    // Clear markers on language swap
    if (editorRef.current && monacoRef.current) {
      const model = editorRef.current.getModel();
      if (model) {
        monacoRef.current.editor.setModelMarkers(model, "linter", []);
      }
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    const ext = selected.name.split(".").pop()?.toLowerCase();
    if (language === "python" && ext !== "py") {
      toast.error("Please upload a .py file for Python validation.");
      return;
    }
    if (language === "java" && ext !== "java") {
      toast.error("Please upload a .java file for Java validation.");
      return;
    }

    setFile(selected);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCode(text);
      setTab("paste");
      toast.success(`Loaded file: ${selected.name}`);
    };
    reader.readAsText(selected);
  };

  const runSyntaxValidation = async () => {
    try {
      setValidating(true);
      const res = await axios.post("http://127.0.0.1:8000/api/code/validate", {
        code: code,
        language: language,
      });
      
      setValidationResult({
        tested: true,
        isValid: res.data.is_valid,
        errors: res.data.errors,
      });

      // Update squigglies
      updateEditorMarkers(res.data.errors);

      if (res.data.is_valid) {
        toast.success("Syntax check passed! No errors detected.");
      } else {
        toast.error(`Detected ${res.data.errors.length} syntax issues.`);
        // Autofocus and highlight first error coordinate
        const firstErr = res.data.errors[0];
        focusOnError(firstErr.line, firstErr.column);
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to run syntax validation. Check if backend is alive.");
    } finally {
      setValidating(false);
    }
  };

  const submitCodeForLogging = async () => {
    try {
      setSubmitting(true);
      const res = await axios.post("http://127.0.0.1:8000/api/code/paste-code", {
        code: code,
        language: language,
        filename: file?.name || undefined
      });

      setValidationResult({
        tested: true,
        isValid: res.data.is_valid,
        errors: res.data.errors,
      });

      // Update squigglies
      updateEditorMarkers(res.data.errors);

      if (res.data.is_valid) {
        toast.success("Code submitted successfully!");
      } else {
        toast("Code logged with compiler anomalies.");
        // Autofocus and highlight first error coordinate
        const firstErr = res.data.errors[0];
        focusOnError(firstErr.line, firstErr.column);
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to log submission.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto h-[calc(100vh-140px)]">
      {/* Editor Panel */}
      <div className="lg:col-span-2 flex flex-col rounded-2xl glass-panel overflow-hidden border border-brandBorder h-full">
        {/* Editor Toolbar */}
        <div className="flex items-center justify-between p-4 bg-brandCard border-b border-brandBorder select-none">
          <div className="flex items-center gap-4">
            <div className="flex bg-brandDark p-1 rounded-lg border border-brandBorder text-xs">
              <button
                onClick={() => handleLanguageChange("python")}
                className={`px-3 py-1.5 rounded-md font-semibold transition-all duration-200 ${
                  language === "python" 
                    ? "bg-brandAccent text-white" 
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Python (.py)
              </button>
              <button
                onClick={() => handleLanguageChange("java")}
                className={`px-3 py-1.5 rounded-md font-semibold transition-all duration-200 ${
                  language === "java" 
                    ? "bg-brandAccent text-white" 
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Java (.java)
              </button>
            </div>

            <div className="flex bg-brandDark p-1 rounded-lg border border-brandBorder text-xs">
              <button
                onClick={() => setTab("paste")}
                className={`px-3 py-1.5 rounded-md font-semibold transition-all duration-200 ${
                  tab === "paste" 
                    ? "bg-brandBorder text-white" 
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Paste Code
              </button>
              <button
                onClick={() => {
                  setTab("upload");
                  fileInputRef.current?.click();
                }}
                className={`px-3 py-1.5 rounded-md font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                  tab === "upload" 
                    ? "bg-brandBorder text-white" 
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                Upload File
              </button>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept={language === "python" ? ".py" : ".java"}
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={runSyntaxValidation}
              disabled={validating}
              className="px-4 py-2 rounded-xl bg-brandBorder/80 hover:bg-brandBorder border border-brandBorder/50 text-gray-300 hover:text-white font-medium text-xs flex items-center gap-2 transition-all duration-200"
            >
              {validating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
              Validate Syntax
            </button>
            <button
              onClick={submitCodeForLogging}
              disabled={submitting}
              className="px-4 py-2 rounded-xl bg-brandAccent hover:bg-brandAccent/90 text-white font-semibold text-xs shadow-md shadow-brandAccent/20 hover:shadow-brandAccent/30 flex items-center gap-2 transition-all duration-200"
            >
              {submitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
              Submit Code
            </button>
          </div>
        </div>

        {/* Monaco Instance */}
        <div className="flex-1 w-full bg-[#1e1e1e] relative min-h-[300px]">
          <Editor
            height="100%"
            language={language}
            theme="vs-dark"
            value={code}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: "JetBrains Mono",
              cursorBlinking: "smooth",
              automaticLayout: true,
              tabSize: 4,
            }}
          />
        </div>
      </div>

      {/* Analysis Panel */}
      <div className="flex flex-col rounded-2xl glass-panel border border-brandBorder overflow-hidden h-full">
        <div className="p-4 bg-brandCard border-b border-brandBorder select-none">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Terminal className="w-4 h-4 text-brandPurple" />
            Syntax & Analysis Report
          </h3>
        </div>

        <div className="p-5 flex-1 overflow-y-auto space-y-6">
          {/* Syntax Results */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest block">Compiler Diagnostics</span>
            
            {!validationResult.tested ? (
              <div className="p-4 rounded-xl border border-brandBorder bg-brandDark/40 text-center text-xs text-gray-500">
                Click "Validate Syntax" or "Submit Code" to run the parser.
              </div>
            ) : validationResult.isValid ? (
              <div className="p-4 rounded-xl border border-emerald-500/10 bg-emerald-500/5 text-emerald-400 text-xs flex gap-2.5 items-start">
                <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Linter Success</strong>
                  All curly braces, semicolons, quotes, and indentation layers are balanced.
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="p-4 rounded-xl border border-red-500/10 bg-red-500/5 text-red-400 text-xs flex gap-2.5 items-start">
                  <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold">Linter Anomalies Caught</strong>
                    {validationResult.errors.length} compile exception blocks identified.
                  </div>
                </div>
                
                {/* List errors */}
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {validationResult.errors.map((err, idx) => (
                    <div 
                      key={idx}
                      onClick={() => focusOnError(err.line, err.column)}
                      className="p-2.5 rounded-lg bg-brandDark/80 border border-brandBorder hover:border-brandCyan/40 hover:bg-brandBorder/20 text-xs text-gray-300 flex items-start gap-2 cursor-pointer transition-all duration-200"
                      title="Click to focus in editor"
                    >
                      <span className="px-1.5 py-0.5 rounded bg-brandBorder text-[10px] text-brandCyan font-bold font-mono">
                        L{err.line}:C{err.column}
                      </span>
                      <p className="flex-1 font-mono text-[11px] mt-0.5 text-left">{err.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* AI Security Review Mock */}
          <div className="space-y-3 pt-4 border-t border-brandBorder/50">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest block">AI Agent Security Review</span>
            <div className="p-4 rounded-xl border border-brandBorder bg-brandCard/60 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-brandPurple">
                <ShieldCheck className="w-4 h-4 animate-pulse" />
                Milestone 2 Integration Pending
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Security vulnerability inspections (leveraging the semantic RAG knowledge base for LLM reasoning) are scheduled for Milestone 2. 
              </p>
              <div className="w-full bg-brandDark h-2 rounded overflow-hidden">
                <div className="w-1/3 bg-brandPurple h-full"></div>
              </div>
              <span className="text-[10px] text-gray-500 block">Agent Pipeline Status: 33% Complete</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
