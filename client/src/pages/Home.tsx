import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUpRight,
  BarChart3,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  FileText,
  FileSearch,
  Keyboard,
  Lightbulb,
  MapPin,
  MapPinned,
  Mic2,
  Network,
  PauseCircle,
  Play,
  Presentation as PresentationIcon,
  Radio,
  Route,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Video,
  X,
} from "lucide-react";
import { toast } from "sonner";

const LOGO_URL = "/logo_telemedellin_oficial_84dfd126.png";
const PARK_URL = "/20210614-Telemedellin-1.jpg";

/** Cuando el video esté listo, reemplace el valor vacío por el ID de YouTube. */
const YOUTUBE_VIDEO_ID = "L6DBHjF9s0o";

const sections = [
  { id: "contexto", short: "Contexto", label: "Territorio e historia", presenter: "Julián Esteban Gutierrez Martinez", initials: "JG" },
  { id: "estructura", short: "Estructura", label: "Cómo se organiza", presenter: "Sergio Esteban Pisco Bolaños", initials: "SP" },
  { id: "diagnostico", short: "Diagnóstico", label: "MIPG en cifras", presenter: "Yeisy Yurany Macías Espinosa", initials: "YM" },
  { id: "hallazgos", short: "Hallazgos", label: "Fortalezas y brechas", presenter: "Elda María Usuga Carvajal", initials: "EU" },
  { id: "ruta", short: "Ruta", label: "Acción y video", presenter: "Lui Guillermo Garcés Alvis", initials: "LG" },
];

/** Secciones fuera de la página y del modo presentación; su código se conserva. */
const HIDDEN_SECTION_IDS = new Set(["estructura", "hallazgos", "ruta"]);
const visibleSections = sections.filter((section) => !HIDDEN_SECTION_IDS.has(section.id));

const areas = [
  { name: "Contenidos y Distribución", layer: "Misional", x: "50%", y: "9%" },
  { name: "Producción", layer: "Misional", x: "88%", y: "50%" },
  { name: "Agencia TM", layer: "Misional", x: "50%", y: "91%" },
  { name: "Tecnología e Innovación", layer: "Misional", x: "12%", y: "50%" },
  { name: "Relaciones Corporativas", layer: "Articulación", x: "50%", y: "25%" },
  { name: "Planeación", layer: "Articulación", x: "75%", y: "50%" },
  { name: "Secretaría General", layer: "Articulación", x: "50%", y: "75%" },
  { name: "Administrativa y Financiera", layer: "Articulación", x: "25%", y: "50%" },
  { name: "Gestión Humana", layer: "Aseguramiento", x: "50%", y: "37%" },
  { name: "Control Interno", layer: "Aseguramiento", x: "50%", y: "63%" },
];

const areaNotes: Record<string, string> = {
  "Contenidos y Distribución": "Diseña y distribuye contenidos con valor público.",
  Producción: "Convierte la estrategia editorial en experiencias audiovisuales.",
  "Agencia TM": "Articula servicios, proyectos y soluciones de comunicación.",
  "Tecnología e Innovación": "Sostiene la operación tecnológica y la evolución digital.",
  "Relaciones Corporativas": "Conecta al canal con ciudadanía, aliados y grupos de interés.",
  Planeación: "Orienta metas, indicadores y seguimiento institucional.",
  "Secretaría General": "Acompaña la gestión jurídica y administrativa transversal.",
  "Administrativa y Financiera": "Gestiona los recursos que hacen viable la operación.",
  "Gestión Humana": "Desarrolla capacidades y acompaña el ciclo de vida del talento.",
  "Control Interno": "Evalúa controles y promueve la mejora continua.",
};

const componentScores = [
  { name: "Planeación", value: 41.9, note: "18 de 24 ítems evidenciados" },
  { name: "Ingreso", value: 51.7, note: "3 de 15 ítems evidenciados" },
  { name: "Desarrollo", value: 26.3, note: "43 de 78 ítems evidenciados" },
  { name: "Retiro", value: null, note: "0 de 6 ítems evidenciados" },
];

const actions = [
  {
    step: "01",
    title: "Cerrar la brecha de evidencia",
    text: "Completar los 59 ítems pendientes con SIGEP, nómina, historias laborales y documentos del portal de transparencia.",
    icon: FileSearch,
  },
  {
    step: "02",
    title: "Integrar el ciclo completo",
    text: "Incorporar evaluación del desempeño, inducción y reinducción, monitoreo en SIGEP y gestión del retiro.",
    icon: Route,
  },
  {
    step: "03",
    title: "Convertir planes en gestión",
    text: "Desarrollar Capacitación y Bienestar con diagnóstico, cronograma, responsables, presupuesto e indicadores.",
    icon: Target,
  },
  {
    step: "04",
    title: "Activar una ruta medible",
    text: "Priorizar acciones en las hojas “Rutas de creación de valor” y “Plan de acción”, con seguimiento periódico.",
    icon: BarChart3,
  },
];

