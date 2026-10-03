import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Sidebar } from './components/Sidebar';
import { CircuitBackground } from './components/CircuitBackground';
import { WelcomeModal } from './components/WelcomeModal';
import { services, site } from './lib/site';
import { Overview } from './pages/Overview';
import { Work } from './pages/Work';
import { Services } from './pages/Services';
import { ServiceDemo } from './pages/ServiceDemo';
import { Stack } from './pages/Stack';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { ProjectDetail } from './pages/ProjectDetail';
import { TechnicalDemo } from './pages/TechnicalDemo';

function titleFor(pathname: string): string {
  const map: Record<string, string> = {
    '/': 'Overview',
    '/work': 'Work',
    '/services': 'Products & Services',
    '/stack': 'Tech Stack',
    '/demo': 'Technical Demo',
    '/about': 'About',
    '/contact': 'Contact',
  };
  if (map[pathname]) return map[pathname];
  if (pathname.startsWith('/services/')) {
    const s = services.find((x) => x.slug === pathname.split('/')[2]);
    return s ? s.name : 'Services';
  }
  if (pathname.startsWith('/projects/')) {
    const slug = pathname.split('/')[2] ?? '';
    return (
      slug
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ') || 'Project'
    );
  }
  return 'Overview';
}

/** Scroll to top + set the tab title on every route change. */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
    document.title = `${titleFor(pathname)} — ${site.name}`;
  }, [pathname]);
  return null;
}

export default function App() {
  const [collapsed, setCollapsed] = useState(
    () => typeof localStorage !== 'undefined' && localStorage.getItem('sidebar-collapsed') === '1',
  );
  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', collapsed ? '1' : '0');
  }, [collapsed]);

  return (
    <>
      <ScrollToTop />
      <Toaster richColors position="top-right" theme="dark" />
      <WelcomeModal />
      <CircuitBackground />
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      {/* Offset for the fixed sidebar on desktop. Each route renders only its
          own content — the sidebar is the persistent shell. */}
      <div className={`transition-[padding] duration-200 ${collapsed ? 'md:pl-[76px]' : 'md:pl-72'}`}>
        <main className="mx-auto max-w-5xl px-6 py-12 md:py-16">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/work" element={<Work />} />
            <Route path="/projects/:slug" element={<ProjectDetail />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:slug" element={<ServiceDemo />} />
            <Route path="/stack" element={<Stack />} />
            <Route path="/demo" element={<TechnicalDemo />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<Overview />} />
          </Routes>
        </main>
      </div>
    </>
  );
}
