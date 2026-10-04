/**
 * REDSAM · Contenido de la landing
 * ------------------------------------------------------------
 * Única fuente de verdad del sitio. Los componentes consumen este
 * módulo, de modo que editar o agregar contenido no requiere tocar
 * la estructura de componentes.
 *
 * AVISO: TODO el copy y los datos (actividades, estadísticas, contacto)
 * son material de demostración de alta fidelidad. Sustitúyelo por el
 * contenido oficial de REDSAM antes de publicar.
 */


import photo01 from '../../img/01_image.jpg'
import photo02 from '../../img/02_image.jpg'
import photo03 from '../../img/03_image.jpg'
import logoSrc from '../../img/logo.png'

export const site = {
  name: 'REDSAM',
  region: 'San Martín, Perú',
  coordinates: '06°29′S · 76°21′W',
  city: 'Tarapoto',
  email: 'hola@redsam.pe',
  phone: '+51 942 000 000',
  address: 'Tarapoto · San Martín · Perú',
  social: {
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
    tiktok: 'https://tiktok.com',
    youtube: 'https://youtube.com',
    whatsapp: 'https://wa.me/51939943007',
  },
  assets: { logo: logoSrc },
}

export const navLinks = [
  { label: 'Nosotros', href: '/#nosotros' },
  { label: 'Qué hacemos', href: '/#que-hacemos' },
  { label: 'Actividades', href: '/#actividades' },
  { label: 'Contacto', href: '/#contacto' },
]

export const hero = {
  eyebrow: 'Red de jóvenes líderes',
  headline: 'El Liderazgo de San Martín es joven y está en movimiento.',
  highlight: 'es joven y está en movimiento',
  sub: 'REDSAM capacita, conecta y activa a jóvenes líderes de la región San Martín a través de formación, voluntariado y ayuda social.',
  primaryCta: { label: 'Únete a la red', href: '/#contacto' },
  secondaryCta: { label: 'Ver actividades', href: '/#actividades' },
  stats: [
    { value: 1200, prefix: '+', suffix: '', label: 'jóvenes en la red' },
    { value: 10, prefix: '', suffix: '', label: 'provincias conectadas' },
    { value: 140, prefix: '+', suffix: '', label: 'actividades realizadas' },
  ],
  collage: [photo01, photo02, photo03],
}

export const marqueeItems = [
  'Capacitación',
  'Voluntariado',
  'Ayuda social',
  'Liderazgo juvenil',
  'Red de aliados',
  'Identidad amazónica',
  'Comunidad',
  'Sostenibilidad',
]

export const about = {
  index: '01',
  kicker: 'Quiénes somos',
  title: 'Una red nacida en la Amazonía de San Martín.',
  story: [
    'REDSAM nace de una pregunta sencilla: ¿qué pasa cuando a los jóvenes de San Martín se les da formación real, espacios de confianza y una red que los sostenga?',
    'Organizamos capacitaciones para jóvenes líderes, activamos voluntariados y canalizamos ayuda social en toda la región. Creemos que el desarrollo del territorio lo escriben quienes lo habitan.',
  ],
  mission: {
    title: 'Misión',
    text: 'Fortalecer el liderazgo juvenil de San Martín mediante formación, acompañamiento y redes de colaboración que generan bienestar en las comunidades.',
  },
  vision: {
    title: 'Visión',
    text: 'Una región San Martín donde la juventud lidera el desarrollo sostenible con identidad, creatividad y compromiso.',
  },
  values: [
    { title: 'Identidad amazónica', text: 'El territorio como origen de todo lo que hacemos.' },
    { title: 'Formación con propósito', text: 'Aprendemos para transformar, no para acumular.' },
    { title: 'Red y colaboración', text: 'Ningún liderazgo florece aislado.' },
    { title: 'Incidencia real', text: 'De la idea a la acción, con impacto medible.' },
  ],
}