const directors = [
  ["Gerencia", "Vanessa Palacio Olayo"],
  ["Secretaría General", "Jorge Gil Marín"],
  ["Planeación", "Juan Diego Hernández"],
  ["Administrativa y Financiera", "Juan Carlos Vargas Gómez"],
  ["Contenidos y Distribución", "María Adelaida Puyo Mejía"],
  ["Producción", "Jaime Saldarriaga"],
  ["Relaciones Corporativas", "Paulina Mora Velásquez"],
  ["Tecnología e Innovación", "Carlos Duque López"],
  ["Agencia TM", "Clara Medina Sánchez"],
  ["Gestión Humana", "Juan Felipe Estrada Restrepo"],
  ["Control Interno", "Iván Darío Valencia Marín"],
];

const decreePlans = [
  ["Plan Anual de Vacantes", "Sí", "Incluido; declara 0 vacantes."],
  ["Plan de Previsión de Recursos Humanos", "Parcial", "Sin metodología de proyección de necesidades futuras."],
  ["Plan Estratégico de Talento Humano", "Sí", "Cumple el requisito formal de existencia y publicación."],
  ["Plan Institucional de Capacitación", "Parcial", "Faltan desarrollo por ejes, cronograma y presupuesto."],
  ["Plan de Incentivos / Bienestar", "Parcial", "Presenta cuatro ejes generales, sin actividades ni indicadores concretos."],
  ["Plan Anual de Seguridad y Salud en el Trabajo", "Parcial", "Incluye el componente, pero sin estándares mínimos desarrollados."],
];

const evidenceSources = [
  "Manual de Funciones y Competencias Laborales",
  "Plan de Formación y Capacitación",
  "Plan de Bienestar Social e Incentivos",
  "Plan de Previsión de Recursos Humanos",
  "Plan Anual de Vacantes",
  "Directorio de servidores públicos y contratistas",
  "Programa de Transparencia y Ética Pública",
];

