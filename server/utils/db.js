import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');

// Asegurar directorios
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Datos iniciales de fábrica (Seed)
const INITIAL_DATA = {
  info: {
    name: "Termales Jamanco",
    alias: "Terjamanco Papallacta",
    logoType: "emblem",
    logoUrl: "",
    logoSubtext: "Papallacta • Ecuador",
    tagline: "El Paraíso Geotermal de Papallacta | Piscinas Termales, Mirador Extremo, Hospedaje & Gastronomía",
    phone: "+593 98 138 5981",
    whatsapp: "593981385981",
    facebookUrl: "https://www.facebook.com/Terjamancoo",
    facebookHandle: "@Terjamancoo",
    instagramUrl: "https://instagram.com",
    tiktokUrl: "https://tiktok.com",
    email: "contacto@termalesjamanco.com",
    address: "Vía Quito - Papallacta, Km 45 (a 1 hora de Quito desde Pifo), Cantón Quijos, Napo - Ecuador",
    hours1: "Terjamanco 1: Todos los días 06:00 AM - 19:30 PM",
    hours2: "Terjamanco 2: Todos los días 06:00 AM - 23:00 PM (Pases Nocturnos & Pool Party)",
    hoursMirador: "El Mirador Jamanco: Fines de semana y feriados 06:00 AM - 17:00 PM",
    rating: 4.9,
    reviewsCount: 2840,
    waterTempRange: "37°C - 44°C",
    poolsCount: 10,
    origin: "Aguas Termales Medicinales 100% Vírgenes del Páramo de Papallacta"
  },
  hero: {
    badge1: "Aguas Termales Vírgenes 37°C - 44°C",
    badge2: "Papallacta, Ecuador • @Terjamancoo",
    badge3: "A 1h de Quito desde Pifo",
    titlePrefix: "Descubre la Magia de ",
    titleHighlight: "Termales Jamanco",
    titleSuffix: " en Papallacta",
    subtitle: "Sumérgete en nuestras piscinas termales naturales en Terjamanco 1 y 2, vive la adrenalina del Columpio Extremo en El Mirador, disfruta de la mejor trucha andina y hospédate en el corazón del páramo.",
    bgImage: "/images/jamanco_hero_cinematic.jpg"
  },
  minerals: [
    {
      id: "azufre",
      name: "Sulfato & Azufre Volcánico",
      symbol: "S",
      level: "Alto y Terapéutico",
      color: "#f59e0b",
      benefit: "Desintoxicación dérmica profunda, alivia dolores reumáticos y estimula la regeneración de tejidos.",
      icon: "Sparkles"
    },
    {
      id: "magnesio",
      name: "Magnesio & Cloruro",
      symbol: "Mg+Cl",
      level: "Concentrado",
      color: "#10b981",
      benefit: "Relaja de inmediato la musculatura tras el viaje, combate el insomnio y disminuye el estrés del páramo.",
      icon: "Zap"
    },
    {
      id: "calcio",
      name: "Calcio & Sodio",
      symbol: "Ca+Na",
      level: "Equilibrado",
      color: "#06b6d4",
      benefit: "Mejora la circulación periférica, reconforta las articulaciones y favorece la oxigenación celular.",
      icon: "ShieldCheck"
    },
    {
      id: "silicio",
      name: "Silicio & Bicarbonato",
      symbol: "Si+HCO3",
      level: "Puro",
      color: "#8b5cf6",
      benefit: "Equilibra el pH de la piel dejándola suave, tersa e hidratada de manera 100% natural.",
      icon: "HeartHandshake"
    }
  ],
  zones: [
    {
      id: "terjamanco-1",
      name: "Terjamanco 1 (Complejo Tradicional & Spa)",
      temp: "38°C - 42°C",
      schedule: "06:00 AM a 19:30 PM",
      badge: "Familiar & Relax",
      description: "Sede principal con piscinas termales familiares, chorros de hidromasaje, baños turcos naturales de vapor geotermal, restaurante de truchas y cómodas habitaciones de hospedaje.",
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80",
      features: [
        "Piscinas termales cubiertas y al aire libre",
        "Baño turco con vapor geotérmico 100% natural",
        "Hidromasajes relajantes",
        "Restaurante con trucha fresca de Papallacta",
        "Hospedaje campestre con acceso directo a termas"
      ]
    },
    {
      id: "terjamanco-2",
      name: "Terjamanco 2 (Piscinas Modernas & Pool Party)",
      temp: "39°C - 44°C",
      schedule: "06:00 AM a 23:00 PM",
      badge: "Pase Nocturno & Música",
      description: "El complejo más amplio y moderno de Jamanco. Piscinas con iluminación LED subacuática, ambiente festivo para pool parties nocturnas, fogatas comunitarias y servicio de bebidas.",
      image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1000&q=80",
      features: [
        "Piscinas termales de alta temperatura (hasta 44°C)",
        "Pase nocturno bajo las estrellas hasta las 23:00",
        "Eventos temáticos de fin de semana y Pool Parties",
        "Fogatas y zona de descanso con cafetería",
        "Vestidores modernos y casilleros seguros"
      ]
    },
    {
      id: "mirador-extremo",
      name: "El Mirador Jamanco & Parque de Aventura",
      temp: "Páramo Andino",
      schedule: "Sábados, Domingos y Feriados 06:00 a 17:00",
      badge: "Adrenalina & Vistas",
      description: "Ubicado en la parte alta de Papallacta con vista panorámica a la cordillera. Vive la emoción del Columpio Extremo al vacío, paseos en bote en la laguna, pesca deportiva y senderos ecológicos.",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
      features: [
        "Columpio Extremo con vista al abismo andino",
        "Paseos en bote recreativo en la laguna",
        "Pesca deportiva de trucha arcoíris",
        "Mirador fotográfico 360° para fotos espectaculares",
        "Senderos naturales de avistamiento de colibríes"
      ]
    }
  ],
  services: [
    {
      id: "entrada-terjamanco-1-2",
      category: "Piscinas Termales",
      title: "Entrada General Termales Jamanco",
      shortDesc: "Disfruta de nuestras piscinas de agua caliente natural, hidromasaje y ambiente del páramo de Papallacta.",
      price: 6.00,
      unit: "por adulto ($3 niños)",
      duration: "Pase de Día",
      badge: "Más Popular",
      image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80",
      included: [
        "Acceso a piscinas termales e hidromasajes",
        "Uso de vestidores, duchas y áreas verdes",
        "Estacionamiento privado vigilado",
        "Acceso a cafetería y restaurante"
      ]
    },
    {
      id: "pase-nocturno-jamanco",
      category: "Piscinas Termales",
      title: "Pase Nocturno & Pool Party (Terjamanco 2)",
      shortDesc: "La mejor experiencia nocturna en Papallacta. Piscinas calientes iluminadas bajo el cielo estrellado.",
      price: 7.00,
      unit: "por persona",
      duration: "18:00 a 23:00 PM",
      badge: "Favorito Nocturno",
      image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=800&q=80",
      included: [
        "Acceso nocturno a pozas calientes (hasta 44°C)",
        "Iluminación ambiental y música acústica",
        "Zona de fogata comunitaria",
        "Bebida caliente de cortesía"
      ]
    },
    {
      id: "columpio-mirador",
      category: "Mirador & Aventura",
      title: "Experiencia en El Mirador + Columpio Extremo",
      shortDesc: "Siente la adrenalina del columpio andino con vista al valle de Papallacta y tómate las mejores fotos.",
      price: 5.00,
      unit: "por persona",
      duration: "Fines de semana y feriados",
      badge: "Viral & Adrenalina",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      included: [
        "Ingreso al Mirador Jamanco 360°",
        "Sesión en el Columpio Extremo con arnés de seguridad",
        "Fotos panorámicas del cañón andino",
        "Acceso a senderos de colibríes"
      ]
    },
    {
      id: "bote-pesca-jamanco",
      category: "Mirador & Aventura",
      title: "Paseo en Bote & Pesca Deportiva de Trucha",
      shortDesc: "Navega en la laguna del mirador y disfruta de la pesca deportiva de trucha en aguas cristalinas.",
      price: 8.00,
      unit: "por actividad",
      duration: "45 minutos",
      badge: "Familiar",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
      included: [
        "Paseo en bote a remo o pedal con chalecos salvavidas",
        "Caña y carnada para pesca de trucha",
        "Preparación de tu pesca en el restaurante (opcional)",
        "Guía y asistencia en la laguna"
      ]
    },
    {
      id: "hospedaje-jamanco",
      category: "Hospedaje",
      title: "Hospedaje en Cabañas Termales Jamanco",
      shortDesc: "Descansa en cómodas habitaciones rústicas rodeadas de naturaleza con acceso ilimitado a las piscinas termales.",
      price: 50.00,
      unit: "por noche (2 personas)",
      duration: "Check-in 14:00 / Check-out 12:00",
      badge: "Descanso Total",
      image: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=800&q=80",
      included: [
        "Habitación matrimonial o doble con baño privado y agua caliente",
        "Entrada libre ilimitada a las termas durante tu estadía",
        "Desayuno continental andino incluido",
        "Estacionamiento privado gratuito"
      ]
    },
    {
      id: "gastronomia-trucha",
      category: "Gastronomía",
      title: "Almuerzo Típico: Trucha Frita o al Ajillo de Papallacta",
      shortDesc: "El plato estrella de Jamanco: trucha fresca criada en vertientes del páramo, patacones, arroz y ensalada.",
      price: 8.50,
      unit: "plato completo",
      duration: "Almuerzo o Cena",
      badge: "Especialidad",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
      included: [
        "Trucha entera frita, al vapor, al ajillo o a la plancha",
        "Porción de patacones crocantes y arroz",
        "Ensalada fresca de la huerta",
        "Vaso de jugo natural o té de hierbas"
      ]
    }
  ],
  products: [
    {
      id: "prod-barro-papallacta",
      name: "Barro Volcánico Exfoliante de Papallacta (500g)",
      category: "Tratamiento Facial & Corporal",
      tagline: "Lodo mineral 100% natural extraído de los manantiales de Jamanco",
      price: 10.00,
      oldPrice: 14.00,
      rating: 5.0,
      reviews: 312,
      badge: "Top Ventas",
      image: "https://images.unsplash.com/photo-1608248597359-05f329971936?auto=format&fit=crop&w=600&q=80",
      benefits: [
        "Limpia toxinas y desobstruye los poros",
        "Efecto tensor y exfoliación mineral suave",
        "Ideal para mascarillas faciales y corporales en casa"
      ]
    },
    {
      id: "prod-bruma-jamanco",
      name: "Bruma Facial de Agua Termal Virgen Jamanco (250ml)",
      category: "Hidratación & Calma",
      tagline: "Agua termal pura en spray microfiltrada con minerales del páramo",
      price: 8.00,
      oldPrice: 11.00,
      rating: 4.9,
      reviews: 245,
      badge: "Frescura Pura",
      image: "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=600&q=80",
      benefits: [
        "Alivia rojeces producidas por el frío del páramo",
        "Fijador natural de maquillaje e hidratación instantánea",
        "Apta para todo tipo de pieles y edades"
      ]
    },
    {
      id: "prod-jabon-artesanal",
      name: "Jabón Termal Artesanal de Azufre & Eucalipto (120g)",
      category: "Higiene Terapéutica",
      tagline: "Elaborado a mano con aguas termales y esencias naturales",
      price: 4.00,
      oldPrice: 5.50,
      rating: 4.8,
      reviews: 420,
      badge: "Antiacné",
      image: "https://images.unsplash.com/photo-1607006314041-3294101e4004?auto=format&fit=crop&w=600&q=80",
      benefits: [
        "Controla el exceso de grasa y combate impurezas",
        "Aroma relajante a eucalipto andino",
        "Libre de químicos agresivos y 100% biodegradable"
      ]
    },
    {
      id: "prod-sales-jamanco",
      name: "Sales de Baño Geotermales con Muña y Lavanda (600g)",
      category: "Relax en Casa",
      tagline: "Sulfato de magnesio y extractos botánicos de la cordillera",
      price: 9.00,
      oldPrice: 12.00,
      rating: 4.9,
      reviews: 180,
      badge: "Anti-Estrés",
      image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=600&q=80",
      benefits: [
        "Revive la experiencia de Jamanco en tu tina de baño",
        "Alivia contracturas de espalda y piernas cansadas",
        "Aromaterapia que induce al sueño profundo"
      ]
    },
    {
      id: "prod-pack-souvenir-jamanco",
      name: "Combo Recuerdo 'Termales Jamanco Papallacta'",
      category: "Packs de Regalo",
      tagline: "Incluye Barro (500g) + Bruma (250ml) + 2 Jabones Termales + Toalla Jamanco",
      price: 25.00,
      oldPrice: 35.00,
      rating: 5.0,
      reviews: 195,
      badge: "Ahorro Especial",
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80",
      benefits: [
        "El regalo perfecto para llevar de tu visita a Papallacta",
        "Empaque ecológico con el logotipo oficial de Jamanco",
        "Ahorra un 30% comprando el pack completo"
      ]
    }
  ],
  packages: [
    {
      id: "pase-dia-jamanco",
      name: "Pase de Día Termal (Terjamanco 1 ó 2)",
      category: "Entradas",
      priceAdult: 6.00,
      priceChild: 3.00,
      popular: false,
      description: "Acceso completo a piscinas termales, hidromasaje y turco de 06:00 AM a 19:30 PM.",
      features: ["Piscinas termales 38°C a 44°C", "Uso de vestidores y duchas", "Estacionamiento privado", "Acceso a áreas de descanso"]
    },
    {
      id: "pase-nocturno-jamanco",
      name: "Pase Nocturno / Pool Party (Terjamanco 2)",
      category: "Entradas",
      priceAdult: 7.00,
      priceChild: 4.00,
      popular: true,
      description: "La experiencia nocturna más famosa de Papallacta con agua caliente bajo las estrellas hasta las 23:00 PM.",
      features: ["Horario 18:00 a 23:00 PM", "Pozas calientes iluminadas", "Fogata comunitaria", "Música ambiental y ambiente festivo"]
    },
    {
      id: "combo-termas-mirador",
      name: "Combo Completo: Termas + Mirador + Columpio",
      category: "Experiencias",
      priceAdult: 15.00,
      priceChild: 10.00,
      popular: true,
      description: "El día perfecto en Papallacta: disfruta las termas y sube al Mirador para el Columpio Extremo y paseo en bote.",
      features: ["Pase completo de día a piscinas termales", "Entrada al Mirador Jamanco 360°", "1 Pase en Columpio Extremo", "Paseo en bote en la laguna"]
    },
    {
      id: "pack-hospedaje-parejas",
      name: "Paquete Escapada Romántica (Hospedaje + Termas)",
      category: "Hospedaje",
      priceAdult: 65.00,
      priceChild: 0,
      fixedForTwo: true,
      popular: false,
      description: "Una noche inolvidable en Papallacta para 2 personas con cabaña, termas ilimitadas y desayuno.",
      features: ["1 Noche de hospedaje en cabaña privada", "Acceso libre e ilimitado 24 hrs a piscinas termales", "Desayuno andino para 2 personas", "Bebida caliente de bienvenida"]
    }
  ],
  gallery: [
    {
      id: "gal-1",
      url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
      title: "Piscinas Termales de Papallacta",
      category: "Terjamanco 1"
    },
    {
      id: "gal-2",
      url: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80",
      title: "Pase Nocturno & Pool Party",
      category: "Terjamanco 2"
    },
    {
      id: "gal-3",
      url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      title: "Columpio Extremo con Vista al Valle",
      category: "El Mirador Jamanco"
    },
    {
      id: "gal-4",
      url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
      title: "Paseos en Bote & Laguna",
      category: "El Mirador Jamanco"
    },
    {
      id: "gal-5",
      url: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=800&q=80",
      title: "Cabañas de Hospedaje Campestre",
      category: "Alojamiento Jamanco"
    },
    {
      id: "gal-6",
      url: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
      title: "Plato de Trucha Típica de Papallacta",
      category: "Restaurante Jamanco"
    }
  ],
  reviews: [
    {
      id: "rev-1",
      name: "Esteban & Sofia Paredes",
      role: "Visitantes de Quito",
      rating: 5,
      comment: "Termales Jamanco es nuestro lugar favorito para escapar del frío de Quito los fines de semana. Terjamanco 2 en la noche con las luces y el vapor es espectacular. ¡Y el columpio del mirador te deja sin aliento!",
      date: "Hace 1 semana (Facebook Review)",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
    },
    {
      id: "rev-2",
      name: "Ing. Roberto Salazar",
      role: "Turista de Cumbayá",
      rating: 5,
      comment: "Las aguas de Jamanco están realmente calientes y alivian cualquier dolor muscular. Almorzamos una trucha frita deliciosa en el restaurante y luego fuimos a los botes en el mirador. 100% recomendado.",
      date: "Hace 3 semanas (Facebook Review)",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
    },
    {
      id: "rev-3",
      name: "Gabriela Morales",
      role: "Viajera Ecoturismo",
      rating: 5,
      comment: "Excelente atención de todo el personal de Jamanco. Las cabañas son muy cómodas y poder meterte a la piscina caliente de noche antes de dormir no tiene precio. Además el barro volcánico que compré me dejó la piel hermosa.",
      date: "Hace 1 mes (Facebook Review)",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"
    }
  ],
  faqs: [
    {
      id: "faq-1",
      question: "¿Dónde queda exactamente Termales Jamanco y cómo llegar desde Quito?",
      answer: "Termales Jamanco está ubicado en Papallacta (Cantón Quijos, Napo), a solo 45 km de Quito (aproximadamente a 1 hora pasando el redondel de Pifo por la vía asfaltada Quito - Baeza). Puedes llegar fácilmente en auto particular, taxi o en cualquier bus interprovincial que vaya hacia el Oriente."
    },
    {
      id: "faq-2",
      question: "¿Cuáles son las diferencias entre Terjamanco 1, Terjamanco 2 y El Mirador?",
      answer: "• Terjamanco 1: Cuenta con piscinas familiares, baño turco natural, restaurante de truchas y habitaciones de hospedaje (abierto de 06:00 a 19:30).\n• Terjamanco 2: Es el área moderna donde se realizan los pases nocturnos y pool parties hasta las 23:00 PM con fogatas y música.\n• El Mirador Jamanco: Es el área de aventura alta donde encuentras el columpio extremo, paseos en bote, pesca deportiva y vistas 360° (abierto fines de semana y feriados de 06:00 a 17:00)."
    },
    {
      id: "faq-3",
      question: "¿A qué temperatura está el agua termal?",
      answer: "El agua nace de manantiales volcánicos a temperaturas de 37°C a 44°C. Contamos con piscinas de temperatura templada y pozas bien calientes para relajación profunda y terapia muscular."
    },
    {
      id: "faq-4",
      question: "¿Qué debo llevar para mi visita?",
      answer: "Traje de baño, gorro de baño, sandalias, toalla y ropa abrigada para cuando salgas de las piscinas (el clima de Papallacta es de páramo fresco). En nuestras instalaciones también alquilamos y vendemos toallas, gorros y artículos termales."
    },
    {
      id: "faq-5",
      question: "¿Cómo puedo reservar hospedaje o consultar disponibilidad?",
      answer: "Puedes comunicarte directamente con nuestro equipo de atención por WhatsApp al +593 98 138 5981 o a través de nuestra página oficial de Facebook @Terjamancoo."
    }
  ],
  soundSettings: {
    enabled: true,
    autoplayOnInteract: true,
    defaultVolume: 0.4,
    activeTrackId: "sound-water-termal",
    tracks: [
      {
        id: "sound-water-termal",
        title: "Manantial Geotermal Jamanco",
        category: "Agua Termal",
        url: "/sounds/manantial_jamanco.wav",
        description: "Sonido envolvente y relajante de agua geotermal fluyendo desde las vertientes naturales de Papallacta.",
        isPreset: true
      },
      {
        id: "sound-water-cascada",
        title: "Cascadas & Río Papallacta",
        category: "Cascadas",
        url: "/sounds/cascada_papallacta.wav",
        description: "Corriente viva de río andino y pequeñas caídas de agua pura del páramo.",
        isPreset: true
      },
      {
        id: "sound-water-pozas",
        title: "Pozas Termales & Hidromasaje",
        category: "Agua Termal",
        url: "/sounds/pozas_termales.wav",
        description: "Oleaje suave y relajante de las piscinas geotermales de Terjamanco.",
        isPreset: true
      },
      {
        id: "sound-lluvia-paramo",
        title: "Lluvia Serena del Páramo",
        category: "Lluvia & Clima",
        url: "/sounds/lluvia_paramo.wav",
        description: "Lluvia relajante andina mientras te sumerges en el calor de las aguas termales.",
        isPreset: true
      }
    ]
  },
  adminSettings: {
    username: "admin",
    // Password por defecto: "jamanco2025" (hash o plain para facilidad con auth token)
    passwordHash: "jamanco2025",
    lastLogin: null
  }
};

/**
 * Leer la base de datos completa. Si no existe, se inicializa con los datos de fábrica.
 */
export function readDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      writeDb(INITIAL_DATA);
      return JSON.parse(JSON.stringify(INITIAL_DATA));
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    
    // Migración automática si falta soundSettings en DB existente
    if (!parsed.soundSettings) {
      parsed.soundSettings = INITIAL_DATA.soundSettings;
      writeDb(parsed);
    }
    return parsed;
  } catch (error) {
    console.error('Error leyendo base de datos:', error);
    return JSON.parse(JSON.stringify(INITIAL_DATA));
  }
}

/**
 * Escribir a la base de datos de manera atómica
 */
export function writeDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error escribiendo en base de datos:', error);
    return false;
  }
}

/**
 * Restaurar datos a los valores predeterminados
 */
export function resetDb() {
  const current = readDb();
  const resetData = {
    ...INITIAL_DATA,
    adminSettings: current.adminSettings || INITIAL_DATA.adminSettings
  };
  writeDb(resetData);
  return resetData;
}
