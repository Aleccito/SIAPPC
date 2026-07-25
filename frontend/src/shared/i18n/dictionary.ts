// Spanish is the product language. English is a toggle for demos to visitors
// who do not read Spanish, so both dictionaries must stay in step: the Strings
// type below makes a missing English key a compile error.
export type Language = 'es' | 'en'

const es = {
  'nav.dashboard': 'Inicio',
  'nav.powerbi': 'Power BI',
  'nav.flexsim': 'FlexSim',
  'nav.patients': 'Pacientes',
  'nav.reports': 'Reportes',
  'nav.users': 'Usuarios',

  'action.signIn': 'Iniciar sesión',
  'action.signOut': 'Cerrar sesión',
  'action.cancel': 'Cancelar',
  'action.close': 'Cerrar',
  'language.switch': 'Cambiar a inglés',

  'login.eyebrow': 'Proyecto final',
  'login.headline1': 'Simula el flujo hospitalario.',
  'login.headline2': 'Mejora la atención al paciente.',
  'login.lead':
    'Sistema modular para simulación hospitalaria, seguimiento de pacientes y los reportes que los conectan.',
  'login.cap.simulation.title': 'Simulación',
  'login.cap.simulation.body':
    'Las corridas de FlexSim se encolan como trabajos por lotes. Cada una reporta rendimiento, utilización y el cuello de botella encontrado.',
  'login.cap.patients.title': 'Pacientes',
  'login.cap.patients.body':
    'Registra pacientes, asígnalos a un módulo de atención y consulta su información en cualquier momento.',
  'login.cap.reporting.title': 'Reportes',
  'login.cap.reporting.body':
    'Los tableros de Power BI y los reportes leen los mismos datos que escribe la simulación en MariaDB.',
  'login.phaseNote':
    'La fase 1 es solo la interfaz. Cada llamada al servidor es una implementación falsa que conserva la firma real.',
  'login.title': 'Iniciar sesión',
  'login.hint': 'Usa cualquier correo y contraseña por ahora',
  'login.email': 'Correo',
  'login.password': 'Contraseña',
  'login.pending': 'Iniciando sesión…',
  'login.failed': 'No se pudo iniciar sesión',

  'dashboard.welcome': 'Bienvenido, {name}',
  'dashboard.powerbi.title': 'Power BI',
  'dashboard.powerbi.body':
    'El reporte incrustado aparece aquí cuando el servidor entregue el token de incrustación.',
  'dashboard.flexsim.title': 'FlexSim',
  'dashboard.flexsim.body':
    'Las corridas se encolan en el servidor y los resultados se leen de la base de datos.',
  'dashboard.data.title': 'Datos',
  'dashboard.data.body': 'MariaDB llega en la fase 2, detrás de la API.',

  'powerbi.title': 'Power BI',
  'powerbi.loading': 'Cargando reporte…',
  'powerbi.placeholder':
    'El reporte se muestra aquí cuando el servidor entregue el token de incrustación.',
  'powerbi.unavailable': 'Reporte no disponible',
  'powerbi.report': 'Reporte {id}',

  'flexsim.title': 'FlexSim',
  'flexsim.queueRun': 'Encolar corrida',
  'flexsim.queueError': 'No se pudo encolar la corrida',
  'flexsim.empty': 'Aún no hay corridas. Elige un modelo y encola una.',
  'flexsim.col.run': 'Corrida',
  'flexsim.col.model': 'Modelo',
  'flexsim.col.status': 'Estado',
  'flexsim.col.throughput': 'Rendimiento',
  'flexsim.col.utilization': 'Utilización',
  'flexsim.col.bottleneck': 'Cuello de botella',
  'runStatus.queued': 'en cola',
  'runStatus.running': 'corriendo',
  'runStatus.completed': 'completada',
  'runStatus.failed': 'fallida',

  'reports.title': 'Reportes',
  'reports.col.name': 'Nombre',
  'reports.col.source': 'Origen',
  'reports.col.status': 'Estado',
  'reports.col.updated': 'Actualizado',
  'reports.empty': 'No hay reportes.',
  'reportStatus.ready': 'listo',
  'reportStatus.running': 'generando',
  'reportStatus.failed': 'fallido',

  'users.title': 'Usuarios',
  'users.col.name': 'Nombre',
  'users.col.email': 'Correo',
  'users.col.role': 'Rol',
  'users.empty': 'No hay usuarios que mostrar.',
  'users.updateError': 'No se pudo actualizar el rol',
  'role.admin': 'administrador',
  'role.user': 'usuario',

  'patients.title': 'Pacientes',
  'patients.add': 'Registrar paciente',
  'patients.empty': 'Aún no hay pacientes registrados.',
  'patients.addError': 'No se pudo registrar el paciente',
  'patients.col.name': 'Nombre',
  'patients.col.document': 'Documento',
  'patients.col.module': 'Módulo',
  'patients.col.status': 'Estado',
  'patients.col.arrived': 'Ingreso',
  'patients.form.title': 'Registrar paciente',
  'patients.form.name': 'Nombre completo',
  'patients.form.document': 'Documento de identidad',
  'patients.form.module': 'Módulo de atención',
  'patients.form.reason': 'Motivo de consulta',
  'patients.form.submit': 'Registrar',
  'patients.details.title': 'Ficha del paciente',
  'patients.details.reason': 'Motivo de consulta',
  'patients.details.none': 'Sin registrar',
  'patients.filter.all': 'Todos los módulos',
  'patientStatus.waiting': 'en espera',
  'patientStatus.inService': 'en atención',
  'patientStatus.discharged': 'dado de alta',
} as const

