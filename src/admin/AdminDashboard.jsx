import React, { useState } from 'react';
import {
  LayoutDashboard,
  Building2,
  Sparkles,
  MapPin,
  Waves,
  ShoppingBag,
  Ticket,
  Camera,
  Star,
  HelpCircle,
  Activity,
  Volume2,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Server
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import OverviewTab from './tabs/OverviewTab';
import InfoTab from './tabs/InfoTab';
import HeroTab from './tabs/HeroTab';
import ZonesTab from './tabs/ZonesTab';
import ServicesTab from './tabs/ServicesTab';
import ProductsTab from './tabs/ProductsTab';
import PackagesTab from './tabs/PackagesTab';
import GalleryTab from './tabs/GalleryTab';
import ReviewsTab from './tabs/ReviewsTab';
import FaqsTab from './tabs/FaqsTab';
import MineralsTab from './tabs/MineralsTab';
import SoundsTab from './tabs/SoundsTab';
import SettingsTab from './tabs/SettingsTab';
import Logo from '../components/Logo';

export default function AdminDashboard({ onExitAdmin }) {
  const { logoutAdmin, isServerOnline, info } = useSiteData();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'overview', label: 'Resumen General', icon: LayoutDashboard },
    { id: 'info', label: 'Empresa & Logotipo', icon: Building2 },
    { id: 'hero', label: 'Cabecera (Hero)', icon: Sparkles },
    { id: 'zones', label: 'Sedes & Circuitos', icon: MapPin },
    { id: 'services', label: 'Servicios & Entradas', icon: Waves },
    { id: 'products', label: 'Tienda & Souvenirs', icon: ShoppingBag },
    { id: 'packages', label: 'Paquetes & Tarifas', icon: Ticket },
    { id: 'gallery', label: 'Galería de Fotos', icon: Camera },
    { id: 'reviews', label: 'Testimonios & Reseñas', icon: Star },
    { id: 'faqs', label: 'Preguntas Frecuentes', icon: HelpCircle },
    { id: 'minerals', label: 'Minerales & Salud', icon: Activity },
    { id: 'sounds', label: 'Sonidos Relajantes', icon: Volume2 },
    { id: 'settings', label: 'Ajustes & Seguridad', icon: Settings }
  ];

  const handleSelectTab = (id) => {
    setActiveTab(id);
    setSidebarOpen(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* Sidebar Desktop & Mobile */}
      <aside style={{
        width: '280px',
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-glass)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        zIndex: 100,
        transform: sidebarOpen ? 'translateX(0)' : undefined,
        transition: 'transform 0.3s ease'
      }}
      className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}
      >
        {/* Logo & Brand */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Logo />
          <button
            onClick={() => setSidebarOpen(false)}
            className="mobile-only"
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Server Status Badge */}
        <div style={{ padding: '0.75rem 1.5rem', background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem' }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: isServerOnline ? '#10b981' : '#ef4444',
            boxShadow: `0 0 8px ${isServerOnline ? '#10b981' : '#ef4444'}`
          }} />
          <span style={{ color: isServerOnline ? '#34d399' : '#f87171', fontWeight: '600' }}>
            {isServerOnline ? 'Servidor Backend Activo' : 'Backend Desconectado'}
          </span>
        </div>

        {/* Navigation Menu */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  background: isActive ? 'linear-gradient(135deg, rgba(20, 184, 166, 0.25), rgba(6, 182, 212, 0.15))' : 'transparent',
                  color: isActive ? 'var(--accent-teal)' : 'var(--text-secondary)',
                  fontWeight: isActive ? '700' : '500',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  borderLeft: isActive ? '3px solid var(--accent-teal)' : '3px solid transparent'
                }}
              >
                <Icon size={18} color={isActive ? 'var(--accent-teal)' : 'var(--text-muted)'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Footer */}
        <div style={{ padding: '1.25rem', borderTop: '1px solid var(--border-glass)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button
            onClick={onExitAdmin}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-glass)',
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            <ExternalLink size={15} />
            Ver Sitio Web
          </button>

          <button
            onClick={logoutAdmin}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              fontSize: '0.85rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            <LogOut size={15} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, marginLeft: '280px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }} className="admin-main-content">
        {/* Top Header */}
        <header style={{
          height: '70px',
          background: 'rgba(6, 17, 24, 0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border-glass)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2rem',
          position: 'sticky',
          top: 0,
          zIndex: 90
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setSidebarOpen(true)}
              className="mobile-only"
              style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: '0.5rem' }}
            >
              <Menu size={22} />
            </button>
            <h1 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', margin: 0 }}>
              {menuItems.find(m => m.id === activeTab)?.label || 'Panel de Administración'}
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {info?.name || 'Termales Jamanco'} {info?.logoSubtext ? `• ${info.logoSubtext}` : ''}
            </span>
            <button
              onClick={onExitAdmin}
              className="btn btn-outline btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <ExternalLink size={14} /> Sitio Web
            </button>
          </div>
        </header>

        {/* Tab Content Body */}
        <main style={{ flex: 1, padding: '2rem' }}>
          {activeTab === 'overview' && <OverviewTab onSelectTab={handleSelectTab} onExitAdmin={onExitAdmin} />}
          {activeTab === 'info' && <InfoTab />}
          {activeTab === 'hero' && <HeroTab />}
          {activeTab === 'zones' && <ZonesTab />}
          {activeTab === 'services' && <ServicesTab />}
          {activeTab === 'products' && <ProductsTab />}
          {activeTab === 'packages' && <PackagesTab />}
          {activeTab === 'gallery' && <GalleryTab />}
          {activeTab === 'reviews' && <ReviewsTab />}
          {activeTab === 'faqs' && <FaqsTab />}
          {activeTab === 'minerals' && <MineralsTab />}
          {activeTab === 'sounds' && <SoundsTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </main>
      </div>
    </div>
  );
}
