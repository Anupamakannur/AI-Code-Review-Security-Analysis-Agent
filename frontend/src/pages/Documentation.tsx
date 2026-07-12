import React, { useState } from "react";
import { 
  ShieldAlert, 
  Code2, 
  ChevronRight, 
  Terminal, 
  Cpu
} from "lucide-react";

export const Documentation: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"owasp" | "secure-coding" | "smells" | "rag">("owasp");

  const tabs = [
    { id: "owasp", name: "OWASP Top 10", icon: <ShieldAlert className="w-4 h-4" /> },
    { id: "secure-coding", name: "Secure Coding Guidelines", icon: <Code2 className="w-4 h-4" /> },
    { id: "smells", name: "Anti-Patterns & Code Smells", icon: <Terminal className="w-4 h-4" /> },
    { id: "rag", name: "RAG Architecture Flow", icon: <Cpu className="w-4 h-4" /> },
  ] as const;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">Syllabus & reference docs</h2>
        <p className="text-gray-400 text-sm mt-1">
          Interactive reference material covering modern secure programming guidelines, OWASP recommendations, and technical specifications.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-brandBorder space-x-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 border-b-2 font-medium text-sm transition-all duration-300 ${
              activeTab === tab.id
                ? "border-brandAccent text-brandAccent bg-brandAccent/5"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            {tab.icon}
            {tab.name}
          </button>
        ))}
      </div>

      {/* Content Container */}
      <div className="p-6 rounded-2xl glass-panel min-h-[500px]">
        {activeTab === "owasp" && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-400" />
              OWASP Top 10 Reference for Python & Java
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Python Card */}
              <div className="p-5 rounded-xl bg-brandDark/40 border border-brandBorder/50 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-brandBorder">
                  <span className="font-bold text-brandCyan text-sm tracking-wide">PYTHON ECOSYSTEM</span>
                  <span className="px-2 py-0.5 text-[10px] rounded bg-brandCyan/10 text-brandCyan font-semibold">PEP-8 Safe</span>
                </div>
                
                <ul className="space-y-3 text-sm text-gray-300">
                  <li className="flex gap-2">
                    <ChevronRight className="w-4 h-4 text-brandCyan flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">A03:2021-SQL Injection:</strong> String interpolation in queries causes command injection. Use parameterized values in `cursor.execute()`.
                    </div>
                  </li>
                  <li className="flex gap-2">
                    <ChevronRight className="w-4 h-4 text-brandCyan flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">A08:2021-Insecure Deserialization:</strong> `pickle.loads()` compiles arbitrary shell codes. Use JSON format serialization instead.
                    </div>
                  </li>
                  <li className="flex gap-2">
                    <ChevronRight className="w-4 h-4 text-brandCyan flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">A05:2021-XML Expansion (XXE):</strong> `ElementTree` lacks recursion protection. Prefer `defusedxml` packages.
                    </div>
                  </li>
                  <li className="flex gap-2">
                    <ChevronRight className="w-4 h-4 text-brandCyan flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">A05:2021-Security Misconfigs:</strong> Leaving `DEBUG = True` in Flask or Django exposes environment credentials in public stacktraces.
                    </div>
                  </li>
                </ul>
              </div>

              {/* Java Card */}
              <div className="p-5 rounded-xl bg-brandDark/40 border border-brandBorder/50 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-brandBorder">
                  <span className="font-bold text-brandPurple text-sm tracking-wide">JAVA ENTERPRISE</span>
                  <span className="px-2 py-0.5 text-[10px] rounded bg-brandPurple/10 text-brandPurple font-semibold">JVM Secure</span>
                </div>
                
                <ul className="space-y-3 text-sm text-gray-300">
                  <li className="flex gap-2">
                    <ChevronRight className="w-4 h-4 text-brandPurple flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">Injection Flaws:</strong> Parameter embedding inside JPQL / HQL bypasses prepared statement validation. Always bind queries.
                    </div>
                  </li>
                  <li className="flex gap-2">
                    <ChevronRight className="w-4 h-4 text-brandPurple flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">XML External Entities:</strong> Disable DOCTYPE overrides inside XML parser factories to stop directory lookup sweeps:
                      <pre className="mt-1 p-2 rounded bg-brandDark text-xs text-brandPurple border border-brandBorder overflow-x-auto">
                        dbf.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
                      </pre>
                    </div>
                  </li>
                  <li className="flex gap-2">
                    <ChevronRight className="w-4 h-4 text-brandPurple flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">Cryptographic Failures:</strong> Avoid using `java.util.Random` for security token hashing; use `SecureRandom` instead.
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === "secure-coding" && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Code2 className="w-5 h-5 text-brandCyan" />
              Core Secure Programming Guidelines
            </h3>
            
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-brandDark/40 border border-brandBorder">
                <h4 className="font-semibold text-white text-base">1. Input Sanitization (Allowlisting)</h4>
                <p className="text-sm text-gray-400 mt-1">
                  Enforce strict allowlisting of character patterns instead of blocklisting known dangerous sequences. Blocklists are easily bypassed through encoding manipulations (e.g. double URL encoding).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-brandDark/40 border border-brandBorder">
                <h4 className="font-semibold text-white text-base">2. Output Encoding</h4>
                <p className="text-sm text-gray-400 mt-1">
                  Before rendering dynamic variables in template engines, encode characters to prevent script injection:
                </p>
                <div className="grid grid-cols-3 gap-3 mt-2 text-center text-xs">
                  <div className="p-2 rounded bg-brandDark border border-brandBorder">
                    <span className="text-brandCyan font-semibold block">&lt; to &amp;lt;</span> HTML Encoding
                  </div>
                  <div className="p-2 rounded bg-brandDark border border-brandBorder">
                    <span className="text-brandCyan font-semibold block">%20 or +</span> URL Encoding
                  </div>
                  <div className="p-2 rounded bg-brandDark border border-brandBorder">
                    <span className="text-brandCyan font-semibold block">\x3C</span> JS Hex Encoding
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-brandDark/40 border border-brandBorder">
                <h4 className="font-semibold text-white text-base">3. Least Privilege & Error Silencing</h4>
                <p className="text-sm text-gray-400 mt-1">
                  Never bubble raw SQL errors, stack traces, or operating system paths back to the client. This exposes critical layout detail to attackers. Replace stack dumps with randomized correlation IDs, and log the details on the backend.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "smells" && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-brandPurple" />
              Code Smells & Anti-patterns Checklist
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-brandDark/40 border border-red-500/10 border-l-4 border-l-red-500">
                <h4 className="font-semibold text-white text-sm">Hardcoded Secrets</h4>
                <p className="text-xs text-gray-400 mt-1">
                  Embedding connection strings, API keys, passwords, or certificates inside code.
                </p>
                <span className="text-[10px] text-red-400 font-semibold block mt-1 uppercase">Severity: Critical</span>
              </div>

              <div className="p-4 rounded-xl bg-brandDark/40 border border-orange-500/10 border-l-4 border-l-orange-500">
                <h4 className="font-semibold text-white text-sm">Empty catch / except blocks</h4>
                <p className="text-xs text-gray-400 mt-1">
                  Swallowing exceptions without logging or rethrowing makes code flow unpredictable and shields attacks.
                </p>
                <span className="text-[10px] text-orange-400 font-semibold block mt-1 uppercase">Severity: High</span>
              </div>

              <div className="p-4 rounded-xl bg-brandDark/40 border border-yellow-500/10 border-l-4 border-l-yellow-500">
                <h4 className="font-semibold text-white text-sm">God Class / Spaghetti Blocks</h4>
                <p className="text-xs text-gray-400 mt-1">
                  Massive monolithic classes executing multiple tasks, making audit verification and access boundaries extremely hard to verify.
                </p>
                <span className="text-[10px] text-yellow-400 font-semibold block mt-1 uppercase">Severity: Medium</span>
              </div>

              <div className="p-4 rounded-xl bg-brandDark/40 border border-yellow-500/10 border-l-4 border-l-yellow-500">
                <h4 className="font-semibold text-white text-sm">Standard Output Printing</h4>
                <p className="text-xs text-gray-400 mt-1">
                  Using `print()` or `System.out.println` instead of configured structured logging engines.
                </p>
                <span className="text-[10px] text-yellow-400 font-semibold block mt-1 uppercase">Severity: Low</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "rag" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-brandBorder">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-brandAccent" />
                RAG Pipeline Design Specs
              </h3>
              <span className="px-2 py-0.5 text-xs rounded bg-brandAccent/10 text-brandAccent border border-brandAccent/20 font-semibold">
                sentence-transformers/all-MiniLM-L6-v2
              </span>
            </div>

            {/* Ingestion & Retrieval Pipeline Steps */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-brandDark/40 border border-brandBorder text-center space-y-2">
                  <div className="w-8 h-8 rounded-full bg-brandCyan/10 text-brandCyan flex items-center justify-center font-bold mx-auto">1</div>
                  <span className="text-sm font-semibold text-white block">Ingestion</span>
                  <p className="text-xs text-gray-400">Loads Markdown, PDFs, and text documents into string buffers.</p>
                </div>

                <div className="p-4 rounded-xl bg-brandDark/40 border border-brandBorder text-center space-y-2">
                  <div className="w-8 h-8 rounded-full bg-brandAccent/10 text-brandAccent flex items-center justify-center font-bold mx-auto">2</div>
                  <span className="text-sm font-semibold text-white block">Chunking</span>
                  <p className="text-xs text-gray-400">Splits buffers into 1000-char pieces with 200-char overlaps.</p>
                </div>

                <div className="p-4 rounded-xl bg-brandDark/40 border border-brandBorder text-center space-y-2">
                  <div className="w-8 h-8 rounded-full bg-brandPurple/10 text-brandPurple flex items-center justify-center font-bold mx-auto">3</div>
                  <span className="text-sm font-semibold text-white block">Embedding</span>
                  <p className="text-xs text-gray-400">Generates 384-dimension dense vectors via sentence-transformers.</p>
                </div>

                <div className="p-4 rounded-xl bg-brandDark/40 border border-brandBorder text-center space-y-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold mx-auto">4</div>
                  <span className="text-sm font-semibold text-white block">Index/Query</span>
                  <p className="text-xs text-gray-400">Saves to local ChromaDB and queries using cosine distance.</p>
                </div>
              </div>

              {/* Mermaid diagram mockup in styled CSS */}
              <div className="p-6 rounded-xl bg-brandDark border border-brandBorder">
                <span className="text-xs font-semibold text-gray-400 tracking-wider block mb-3 uppercase">RAG Flow Architecture Diagram</span>
                <div className="flex flex-col gap-3 max-w-lg mx-auto">
                  <div className="p-2 text-center text-xs font-medium bg-brandBorder/50 text-white rounded border border-brandBorder">
                    Source Documents (OWASP, Guidelines)
                  </div>
                  <div className="text-center text-gray-500 text-xs">▼ (RecursiveCharacterTextSplitter)</div>
                  <div className="p-2 text-center text-xs font-medium bg-brandBorder/50 text-white rounded border border-brandBorder">
                    Text Chunks (1000 Size / 200 Overlap)
                  </div>
                  <div className="text-center text-gray-500 text-xs">▼ (all-MiniLM-L6-v2)</div>
                  <div className="p-2 text-center text-xs font-medium bg-brandAccent/20 text-brandAccent rounded border border-brandAccent/30">
                    384-dimensional Embeddings
                  </div>
                  <div className="text-center text-gray-500 text-xs">▼ (Add / Query)</div>
                  <div className="p-2 text-center text-xs font-medium bg-brandPurple/20 text-brandPurple rounded border border-brandPurple/30">
                    ChromaDB Persistent Store (Cosine Metric)
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
