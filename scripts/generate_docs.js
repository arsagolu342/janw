import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const baseCss = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

  @page {
    size: A4;
    margin: 18mm 16mm 18mm 16mm;
  }

  * {
    box-sizing: border-box;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  body {
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #1e293b;
    background: #ffffff;
    line-height: 1.6;
    font-size: 13px;
    margin: 0;
    padding: 0;
  }

  .header {
    border-bottom: 3px solid #0d9488;
    padding-bottom: 12px;
    margin-bottom: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .header .title {
    font-size: 20px;
    font-weight: 800;
    color: #0f172a;
    margin: 0;
  }

  .header .subtitle {
    font-size: 12px;
    color: #0d9488;
    font-weight: 600;
    margin-top: 2px;
  }

  .header .badge {
    background: #0d9488;
    color: white;
    font-size: 11px;
    font-weight: 700;
    padding: 4px 10px;
    border-radius: 6px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  h1 {
    font-size: 22px;
    font-weight: 800;
    color: #0f172a;
    margin-top: 0;
    margin-bottom: 8px;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 6px;
  }

  h2 {
    font-size: 16px;
    font-weight: 700;
    color: #0f766e;
    margin-top: 24px;
    margin-bottom: 10px;
    border-left: 4px solid #0d9488;
    padding-left: 10px;
    page-break-after: avoid;
  }

  h3 {
    font-size: 14px;
    font-weight: 700;
    color: #1e293b;
    margin-top: 16px;
    margin-bottom: 6px;
    page-break-after: avoid;
  }

  p {
    margin-top: 0;
    margin-bottom: 10px;
    color: #334155;
  }

  ul, ol {
    margin-top: 0;
    margin-bottom: 12px;
    padding-left: 20px;
  }

  li {
    margin-bottom: 4px;
    color: #334155;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
    margin-bottom: 18px;
    font-size: 12px;
    page-break-inside: avoid;
  }

  th {
    background: #f1f5f9;
    color: #0f172a;
    font-weight: 700;
    text-align: left;
    padding: 8px 12px;
    border: 1px solid #cbd5e1;
  }

  td {
    padding: 8px 12px;
    border: 1px solid #e2e8f0;
    color: #334155;
  }

  tr:nth-child(even) td {
    background: #f8fafc;
  }

  code {
    font-family: 'JetBrains Mono', monospace;
    background: #f1f5f9;
    color: #0f766e;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 11.5px;
    border: 1px solid #e2e8f0;
  }

  pre {
    background: #0f172a;
    color: #f8fafc;
    padding: 12px 16px;
    border-radius: 8px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    line-height: 1.5;
    overflow-x: auto;
    page-break-inside: avoid;
    margin-bottom: 16px;
  }

  pre code {
    background: transparent;
    color: #f8fafc;
    padding: 0;
    border: none;
  }

  .callout {
    background: #f0fdfa;
    border: 1px solid #99f6e4;
    border-left: 4px solid #0d9488;
    padding: 10px 14px;
    border-radius: 6px;
    margin: 12px 0 16px 0;
    font-size: 12px;
  }

  .callout-title {
    font-weight: 700;
    color: #0f766e;
    margin-bottom: 4px;
  }

  .footer {
    margin-top: 30px;
    border-top: 1px solid #e2e8f0;
    padding-top: 10px;
    font-size: 10px;
    color: #94a3b8;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .page-break {
    page-break-before: always;
  }

  .tag {
    display: inline-block;
    background: #e0f2fe;
    color: #0369a1;
    font-size: 10.5px;
    font-weight: 600;
    padding: 2px 6px;
    border-radius: 4px;
    margin-right: 4px;
  }
`;

// HTML PARA EL MANUAL DE USO
const manualHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Manual de Uso - Termales Jamanco</title>
  <style>${baseCss}</style>
</head>
<body>
  <div class="header">
    <div>
      <div class="title">TERMALES JAMANCO</div>
      <div class="subtitle">Papallacta, Ecuador • Complejo Ecoturístico & Termal</div>
    </div>
    <div class="badge">Manual de Uso Oficial v1.0</div>
  </div>

  <h1>📖 Manual Integral de Uso: Sitio Público y Panel Administrativo</h1>
  <p>Este documento constituye la guía oficial y detallada de operación de la plataforma web de <strong>Termales Jamanco</strong>, diseñada tanto para los <strong>Visitantes</strong> que exploran los servicios como para el <strong>Equipo Administrativo</strong> que gestiona las operaciones, tarifas, fotografías y reservas.</p>

  <div class="callout">
    <div class="callout-title">💡 Sincronización en Tiempo Real</div>
    Toda la plataforma está conectada a la nube global de <strong>Google Firebase Firestore</strong>. Cualquier modificación realizada desde el panel de control se actualiza instantáneamente en los teléfonos y computadoras de los visitantes.
  </div>

  <h2>🌟 SECCIÓN 1: MANUAL DEL SITIO PÚBLICO (VISITANTES)</h2>

  <h3>1.1 Barra de Navegación & Reproductor de Audio Andino</h3>
  <ul>
    <li><strong>Logo Jamanco:</strong> Permite volver a la parte superior de la página en cualquier momento.</li>
    <li><strong>Navegación Dinámica:</strong> Desplazamiento suave hacia las secciones clave: <em>Sedes, Servicios, Paquetes, Galería, Cómo Llegar y Contacto</em>.</li>
    <li><strong>Reproductor de Audio Ambiental 🎵:</strong> Control interactivo para activar o pausar sonidos relajantes de fuentes termales y naturaleza del páramo andino.</li>
    <li><strong>Botón Reservas WhatsApp:</strong> Enlace directo y rápido para iniciar una conversación con el equipo de atención al cliente.</li>
  </ul>

  <h3>1.2 Portada Principal (Hero)</h3>
  <ul>
    <li><strong>Indicadores de Temperatura:</strong> Destaca las aguas termales vírgenes de 37°C a 44°C ricas en minerales volcánicos.</li>
    <li><strong>Botones de Acción Inmediata:</strong> <em>"Ver Piscinas & Tarifas"</em> para explorar el catálogo y <em>"Cómo Llegar"</em> para abrir la ruta en GPS.</li>
  </ul>

  <h3>1.3 Circuito Termal & Composición Mineral</h3>
  <p>Ficha científica e interactiva que desglosa los componentes minerales presentes en el agua (Calcio, Sulfatos, Magnesio, Sodio) y sus beneficios comprobados para la salud, estrés y relajación muscular.</p>

  <h3>1.4 Explorador de Sedes & Complejos Turísticos</h3>
  <table>
    <thead>
      <tr>
        <th>Sede / Complejo</th>
        <th>Enfoque y Características</th>
        <th>Horario Habitual</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Terjamanco 1</strong></td>
        <td>Piscinas familiares, áreas de descanso y aguas terapéuticas al aire libre.</td>
        <td>08:00 - 18:00</td>
      </tr>
      <tr>
        <td><strong>Terjamanco 2</strong></td>
        <td>Pase nocturno exclusivo, piscina termal iluminada, eventos y pool party.</td>
        <td>18:00 - 23:30</td>
      </tr>
      <tr>
        <td><strong>El Mirador Jamanco</strong></td>
        <td>Atracciones de aventura: Columpio extremo con vista al valle, laguna y botes.</td>
        <td>09:00 - 17:30</td>
      </tr>
      <tr>
        <td><strong>Hospedaje Jamanco</strong></td>
        <td>Cabañas rústicas campestres equipadas para descanso en pareja o familia.</td>
        <td>Check-in 14:00</td>
      </tr>
      <tr>
        <td><strong>Restaurante Jamanco</strong></td>
        <td>Gastronomía típica andina: Trucha fresca de Papallacta, caldos y bebidas.</td>
        <td>08:00 - 20:00</td>
      </tr>
    </tbody>
  </table>

  <h3>1.5 Catálogo de Servicios & Tarifas</h3>
  <p>Permite a los usuarios filtrar por categorías (<em>Piscinas, Hidromasaje, Aventura, Gastronomía</em>) conociendo el precio por adulto y niño, duración y qué incluye el boleto.</p>

  <h3>1.6 Paquetes Promocionales & Cotizador Inteligente</h3>
  <p>Presenta combos familiares, pases de pareja y tours de aventura. Cada tarjeta cuenta con el botón <strong>"Cotizar este paquete"</strong> que abre WhatsApp con el nombre del paquete preescrito para acelerar la reserva.</p>

  <h3>1.7 Galería Multimedia & Lightbox</h3>
  <p>Álbum fotográfico filtrable por sede. Al hacer clic sobre cualquier imagen se expande en alta resolución con visor interactivo.</p>

  <h3>1.8 Guía RoadTrip & Rutas GPS (Cómo Llegar)</h3>
  <p>Instrucciones paso a paso para viajar desde Quito (Pifo - Páramo de la Virgen - Papallacta) a 1 hora de trayecto, con botones de navegación directa para <strong>Google Maps</strong> y <strong>Waze</strong>.</p>

  <div class="page-break"></div>

  <div class="header">
    <div>
      <div class="title">TERMALES JAMANCO</div>
      <div class="subtitle">Manual de Operación Administrativa</div>
    </div>
    <div class="badge">Panel Back-Office</div>
  </div>

  <h2>⚙️ SECCIÓN 2: MANUAL DEL PANEL ADMINISTRATIVO (/admin)</h2>

  <p>El panel de administración permite a los encargados del complejo actualizar en tiempo real cualquier aspecto de la plataforma sin tocar código de programación.</p>

  <h3>2.1 Acceso & Autenticación</h3>
  <ol>
    <li>Ingresar a la ruta <code>/admin</code> o hacer clic en <em>"Acceso Admin"</em> en el pie de página.</li>
    <li>Ingresar las credenciales de usuario y contraseña administrativa.</li>
    <li>El sistema autentica la sesión mediante Tokens seguros (JWT).</li>
  </ol>

  <h3>2.2 Descripción de las 11 Pestañas de Gestión</h3>

  <table>
    <thead>
      <tr>
        <th>Pestaña</th>
        <th>Propósito y Opciones Principales</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>1. Información General</strong></td>
        <td>Edición de teléfonos, WhatsApp principal de ventas, correos, horarios de atención, coordenadas GPS y redes sociales (@Terjamancoo).</td>
      </tr>
      <tr>
        <td><strong>2. Hero & Portada</strong></td>
        <td>Modificación del título principal, textos resaltados, badges de temperatura y foto de fondo de la portada.</td>
      </tr>
      <tr>
        <td><strong>3. Sedes & Zonas</strong></td>
        <td>Creación, edición y eliminación de sedes (Terjamanco 1, 2, Mirador). Control de fotos, temperaturas, horarios y etiquetas.</td>
      </tr>
      <tr>
        <td><strong>4. Servicios & Tarifas</strong></td>
        <td>Gestión de precios para adultos y niños, horarios, categorías, lista de inclusiones y activación de la insignia <em>"Servicio Popular"</em>.</td>
      </tr>
      <tr>
        <td><strong>5. Productos & Souvenirs</strong></td>
        <td>Control de catálogo de artículos en venta (ropa térmica, recuerdos, snacks), precios y estado de disponibilidad.</td>
      </tr>
      <tr>
        <td><strong>6. Paquetes & Promos</strong></td>
        <td>Diseño de ofertas especiales, precios con descuento, inclusiones detalladas y plantilla de mensaje de WhatsApp para cotización.</td>
      </tr>
      <tr>
        <td><strong>7. Galería Multimedia</strong></td>
        <td>Subida de nuevas fotos a la nube (Google Cloud Storage), asignación de títulos y categorización por sedes.</td>
      </tr>
      <tr>
        <td><strong>8. Reseñas de Clientes</strong></td>
        <td>Moderación de testimonios, calificación por estrellas (1 a 5), procedencia del viajero e insignia de <em>Viajero Verificado</em>.</td>
      </tr>
      <tr>
        <td><strong>9. Preguntas Frecuentes</strong></td>
        <td>Creación y actualización de respuestas sobre horarios, parqueadero, vestimenta, clima y mascotas.</td>
      </tr>
      <tr>
        <td><strong>10. Sonidos Ambientales</strong></td>
        <td>Selección de la pista de relajación activa, volumen predeterminado y subida de nuevos archivos de audio <code>.mp3</code>.</td>
      </tr>
      <tr>
        <td><strong>11. Configuración & Cloud</strong></td>
        <td>
          • Estado de conexión en vivo con Google Firebase Firestore.<br>
          • Botón <strong>"🚀 Subir y Sincronizar Datos Actuales en Firebase"</strong>.<br>
          • Descarga y Restauración de Copias de Seguridad (Backup JSON).<br>
          • Cambio de Usuario y Contraseña.<br>
          • Restauración a valores de fábrica.
        </td>
      </tr>
    </tbody>
  </table>

  <h2>☁️ SECCIÓN 3: SINCRONIZACIÓN CLOUD & FLUJO DE DATOS</h2>
  <div class="callout">
    <div class="callout-title">🚀 Flujo de Publicación en Producción</div>
    Al guardar cualquier información en el panel administrativo, el sistema realiza la escritura directa en <strong>Cloud Firestore</strong> (colección <code>terjamanco_site / main_content</code>). La suscripción en vivo mediante <code>onSnapshot</code> distribuye automáticamente los datos actualizados a todos los usuarios en segundos.
  </div>

  <div class="footer">
    <div>Termales Jamanco • Papallacta, Ecuador</div>
    <div>Documento Generado: Septiembre 2026 • Página 2 de 2</div>
  </div>
</body>
</html>
`;

// HTML PARA LA FICHA TÉCNICA
const fichaHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Ficha Técnica - Termales Jamanco</title>
  <style>${baseCss}</style>
</head>
<body>
  <div class="header">
    <div>
      <div class="title">TERMALES JAMANCO</div>
      <div class="subtitle">Especificación Técnica de Arquitectura & Software</div>
    </div>
    <div class="badge">Ficha Técnica Oficial v1.0</div>
  </div>

  <h1>📋 Ficha Técnica del Sistema: Plataforma Web & Cloud</h1>

  <h2>1. IDENTIFICACIÓN Y METADATOS DEL SISTEMA</h2>
  <table>
    <tbody>
      <tr>
        <td style="width: 30%;"><strong>Nombre del Sistema</strong></td>
        <td>Plataforma Web Turística & Panel Administrativo Cloud - Termales Jamanco</td>
      </tr>
      <tr>
        <td><strong>Versión</strong></td>
        <td><code>1.0.0 (Production Release / Cloud-Ready)</code></td>
      </tr>
      <tr>
        <td><strong>Tipo de Aplicación</strong></td>
        <td>Single Page Application (SPA) + NoSQL Realtime Database + RESTful API</td>
      </tr>
      <tr>
        <td><strong>Entorno de Despliegue</strong></td>
        <td>Netlify (Hosting Global / Edge CDN) / Node.js Express (Backend Opcional)</td>
      </tr>
      <tr>
        <td><strong>Base de Datos Principal</strong></td>
        <td>Google Cloud Firestore (Base de datos NoSQL distribuida en tiempo real)</td>
      </tr>
      <tr>
        <td><strong>Almacenamiento Multimedia</strong></td>
        <td>Google Firebase Cloud Storage (Imágenes y Audios)</td>
      </tr>
      <tr>
        <td><strong>Industria / Rubro</strong></td>
        <td>Turismo, Ecoturismo, Termalismo, Gastronomía y Hospedaje</td>
      </tr>
      <tr>
        <td><strong>Ubicación de Referencia</strong></td>
        <td>Papallacta, Napo, Ecuador (a 1h de Quito por la vía Pifo)</td>
      </tr>
    </tbody>
  </table>

  <h2>2. STACK TECNOLÓGICO & DEPENDENCIAS</h2>
  <table>
    <thead>
      <tr>
        <th>Capa / Componente</th>
        <th>Tecnología / Librería</th>
        <th>Versión</th>
        <th>Propósito / Función</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Core Frontend</strong></td>
        <td>React</td>
        <td>18.3.1</td>
        <td>Arquitectura declarativa basada en componentes y Hooks.</td>
      </tr>
      <tr>
        <td><strong>Build Tool / Bundler</strong></td>
        <td>Vite</td>
        <td>5.4.x</td>
        <td>Empaquetado optimizado, Rollup chunks y HMR de alto rendimiento.</td>
      </tr>
      <tr>
        <td><strong>Motor de Estilos</strong></td>
        <td>Vanilla CSS3</td>
        <td>Modern CSS</td>
        <td>Glassmorphism, Dark Mode, variables HSL y animaciones fluidas.</td>
      </tr>
      <tr>
        <td><strong>Iconografía</strong></td>
        <td>Lucide React</td>
        <td>0.468.0</td>
        <td>Iconografía SVG vectorial de alto rendimiento.</td>
      </tr>
      <tr>
        <td><strong>Microinteracciones</strong></td>
        <td>Canvas Confetti</td>
        <td>1.9.3</td>
        <td>Efectos visuales en cotizaciones de paquetes.</td>
      </tr>
      <tr>
        <td><strong>Base de Datos Cloud</strong></td>
        <td>Firebase Firestore</td>
        <td>12.19.0</td>
        <td>Persistencia y sincronización en tiempo real con <code>onSnapshot</code>.</td>
      </tr>
      <tr>
        <td><strong>Storage Cloud</strong></td>
        <td>Firebase Storage</td>
        <td>12.19.0</td>
        <td>Almacenamiento de fotos en alta resolución y pistas de audio.</td>
      </tr>
      <tr>
        <td><strong>Servidor API Opcional</strong></td>
        <td>Express / Node.js</td>
        <td>5.2.1 / v20+</td>
        <td>Backend RESTful con soporte SSE y Firebase Admin SDK.</td>
      </tr>
      <tr>
        <td><strong>Seguridad & Auth</strong></td>
        <td>JWT & bcryptjs</td>
        <td>9.0 / 3.0</td>
        <td>Generación de tokens firmados y hashing de claves de admin.</td>
      </tr>
    </tbody>
  </table>

  <h2>3. ARQUITECTURA DE DATOS & PROTOCOLOS DE COMUNICACIÓN</h2>
  <ul>
    <li><strong>Colección Principal Firestore:</strong> <code>terjamanco_site</code></li>
    <li><strong>Documento Principal de Estado:</strong> <code>main_content</code> (Almacena info, hero, sedes, servicios, productos, paquetes, galería, reseñas, faqs y configuración de audio).</li>
    <li><strong>Protocolo de Transmisión en Vivo:</strong> Google Firestore WebSocket gRPC / WebChannel + Server-Sent Events (SSE) para clientes conectados.</li>
    <li><strong>Almacenamiento de Sesión:</strong> LocalStorage seguro para tokens JWT de sesión administrativa.</li>
  </ul>

  <div class="page-break"></div>

  <div class="header">
    <div>
      <div class="title">TERMALES JAMANCO</div>
      <div class="subtitle">Ficha Técnica • Seguridad, Requisitos y Estructura</div>
    </div>
    <div class="badge">Ficha Técnica v1.0</div>
  </div>

  <h2>4. SEGURIDAD, INTEGRIDAD Y PROTECCIÓN DE DATOS</h2>
  <table>
    <thead>
      <tr>
        <th>Área de Seguridad</th>
        <th>Estrategia Implementada</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Autenticación Admin</strong></td>
        <td>Tokens JWT firmados con clave secreta criptográfica (<code>JWT_SECRET</code>).</td>
      </tr>
      <tr>
        <td><strong>Protección de Claves</strong></td>
        <td>Encriptación unidireccional de contraseñas con algoritmo <code>bcryptjs</code>.</td>
      </tr>
      <tr>
        <td><strong>Protección contra Inyección / XSS</strong></td>
        <td>Sanitización automática en React DOM Virtual Tree y serialización estricta de JSON.</td>
      </tr>
      <tr>
        <td><strong>Subida de Archivos</strong></td>
        <td>Validación de tipos MIME (<code>image/jpeg</code>, <code>image/png</code>, <code>image/webp</code>, <code>audio/mpeg</code>) y sanitización de nombres de archivo.</td>
      </tr>
      <tr>
        <td><strong>Reglas de Seguridad Cloud</strong></td>
        <td>Políticas granulares en Firestore y Storage para lectura pública y protección de escritura.</td>
      </tr>
      <tr>
        <td><strong>Cifrado en Tránsito</strong></td>
        <td>HTTPS / TLS 1.3 en todos los endpoints de Netlify y Google Cloud.</td>
      </tr>
    </tbody>
  </table>

  <h2>5. REQUISITOS DEL SISTEMA</h2>
  <h3>5.1 Hosting y Servidor</h3>
  <ul>
    <li><strong>Hosting Estático:</strong> Netlify (CDN Global, soporte de <code>netlify.toml</code> para redirecciones SPA <code>/* -> /index.html</code>).</li>
    <li><strong>Google Firebase:</strong> Proyecto activo en Cloud Firestore y Firebase Storage (Plan Spark Gratuito o Plan Blaze).</li>
    <li><strong>Node.js (para desarrollo / backend local):</strong> Node.js v18.0.0 o superior, npm v9.0.0 o superior.</li>
  </ul>

  <h3>5.2 Compatibilidad de Navegadores de Clientes</h3>
  <ul>
    <li><span class="tag">Chrome 90+</span> <span class="tag">Safari 14+ (iOS / macOS)</span> <span class="tag">Firefox 88+</span> <span class="tag">Edge 90+</span> <span class="tag">Android WebView / Chrome Mobile</span></li>
  </ul>

  <h2>6. VARIABLES DE ENTORNO REQUERIDAS (.env)</h2>
  <pre><code># Google Firebase Cloud Client (Requerido para Netlify y Producción)
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_PROJECT_ID=terjamancoweb
VITE_FIREBASE_AUTH_DOMAIN=terjamancoweb.firebaseapp.com
VITE_FIREBASE_STORAGE_BUCKET=terjamancoweb.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=1096293222402
VITE_FIREBASE_APP_ID=1:1096293222402:web:...

# Backend Node.js Local (Opcional)
PORT=5000
JWT_SECRET=terjamanco_super_secret_jwt_key_papallacta_2025</code></pre>

  <div class="footer">
    <div>Termales Jamanco • Especificación Técnica Oficial</div>
    <div>Papallacta, Ecuador • Página 2 de 2</div>
  </div>
</body>
</html>
`;

// Escribir los archivos HTML temporales
const manualHtmlPath = path.join(rootDir, 'MANUAL_DE_USO.html');
const fichaHtmlPath = path.join(rootDir, 'FICHA_TECNICA.html');
const manualPdfPath = path.join(rootDir, 'MANUAL_DE_USO.pdf');
const fichaPdfPath = path.join(rootDir, 'FICHA_TECNICA.pdf');

fs.writeFileSync(manualHtmlPath, manualHtml, 'utf-8');
fs.writeFileSync(fichaHtmlPath, fichaHtml, 'utf-8');

console.log('✅ Archivos HTML generados exitosamente.');

// Convertir a PDF utilizando Microsoft Edge headless
try {
  console.log('🔄 Generando MANUAL_DE_USO.pdf con Microsoft Edge...');
  const cmdManual = `"${edgePath}" --headless --disable-gpu --run-all-compositor-stages-before-draw --print-to-pdf="${manualPdfPath}" --no-pdf-header-footer "${manualHtmlPath}"`;
  execSync(cmdManual);
  console.log(`✅ MANUAL_DE_USO.pdf generado en: ${manualPdfPath}`);
} catch (e) {
  console.error('Error generando MANUAL_DE_USO.pdf:', e.message);
}

try {
  console.log('🔄 Generando FICHA_TECNICA.pdf con Microsoft Edge...');
  const cmdFicha = `"${edgePath}" --headless --disable-gpu --run-all-compositor-stages-before-draw --print-to-pdf="${fichaPdfPath}" --no-pdf-header-footer "${fichaHtmlPath}"`;
  execSync(cmdFicha);
  console.log(`✅ FICHA_TECNICA.pdf generado en: ${fichaPdfPath}`);
} catch (e) {
  console.error('Error generando FICHA_TECNICA.pdf:', e.message);
}

console.log('🎉 ¡Proceso de generación de PDFs completado!');
