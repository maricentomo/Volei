/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import Atletas from './pages/Atletas';
import Projeto from './pages/Projeto';
import Patrocinadores from './pages/Patrocinadores';
import Arrecadacao from './pages/Arrecadacao';
import Rifa from './pages/Rifa';
import Ranking from './pages/Ranking';

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.22, ease: 'easeInOut' }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/atletas" element={<Atletas />} />
          <Route path="/projeto" element={<Projeto />} />
          <Route path="/patrocinadores" element={<Patrocinadores />} />
          <Route path="/rifa" element={<Rifa />} />
          <Route path="/arrecadacao" element={<Arrecadacao />} />
          <Route path="/ranking" element={<Ranking />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b-4 border-brand-blue sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-[91px] flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src="/logo.png" alt="Base Vôlei Louveira" className="h-[67px] w-auto" />
          </Link>

          <nav className="hidden xl:block">
            <ul className="flex gap-6">
              {[
                { name: 'Home', path: '/' },
                { name: 'O Projeto', path: '/projeto' },
                { name: 'Equipe', path: '/atletas' },
                { name: 'Rifa 🏆', path: '/rifa' },
                { name: 'Ranking', path: '/ranking' },
                { name: 'Parceiros', path: '/patrocinadores' },
                { name: 'Transparência', path: '/arrecadacao' },
              ].map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `text-[13px] font-bold uppercase tracking-wider transition-colors hover:text-brand-orange ${
                        isActive ? 'text-brand-orange' : 'text-navy opacity-70'
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden lg:block">
            <Link
              to="/rifa"
              className="inline-flex items-center gap-2 bg-brand-orange text-white font-bold px-6 py-3 rounded-full transition-all hover:bg-navy hover:text-white border-2 border-brand-orange hover:border-navy text-sm"
            >
              Comprar rifa <ArrowRight size={16} />
            </Link>
          </div>

          <button className="xl:hidden text-navy" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="xl:hidden bg-white border-t border-navy/10 overflow-hidden"
            >
              <ul className="flex flex-col gap-4 p-4">
                {[
                  { name: 'Home', path: '/' },
                  { name: 'O Projeto', path: '/atletas' },
                  { name: 'Rifa 🏆', path: '/rifa' },
                  { name: 'Ranking', path: '/ranking' },
                  { name: 'Parceiros', path: '/patrocinadores' },
                  { name: 'Transparência', path: '/arrecadacao' },
                ].map((item) => (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={({ isActive }) =>
                        `block text-sm font-bold uppercase tracking-wider py-2 ${
                          isActive ? 'text-brand-orange underline' : 'text-navy opacity-70'
                        }`
                      }
                    >
                      {item.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-navy text-white py-12 border-t-8 border-brand-orange">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <div className="mb-6">
              <img src="/logo-white.png" alt="Base Vôlei Louveira" className="h-10 w-auto" />
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              Excelência técnica, formação ética e inclusão social através do esporte desde 2021.
            </p>
          </div>

          <div>
            <h4 className="font-bold uppercase text-xs tracking-widest text-brand-orange mb-6">Navegação</h4>
            <ul className="flex flex-col gap-3 text-sm text-slate-400">
              <li><Link to="/projeto" className="hover:text-white transition-colors">O Projeto</Link></li>
              <li><Link to="/atletas" className="hover:text-white transition-colors">Equipe</Link></li>
              <li><Link to="/patrocinadores" className="hover:text-white transition-colors">Parceiros</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold uppercase text-xs tracking-widest text-brand-orange mb-6">Apoie a Base</h4>
            <ul className="flex flex-col gap-3 text-sm text-slate-400">
              <li><Link to="/rifa" className="hover:text-white transition-colors">Rifa iPhone 16</Link></li>
              <li><Link to="/arrecadacao" className="hover:text-white transition-colors">Transparência</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold uppercase text-xs tracking-widest text-brand-orange mb-6">Desenvolvimento Solidário</h4>
            <div className="p-4 bg-white/5 rounded-lg border border-white/10 flex flex-col gap-5 w-fit">
              <a href="https://iamod.com.br" target="_blank" rel="noopener noreferrer" className="flex flex-col gap-2 hover:opacity-80 transition-opacity">
                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Design e Tecnologia</p>
                <img src="/iamod.png" alt="IaMod" style={{ width: '48%', height: 'auto' }} />
              </a>
              <a href="https://consultoriaquali.com.br/" target="_blank" rel="noopener noreferrer" className="flex flex-col gap-2 hover:opacity-80 transition-opacity">
                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Estratégia e Gestão</p>
                <img src="/qws.png" alt="QWS Consultoria" style={{ width: '48%', height: 'auto' }} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout>
        <AnimatedRoutes />
      </Layout>
    </BrowserRouter>
  );
}
