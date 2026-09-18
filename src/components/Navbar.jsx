import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  CalendarCheck, 
  Menu, 
  X, 
  Sparkles, 
  MapPin,
  Sun,
  Moon,
  Lock,
  Clock,
  MessageCircle,
  Compass,
  HeartPulse,
  Layers,
  Sparkle,
  Image,
  PhoneCall
} from 'lucide-react';
import Logo from './Logo';
import { TERJAMANCO_INFO as DEFAULT_INFO } from '../data/terjamancoData';
import { useSiteData } from '../context/SiteDataContext';

export default function Navbar({ cartCount, onOpenCart, onOpenBookingModal, onOpenAdmin, theme, onToggleTheme }) {
  const { info } = useSiteData();
  const currentInfo = info || DEFAULT_INFO;
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Detect active section on scroll
      const sections = ['inicio', 'sedes', 'beneficios', 'servicios', 'tarifas', 'productos', 'galeria', 'contacto'];
      const scrollPosition = window.scrollY + 140;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Inicio', href: '#inicio', id: 'inicio', icon: Compass },
    { name: 'Sedes', href: '#sedes', id: 'sedes', icon: Layers },
    { name: 'Beneficios', href: '#beneficios', id: 'beneficios', icon: HeartPulse },
    { name: 'Servicios', href: '#servicios', id: 'servicios', icon: Sparkle },
    { name: 'Tarifas', href: '#tarifas', id: 'tarifas', icon: CalendarCheck },
    { name: 'Productos', href: '#productos', id: 'productos', icon: ShoppingBag },
    { name: 'Galería', href: '#galeria', id: 'galeria', icon: Image },
    { name: 'Ubicación', href: '#contacto', id: 'contacto', icon: MapPin }
  ];

  return (
    <>
      {/* Top micro announcement bar */}
      <div className="top-announcement-bar">
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <span className="announcement-item">
              <span className="live-status-dot"></span>
              <Sparkles size={13} color="#fef08a" />
              <strong>Aguas Vírgenes:</strong> {currentInfo.waterTempRange || '37°C - 44°C'}
            </span>
            <span className="announcement-item hidden-sm">
              <Clock size={13} />
              <span>Abierto Hoy (06:00 - 23:00)</span>
            </span>
            <span className="announcement-item hidden-md">
              <MapPin size={13} />
              <span>Papallacta, Napo - Ecuador</span>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <a 
              href={`https://wa.me/${currentInfo.whatsappPhone || '593988636952'}?text=Hola%20Termales%20Jamanco,%20deseo%20información%20y%20reservas`}
              target="_blank"
              rel="noopener noreferrer"
              className="top-bar-link"
            >
              <MessageCircle size={13} />
              <span>WhatsApp Oficial</span>
            </a>
            {currentInfo.facebookUrl && (
              <a 
                href={currentInfo.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="top-bar-link hidden-xs"
              >
                <span>{currentInfo.facebookHandle || 'Facebook'}</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main Glass Navbar */}
      <header className={`main-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container header-inner">
          {/* Brand Logo */}
          <a href="#inicio" className="brand-logo-link" aria-label="Termales Jamanco Inicio">
            <Logo size={42} />
          </a>

          {/* Desktop Nav Links */}
          <nav className="nav-desktop-container" aria-label="Navegación principal">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a 
                  key={link.name} 
                  href={link.href}
                  className={`nav-link-pill ${isActive ? 'active' : ''}`}
                >
                  {link.name}
                </a>
              );
            })}
          </nav>

          {/* Right Action Icons: Admin, Theme, Cart & Booking */}
          <div className="header-actions">
            {/* Admin CMS Access Button */}
            <button
              onClick={onOpenAdmin}
              className="header-icon-btn admin-btn"
              title="Panel Administrativo (CMS)"
              aria-label="Panel Administrativo"
            >
              <Lock size={17} />
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={onToggleTheme}
              className="header-icon-btn theme-btn"
              title={theme === 'dark' ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro"}
              aria-label="Alternar tema de color"
            >
              {theme === 'dark' ? <Sun size={18} color="#fbbf24" /> : <Moon size={18} color="#0284c7" />}
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="header-icon-btn cart-btn"
              title="Ver Carrito de Souvenirs y Cosmética"
              aria-label="Carrito de compras"
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="cart-badge-count">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Direct Booking CTA */}
            <button
              onClick={onOpenBookingModal}
              className="btn btn-primary btn-sm header-cta-btn"
            >
              <CalendarCheck size={16} />
              <span>Reservar Visita</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="mobile-hamburger-btn"
              aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="mobile-menu-drawer">
            <div className="mobile-nav-links">
              {navLinks.map((link) => {
                const IconComponent = link.icon;
                const isActive = activeSection === link.id;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`mobile-nav-item ${isActive ? 'active' : ''}`}
                  >
                    <span className="mobile-nav-icon">
                      <IconComponent size={18} />
                    </span>
                    <span className="mobile-nav-text">{link.name}</span>
                  </a>
                );
              })}
            </div>

            <div className="mobile-menu-footer">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenBookingModal();
                }}
                className="btn btn-primary btn-lg"
                style={{ width: '100%', gap: '0.6rem' }}
              >
                <CalendarCheck size={19} />
                <span>Reservar Visita Ahora</span>
              </button>

              <div className="mobile-quick-actions">
                <a
                  href={`https://wa.me/${currentInfo.whatsappPhone || '593988636952'}?text=Hola%20Termales%20Jamanco,%20deseo%20información`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mobile-action-pill"
                >
                  <MessageCircle size={16} color="#25d366" />
                  <span>WhatsApp</span>
                </a>
                <a
                  href={`tel:${currentInfo.phone || '+593988636952'}`}
                  className="mobile-action-pill"
                >
                  <PhoneCall size={16} color="var(--accent-teal)" />
                  <span>Llamar</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