export type StringKey = keyof typeof es
type Strings = Record<StringKey, string>

const en: Strings = {
  'nav.dashboard': 'Home',
  'nav.powerbi': 'Power BI',
  'nav.flexsim': 'FlexSim',
  'nav.patients': 'Patients',
  'nav.reports': 'Reports',
  'nav.users': 'Users',

  'action.signIn': 'Sign in',
  'action.signOut': 'Sign out',
  'action.cancel': 'Cancel',
  'action.close': 'Close',
  'language.switch': 'Switch to Spanish',

  'login.eyebrow': 'Final project',
  'login.headline1': 'Simulate hospital flow.',
  'login.headline2': 'Improve patient service.',
  'login.lead':
    'A modular system for hospital simulation, patient tracking, and the reporting that ties them together.',
  'login.cap.simulation.title': 'Simulation',
  'login.cap.simulation.body':
    'FlexSim runs are queued as batch jobs. Each one reports throughput, utilisation, and the bottleneck it found.',
  'login.cap.patients.title': 'Patients',
  'login.cap.patients.body':
    'Register patients, assign them to a service module, and read their record at any point.',
  'login.cap.reporting.title': 'Reporting',
  'login.cap.reporting.body':
    'Power BI dashboards and reports read the same MariaDB data the simulation writes.',
  'login.phaseNote':
    'Phase 1 is the frontend only. Every backend call is a stub with the real signature.',
  'login.title': 'Sign in',
  'login.hint': 'Use any email and password for now',
  'login.email': 'Email',
  'login.password': 'Password',
  'login.pending': 'Signing in…',
  'login.failed': 'Login failed',

  'dashboard.welcome': 'Welcome, {name}',
  'dashboard.powerbi.title': 'Power BI',
  'dashboard.powerbi.body':
    'The embedded report lands here once the embed-token endpoint exists.',
  'dashboard.flexsim.title': 'FlexSim',
  'dashboard.flexsim.body':
    'Runs are queued on the backend and results are read from the database.',
  'dashboard.data.title': 'Data',
  'dashboard.data.body': 'MariaDB lands in phase 2, behind the API.',

  'powerbi.title': 'Power BI',
  'powerbi.loading': 'Loading report…',
  'powerbi.placeholder': 'The report renders here once the embed endpoint exists.',
  'powerbi.unavailable': 'Report unavailable',
  'powerbi.report': 'Report {id}',

  'flexsim.title': 'FlexSim',
  'flexsim.queueRun': 'Queue run',
  'flexsim.queueError': 'Could not queue the run',
  'flexsim.empty': 'No runs yet. Pick a model and queue one.',
  'flexsim.col.run': 'Run',
  'flexsim.col.model': 'Model',
  'flexsim.col.status': 'Status',
  'flexsim.col.throughput': 'Throughput',
  'flexsim.col.utilization': 'Utilisation',
  'flexsim.col.bottleneck': 'Bottleneck',
  'runStatus.queued': 'queued',
  'runStatus.running': 'running',
  'runStatus.completed': 'completed',
  'runStatus.failed': 'failed',

  'reports.title': 'Reports',
  'reports.col.name': 'Name',
  'reports.col.source': 'Source',
  'reports.col.status': 'Status',
  'reports.col.updated': 'Updated',
  'reports.empty': 'No reports.',
  'reportStatus.ready': 'ready',
  'reportStatus.running': 'running',
  'reportStatus.failed': 'failed',

  'users.title': 'Users',
  'users.col.name': 'Name',
  'users.col.email': 'Email',
  'users.col.role': 'Role',
  'users.empty': 'No users to show.',
  'users.updateError': 'Could not update the role',
  'role.admin': 'admin',
  'role.user': 'user',

  'patients.title': 'Patients',
  'patients.add': 'Register patient',
  'patients.empty': 'No patients registered yet.',
  'patients.addError': 'Could not register the patient',
  'patients.col.name': 'Name',
  'patients.col.document': 'Document',
  'patients.col.module': 'Module',
  'patients.col.status': 'Status',
  'patients.col.arrived': 'Arrived',
  'patients.form.title': 'Register patient',
  'patients.form.name': 'Full name',
  'patients.form.document': 'Identity document',
  'patients.form.module': 'Service module',
  'patients.form.reason': 'Reason for visit',
  'patients.form.submit': 'Register',
  'patients.details.title': 'Patient record',
  'patients.details.reason': 'Reason for visit',
  'patients.details.none': 'Not recorded',
  'patients.filter.all': 'All modules',
  'patientStatus.waiting': 'waiting',
  'patientStatus.inService': 'in service',
  'patientStatus.discharged': 'discharged',
}

export const dictionaries: Record<Language, Strings> = { es, en }
