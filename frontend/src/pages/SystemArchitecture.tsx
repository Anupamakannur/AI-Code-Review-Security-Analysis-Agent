import React, { useState } from "react";
import { 
  Network, 
  Cpu, 
  Database, 
  Layers, 
  ArrowRight,
  GitFork,
  FileJson
} from "lucide-react";

export const SystemArchitecture: React.FC = () => {
  const [activeView, setActiveView] = useState<"flow" | "agents" | "models">("flow");

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <Network className="w-8 h-8 text-brandAccent" />
          System Architecture & Agent Design
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          Detailed structural layouts, data models, and multi-agent interaction blueprints for Milestone 1 and future iterations.
        </p>
      </div>

      {/* Navigation Toggles */}
      <div className="flex bg-brandCard/60 p-1.5 rounded-xl border border-brandBorder w-fit">
        <button
          onClick={() => setActiveView("flow")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-300 ${
            activeView === "flow" 
              ? "bg-brandAccent text-white" 
              : "text-gray-400 hover:text-white"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          Component & Data Flow
        </button>
        <button
          onClick={() => setActiveView("agents")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-300 ${
            activeView === "agents" 
              ? "bg-brandAccent text-white" 
              : "text-gray-400 hover:text-white"
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          Multi-Agent Orchestration
        </button>
        <button
          onClick={() => setActiveView("models")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-300 ${
            activeView === "models" 
              ? "bg-brandAccent text-white" 
              : "text-gray-400 hover:text-white"
          }`}
        >
          <FileJson className="w-3.5 h-3.5" />
          Data Schema Models
        </button>
      </div>

      {/* View 1: Flow and Tech Stack */}
      {activeView === "flow" && (
        <div className="space-y-6">
          {/* High level diagram */}
          <div className="p-6 rounded-2xl glass-panel space-y-4">
            <h3 className="text-base font-bold text-white uppercase tracking-wider">High-Level Architecture</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
              <div className="p-4 rounded-xl bg-brandDark border border-brandBorder text-center">
                <span className="text-xs text-brandCyan font-semibold block mb-1">FRONTEND</span>
                <span className="text-sm font-bold text-white">React + Vite SPA</span>
                <span className="text-[10px] text-gray-500 block mt-1">Monaco Editor UI</span>
              </div>
              
              <div className="flex justify-center text-gray-600 font-bold">
                <ArrowRight className="w-5 h-5 md:rotate-0 rotate-90" />
              </div>

              <div className="p-4 rounded-xl bg-brandAccent/10 border border-brandAccent/30 text-center col-span-1 md:col-span-1">
                <span className="text-xs text-brandAccent font-semibold block mb-1">BACKEND API</span>
                <span className="text-sm font-bold text-white">FastAPI Core</span>
                <span className="text-[10px] text-gray-400 block mt-1">Uvicorn Server</span>
              </div>

              <div className="flex justify-center text-gray-600 font-bold">
                <ArrowRight className="w-5 h-5 md:rotate-0 rotate-90" />
              </div>

              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-3 rounded-xl bg-brandDark border border-brandBorder">
                  <span className="text-[10px] text-brandPurple font-semibold block">METRICS STORE</span>
                  <span className="text-xs font-bold text-white">MongoDB</span>
                </div>
                <div className="p-3 rounded-xl bg-brandDark border border-brandBorder">
                  <span className="text-[10px] text-emerald-500 font-semibold block">VECTOR INDEX</span>
                  <span className="text-xs font-bold text-white">ChromaDB</span>
                </div>
              </div>
            </div>
          </div>

          {/* Component details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl glass-panel space-y-3">
              <h4 className="font-bold text-white text-sm tracking-wide uppercase">Core Data Flow</h4>
              <ol className="space-y-3 text-sm text-gray-400">
                <li className="flex gap-2">
                  <span className="text-brandCyan font-semibold">01.</span>
                  <span>User writes/uploads code in the React interface (Monaco editor handles code formatting).</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-brandCyan font-semibold">02.</span>
                  <span>Code undergoes pre-submission validation inside the browser (lexical checks).</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-brandCyan font-semibold">03.</span>
                  <span>FastAPI backend receives payload and runs Abstract Syntax Tree (AST) validation for Python or structural audits for Java.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-brandCyan font-semibold">04.</span>
                  <span>Result states are archived in MongoDB for dashboard rendering. RAG query parameters fetch context matches from ChromaDB.</span>
                </li>
              </ol>
            </div>

            <div className="p-6 rounded-2xl glass-panel space-y-3">
              <h4 className="font-bold text-white text-sm tracking-wide uppercase">Technology Stack Details</h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-brandDark border border-brandBorder">
                  <strong className="text-white block mb-1">Tailwind CSS</strong>
                  Aesthetic styling & responsive flex layouts
                </div>
                <div className="p-3 rounded-lg bg-brandDark border border-brandBorder">
                  <strong className="text-white block mb-1">Monaco Editor</strong>
                  VSCode-like editing experience with syntax marking
                </div>
                <div className="p-3 rounded-lg bg-brandDark border border-brandBorder">
                  <strong className="text-white block mb-1">Pydantic v2</strong>
                  Fast type enforcement and data validation
                </div>
                <div className="p-3 rounded-lg bg-brandDark border border-brandBorder">
                  <strong className="text-white block mb-1">SentenceTransformers</strong>
                  CPU-friendly embeddings generation
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View 2: Agents and Orchestration */}
      {activeView === "agents" && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl glass-panel space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-brandBorder">
              <h3 className="text-base font-bold text-white uppercase tracking-wider">Multi-Agent Orchestration Flow</h3>
              <span className="px-2 py-0.5 text-[10px] rounded bg-brandPurple/10 text-brandPurple font-semibold border border-brandPurple/20">
                Next-Milestone Ready (Conceptual)
              </span>
            </div>
            
            <div className="space-y-6">
              <p className="text-sm text-gray-400">
                While Milestone 1 focuses on Code Upload and Secure RAG Ingestion, this is the blueprint for the multi-agent execution pipeline triggered in Milestone 2:
              </p>
              
              <div className="relative border-l-2 border-brandBorder pl-6 ml-4 space-y-8">
                {/* Agent 1 */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-brandAccent border border-brandDark shadow"></div>
                  <strong className="text-white block text-sm">1. Orchestrator Agent</strong>
                  <p className="text-xs text-gray-400 mt-1">
                    Accepts the raw file payload, routes execution paths based on language detection, and manages worker outputs.
                  </p>
                </div>

                {/* Agent 2 */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-brandCyan border border-brandDark shadow"></div>
                  <strong className="text-white block text-sm">2. Syntax & Structural Validator Agent</strong>
                  <p className="text-xs text-gray-400 mt-1">
                    Triggers local compiler bindings, maps exception tokens, and outputs clean syntax diagnostics report back to Orchestrator.
                  </p>
                </div>

                {/* Agent 3 */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-brandPurple border border-brandDark shadow"></div>
                  <strong className="text-white block text-sm">3. Semantic Context Retriever Agent (RAG)</strong>
                  <p className="text-xs text-gray-400 mt-1">
                    Scans code for keywords (e.g. `execute()`, `Connection()`) and performs similarity searches inside ChromaDB to retrieve corresponding OWASP fixes.
                  </p>
                </div>

                {/* Agent 4 */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-500 border border-brandDark shadow"></div>
                  <strong className="text-white block text-sm">4. Secure Coding Evaluator Agent (AI Reviewer)</strong>
                  <p className="text-xs text-gray-400 mt-1">
                    Fuses the raw code, context snippets, and AST violations to write a final review summary noting severity levels.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View 3: Data Models */}
      {activeView === "models" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Submission Schema */}
          <div className="p-6 rounded-2xl glass-panel space-y-4">
            <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Database className="w-5 h-5 text-brandCyan" />
              Submission Model (MongoDB)
            </h3>
            <pre className="p-4 rounded-xl bg-brandDark text-xs text-gray-300 border border-brandBorder overflow-x-auto">
{`{
  "_id": "UUID string (Primary Key)",
  "code": "Raw string containing source files",
  "language": "python" | "java",
  "filename": "e.g. app.py / DBConnector.java",
  "is_valid": true | false,
  "errors": [
    {
      "line": 12,
      "column": 5,
      "message": "Missing semicolon ';'",
      "severity": "error"
    }
  ],
  "timestamp": "ISO 8601 UTC timestamp"
}`}
            </pre>
          </div>

          {/* RAG Query Schema */}
          <div className="p-6 rounded-2xl glass-panel space-y-4">
            <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <GitFork className="w-5 h-5 text-brandPurple" />
              RAG API Schemas (Pydantic)
            </h3>
            <div className="space-y-4">
              <div>
                <span className="text-xs font-semibold text-brandAccent block mb-1">RAGQueryRequest</span>
                <pre className="p-3 rounded-lg bg-brandDark text-[11px] text-gray-300 border border-brandBorder overflow-x-auto">
{`class RAGQueryRequest(BaseModel):
    query: str
    top_k: int = 4`}
                </pre>
              </div>

              <div>
                <span className="text-xs font-semibold text-brandAccent block mb-1">RAGSearchResult</span>
                <pre className="p-3 rounded-lg bg-brandDark text-[11px] text-gray-300 border border-brandBorder overflow-x-auto">
{`class RAGSearchResult(BaseModel):
    text: str
    score: float
    source: str
    chunk_id: str`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
