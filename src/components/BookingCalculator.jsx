import React, { useState } from 'react';
import { 
  Calculator, 
  Calendar, 
  CalendarCheck, 
  ShieldCheck, 
  Tag 
} from 'lucide-react';
import { PACKAGES_PRICING as DEFAULT_PACKAGES, TERJAMANCO_INFO } from '../data/terjamancoData';
import { useSiteData } from '../context/SiteDataContext';

export default function BookingCalculator({ onConfirmBooking }) {
  const { packages, info } = useSiteData();
  const currentPackages = packages && packages.length > 0 ? packages : DEFAULT_PACKAGES;
  const currentInfo = info || TERJAMANCO_INFO;
  const [selectedPackage, setSelectedPackage] = useState(currentPackages[0] || DEFAULT_PACKAGES[0]);
  const [visitDate, setVisitDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  // Extra add-ons in USD
  const [addons, setAddons] = useState({
    troutLunch: false,
    extremeSwing: false,
    boatRide: false,
    towelKit: false
  });

  const addonPrices = {
    troutLunch: { name: 'Almuerzo: Trucha Frita de Papallacta', price: 8.50, perPerson: true },
    extremeSwing: { name: 'Pase en Columpio Extremo (El Mirador)', price: 5.00, perPerson: true },
    boatRide: { name: 'Paseo en Bote en la Laguna', price: 4.00, perPerson: true },
    towelKit: { name: 'Alquiler Toalla & Gorro de Baño', price: 3.00, perPerson: true }
  };

  const toggleAddon = (key) => {
    setAddons(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Calculations
  const isCouplePackage = selectedPackage.fixedForTwo;
  const baseAdultPrice = isCouplePackage 
    ? selectedPackage.priceAdult 
    : adults * selectedPackage.priceAdult;
  const baseChildPrice = isCouplePackage 
    ? 0 
    : children * selectedPackage.priceChild;

  const totalPeople = isCouplePackage ? 2 : (adults + children);

  let addonsTotal = 0;
  if (addons.troutLunch) addonsTotal += addonPrices.troutLunch.price * totalPeople;
  if (addons.extremeSwing) addonsTotal += addonPrices.extremeSwing.price * (isCouplePackage ? 2 : adults);
  if (addons.boatRide) addonsTotal += addonPrices.boatRide.price * totalPeople;
  if (addons.towelKit) addonsTotal += addonPrices.towelKit.price * totalPeople;

  const subtotal = baseAdultPrice + baseChildPrice + addonsTotal;
  const groupDiscount = (!isCouplePackage && adults >= 5) ? (subtotal * 0.10) : 0;
  const grandTotal = subtotal - groupDiscount;

  const handleWhatsAppBooking = () => {
    const addonNames = [];
    if (addons.troutLunch) addonNames.push(`- Almuerzo Trucha (x${totalPeople})`);
    if (addons.extremeSwing) addonNames.push(`- Columpio Extremo (x${isCouplePackage ? 2 : adults})`);
    if (addons.boatRide) addonNames.push(`- Paseo en Bote (x${totalPeople})`);
    if (addons.towelKit) addonNames.push(`- Toalla y Gorro (x${totalPeople})`);

    const addonsText = addonNames.length > 0 ? `\n*Servicios Adicionales:*\n${addonNames.join('\n')}` : '';
    const discountText = groupDiscount > 0 ? `\n*Descuento Grupal (10%):* -$${groupDiscount.toFixed(2)}` : '';

    const text = `*SOLICITUD DE RESERVA - TERMALES JAMANCO PAPALLACTA*\n\n` +
      `*Paquete / Entrada:* ${selectedPackage.name}\n` +
      `*Fecha de Visita:* ${visitDate}\n` +
      `*Visitantes:* ${isCouplePackage ? '2 personas (Paquete Cabaña)' : `${adults} Adultos, ${children} Niños`}\n` +
      addonsText +
      discountText +
      `\n*Total Estimado:* $${grandTotal.toFixed(2)} USD\n\n` +
      `Hola Termales Jamanco, deseo consultar disponibilidad y reservar para esta fecha.`;

    window.open(`https://wa.me/${currentInfo.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section id="tarifas" style={{ padding: '6rem 0', background: 'var(--bg-secondary)', position: 'relative' }}>
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <span className="section-subtitle">Tarifas Oficiales & Cotizador en Línea</span>
          <h2 className="section-title">Calcula y Cotiza tu Visita a Jamanco</h2>
          <p className="section-description">
            Selecciona tu tipo de entrada o paquete, número de visitantes y actividades extras con cálculo automático en dólares (USD).
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '2.5rem',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-glass)',
          borderRadius: 'var(--radius-lg)',
          padding: '2.5rem'
        }}>
          {/* Left Column: Form Controls */}
          <div>
            <h3 style={{ fontSize: '1.4rem', color: 'var(--text-light)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Calculator size={22} color="var(--accent-teal)" />
              1. Selecciona Entrada o Paquete
            </h3>

            {/* Package selector cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2rem' }}>
              {currentPackages.map((pkg) => {
                const isSelected = selectedPackage.id === pkg.id;
                return (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg)}
                    style={{
                      padding: '1.1rem 1.25rem',
                      borderRadius: 'var(--radius-md)',
                      background: isSelected ? 'rgba(20, 184, 166, 0.15)' : 'var(--card-inner-bg)',
                      border: isSelected ? '1.5px solid var(--accent-teal)' : '1px solid var(--border-glass)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '1.02rem' }}>
                          {pkg.name}
                        </span>
                        {pkg.popular && (
                          <span style={{ background: 'var(--accent-gold)', color: '#000', fontSize: '0.68rem', fontWeight: '800', padding: '0.15rem 0.45rem', borderRadius: '6px' }}>
                            DESTACADO
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                        {pkg.description}
                      </p>
                    </div>

                    <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '1rem' }}>
                      <div style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--accent-teal)', fontFamily: 'var(--font-display)' }}>
                        ${pkg.priceAdult.toFixed(2)}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {pkg.fixedForTwo ? 'total 2 pers.' : 'por adulto'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Date & Visitors inputs */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                  Fecha Prevista
                </label>
                <input 
                  type="date" 
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.9rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--input-bg)',
                    border: '1px solid var(--input-border)',
                    color: 'var(--input-text)',
                    outline: 'none',
                    fontSize: '0.95rem'
                  }}
                />
              </div>

              {!selectedPackage.fixedForTwo ? (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                      Adultos (${selectedPackage.priceAdult.toFixed(2)})
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', background: 'var(--input-bg)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--input-border)' }}>
                      <button
                        onClick={() => setAdults(Math.max(1, adults - 1))}
                        style={{ padding: '0.75rem 1rem', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 'bold' }}
                      >-</button>
                      <span style={{ flex: 1, textAlign: 'center', fontWeight: '700', color: 'var(--text-primary)' }}>{adults}</span>
                      <button
                        onClick={() => setAdults(adults + 1)}
                        style={{ padding: '0.75rem 1rem', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 'bold' }}
                      >+</button>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                      Niños (${selectedPackage.priceChild.toFixed(2)})
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', background: 'var(--input-bg)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--input-border)' }}>
                      <button
                        onClick={() => setChildren(Math.max(0, children - 1))}
                        style={{ padding: '0.75rem 1rem', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 'bold' }}
                      >-</button>
                      <span style={{ flex: 1, textAlign: 'center', fontWeight: '700', color: 'var(--text-primary)' }}>{children}</span>
                      <button
                        onClick={() => setChildren(children + 1)}
                        style={{ padding: '0.75rem 1rem', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 'bold' }}
                      >+</button>
                    </div>
                  </div>
                </>
              ) : (
                <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.35)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', color: 'var(--accent-gold)', fontSize: '0.88rem', fontWeight: '600' }}>
                  Este paquete es de tarifa fija para 2 personas con cabaña privada y termas.
                </div>
              )}
            </div>

            {/* Extras / Add-ons checkboxes */}
            <div style={{ marginTop: '1.5rem' }}>
              <div style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.8rem' }}>
                Actividades y Servicios Adicionales:
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {Object.entries(addonPrices).map(([key, item]) => {
                  const isChecked = addons[key];
                  return (
                    <label
                      key={key}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        background: isChecked ? 'rgba(56, 189, 248, 0.15)' : 'var(--card-inner-bg)',
                        border: isChecked ? '1px solid var(--accent-cyan)' : '1px solid var(--border-glass)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleAddon(key)}
                          style={{ width: '18px', height: '18px', accentColor: '#14b8a6', cursor: 'pointer' }}
                        />
                        <span style={{ fontSize: '0.88rem', color: isChecked ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: isChecked ? '700' : '400' }}>
                          {item.name}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--accent-teal)' }}>
                        +${item.price.toFixed(2)} {item.perPerson ? (isCouplePackage ? '(x2)' : `(x${totalPeople})`) : ''}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Price Summary Box */}
          <div style={{
            background: 'var(--card-inner-bg)',
            border: '1px solid var(--border-glass)',
            borderRadius: 'var(--radius-md)',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--accent-teal)', textTransform: 'uppercase', fontWeight: '700' }}>
                    Resumen Estimado
                  </div>
                  <h4 style={{ fontSize: '1.25rem', color: 'var(--text-light)' }}>
                    {selectedPackage.name}
                  </h4>
                </div>
                <span className="badge-teal">
                  <Calendar size={13} />
                  {visitDate}
                </span>
              </div>

              {/* Breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>
                    {isCouplePackage ? 'Paquete Cabaña 2 pers.' : `Adultos (${adults} x $${selectedPackage.priceAdult.toFixed(2)})`}:
                  </span>
                  <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>${baseAdultPrice.toFixed(2)} USD</span>
                </div>

                {!isCouplePackage && children > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Niños (${children} x $${selectedPackage.priceChild.toFixed(2)}):</span>
                    <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>${baseChildPrice.toFixed(2)} USD</span>
                  </div>
                )}

                {addonsTotal > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-cyan)' }}>
                    <span>Actividades / Comidas extras:</span>
                    <span style={{ fontWeight: '700' }}>+${addonsTotal.toFixed(2)} USD</span>
                  </div>
                )}

                {groupDiscount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-gold)', background: 'rgba(245,158,11,0.12)', padding: '0.4rem 0.6rem', borderRadius: '6px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: '600' }}>
                      <Tag size={14} /> Descuento Grupo (+5 pers):
                    </span>
                    <span style={{ fontWeight: '800' }}>-${groupDiscount.toFixed(2)} USD</span>
                  </div>
                )}
              </div>

              {/* Direct Info */}
              <div style={{
                marginTop: '1.5rem',
                padding: '0.9rem',
                background: 'var(--bg-card)',
                border: '1px dashed var(--border-glass)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                fontSize: '0.82rem',
                color: 'var(--text-secondary)'
              }}>
                <ShieldCheck size={20} color="#10b981" flexShrink={0} />
                <span>
                  No cobramos recargo de reserva online. Paga directamente en recepción o por transferencia bancaria.
                </span>
              </div>
            </div>

            {/* Total & Action Buttons */}
            <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-glass)', paddingTop: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                  Total a Pagar:
                </span>
                <span style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--accent-teal)', fontFamily: 'var(--font-display)' }}>
                  ${grandTotal.toFixed(2)} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>USD</span>
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button
                  onClick={handleWhatsAppBooking}
                  className="btn btn-primary"
                  style={{ width: '100%', fontSize: '1.02rem', background: '#25d366', color: '#fff' }}
                >
                  <CalendarCheck size={18} />
                  Consultar y Reservar por WhatsApp
                </button>

                <button
                  onClick={() => onConfirmBooking({
                    packageName: selectedPackage.name,
                    date: visitDate,
                    adults: isCouplePackage ? 2 : adults,
                    children: isCouplePackage ? 0 : children,
                    grandTotal
                  })}
                  className="btn btn-outline"
                  style={{ width: '100%' }}
                >
                  Registrar Datos en Línea
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