export const pillars = {
  index: '02',
  kicker: 'Qué hacemos',
  title: 'Tres caminos, una sola red.',
  sub: 'Todo lo que hacemos conecta con el mismo propósito: que los jóvenes de San Martín lideren el cambio que quieren ver.',
  items: [
    {
      icon: 'capacitacion',
      title: 'Capacitación de líderes',
      text: 'Talleres, mentorías y formación continua para que cada joven desarrolle liderazgo, comunicación y gestión.',
      tag: 'Formación',
    },
    {
      icon: 'voluntariado',
      title: 'Voluntariado',
      text: 'Brigadas y campañas donde los jóvenes ponen talento y tiempo al servicio de su comunidad.',
      tag: 'Acción',
    },
    {
      icon: 'ayuda',
      title: 'Ayuda social',
      text: 'Canales de solidaridad que acercan recursos, alimentos y servicios a quienes más lo necesitan.',
      tag: 'Solidaridad',
    },
    {
      icon: 'red',
      title: 'Red de aliados',
      text: 'Instituciones, empresas y organizaciones que suman espacios, conocimiento y recursos a la causa.',
      tag: 'Colaboración',
    },
  ],
}

export const activities = {
  index: '04',
  kicker: 'Actividades',
  title: 'Últimas actividades de la red.',
  sub: 'Talleres, brigadas y encuentros que ya están moviendo a la región.',
  cta: 'Quiero participar',
  items: [
    {
      image: photo01,
      category: 'Capacitación',
      date: '21–23 Ago 2026',
      place: 'Tarapoto · Presencial',
      title: 'Taller: Liderazgo para el cambio',
      text: 'Formación intensiva en liderazgo, comunicación y trabajo en equipo para jóvenes de 15 a 25 años.',
      fullText:
        'Taller intensivo de tres días para desarrollar liderazgo, comunicación asertiva y trabajo en equipo a través de dinámicas vivenciales, casos reales de la región y mentoría personalizada con líderes de la red.',
      meta: [
        { icon: 'clock', label: 'Duración', value: '3 días · 24 h' },
        { icon: 'users', label: 'Vacantes', value: '40 cupos' },
        { icon: 'check', label: 'Requisitos', value: 'De 15 a 25 años' },
        { icon: 'capacitacion', label: 'Organiza', value: 'Mesa de Capacitación' },
      ],
    },
    {
      image: photo02,
      category: 'Voluntariado',
      date: '05 Sep 2026',
      place: 'Tarapoto · Terreno',
      title: 'Brigada «Manos Unidas»',
      text: 'Jornada de apoyo social en barrios urbano-marginales: salud, kits escolares y jornadas de limpieza.',
      fullText:
        'Jornada territorial de ayuda social en barrios urbano-marginales de Tarapoto: atenciones básicas de salud, entrega de kits escolares y jornadas de limpieza comunitaria, con voluntarios de la red.',
      meta: [
        { icon: 'clock', label: 'Duración', value: '1 día · 8 h' },
        { icon: 'users', label: 'Vacantes', value: '60 cupos' },
        { icon: 'check', label: 'Requisitos', value: 'Inscripción previa' },
        { icon: 'ayuda', label: 'Organiza', value: 'Mesa de Ayuda Social' },
      ],
    },
    {
      image: photo03,
      category: 'Red',
      date: '16–18 Oct 2026',
      place: 'Moyobamba · Presencial',
      title: 'Encuentro Regional de Jóvenes Líderes',
      text: 'Tres días para conectar, formarse y diseñar iniciativas junto a jóvenes de las 10 provincias.',
      fullText:
        'Tres días para conectar, formarse y diseñar iniciativas junto a jóvenes de las 10 provincias de San Martín: ponencias, talleres de co-creación y una noche de intercambio cultural.',
      meta: [
        { icon: 'clock', label: 'Duración', value: '3 días · 2 noches' },
        { icon: 'users', label: 'Vacantes', value: '120 cupos' },
        { icon: 'check', label: 'Requisitos', value: 'Ser parte de la red' },
        { icon: 'red', label: 'Organiza', value: 'Coordinación Regional' },
      ],
    },
    {
      image: photo01,
      category: 'Ayuda social',
      date: '14 Jun 2026',
      place: 'Lamas · Terreno',
      title: 'Campaña «Invierno Solidario»',
      text: 'Recolección y entrega de abrigos, víveres y kits escolares en comunidades rurales de la región.',
      fullText:
        'Campaña de recolección y entrega de abrigos, víveres y kits escolares en comunidades rurales de Lamas. Cada voluntario suma un punto de acopio en su barrio o institución.',
      meta: [
        { icon: 'clock', label: 'Duración', value: '4 semanas' },
        { icon: 'users', label: 'Vacantes', value: '80 cupos' },
        { icon: 'check', label: 'Requisitos', value: 'Punto de acopio' },
        { icon: 'ayuda', label: 'Organiza', value: 'Mesa de Ayuda Social' },
      ],
    },
    {
      image: photo02,
      category: 'Capacitación',
      date: '08 Nov 2026',
      place: 'Virtual',
      title: 'Mentoría: Mi primer proyecto',
      text: 'Acompañamiento personalizado para convertir una idea en un proyecto comunitario real.',
      fullText:
        'Acompañamiento personalizado en línea durante seis semanas: de la idea al proyecto comunitario, con sesiones individuales, plantillas y retroalimentación de mentores de la red.',
      meta: [
        { icon: 'clock', label: 'Duración', value: '6 semanas' },
        { icon: 'users', label: 'Vacantes', value: '20 cupos' },
        { icon: 'check', label: 'Requisitos', value: 'Tener una idea' },
        { icon: 'capacitacion', label: 'Modalidad', value: 'Virtual' },
      ],
    },
    {
      image: photo03,
      category: 'Red',
      date: '20 Nov 2026',
      place: 'Juanjuí · Presencial',
      title: 'Feria de Emprendimiento Juvenil',
      text: 'Espacio para exhibir y potenciar emprendimientos creados por jóvenes de la red.',
      fullText:
        'Feria para exhibir y potenciar emprendimientos creados por jóvenes de la red: stands, rueda de inversión local, mentorías exprés y reconocimientos públicos.',
      meta: [
        { icon: 'clock', label: 'Duración', value: '1 día · 10 h' },
        { icon: 'users', label: 'Vacantes', value: '50 stands' },
        { icon: 'check', label: 'Requisitos', value: 'Inscribir tu emprendimiento' },
        { icon: 'red', label: 'Organiza', value: 'Mesa de Emprendimiento' },
      ],
    },
  ],
}

