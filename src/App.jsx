import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AnimatedSection from './components/AnimatedSection';
import SectionDivider from './components/SectionDivider';
import ThermalWeatherWidget from './components/ThermalWeatherWidget';
import RoadTripWidget from './components/RoadTripWidget';
import ExperienceSliderWidget from './components/ExperienceSliderWidget';
import ThermalBenefits from './components/ThermalBenefits';
import ThermalCircuit from './components/ThermalCircuit';
import ServicesSection from './components/ServicesSection';
import ProductsSection from './components/ProductsSection';
import BookingCalculator from './components/BookingCalculator';
import GalleryAndReviews from './components/GalleryAndReviews';
import FAQAndLocation from './components/FAQAndLocation';
import Footer from './components/Footer';
import CartModal from './components/CartModal';
import BookingModal from './components/BookingModal';
import LiveActivityTicker from './components/LiveActivityTicker';
import AmbientAudioPlayer from './components/AmbientAudioPlayer';
import FloatingBearMascot from './components/FloatingBearMascot';
import { MessageCircle, Check } from 'lucide-react';
import { SiteDataProvider, useSiteData } from './context/SiteDataContext';
import AdminDashboard from './admin/AdminDashboard';
import AdminLogin from './admin/AdminLogin';

function MainAppContent() {
  const { info, isAdminLoggedIn } = useSiteData();

  // Admin routing state (hash '#admin' or modal button)
  const [isAdminView, setIsAdminView] = useState(() => {
    return window.location.hash === '#admin';
  });

  useEffect(() => {
    const handleHashChange = () => {
      setIsAdminView(window.location.hash === '#admin');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const openAdmin = () => {
    window.location.hash = '#admin';
    setIsAdminView(true);
  };

  const closeAdmin = () => {
    window.location.hash = '';
    setIsAdminView(false);
  };

  useEffect(() => {
    if (info?.name) {
      document.title = `${info.name} | ${info.alias || 'Papallacta, Ecuador'}`;
    }
  }, [info?.name, info?.alias]);

  // Theme state (dark / light) - Default: Light Mode
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('terjamanco_theme');
    return saved || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('terjamanco_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Cart state
  const [cartItems, setCartItems] = useState([
    {
      id: "prod-bruma-jamanco",
      name: "Bruma Facial de Agua Termal Virgen Jamanco (250ml)",
      price: 8.00,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=600&q=80"
    }
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Booking Modal state
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingInitialData, setBookingInitialData] = useState(null);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Cart operations
  const handleAddToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image
      }];
    });
    showToast(`"${product.name}" agregado al carrito`);
  };

  const handleUpdateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(id);
      return;
    }
    setCartItems(prev =>
      prev.map(item => (item.id === id ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Booking triggers
  const handleOpenBookingWithData = (data) => {
    setBookingInitialData(data);
    setIsBookingModalOpen(true);
  };

  const handleOpenGenericBooking = () => {
    setBookingInitialData(null);
    setIsBookingModalOpen(true);
  };

  // Si estamos en vista administrativa
  if (isAdminView) {
    if (!isAdminLoggedIn) {
      return <AdminLogin onBackToSite={closeAdmin} onSuccess={() => setIsAdminView(true)} />;
    }
    return <AdminDashboard onExitAdmin={closeAdmin} />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '5.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(16, 185, 129, 0.95)',
          color: '#ffffff',
          padding: '0.75rem 1.4rem',
          borderRadius: 'var(--radius-full)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.5)',
          zIndex: 200,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.9rem',
          fontWeight: '600',
          animation: 'fadeIn 0.25s ease'
        }}>
          <Check size={18} />
          {toastMessage}
        </div>
      )}

      {/* Navigation with Theme Switcher & Admin Button */}
      <Navbar 
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenBookingModal={handleOpenGenericBooking}
        onOpenAdmin={openAdmin}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Sections with Scroll-Reveal Animations & Ambient Lights */}
      <main style={{ flex: 1 }}>
        <Hero onOpenBookingModal={handleOpenGenericBooking} />

        {/* Section 1: Live Monitoring & Road Trip Widgets */}
        <AnimatedSection animation="fade-up" delay={100}>
          <section style={{ padding: '4rem 0 2rem 0', background: 'var(--bg-primary)', position: 'relative', overflow: 'hidden' }}>
            <div className="section-ambient-glow" style={{ top: '-100px', left: '-50px', background: 'radial-gradient(circle, rgba(13, 148, 136, 0.25) 0%, transparent 70%)' }} />
            <div className="container">
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                gap: '2rem',
                alignItems: 'stretch'
              }}>
                <ThermalWeatherWidget />
                <RoadTripWidget />
              </div>
            </div>
          </section>
        </AnimatedSection>

        <SectionDivider fill="var(--bg-primary)" bg="var(--bg-primary)" />

        {/* Section 2: Complex Zones & Sedes */}
        <AnimatedSection animation="fade-up" delay={150}>
          <ThermalCircuit onOpenBookingModal={handleOpenGenericBooking} />
        </AnimatedSection>

        <SectionDivider fill="var(--bg-secondary)" bg="var(--bg-primary)" />

        {/* Section 3: Geothermal Minerals & Health */}
        <AnimatedSection animation="fade-up" delay={150}>
          <ThermalBenefits />
        </AnimatedSection>

        {/* Section 4: Interactive Body Transformation Simulator */}
        <AnimatedSection animation="scale-up" delay={200}>
          <section style={{ padding: '0 0 5rem 0', background: 'var(--bg-secondary)', position: 'relative', overflow: 'hidden' }}>
            <div className="section-ambient-glow" style={{ bottom: '-80px', right: '-80px', background: 'radial-gradient(circle, rgba(245, 158, 11, 0.2) 0%, transparent 70%)' }} />
            <div className="container">
              <ExperienceSliderWidget onOpenBookingModal={handleOpenGenericBooking} />
            </div>
          </section>
        </AnimatedSection>

        <SectionDivider fill="var(--bg-secondary)" bg="var(--bg-secondary)" />

        {/* Section 5: Services & Experiences */}
        <AnimatedSection animation="fade-up" delay={150}>
          <ServicesSection onOpenBookingModal={handleOpenGenericBooking} />
        </AnimatedSection>

        <SectionDivider fill="var(--bg-primary)" bg="var(--bg-secondary)" />

        {/* Section 6: Cosmetics & Souvenirs */}
        <AnimatedSection animation="fade-up" delay={150}>
          <ProductsSection onAddToCart={handleAddToCart} onOpenCart={() => setIsCartOpen(true)} />
        </AnimatedSection>

        <SectionDivider fill="var(--bg-secondary)" bg="var(--bg-primary)" />

        {/* Section 7: Booking & Rate Estimator */}
        <AnimatedSection animation="scale-up" delay={150}>
          <BookingCalculator onConfirmBooking={handleOpenBookingWithData} />
        </AnimatedSection>

        <SectionDivider fill="var(--bg-primary)" bg="var(--bg-secondary)" />

        {/* Section 8: Gallery & Social Reviews */}
        <AnimatedSection animation="fade-up" delay={150}>
          <GalleryAndReviews />
        </AnimatedSection>

        <SectionDivider fill="var(--bg-secondary)" bg="var(--bg-primary)" />

        {/* Section 9: FAQ & Road Map */}
        <AnimatedSection animation="fade-up" delay={150}>
          <FAQAndLocation />
        </AnimatedSection>
      </main>

      {/* Footer */}
      <Footer onOpenBookingModal={handleOpenGenericBooking} onOpenAdmin={openAdmin} />

      {/* Live Social Activity Ticker */}
      <LiveActivityTicker />

      {/* Reproductor Ambiental de Aguas Termales */}
      <AmbientAudioPlayer />

      {/* Floating Animated Bear Mascot (Jamanquito - Permanent Widget) */}
      <FloatingBearMascot onOpenBookingModal={handleOpenGenericBooking} />

      {/* Modals */}
      <CartModal 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      <BookingModal 
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        initialData={bookingInitialData}
      />
    </div>
  );
}

export default function App() {
  return (
    <SiteDataProvider>
      <MainAppContent />
    </SiteDataProvider>
  );
}
