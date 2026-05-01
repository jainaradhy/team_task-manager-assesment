import { useState } from "react";
import { Menu } from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const AppShell = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="page-shell">
      <div className="mx-auto flex min-h-screen max-w-[1600px] gap-6 p-4 lg:p-6">
        <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(false)} />

        {isSidebarOpen && (
          <button
            type="button"
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden"
          />
        )}

        <main className="relative min-w-0 flex-1">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className="glass-panel fixed left-4 top-4 z-20 rounded-2xl p-3 lg:hidden"
          >
            <Menu size={20} />
          </button>
          <Navbar />
          <div className="px-4 pb-4 pt-6 lg:px-0">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AppShell;

