import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { 
  Terminal, 
  FileCode2, 
  BookOpen, 
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Database,
  RefreshCw
} from "lucide-react";
import toast from "react-hot-toast";

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    total_submissions: 0,
    valid_submissions: 0,
    invalid_submissions: 0,
    using_fallback_db: false,
    indexed_chunks: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://127.0.0.1:8000/api/code/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Failed to load statistics.", err);
      toast.error("Could not fetch server statistics. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Documents Chunked & Indexed",
      value: stats.indexed_chunks,
      desc: "Secure coding guidelines indexed in ChromaDB",
      icon: <Database className="w-6 h-6 text-brandCyan" />,
      glow: "shadow-brandCyan/10 border-brandCyan/20",
    },
    {
      title: "Code Files Submitted",
      value: stats.total_submissions,
      desc: "Total .py and .java uploads & pastes",
      icon: <FileCode2 className="w-6 h-6 text-brandAccent" />,
      glow: "shadow-brandAccent/10 border-brandAccent/20",
    },
    {
      title: "Syntax Anomalies Flagged",
      value: stats.invalid_submissions,
      desc: "Submissions failing AST or style validation",
      icon: <AlertTriangle className="w-6 h-6 text-brandPurple" />,
      glow: "shadow-brandPurple/10 border-brandPurple/20",
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-brandBorder bg-gradient-to-r from-brandCard to-brandDark p-8 md:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 rounded-full bg-brandAccent/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 rounded-full bg-brandPurple/10 blur-3xl"></div>
        
        <div className="relative z-10 space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brandAccent/10 border border-brandAccent/30 text-xs font-semibold text-brandAccent">
            <ShieldCheck className="w-4 h-4 animate-pulse" />
            Milestone 1 Active
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            Review Code. <span className="bg-clip-text text-transparent bg-gradient-to-r from-brandCyan to-brandAccent">Prevent Exploits.</span> Secure the Stack.
          </h2>
          <p className="text-gray-400 text-base md:text-lg">
            An intelligent offline RAG-driven review system that helps identify syntax anomalies, parses structural violations, and searches native OWASP vulnerability indexes.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Link
              to="/editor"
              className="px-6 py-3 rounded-xl bg-brandAccent hover:bg-brandAccent/90 font-medium text-white shadow-lg shadow-brandAccent/20 hover:shadow-brandAccent/35 transition-all duration-300 flex items-center gap-2"
            >
              Submit Code Editor <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/rag"
              className="px-6 py-3 rounded-xl bg-brandBorder/50 hover:bg-brandBorder border border-brandBorder/80 font-medium text-gray-300 hover:text-white transition-all duration-300 flex items-center gap-2"
            >
              Search Security RAG
            </Link>
          </div>
        </div>
      </div>

      {/* Connection State Info */}
      <div className="flex items-center justify-between p-4 rounded-2xl glass-panel border-l-4 border-brandCyan">
        <div className="flex items-center gap-3">
          <Database className="w-5 h-5 text-brandCyan" />
          <div>
            <span className="text-sm font-semibold text-gray-200">Database Connection Status</span>
            <p className="text-xs text-gray-400">
              {stats.using_fallback_db 
                ? "Running on localized fallback database (in-memory mode for standalone Windows desktop testing)." 
                : "Connected to localized MongoDB instance (production-ready)."}
            </p>
          </div>
        </div>
        <button
          onClick={fetchStats}
          disabled={loading}
          className="p-2 rounded-lg bg-brandBorder/60 hover:bg-brandBorder text-gray-400 hover:text-white transition-colors duration-200"
          title="Refresh statistics"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className={`p-6 rounded-2xl glass-panel shadow-md border ${stat.glow} flex flex-col justify-between h-40`}>
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-gray-400">{stat.title}</span>
              {stat.icon}
            </div>
            <div>
              <div className="text-3xl font-bold tracking-tight text-white mb-1">
                {loading ? "..." : stat.value}
              </div>
              <p className="text-xs text-gray-500">{stat.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Documentation Quick Links */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-200 tracking-wider">SECURE CODING SYLLABUS</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl glass-panel glass-panel-hover flex gap-4">
            <div className="p-3 rounded-xl bg-brandAccent/10 text-brandAccent h-fit">
              <Terminal className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-white">OWASP Guidelines</h4>
              <p className="text-sm text-gray-400">
                Explore vulnerability prevention indexes mapped specifically for Python and Java, covering SQL injection, broken access, XXE, and insecure deserialization.
              </p>
              <Link to="/docs" className="text-xs text-brandAccent hover:underline flex items-center gap-1 font-semibold pt-1">
                Read OWASP Guidelines <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          <div className="p-6 rounded-2xl glass-panel glass-panel-hover flex gap-4">
            <div className="p-3 rounded-xl bg-brandPurple/10 text-brandPurple h-fit">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-white">RAG Architecture</h4>
              <p className="text-sm text-gray-400">
                Understand how unstructured security manuals are parsed, chunked, converted into dense vectors, and retrieved using semantic indexing models.
              </p>
              <Link to="/docs" className="text-xs text-brandPurple hover:underline flex items-center gap-1 font-semibold pt-1">
                Explore RAG Structure <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
