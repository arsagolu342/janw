# 🌿 Termales Jamanco (Terjamanco) - Plataforma Web Oficial

> Experiencia digital inmersiva y panel de administración integral para el complejo de aguas termales y bienestar **Termales Jamanco**, ubicado en Papallacta, Ecuador.

---

## 📋 Tabla de Contenidos
1. [Descripción General](#-descripción-general)
2. [Características Principales](#-características-principales)
3. [Estructura del Proyecto](#-estructura-del-proyecto)
4. [Tecnologías Utilizadas](#-tecnologías-utilizadas)
5. [Panel de Administración (CMS)](#-panel-de-administración-cms)
6. [Instalación y Configuración](#-instalación-y-configuración)
7. [Scripts Disponibles](#-scripts-disponibles)
8. [API Endpoints y Backend](#-api-endpoints-y-backend)
9. [Diseño y Experiencia de Usuario](#-diseño-y-experiencia-de-usuario)
10. [Licencia](#-licencia)

---

## 🌋 Descripción General

**Termales Jamanco** es una aplicación web moderna orientada a brindar a los turistas y visitantes una experiencia interactiva y sensorial antes de su visita, además de un potente sistema de gestión de contenidos (CMS/Admin) para el equipo administrativo.

La plataforma permite a los usuarios:
- Explorar las pozas termales, propiedades terapéuticas y minerales del agua.
- Calcular presupuestos y cotizar paquetes en tiempo real.
- Escuchar paisajes sonoros relajantes del páramo andino con un reproductor de audio ambiental.
- Ver el clima en vivo de Papallacta y la ruta de viaje desde Quito.
- Comprar souvenirs y productos artesanales mediante un carrito de compras interactivo.
- Gestionar reservas y contacto directo vía WhatsApp.

---

## ✨ Características Principales

### 🖥️ Módulos de la Página Pública (Frontend)
- **Cabecera Inmersiva (Hero Section):**
  - Tipografía moderna, llamadas a la acción (CTA) dinámicas y fondo cinemático.
  - Indicador de estado en vivo (Abierto/Cerrado) y aforo actual.
- **Widgets Interactivos:**
  - **Widget de Clima Termal:** Temperatura ambiental vs. temperatura del agua en las termas en tiempo real.
  - **Road Trip Widget:** Calculadora de ruta y tiempo de viaje estimado desde Quito a Papallacta con paradas turísticas recomendadas.
  - **Experiencia 360° / Slider de Pozas:** Comparativa y recorrido interactivo por las distintas piscinas.
- **Beneficios Minerales & Circuito Termal:**
  - Infografía interactiva sobre el contenido mineral (Azufre, Magnesio, Calcio, Sodio) y sus beneficios para la salud.
  - Guía paso a paso del circuito hidrotermal recomendado.
- **Servicios, Entradas y Paquetes:**
  - Catálogo de servicios (entradas diurnas, nocturnas, masajes spa, camping).
  - Paquetes especiales familiares, para parejas y aventureros.
- **Tienda de Souvenirs & Carrito de Compras:**
  - Catálogo de productos artesanales, toallas térmicas y productos locales.
  - Carrito de compras con cálculo de totales y confirmación directa por WhatsApp.
- **Calculadora de Reservas Interactiva:**
  - Selector de fecha, adultos, niños, paquetes y servicios adicionales con desglose instantáneo del costo.
- **Galería Fotográfica & Testimonios:**
  - Galería con filtros de categorías (Pozas, Naturaleza, Spa, Noche).
  - Reseñas verificadas de visitantes y calificación promedio.
- **Reproductor de Audio Ambiental (Soundscapes):**
  - Sonidos reales del páramo: *Cascada de Papallacta, Lluvia de Páramo, Manantial Jamanco y Pozas Termales*.
  - Control de volumen, modo loop y temporizador de relajación.
- **Mascota Interactiva Flotante:**
  - "Osito Jamanco" flotante con mensajes de bienvenida y tips para el visitante.
- **Modo Claro / Oscuro:**
  - Soporte completo para alternar entre tema oscuro (Deep Thermal Night) y claro con persistencia.

---

## 🛠️ Panel de Administración (CMS)

Acceso mediante `/#admin` en la barra de navegación o pie de página. Cuenta con autenticación por JWT y módulo de gestión en tiempo real:

| Pestaña | Descripción |
| :--- | :--- |
| 📊 **Resumen General** | Métricas clave, visitas estimadas, resumen de reservas y estado de los servicios. |
| 🏢 **Empresa & Logotipo** | Subida y actualización de logotipos (original y blanco), información de contacto, teléfonos y redes. |
| ✨ **Cabecera (Hero)** | Edición de títulos principales, subtítulos, badges y banners promocionales. |
| 📍 **Sedes & Circuitos** | Gestión de temperaturas, horarios y aforos por cada poza del complejo. |
| 🌊 **Servicios & Entradas** | Creación y edición de tipos de entrada, precios y descripciones. |
| 🛍️ **Tienda & Souvenirs** | Administración del inventario de la tienda física y digital. |
| 🎫 **Paquetes & Tarifas** | Configuración de paquetes todo incluido y promociones vigentes. |
| 📷 **Galería de Fotos** | Subida de imágenes vía Multer con previsualización y eliminación. |
| ⭐ **Testimonios & Reseñas** | Aprobación, moderación y adición de comentarios de clientes. |
| ❓ **Preguntas Frecuentes** | Mantenimiento de la sección de FAQ y respuestas para visitantes. |
| 🧪 **Minerales & Salud** | Ajuste de datos químicos y propiedades medicinales del agua. |
| 🎵 **Sonidos Relajantes** | Subida y gestión de pistas de audio en formato `.wav` / `.mp3` para el reproductor. |
| ⚙️ **Ajustes & Seguridad** | Cambio de credenciales de administrador y configuración del servidor. |

---

## 🗂️ Estructura del Proyecto

```
Jan/
├── public/                 # Archivos estáticos públicos (imágenes, sonidos, iconos)
│   ├── images/
│   └── sounds/
├── server/                 # Backend Node.js / Express
│   ├── data/
│   │   └── db.json         # Base de datos JSON persistente
│   ├── routes/
│   │   ├── api.js          # Rutas CRUD del sitio
│   │   ├── auth.js         # Autenticación y JWT
│   │   └── upload.js       # Subida de imágenes y audio (Multer)
│   ├── utils/
│   │   └── db.js           # Lógica de lectura/escritura en db.json
│   ├── uploads/            # Archivos multimedia subidos desde el Admin
│   └── server.js           # Punto de entrada del servidor Express (Puerto 5000)
├── src/                    # Frontend React + Vite
│   ├── admin/              # Panel de administración completo
│   │   ├── components/     # Componentes del Admin (AudioUploader, ImageUploader)
│   │   ├── tabs/           # Vistas de cada módulo del CMS
│   │   ├── AdminDashboard.jsx
│   │   └── AdminLogin.jsx
│   ├── components/         # Componentes modulares del cliente público
│   │   ├── AmbientAudioPlayer.jsx
│   │   ├── BookingCalculator.jsx
│   │   ├── BookingModal.jsx
│   │   ├── CartModal.jsx
│   │   ├── ExperienceSliderWidget.jsx
│   │   ├── FAQAndLocation.jsx
│   │   ├── FloatingBearMascot.jsx
│   │   ├── Footer.jsx
│   │   ├── GalleryAndReviews.jsx
│   │   ├── Hero.jsx
│   │   ├── LiveActivityTicker.jsx
│   │   ├── Logo.jsx
│   │   ├── Navbar.jsx
│   │   ├── ProductsSection.jsx
│   │   ├── RoadTripWidget.jsx
│   │   ├── ServicesSection.jsx
│   │   ├── ThermalBenefits.jsx
│   │   ├── ThermalCircuit.jsx
│   │   └── ThermalWeatherWidget.jsx
│   ├── context/
│   │   └── SiteDataContext.jsx # Estado global y sincronización con Backend
│   ├── data/
│   │   └── terjamancoData.js   # Datos por defecto / fallback
│   ├── services/
│   │   └── api.js          # Cliente HTTP para el backend
│   ├── App.jsx             # Componente raíz
│   ├── index.css           # Sistema de diseño y variables CSS
│   └── main.jsx            # Punto de montaje React
├── package.json
└── vite.config.js
```

---

## 🚀 Tecnologías Utilizadas

### Frontend
- **React 18** + **Vite**: Desarrollo rápido y componentes reactivos optimizados.
- **Lucide React**: Iconografía moderna y consistente.
- **Canvas Confetti**: Animaciones de celebración al reservar o comprar.
- **Vanilla CSS (Custom Design System)**: Variables CSS con soporte para modo oscuro/claro, efecto Glassmorphism, gradientes térmicos y diseño totalmente responsive.

### Backend
- **Node.js** + **Express 5**: Servidor API REST ligero y de alto rendimiento.
- **Multer**: Procesamiento y almacenamiento seguro de imágenes (`.png`, `.jpg`, `.webp`) y audios (`.wav`, `.mp3`).
- **JSON Web Token (JWT)** & **Bcrypt.js**: Autenticación segura y encriptación de contraseñas.
- **CORS** & **Dotenv**: Manejo de variables de entorno y solicitudes entre dominios.

---

## 💻 Instalación y Configuración

### Prerrequisitos
- [Node.js](https://nodejs.org/) (versión 18 o superior recomendada)
- [npm](https://www.npmjs.com/)

### 1. Clonar el repositorio
```bash
git clone git@github.com:arsagolu342/janw.git
cd janw
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno (Opcional)
Crear un archivo `.env` en la raíz si deseas personalizar puertos o claves:
```env
PORT=5000
JWT_SECRET=tu_clave_secreta_super_segura
```

---

## ⚡ Scripts Disponibles

En la raíz del proyecto puedes ejecutar:

| Comando | Descripción |
| :--- | :--- |
| `npm run dev:all` | **(Recomendado)** Inicia simultáneamente el servidor backend (puerto 5000) y el frontend Vite (puerto 3000). |
| `npm run dev` | Inicia únicamente el servidor de desarrollo de Vite (Frontend). |
| `npm run server` | Inicia únicamente el servidor Express (Backend API). |
| `npm run build` | Compila y optimiza la aplicación para producción en la carpeta `dist/`. |
| `npm run preview` | Previsualiza localmente el build de producción. |

---

## 🌐 API Endpoints y Backend

El backend se ejecuta por defecto en `http://localhost:5000`.

- `GET /api/health` - Estado de salud del servidor.
- `GET /api/data` - Obtiene todos los datos del sitio (información, servicios, productos, galería, etc.).
- `PUT /api/data` - Actualiza secciones completas del sitio (Requiere Token JWT).
- `POST /api/auth/login` - Inicia sesión como administrador y retorna el Token JWT.
- `POST /api/upload/image` - Sube una imagen al servidor (`multipart/form-data`).
- `POST /api/upload/audio` - Sube un archivo de audio al servidor (`multipart/form-data`).
- `GET /uploads/:filename` - Entrega los archivos multimedia subidos.

---

## 🎨 Diseño y Experiencia de Usuario

- **Paleta de Colores Inspirada en los Andes y Aguas Termales:**
  - Tonos esmeralda mineral (`#10b981`), azul glaciar (`#06b6d4`), ámbar vapor (`#f59e0b`) y fondo noche volcánica (`#090d16`).
- **Accesibilidad y Responsive Design:**
  - Optimizado para pantallas móviles, tablets y monitores ultra panorámicos.
  - Navegación rápida con anclajes suaves (`Smooth Scrolling`).
- **Integración con WhatsApp:**
  - Botones de cotización, reservas y consultas preconfiguran automáticamente mensajes claros para el equipo de atención al cliente.

---

## 📄 Licencia

Desarrollado para **Termales Jamanco (Terjamanco Papallacta)**. Todos los derechos reservados.
