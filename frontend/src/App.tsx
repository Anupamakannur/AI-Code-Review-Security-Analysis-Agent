import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./pages/Dashboard";
import { CodeReview } from "./pages/CodeReview";
import { KnowledgeBase } from "./pages/KnowledgeBase";
import { SystemArchitecture } from "./pages/SystemArchitecture";
import { Documentation } from "./pages/Documentation";

function App() {
  return (
    <Router>
      <div className="flex bg-brandDark text-gray-100 min-h-screen">
        {/* Sidebar Navigation */}
        <Sidebar />

        {/* Main Content Area */}
        <main className="flex-1 p-8 overflow-y-auto h-screen">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/editor" element={<CodeReview />} />
            <Route path="/rag" element={<KnowledgeBase />} />
            <Route path="/architecture" element={<SystemArchitecture />} />
            <Route path="/docs" element={<Documentation />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      {/* React Hot Toast Configuration */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#121724",
            color: "#F3F4F6",
            border: "1px solid #1E2538",
            fontSize: "13px",
            fontFamily: "Outfit, sans-serif",
            borderRadius: "12px",
            padding: "12px 16px",
          },
          success: {
            iconTheme: {
              primary: "#06B6D4",
              secondary: "#121724",
            },
          },
          error: {
            iconTheme: {
              primary: "#EF4444",
              secondary: "#121724",
            },
          },
        }}
      />
    </Router>
  );
}

export default App;
