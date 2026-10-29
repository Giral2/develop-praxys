  <!-- ==================== JAVASCRIPT APPLICATION CORE ==================== -->
  <script>
    /**
     * PRAXIS - Infrastructure Management Architecture
     * Orchestrator / Backend / Frontend Logic Engine
     * Role Workspaces (R01-R07) + Ops Console V2.4 (Kanban + Table + Pipeline)
     */

    // Location hierarchy mapping for universities (4 Levels: Sede -> Edificio -> Piso -> Aula)
    const UNIVERSITY_HIERARCHY_4L = {
      "Campus Meléndez": {
        "Bloque A (Ingeniería)": {
          "Piso 1": ["Aula Magna 1", "Lab Mecánica Suelos 102", "Baños Piso 1"],
          "Piso 2": ["Decanatura 204", "Sala de Juntas 208", "Laboratorio Hidráulica"]
        },
        "Bloque B (Ciencias)": {
          "Piso 1": ["Aula 105 Química", "Cuarto Técnico B-01"],
          "Piso 2": ["Lab 201 Física Cuántica", "Almacén Reactivos"],
          "Piso 3": ["Lab 302 Redes", "Cubículos Docentes 310"]
        },
        "Bloque D (Aulas Generales)": {
          "Piso 1": ["Auditorio 102", "Cafetería Central", "Batería Sanitaria Piso 1"],
          "Piso 2": ["Batería Sanitaria Piso 2", "Aula 201", "Aula 205"],
          "Piso 4": ["Sala Cómputo 401", "Sala Cómputo 402"]
        },
        "Bloque E (Biblioteca Central)": {
          "Piso 1": ["Hemeroteca Piso 1", "Recepción y Préstamos"],
          "Piso 2": ["Cubículos Estudio 12", "Sala Lectura Silenciosa"],
          "Piso 3": ["Hemeroteca Piso 3", "Sala Servidores Central", "Terraza Sur"]
        },
        "Subestación Eléctrica Sur": {
          "Nivel 0": ["Transformador Principal T-01", "Banco Baterías UPS", "Generador Diésel G-2"]
        }
      },
      "Campus San Fernando": {
        "Edificio Salud 100": {
          "Sótano": ["Morgue Docente", "Cuarto Bombas"],
          "Piso 1": ["Lab Microbiología 104", "Ascensor Principal", "Recepción Salud"],
          "Piso 2": ["Aula de Trauma 201", "Laboratorio Simulación"]
        },
        "Clínicas Odontológicas": {
          "Piso 1": ["Unidad Dental 3", "Central de Esterilización", "Sala Espera Pacientes"]
        },
        "Auditorio Farallones": {
          "Piso 1": ["Escenario Principal", "Cabina Luces & Sonido", "Climatización Central"]
        }
      },
      "Sede Yumbo": {
        "Pabellón Tecnológico": {
          "Piso 1": ["Taller Mecatrónica T-1", "Tablero Potencia Norte"],
          "Piso 2": ["Lab Automatización 202"]
        },
        "Edificio Administrativo": {
          "Piso 1": ["Coordinación Académica", "Sala Profesores", "Red Voz y Datos"]
        }
      },
      "Sede Palmira": {
        "Bloque Agronomía": {
          "Piso 1": ["Invernadero Experimental 04", "Laboratorio Suelos Tropicales", "Cámara de Frío"]
        },
        "Centro de Cómputo": {
          "Piso 1": ["Aula Virtual 1", "Racks Telecomunicaciones", "Oficina Soporte TI"]
        }
      }
    };

    // Technicians Directory with Specialty and WIP Limits (RN-024)
    const TECHNICIANS_DATA = [
      { name: "Ing. Carlos Méndez", specialty: "Eléctrica", maxWip: 4, initials: "CM", color: "bg-blue-600" },
      { name: "Tec. Jorge Ospina", specialty: "HVAC/Climatización", maxWip: 3, initials: "JO", color: "bg-sky-600" },
      { name: "Tec. Andrés Caicedo", specialty: "Hidráulica", maxWip: 4, initials: "AC", color: "bg-cyan-600" },
      { name: "Ing. Diana Rivas", specialty: "Redes", maxWip: 3, initials: "DR", color: "bg-purple-600" },
      { name: "Maestro Luis Arana", specialty: "Estructural", maxWip: 4, initials: "LA", color: "bg-amber-600" }
    ];

    // Rich Initial Mock Data (23 realistic tickets across all 7 roles and 18 states)
    const INITIAL_TICKETS = [
      // 1. E01: Triaje inicial
      {
        id: "TKT-2026-000142",
        title: "Falla en transformador secundario por sobrecalentamiento",
        category: "Eléctrica",
        severity: "CRITICA",
        sede: "Campus Meléndez",
        bloque: "Subestación Eléctrica Sur",
        piso: "Nivel 0",
        aula: "Transformador Principal T-01",
        reporter: "Ing. Marcos Peña (Infraestructura)",
        technician: "",
        status: "E01",
        createdHoursAgo: 1.5,
        slaHours: 4,
        description: "Se dispararon las protecciones térmicas de la subestación. Posible sobretensión o fuga de aceite dieléctrico que compromete los laboratorios del bloque B y D.",
        bitacora: [
          { date: "2026-10-29 07:10", user: "Sistema PRAXIS", note: "Ticket creado automáticamente por telemetría SCADA." }
        ]
      },
      // 2. E02: Pendiente de información (Aclaración requerida para R01)
      {
        id: "TKT-2026-000143",
        title: "Filtración en tubería de condensados de chiller",
        category: "HVAC/Climatización",
        severity: "ALTA",
        sede: "Campus Meléndez",
        bloque: "Bloque E (Biblioteca Central)",
        piso: "Piso 3",
        aula: "Hemeroteca Piso 3",
        reporter: "Prof. Laura Gómez",
        technician: "",
        status: "E02",
        clarificationMotive: "Favor especificar si el goteo es sobre los racks de archivo histórico o en el pasillo exterior.",
        createdHoursAgo: 2.2,
        slaHours: 12,
        description: "Goteo continuo sobre estantería de archivo histórico. Requiere contención inmediata y purga del circuito refrigerante.",
        bitacora: [
          { date: "2026-10-29 07:45", user: "Operador Triaje (R02)", note: "Se solicitó aclaración al reportante: Favor especificar si el goteo es sobre los racks de archivo histórico o en el pasillo exterior." },
          { date: "2026-10-29 06:45", user: "Prof. Laura Gómez", note: "Radicado inicial. Riesgo de pérdida bibliográfica." }
        ]
      },
      // 3. E03: En revisión de triaje (Con aclaración aportada)
      {
        id: "TKT-2026-000144",
        title: "Caída de enlace troncal de fibra óptica inter-edificios",
        category: "Redes",
        severity: "ALTA",
        sede: "Campus San Fernando",
        bloque: "Edificio Salud 100",
        piso: "Piso 2",
        aula: "Aula de Trauma 201",
        reporter: "Dr. Roberto Casas (Decano Salud)",
        technician: "",
        status: "E03",
        createdHoursAgo: 3.5,
        slaHours: 12,
        description: "El switch perimetral no levanta el puerto SFP+ del enlace troncal con Meléndez. Las clases telemáticas están suspendidas.",
        bitacora: [
          { date: "2026-10-29 07:30", user: "Dr. Roberto Casas", note: "Aclaración aportada: El switch de distribución está en el rack del piso 2 cuarto 204." },
          { date: "2026-10-29 05:30", user: "Dr. Roberto Casas", note: "Reportado a mesa de ayuda telefónica." }
        ]
      },
      // 4. E01: Triaje inicial
      {
        id: "TKT-2026-000145",
        title: "Fisura longitudinal en viga perimetral tras sismo leve",
        category: "Estructural",
        severity: "MEDIA",
        sede: "Sede Palmira",
        bloque: "Bloque Agronomía",
        piso: "Piso 1",
        aula: "Cámara de Frío",
        reporter: "Ing. Agr. Camilo Torres",
        technician: "",
        status: "E01",
        createdHoursAgo: 8.0,
        slaHours: 48,
        description: "Aparición de grieta en mortero de recubrimiento en la cara norte de la cámara frigorífica. Se requiere evaluación patológica estructural.",
        bitacora: [
          { date: "2026-10-29 01:00", user: "Ing. Camilo Torres", note: "Se adjuntaron fotografías al radicado." }
        ]
      },
      // 5. E05: Pendiente de asignación (Por Coordinador R03)
      {
        id: "TKT-2026-000146",
        title: "Fuga de gas refrigerante R410A en compresor inverter",
        category: "HVAC/Climatización",
        severity: "ALTA",
        sede: "Campus Meléndez",
        bloque: "Bloque B (Ciencias)",
        piso: "Piso 3",
        aula: "Lab 302 Redes",
        reporter: "Prof. Alberto Silva",
        technician: "",
        status: "E05",
        createdHoursAgo: 10.5,
        slaHours: 12,
        description: "La temperatura en el cuarto de racks superó los 29°C. Se apagaron dos servidores de cálculo para prevenir avería por calor.",
        bitacora: [
          { date: "2026-10-28 22:30", user: "Mesa Triaje", note: "Revisado por analista R02. Clasificado como prioridad Alta mediante ITIL." }
        ]
      },
      // 6. E05: Pendiente de asignación
      {
        id: "TKT-2026-000147",
        title: "Rotura de válvula angular en batería de sanitarios",
        category: "Hidráulica",
        severity: "MEDIA",
        sede: "Campus Meléndez",
        bloque: "Bloque D (Aulas Generales)",
        piso: "Piso 2",
        aula: "Batería Sanitaria Piso 2",
        reporter: "Servicios Generales",
        technician: "",
        status: "E05",
        createdHoursAgo: 14.0,
        slaHours: 48,
        description: "Se cerró la llave de paso parcial del piso. Baños masculinos inhabilitados temporalmente hasta cambio de sello y vástago.",
        bitacora: [
          { date: "2026-10-28 19:00", user: "Mesa Triaje", note: "Pendiente asignar plomero de turno de mañana." }
        ]
      },
      // 7. E05: Pendiente de asignación
      {
        id: "TKT-2026-000148",
        title: "Falla de balastros LED y parpadeo intermitente",
        category: "Eléctrica",
        severity: "BAJA",
        sede: "Sede Yumbo",
        bloque: "Edificio Administrativo",
        piso: "Piso 1",
        aula: "Sala Profesores",
        reporter: "Secretaría Sede Yumbo",
        technician: "",
        status: "E05",
        createdHoursAgo: 24.0,
        slaHours: 96,
        description: "Cuatro paneles LED del cielo raso generan ruido electromagnético y parpadeo continuo en jornada de la tarde.",
        bitacora: [
          { date: "2026-10-28 09:00", user: "Mesa Triaje", note: "Programar con cuadrilla eléctrica zonal." }
        ]
      },
      // 8. E06: Pendiente de inspección técnica preliminar (R04)
      {
        id: "TKT-2026-000149",
        title: "Inspección técnica en banco de baterías UPS central",
        category: "Eléctrica",
        severity: "MEDIA",
        sede: "Campus Meléndez",
        bloque: "Subestación Eléctrica Sur",
        piso: "Nivel 0",
        aula: "Banco Baterías UPS",
        reporter: "Ing. Marcos Peña",
        technician: "Ing. Carlos Méndez",
        status: "E06",
        createdHoursAgo: 16.0,
        slaHours: 48,
        description: "Inspección de 8 celdas de ácido-plomo que superaron vida útil de 4 años según cronograma trimestral de infraestructura.",
        bitacora: [
          { date: "2026-10-28 17:00", user: "Ing. Daniel Gómez (R03)", note: "Asignado a Carlos Méndez para inspección de carga en sitio." }
        ]
      },
      // 9. E10: Programada con cuadrilla
      {
        id: "TKT-2026-000150",
        title: "Reparación de cerradura electromagnética de biometría",
        category: "Redes",
        severity: "MEDIA",
        sede: "Campus San Fernando",
        bloque: "Edificio Salud 100",
        piso: "Sótano",
        aula: "Morgue Docente",
        reporter: "Dra. Sofía Valenzuela",
        technician: "Ing. Diana Rivas",
        status: "E10",
        createdHoursAgo: 20.0,
        slaHours: 48,
        description: "El electroimán pierde fuerza de retención al alcanzar temperatura de operación. Se requiere revisar fuente de 12V DC.",
        bitacora: [
          { date: "2026-10-28 13:00", user: "Ing. Diana Rivas", note: "Programada visita técnica en campo." }
        ]
      },
      // 10. E10: Programada
      {
        id: "TKT-2026-000151",
        title: "Desobstrucción de bajante pluvial en cubierta norte",
        category: "Hidráulica",
        severity: "MEDIA",
        sede: "Sede Yumbo",
        bloque: "Pabellón Tecnológico",
        piso: "Piso 1",
        aula: "Taller Mecatrónica T-1",
        reporter: "Ing. Fernando Morales",
        technician: "Tec. Andrés Caicedo",
        status: "E10",
        createdHoursAgo: 22.0,
        slaHours: 48,
        description: "Acumulación de hojas y sedimentos genera remanso de agua lluvia con riesgo de rebose hacia el tablero de potencia.",
        bitacora: [
          { date: "2026-10-28 11:00", user: "Tec. Andrés Caicedo", note: "Cuadrilla asignada con arnés de seguridad para trabajo en alturas." }
        ]
      },
      // 11. E11: En atención en campo (R04)
      {
        id: "TKT-2026-000152",
        title: "Sustitución de compresor en cámara climática 01",
        category: "HVAC/Climatización",
        severity: "CRITICA",
        sede: "Sede Palmira",
        bloque: "Bloque Agronomía",
        piso: "Piso 1",
        aula: "Invernadero Experimental 04",
        reporter: "Dra. Elena Santamaría",
        technician: "Tec. Jorge Ospina",
        status: "E11",
        createdHoursAgo: 3.2,
        slaHours: 4,
        description: "Cultivos biológicos a temperatura controlada en peligro crítico. El técnico Ospina se encuentra en sitio realizando soldadura oxiacetilénica.",
        bitacora: [
          { date: "2026-10-29 07:30", user: "Tec. Jorge Ospina", note: "Desmontaje de compresor quemado completado. Procediendo con vacío de líneas." }
        ]
      },
      // 12. E11: En atención en campo
      {
        id: "TKT-2026-000153",
        title: "Reemplazo de contactor electromagnético en tablero general",
        category: "Eléctrica",
        severity: "ALTA",
        sede: "Campus Meléndez",
        bloque: "Bloque A (Ingeniería)",
        piso: "Piso 1",
        aula: "Aula Magna 1",
        reporter: "Decanatura Ingeniería",
        technician: "Ing. Carlos Méndez",
        status: "E11",
        createdHoursAgo: 7.0,
        slaHours: 12,
        description: "Chisporroteo constante durante encendido de climatización y luminarias del auditorio principal. Cuadrilla interviniendo el tablero.",
        bitacora: [
          { date: "2026-10-29 04:00", user: "Ing. Carlos Méndez", note: "Bloqueo y etiquetado (LOTO) aplicado en interruptor termomagnético de 250A." }
        ]
      },
      // 13. E11: En atención en campo
      {
        id: "TKT-2026-000154",
        title: "Reparación de fractura en piso epóxico de laboratorio",
        category: "Estructural",
        severity: "MEDIA",
        sede: "Campus San Fernando",
        bloque: "Edificio Salud 100",
        piso: "Piso 1",
        aula: "Lab Microbiología 104",
        reporter: "Biol. Gabriel Otero",
        technician: "Maestro Luis Arana",
        status: "E11",
        createdHoursAgo: 26.0,
        slaHours: 48,
        description: "Aplicación de resina epóxica autonivelante antibacterial para cumplir estándares de bioseguridad nivel 2.",
        bitacora: [
          { date: "2026-10-28 14:00", user: "Maestro Luis Arana", note: "Imprimación de superficie terminada. Tiempo de secado en curso." }
        ]
      },
      // 14. E11: En atención en campo
      {
        id: "TKT-2026-000155",
        title: "Ponchado y certificación de puntos de red Cat 6A",
        category: "Redes",
        severity: "BAJA",
        sede: "Campus Meléndez",
        bloque: "Bloque D (Aulas Generales)",
        piso: "Piso 4",
        aula: "Sala Cómputo 401",
        reporter: "Prof. Laura Gómez",
        technician: "Ing. Diana Rivas",
        status: "E11",
        createdHoursAgo: 30.0,
        slaHours: 96,
        description: "Adecuación de 12 nuevos puestos para examen de estado Saber Pro. Cuadrilla certificando con Fluke DSX-8000.",
        bitacora: [
          { date: "2026-10-28 10:00", user: "Ing. Diana Rivas", note: "8 de 12 puntos aprobados en nivel de atenuación y NEXT." }
        ]
      },
      // 15. E12: Pendiente de verificación de calidad (R06)
      {
        id: "TKT-2026-000156",
        title: "Acondicionamiento y purga de red de gas helio para RMN",
        category: "Hidráulica",
        severity: "CRITICA",
        sede: "Campus Meléndez",
        bloque: "Bloque B (Ciencias)",
        piso: "Piso 2",
        aula: "Lab 201 Física Cuántica",
        reporter: "Dr. Hernando Zúñiga",
        technician: "Tec. Andrés Caicedo",
        status: "E12",
        createdHoursAgo: 3.8,
        slaHours: 4,
        description: "Trabajo mecánico finalizado. Requiere inspección del inspector de seguridad química y calibración manométrica.",
        bitacora: [
          { date: "2026-10-29 07:00", user: "Tec. Andrés Caicedo", note: "Prueba hidrostática a 150 PSI aprobada sin caída de presión. Entrega a control de calidad." }
        ]
      },
      // 16. E12: Pendiente de verificación de calidad
      {
        id: "TKT-2026-000157",
        title: "Ajuste de termostatos inteligentes y balanceo de aire",
        category: "HVAC/Climatización",
        severity: "MEDIA",
        sede: "Campus San Fernando",
        bloque: "Auditorio Farallones",
        piso: "Piso 1",
        aula: "Climatización Central",
        reporter: "Administración Campus",
        technician: "Tec. Jorge Ospina",
        status: "E12",
        createdHoursAgo: 35.0,
        slaHours: 48,
        description: "Se instalaron 3 sensores Modbus en rejillas de inyección. Esperando verificación del decibelímetro y curva térmica.",
        bitacora: [
          { date: "2026-10-28 06:00", user: "Tec. Jorge Ospina", note: "Calibración en 21°C con flujo estable de 1800 CFM." }
        ]
      },
      // 17. E12: Pendiente de verificación de calidad
      {
        id: "TKT-2026-000158",
        title: "Reemplazo de placas de yeso en cielo raso por humedad",
        category: "Estructural",
        severity: "BAJA",
        sede: "Campus Meléndez",
        bloque: "Bloque A (Ingeniería)",
        piso: "Piso 2",
        aula: "Decanatura 204",
        reporter: "Secretaría Académica",
        technician: "Maestro Luis Arana",
        status: "E12",
        createdHoursAgo: 50.0,
        slaHours: 96,
        description: "Placas reemplazadas y masilladas con acabado vinilo tipo 1. Pendiente visto bueno de la interventoría interna.",
        bitacora: [
          { date: "2026-10-27 16:00", user: "Maestro Luis Arana", note: "Lienzo limpio y pintura seca. Listo para entrega de oficina." }
        ]
      },
      // 18. E08: Pendiente de autorización presupuestal (R05)
      {
        id: "TKT-2026-000159",
        title: "Requisición extraordinaria para bomba sumergible trifásica",
        category: "Hidráulica",
        severity: "ALTA",
        sede: "Sede Yumbo",
        bloque: "Pabellón Tecnológico",
        piso: "Piso 1",
        aula: "Tablero Potencia Norte",
        reporter: "Mantenimiento Planta",
        technician: "Tec. Andrés Caicedo",
        status: "E08",
        requisitionBudget: "$1,850,000 COP",
        requisitionItems: "1x Bomba sumergible 3HP Franklin Electric, kit de empalme sumergible y cable encauchetado 3x10",
        requisitionJustification: "La bomba del pozo profundo sufrió quemado de bobinado. Sin este repuesto el campus Yumbo queda sin suministro de agua en 24h.",
        createdHoursAgo: 6.0,
        slaHours: 12,
        description: "Requisición de compra de bomba pozo profundo por daño irreversible. Se requiere aprobación presupuestal de la dirección financiera.",
        bitacora: [
          { date: "2026-10-29 05:00", user: "Ing. Daniel Gómez (R03)", note: "Requisición de compra radicada hacia R05 Autorizaciones con cotización adjunta." }
        ]
      },
      // 19. E13: En corrección / Retrabajo (No conforme previa por R06)
      {
        id: "TKT-2026-000160",
        title: "Retrabajo por atenuación excesiva en patch cord de fibra óptica",
        category: "Redes",
        severity: "ALTA",
        sede: "Campus San Fernando",
        bloque: "Edificio Salud 100",
        piso: "Piso 1",
        aula: "Lab Microbiología 104",
        reporter: "Dirección de TI",
        technician: "Ing. Diana Rivas",
        status: "E13",
        createdHoursAgo: 28.0,
        slaHours: 12,
        description: "El verificador R06 rechazó la entrega porque el enlace monomodo presentó 4.2 dB de pérdida en la conectorización LC/APC.",
        bitacora: [
          { date: "2026-10-28 16:30", user: "Interventoría Calidad (R06)", note: "No conformidad emitida: Requiere nueva fusión por arco y limpieza con alcohol isopropílico de férula." }
        ]
      },
      // 20. E14: Pendiente de confirmación del reportante (R01)
      {
        id: "TKT-2026-000161",
        title: "Reparación de unidad de aire acondicionado inverter aula 201",
        category: "HVAC/Climatización",
        severity: "MEDIA",
        sede: "Campus Meléndez",
        bloque: "Bloque D (Aulas Generales)",
        piso: "Piso 2",
        aula: "Aula 201",
        reporter: "Prof. Laura Gómez",
        technician: "Tec. Jorge Ospina",
        status: "E14",
        createdHoursAgo: 40.0,
        slaHours: 48,
        description: "Se recargó gas refrigerante y se limpió turbina centrífuga. El sistema enfría a 20°C con flujo constante.",
        bitacora: [
          { date: "2026-10-28 11:30", user: "Interventoría Calidad (R06)", note: "Dictamen favorable emitido: Temperatura y consumo eléctrico dentro de norma. Pasa a confirmación del solicitante." },
          { date: "2026-10-28 09:00", user: "Tec. Jorge Ospina", note: "Trabajo terminado con éxito." }
        ]
      },
      // 21. E15: Cerrada & Conforme
      {
        id: "TKT-2026-000139",
        title: "Restablecimiento de suministro de agua potable por bypass",
        category: "Hidráulica",
        severity: "CRITICA",
        sede: "Campus Meléndez",
        bloque: "Bloque D (Aulas Generales)",
        piso: "Piso 1",
        aula: "Cafetería Central",
        reporter: "Administración Cafetería",
        technician: "Tec. Andrés Caicedo",
        status: "E15",
        createdHoursAgo: 60.0,
        slaHours: 4,
        description: "Se instaló tramo de polietileno de alta densidad (HDPE) de 2 pulgadas solucionando rotura por raíz de árbol.",
        bitacora: [
          { date: "2026-10-26 18:00", user: "Ing. Carlos Méndez (QA)", note: "Inspección conforme. Presión constante de 42 PSI verificada. Cierre formal." }
        ]
      },
      // 22. E15: Cerrada & Conforme
      {
        id: "TKT-2026-000140",
        title: "Actualización de firmware y parches de seguridad en switches",
        category: "Redes",
        severity: "MEDIA",
        sede: "Sede Palmira",
        bloque: "Centro de Cómputo",
        piso: "Piso 1",
        aula: "Racks Telecomunicaciones",
        reporter: "Ing. Redes Zonal",
        technician: "Ing. Diana Rivas",
        status: "E15",
        createdHoursAgo: 72.0,
        slaHours: 48,
        description: "16 conmutadores de acceso actualizados a release institucional LTS. Cero incidencias reportadas en 48 horas.",
        bitacora: [
          { date: "2026-10-26 12:00", user: "Auditoría TI", note: "Vulnerabilidades CVE mitigadas al 100%. Cierre conforme." }
        ]
      },
      // 23. E15: Cerrada & Conforme
      {
        id: "TKT-2026-000141",
        title: "Reemplazo de contactor trifásico de bomba de agua de pozo",
        category: "Eléctrica",
        severity: "ALTA",
        sede: "Sede Yumbo",
        bloque: "Pabellón Tecnológico",
        piso: "Piso 1",
        aula: "Tablero Potencia Norte",
        reporter: "Mantenimiento Planta",
        technician: "Ing. Carlos Méndez",
        status: "E15",
        createdHoursAgo: 85.0,
        slaHours: 12,
        description: "Bomba elevadora operativa en ciclo automático con relé térmico calibrado a 18 Amperios.",
        bitacora: [
          { date: "2026-10-25 15:00", user: "Interventoría", note: "Cierre conforme con acta firmada por el operador de planta." }
        ]
      }
    ];

    // Main Application Controller
    class PraxisApp {
      constructor() {
        this.storageKey = 'PRAXIS_TICKETS_DB_v4';
        this.themeKey = 'PRAXIS_THEME_PREF';
        this.columnsKey = 'PRAXIS_COLUMNS_VIS_v2';
        this.columnWidthsKey = 'PRAXIS_COLUMNS_WIDTH_v2';
        this.roleKey = 'PRAXIS_CURRENT_ROLE';
        this.contextViewKey = 'PRAXIS_CONTEXT_VIEW';

        this.viewMode = 'kanban'; // 'kanban' or 'table'
        this.contextView = localStorage.getItem(this.contextViewKey) || 'workspace'; // 'workspace' or 'global'
        this.activeFilter = 'ALL';
        this.searchQuery = '';
        this.selectedTicket = null;
        this.activeActionTicketId = null;
        this.draggedTicketId = null;

        // Sub-navigation inside workspaces
        this.r01SubTab = 'myTickets'; // 'myTickets' or 'newTicket'
        this.r01Filter = 'ALL';
        this.uploadedPhotoDataUrl = null;
        this.r06ChecklistState = {}; // ticketId -> { p1: bool, p2: bool, p3: bool, p4: bool }

        this.currentRole = localStorage.getItem(this.roleKey) || 'R03';
        this.rolesDef = [
          { code: 'R01', name: 'Reportante / Comunidad Universitaria', shortName: 'Reportante', user: 'Prof. Laura Gómez', email: 'lgomez@univalle.edu.co', desc: 'Registro 4L, detección de duplicados, respuesta a aclaraciones y confirmación de cierre', badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' },
          { code: 'R02', name: 'Gestor de Incidencias / Mesa de Triaje', shortName: 'Triaje', user: 'Analista Marcela Peña', email: 'mpena@univalle.edu.co', desc: 'Validación de procedencia (RN-001..RN-010), desestimación, aclaraciones y matriz ITIL', badgeClass: 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300' },
          { code: 'R03', name: 'Coordinador de Infraestructura y Mantenimiento', shortName: 'Coordinador', user: 'Ing. Daniel Gómez', email: 'dgomez@univalle.edu.co', desc: 'Despacho técnico, balance de cuadrillas con WIP limits (RN-024) y requisiciones presupuestales', badgeClass: 'bg-blue-100 text-brand-royalBlue dark:bg-blue-950/60 dark:text-blue-300' },
          { code: 'R04', name: 'Técnico de Mantenimiento / Campo', shortName: 'Técnico Campo', user: 'Ing. Carlos Méndez', email: 'cmendez@univalle.edu.co', desc: 'Inspección física, bitácora de campo (horas, insumos, causa raíz) y solicitud de calidad', badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' },
          { code: 'R05', name: 'Responsable de Autorizaciones Financieras', shortName: 'Autorizaciones', user: 'Dra. Patricia Holguín', email: 'pholguin@univalle.edu.co', desc: 'Evaluación y aprobación de requisiciones de compras extraordinarias e insumos especiales', badgeClass: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300' },
          { code: 'R06', name: 'Verificador de Calidad e Interventoría', shortName: 'Interventoría', user: 'Arq. Fernando Riascos', email: 'friascos@univalle.edu.co', desc: 'Auditoría en sitio con checklist de 4 puntos, actas de conformidad o no conformidad (E13)', badgeClass: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300' },
          { code: 'R07', name: 'Administrador de Plataforma y Gobernanza', shortName: 'Admin TI', user: 'Ing. TI Alejandro Botero', email: 'abotero@univalle.edu.co', desc: 'Topología 4L de sedes, tipologías técnicas, parámetros de SLA y reglas de negocio RN-001..RN-042', badgeClass: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300' }
        ];

        // Column Definitions for Table View
        this.columnsDef = [
          { key: 'id', label: 'Radicado (#TKT)', minWidth: 120, defaultWidth: 140 },
          { key: 'title', label: 'Asunto / Falla', minWidth: 180, defaultWidth: 260 },
          { key: 'location', label: 'Ubicación 4L', minWidth: 180, defaultWidth: 270 },
          { key: 'category', label: 'Categoría', minWidth: 100, defaultWidth: 130 },
          { key: 'severity', label: 'Severidad', minWidth: 90, defaultWidth: 110 },
          { key: 'technician', label: 'Técnico Asignado', minWidth: 120, defaultWidth: 160 },
          { key: 'sla', label: 'SLA Restante', minWidth: 120, defaultWidth: 150 },
          { key: 'status', label: 'Estado Ciclo', minWidth: 120, defaultWidth: 140 },
          { key: 'actions', label: 'Acción', minWidth: 80, defaultWidth: 90, align: 'right' }
        ];

        this.loadColumnsConfig();
        this.init();
      }

      init() {
        this.loadTheme();
        this.loadTickets();
        this.updateRoleUI();
        this.updateContextViewUI();
        this.setupKeyboardShortcuts();
        this.render();
      }

      // ==================== CONTEXT VIEW (ESPACIO DE ROL VS CONSOLA GLOBAL) ====================
      toggleContextView() {
        this.contextView = this.contextView === 'workspace' ? 'global' : 'workspace';
        localStorage.setItem(this.contextViewKey, this.contextView);
        this.updateContextViewUI();
      }

      switchContextView(mode) {
        this.contextView = mode;
        localStorage.setItem(this.contextViewKey, mode);
        this.updateContextViewUI();
      }

      updateContextViewUI() {
        const globalCont = document.getElementById('globalConsoleContainer');
        const workspaceCont = document.getElementById('roleWorkspaceContainer');
        const btnText = document.getElementById('btnToggleContextText');
        const headerSwitcher = document.getElementById('headerViewSwitcher');
        const role = this.rolesDef.find(r => r.code === this.currentRole) || this.rolesDef[2];

        if (this.contextView === 'workspace') {
          if (globalCont) globalCont.classList.add('hidden');
          if (workspaceCont) workspaceCont.classList.remove('hidden');
          if (btnText) btnText.innerText = 'Consola Global OPS';
          if (headerSwitcher) headerSwitcher.classList.add('hidden');
          this.renderRoleWorkspace();
        } else {
          if (workspaceCont) workspaceCont.classList.add('hidden');
          if (globalCont) globalCont.classList.remove('hidden');
          if (btnText) btnText.innerText = `Espacio ${role.code}`;
          if (headerSwitcher) headerSwitcher.classList.remove('hidden');
          this.render();
        }
      }

      // ==================== COLUMN PICKER & RESIZE STATE ====================
      loadColumnsConfig() {
        const vis = localStorage.getItem(this.columnsKey);
        this.columnVisibility = vis ? JSON.parse(vis) : {};
        this.columnsDef.forEach(col => {
          if (this.columnVisibility[col.key] === undefined) {
            this.columnVisibility[col.key] = true;
          }
        });

        const widths = localStorage.getItem(this.columnWidthsKey);
        this.columnWidths = widths ? JSON.parse(widths) : {};
        this.columnsDef.forEach(col => {
          if (!this.columnWidths[col.key]) {
            this.columnWidths[col.key] = col.defaultWidth;
          }
        });
      }

      saveColumnsConfig() {
        localStorage.setItem(this.columnsKey, JSON.stringify(this.columnVisibility));
        localStorage.setItem(this.columnWidthsKey, JSON.stringify(this.columnWidths));
      }

      toggleColumn(key) {
        this.columnVisibility[key] = !this.columnVisibility[key];
        const visibleCount = Object.values(this.columnVisibility).filter(Boolean).length;
        if (visibleCount === 0) {
          this.columnVisibility[key] = true;
          this.showToast('Debe permanecer visible al menos una columna', 'warning');
          return;
        }
        this.saveColumnsConfig();
        this.renderColumnPicker();
        this.renderBoard();
      }

      resetColumnVisibility() {
        this.columnsDef.forEach(col => {
          this.columnVisibility[col.key] = true;
        });
        this.saveColumnsConfig();
        this.renderColumnPicker();
        this.renderBoard();
        this.showToast('Visibilidad de columnas restablecida', 'info');
      }

      resetColumnWidths() {
        this.columnsDef.forEach(col => {
          this.columnWidths[col.key] = col.defaultWidth;
        });
        this.saveColumnsConfig();
        this.renderBoard();
        this.showToast('Anchos de columnas restablecidos', 'info');
      }

      toggleColumnPicker(e) {
        if (e) e.stopPropagation();
        const menu = document.getElementById('columnPickerMenu');
        if (menu) {
          const isHidden = menu.classList.contains('hidden');
          if (isHidden) {
            this.renderColumnPicker();
            menu.classList.remove('hidden');
          } else {
            menu.classList.add('hidden');
          }
        }
      }

      renderColumnPicker() {
        const container = document.getElementById('columnCheckboxesList');
        if (!container) return;
        container.innerHTML = '';

        this.columnsDef.forEach(col => {
          const isChecked = this.columnVisibility[col.key] !== false;
          const label = document.createElement('label');
          label.className = 'flex items-center space-x-2 px-1.5 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-slate-700 dark:text-slate-200 transition select-none';
          label.innerHTML = `
            <input type="checkbox" ${isChecked ? 'checked' : ''} onchange="app.toggleColumn('${col.key}')" class="rounded text-brand-royalBlue focus:ring-brand-royalBlue h-3.5 w-3.5">
            <span class="text-xs font-medium">${col.label}</span>
          `;
          container.appendChild(label);
        });
      }

      initResize(e, colKey) {
        e.preventDefault();
        e.stopPropagation();

        const th = e.currentTarget.parentElement;
        const startX = e.pageX;
        const startWidth = th.offsetWidth;
        const colDef = this.columnsDef.find(c => c.key === colKey) || { minWidth: 80 };
        const resizer = e.currentTarget;
        resizer.classList.add('resizing');
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';

        const onMouseMove = (moveEvent) => {
          const diff = moveEvent.pageX - startX;
          const newWidth = Math.max(colDef.minWidth, startWidth + diff);
          th.style.width = `${newWidth}px`;
          this.columnWidths[colKey] = newWidth;
        };

        const onMouseUp = () => {
          resizer.classList.remove('resizing');
          document.body.style.cursor = '';
          document.body.style.userSelect = '';
          window.removeEventListener('mousemove', onMouseMove);
          window.removeEventListener('mouseup', onMouseUp);
          this.saveColumnsConfig();
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
      }

      // ==================== STORAGE ENGINE ====================
      loadTickets() {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
          try {
            this.tickets = JSON.parse(stored);
          } catch (e) {
            console.error("Error parseando tickets de localStorage, restaurando mock.", e);
            this.tickets = [...INITIAL_TICKETS];
            this.saveTickets();
          }
        } else {
          this.tickets = [...INITIAL_TICKETS];
          this.saveTickets();
        }
      }

      saveTickets() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.tickets));
      }

      resetStorageToDefault() {
        this.tickets = JSON.parse(JSON.stringify(INITIAL_TICKETS));
        this.saveTickets();
        this.render();
        if (this.contextView === 'workspace') {
          this.renderRoleWorkspace();
        }
        this.showToast('Base de datos restablecida a 23 órdenes de prueba', 'info');
      }

      // ==================== THEME MANAGEMENT ====================
      loadTheme() {
        const pref = localStorage.getItem(this.themeKey) || 'light';
        if (pref === 'dark') {
          document.documentElement.classList.add('dark');
          document.getElementById('sunIcon').classList.remove('hidden');
          document.getElementById('moonIcon').classList.add('hidden');
        } else {
          document.documentElement.classList.remove('dark');
          document.getElementById('sunIcon').classList.add('hidden');
          document.getElementById('moonIcon').classList.remove('hidden');
        }
      }

      toggleTheme() {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem(this.themeKey, isDark ? 'dark' : 'light');
        document.getElementById('sunIcon').classList.toggle('hidden', !isDark);
        document.getElementById('moonIcon').classList.toggle('hidden', isDark);
      }

      // ==================== VIEW MODES (KANBAN VS TABLE) ====================
      setViewMode(mode) {
        this.viewMode = mode;
        const kanbanCont = document.getElementById('kanbanViewContainer');
        const tableCont = document.getElementById('tableViewContainer');
        const btnK = document.getElementById('viewBtnKanban');
        const btnT = document.getElementById('viewBtnTable');

        if (mode === 'kanban') {
          kanbanCont.classList.remove('hidden');
          tableCont.classList.add('hidden');
          btnK.className = 'flex items-center space-x-1.5 px-3 py-1 rounded-md transition shadow-xs bg-white dark:bg-brand-navy text-brand-navy dark:text-white font-semibold';
          btnT.className = 'flex items-center space-x-1.5 px-3 py-1 rounded-md transition text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white font-semibold';
        } else {
          kanbanCont.classList.add('hidden');
          tableCont.classList.remove('hidden');
          tableCont.classList.add('flex');
          btnT.className = 'flex items-center space-x-1.5 px-3 py-1 rounded-md transition shadow-xs bg-white dark:bg-brand-navy text-brand-navy dark:text-white font-semibold';
          btnK.className = 'flex items-center space-x-1.5 px-3 py-1 rounded-md transition text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white font-semibold';
        }
        this.render();
      }

      // ==================== KEYBOARD ACCELERATORS ====================
      setupKeyboardShortcuts() {
        window.addEventListener('keydown', (e) => {
          if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            this.openOmniboxModal();
          }
          if (e.key === 'Escape') {
            this.closeAllModals();
          }
          if (e.key.toLowerCase() === 'n' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
            e.preventDefault();
            this.openNewIncidentModal();
          }
        });

        window.addEventListener('click', (e) => {
          const menu = document.getElementById('columnPickerMenu');
          const btn = document.getElementById('btnColumnPicker');
          if (menu && !menu.classList.contains('hidden')) {
            if (!menu.contains(e.target) && !btn.contains(e.target)) {
              menu.classList.add('hidden');
            }
          }

          const profileMenu = document.getElementById('profileDropdownMenu');
          const profileBtn = document.getElementById('btnProfileMenu');
          if (profileMenu && !profileMenu.classList.contains('hidden')) {
            if (!profileMenu.contains(e.target) && !profileBtn.contains(e.target)) {
              profileMenu.classList.add('hidden');
            }
          }
        });
      }

      // ==================== PROFILE & ROLE MANAGEMENT ====================
      toggleProfileMenu(e) {
        if (e) e.stopPropagation();
        const menu = document.getElementById('profileDropdownMenu');
        if (menu) {
          menu.classList.toggle('hidden');
          if (!menu.classList.contains('hidden')) {
            this.renderRolesList();
          }
        }
      }

      closeProfileMenu() {
        const menu = document.getElementById('profileDropdownMenu');
        if (menu) menu.classList.add('hidden');
      }

      renderRolesList() {
        const cont = document.getElementById('rolesListContainer');
        if (!cont) return;
        cont.innerHTML = '';
        this.rolesDef.forEach(role => {
          const isActive = this.currentRole === role.code;
          const btn = document.createElement('button');
          btn.className = `w-full text-left p-2 rounded-lg border transition text-xs flex items-center justify-between cursor-pointer ${
            isActive 
              ? 'bg-blue-50 dark:bg-blue-950/40 border-brand-royalBlue text-slate-900 dark:text-white shadow-xs' 
              : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
          }`;
          btn.onclick = () => this.selectRole(role.code);
          btn.innerHTML = `
            <div class="flex items-center space-x-2 min-w-0">
              <span class="font-mono font-bold text-[10px] px-1.5 py-0.5 rounded ${role.badgeClass}">${role.code}</span>
              <div class="truncate">
                <p class="font-semibold text-xs leading-tight truncate">${role.name}</p>
                <p class="text-[10px] text-slate-400 truncate">${role.desc}</p>
              </div>
            </div>
            ${isActive ? '<svg class="w-4 h-4 text-brand-royalBlue dark:text-sky-400 shrink-0 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>' : ''}
          `;
          cont.appendChild(btn);
        });
      }

      selectRole(roleCode) {
        this.currentRole = roleCode;
        localStorage.setItem(this.roleKey, roleCode);
        this.updateRoleUI();
        this.updateContextViewUI();
        this.closeProfileMenu();
        const role = this.rolesDef.find(r => r.code === roleCode);
        this.showToast(`Rol activo: ${role ? role.code + ' - ' + role.shortName : roleCode}`, 'info');
      }

      resetRoleToDefault() {
        this.selectRole('R03');
      }

      updateRoleUI() {
        const role = this.rolesDef.find(r => r.code === this.currentRole) || this.rolesDef[2];
        
        // Header profile
        const navBadge = document.getElementById('navRoleBadge');
        if (navBadge) navBadge.innerText = `${role.shortName} · ${role.code}`;
        const navUserName = document.getElementById('navUserName');
        if (navUserName) navUserName.innerText = role.user;
        const navAvatar = document.getElementById('navAvatarInitials');
        if (navAvatar) {
          const initials = role.user.split(' ').slice(0, 2).map(w => w[0]).join('');
          navAvatar.innerText = initials;
        }

        // Dropdown profile
        const dropAvatar = document.getElementById('profileDropdownAvatar');
        if (dropAvatar) {
          const initials = role.user.split(' ').slice(0, 2).map(w => w[0]).join('');
          dropAvatar.innerText = initials;
        }
        const dropName = document.getElementById('profileDropdownName');
        if (dropName) dropName.innerText = role.user;
        const dropEmail = document.getElementById('profileDropdownEmail');
        if (dropEmail) dropEmail.innerText = role.email;
        const profileActiveRoleTag = document.getElementById('profileActiveRoleTag');
        if (profileActiveRoleTag) profileActiveRoleTag.innerText = `${role.code} · ${role.name}`;
      }

      // ==================== SLA CALCULATION ====================
      getSlaStatus(ticket) {
        const remainingHours = ticket.slaHours - ticket.createdHoursAgo;
        const isClosed = ['E15', 'E16', 'E17'].includes(ticket.status);

        if (isClosed) {
          return {
            status: 'CLOSED',
            label: 'Concluida',
            text: 'Completado',
            cleanText: 'Completado',
            badgeClass: 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300 font-semibold',
            barPercent: 100,
            barColor: 'bg-emerald-500'
          };
        }

        if (remainingHours <= 0) {
          const overdueHours = Math.abs(remainingHours).toFixed(1);
          return {
            status: 'BREACHED',
            label: 'Vencido',
            text: `Vencido (-${overdueHours}h)`,
            cleanText: `Vencido (-${overdueHours}h)`,
            badgeClass: 'text-red-700 bg-red-50 dark:bg-red-950/50 dark:text-red-300 font-bold',
            barPercent: 100,
            barColor: 'bg-red-600'
          };
        } else if (remainingHours <= 2) {
          const mins = Math.round(remainingHours * 60);
          return {
            status: 'CRITICAL',
            label: 'Riesgo Inminente',
            text: `Restan ${mins}m`,
            cleanText: `Restan ${mins}m`,
            badgeClass: 'text-amber-700 bg-amber-50 dark:bg-amber-950/50 dark:text-amber-300 font-bold',
            barPercent: Math.round(((ticket.slaHours - remainingHours) / ticket.slaHours) * 100),
            barColor: 'bg-amber-500'
          };
        } else {
          const h = remainingHours.toFixed(1);
          return {
            status: 'HEALTHY',
            label: 'En Plazo',
            text: `Restan ${h}h`,
            cleanText: `Restan ${h}h`,
            badgeClass: 'text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-300 font-medium',
            barPercent: Math.round(((ticket.slaHours - remainingHours) / ticket.slaHours) * 100),
            barColor: 'bg-brand-royalBlue'
          };
        }
      }

      // ==================== FILTERING & SEARCH ====================
      setQuickFilter(filter) {
        this.activeFilter = filter;
        document.querySelectorAll('.quick-chip').forEach(el => {
          el.className = 'quick-chip px-2.5 py-1 rounded-full font-medium transition bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700';
        });
        const activeBtn = document.getElementById(`chip-${filter}`);
        if (activeBtn) {
          activeBtn.className = 'quick-chip px-2.5 py-1 rounded-full font-medium transition bg-brand-navy dark:bg-brand-royalBlue text-white shadow-xs';
        }
        this.render();
      }

      onSearchInput(query) {
        this.searchQuery = query.toLowerCase().trim();
        this.render();
      }

      resetFilters() {
        this.activeFilter = 'ALL';
        this.searchQuery = '';
        if (document.getElementById('searchInput')) document.getElementById('searchInput').value = '';
        if (document.getElementById('filterSede')) document.getElementById('filterSede').value = 'ALL';
        if (document.getElementById('filterCategory')) document.getElementById('filterCategory').value = 'ALL';
        this.setQuickFilter('ALL');
      }

      getFilteredTickets() {
        const sedeFilter = document.getElementById('filterSede')?.value || 'ALL';
        const catFilter = document.getElementById('filterCategory')?.value || 'ALL';

        return this.tickets.filter(t => {
          if (['E16', 'E17'].includes(t.status) && this.activeFilter !== 'DISMISSED') {
            return false;
          }
          if (sedeFilter !== 'ALL' && t.sede !== sedeFilter) return false;
          if (catFilter !== 'ALL' && t.category !== catFilter) return false;

          if (this.activeFilter === 'CRITICAL' && t.severity !== 'CRITICA') return false;
          if (this.activeFilter === 'HIGH' && t.severity !== 'ALTA') return false;
          if (this.activeFilter === 'UNASSIGNED' && t.technician !== '') return false;
          if (this.activeFilter === 'SLA_RISK') {
            const sla = this.getSlaStatus(t);
            if (sla.status !== 'BREACHED' && sla.status !== 'CRITICAL') return false;
          }

          if (this.searchQuery) {
            const corpus = `${t.id} ${t.title} ${t.sede} ${t.bloque} ${t.aula} ${t.category} ${t.technician} ${t.reporter} ${t.description}`.toLowerCase();
            if (!corpus.includes(this.searchQuery)) return false;
          }

          return true;
        });
      }

      // ==================== RENDERING & METRICS ====================
      render() {
        this.renderMetrics();
        this.renderBoard();
      }

      renderMetrics() {
        const activeTickets = this.tickets.filter(t => !['E15', 'E16', 'E17'].includes(t.status));
        const triageCount = this.tickets.filter(t => ['E01', 'E02', 'E03', 'E04', 'E01_E03'].includes(t.status)).length;
        const execCount = this.tickets.filter(t => t.status === 'E11').length;
        
        let slaBreached = 0;
        let slaNearRisk = 0;
        activeTickets.forEach(t => {
          const s = this.getSlaStatus(t);
          if (s.status === 'BREACHED') slaBreached++;
          if (s.status === 'CRITICAL') slaNearRisk++;
        });

        const compliantCount = activeTickets.length - slaBreached;
        const slaPercentage = activeTickets.length > 0 ? ((compliantCount / activeTickets.length) * 100).toFixed(1) : 100;

        if (document.getElementById('kpiActiveCount')) document.getElementById('kpiActiveCount').innerText = activeTickets.length;
        if (document.getElementById('kpiTriageCount')) document.getElementById('kpiTriageCount').innerText = triageCount;
        if (document.getElementById('kpiExecutionCount')) document.getElementById('kpiExecutionCount').innerText = execCount;
        if (document.getElementById('kpiSlaPercentage')) document.getElementById('kpiSlaPercentage').innerText = `${slaPercentage}%`;
        if (document.getElementById('kpiSlaBreachedCount')) {
          document.getElementById('kpiSlaBreachedCount').innerText = slaBreached > 0 ? `${slaBreached} vencidos` : (slaNearRisk > 0 ? `${slaNearRisk} en riesgo` : 'Todo en plazo');
        }

        if (document.getElementById('count-all')) document.getElementById('count-all').innerText = this.tickets.filter(t => !['E16', 'E17'].includes(t.status)).length;
        if (document.getElementById('count-critical')) document.getElementById('count-critical').innerText = this.tickets.filter(t => t.severity === 'CRITICA' && !['E15', 'E16', 'E17'].includes(t.status)).length;
        if (document.getElementById('count-high')) document.getElementById('count-high').innerText = this.tickets.filter(t => t.severity === 'ALTA' && !['E15', 'E16', 'E17'].includes(t.status)).length;
        if (document.getElementById('count-unassigned')) document.getElementById('count-unassigned').innerText = this.tickets.filter(t => t.technician === '' && !['E15', 'E16', 'E17'].includes(t.status)).length;
        if (document.getElementById('count-sla-risk')) document.getElementById('count-sla-risk').innerText = slaBreached + slaNearRisk;
      }

      renderBoard() {
        const filtered = this.getFilteredTickets();

        if (this.viewMode === 'kanban') {
          // 6 Canonical Kanban Columns mapping the 18 states
          const colMapping = {
            'E01_E03': ['E01', 'E02', 'E03', 'E04', 'E01_E03'],
            'E05': ['E05', 'E06', 'E07'],
            'E10': ['E08', 'E09', 'E10'],
            'E11': ['E11', 'E13'],
            'E12': ['E12', 'E14'],
            'E15': ['E15']
          };

          Object.keys(colMapping).forEach(colKey => {
            const colCardsContainer = document.getElementById(`cards-${colKey}`);
            const colCountBadge = document.getElementById(`colCount-${colKey}`);
            if (!colCardsContainer || !colCountBadge) return;

            const allowedStatuses = colMapping[colKey];
            const colTickets = filtered.filter(t => allowedStatuses.includes(t.status));
            
            colCountBadge.innerText = colTickets.length;
            colCardsContainer.innerHTML = '';

            if (colTickets.length === 0) {
              colCardsContainer.innerHTML = `
                <div class="h-28 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 text-xs text-center p-3 select-none">
                  <svg class="w-6 h-6 mb-1 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/></svg>
                  <span>Sin órdenes en este estado</span>
                </div>
              `;
            } else {
              colTickets.forEach(t => {
                colCardsContainer.appendChild(this.createCardElement(t));
              });
            }
          });
        } else {
          this.renderTable(filtered);
        }
      }

      renderTable(filtered) {
        const thead = document.getElementById('ticketsTableHead');
        const tbody = document.getElementById('ticketsTableBody');
        const countBadge = document.getElementById('tableResultsCount');
        const badgeTotal = document.getElementById('tableBadgeCount');

        if (countBadge) countBadge.innerText = filtered.length;
        if (badgeTotal) badgeTotal.innerText = `${filtered.length} órdenes`;
        if (!thead || !tbody) return;

        const visibleCols = this.columnsDef.filter(col => this.columnVisibility[col.key] !== false);
        
        thead.innerHTML = '';
        const trHead = document.createElement('tr');

        visibleCols.forEach(col => {
          const th = document.createElement('th');
          const width = this.columnWidths[col.key] || col.defaultWidth;
          th.style.width = `${width}px`;
          th.style.minWidth = `${col.minWidth}px`;
          th.className = `py-3 px-3 relative font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider select-none ${col.align === 'right' ? 'text-right' : 'text-left'}`;
          
          th.innerHTML = `
            <span class="truncate block pr-2">${col.label}</span>
            <div class="col-resizer" onmousedown="app.initResize(event, '${col.key}')" title="Arrastra para ajustar ancho de columna"></div>
          `;
          trHead.appendChild(th);
        });
        thead.appendChild(trHead);

        tbody.innerHTML = '';

        if (filtered.length === 0) {
          const trEmpty = document.createElement('tr');
          trEmpty.innerHTML = `
            <td colspan="${visibleCols.length}" class="py-12 text-center text-slate-400 dark:text-slate-500 text-xs italic">
              No se encontraron incidencias que coincidan con los filtros aplicados.
            </td>
          `;
          tbody.appendChild(trEmpty);
          return;
        }

        filtered.forEach(t => {
          const sla = this.getSlaStatus(t);
          const severityDot = this.getSeverityBadge(t.severity);
          const statusLabel = this.getStatusName(t.status);

          const tr = document.createElement('tr');
          tr.className = 'hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition';
          tr.onclick = () => this.openDetailModal(t.id);

          let rowHtml = '';

          visibleCols.forEach(col => {
            switch (col.key) {
              case 'id':
                rowHtml += `<td class="py-3 px-3 font-mono font-bold text-brand-royalBlue whitespace-nowrap">${t.id}</td>`;
                break;
              case 'title':
                rowHtml += `<td class="py-3 px-3 font-semibold text-slate-800 dark:text-slate-100 truncate" title="${t.title}">${t.title}</td>`;
                break;
              case 'location':
                rowHtml += `<td class="py-3 px-3 text-slate-600 dark:text-slate-300 font-mono text-[11px] truncate" title="${t.sede} > ${t.bloque} > ${t.aula}">${t.sede.replace('Campus ', '')} > ${t.bloque.split(' ')[0]} > ${t.aula}</td>`;
                break;
              case 'category':
                rowHtml += `<td class="py-3 px-3 whitespace-nowrap"><span class="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">${t.category}</span></td>`;
                break;
              case 'severity':
                rowHtml += `<td class="py-3 px-3 whitespace-nowrap">${severityDot}</td>`;
                break;
              case 'technician':
                rowHtml += `<td class="py-3 px-3 whitespace-nowrap text-slate-700 dark:text-slate-300 truncate">${t.technician ? t.technician : '<span class="text-amber-500 font-medium">Sin asignar</span>'}</td>`;
                break;
              case 'sla':
                rowHtml += `
                  <td class="py-3 px-3 whitespace-nowrap">
                    <div class="flex flex-col space-y-1 max-w-[130px]">
                      <div class="flex items-center justify-between text-[11px] font-mono leading-none">
                        <span class="px-1.5 py-0.5 rounded font-semibold text-[10px] ${sla.badgeClass}">
                          ${sla.cleanText}
                        </span>
                        <span class="text-[9px] text-slate-400 font-mono hidden sm:inline">${sla.barPercent}%</span>
                      </div>
                      <div class="w-full bg-slate-200 dark:bg-slate-700/80 rounded-full h-1 overflow-hidden">
                        <div class="${sla.barColor} h-1 rounded-full transition-all duration-300" style="width: ${sla.barPercent}%"></div>
                      </div>
                    </div>
                  </td>`;
                break;
              case 'status':
                rowHtml += `<td class="py-3 px-3 whitespace-nowrap"><span class="text-[11px] font-semibold text-slate-600 dark:text-slate-300">${statusLabel}</span></td>`;
                break;
              case 'actions':
                rowHtml += `
                  <td class="py-3 px-3 text-right whitespace-nowrap">
                    <button onclick="event.stopPropagation(); app.openDetailModal('${t.id}')" class="text-xs text-brand-royalBlue hover:underline font-semibold">Gestionar</button>
                  </td>`;
                break;
            }
          });

          tr.innerHTML = rowHtml;
          tbody.appendChild(tr);
        });
      }

      createCardElement(ticket) {
        const card = document.createElement('div');
        const sla = this.getSlaStatus(ticket);
        const severityBadge = this.getSeverityBadge(ticket.severity);
        const categoryColor = this.getCategoryBadgeColor(ticket.category);

        card.draggable = true;
        card.id = `ticket-card-${ticket.id}`;
        card.className = 'bg-white dark:bg-brand-navy rounded-lg p-3 border border-brand-borderSubtle dark:border-brand-borderDark shadow-elevation-1 hover:shadow-elevation-2 cursor-grab active:cursor-grabbing transition-all transform hover:-translate-y-0.5 group';
        
        card.ondragstart = (e) => this.onDragStart(e, ticket.id);
        card.ondragend = (e) => this.onDragEnd(e);
        card.onclick = () => this.openDetailModal(ticket.id);

        const techInitials = ticket.technician ? ticket.technician.split(' ').slice(1, 3).map(w => w[0]).join('') : '?';
        const techClass = ticket.technician ? 'bg-brand-royalBlue text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500';

        card.innerHTML = `
          <div class="flex items-center justify-between mb-1.5">
            <span class="font-mono font-bold text-xs text-brand-royalBlue dark:text-sky-400 group-hover:underline">${ticket.id}</span>
            <span class="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${categoryColor}">
              ${ticket.category}
            </span>
          </div>

          <h4 class="font-display font-bold text-xs text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug mb-1.5 group-hover:text-brand-royalBlue transition-colors">
            ${ticket.title}
          </h4>

          <div class="flex items-center space-x-1 text-[11px] font-mono text-slate-500 dark:text-slate-400 mb-2 truncate" title="${ticket.sede} > ${ticket.bloque} > ${ticket.aula}">
            <svg class="w-3.5 h-3.5 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            <span class="truncate">${ticket.sede.replace('Campus ', '')} > ${ticket.bloque.split(' ')[0]} > ${ticket.aula}</span>
          </div>

          <div class="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
            <div class="flex items-center space-x-1.5">
              ${severityBadge}
            </div>
            <span class="px-1.5 py-0.5 rounded font-mono text-[10px] ${sla.badgeClass}">
              ${sla.text}
            </span>
          </div>

          <div class="flex items-center justify-between mt-2 pt-1.5 text-[10px] text-slate-400">
            <div class="flex items-center space-x-1.5">
              <span class="w-5 h-5 rounded-full flex items-center justify-center font-bold text-[9px] ${techClass}" title="Técnico: ${ticket.technician || 'Sin asignar'}">
                ${techInitials}
              </span>
              <span class="text-slate-600 dark:text-slate-400 font-medium truncate max-w-[120px]">
                ${ticket.technician ? ticket.technician.replace('Tec. ', '').replace('Ing. ', '') : 'Sin asignar'}
              </span>
            </div>
            <span class="text-slate-400 flex items-center space-x-0.5" title="${ticket.bitacora ? ticket.bitacora.length : 0} notas en bitácora">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
              <span>${ticket.bitacora ? ticket.bitacora.length : 0}</span>
            </span>
          </div>
        `;

        return card;
      }

      getSeverityBadge(sev) {
        switch (sev) {
          case 'CRITICA':
            return '<span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300">Crítica</span>';
          case 'ALTA':
            return '<span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">Alta</span>';
          case 'MEDIA':
            return '<span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-100 text-brand-royalBlue dark:bg-blue-950/60 dark:text-blue-300">Media</span>';
          default:
            return '<span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">Baja</span>';
        }
      }

      getCategoryBadgeColor(cat) {
        switch (cat) {
          case 'Eléctrica':
            return 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300';
          case 'HVAC/Climatización':
            return 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300';
          case 'Hidráulica':
            return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300';
          case 'Redes':
            return 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300';
          default:
            return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300';
        }
      }

      getStatusName(status) {
        const names = {
          'E01': 'E01 · Registrada',
          'E02': 'E02 · Pendiente Info',
          'E03': 'E03 · En Revisión',
          'E04': 'E04 · En Clasificación',
          'E05': 'E05 · Por Asignar',
          'E06': 'E06 · Por Inspeccionar',
          'E07': 'E07 · En Diagnóstico',
          'E08': 'E08 · Por Autorizar',
          'E09': 'E09 · Por Recursos',
          'E10': 'E10 · Programada',
          'E11': 'E11 · En Atención',
          'E12': 'E12 · Por Verificar',
          'E13': 'E13 · En Corrección',
          'E14': 'E14 · Por Confirmar',
          'E15': 'E15 · Cerrada',
          'E16': 'E16 · No Procedente',
          'E17': 'E17 · Cancelada',
          'E18': 'E18 · Suspendida',
          'E01_E03': 'Triaje & Revisión'
        };
        return names[status] || status;
      }

      // ==================== DRAG & DROP PIPELINE HANDLERS ====================
      onDragStart(e, ticketId) {
        this.draggedTicketId = ticketId;
        e.dataTransfer.setData('text/plain', ticketId);
        e.dataTransfer.effectAllowed = 'move';
        setTimeout(() => {
          const card = document.getElementById(`ticket-card-${ticketId}`);
          if (card) card.classList.add('drag-ghost');
        }, 0);
      }

      onDragEnd(e) {
        document.querySelectorAll('.drag-ghost').forEach(el => el.classList.remove('drag-ghost'));
        document.querySelectorAll('.drag-over-col').forEach(el => el.classList.remove('drag-over-col'));
      }

      onDragOverCol(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        const colContainer = e.currentTarget;
        if (!colContainer.classList.contains('drag-over-col')) {
          colContainer.classList.add('drag-over-col');
        }
      }

      onDragLeaveCol(e) {
        e.currentTarget.classList.remove('drag-over-col');
      }

      onDropCol(e, targetCol) {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over-col');
        const ticketId = e.dataTransfer.getData('text/plain') || this.draggedTicketId;

        if (!ticketId) return;

        const ticket = this.tickets.find(t => t.id === ticketId);
        if (!ticket) return;

        // Map column drop zone to target PRAXIS state
        const targetStateMap = {
          'E01_E03': 'E01',
          'E05': 'E05',
          'E10': 'E10',
          'E11': 'E11',
          'E12': 'E12',
          'E15': 'E15'
        };

        const targetStatus = targetStateMap[targetCol] || targetCol;

        if (ticket.status !== targetStatus) {
          const oldStatus = ticket.status;
          ticket.status = targetStatus;

          const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
          ticket.bitacora.unshift({
            date: nowStr,
            user: "Pipeline Drag&Drop",
            note: `Transición de estado de ${this.getStatusName(oldStatus)} a ${this.getStatusName(targetStatus)}.`
          });

          this.saveTickets();
          this.render();
          this.showToast(`Incidencia ${ticket.id} movida a ${this.getStatusName(targetStatus)}`, 'success');
        }
      }

      // ==================== ROLE WORKSPACES DISPATCHER ====================
      renderRoleWorkspace() {
        // Hide all workspaces
        document.querySelectorAll('.role-workspace').forEach(el => el.classList.add('hidden'));

        // Show active workspace
        const activeWs = document.getElementById(`workspace-${this.currentRole}`);
        if (activeWs) {
          activeWs.classList.remove('hidden');
        }

        // Call specific workspace renderer
        switch (this.currentRole) {
          case 'R01':
            this.renderR01Workspace();
            break;
          case 'R02':
            this.renderR02Workspace();
            break;
          case 'R03':
            this.renderR03Workspace();
            break;
          case 'R04':
            this.renderR04Workspace();
            break;
          case 'R05':
            this.renderR05Workspace();
            break;
          case 'R06':
            this.renderR06Workspace();
            break;
          case 'R07':
            this.renderR07Workspace();
            break;
        }
      }

      // ==================== WORKSPACE R01 (REPORTANTE) ====================
      setR01SubTab(tab) {
        this.r01SubTab = tab;
        const btnMy = document.getElementById('r01TabBtnMyTickets');
        const btnNew = document.getElementById('r01TabBtnNew');
        const contMy = document.getElementById('r01ContentMyTickets');
        const contNew = document.getElementById('r01ContentNewTicket');

        if (tab === 'myTickets') {
          contMy.classList.remove('hidden');
          contNew.classList.add('hidden');
          btnMy.className = 'px-3 py-1.5 rounded-md transition bg-white dark:bg-brand-navy text-brand-navy dark:text-white shadow-xs flex items-center space-x-1.5';
          btnNew.className = 'px-3 py-1.5 rounded-md transition text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center space-x-1.5';
          this.renderR01Workspace();
        } else {
          contMy.classList.add('hidden');
          contNew.classList.remove('hidden');
          btnNew.className = 'px-3 py-1.5 rounded-md transition bg-white dark:bg-brand-navy text-brand-navy dark:text-white shadow-xs flex items-center space-x-1.5';
          btnMy.className = 'px-3 py-1.5 rounded-md transition text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center space-x-1.5';
        }
      }

      setR01Filter(filter) {
        this.r01Filter = filter;
        document.querySelectorAll('.r01-filter').forEach(el => {
          el.className = 'r01-filter px-2.5 py-0.5 rounded-full font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300';
        });
        const activeBtn = document.getElementById(`r01Filter-${filter}`);
        if (activeBtn) {
          activeBtn.className = 'r01-filter px-2.5 py-0.5 rounded-full font-medium bg-brand-navy dark:bg-brand-royalBlue text-white';
        }
        this.renderR01Workspace();
      }

      renderR01Workspace() {
        const cont = document.getElementById('r01TicketsList');
        const countBadge = document.getElementById('r01MyTicketsCount');
        if (!cont) return;

        // Current R01 user tickets (or tickets relevant to reporter)
        const myTickets = this.tickets.filter(t => {
          // Reporter Laura Gómez or tickets in clarification / confirmation
          const isReporter = t.reporter.includes('Laura Gómez') || t.status === 'E02' || t.status === 'E14';
          if (!isReporter) return false;

          if (this.r01Filter === 'ACTION_REQUIRED') {
            return t.status === 'E02' || t.status === 'E14';
          }
          if (this.r01Filter === 'IN_PROGRESS') {
            return ['E01', 'E03', 'E05', 'E06', 'E10', 'E11', 'E12'].includes(t.status);
          }
          if (this.r01Filter === 'RESOLVED') {
            return ['E15', 'E16', 'E17'].includes(t.status);
          }
          return true;
        });

        if (countBadge) countBadge.innerText = myTickets.length;
        cont.innerHTML = '';

        if (myTickets.length === 0) {
          cont.innerHTML = `
            <div class="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-400">
              <p class="font-medium">No tienes solicitudes en esta vista.</p>
              <button onclick="app.setR01SubTab('newTicket')" class="mt-2 text-xs text-brand-royalBlue font-semibold hover:underline">+ Radicar una nueva incidencia</button>
            </div>
          `;
          return;
        }

        myTickets.forEach(t => {
          const sla = this.getSlaStatus(t);
          const isActionE02 = t.status === 'E02';
          const isActionE14 = t.status === 'E14';

          const card = document.createElement('div');
          card.className = `p-4 rounded-xl border bg-white dark:bg-brand-navy shadow-xs transition-all ${
            isActionE02 ? 'border-amber-400 dark:border-amber-500/60 ring-2 ring-amber-400/20' : 
            isActionE14 ? 'border-emerald-400 dark:border-emerald-500/60 ring-2 ring-emerald-400/20' : 
            'border-slate-200 dark:border-slate-800'
          }`;

          card.innerHTML = `
            <!-- Top bar: Code, State & Category -->
            <div class="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 text-xs">
              <div class="flex items-center space-x-2">
                <span class="font-mono font-bold text-brand-royalBlue dark:text-sky-400">${t.id}</span>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold ${this.getCategoryBadgeColor(t.category)}">${t.category}</span>
                <span class="font-semibold text-slate-700 dark:text-slate-300">${this.getStatusName(t.status)}</span>
              </div>
              <span class="px-2 py-0.5 rounded font-mono text-[10px] ${sla.badgeClass}">${sla.text}</span>
            </div>

            <!-- Title & Location -->
            <div class="mt-2.5">
              <h4 class="font-display font-bold text-sm text-slate-900 dark:text-white">${t.title}</h4>
              <p class="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                📍 ${t.sede} • ${t.bloque} • ${t.aula}
              </p>
            </div>

            <!-- Description -->
            <p class="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">${t.description}</p>

            <!-- ACTION ALERT BOX FOR E02: Clarification required -->
            ${isActionE02 ? `
              <div class="mt-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span class="font-bold text-xs text-amber-800 dark:text-amber-300 uppercase tracking-wider">⚠️ Solicitud de Aclaración del Gestor:</span>
                  <p class="text-xs text-amber-900 dark:text-amber-200 mt-0.5">${t.clarificationMotive || 'Favor aportar mayores detalles sobre la ubicación exacta o fotografías.'}</p>
                </div>
                <button onclick="app.openR01ClarificationModal('${t.id}')" class="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shrink-0 shadow-xs">
                  💬 Responder Aclaración
                </button>
              </div>
            ` : ''}

            <!-- ACTION ALERT BOX FOR E14: Solution Confirmation -->
            ${isActionE14 ? `
              <div class="mt-3 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span class="font-bold text-xs text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">✅ Trabajo Validado por Interventoría (R06):</span>
                  <p class="text-xs text-emerald-900 dark:text-emerald-200 mt-0.5">Por favor confirma si la reparación resolvió el problema o si persiste la falla.</p>
                </div>
                <div class="flex items-center space-x-2 shrink-0">
                  <button onclick="app.openR01ReopenModal('${t.id}')" class="px-3 py-1.5 rounded-lg border border-red-300 text-red-600 dark:text-red-400 font-semibold text-xs hover:bg-red-50">
                    👎 Persiste Falla
                  </button>
                  <button onclick="app.confirmR01Solution('${t.id}')" class="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs">
                    👍 Confirmar Solución (Cerrar)
                  </button>
                </div>
              </div>
            ` : ''}

            <!-- Footer & Traceability info -->
            <div class="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>Técnico asignado: <strong>${t.technician || 'Pendiente de asignación'}</strong></span>
              <button onclick="app.openDetailModal('${t.id}')" class="text-brand-royalBlue hover:underline font-semibold">Ver Historial & Bitácora (${t.bitacora ? t.bitacora.length : 0})</button>
            </div>
          `;

          cont.appendChild(card);
        });
      }

      // R01 Cascading 4L Localities
      onR01SedeChange() {
        const sede = document.getElementById('r01Sede').value;
        const edSelect = document.getElementById('r01Edificio');
        const pisoSelect = document.getElementById('r01Piso');
        const espSelect = document.getElementById('r01Espacio');

        edSelect.innerHTML = '<option value="">Seleccionar Edificio...</option>';
        pisoSelect.innerHTML = '<option value="">Seleccionar Piso...</option>';
        espSelect.innerHTML = '<option value="">Seleccionar Espacio...</option>';
        pisoSelect.disabled = true;
        espSelect.disabled = true;

        if (sede && UNIVERSITY_HIERARCHY_4L[sede]) {
          edSelect.disabled = false;
          Object.keys(UNIVERSITY_HIERARCHY_4L[sede]).forEach(ed => {
            const opt = document.createElement('option');
            opt.value = ed;
            opt.innerText = ed;
            edSelect.appendChild(opt);
          });
        } else {
          edSelect.disabled = true;
        }
        this.checkDuplicateInWorkspace();
      }

      onR01EdificioChange() {
        const sede = document.getElementById('r01Sede').value;
        const ed = document.getElementById('r01Edificio').value;
        const pisoSelect = document.getElementById('r01Piso');
        const espSelect = document.getElementById('r01Espacio');

        pisoSelect.innerHTML = '<option value="">Seleccionar Piso...</option>';
        espSelect.innerHTML = '<option value="">Seleccionar Espacio...</option>';
        espSelect.disabled = true;

        if (sede && ed && UNIVERSITY_HIERARCHY_4L[sede][ed]) {
          pisoSelect.disabled = false;
          Object.keys(UNIVERSITY_HIERARCHY_4L[sede][ed]).forEach(piso => {
            const opt = document.createElement('option');
            opt.value = piso;
            opt.innerText = piso;
            pisoSelect.appendChild(opt);
          });
        } else {
          pisoSelect.disabled = true;
        }
        this.checkDuplicateInWorkspace();
      }

      onR01PisoChange() {
        const sede = document.getElementById('r01Sede').value;
        const ed = document.getElementById('r01Edificio').value;
        const piso = document.getElementById('r01Piso').value;
        const espSelect = document.getElementById('r01Espacio');

        espSelect.innerHTML = '<option value="">Seleccionar Espacio...</option>';

        if (sede && ed && piso && UNIVERSITY_HIERARCHY_4L[sede][ed][piso]) {
          espSelect.disabled = false;
          UNIVERSITY_HIERARCHY_4L[sede][ed][piso].forEach(esp => {
            const opt = document.createElement('option');
            opt.value = esp;
            opt.innerText = esp;
            espSelect.appendChild(opt);
          });
        } else {
          espSelect.disabled = true;
        }
        this.checkDuplicateInWorkspace();
      }

      onR01EspacioChange() {
        this.checkDuplicateInWorkspace();
      }

      // R01 Real-Time Duplicate Detection (RN-011)
      checkDuplicateInWorkspace() {
        const sede = document.getElementById('r01Sede')?.value;
        const ed = document.getElementById('r01Edificio')?.value;
        const esp = document.getElementById('r01Espacio')?.value;
        const alertBox = document.getElementById('r01DuplicateDetectorAlert');
        const alertText = document.getElementById('r01DuplicateDetectorText');

        if (!alertBox || !alertText) return;

        if (sede && ed && esp) {
          const match = this.tickets.find(t => 
            !['E15', 'E16', 'E17'].includes(t.status) &&
            t.sede === sede &&
            t.bloque === ed &&
            t.aula === esp
          );

          if (match) {
            alertText.innerHTML = `Ya existe la orden activa <strong class="font-mono text-amber-800 dark:text-amber-200">#${match.id}</strong> ("${match.title}", en estado <strong>${this.getStatusName(match.status)}</strong>) en este mismo espacio. Si tu hallazgo corresponde a la misma avería, el sistema lo asociará como testigo para evitar duplicar cuadrillas.`;
            alertBox.classList.remove('hidden');
            return;
          }
        }
        alertBox.classList.add('hidden');
      }

      // R01 Description Counter (20-500 characters)
      onR01DescriptionInput(text) {
        const counter = document.getElementById('r01DescCounter');
        const valText = document.getElementById('r01DescValidation');
        const submitBtn = document.getElementById('r01SubmitBtn');
        const len = text.length;

        if (counter) counter.innerText = `${len} / 500 caracteres`;

        if (len < 20) {
          if (counter) counter.className = 'font-mono text-[11px] text-red-500 font-semibold';
          if (valText) {
            valText.innerText = `Faltan ${20 - len} caracteres para el mínimo requerido por norma (RN-002).`;
            valText.className = 'text-[11px] text-red-500 mt-0.5';
          }
          if (submitBtn) submitBtn.disabled = true;
        } else if (len <= 500) {
          if (counter) counter.className = 'font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold';
          if (valText) {
            valText.innerText = '✓ Longitud descriptiva óptima según estándar PRAXIS.';
            valText.className = 'text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5';
          }
          if (submitBtn) submitBtn.disabled = false;
        } else {
          if (counter) counter.className = 'font-mono text-[11px] text-red-600 font-bold';
          if (valText) {
            valText.innerText = `Límite excedido por ${len - 500} caracteres.`;
            valText.className = 'text-[11px] text-red-600 mt-0.5 font-bold';
          }
          if (submitBtn) submitBtn.disabled = true;
        }
      }

      // R01 Canvas Photo Compression
      handleR01PhotoUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const originalSizeKb = Math.round(file.size / 1024);
        const reader = new FileReader();

        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const maxDim = 800;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > maxDim) {
                height = Math.round((height * maxDim) / width);
                width = maxDim;
              }
            } else {
              if (height > maxDim) {
                width = Math.round((width * maxDim) / height);
                height = maxDim;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.72);
            const compressedSizeKb = Math.round((compressedDataUrl.length * 3 / 4) / 1024);
            const savings = Math.max(0, Math.round(((originalSizeKb - compressedSizeKb) / originalSizeKb) * 100));

            this.uploadedPhotoDataUrl = compressedDataUrl;

            const previewCont = document.getElementById('r01PhotoPreviewCont');
            if (previewCont) {
              previewCont.innerHTML = `
                <div class="relative inline-block mt-2">
                  <img src="${compressedDataUrl}" class="w-24 h-24 object-cover rounded-lg border border-slate-200 dark:border-slate-700 shadow-xs" />
                  <span class="absolute -top-2 -right-2 bg-emerald-600 text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full shadow-xs">
                    -${savings}% (${compressedSizeKb} KB)
                  </span>
                  <button type="button" onclick="app.removeUploadedPhoto()" class="absolute -bottom-1 -right-1 bg-red-600 text-white rounded-full p-0.5 hover:bg-red-700" title="Eliminar foto">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </div>
                <p class="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono mt-1 font-semibold">
                  ✓ Compresión Canvas: Original ${originalSizeKb} KB ➔ ${compressedSizeKb} KB (${width}x${height}px)
                </p>
              `;
            }
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }

      removeUploadedPhoto() {
        this.uploadedPhotoDataUrl = null;
        const previewCont = document.getElementById('r01PhotoPreviewCont');
        if (previewCont) previewCont.innerHTML = '';
        const input = document.getElementById('r01PhotoInput');
        if (input) input.value = '';
      }

      handleR01SubmitIncident(event) {
        event.preventDefault();
        const sede = document.getElementById('r01Sede').value;
        const ed = document.getElementById('r01Edificio').value;
        const piso = document.getElementById('r01Piso').value;
        const esp = document.getElementById('r01Espacio').value;
        const title = document.getElementById('r01Title').value.trim();
        const category = document.getElementById('r01Category').value;
        const isHighRisk = document.getElementById('r01RiskFlag').checked;
        const description = document.getElementById('r01Description').value.trim();

        if (description.length < 20) {
          this.showToast('La descripción debe contener mínimo 20 caracteres', 'warning');
          return;
        }

        const nextNum = 142 + this.tickets.length;
        const newId = `TKT-2026-${String(nextNum).padStart(6, '0')}`;
        const severity = isHighRisk ? 'CRITICA' : 'MEDIA';
        const slaHours = isHighRisk ? 4 : 48;
        const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

        const newTicket = {
          id: newId,
          title: title,
          category: category,
          severity: severity,
          sede: sede,
          bloque: ed,
          piso: piso,
          aula: esp,
          reporter: "Prof. Laura Gómez",
          technician: "",
          status: isHighRisk ? 'E05' : 'E01',
          createdHoursAgo: 0.1,
          slaHours: slaHours,
          description: description,
          hasPhoto: !!this.uploadedPhotoDataUrl,
          bitacora: [
            {
              date: nowStr,
              user: "Prof. Laura Gómez (R01)",
              note: `Radicado oficial creado en ${sede} > ${ed} > ${piso} > ${esp}. ${isHighRisk ? '⚠️ Bandera de Riesgo Inminente activada.' : ''}`
            }
          ]
        };

        this.tickets.unshift(newTicket);
        this.saveTickets();

        document.getElementById('formR01NewIncident').reset();
        this.removeUploadedPhoto();
        this.setR01SubTab('myTickets');
        this.render();
        this.showToast(`Incidencia ${newId} radicada exitosamente`, 'success');
      }

      // R01 Action Modals
      openR01ClarificationModal(ticketId) {
        const ticket = this.tickets.find(t => t.id === ticketId);
        if (!ticket) return;
        this.activeActionTicketId = ticketId;
        const promptEl = document.getElementById('r01ClarificationPrompt');
        if (promptEl) promptEl.innerText = `"${ticket.clarificationMotive || 'Favor aportar detalles adicionales de la falla.'}"`;
        document.getElementById('r01ClarificationResponse').value = '';
        document.getElementById('modalR01Clarification').classList.remove('hidden');
      }

      submitR01Clarification() {
        const text = document.getElementById('r01ClarificationResponse').value.trim();
        if (!text) {
          this.showToast('Por favor escribe tu respuesta', 'warning');
          return;
        }
        const ticket = this.tickets.find(t => t.id === this.activeActionTicketId);
        if (!ticket) return;

        ticket.status = 'E03'; // Reanudado a En revisión
        const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
        ticket.bitacora.unshift({
          date: nowStr,
          user: "Prof. Laura Gómez (R01)",
          note: `Aclaración aportada: ${text}`
        });

        this.saveTickets();
        this.closeModal('modalR01Clarification');
        this.renderR01Workspace();
        this.render();
        this.showToast(`Aclaración enviada para ${ticket.id}. Reanudado a E03 En revisión`, 'success');
      }

      confirmR01Solution(ticketId) {
        const ticket = this.tickets.find(t => t.id === ticketId);
        if (!ticket) return;

        ticket.status = 'E15'; // Cerrada & Conforme
        const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
        ticket.bitacora.unshift({
          date: nowStr,
          user: "Prof. Laura Gómez (R01)",
          note: "Solución confirmada por el reportante. Orden cerrada y conforme a satisfacción."
        });

        this.saveTickets();
        this.renderR01Workspace();
        this.render();
        this.showToast(`Incidencia ${ticket.id} cerrada y conforme a satisfacción`, 'success');
      }

      openR01ReopenModal(ticketId) {
        this.activeActionTicketId = ticketId;
        document.getElementById('r01ReopenReason').value = '';
        document.getElementById('modalR01Reopen').classList.remove('hidden');
      }

      submitR01Reopen() {
        const reason = document.getElementById('r01ReopenReason').value.trim();
        if (!reason) {
          this.showToast('Por favor escribe la razón del defecto persistente', 'warning');
          return;
        }
        const ticket = this.tickets.find(t => t.id === this.activeActionTicketId);
        if (!ticket) return;

        ticket.status = 'E13'; // En corrección / Retrabajo
        const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
        ticket.bitacora.unshift({
          date: nowStr,
          user: "Prof. Laura Gómez (R01)",
          note: `Reporte de falla persistente en cierre: ${reason}. Pasa a E13 En corrección.`
        });

        this.saveTickets();
        this.closeModal('modalR01Reopen');
        this.renderR01Workspace();
        this.render();
        this.showToast(`Incidencia devuelta a E13 En corrección para retrabajo`, 'warning');
      }

      // ==================== WORKSPACE R02 (GESTOR DE TRIAJE) ====================
      renderR02Workspace() {
        const queueCont = document.getElementById('r02QueueList');
        const countE01 = document.getElementById('r02CountE01');
        const countE03 = document.getElementById('r02CountE03');
        if (!queueCont) return;

        const triageTickets = this.tickets.filter(t => ['E01', 'E03'].includes(t.status));
        const cE01 = this.tickets.filter(t => t.status === 'E01').length;
        const cE03 = this.tickets.filter(t => t.status === 'E03').length;

        if (countE01) countE01.innerText = cE01;
        if (countE03) countE03.innerText = cE03;
        queueCont.innerHTML = '';

        if (triageTickets.length === 0) {
          queueCont.innerHTML = `
            <div class="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-400">
              <p class="font-medium">No hay incidencias pendientes en la bandeja de triaje.</p>
              <p class="text-xs text-slate-500 mt-1">Todos los reportes están clasificados o en despacho.</p>
            </div>
          `;
          return;
        }

        triageTickets.forEach(t => {
          const sla = this.getSlaStatus(t);
          const isAclarada = t.status === 'E03';

          const card = document.createElement('div');
          card.className = 'p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-navy shadow-xs space-y-3';

          card.innerHTML = `
            <div class="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 text-xs">
              <div class="flex items-center space-x-2">
                <span class="font-mono font-bold text-brand-royalBlue dark:text-sky-400">${t.id}</span>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold ${this.getCategoryBadgeColor(t.category)}">${t.category}</span>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold ${isAclarada ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300' : 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300'}">
                  ${isAclarada ? 'E03 · Aclaración Recibida' : 'E01 · Registro Inicial'}
                </span>
              </div>
              <span class="font-mono text-[11px] text-slate-400">Radicado hace ${t.createdHoursAgo.toFixed(1)}h</span>
            </div>

            <div>
              <h4 class="font-display font-bold text-sm text-slate-900 dark:text-white">${t.title}</h4>
              <p class="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                📍 ${t.sede} > ${t.bloque} > ${t.aula} • Reportante: <strong>${t.reporter}</strong>
              </p>
              <p class="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">${t.description}</p>
            </div>

            <!-- Triage Actions Toolbar -->
            <div class="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <div class="flex items-center space-x-1.5">
                <button onclick="app.openR02ClarificationModal('${t.id}')" class="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center space-x-1">
                  <span>💬 Solicitar Aclaración</span>
                </button>
                <button onclick="app.openR02DuplicateModal('${t.id}')" class="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center space-x-1">
                  <span>🔗 Vincular Duplicado</span>
                </button>
                <button onclick="app.openR02DismissModal('${t.id}')" class="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 font-semibold text-xs hover:bg-red-50 flex items-center space-x-1">
                  <span>🚫 Desestimar (E16)</span>
                </button>
              </div>

              <button onclick="app.openR02ItilMatrixModal('${t.id}')" class="px-4 py-1.5 rounded-lg bg-brand-royalBlue hover:bg-blue-600 text-white font-semibold text-xs shadow-xs flex items-center space-x-1.5">
                <span>⚖️ Priorizar Matriz ITIL ➔ E05</span>
              </button>
            </div>
          `;

          queueCont.appendChild(card);
        });
      }

      // R02 Action Modals
      openR02ClarificationModal(ticketId) {
        this.activeActionTicketId = ticketId;
        document.getElementById('r02ClarificationReason').value = '';
        document.getElementById('modalR02Clarification').classList.remove('hidden');
      }

      submitR02Clarification() {
        const text = document.getElementById('r02ClarificationReason').value.trim();
        if (!text) {
          this.showToast('Debes ingresar el motivo de aclaración', 'warning');
          return;
        }
        const ticket = this.tickets.find(t => t.id === this.activeActionTicketId);
        if (!ticket) return;

        ticket.status = 'E02';
        ticket.clarificationMotive = text;
        const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
        ticket.bitacora.unshift({
          date: nowStr,
          user: "Gestor de Triaje (R02)",
          note: `Devuelto a E02 por aclaración: ${text}`
        });

        this.saveTickets();
        this.closeModal('modalR02Clarification');
        this.renderR02Workspace();
        this.render();
        this.showToast(`Solicitud de información enviada al reportante (${ticket.id})`, 'info');
      }

      openR02DuplicateModal(ticketId) {
        this.activeActionTicketId = ticketId;
        const select = document.getElementById('r02MasterTicketSelect');
        select.innerHTML = '';

        const candidateMasters = this.tickets.filter(t => t.id !== ticketId && !['E16', 'E17'].includes(t.status));
        candidateMasters.forEach(m => {
          const opt = document.createElement('option');
          opt.value = m.id;
          opt.innerText = `${m.id} - ${m.title} (${m.sede} / ${m.aula})`;
          select.appendChild(opt);
        });

        document.getElementById('modalR02Duplicate').classList.remove('hidden');
      }

      submitR02Duplicate() {
        const masterId = document.getElementById('r02MasterTicketSelect').value;
        const ticket = this.tickets.find(t => t.id === this.activeActionTicketId);
        if (!ticket || !masterId) return;

        ticket.status = 'E17'; // Cancelada por duplicidad
        const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
        ticket.bitacora.unshift({
          date: nowStr,
          user: "Gestor de Triaje (R02)",
          note: `Incidencia unificada como duplicado del ticket maestro ${masterId} (RN-011).`
        });

        const masterTicket = this.tickets.find(t => t.id === masterId);
        if (masterTicket) {
          masterTicket.bitacora.unshift({
            date: nowStr,
            user: "Gestor de Triaje (R02)",
            note: `Incidencia hija asociada como duplicado: ${ticket.id} (${ticket.reporter}).`
          });
        }

        this.saveTickets();
        this.closeModal('modalR02Duplicate');
        this.renderR02Workspace();
        this.render();
        this.showToast(`Incidencia ${ticket.id} vinculada a maestro ${masterId}`, 'success');
      }

      openR02DismissModal(ticketId) {
        this.activeActionTicketId = ticketId;
        document.getElementById('r02DismissNotes').value = '';
        document.getElementById('modalR02Dismiss').classList.remove('hidden');
      }

      submitR02Dismiss() {
        const reasonType = document.getElementById('r02DismissReasonType').value;
        const notes = document.getElementById('r02DismissNotes').value.trim();
        if (!notes) {
          this.showToast('Debes justificar la desestimación', 'warning');
          return;
        }

        const ticket = this.tickets.find(t => t.id === this.activeActionTicketId);
        if (!ticket) return;

        ticket.status = 'E16'; // No procedente
        const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
        ticket.bitacora.unshift({
          date: nowStr,
          user: "Gestor de Triaje (R02)",
          note: `Desestimada (E16 No procedente): [${reasonType}] - ${notes}`
        });

        this.saveTickets();
        this.closeModal('modalR02Dismiss');
        this.renderR02Workspace();
        this.render();
        this.showToast(`Incidencia ${ticket.id} desestimada formalmente`, 'warning');
      }

      openR02ItilMatrixModal(ticketId) {
        this.activeActionTicketId = ticketId;
        this.calculateItilPriority();
        document.getElementById('modalR02ItilMatrix').classList.remove('hidden');
      }

      calculateItilPriority() {
        const impact = document.getElementById('itilImpactSelect')?.value || 'MEDIO';
        const urgency = document.getElementById('itilUrgencySelect')?.value || 'MEDIA';
        const badge = document.getElementById('itilResultBadge');

        let priority = 'MEDIA';
        let slaHours = 48;

        if (impact === 'ALTO' && urgency === 'ALTA') {
          priority = 'CRITICA';
          slaHours = 4;
        } else if ((impact === 'ALTO' && urgency === 'MEDIA') || (impact === 'MEDIO' && urgency === 'ALTA')) {
          priority = 'ALTA';
          slaHours = 12;
        } else if ((impact === 'BAJO' && urgency === 'BAJA') || (impact === 'MEDIO' && urgency === 'BAJA')) {
          priority = 'BAJA';
          slaHours = 96;
        } else {
          priority = 'MEDIA';
          slaHours = 48;
        }

        if (badge) {
          badge.innerText = `${priority} (SLA: ${slaHours} Horas)`;
          badge.className = `text-base font-extrabold font-display mt-0.5 ${
            priority === 'CRITICA' ? 'text-red-600' :
            priority === 'ALTA' ? 'text-amber-600' :
            priority === 'MEDIA' ? 'text-blue-600' : 'text-slate-600'
          }`;
        }

        this.calculatedItil = { priority, slaHours };
      }

      submitR02ItilMatrix() {
        const ticket = this.tickets.find(t => t.id === this.activeActionTicketId);
        if (!ticket || !this.calculatedItil) return;

        ticket.severity = this.calculatedItil.priority;
        ticket.slaHours = this.calculatedItil.slaHours;
        ticket.status = 'E05'; // Pendiente de asignación

        const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
        ticket.bitacora.unshift({
          date: nowStr,
          user: "Gestor de Triaje (R02)",
          note: `Clasificación ITIL aprobada: Severidad ${ticket.severity}, SLA ${ticket.slaHours}h. Pasa a E05 Pendiente de asignación.`
        });

        this.saveTickets();
        this.closeModal('modalR02ItilMatrix');
        this.renderR02Workspace();
        this.render();
        this.showToast(`Incidencia ${ticket.id} clasificada como ${ticket.severity} y despachada a E05`, 'success');
      }

      // ==================== WORKSPACE R03 (COORDINADOR MANTENIMIENTO) ====================
      getTechnicianWorkload(techName) {
        return this.tickets.filter(t => t.technician === techName && !['E15', 'E16', 'E17'].includes(t.status)).length;
      }

      renderR03Workspace() {
        const wipBarCont = document.getElementById('r03TechniciansWipBar');
        const queueCont = document.getElementById('r03QueueList');
        const countE05 = document.getElementById('r03CountE05');
        const countE13 = document.getElementById('r03CountE13');

        if (!wipBarCont || !queueCont) return;

        const cE05 = this.tickets.filter(t => t.status === 'E05').length;
        const cE13 = this.tickets.filter(t => t.status === 'E13').length;
        if (countE05) countE05.innerText = cE05;
        if (countE13) countE13.innerText = cE13;

        // 1. Render WIP load bars
        wipBarCont.innerHTML = '';
        TECHNICIANS_DATA.forEach(tech => {
          const workload = this.getTechnicianWorkload(tech.name);
          const percent = Math.min(100, Math.round((workload / tech.maxWip) * 100));
          const isAtLimit = workload >= tech.maxWip;

          const card = document.createElement('div');
          card.className = `p-2.5 rounded-lg border text-xs transition ${
            isAtLimit ? 'bg-red-50/50 dark:bg-red-950/20 border-red-300 dark:border-red-900/50' : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
          }`;

          card.innerHTML = `
            <div class="flex items-center justify-between font-mono text-[11px] mb-1">
              <span class="font-bold truncate text-slate-800 dark:text-slate-100">${tech.name.replace('Ing. ', '').replace('Tec. ', '').replace('Maestro ', '')}</span>
              <span class="font-bold ${isAtLimit ? 'text-red-600' : 'text-slate-600 dark:text-slate-400'}">${workload}/${tech.maxWip}</span>
            </div>
            <div class="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
              <div class="h-1.5 rounded-full transition-all duration-300 ${isAtLimit ? 'bg-red-600' : 'bg-brand-royalBlue'}" style="width: ${percent}%;"></div>
            </div>
            <div class="flex items-center justify-between text-[10px] text-slate-400 mt-1">
              <span>${tech.specialty}</span>
              <span class="font-semibold ${isAtLimit ? 'text-red-500' : 'text-emerald-500'}">${isAtLimit ? 'Lleno' : 'Disponible'}</span>
            </div>
          `;
          wipBarCont.appendChild(card);
        });

        // 2. Render actionable queue (E05 + E13)
        const actionableTickets = this.tickets.filter(t => ['E05', 'E13'].includes(t.status));
        queueCont.innerHTML = '';

        if (actionableTickets.length === 0) {
          queueCont.innerHTML = `
            <div class="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-400">
              <p class="font-medium">No hay órdenes pendientes de asignación o retrabajo en este momento.</p>
              <p class="text-xs text-slate-500 mt-1">Todas las órdenes cuentan con cuadrilla programada.</p>
            </div>
          `;
          return;
        }

        actionableTickets.forEach(t => {
          const sla = this.getSlaStatus(t);
          const isRework = t.status === 'E13';

          const card = document.createElement('div');
          card.className = `p-4 rounded-xl border bg-white dark:bg-brand-navy shadow-xs space-y-3 ${
            isRework ? 'border-red-300 dark:border-red-900/60 ring-1 ring-red-400/20' : 'border-slate-200 dark:border-slate-800'
          }`;

          card.innerHTML = `
            <div class="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 text-xs">
              <div class="flex items-center space-x-2">
                <span class="font-mono font-bold text-brand-royalBlue dark:text-sky-400">${t.id}</span>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold ${this.getCategoryBadgeColor(t.category)}">${t.category}</span>
                ${this.getSeverityBadge(t.severity)}
                ${isRework ? '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300">E13 · Retrabajo Requerido</span>' : '<span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">E05 · Por Despachar</span>'}
              </div>
              <span class="px-2 py-0.5 rounded font-mono text-[10px] ${sla.badgeClass}">${sla.text}</span>
            </div>

            <div>
              <h4 class="font-display font-bold text-sm text-slate-900 dark:text-white">${t.title}</h4>
              <p class="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                📍 ${t.sede} > ${t.bloque} > ${t.aula}
              </p>
              <p class="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">${t.description}</p>
            </div>

            <div class="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <button onclick="app.openR03RequisitionModal('${t.id}')" class="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center space-x-1">
                <span>📦 Requisición Compras / Almacén (E08/E09)</span>
              </button>

              <button onclick="app.openR03AssignCrewModal('${t.id}')" class="px-4 py-1.5 rounded-lg bg-brand-royalBlue hover:bg-blue-600 text-white font-semibold text-xs shadow-xs flex items-center space-x-1.5">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                <span>Asignar Cuadrilla & Programar</span>
              </button>
            </div>
          `;

          queueCont.appendChild(card);
        });
      }

      // R03 Action Modals
      openR03AssignCrewModal(ticketId) {
        this.activeActionTicketId = ticketId;
        const ticket = this.tickets.find(t => t.id === ticketId);
        if (!ticket) return;

        const summary = document.getElementById('r03AssignTicketSummary');
        if (summary) {
          summary.innerHTML = `
            <div class="flex items-center justify-between font-mono font-bold text-brand-royalBlue mb-1">
              <span>${ticket.id} (${ticket.category})</span>
              <span>Severidad: ${ticket.severity}</span>
            </div>
            <p class="font-semibold text-slate-800 dark:text-slate-200">${ticket.title}</p>
            <p class="text-[11px] text-slate-400 font-mono mt-0.5">📍 ${ticket.sede} > ${ticket.bloque} > ${ticket.aula}</p>
          `;
        }

        const crewCont = document.getElementById('r03CrewOptionsList');
        if (crewCont) {
          crewCont.innerHTML = '';
          TECHNICIANS_DATA.forEach((tech, idx) => {
            const workload = this.getTechnicianWorkload(tech.name);
            const isFull = workload >= tech.maxWip;
            const matchesCategory = (tech.specialty === ticket.category) || (tech.specialty === 'Redes' && ticket.category === 'Cerrajería');

            const label = document.createElement('label');
            label.className = `flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition ${
              isFull ? 'bg-red-50/40 dark:bg-red-950/20 border-red-200 dark:border-red-900/40 opacity-70' :
              matchesCategory ? 'bg-blue-50/50 dark:bg-blue-950/30 border-brand-royalBlue/50 ring-1 ring-brand-royalBlue/20' :
              'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
            }`;

            label.innerHTML = `
              <div class="flex items-center space-x-2.5">
                <input type="radio" name="r03SelectedTech" value="${tech.name}" ${idx === 0 || matchesCategory ? 'checked' : ''} class="text-brand-royalBlue focus:ring-brand-royalBlue">
                <div>
                  <div class="flex items-center space-x-2">
                    <span class="font-bold text-slate-800 dark:text-slate-100">${tech.name}</span>
                    ${matchesCategory ? '<span class="text-[10px] font-bold text-brand-royalBlue bg-blue-100 px-1.5 py-0.2 rounded">Especialidad Recomendada</span>' : ''}
                  </div>
                  <span class="text-[11px] text-slate-500">${tech.specialty}</span>
                </div>
              </div>
              <div class="text-right">
                <span class="font-mono text-xs font-bold ${isFull ? 'text-red-600' : 'text-slate-700 dark:text-slate-300'}">${workload}/${tech.maxWip} órdenes</span>
                <span class="block text-[10px] ${isFull ? 'text-red-500 font-bold' : 'text-emerald-500 font-semibold'}">${isFull ? 'LÍMITE ALCANZADO' : 'Disponible'}</span>
              </div>
            `;
            crewCont.appendChild(label);
          });
        }

        document.getElementById('modalR03AssignCrew').classList.remove('hidden');
      }

      submitR03AssignCrew() {
        const selectedRadio = document.querySelector('input[name="r03SelectedTech"]:checked');
        if (!selectedRadio) {
          this.showToast('Selecciona un técnico', 'warning');
          return;
        }

        const techName = selectedRadio.value;
        const targetState = document.getElementById('r03AssignTargetState').value;
        const schedule = document.getElementById('r03AssignSchedule').value;
        const ticket = this.tickets.find(t => t.id === this.activeActionTicketId);
        if (!ticket) return;

        ticket.technician = techName;
        ticket.status = targetState;

        const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
        ticket.bitacora.unshift({
          date: nowStr,
          user: "Coordinador Infraestructura (R03)",
          note: `Cuadrilla asignada a: ${techName} (${schedule}). Transición a ${this.getStatusName(targetState)}.`
        });

        this.saveTickets();
        this.closeModal('modalR03AssignCrew');
        this.renderR03Workspace();
        this.render();
        this.showToast(`Cuadrilla asignada a ${techName} para ${ticket.id}`, 'success');
      }

      openR03RequisitionModal(ticketId) {
        this.activeActionTicketId = ticketId;
        document.getElementById('r03ReqItems').value = '';
        document.getElementById('r03ReqBudget').value = '';
        document.getElementById('r03ReqJustification').value = '';
        document.getElementById('modalR03Requisition').classList.remove('hidden');
      }

      submitR03Requisition() {
        const reqType = document.getElementById('r03ReqType').value;
        const items = document.getElementById('r03ReqItems').value.trim();
        const budget = document.getElementById('r03ReqBudget').value.trim();
        const just = document.getElementById('r03ReqJustification').value.trim();

        if (!items || !just) {
          this.showToast('Completa los insumos y la justificación técnica', 'warning');
          return;
        }

        const ticket = this.tickets.find(t => t.id === this.activeActionTicketId);
        if (!ticket) return;

        ticket.status = reqType;
        ticket.requisitionItems = items;
        ticket.requisitionBudget = budget || '$0 COP';
        ticket.requisitionJustification = just;

        const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
        ticket.bitacora.unshift({
          date: nowStr,
          user: "Coordinador Infraestructura (R03)",
          note: `Requisición radicada hacia ${this.getStatusName(reqType)}: [${items}] Presupuesto: ${ticket.requisitionBudget}. Justificación: ${just}`
        });

        this.saveTickets();
        this.closeModal('modalR03Requisition');
        this.renderR03Workspace();
        this.render();
        this.showToast(`Requisición radicada exitosamente hacia ${this.getStatusName(reqType)}`, 'success');
      }

      // ==================== WORKSPACE R04 (TÉCNICO DE CAMPO) ====================
      renderR04Workspace() {
        const techSelect = document.getElementById('r04TechnicianFilter');
        const queueCont = document.getElementById('r04QueueList');
        if (!techSelect || !queueCont) return;

        const currentTech = techSelect.value;
        const orders = this.tickets.filter(t => t.technician === currentTech && ['E06', 'E10', 'E11'].includes(t.status));
        queueCont.innerHTML = '';

        if (orders.length === 0) {
          queueCont.innerHTML = `
            <div class="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-400">
              <p class="font-medium">No hay órdenes activas asignadas a ${currentTech}.</p>
              <p class="text-xs text-slate-500 mt-1">Selecciona otro técnico o espera nuevo despacho de cuadrilla.</p>
            </div>
          `;
          return;
        }

        orders.forEach(t => {
          const sla = this.getSlaStatus(t);
          const isAtencion = t.status === 'E11';

          const card = document.createElement('div');
          card.className = `p-4 rounded-xl border bg-white dark:bg-brand-navy shadow-xs space-y-3 ${
            isAtencion ? 'border-sky-400 dark:border-sky-500 ring-2 ring-sky-400/20' : 'border-slate-200 dark:border-slate-800'
          }`;

          card.innerHTML = `
            <div class="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 text-xs">
              <div class="flex items-center space-x-2">
                <span class="font-mono font-bold text-brand-royalBlue dark:text-sky-400">${t.id}</span>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold ${this.getCategoryBadgeColor(t.category)}">${t.category}</span>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold ${isAtencion ? 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 animate-pulse-subtle' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}">
                  ${this.getStatusName(t.status)}
                </span>
              </div>
              <span class="px-2 py-0.5 rounded font-mono text-[10px] ${sla.badgeClass}">${sla.text}</span>
            </div>

            <div>
              <h4 class="font-display font-bold text-sm text-slate-900 dark:text-white">${t.title}</h4>
              <p class="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                📍 ${t.sede} > ${t.bloque} > ${t.aula}
              </p>
              <p class="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">${t.description}</p>
            </div>

            <!-- Field Execution Controls -->
            <div class="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <div>
                ${!isAtencion ? `
                  <button onclick="app.startR04Work('${t.id}')" class="px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs shadow-xs flex items-center space-x-1.5">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/></svg>
                    <span>Iniciar Atención en Sitio (➔ E11)</span>
                  </button>
                ` : `
                  <span class="text-xs text-sky-600 dark:text-sky-400 font-bold flex items-center space-x-1">
                    <span class="w-2 h-2 rounded-full bg-sky-500 animate-ping"></span>
                    <span>Trabajo en Ejecución en Sitio</span>
                  </span>
                `}
              </div>

              ${isAtencion ? `
                <div class="flex items-center space-x-2">
                  <button onclick="app.openR04FieldLogModal('${t.id}')" class="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center space-x-1">
                    <span>📝 Registrar Bitácora</span>
                  </button>
                  <button onclick="app.openR04FinishWorkModal('${t.id}')" class="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs flex items-center space-x-1">
                    <span>🏁 Finalizar y Solicitar Verificación (➔ E12)</span>
                  </button>
                </div>
              ` : ''}
            </div>
          `;

          queueCont.appendChild(card);
        });
      }

      startR04Work(ticketId) {
        const ticket = this.tickets.find(t => t.id === ticketId);
        if (!ticket) return;

        ticket.status = 'E11'; // En atención
        const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
        ticket.bitacora.unshift({
          date: nowStr,
          user: ticket.technician || "Técnico de Campo (R04)",
          note: "Llegada al sitio confirmada. Inicio formal de labores de mantenimiento y atención."
        });

        this.saveTickets();
        this.renderR04Workspace();
        this.render();
        this.showToast(`Atención iniciada en ${ticket.id}. Estado: E11 En atención`, 'success');
      }

      openR04FieldLogModal(ticketId) {
        this.activeActionTicketId = ticketId;
        document.getElementById('r04LogMaterials').value = '';
        document.getElementById('r04LogNotes').value = '';
        document.getElementById('modalR04FieldLog').classList.remove('hidden');
      }

      submitR04FieldLog() {
        const hours = document.getElementById('r04LogHours').value;
        const cause = document.getElementById('r04LogRootCause').value;
        const materials = document.getElementById('r04LogMaterials').value.trim();
        const notes = document.getElementById('r04LogNotes').value.trim();

        const ticket = this.tickets.find(t => t.id === this.activeActionTicketId);
        if (!ticket) return;

        const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
        ticket.bitacora.unshift({
          date: nowStr,
          user: ticket.technician || "Técnico de Campo (R04)",
          note: `Bitácora de Campo: ${hours}h invertidas. Causa raíz: [${cause}]. Materiales: [${materials || 'Sin consumo'}]. Notas: ${notes || 'Procedimiento estándar'}`
        });

        this.saveTickets();
        this.closeModal('modalR04FieldLog');
        this.renderR04Workspace();
        this.render();
        this.showToast(`Bitácora técnica registrada en ${ticket.id}`, 'info');
      }

      openR04FinishWorkModal(ticketId) {
        this.activeActionTicketId = ticketId;
        document.getElementById('r04FinishSummary').value = '';
        document.getElementById('modalR04FinishWork').classList.remove('hidden');
      }

      submitR04FinishWork() {
        const summary = document.getElementById('r04FinishSummary').value.trim();
        if (!summary) {
          this.showToast('Ingresa un resumen del trabajo concluido', 'warning');
          return;
        }

        const ticket = this.tickets.find(t => t.id === this.activeActionTicketId);
        if (!ticket) return;

        ticket.status = 'E12'; // Pendiente de verificación de calidad
        const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
        ticket.bitacora.unshift({
          date: nowStr,
          user: ticket.technician || "Técnico de Campo (R04)",
          note: `Trabajos concluidos en sitio: ${summary}. Orden entregada a Control de Calidad (E12).`
        });

        this.saveTickets();
        this.closeModal('modalR04FinishWork');
        this.renderR04Workspace();
        this.render();
        this.showToast(`Intervención concluida. Enviada a E12 Verificación de Calidad`, 'success');
      }

      // ==================== WORKSPACE R05 (AUTORIZACIONES) ====================
      renderR05Workspace() {
        const queueCont = document.getElementById('r05QueueList');
        const countE08 = document.getElementById('r05CountE08');
        if (!queueCont) return;

        const requisitions = this.tickets.filter(t => t.status === 'E08');
        if (countE08) countE08.innerText = requisitions.length;
        queueCont.innerHTML = '';

        if (requisitions.length === 0) {
          queueCont.innerHTML = `
            <div class="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-400">
              <p class="font-medium">No hay requisiciones pendientes de autorización financiera.</p>
              <p class="text-xs text-slate-500 mt-1">Todas las compras han sido dictaminadas.</p>
            </div>
          `;
          return;
        }

        requisitions.forEach(t => {
          const sla = this.getSlaStatus(t);

          const card = document.createElement('div');
          card.className = 'p-4 rounded-xl border border-purple-200 dark:border-purple-900/60 bg-white dark:bg-brand-navy shadow-xs space-y-3';

          card.innerHTML = `
            <div class="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 text-xs">
              <div class="flex items-center space-x-2">
                <span class="font-mono font-bold text-brand-royalBlue dark:text-sky-400">${t.id}</span>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold ${this.getCategoryBadgeColor(t.category)}">${t.category}</span>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300">
                  E08 · Autorización Requerida
                </span>
              </div>
              <span class="px-2 py-0.5 rounded font-mono text-[10px] ${sla.badgeClass}">${sla.text}</span>
            </div>

            <div>
              <h4 class="font-display font-bold text-sm text-slate-900 dark:text-white">${t.title}</h4>
              <p class="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                📍 ${t.sede} > ${t.bloque} > ${t.aula}
              </p>
            </div>

            <!-- Financial details box -->
            <div class="p-3 rounded-lg bg-purple-50/50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/40 text-xs space-y-1.5">
              <div class="flex items-center justify-between">
                <span class="font-bold text-purple-900 dark:text-purple-200 uppercase text-[10px]">Monto Presupuestado Estimado:</span>
                <span class="font-mono font-extrabold text-sm text-purple-800 dark:text-purple-300">${t.requisitionBudget || '$1,850,000 COP'}</span>
              </div>
              <p class="text-slate-700 dark:text-slate-300"><strong>Insumos Cotizados:</strong> ${t.requisitionItems || 'Repuestos de bombeo sumergible y cableado de potencia'}</p>
              <p class="text-slate-600 dark:text-slate-400 italic"><strong>Justificación Técnica:</strong> "${t.requisitionJustification || 'Se requiere reemplazo inmediato para no detener el suministro de agua del campus.'}"</p>
            </div>

            <div class="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end space-x-2">
              <button onclick="app.openR05RejectModal('${t.id}')" class="px-3.5 py-1.5 rounded-lg border border-red-200 text-red-600 font-semibold text-xs hover:bg-red-50">
                ❌ Rechazar Solicitud
              </button>
              <button onclick="app.openR05ApproveModal('${t.id}')" class="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs">
                ✅ Aprobar Compra (➔ E09/E10)
              </button>
            </div>
          `;

          queueCont.appendChild(card);
        });
      }

      openR05ApproveModal(ticketId) {
        this.activeActionTicketId = ticketId;
        const ticket = this.tickets.find(t => t.id === ticketId);
        if (!ticket) return;

        const summary = document.getElementById('r05ApproveSummary');
        if (summary) {
          summary.innerHTML = `
            <div class="font-bold text-slate-800 dark:text-slate-200">${ticket.id}: ${ticket.title}</div>
            <div class="font-mono text-purple-700 dark:text-purple-300 font-bold mt-1">Presupuesto a liberar: ${ticket.requisitionBudget || '$1,850,000 COP'}</div>
          `;
        }
        document.getElementById('modalR05Approve').classList.remove('hidden');
      }

      submitR05Approve() {
        const targetState = document.getElementById('r05TargetStateSelect').value;
        const code = document.getElementById('r05BudgetCode').value;
        const ticket = this.tickets.find(t => t.id === this.activeActionTicketId);
        if (!ticket) return;

        ticket.status = targetState;
        const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
        ticket.bitacora.unshift({
          date: nowStr,
          user: "Responsable Autorizaciones (R05)",
          note: `Requisición de compra APROBADA formalmente bajo rubro: [${code}]. Pasa a ${this.getStatusName(targetState)}.`
        });

        this.saveTickets();
        this.closeModal('modalR05Approve');
        this.renderR05Workspace();
        this.render();
        this.showToast(`Adquisición autorizada para ${ticket.id}`, 'success');
      }

      openR05RejectModal(ticketId) {
        this.activeActionTicketId = ticketId;
        document.getElementById('r05RejectReason').value = '';
        document.getElementById('modalR05Reject').classList.remove('hidden');
      }

      submitR05Reject() {
        const reason = document.getElementById('r05RejectReason').value.trim();
        if (!reason) {
          this.showToast('Debes ingresar la justificación del rechazo presupuestal', 'warning');
          return;
        }

        const ticket = this.tickets.find(t => t.id === this.activeActionTicketId);
        if (!ticket) return;

        ticket.status = 'E05'; // Retorna a asignación para reevaluar alternativa
        const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
        ticket.bitacora.unshift({
          date: nowStr,
          user: "Responsable Autorizaciones (R05)",
          note: `Requisición extraordinaria RECHAZADA: ${reason}. Retorna a E05 para reevaluar alternativa técnica.`
        });

        this.saveTickets();
        this.closeModal('modalR05Reject');
        this.renderR05Workspace();
        this.render();
        this.showToast(`Requisición rechazada. Retornada a E05`, 'warning');
      }

      // ==================== WORKSPACE R06 (VERIFICADOR DE CALIDAD) ====================
      renderR06Workspace() {
        const queueCont = document.getElementById('r06QueueList');
        const countE12 = document.getElementById('r06CountE12');
        if (!queueCont) return;

        const audits = this.tickets.filter(t => t.status === 'E12');
        if (countE12) countE12.innerText = audits.length;
        queueCont.innerHTML = '';

        if (audits.length === 0) {
          queueCont.innerHTML = `
            <div class="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-400">
              <p class="font-medium">No hay órdenes pendientes de peritaje de calidad.</p>
              <p class="text-xs text-slate-500 mt-1">Todas las intervenciones técnicas han sido auditadas.</p>
            </div>
          `;
          return;
        }

        audits.forEach(t => {
          const sla = this.getSlaStatus(t);
          const checklist = this.r06ChecklistState[t.id] || { p1: false, p2: false, p3: false, p4: false };

          const card = document.createElement('div');
          card.className = 'p-4 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-white dark:bg-brand-navy shadow-xs space-y-3';

          card.innerHTML = `
            <div class="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 text-xs">
              <div class="flex items-center space-x-2">
                <span class="font-mono font-bold text-brand-royalBlue dark:text-sky-400">${t.id}</span>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold ${this.getCategoryBadgeColor(t.category)}">${t.category}</span>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300">
                  E12 · Pendiente de Verificación
                </span>
              </div>
              <span class="px-2 py-0.5 rounded font-mono text-[10px] ${sla.badgeClass}">${sla.text}</span>
            </div>

            <div>
              <h4 class="font-display font-bold text-sm text-slate-900 dark:text-white">${t.title}</h4>
              <p class="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                📍 ${t.sede} > ${t.bloque} > ${t.aula} • Cuadrilla: <strong>${t.technician || 'Cuadrilla General'}</strong>
              </p>
            </div>

            <!-- Interactive 4-point Checklist Box -->
            <div class="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
              <span class="font-bold text-[10px] uppercase tracking-wider text-slate-500">Checklist de Criterios de Calidad en Sitio (RN-035):</span>
              <div class="space-y-1.5">
                <label class="flex items-center space-x-2 cursor-pointer select-none">
                  <input type="checkbox" ${checklist.p1 ? 'checked' : ''} onchange="app.onR06ChecklistToggle('${t.id}', 'p1', this.checked)" class="rounded text-brand-royalBlue focus:ring-brand-royalBlue h-4 w-4">
                  <span class="text-slate-700 dark:text-slate-200">1. Conformidad técnica y funcional según la orden de trabajo</span>
                </label>
                <label class="flex items-center space-x-2 cursor-pointer select-none">
                  <input type="checkbox" ${checklist.p2 ? 'checked' : ''} onchange="app.onR06ChecklistToggle('${t.id}', 'p2', this.checked)" class="rounded text-brand-royalBlue focus:ring-brand-royalBlue h-4 w-4">
                  <span class="text-slate-700 dark:text-slate-200">2. Limpieza, orden y retiro de escombros/residuos del área</span>
                </label>
                <label class="flex items-center space-x-2 cursor-pointer select-none">
                  <input type="checkbox" ${checklist.p3 ? 'checked' : ''} onchange="app.onR06ChecklistToggle('${t.id}', 'p3', this.checked)" class="rounded text-brand-royalBlue focus:ring-brand-royalBlue h-4 w-4">
                  <span class="text-slate-700 dark:text-slate-200">3. Prueba operativa de carga/presión/continuidad satisfactoria</span>
                </label>
                <label class="flex items-center space-x-2 cursor-pointer select-none">
                  <input type="checkbox" ${checklist.p4 ? 'checked' : ''} onchange="app.onR06ChecklistToggle('${t.id}', 'p4', this.checked)" class="rounded text-brand-royalBlue focus:ring-brand-royalBlue h-4 w-4">
                  <span class="text-slate-700 dark:text-slate-200">4. Evidencia fotográfica de antes y después completa</span>
                </label>
              </div>
            </div>

            <!-- Quality Verdict Actions -->
            <div class="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end space-x-2">
              <button onclick="app.openR06NonConformityModal('${t.id}')" class="px-3.5 py-1.5 rounded-lg border border-red-300 text-red-600 dark:text-red-400 font-semibold text-xs hover:bg-red-50">
                ⚠️ Emitir Acta No Conformidad (➔ E13)
              </button>
              <button onclick="app.openR06ConformityModal('${t.id}')" class="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs">
                📜 Emitir Dictamen Conforme (➔ E14/E15)
              </button>
            </div>
          `;

          queueCont.appendChild(card);
        });
      }

      onR06ChecklistToggle(ticketId, point, value) {
        if (!this.r06ChecklistState[ticketId]) {
          this.r06ChecklistState[ticketId] = { p1: false, p2: false, p3: false, p4: false };
        }
        this.r06ChecklistState[ticketId][point] = value;
      }

      openR06ConformityModal(ticketId) {
        this.activeActionTicketId = ticketId;
        document.getElementById('r06ConformityNotes').value = '';
        document.getElementById('modalR06Conformity').classList.remove('hidden');
      }

      submitR06Conformity() {
        const targetState = document.getElementById('r06TargetStateSelect').value;
        const notes = document.getElementById('r06ConformityNotes').value.trim();
        const ticket = this.tickets.find(t => t.id === this.activeActionTicketId);
        if (!ticket) return;

        ticket.status = targetState;
        const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
        ticket.bitacora.unshift({
          date: nowStr,
          user: "Interventoría Calidad (R06)",
          note: `Dictamen de Calidad CONFORME (4/4 criterios verificados): ${notes || 'Instalación aprobada en sitio'}. Pasa a ${this.getStatusName(targetState)}.`
        });

        this.saveTickets();
        this.closeModal('modalR06Conformity');
        this.renderR06Workspace();
        this.render();
        this.showToast(`Dictamen conforme emitido para ${ticket.id}`, 'success');
      }

      openR06NonConformityModal(ticketId) {
        this.activeActionTicketId = ticketId;
        document.getElementById('r06ReworkInstructions').value = '';
        document.getElementById('modalR06NonConformity').classList.remove('hidden');
      }

      submitR06NonConformity() {
        const defect = document.getElementById('r06DefectType').value;
        const instructions = document.getElementById('r06ReworkInstructions').value.trim();

        if (!instructions) {
          this.showToast('Describe las instrucciones de corrección', 'warning');
          return;
        }

        const ticket = this.tickets.find(t => t.id === this.activeActionTicketId);
        if (!ticket) return;

        ticket.status = 'E13'; // En corrección / Retrabajo
        const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
        ticket.bitacora.unshift({
          date: nowStr,
          user: "Interventoría Calidad (R06)",
          note: `ACTA DE NO CONFORMIDAD: [${defect}]. Instrucción de retrabajo: ${instructions}. Devuelto a E13.`
        });

        this.saveTickets();
        this.closeModal('modalR06NonConformity');
        this.renderR06Workspace();
        this.render();
        this.showToast(`Acta de no conformidad emitida. Devuelto a E13 En corrección`, 'warning');
      }

      // ==================== WORKSPACE R07 (ADMINISTRADOR DE PLATAFORMA) ====================
      renderR07Workspace() {
        const topCont = document.getElementById('r07TopologyViewer');
        if (!topCont) return;

        topCont.innerHTML = '';
        Object.keys(UNIVERSITY_HIERARCHY_4L).forEach(sede => {
          const buildings = UNIVERSITY_HIERARCHY_4L[sede];
          const bCount = Object.keys(buildings).length;

          const card = document.createElement('div');
          card.className = 'p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 space-y-1.5';

          let edHtml = '';
          Object.keys(buildings).slice(0, 3).forEach(ed => {
            const floorCount = Object.keys(buildings[ed]).length;
            edHtml += `<li class="text-[11px] text-slate-600 dark:text-slate-300 truncate">• ${ed} (${floorCount} niveles)</li>`;
          });

          card.innerHTML = `
            <div class="flex items-center justify-between pb-1.5 border-b border-slate-200/60 dark:border-slate-700/60">
              <span class="font-bold text-slate-800 dark:text-slate-100">${sede}</span>
              <span class="font-mono text-[10px] text-brand-royalBlue bg-blue-100 dark:bg-blue-950/60 px-1.5 py-0.2 rounded">${bCount} Edificios</span>
            </div>
            <ul class="space-y-0.5">
              ${edHtml}
            </ul>
          `;
          topCont.appendChild(card);
        });
      }

      openAddSpaceModal() {
        document.getElementById('addSpaceBloque').value = '';
        document.getElementById('addSpaceAula').value = '';
        document.getElementById('modalAddSpace').classList.remove('hidden');
      }

      submitAddSpace() {
        const sede = document.getElementById('addSpaceSede').value;
        const bloque = document.getElementById('addSpaceBloque').value.trim();
        const piso = document.getElementById('addSpacePiso').value.trim();
        const aula = document.getElementById('addSpaceAula').value.trim();

        if (!bloque || !piso || !aula) {
          this.showToast('Completa todos los campos del nuevo espacio', 'warning');
          return;
        }

        if (!UNIVERSITY_HIERARCHY_4L[sede]) UNIVERSITY_HIERARCHY_4L[sede] = {};
        if (!UNIVERSITY_HIERARCHY_4L[sede][bloque]) UNIVERSITY_HIERARCHY_4L[sede][bloque] = {};
        if (!UNIVERSITY_HIERARCHY_4L[sede][bloque][piso]) UNIVERSITY_HIERARCHY_4L[sede][bloque][piso] = [];

        UNIVERSITY_HIERARCHY_4L[sede][bloque][piso].push(aula);

        this.closeModal('modalAddSpace');
        this.renderR07Workspace();
        this.showToast(`Espacio "${aula}" agregado a la topología de ${sede}`, 'success');
      }

      // ==================== DETAIL & EDIT MODAL ====================
      openDetailModal(ticketId) {
        const ticket = this.tickets.find(t => t.id === ticketId);
        if (!ticket) return;

        this.selectedTicket = ticket;
        const sla = this.getSlaStatus(ticket);

        document.getElementById('detailCode').innerText = ticket.id;
        document.getElementById('detailTitle').innerText = ticket.title;
        document.getElementById('detailHierarchy').innerText = `${ticket.sede} > ${ticket.bloque} > ${ticket.aula}`;
        document.getElementById('detailDescription').innerText = ticket.description;
        document.getElementById('detailSeverityBadge').innerHTML = this.getSeverityBadge(ticket.severity);
        document.getElementById('detailStatusBadge').innerText = this.getStatusName(ticket.status);
        document.getElementById('editStatusSelect').value = ticket.status;
        document.getElementById('editTechnicianSelect').value = ticket.technician;
        document.getElementById('detailSlaCountdown').innerText = sla.text;
        
        const slaBar = document.getElementById('detailSlaBar');
        slaBar.style.width = `${sla.barPercent}%`;
        slaBar.className = `${sla.barColor} h-2 transition-all duration-300`;

        document.getElementById('detailCreatedDate').innerText = `Antigüedad: ${ticket.createdHoursAgo.toFixed(1)} horas transcurridas`;
        document.getElementById('detailReporterName').innerText = `Reportante: ${ticket.reporter}`;

        this.renderBitacoraList(ticket.bitacora);
        document.getElementById('newBitacoraNote').value = '';

        document.getElementById('modalDetailIncident').classList.remove('hidden');
      }

      renderBitacoraList(bitacora) {
        const cont = document.getElementById('detailBitacoraList');
        cont.innerHTML = '';
        if (!bitacora || bitacora.length === 0) {
          cont.innerHTML = '<p class="text-slate-400 italic">No hay notas registradas aún.</p>';
          return;
        }

        bitacora.forEach(item => {
          const div = document.createElement('div');
          div.className = 'p-2 rounded bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-xs';
          div.innerHTML = `
            <div class="flex items-center justify-between font-mono text-[10px] text-slate-400 mb-0.5">
              <span class="font-bold text-slate-600 dark:text-slate-300">${item.user}</span>
              <span>${item.date}</span>
            </div>
            <p class="text-slate-700 dark:text-slate-200 leading-snug">${item.note}</p>
          `;
          cont.appendChild(div);
        });
      }

      handleAddBitacoraNote() {
        if (!this.selectedTicket) return;
        const noteInput = document.getElementById('newBitacoraNote');
        const text = noteInput.value.trim();
        if (!text) return;

        const role = this.rolesDef.find(r => r.code === this.currentRole) || this.rolesDef[2];
        const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
        this.selectedTicket.bitacora.unshift({
          date: nowStr,
          user: `${role.user} (${role.code})`,
          note: text
        });

        noteInput.value = '';
        this.renderBitacoraList(this.selectedTicket.bitacora);
        this.saveTickets();
        this.showToast('Nota técnica registrada en bitácora', 'info');
      }

      handleSaveDetailChanges() {
        if (!this.selectedTicket) return;
        const newStatus = document.getElementById('editStatusSelect').value;
        const newTech = document.getElementById('editTechnicianSelect').value;
        const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
        const role = this.rolesDef.find(r => r.code === this.currentRole) || this.rolesDef[2];

        let changes = [];
        if (this.selectedTicket.status !== newStatus) {
          changes.push(`Estado cambiado a ${this.getStatusName(newStatus)}`);
          this.selectedTicket.status = newStatus;
        }

        if (this.selectedTicket.technician !== newTech) {
          changes.push(`Técnico asignado a: ${newTech || 'Sin asignar'}`);
          this.selectedTicket.technician = newTech;
        }

        if (changes.length > 0) {
          this.selectedTicket.bitacora.unshift({
            date: nowStr,
            user: `${role.user} (${role.code})`,
            note: changes.join('. ')
          });
        }

        this.saveTickets();
        this.closeModal('modalDetailIncident');
        this.render();
        if (this.contextView === 'workspace') this.renderRoleWorkspace();
        this.showToast(`Cambios guardados en ${this.selectedTicket.id}`, 'success');
      }

      handleDismissIncident() {
        if (!this.selectedTicket) return;
        const ticketId = this.selectedTicket.id;
        this.selectedTicket.status = 'E16';
        const role = this.rolesDef.find(r => r.code === this.currentRole) || this.rolesDef[2];
        const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
        this.selectedTicket.bitacora.unshift({
          date: nowStr,
          user: `${role.user} (${role.code})`,
          note: "Incidencia desestimada administrativamente (No procedente E16)."
        });
        this.saveTickets();
        this.closeModal('modalDetailIncident');
        this.render();
        if (this.contextView === 'workspace') this.renderRoleWorkspace();
        this.showToast(`Incidencia ${ticketId} desestimada (No procedente)`, 'warning');
      }

      // ==================== NEW INCIDENT MODAL (GENERAL) ====================
      openNewIncidentModal() {
        document.getElementById('formNewIncident').reset();
        document.getElementById('newBloque').innerHTML = '<option value="">Seleccionar Bloque...</option>';
        document.getElementById('newBloque').disabled = true;
        document.getElementById('newAula').innerHTML = '<option value="">Seleccionar Aula/Espacio...</option>';
        document.getElementById('newAula').disabled = true;
        document.getElementById('modalNewIncident').classList.remove('hidden');
      }

      onCascadeSedeChange() {
        const sede = document.getElementById('newSede').value;
        const bloqueSelect = document.getElementById('newBloque');
        const aulaSelect = document.getElementById('newAula');

        bloqueSelect.innerHTML = '<option value="">Seleccionar Bloque...</option>';
        aulaSelect.innerHTML = '<option value="">Seleccionar Aula/Espacio...</option>';
        aulaSelect.disabled = true;

        if (sede && UNIVERSITY_HIERARCHY_4L[sede]) {
          bloqueSelect.disabled = false;
          Object.keys(UNIVERSITY_HIERARCHY_4L[sede]).forEach(bloque => {
            const opt = document.createElement('option');
            opt.value = bloque;
            opt.innerText = bloque;
            bloqueSelect.appendChild(opt);
          });
        } else {
          bloqueSelect.disabled = true;
        }
      }

      onCascadeBloqueChange() {
        const sede = document.getElementById('newSede').value;
        const bloque = document.getElementById('newBloque').value;
        const aulaSelect = document.getElementById('newAula');

        aulaSelect.innerHTML = '<option value="">Seleccionar Aula/Espacio...</option>';

        if (sede && bloque && UNIVERSITY_HIERARCHY_4L[sede][bloque]) {
          aulaSelect.disabled = false;
          Object.keys(UNIVERSITY_HIERARCHY_4L[sede][bloque]).forEach(piso => {
            UNIVERSITY_HIERARCHY_4L[sede][bloque][piso].forEach(aula => {
              const opt = document.createElement('option');
              opt.value = aula;
              opt.innerText = `${piso} - ${aula}`;
              aulaSelect.appendChild(opt);
            });
          });
        } else {
          aulaSelect.disabled = true;
        }
      }

      handleCreateIncident(e) {
        e.preventDefault();
        const sede = document.getElementById('newSede').value;
        const bloque = document.getElementById('newBloque').value;
        const aula = document.getElementById('newAula').value;
        const title = document.getElementById('newTitle').value.trim();
        const category = document.getElementById('newCategory').value;
        let severity = document.getElementById('newSeverity').value;
        const reporter = document.getElementById('newReporter').value.trim();
        const technician = document.getElementById('newTechnician').value;
        const description = document.getElementById('newDescription').value.trim();
        const isHighRisk = document.getElementById('newHighRisk').checked;

        if (isHighRisk) {
          severity = 'CRITICA';
        }

        const nextNum = 142 + this.tickets.length;
        const newId = `TKT-2026-${String(nextNum).padStart(6, '0')}`;
        const slaMap = { 'CRITICA': 4, 'ALTA': 12, 'MEDIA': 48, 'BAJA': 96 };
        const slaHours = slaMap[severity] || 48;
        const initialStatus = technician ? 'E10' : (isHighRisk ? 'E05' : 'E01');
        const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

        const newTicket = {
          id: newId,
          title: title,
          category: category,
          severity: severity,
          sede: sede,
          bloque: bloque,
          aula: aula,
          reporter: reporter,
          technician: technician,
          status: initialStatus,
          createdHoursAgo: 0.1,
          slaHours: slaHours,
          description: description,
          bitacora: [
            {
              date: nowStr,
              user: reporter,
              note: `Radicado inicial creado. ${isHighRisk ? '⚠️ ALERTA: Registrado bajo bandera de Riesgo Inminente.' : ''}`
            }
          ]
        };

        if (technician) {
          newTicket.bitacora.unshift({
            date: nowStr,
            user: "Sistema de Despacho",
            note: `Cuadrilla asignada a: ${technician}. Pasa automáticamente a E10 Programada.`
          });
        }

        this.tickets.unshift(newTicket);
        this.saveTickets();
        this.closeModal('modalNewIncident');
        this.render();
        if (this.contextView === 'workspace') this.renderRoleWorkspace();

        this.showToast(`Incidencia ${newId} radicada con éxito en ${this.getStatusName(initialStatus)}`, 'success');
      }

      // ==================== TOAST NOTIFICATION SYSTEM ====================
      showToast(message, type = 'success') {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = 'pointer-events-auto flex items-center space-x-2.5 px-4 py-2.5 rounded-lg shadow-elevation-modal border text-xs font-semibold transform transition-all duration-300 translate-y-2 opacity-0';

        let icon = '';
        if (type === 'success') {
          toast.className += ' bg-emerald-900/90 text-white border-emerald-700 backdrop-blur-md';
          icon = '<svg class="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>';
        } else if (type === 'warning') {
          toast.className += ' bg-amber-900/90 text-white border-amber-700 backdrop-blur-md';
          icon = '<svg class="w-4 h-4 text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>';
        } else {
          toast.className += ' bg-slate-900/90 text-white border-slate-700 backdrop-blur-md';
          icon = '<svg class="w-4 h-4 text-sky-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>';
        }

        toast.innerHTML = `
          ${icon}
          <span>${message}</span>
        `;

        container.appendChild(toast);
        setTimeout(() => {
          toast.classList.remove('translate-y-2', 'opacity-0');
        }, 10);

        setTimeout(() => {
          toast.classList.add('translate-y-2', 'opacity-0');
          setTimeout(() => toast.remove(), 300);
        }, 3200);
      }

      // ==================== OMNIBOX MODAL ====================
      openOmniboxModal() {
        const modal = document.getElementById('modalOmnibox');
        modal.classList.remove('hidden');
        const input = document.getElementById('omniboxModalInput');
        input.value = '';
        input.focus();
        this.onOmniboxSearch('');
      }

      onOmniboxSearch(query) {
        const q = query.toLowerCase().trim();
        const resultsCont = document.getElementById('omniboxResults');
        resultsCont.innerHTML = '';

        const matches = this.tickets.filter(t => {
          if (!q) return true;
          const corpus = `${t.id} ${t.title} ${t.sede} ${t.bloque} ${t.aula} ${t.category} ${t.technician}`.toLowerCase();
          return corpus.includes(q);
        }).slice(0, 8);

        if (matches.length === 0) {
          resultsCont.innerHTML = '<p class="p-3 text-slate-400 italic text-center">No se encontraron incidencias que coincidan.</p>';
          return;
        }

        matches.forEach(t => {
          const div = document.createElement('div');
          div.className = 'p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-between rounded-lg transition';
          div.onclick = () => {
            this.closeModal('modalOmnibox');
            this.openDetailModal(t.id);
          };
          div.innerHTML = `
            <div>
              <div class="flex items-center space-x-2">
                <span class="font-mono font-bold text-brand-royalBlue">${t.id}</span>
                <span class="font-semibold text-slate-800 dark:text-slate-100">${t.title}</span>
              </div>
              <p class="text-[11px] text-slate-400 font-mono">${t.sede} > ${t.aula} • ${t.category}</p>
            </div>
            <span class="text-[11px] font-semibold text-slate-500">${this.getStatusName(t.status)}</span>
          `;
          resultsCont.appendChild(div);
        });
      }

      // ==================== CSV EXPORT ====================
      exportToCSV() {
        const headers = ["Radicado", "Asunto", "Sede", "Bloque", "Espacio", "Categoria", "Severidad", "Estado", "Tecnico_Asignado", "SLA_Horas", "Horas_Transcurridas", "Reportante"];
        
        const rows = this.tickets.map(t => [
          `"${t.id}"`,
          `"${t.title.replace(/"/g, '""')}"`,
          `"${t.sede}"`,
          `"${t.bloque}"`,
          `"${t.aula}"`,
          `"${t.category}"`,
          `"${t.severity}"`,
          `"${this.getStatusName(t.status)}"`,
          `"${t.technician || 'Sin Asignar'}"`,
          t.slaHours,
          t.createdHoursAgo,
          `"${t.reporter}"`
        ]);

        const csvContent = "\uFEFF" + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `PRAXIS_Incidencias_Export_${new Date().toISOString().substring(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      // ==================== GENERAL MODAL HELPERS ====================
      closeModal(id) {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
      }

      closeAllModals() {
        [
          'modalNewIncident', 'modalDetailIncident', 'modalOmnibox',
          'modalR01Clarification', 'modalR01Reopen', 'modalR02Clarification',
          'modalR02Duplicate', 'modalR02Dismiss', 'modalR02ItilMatrix',
          'modalR03AssignCrew', 'modalR03Requisition', 'modalR04FieldLog',
          'modalR04FinishWork', 'modalR05Approve', 'modalR05Reject',
          'modalR06Conformity', 'modalR06NonConformity', 'modalAddSpace'
        ].forEach(id => {
          this.closeModal(id);
        });
        this.closeProfileMenu();
      }
    }

    // Initialize application on window load
    window.addEventListener('DOMContentLoaded', () => {
      window.app = new PraxisApp();
    });
  </script>
</body>
</html>