export const stats = {
  items: [
    { value: 1200, prefix: '+', suffix: '', label: 'jóvenes activos en la red' },
    { value: 10, prefix: '', suffix: '', label: 'provincias conectadas' },
    { value: 140, prefix: '+', suffix: '', label: 'actividades realizadas' },
    { value: 24, prefix: '', suffix: '+', label: 'aliados comprometidos' },
  ],
}

export const impactMap = {
  kicker: 'Impacto Territorial',
  title: 'Nuestra red en toda la región',
  sub: 'Estamos presentes en las 10 provincias de San Martín, activando liderazgos y generando proyectos sostenibles en cada territorio. Pasa el cursor por cada nodo para ver el impacto local.',
  provinces: [
    { id: 'rioja', name: 'Rioja', x: 20, y: 15, volunteers: 120, projects: 8 },
    { id: 'moyobamba', name: 'Moyobamba', x: 35, y: 18, volunteers: 150, projects: 12 },
    { id: 'lamas', name: 'Lamas', x: 45, y: 30, volunteers: 90, projects: 5 },
    { id: 'san-martin', name: 'San Martín (Tarapoto)', x: 65, y: 40, volunteers: 450, projects: 24, highlight: true },
    { id: 'el-dorado', name: 'El Dorado', x: 40, y: 45, volunteers: 60, projects: 3 },
    { id: 'picota', name: 'Picota', x: 70, y: 55, volunteers: 85, projects: 6 },
    { id: 'bellavista', name: 'Bellavista', x: 75, y: 65, volunteers: 110, projects: 9 },
    { id: 'huallaga', name: 'Huallaga', x: 55, y: 70, volunteers: 75, projects: 4 },
    { id: 'mariscal-caceres', name: 'Mariscal Cáceres', x: 45, y: 80, volunteers: 130, projects: 11 },
    { id: 'tocache', name: 'Tocache', x: 60, y: 95, volunteers: 190, projects: 15 },
  ]
}

