import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MobileBottomNav from './components/MobileBottomNav';
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Practice = lazy(() => import('./pages/Practice'));
const Team = lazy(() => import('./pages/Team'));
const Book = lazy(() => import('./pages/Book'));
const Contact = lazy(() => import('./pages/Contact'));
const Admin = lazy(() => import('./pages/Admin'));
const ChatWidget = lazy(() => import('./components/ChatWidget'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    const titles = {
      '/': 'R. Kasaija & Partners Advocates | Kampala, Uganda',
      '/about': 'About Us — R. Kasaija & Partners Advocates',
      '/practice': 'Practice Areas — R. Kasaija & Partners Advocates',
      '/team': 'Our Advocates & Team — R. Kasaija & Partners Advocates',
      '/book': 'Book a Legal Consultation — R. Kasaija & Partners Advocates',
      '/contact': 'Contact Us — R. Kasaija & Partners Advocates',
      '/admin': 'Admin Portal — R. Kasaija & Partners Advocates',
    };
    document.title = titles[pathname] || 'R. Kasaija & Partners Advocates';
  }, [pathname]);
  return null;
}

const Layout = ({ children }) => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  const handleOpenChat = () => {
    window.dispatchEvent(new CustomEvent('open-chat'));
  };

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      {!isAdmin && <Navbar />}
      <main className={`flex-grow ${!isAdmin ? 'pb-16 lg:pb-0' : ''}`}>
        {children}
      </main>
      {!isAdmin && <Footer />}
      {!isAdmin && <MobileBottomNav onOpenChat={handleOpenChat} />}
      {!isAdmin && (
        <Suspense fallback={null}>
          <ChatWidget />
        </Suspense>
      )}
    </div>
  );
};

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL || '/'}>
      <ScrollToTop />
      <Layout>
        <Suspense fallback={<div className="min-h-[40vh] flex items-center justify-center">Loading…</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/team" element={<Team />} />
            <Route path="/book" element={<Book />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
}

export default App;
