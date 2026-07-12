import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Database, 
  Search, 
  RefreshCw, 
  FileText, 
  Layers, 
  HelpCircle,
  FolderOpen
} from "lucide-react";
import toast from "react-hot-toast";

interface RAGSearchResult {
  text: string;
  score: number;
  source: string;
  chunk_id?: string;
}

export const KnowledgeBase: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<RAGSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [ingesting, setIngesting] = useState(false);
  const [kbStatus, setKbStatus] = useState({
    status: "empty",
    indexed_chunks: 0,
    kb_dir: "",
  });

  const checkStatus = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/rag/status");
      setKbStatus(res.data);
    } catch (err) {
      console.error("Failed to check status", err);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setLoading(true);
      const res = await axios.post("http://127.0.0.1:8000/api/rag/query", {
        query: query,
        top_k: 4
      });
      setResults(res.data.results);
      if (res.data.results.length === 0) {
        toast.error("No relevant documents found. Try re-indexing first.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.detail || "Search failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleIngest = async () => {
    try {
      setIngesting(true);
      const res = await axios.post("http://127.0.0.1:8000/api/rag/ingest");
      toast.success(res.data.message);
      checkStatus();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.detail || "Ingestion failed.");
    } finally {
      setIngesting(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-2xl glass-panel gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-brandCyan/10 text-brandCyan">
            <Database className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">RAG Security Knowledge Base</h2>
            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1.5">
              <FolderOpen className="w-3.5 h-3.5" />
              ChromaDB PERSISTENT INDEX • {kbStatus.indexed_chunks} Vector Chunks Loaded
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleIngest}
            disabled={ingesting}
            className="px-4 py-2.5 rounded-xl bg-brandCyan text-brandDark hover:bg-brandCyan/90 font-semibold text-xs shadow-lg shadow-brandCyan/15 hover:shadow-brandCyan/25 transition-all duration-300 flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${ingesting ? "animate-spin" : ""}`} />
            {ingesting ? "Indexing Documents..." : "Reindex Knowledge Base"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Search Input and status */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 rounded-2xl glass-panel space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Semantic Search</h3>
            <form onSubmit={handleSearch} className="space-y-3">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Query Vector Space</label>
                <div className="relative">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g. SQL Injection, XML External Entity..."
                    className="w-full bg-brandDark/80 border border-brandBorder focus:border-brandCyan focus:ring-1 focus:ring-brandCyan rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none transition-all duration-300 pr-10"
                  />
                  <Search className="absolute right-3 top-3.5 w-4 h-4 text-gray-500" />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="w-full py-2.5 rounded-xl bg-brandAccent hover:bg-brandAccent/90 text-white font-medium text-xs shadow-md shadow-brandAccent/15 transition-all duration-300"
              >
                {loading ? "Searching..." : "Query Index"}
              </button>
            </form>
          </div>

          {/* Quick Help Panel */}
          <div className="p-6 rounded-2xl glass-panel space-y-3 text-xs text-gray-400">
            <h4 className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-brandCyan" />
              How it works
            </h4>
            <p>
              The system scans local markdown and PDF documents in your knowledge base directory, splits them into overlapping text blocks, and computes embeddings via <strong>all-MiniLM-L6-v2</strong>.
            </p>
            <p>
              Your queries are embedded into the same 384-dimensional vector space on the fly, performing a cosine similarity search against stored indexes in <strong>ChromaDB</strong>.
            </p>
          </div>
        </div>

        {/* Results Area */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Retrieval Hits</h3>

          {loading ? (
            <div className="flex flex-col items-center justify-center p-12 rounded-2xl glass-panel text-gray-400 gap-3">
              <RefreshCw className="w-8 h-8 text-brandCyan animate-spin" />
              <span>Matching vector similarities...</span>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-4">
              {results.map((result, index) => (
                <div 
                  key={index}
                  className="p-5 rounded-xl glass-panel border border-brandBorder/50 hover:border-brandCyan/20 transition-all duration-300 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] bg-brandBorder/60 px-2 py-1 rounded text-gray-300 flex items-center gap-1.5">
                      <FileText className="w-3 h-3 text-brandCyan" />
                      {result.source}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
                      result.score > 0.6 
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                        : "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
                    }`}>
                      Relevance: {(result.score * 100).toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed font-mono whitespace-pre-wrap bg-brandDark/40 p-3 rounded-lg border border-brandBorder/30">
                    {result.text}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 rounded-2xl glass-panel text-center text-gray-500 space-y-2">
              <Layers className="w-12 h-12 mx-auto text-gray-600" />
              <p className="text-sm">No query results active.</p>
              <p className="text-xs text-gray-600">Enter a query on the left pane and hit Query Index to search similar rules.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