export const cta = {
  kicker: 'Suma tu señal',
  title: 'El futuro de San Martín se construye en red.',
  text: 'Si eres joven, institución o comunidad: hay un lugar para ti en la red.',
  primaryCta: { label: 'Únete hoy', href: '/#contacto' },
}

export const contact = {
  index: '05',
  kicker: 'Contacto',
  title: '¿Quieres ser parte de la red?',
  sub: 'Escríbenos para unirte, ser voluntario o ser aliado. Respondemos en menos de 48 horas.',
  interests: ['Ser voluntario/a', 'Unirme a la red', 'Ser aliado/a', 'Quiero capacitar a mi grupo', 'Otro'],
  info: [
    { icon: 'mail', label: 'Correo', value: site.email },
    { icon: 'phone', label: 'WhatsApp', value: site.phone },
    { icon: 'pin', label: 'Ubicación', value: site.address },
  ],
}

/**
 * Sponsors / Aliados — carrusel de logos infinito.
 * Los items se duplican en el componente para lograr el bucle continuo.
 * logo: ruta relativa desde /public (Vite la sirve estática).
 * Si logo es null, el componente renderiza el nombre como fallback.
 */
export const sponsors = {
  kicker: '// 06 — ALIADOS',
  title: 'Organizaciones que hacen posible la red',
  sub: 'Instituciones, ministerios y aliados estratégicos que creen en el liderazgo joven de San Martín.',
  items: [
    {
      name: 'Fortalece Pe',
      url: 'https://fortalece.pe/',
      logo: "/logos/fortalecepe.jpg",
    },
    {
      name: 'SENAJU',
      url: 'https://juventud.gob.pe/',
      logo: '/logos/SENAJU-Y-DIRECCION-GENERAL.png',
    },
    {
      name: 'Ministerio de Transportes y Comunicaciones',
      url: 'https://www.gob.pe/mtc',
      logo: '/logos/mtc.jpg',
    },
    {
      name: 'Camara de Comercio San Martin',
      url: 'https://camaratarapoto.org/',
      logo: '/logos/q.jpg',
    },
    {
      name: 'Universidad Nacional de San Martin',
      url: 'https://unsm.edu.pe/',
      logo: '/logos/unsmlogo.jpg',
    },
    {
      name: 'CIP',
      url: 'https://www.cip.org.pe/',
      logo: '/logos/CIP.jpg',
    },
    {
      name: 'CNL Asesores',
      url: 'https://cnlasesores.com.pe/',
      logo: '/logos/cnl_asesores.jpg',
    },
    {
      name: 'Bioinnova',
      url: 'https://bioinnova.unsm.edu.pe/',
      logo: '/logos/bionnova.jpg',
    },
    {
      name: 'Mpsm',
      url: 'https://www.gob.pe/munisanmartin',
      logo: '/logos/mpsm.png',
    },
    {
      name: 'Prodemu',
      url: 'https://www.prodemu.cl/',
      logo: '/logos/prodemu.png',
    },
    {
      name: 'Paletas Amazonicas Villaizan',
      url: 'https://www.prodemu.cl/',
      logo: '/logos/villaizan.jpg',
    },
    {
      name: 'Dinogas',
      url: 'https://dinogasperu.com/',
      logo: '/logos/Dinogas.jpg',
    }
  ],
}