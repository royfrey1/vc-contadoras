/**
 * Datos editables del sitio. Todos los componentes leen de acá:
 * para cambiar un teléfono, mail o red social, editá solo este archivo.
 */

import {
  BadgeCheck,
  BellRing,
  BookOpenCheck,
  BriefcaseBusiness,
  CalendarCheck,
  Compass,
  FileCheck,
  FileText,
  FolderCheck,
  HeartHandshake,
  Landmark,
  Lightbulb,
  MapPin,
  MessageSquareText,
  MessagesSquare,
  ReceiptText,
  RefreshCw,
  ScanSearch,
  Sprout,
  Store,
  UsersRound,
  Video,
  Wallet,
} from 'lucide-react'

import { heroImagen } from './heroImagen.js'

// Número de WhatsApp en formato internacional, solo dígitos (54 + 9 + característica + número).
// PLACEHOLDER: reemplazar por el número real.
const WHATSAPP_NUMBER = '5493410000000'
const WHATSAPP_MESSAGE = 'Hola, quisiera hacer una consulta con VC Contadoras.'

/** Arma un link de WhatsApp con un mensaje precargado. */
export const waLink = (message = WHATSAPP_MESSAGE) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`

export const site = {
  nombre: 'VC Contadoras',
  subtitulo: 'Vanesa & Carina',
  eslogan: 'Te ayudamos a ordenar tu situación fiscal',

  ciudad: 'Rosario, Santa Fe',
  atencionOnline: true,

  whatsapp: '+54 341 XXX-XXXX', // placeholder (texto visible)
  whatsappLink: waLink(),

  email: 'contacto@vccontadoras.com.ar', // placeholder
  direccion: 'Rosario, Santa Fe', // placeholder
  horarios: 'Lunes a viernes de 9 a 17 h', // placeholder

  redes: {
    instagram: '#', // placeholder
    facebook: '#', // placeholder
  },

  logos: {
    oscuro: '/logo/vc-contadoras-logo.svg', // para fondos claros
    claro: '/logo/vc-contadoras-logo-claro.svg', // para fondos oscuros
  },

  // Links del menú principal (id = id de la sección en la página)
  navegacion: [
    { id: 'servicios', label: 'Servicios' },
    { id: 'proceso', label: 'Proceso' },
    { id: 'quienes-somos', label: 'Quiénes somos' },
    { id: 'vencimientos', label: 'Vencimientos' },
    { id: 'faq', label: 'FAQ' },
    { id: 'contacto', label: 'Contacto' },
  ],

  // ── Hero ────────────────────────────────────────────────────────────────
  hero: {
    eyebrow: 'Estudio contable · Rosario · Atención online',
    // El título se arma como: antes + destacado (en itálica, subrayado) + despues
    titulo: {
      antes: 'Te ayudamos a',
      destacado: 'ordenar',
      despues: 'tu situación fiscal',
    },
    bajada:
      'Acompañamos a monotributistas, PyMEs, emprendedores y profesionales con asesoramiento contable e impositivo claro, cercano y a tiempo.',
    ctaPrincipal: 'Consultanos por WhatsApp',
    ctaSecundario: { label: 'Ver servicios', href: '#servicios' },

    // Foto: se edita en src/data/heroImagen.js (también la usa el preload de index.html)
    imagen: heroImagen,

    // Datos de ejemplo: editar con los valores reales
    indicadores: [
      { valor: 10, prefijo: '+', sufijo: '', etiqueta: 'años de experiencia' },
      { valor: 150, prefijo: '+', sufijo: '', etiqueta: 'clientes acompañados' },
      { valor: 100, prefijo: '', sufijo: '%', etiqueta: 'atención personalizada' },
    ],

    tarjetas: {
      monotributo: { titulo: 'Monotributo al día', texto: 'Recategorización sin sorpresas' },
      // La fecha se calcula sola (próximo vencimiento del Monotributo, ver src/lib/vencimientos.js)
      vencimiento: { titulo: 'Próximo vencimiento', detalle: 'Cuota de monotributo' },
    },
  },

  // ── Servicios ───────────────────────────────────────────────────────────
  // `consulta` es el nombre que se usa en el mensaje de WhatsApp: "Hola, quiero consultar por …"
  servicios: [
    {
      id: 'monotributo',
      numero: '01',
      icono: ReceiptText,
      titulo: 'Monotributo',
      consulta: 'Monotributo',
      descripcion: 'Te inscribimos, te mantenemos en la categoría correcta y te ayudamos a facturar sin errores.',
      detalles: [
        'Alta, categorización y recategorizaciones semestrales',
        'Pago mensual y control de topes de facturación',
        'Facturación electrónica',
        'Baja o pase a Responsable Inscripto',
      ],
    },
    {
      id: 'responsables-inscriptos',
      numero: '02',
      icono: Landmark,
      titulo: 'Impuestos para Responsables Inscriptos',
      consulta: 'impuestos como Responsable Inscripto',
      descripcion: 'Liquidamos tus impuestos nacionales, provinciales y municipales en tiempo y forma.',
      detalles: [
        'Declaraciones juradas de IVA y Ganancias',
        'Bienes Personales',
        'Ingresos Brutos (API Santa Fe y Convenio Multilateral)',
        'DReI ante la Municipalidad de Rosario',
      ],
    },
    {
      id: 'contabilidad',
      numero: '03',
      icono: BookOpenCheck,
      titulo: 'Contabilidad para PyMEs',
      consulta: 'contabilidad para mi PyME',
      descripcion: 'Llevamos la contabilidad de tu empresa y la convertimos en información útil para decidir.',
      detalles: [
        'Registraciones contables',
        'Balances y estados contables anuales',
        'Informes de gestión para tomar decisiones',
        'Certificaciones contables',
      ],
    },
    {
      id: 'sueldos',
      numero: '04',
      icono: UsersRound,
      titulo: 'Sueldos y cargas sociales',
      consulta: 'liquidación de sueldos',
      descripcion: 'Nos ocupamos de los sueldos y las cargas sociales para que tu equipo cobre bien y a tiempo.',
      detalles: [
        'Liquidación de sueldos y recibos',
        'Formulario 931 y cargas sociales',
        'Altas y bajas de empleados en ARCA',
        'Asesoramiento laboral básico',
      ],
    },
    {
      id: 'emprendedores',
      numero: '05',
      icono: Sprout,
      titulo: 'Emprendedores y sociedades',
      consulta: 'inscripción de un emprendimiento o sociedad',
      descripcion: 'Te acompañamos desde el primer paso para que tu proyecto arranque en regla.',
      detalles: [
        'Inscripción en ARCA, API y Municipalidad',
        'Constitución de SAS y SRL',
        'Elección del régimen más conveniente',
        'Puesta en marcha ordenada',
      ],
    },
    {
      id: 'asesoramiento',
      numero: '06',
      icono: Compass,
      titulo: 'Asesoramiento y planificación fiscal',
      consulta: 'asesoramiento fiscal',
      descripcion: 'Analizamos tu caso para que pagues lo que corresponde y evites sorpresas.',
      detalles: [
        'Consultas puntuales',
        'Planificación impositiva',
        'Regularización de deudas y planes de pago',
        'Respuesta a intimaciones de ARCA y API',
      ],
    },
  ],

  serviciosCierre: {
    titulo: '¿No sabés por dónde empezar?',
    texto: 'Contanos tu situación y te orientamos en una primera consulta.',
    boton: 'Hablemos por WhatsApp',
    mensaje: 'Hola, no sé bien por dónde empezar y quisiera contarles mi situación.',
  },

  // ── A quién ayudamos (selector de perfiles) ─────────────────────────────
  // Imágenes de Unsplash en 16:9; el componente genera versiones más chicas cambiando w/h.
  perfiles: [
    {
      id: 'monotributistas',
      nombre: 'Monotributistas',
      icono: Wallet,
      frase: 'Pago la cuota todos los meses, pero no sé si estoy en la categoría correcta.',
      descripcion:
        'Revisamos tu facturación y tu categoría para que pagues lo que corresponde y no tengas sorpresas con ARCA. Vos te ocupás de trabajar; nosotras, de seguir los números.',
      puntos: [
        'Control de tu categoría y de los topes de facturación',
        'Recategorización a tiempo, en febrero y agosto',
        'Recordatorio de cada vencimiento',
        'Aviso cuando te conviene (o te corresponde) pasar a Responsable Inscripto',
      ],
      imagen: {
        url: 'https://images.unsplash.com/photo-1593476550610-87baa860004a?w=1200&h=675&q=80&auto=format&fit=crop',
        alt: 'Manos escribiendo en una laptop sobre un escritorio luminoso, con una planta junto a la ventana',
      },
      whatsapp: waLink('Hola, soy monotributista y quiero asesoramiento.'),
    },
    {
      id: 'emprendedores',
      nombre: 'Emprendedores',
      icono: Lightbulb,
      frase: 'Quiero arrancar con mi proyecto, pero no sé por dónde empezar con los papeles.',
      descripcion:
        'Te acompañamos desde la idea hasta la primera factura: analizamos con vos cómo inscribirte, qué régimen te conviene y qué obligaciones vas a tener, para que arranques en regla.',
      puntos: [
        'Inscripción en ARCA, API y Municipalidad',
        'Elección del régimen más conveniente para tu caso',
        'Facturación correcta desde el primer día',
        'Un plan para crecer ordenado',
      ],
      imagen: {
        url: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=1200&h=675&q=80&auto=format&fit=crop',
        alt: 'Manos dibujando con lapicera el boceto de un proyecto sobre una hoja, en una mesa de madera',
      },
      whatsapp: waLink('Hola, estoy por arrancar un emprendimiento y quiero asesoramiento.'),
    },
    {
      id: 'profesionales',
      nombre: 'Profesionales independientes',
      icono: BriefcaseBusiness,
      frase: 'Facturo por mi cuenta y siento que siempre estoy corriendo atrás de los impuestos.',
      descripcion:
        'Profesionales de la salud, abogados, arquitectos, diseñadores, programadores: si facturás tus honorarios por tu cuenta, ordenamos tus impuestos para que dejes de correr atrás de los vencimientos.',
      puntos: [
        'Facturación, incluida la exportación de servicios al exterior',
        'Ganancias y Bienes Personales',
        'Las deducciones que te corresponden',
        'Agenda de vencimientos sin sorpresas',
      ],
      imagen: {
        url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&h=675&q=80&auto=format&fit=crop',
        alt: 'Manos trabajando en una laptop sobre un escritorio de madera, con un estetoscopio al lado',
      },
      whatsapp: waLink('Hola, soy profesional independiente y quiero asesoramiento.'),
    },
    {
      id: 'pymes',
      nombre: 'PyMEs y comercios',
      icono: Store,
      frase: 'Necesito que alguien lleve los números del negocio en serio, todos los meses.',
      descripcion:
        'Llevamos la contabilidad, los sueldos y los impuestos de tu negocio mes a mes, y te acercamos información clara para que tomes decisiones con datos.',
      puntos: [
        'Contabilidad y balances',
        'Sueldos y cargas sociales',
        'IVA, Ingresos Brutos y DReI al día',
        'Informes claros para tomar decisiones',
      ],
      imagen: {
        url: 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=1200&h=675&q=80&auto=format&fit=crop',
        alt: 'Mostrador de un café de barrio con estantes de madera ordenados y lámparas colgantes',
      },
      whatsapp: waLink('Hola, tengo una PyME o comercio y quiero asesoramiento.'),
    },
  ],

  perfilesCierre: {
    pregunta: '¿No te ves en ninguno?',
    link: 'Escribinos y lo vemos juntas.',
    mensaje: 'Hola, quiero contarles mi situación para ver cómo me pueden ayudar.',
  },

  // ── Cómo trabajamos (línea de tiempo) ───────────────────────────────────
  proceso: [
    {
      numero: '01',
      icono: MessagesSquare,
      titulo: 'Primera charla',
      descripcion:
        'Nos contás a qué te dedicás, cómo está tu situación hoy y qué te preocupa. Puede ser en persona, en Rosario, o por videollamada.',
      etiqueta: 'Te escuchamos',
    },
    {
      numero: '02',
      icono: ScanSearch,
      titulo: 'Diagnóstico',
      descripcion:
        'Revisamos tu situación en ARCA, API y la Municipalidad para detectar qué está bien, qué falta y qué conviene corregir.',
      etiqueta: 'Sabés en qué punto estás',
    },
    {
      numero: '03',
      icono: FileText,
      titulo: 'Propuesta a medida',
      descripcion:
        'Te explicamos qué hay que hacer, en qué orden y cuáles son nuestros honorarios. Todo claro desde el principio, sin letra chica.',
      etiqueta: 'Sin sorpresas',
    },
    {
      numero: '04',
      icono: CalendarCheck,
      titulo: 'Acompañamiento mensual',
      descripcion:
        'Nos ocupamos de los vencimientos, las presentaciones y tus consultas del día a día, y te avisamos antes de cada fecha importante.',
      etiqueta: 'Tus números, siempre al día',
    },
  ],

  procesoAtencion: {
    titulo: 'Atención presencial u online',
    items: [
      { icono: MapPin, texto: 'Reuniones presenciales en Rosario' },
      { icono: Video, texto: 'Videollamadas desde cualquier lugar del país' },
      { icono: FileCheck, texto: 'Documentación 100% digital y respuestas por WhatsApp' },
    ],
    boton: 'Agendá tu primera charla',
    mensaje: 'Hola, quiero agendar una primera charla con el estudio.',
  },

  // ── Por qué elegirnos (grilla bento) ────────────────────────────────────
  diferencialesDestacado: {
    eyebrow: 'Presencial y online',
    frase: 'Cerca tuyo, en Rosario y a la distancia.',
    texto:
      'Te recibimos en el estudio, en Rosario, o te atendemos por videollamada y WhatsApp, estés donde estés.',
    boton: { label: 'Conocenos', href: '#quienes-somos' },
  },

  // `ancho: true` → la tarjeta ocupa 2 columnas en desktop (cierra la grilla sin huecos)
  diferenciales: [
    {
      icono: HeartHandshake,
      titulo: 'Trato directo',
      texto: 'Hablás siempre con Vanesa o con Carina, no con un sistema ni con un call center.',
    },
    {
      icono: MessageSquareText,
      titulo: 'Sin tecnicismos',
      texto: 'Te explicamos cada paso con palabras simples, para que sepas qué firmás y qué pagás.',
    },
    {
      icono: RefreshCw,
      titulo: 'Siempre actualizadas',
      texto: 'Seguimos los cambios de ARCA, API y la Municipalidad para que no tengas que hacerlo vos.',
    },
    {
      icono: BellRing,
      titulo: 'Te avisamos antes',
      texto: 'Recibís recordatorios de cada vencimiento, para que nada te tome por sorpresa.',
    },
    {
      icono: FolderCheck,
      titulo: 'Todo ordenado y digital',
      texto: 'Tu documentación, guardada y accesible cuando la necesites.',
      ancho: true,
    },
    {
      icono: BadgeCheck,
      titulo: 'Profesionales matriculadas',
      // DATO A CONFIRMAR con el estudio: matrícula y nombre exacto del Consejo
      // (el nombre oficial es "Consejo Profesional de Ciencias Económicas de la Provincia de Santa Fe").
      texto:
        'Contadoras públicas matriculadas en el Consejo Profesional de Ciencias Económicas de Santa Fe.',
      ancho: true,
    },
  ],

  palabrasClave: [
    'Monotributo',
    'IVA',
    'Ganancias',
    'Ingresos Brutos',
    'DReI',
    'Sueldos',
    'Balances',
    'Bienes Personales',
    'Sociedades',
    'Planificación',
  ],

  // ── Quiénes somos ───────────────────────────────────────────────────────
  equipoIntro:
    'VC Contadoras nace de la unión de Vanesa y Carina, dos profesionales de Rosario con un mismo modo de trabajar: cercanía, orden y respuestas claras. Combinamos experiencia en impuestos, contabilidad y sueldos para acompañarte en todo lo que tu actividad necesita.',

  // DEMO: reemplazar con datos reales (apellidos, formación, años, matrículas, fotos y LinkedIn)
  equipo: [
    {
      id: 'vanesa',
      nombre: 'Vanesa',
      apellido: 'Apellido', // DEMO: reemplazar con datos reales
      cargo: 'Contadora Pública · Socia',
      frase: 'Me gusta que cada cliente entienda lo que paga y por qué.',
      bio: 'Se especializa en impuestos y acompaña a monotributistas y profesionales independientes para que paguen lo que corresponde, sin sorpresas. Se toma el tiempo de explicar cada paso para que sus clientes decidan con información clara.',
      especialidades: ['Monotributo', 'Impuestos', 'Planificación fiscal'],
      // DEMO: reemplazar con datos reales
      formacion: [
        { titulo: 'Contadora Pública', institucion: 'Universidad Nacional de Rosario (UNR)', anio: '20XX' },
        { titulo: 'Posgrado en Tributación', institucion: 'Institución a confirmar', anio: '20XX' },
        { titulo: 'Actualización permanente', institucion: 'Normativa de ARCA y API', anio: 'En curso' },
      ],
      matricula: 'Matrícula CPCE Santa Fe N.º XXXXX', // DEMO: reemplazar con datos reales
      foto: {
        // DEMO: foto ilustrativa de Unsplash, reemplazar por el retrato real
        url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=900&h=1125&q=80&auto=format&fit=crop',
        alt: 'Retrato de Vanesa, contadora pública (foto ilustrativa)',
      },
      linkedin: '#', // DEMO: reemplazar con datos reales
    },
    {
      id: 'carina',
      nombre: 'Carina',
      apellido: 'Apellido', // DEMO: reemplazar con datos reales
      cargo: 'Contadora Pública · Socia',
      frase: 'Los números ordenados le dan tranquilidad a cualquier negocio.',
      bio: 'Se ocupa de la contabilidad de PyMEs y comercios, de la liquidación de sueldos y de la puesta en marcha de nuevos emprendimientos. Cree en los procesos ordenados y en los informes simples, que sirvan para tomar decisiones.',
      especialidades: ['Contabilidad PyME', 'Sueldos', 'Sociedades'],
      // DEMO: reemplazar con datos reales
      formacion: [
        { titulo: 'Contadora Pública', institucion: 'Universidad Nacional de Rosario (UNR)', anio: '20XX' },
        { titulo: 'Especialización en Gestión de PyMEs', institucion: 'Institución a confirmar', anio: '20XX' },
        {
          titulo: 'Actualización en liquidación de sueldos y cargas sociales',
          institucion: 'Formación continua',
          anio: 'En curso',
        },
      ],
      matricula: 'Matrícula CPCE Santa Fe N.º XXXXX', // DEMO: reemplazar con datos reales
      foto: {
        // DEMO: foto ilustrativa de Unsplash, reemplazar por el retrato real
        url: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=900&h=1125&q=80&auto=format&fit=crop',
        alt: 'Retrato de Carina, contadora pública (foto ilustrativa)',
      },
      linkedin: '#', // DEMO: reemplazar con datos reales
    },
  ],

  equipoCierre: {
    frase: 'Tu tranquilidad fiscal empieza con una conversación.',
    boton: 'Escribinos por WhatsApp',
    mensaje: 'Hola, Vanesa y Carina. Quiero hacerles una consulta.',
  },

  // ── Preguntas frecuentes ────────────────────────────────────────────────
  // El `id` se usa para los deep links: #faq-{id} (ej. #faq-recategorizacion)
  faqCategorias: ['Empezar', 'Monotributo e impuestos', 'Honorarios y modalidad'],
  faq: [
    {
      id: 'atencion',
      categoria: 'Empezar',
      pregunta: '¿Atienden solo en Rosario?',
      respuesta:
        'No. Atendemos de forma presencial en nuestro estudio en Rosario y online a clientes de todo el país, por videollamada, WhatsApp y mail.',
    },
    {
      id: 'primera-charla',
      categoria: 'Empezar',
      pregunta: '¿Qué necesito para la primera charla?',
      respuesta:
        'Con tu CUIT y una idea general de tu actividad alcanza. No hace falta que compartas tu clave fiscal: si avanzamos, te explicamos cómo delegarnos el acceso a los servicios de ARCA de forma segura, sin que tengas que pasarnos tu contraseña.',
    },
    {
      id: 'cambiar-contador',
      categoria: 'Empezar',
      pregunta: 'Ya tengo contador, ¿puedo cambiarme?',
      respuesta:
        'Sí. Coordinamos el traspaso de tu información y revisamos tu situación actual para que el cambio sea ordenado y no se pierda ningún vencimiento.',
    },
    {
      id: 'empezar',
      categoria: 'Empezar',
      pregunta: 'Recién empiezo, ¿por dónde arranco?',
      respuesta:
        'Primero vemos tu actividad y tus ingresos estimados para elegir el régimen que te conviene. Después hacemos las inscripciones que correspondan en ARCA, API y la Municipalidad, y te dejamos listo para facturar.',
    },
    {
      id: 'monotributo-o-responsable-inscripto',
      categoria: 'Monotributo e impuestos',
      pregunta: '¿Me conviene ser monotributista o Responsable Inscripto?',
      respuesta:
        'Depende de tu facturación, tu actividad, tus clientes y tus gastos. Lo analizamos con números concretos de tu caso antes de decidir.',
    },
    {
      id: 'recategorizacion',
      categoria: 'Monotributo e impuestos',
      pregunta: '¿Cuándo tengo que recategorizarme?',
      respuesta:
        'La recategorización del monotributo es semestral: se hace hasta el 5 de febrero y hasta el 5 de agosto, según lo que facturaste en los últimos 12 meses y otros parámetros de tu actividad. Si sos cliente, te avisamos y la hacemos con vos.',
    },
    {
      id: 'superar-topes',
      categoria: 'Monotributo e impuestos',
      pregunta: '¿Qué pasa si supero los topes del monotributo?',
      respuesta:
        'Si superás el tope de tu categoría, tenés que pasar a una más alta. Si superás el máximo del régimen, quedás excluido del monotributo y pasás a Responsable Inscripto. Por eso controlamos tu facturación todos los meses, para anticiparnos.',
    },
    {
      id: 'deudas',
      categoria: 'Monotributo e impuestos',
      pregunta: 'Tengo deudas con ARCA o API, ¿qué hago?',
      respuesta:
        'Revisamos tu situación y evaluamos las alternativas vigentes, como los planes de pago, para regularizarte de la forma más conveniente para tu caso.',
    },
    {
      id: 'honorarios',
      categoria: 'Honorarios y modalidad',
      pregunta: '¿Cuánto cuestan sus servicios?',
      // DEMO: confirmar con el estudio
      respuesta:
        'Depende de tu actividad y de lo que necesites. Después de la primera charla y el diagnóstico, te pasamos una propuesta con honorarios claros y sin costos ocultos.',
    },
    {
      id: 'abono-mensual',
      categoria: 'Honorarios y modalidad',
      pregunta: '¿Trabajan con un abono mensual?',
      // DEMO: confirmar con el estudio
      respuesta:
        'Sí. Para el acompañamiento mensual trabajamos con un abono según tu situación. También hacemos trámites y consultas puntuales.',
    },
    {
      id: 'documentacion',
      categoria: 'Honorarios y modalidad',
      pregunta: '¿Cómo les envío la documentación?',
      respuesta:
        'De forma digital: por WhatsApp, por mail o en una carpeta compartida. Te ayudamos a ordenarla para que todos los meses sea simple.',
    },
  ],

  faqContacto: {
    titulo: '¿Tenés otra pregunta?',
    texto: 'Contanos tu caso y te respondemos personalmente, sin compromiso.',
    boton: 'Preguntanos por WhatsApp',
    mensaje: 'Hola, tengo una consulta:',
  },

  // ── Testimonios ─────────────────────────────────────────────────────────
  testimoniosConfig: {
    mostrarAvisoDemo: true, // poner en false cuando haya testimonios reales
    aviso: 'Testimonios ilustrativos para esta demo.',
    intervalo: 7000, // ms entre testimonios (autoplay)
  },

  // DEMO: reemplazar por testimonios reales (con autorización de cada cliente)
  testimonios: [
    {
      id: 'lucia',
      nombre: 'Lucía M.',
      iniciales: 'LM',
      actividad: 'Diseñadora gráfica, monotributista',
      ubicacion: 'Rosario',
      perfil: 'Monotributista',
      texto:
        'Llevaba el monotributo sola y vivía con miedo de pasarme de categoría sin darme cuenta. Ahora me avisan todo a tiempo y, cuando tengo una duda, les escribo y me la responden sin vueltas.',
    },
    {
      id: 'martin',
      nombre: 'Martín G.',
      iniciales: 'MG',
      actividad: 'Emprendedor gastronómico',
      ubicacion: 'Funes',
      perfil: 'Emprendedor',
      texto:
        'Tenía la idea de mi emprendimiento de comida, pero no sabía por dónde empezar con los papeles. Me ayudaron con las inscripciones y arranqué a facturar en regla desde el primer día.',
    },
    {
      id: 'paula',
      nombre: 'Dra. Paula R.',
      iniciales: 'PR',
      actividad: 'Odontóloga',
      ubicacion: 'Rosario',
      perfil: 'Profesional',
      texto:
        'Como profesional independiente sentía que siempre corría atrás de los impuestos. Ordenaron todo y me explican cada cosa sin tecnicismos, así sé qué pago y por qué.',
    },
    {
      id: 'javier',
      nombre: 'Javier S.',
      iniciales: 'JS',
      actividad: 'Ferretería, PyME familiar',
      ubicacion: 'Rosario',
      perfil: 'PyME',
      texto:
        'Llevan la contabilidad de la ferretería y los sueldos de nuestros empleados. Lo que más valoro es el trato directo: hablo con ellas, no con un sistema, y los informes que nos pasan se entienden.',
    },
    {
      id: 'nicolas',
      nombre: 'Nicolás A.',
      iniciales: 'NA',
      actividad: 'Desarrollador de software',
      ubicacion: 'Córdoba · atención online',
      perfil: 'Profesional',
      texto:
        'Trabajo para clientes del exterior y no tenía claro cómo facturar la exportación de servicios. Me asesoraron por videollamada y WhatsApp, sin tener que viajar a Rosario.',
    },
    {
      id: 'carolina',
      nombre: 'Carolina B.',
      iniciales: 'CB',
      actividad: 'Tienda de ropa',
      ubicacion: 'Rosario',
      perfil: 'Comercio',
      texto:
        'Me cambié de contador con miedo de que se perdiera algo en el camino. El traspaso fue muy ordenado y no se me pasó ningún vencimiento.',
    },
  ],

  firma: {
    texto: 'Selva Code',
    url: 'https://selva-code.vercel.app',
  },
}
