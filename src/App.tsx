/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Activity, Briefcase, LayoutDashboard, Settings, ReceiptText, BrainCircuit } from 'lucide-react';
import DashboardPage from './pages/Dashboard';
import PortfolioPage from './pages/Portfolio';
import OperationsPage from './pages/Operations';
import TaxPage from './pages/Tax';
import AiAssistant from './components/AiAssistant';

function Sidebar() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white';

  return (
    <div className="w-64 bg-slate-900/40 backdrop-blur-xl border-r border-white/10 flex flex-col h-full">
      <div className="p-6">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <span className="text-slate-950 font-bold">CL</span>
          </div>
          <span className="text-xl font-semibold text-white tracking-tight">CLEARfolio</span>
        </div>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        <Link to="/" className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive('/')}`}>
          <LayoutDashboard className="w-4 h-4" /> Dashboard
        </Link>
        <Link to="/portfolio" className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive('/portfolio')}`}>
          <Briefcase className="w-4 h-4" /> Portfolio
        </Link>
        <Link to="/operations" className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive('/operations')}`}>
          <Activity className="w-4 h-4" /> Operations
        </Link>
        <Link to="/taxes" className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive('/taxes')}`}>
          <ReceiptText className="w-4 h-4" /> Tax & DARF
        </Link>
      </nav>
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white cursor-pointer transition-colors">
          <Settings className="w-4 h-4" /> Settings
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <div className="flex h-screen bg-slate-950 text-slate-100 font-sans antialiased overflow-hidden selection:bg-emerald-900 relative">
        {/* Mesh Background Gradients */}
        <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-emerald-600/20 rounded-full blur-[150px]"></div>

        <div className="flex h-full w-full relative z-10">
          <Sidebar />
          <main className="flex-1 flex flex-col h-full overflow-hidden">
            <header className="h-16 flex items-center justify-between px-8">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white">B3 Investment Manager</h1>
                <p className="text-slate-400 text-sm">Bem-vindo, Portfólio CLEAR Corretora</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-full flex items-center gap-2">
                  <span className="text-xs text-slate-400 uppercase">Total Balance</span>
                  <span className="text-sm font-mono text-emerald-400">R$ 165.430,50</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/20 flex items-center justify-center text-xs">AF</div>
              </div>
            </header>
            <div className="p-8 flex-1 max-w-7xl mx-auto w-full overflow-y-auto">
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/portfolio" element={<PortfolioPage />} />
                <Route path="/operations" element={<OperationsPage />} />
                <Route path="/taxes" element={<TaxPage />} />
              </Routes>
            </div>
          </main>
          <AiAssistant />
        </div>
      </div>
    </Router>
  );
}