function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, delay, ease: [0.23, 1, 0.32, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Eyebrow({ number, speaker, children }: { number: string; speaker: string; children: ReactNode }) {
  return (
    <div className="eyebrow">
      <span className="eyebrow-number">{number}</span>
      <span>{speaker}</span>
      <span className="eyebrow-rule" />
      <span className="eyebrow-topic">{children}</span>
    </div>
  );
}

function PresenterCard({
  presenter,
  index,
  number = index + 1,
  presentation = false,
  dark = false,
}: {
  presenter: (typeof sections)[number];
  index: number;
  number?: number;
  presentation?: boolean;
  dark?: boolean;
}) {
  return (
    <div className={`presenter-card presenter-card-${index + 1} ${presentation ? "is-presentation" : ""} ${dark ? "is-dark" : ""}`}>
      <div className="presenter-monogram" aria-hidden="true">
        <span>{presenter.initials}</span>
        <i>0{number}</i>
      </div>
      <div className="presenter-identity">
        <small>Presenta esta sección</small>
        <strong>{presenter.presenter}</strong>
        <span>{presenter.label}</span>
      </div>
      <div className="presenter-signal" aria-hidden="true"><span /><span /><span /><span /><span /></div>
      <div className="presenter-mic" aria-hidden="true"><Mic2 size={18} /></div>
    </div>
  );
}

function SectionHeader({ kicker, title, intro }: { kicker: string; title: string; intro: string }) {
  return (
    <div className="section-heading">
      <span className="section-kicker">{kicker}</span>
      <h2>{title}</h2>
      <p>{intro}</p>
    </div>
  );
}

function Stat({ value, label, tone = "orange" }: { value: string; label: string; tone?: "orange" | "green" | "charcoal" }) {
  return (
    <div className={`stat stat-${tone}`}>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function DocumentDropdown({
  title,
  subtitle,
  children,
  dark = false,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  dark?: boolean;
}) {
  return (
    <details className={`document-dropdown ${dark ? "is-dark" : ""}`}>
      <summary>
        <span className="dropdown-icon"><FileText size={19} /></span>
        <span><strong>{title}</strong><small>{subtitle}</small></span>
        <ChevronDown className="dropdown-chevron" size={20} />
      </summary>
      <div className="dropdown-content">{children}</div>
    </details>
  );
}

function DonutChart() {
  const circumference = 2 * Math.PI * 84;
  const offset = circumference * (1 - 0.52);
  return (
    <div className="donut-wrap" aria-label="52 por ciento de los ítems con evidencia y 48 por ciento pendientes">
      <svg viewBox="0 0 220 220" role="img">
        <title>Estado de la evidencia en la Matriz GETH</title>
        <circle className="donut-track" cx="110" cy="110" r="84" />
        <motion.circle
          className="donut-value"
          cx="110"
          cy="110"
          r="84"
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset: offset }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: [0.23, 1, 0.32, 1] }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      <div className="donut-center">
        <strong>52%</strong>
        <span>con evidencia</span>
      </div>
    </div>
  );
}

function OrgOrbit() {
  const [selected, setSelected] = useState("Gestión Humana");
  const selectedLayer = areas.find((area) => area.name === selected)?.layer ?? "Aseguramiento";

  return (
    <div className="org-visual-wrap">
      <div className="governance-row" aria-label="Órganos de gobierno y control">
        <span>Junta de Asociados</span>
        <span>Asamblea de Asociados</span>
        <span>Revisoría Fiscal</span>
      </div>
      <div className="org-layout">
        <div className="org-orbit" aria-label="Mapa circular de la estructura organizacional de Telemedellín">
          <div className="orbit-ring orbit-ring-outer" />
          <div className="orbit-ring orbit-ring-middle" />
          <div className="orbit-ring orbit-ring-inner" />
          <div className="org-core">
            <Building2 size={22} aria-hidden="true" />
            <strong>Gerencia</strong>
          </div>
          {areas.map((area) => (
            <button
              type="button"
              key={area.name}
              className={`org-label org-${area.layer.toLowerCase()} ${selected === area.name ? "is-active" : ""}`}
              style={{ "--x": area.x, "--y": area.y } as CSSProperties}
              onClick={() => setSelected(area.name)}
              aria-pressed={selected === area.name}
            >
              {area.name}
            </button>
          ))}
        </div>
        <div className="org-detail" aria-live="polite">
          <span>{selectedLayer}</span>
          <h3>{selected}</h3>
          <p>{areaNotes[selected]}</p>
          <div className="org-legend">
            <i className="legend-misional" /> Áreas misionales
            <i className="legend-articulacion" /> Articulación
            <i className="legend-aseguramiento" /> Aseguramiento
          </div>
        </div>
      </div>
      <div className="mobile-layer-list">
        {[
          ["Núcleo", "Gerencia"],
          ["Aseguramiento", "Gestión Humana · Control Interno"],
          ["Articulación", "Relaciones Corporativas · Planeación · Secretaría General · Administrativa y Financiera"],
          ["Misional", "Contenidos y Distribución · Producción · Agencia TM · Tecnología e Innovación"],
        ].map(([layer, content]) => (
          <div key={layer}>
            <span>{layer}</span>
            <p>{content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function VideoBlock() {
  if (YOUTUBE_VIDEO_ID) {
    return (
      <div className="video-frame">
        <iframe
          src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}`}
          title="Video de Telemedellín"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      className="video-placeholder"
      onClick={() => toast("El video sigue en edición", { description: "El contenedor 16:9 ya está listo para insertar el enlace de YouTube." })}
      aria-label="Espacio reservado para el video de YouTube en edición"
    >
      <span className="video-grid" />
      <span className="video-play"><Play fill="currentColor" size={30} /></span>
      <span className="video-copy">
        <small>CONTENIDO AUDIOVISUAL</small>
        <strong>Video en edición</strong>
        <span>Espacio 16:9 listo para YouTube</span>
      </span>
      <span className="video-status"><PauseCircle size={16} /> Próximamente</span>
    </button>
  );
}

function PresentationMode({ onClose }: { onClose: () => void }) {
  const [slide, setSlide] = useState(0);
  const [showData, setShowData] = useState(false);

  useEffect(() => {
    const move = (delta: number) => {
      setShowData(false);
      setSlide((current) => Math.max(0, Math.min(visibleSections.length - 1, current + delta)));
    };
    const handleKey = (event: KeyboardEvent) => {
      if (["ArrowRight", "ArrowDown", "PageDown"].includes(event.key)) {
        event.preventDefault();
        move(1);
      } else if (["ArrowLeft", "ArrowUp", "PageUp"].includes(event.key)) {
        event.preventDefault();
        move(-1);
      } else if (event.key === "Home") {
        event.preventDefault();
        setShowData(false);
        setSlide(0);
      } else if (event.key === "End") {
        event.preventDefault();
        setShowData(false);
        setSlide(visibleSections.length - 1);
      } else if (event.key.toLowerCase() === "d") {
        event.preventDefault();
        setShowData((visible) => !visible);
      } else if (event.key === "Escape") {
        onClose();
      }
    };
    document.body.classList.add("presentation-active");
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.classList.remove("presentation-active");
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  const goTo = (index: number) => {
    setShowData(false);
    setSlide(Math.max(0, Math.min(visibleSections.length - 1, index)));
  };

  const slideContentAll = [
    <div className="presentation-layout context-slide" key="contexto">
      <div className="presentation-copy">
        <span className="presentation-kicker">Voz 1 · Territorio e historia</span>
        <h2>Un canal local que se reconoce en su ciudad</h2>
        <p>Telemedellín fue creado el <strong>13 de agosto de 1996</strong> y comenzó a emitir el <strong>7 de diciembre de 1997</strong>.</p>
        <div className="presentation-facts"><Stat value="1996" label="creación" /><Stat value="1997" label="señal al aire" tone="green" /><Stat value="28.000 m²" label="Canal Parque" tone="charcoal" /></div>
      </div>
      <div className="presentation-image"><img src={PARK_URL} alt="Canal Parque Gabriel García Márquez" /><span>Comuna 14 · El Poblado</span></div>
    </div>,
    <div className="presentation-layout structure-slide" key="estructura">
      <div className="presentation-copy">
        <span className="presentation-kicker">Voz 2 · Estructura TM 2026</span>
        <PresenterCard presenter={sections[1]} index={1} presentation />
        <h2>La Gerencia articula cuatro capas de organización</h2>
        <p>Gobierno y control, aseguramiento, articulación y misión se conectan para convertir la estrategia en servicio público audiovisual.</p>
      </div>
      <div className="presentation-layers">
        <div><span>01</span><strong>Núcleo</strong><p>Gerencia</p></div>
        <div><span>02</span><strong>Aseguramiento</strong><p>Gestión Humana · Control Interno</p></div>
        <div><span>03</span><strong>Articulación</strong><p>Relaciones Corporativas · Planeación · Secretaría General · Administrativa y Financiera</p></div>
        <div><span>04</span><strong>Misión</strong><p>Contenidos y Distribución · Producción · Agencia TM · Tecnología e Innovación</p></div>
      </div>
    </div>,
    <div className="presentation-layout diagnostic-slide" key="diagnostico">
      <div className="presentation-copy">
        <span className="presentation-kicker">Voz 2 · MIPG en cifras</span>
        <h2>El reto es demostrar la gestión con evidencia trazable</h2>
        <p>El promedio <strong>31,9/100</strong> corresponde únicamente a los ítems evidenciados; no es una medición definitiva de la madurez real del canal.</p>
      </div>
      <div className="presentation-metrics">
        <DonutChart />
        <div><strong>64</strong><span>ítems con evidencia</span></div>
        <div><strong>59</strong><span>pendientes de verificación</span></div>
        <div><strong>123</strong><span>ítems en total</span></div>
      </div>
    </div>,
    <div className="presentation-layout findings-slide" key="hallazgos">
      <div className="presentation-copy">
        <span className="presentation-kicker">Voz 4 · Fortalezas y brechas</span>
        <PresenterCard presenter={sections[3]} index={3} presentation />
        <h2>Una base sólida, con vacíos de trazabilidad</h2>
      </div>
      <div className="presentation-compare">
        <div><CheckCircle2 /><h3>Fortalezas</h3><p>Marco legal actualizado</p><p>Caracterización demográfica</p><p>Clima: 78 % de favorabilidad</p><p>101 participantes</p></div>
        <div><AlertTriangle /><h3>Brechas</h3><p>Ingreso: 12 de 15 pendientes</p><p>Retiro: 6 de 6 pendientes</p><p>Evaluación e inducción</p><p>Manual de funciones y perfiles</p></div>
      </div>
    </div>,
    <div className="presentation-layout route-slide" key="ruta">
      <div className="presentation-copy">
        <span className="presentation-kicker">Voz 5 · Ruta de mejora y video</span>
        <PresenterCard presenter={sections[4]} index={4} presentation />
        <h2>Cuatro movimientos para elevar la madurez institucional</h2>
      </div>
      <div className="presentation-actions">
        {actions.map((action) => <div key={action.step}><span>{action.step}</span><div><strong>{action.title}</strong><p>{action.text}</p></div></div>)}
      </div>
    </div>,
  ];

  const slideDataAll = [
    <div key="data-context"><strong>Datos para ampliar</strong><p>Telemedellín es una asociación sin ánimo de lucro entre entidades públicas municipales. El Canal Parque alberga 964 árboles de 137 especies y 69 especies de fauna, 58 de ellas aves.</p></div>,
    <div key="data-structure"><strong>Equipo directivo 2026</strong><div className="presentation-data-grid">{directors.map(([role, name]) => <p key={role}><span>{role}</span>{name}</p>)}</div></div>,
    <div key="data-mipg"><strong>Detalle de componentes</strong><div className="presentation-data-grid">{componentScores.map((item) => <p key={item.name}><span>{item.name}</span>{item.note} · {item.value ?? "Sin datos"}</p>)}</div></div>,
    <div key="data-findings"><strong>Cumplimiento Decreto 612 de 2018</strong><div className="presentation-data-grid">{decreePlans.map(([name, status]) => <p key={name}><span>{status}</span>{name}</p>)}</div></div>,
    <div key="data-route"><strong>Fuentes que deben integrarse</strong><div className="presentation-data-grid">{evidenceSources.map((source) => <p key={source}><Check size={14} />{source}</p>)}</div></div>,
  ];

  const slideOrder = visibleSections.map((item) => sections.findIndex((section) => section.id === item.id));
  const slideContent = slideContentAll[slideOrder[slide]];
  const slideData = slideDataAll[slideOrder[slide]];

  return (
    <motion.div className={`presentation-overlay presentation-tone-${slideOrder[slide] + 1}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-label="Modo presentación">
      <header className="presentation-header">
        <img src={LOGO_URL} alt="Telemedellín" />
        <div className="presentation-progress">
          {visibleSections.map((item, index) => <button key={item.id} className={index === slide ? "is-active" : ""} onClick={() => goTo(index)} aria-label={`Ir a ${item.label}`}><span>0{index + 1}</span>{item.short}</button>)}
        </div>
        <button type="button" className="presentation-close" onClick={onClose}><X size={20} /><span>Salir</span></button>
      </header>
      <AnimatePresence mode="wait">
        <motion.main className="presentation-stage" key={slide} initial={{ opacity: 0, x: 38 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -38 }} transition={{ duration: 0.32, ease: [0.23, 1, 0.32, 1] }}>
          {slideContent}
        </motion.main>
      </AnimatePresence>
      <AnimatePresence>
        {showData && <motion.aside className="presentation-data" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }}>{slideData}</motion.aside>}
      </AnimatePresence>
      <footer className="presentation-controls">
        <button type="button" onClick={() => goTo(slide - 1)} disabled={slide === 0}><ChevronLeft size={20} /> Anterior</button>
        <button type="button" className={showData ? "is-active" : ""} onClick={() => setShowData((visible) => !visible)}><FileText size={18} /> {showData ? "Ocultar datos" : "Datos de apoyo"} <kbd>D</kbd></button>
        <span><Keyboard size={17} /> Flechas para navegar · {slide + 1}/{visibleSections.length}</span>
        <button type="button" onClick={() => goTo(slide + 1)} disabled={slide === visibleSections.length - 1}>Siguiente <ChevronRight size={20} /></button>
      </footer>
    </motion.div>
  );
}

export default function Home() {
  const [active, setActive] = useState("contexto");
  const [menuOpen, setMenuOpen] = useState(false);
  const [presentationOpen, setPresentationOpen] = useState(false);
  const activeIndex = useMemo(() => visibleSections.findIndex((item) => item.id === active), [active]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-28% 0px -52% 0px", threshold: [0.05, 0.2, 0.45] },
    );
    document.querySelectorAll("section[data-speaker]").forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (presentationOpen && !document.fullscreenElement) setPresentationOpen(false);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [presentationOpen]);

  const navigate = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  };

  const startPresentation = async () => {
    setPresentationOpen(true);
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
    } catch {
      toast("Modo presentación activado", { description: "El navegador no permitió pantalla completa, pero la vista de exposición está lista." });
    }
  };

  const closePresentation = async () => {
    setPresentationOpen(false);
    if (document.fullscreenElement) await document.exitFullscreen().catch(() => undefined);
  };

  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand" href="#inicio" aria-label="Ir al inicio">
          <img src={LOGO_URL} alt="Telemedellín — Aquí te ves" />
        </a>
        <nav className="desktop-nav" aria-label="Secciones de la webinfografía">
          {visibleSections.map((item, index) => (
            <button key={item.id} type="button" className={active === item.id ? "is-active" : ""} onClick={() => navigate(item.id)}>
              <span>0{index + 1}</span>{item.short}
            </button>
          ))}
        </nav>
        <button className="presentation-launch" type="button" onClick={startPresentation}><PresentationIcon size={17} /><span>Presentar</span></button>
        <button className="menu-button" type="button" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
          <span /> <span />
          <b>{menuOpen ? "Cerrar" : "Secciones"}</b>
        </button>
        {menuOpen && (
          <div className="mobile-menu">
            {visibleSections.map((item, index) => (
              <button key={item.id} type="button" onClick={() => navigate(item.id)}>
                <span>0{index + 1}</span>{item.label}<ChevronRight size={17} />
              </button>
            ))}
          </div>
        )}
      </header>

      <aside className="story-rail" aria-label="Progreso de la exposición">
        <span className="rail-title">Voces</span>
        <div className="rail-track">
          <span style={{ transform: `scaleY(${Math.max(0, activeIndex) / Math.max(1, visibleSections.length - 1)})` }} />
        </div>
        {visibleSections.map((item, index) => (
          <button key={item.id} className={active === item.id ? "is-active" : ""} onClick={() => navigate(item.id)} aria-label={`Ir a la sección ${index + 1}: ${item.label}`}>
            {index + 1}
          </button>
        ))}
      </aside>

      <main>
        <section id="inicio" className="hero">
          <div className="hero-noise" />
          <div className="hero-inner">
            <Reveal className="hero-copy">
              <div className="hero-kicker"><Radio size={17} /> Webinfografía · Gestión pública y comunicación</div>
              <h1><span>Telemedellín</span><br />estructura, talento<br />y ruta de mejora</h1>
              <p>Una lectura visual de la organización 2026 y del diagnóstico de la Dimensión 1 del MIPG: <strong>Gestión Estratégica del Talento Humano.</strong></p>
              <div className="hero-actions">
                <button type="button" className="primary-button" onClick={() => navigate("contexto")}>Iniciar recorrido <ArrowDown size={18} /></button>
              </div>
            </Reveal>
            <Reveal className="hero-collage" delay={0.12}>
              <div className="photo-card">
                <img src={PARK_URL} alt="Canal Parque Gabriel García Márquez, sede de Telemedellín en El Poblado" />
                <div className="photo-overlay">
                  <span><MapPin size={16} /> Comuna 14 · El Poblado</span>
                  <strong>Canal Parque<br />Gabriel García Márquez</strong>
                </div>
              </div>
              <div className="signal-card"><span className="signal-dot" /><b>SEÑAL LOCAL</b><span>Medellín y Valle de Aburrá</span></div>
              <div className="year-card year-card-one"><strong>1996</strong><span>Creación</span></div>
              <div className="year-card year-card-two"><strong>1997</strong><span>Señal al aire</span></div>
            </Reveal>
          </div>
          <div className="hero-credits" aria-label="Participantes">
            <span className="hero-credits-title"><Users size={15} /> Presentan</span>
            {sections.map((item) => (
              <span className="hero-credit" key={item.id}><i>{item.initials}</i>{item.presenter}</span>
            ))}
          </div>
          <div className="speaker-strip">
            {visibleSections.map((item, index) => (
              <button key={item.id} type="button" onClick={() => navigate(item.id)}>
                <span>Voz {index + 1}</span><strong>{item.label}</strong>
              </button>
            ))}
          </div>
        </section>

        <section id="contexto" data-speaker className="section section-context">
          <div className="section-inner">
            <Reveal><Eyebrow number="01" speaker="Voz 1">Territorio e historia</Eyebrow></Reveal>
            <div className="context-grid">
              <Reveal className="context-image">
                <img src={PARK_URL} alt="Vista del Canal Parque Gabriel García Márquez de Telemedellín" />
                <div className="image-caption"><span>Foto: Alcaldía de Medellín</span><span>Canal Parque · 28.000 m²</span></div>
              </Reveal>
              <Reveal className="context-copy" delay={0.1}>
                <SectionHeader
                  kicker="Un canal que se reconoce en su ciudad"
                  title="De señal local a espacio público de encuentro"
                  intro="Telemedellín es una asociación sin ánimo de lucro integrada por entidades públicas municipales. Nació para narrar la ciudad desde sus territorios, sus culturas y su gente."
                />
                <div className="timeline">
                  <div><CalendarDays size={19} /><span>13 AGO 1996</span><p>Creación de Telemedellín.</p></div>
                  <div><Radio size={19} /><span>07 DIC 1997</span><p>Inicio de la señal al aire.</p></div>
                  <div><MapPinned size={19} /><span>HOY</span><p>Canal local con foco en Medellín, el Valle de Aburrá y Antioquia.</p></div>
                </div>
                <blockquote>“Aquí te ves” resume una vocación: convertir la información, el arte, la cultura y el entretenimiento en relatos donde la ciudadanía se reconoce.</blockquote>
              </Reveal>
            </div>
          </div>
        </section>

        <section id="video" className="section section-video">
          <div className="section-inner">
            <Reveal className="video-column" delay={0.12}>
              <div className="video-heading"><Video size={20} /><span>Momento audiovisual</span></div>
              <VideoBlock />
              <div className="video-instruction"><Lightbulb size={18} /><p>Cuando finalice la edición, solo se debe añadir el ID del video de YouTube en la constante <code>YOUTUBE_VIDEO_ID</code>.</p></div>
            </Reveal>
          </div>
        </section>

        {/* Sección oculta temporalmente; el código se conserva para reactivarla quitando el atributo `hidden`. */}
        <section id="estructura" data-speaker hidden className="section section-structure">
          <div className="section-inner">
            <Reveal><Eyebrow number="02" speaker="Voz 2">Estructura TM 2026</Eyebrow></Reveal>
            <Reveal className="presenter-card-wrap" delay={0.04}><PresenterCard presenter={sections[1]} index={1} /></Reveal>
            <Reveal>
              <SectionHeader
                kicker="Arquitectura organizacional"
                title="Una estructura concéntrica para coordinar, producir y rendir cuentas"
                intro="El organigrama sitúa la Gerencia en el núcleo y organiza las áreas por su relación con la dirección, el aseguramiento, la articulación y la misión del canal. Selecciona un área para conocer su aporte."
              />
            </Reveal>
            <Reveal delay={0.08}><OrgOrbit /></Reveal>
            <Reveal delay={0.1}>
              <DocumentDropdown title="Consultar equipo directivo 2026" subtitle="11 responsables incluidos en el PDF Estructura TM">
                <div className="directors-grid">
                  {directors.map(([role, name]) => <div key={role}><span>{role}</span><strong>{name}</strong></div>)}
                </div>
              </DocumentDropdown>
            </Reveal>
            <Reveal className="structure-note">
              <Network size={22} />
              <p><strong>Lectura clave:</strong> Gestión Humana y Control Interno rodean la Gerencia; las áreas de articulación conectan la estrategia con la operación; y las áreas misionales proyectan el servicio hacia las audiencias.</p>
            </Reveal>
          </div>
        </section>

        <section id="diagnostico" data-speaker className="section section-diagnostic">
          <div className="section-inner">
            <Reveal><Eyebrow number="02" speaker="Voz 2">MIPG en cifras</Eyebrow></Reveal>
            <div className="diagnostic-heading-row">
              <Reveal>
                <SectionHeader
                  kicker="Dimensión 1 · Talento Humano"
                  title="El desafío no es solo gestionar: es poder demostrarlo"
                  intro="El Plan Estratégico de Talento Humano 2026 cumple el requisito formal de existencia y publicación. Sin embargo, la evidencia disponible todavía no permite acreditar una gestión madura en todos los componentes."
                />
              </Reveal>
              <Reveal className="score-card interactive-metric" delay={0.1}>
                <span>Promedio evidenciado</span><strong>31,9<small>/100</small></strong><p>Básico operativo — bajo</p>
                <i className="metric-tooltip">Promedio calculado solo con ítems que tenían evidencia disponible.</i>
              </Reveal>
            </div>

            <div className="evidence-dashboard">
              <Reveal className="evidence-card interactive-metric">
                <DonutChart />
                <div className="evidence-copy">
                  <div><span className="evidence-dot green" /><strong>64 ítems</strong><small>con evidencia directa</small></div>
                  <div><span className="evidence-dot orange" /><strong>59 ítems</strong><small>pendientes de verificación</small></div>
                  <p>Base total: <strong>123 ítems</strong> de la Matriz de Autodiagnóstico GETH.</p>
                </div>
                <i className="metric-tooltip">64 evidenciados + 59 pendientes = 123 ítems revisados.</i>
              </Reveal>
              <Reveal className="bars-card interactive-metric" delay={0.08}>
                <div className="card-title"><BarChart3 size={20} /><span>Promedio por componente</span></div>
                {componentScores.map((item, index) => (
                  <div className="score-row" key={item.name} tabIndex={0}>
                    <div><strong>{item.name}</strong><span>{item.note}</span></div>
                    <div className="score-track">
                      {item.value !== null ? (
                        <motion.span initial={{ scaleX: 0 }} whileInView={{ scaleX: item.value / 100 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: index * 0.09 }} />
                      ) : <i />}
                    </div>
                    <b>{item.value !== null ? item.value.toLocaleString("es-CO", { minimumFractionDigits: 1 }) : "S/D"}</b>
                  </div>
                ))}
                <i className="metric-tooltip">Pasa el cursor sobre cada componente para resaltar su resultado.</i>
              </Reveal>
            </div>

            <Reveal delay={0.08}>
              <DocumentDropdown title="Abrir detalle de los 123 ítems GETH" subtitle="Distribución por componente, evidencia y promedio" dark>
                <div className="data-table-wrap">
                  <table className="data-table">
                    <thead><tr><th>Componente</th><th>Ítems</th><th>Evidenciados</th><th>Pendientes</th><th>Promedio</th></tr></thead>
                    <tbody>
                      <tr><td>Planeación</td><td>24</td><td>18</td><td>6</td><td>41,9</td></tr>
                      <tr><td>Ingreso</td><td>15</td><td>3</td><td>12</td><td>51,7*</td></tr>
                      <tr><td>Desarrollo</td><td>78</td><td>43</td><td>35</td><td>26,3</td></tr>
                      <tr><td>Retiro</td><td>6</td><td>0</td><td>6</td><td>Sin datos</td></tr>
                      <tr className="table-total"><td>Total / global</td><td>123</td><td>64</td><td>59</td><td>31,9</td></tr>
                    </tbody>
                  </table>
                  <p className="table-note">* El 51,7 de Ingreso se apoya en solo 3 de 15 ítems; no debe interpretarse como representativo de todo el componente.</p>
                </div>
              </DocumentDropdown>
            </Reveal>

            <Reveal className="interpretation-callout">
              <AlertTriangle size={22} />
              <div><strong>Lectura responsable del 31,9</strong><p>No representa necesariamente la madurez real de Telemedellín. Representa lo que el Plan, tal como está redactado, puede demostrar hoy ante una auditoría o el reporte FURAG.</p></div>
            </Reveal>

            <Reveal className="plans-grid">
              <div className="plan-card is-complete"><CheckCircle2 /><span>Cumplimiento formal</span><strong>Vacantes + Plan Estratégico de Talento Humano</strong></div>
              <div className="plan-card is-partial"><PauseCircle /><span>Desarrollo parcial</span><strong>Previsión + Capacitación + Bienestar + SST</strong></div>
            </Reveal>
            <Reveal delay={0.1}>
              <DocumentDropdown title="Ver cumplimiento frente al Decreto 612 de 2018" subtitle="Seis instrumentos integrados en el Plan 2026" dark>
                <div className="decree-grid">
                  {decreePlans.map(([name, status, note]) => <div key={name}><span className={status === "Sí" ? "status-yes" : "status-partial"}>{status}</span><strong>{name}</strong><p>{note}</p></div>)}
                </div>
              </DocumentDropdown>
            </Reveal>
          </div>
        </section>

        {/* Sección oculta temporalmente; el código se conserva para reactivarla quitando el atributo `hidden`. */}
        <section id="hallazgos" data-speaker hidden className="section section-findings">
          <div className="section-inner">
            <Reveal><Eyebrow number="04" speaker="Voz 4">Fortalezas y brechas</Eyebrow></Reveal>
            <Reveal className="presenter-card-wrap" delay={0.04}><PresenterCard presenter={sections[3]} index={3} /></Reveal>
            <Reveal>
              <SectionHeader
                kicker="Lo que ya existe y lo que falta conectar"
                title="Una base institucional sólida, con vacíos de trazabilidad"
                intro="El diagnóstico distingue capacidades instaladas de riesgos documentales y operativos. Esta separación permite evitar conclusiones absolutas y concentrar la mejora donde genera más valor."
              />
            </Reveal>

            <div className="findings-grid">
              <Reveal className="finding-panel finding-good">
                <div className="finding-heading"><CheckCircle2 /><div><span>FORTALEZAS</span><h3>Capacidades demostrables</h3></div></div>
                <ul>
                  <li><Check /><span><strong>Marco legal actualizado</strong> con referencias explícitas a MIPG y GETH.</span></li>
                  <li><Check /><span><strong>Caracterización demográfica</strong> por nivel, género, edad, antigüedad y educación.</span></li>
                  <li><Check /><span><strong>Clima organizacional medido</strong> con metodología y plan de mejora.</span></li>
                  <li><Check /><span><strong>Valores corporativos explícitos</strong> como Código de Integridad.</span></li>
                </ul>
                <div className="mini-stats"><Stat value="78%" label="favorabilidad del clima" tone="green" /><Stat value="101" label="participantes" tone="green" /></div>
              </Reveal>

              <Reveal className="finding-panel finding-risk" delay={0.1}>
                <div className="finding-heading"><AlertTriangle /><div><span>BRECHAS PRIORITARIAS</span><h3>Evidencia y ciclo de vida</h3></div></div>
                <ul>
                  <li><CircleDot /><span><strong>Ingreso:</strong> faltan soportes sobre SIGEP, historias laborales, elegibles, bienes y rentas e inclusión.</span></li>
                  <li><CircleDot /><span><strong>Desarrollo:</strong> evaluación, inducción y reinducción no aparecen desarrolladas.</span></li>
                  <li><CircleDot /><span><strong>Retiro:</strong> no hay evidencia para los seis ítems del componente.</span></li>
                  <li><CircleDot /><span><strong>Perfiles:</strong> falta integrar el Manual de Funciones y Competencias.</span></li>
                </ul>
                <div className="mini-stats"><Stat value="2/31" label="cargos provisionales" /><Stat value="31/31" label="contratistas / planta" /></div>
              </Reveal>
            </div>

            <Reveal className="balance-line">
              <ShieldCheck size={22} /><p><strong>Principio de análisis:</strong> “sin evidencia en el Plan” no equivale a “sin gestión”. El paso siguiente es integrar las fuentes dispersas y convertirlas en trazabilidad verificable.</p>
            </Reveal>
            <Reveal delay={0.08}>
              <DocumentDropdown title="Fuentes documentales que pueden cerrar las brechas" subtitle="Documentos publicados por separado en el portal de transparencia">
                <div className="source-chip-grid">
                  {evidenceSources.map((source) => <span key={source}><Check size={15} />{source}</span>)}
                </div>
              </DocumentDropdown>
            </Reveal>
          </div>
        </section>

        {/* Sección oculta temporalmente; el código se conserva para reactivarla quitando el atributo `hidden`. */}
        <section id="ruta" data-speaker hidden className="section section-route">
          <div className="section-inner">
            <Reveal><Eyebrow number="05" speaker="Voz 5">Ruta de mejora y video</Eyebrow></Reveal>
            <Reveal className="presenter-card-wrap" delay={0.04}><PresenterCard presenter={sections[4]} index={4} /></Reveal>
            <div className="route-grid">
              <div>
                <Reveal>
                  <SectionHeader
                    kicker="Del diagnóstico a la acción"
                    title="Cuatro movimientos para elevar la madurez institucional"
                    intro="La prioridad es cerrar la brecha entre lo que se hace, lo que se registra y lo que se puede demostrar. La mejora debe terminar en acciones con responsables, tiempos e indicadores."
                  />
                </Reveal>
                <div className="action-list">
                  {actions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <Reveal className="action-card" delay={index * 0.06} key={action.step}>
                        <span className="action-number">{action.step}</span>
                        <Icon size={22} />
                        <div><h3>{action.title}</h3><p>{action.text}</p></div>
                      </Reveal>
                    );
                  })}
                </div>
              </div>
              <Reveal className="route-quote" delay={0.12}>
                <blockquote>La meta no es “llenar una matriz”: es usar la evidencia para cuidar el talento que hace posible la misión pública del canal.</blockquote>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="closing-section">
          <div className="section-inner closing-inner">
            <Reveal className="closing-copy">
              <Sparkles size={28} />
              <span>IDEA FUERZA</span>
              <h2>Telemedellín ya tiene estructura y capacidades. El siguiente salto es hacer visible, medible y sostenible su gestión del talento.</h2>
              <button type="button" className="secondary-button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Volver al inicio <ArrowDown className="rotate-icon" size={18} /></button>
            </Reveal>
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-inner">
          <div className="footer-brand"><img src={LOGO_URL} alt="Telemedellín" /><p>Webinfografía académica basada en documentos institucionales 2026.</p></div>
          <div className="sources">
            <span>FUENTES PRINCIPALES</span>
            <p>“Estructura-TM-2026.pdf” · “Análisis de Cumplimiento MIPG — Talento Humano” · Matriz de Autodiagnóstico GETH 2026.</p>
            <div>
              <a href="https://telemedellin.tv/quienes-somos/" target="_blank" rel="noreferrer">Quiénes somos <ArrowUpRight size={14} /></a>
              <a href="https://www.medellin.gov.co/es/sala-de-prensa/noticias/el-canal-parque-gabriel-garcia-marquez-de-telemedellin-abre-de-nuevo-sus-puertas-a-la-ciudad/" target="_blank" rel="noreferrer">Canal Parque <ArrowUpRight size={14} /></a>
            </div>
          </div>
        </div>
      </footer>
      <AnimatePresence>{presentationOpen && <PresentationMode onClose={closePresentation} />}</AnimatePresence>
    </div>
  );
}
