// Pantalla "med/perfil/mi-perfil" (Figma node 137:9) — generada desde el diseño original de Figma.
import { Link } from 'react-router-dom';
import imgActivity from '../../assets/activity.svg';
import imgAvatar10Png from '../../assets/avatar-10.png';
import imgBell from '../../assets/bell.svg';
import imgCalendar from '../../assets/calendar.svg';
import imgCpu from '../../assets/cpu.svg';
import imgDoctorFooterLine2 from '../../assets/doctor-footer-line-2.svg';
import imgFileText from '../../assets/file-text.svg';
import imgHelpIconEllipse from '../../assets/help-icon-ellipse.svg';
import imgIconwrapper from '../../assets/iconwrapper.svg';
import imgLayoutDashboard from '../../assets/layout-dashboard.svg';
import imgLogOut from '../../assets/log-out.svg';
import imgNotificationsPrefCardLine from '../../assets/notifications-pref-card-line.svg';
import imgProInfoCardLine from '../../assets/pro-info-card-line.svg';
import imgSwitchTrack from '../../assets/switch-track.svg';
import imgSwitchTrack2 from '../../assets/switch-track-2.svg';
import imgUsers2 from '../../assets/users-2.svg';

export default function MedPerfilMiPerfil() {
  return (
    <div className="bg-[#f8fafc] content-stretch flex items-start min-h-[900px] relative shrink-0 w-[1440px]" data-name="med/perfil/mi-perfil">
      <div className="bg-[#0f172a] border-[#1e293b] border-r border-solid content-stretch flex flex-col items-start justify-between px-[16px] py-[24px] relative self-stretch shrink-0 w-[240px]" data-name="sidebar">
        <div className="content-stretch flex flex-col gap-[32px] items-start relative shrink-0 w-full" data-name="top-group">
          <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-name="brand">
            <div className="bg-[#2563eb] content-stretch flex flex-col items-center justify-center relative rounded-[8px] shrink-0 size-[32px]" data-name="logo-mark">
              <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[14px] text-white whitespace-nowrap">S</p>
            </div>
            <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px relative whitespace-nowrap" data-name="wordmark">
              <p className="font-jakarta font-extrabold relative shrink-0 text-[16px] text-white">SIAPPC</p>
              <p className="font-jakarta font-semibold relative shrink-0 text-[#64748b] text-[10px] uppercase">CUIDADO CRÍTICO</p>
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="menu">
            <Link className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Dashboard" to="/MedDashboardPrincipal">
              <div className="relative shrink-0 size-[18px]" data-name="layout-dashboard">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgLayoutDashboard} />
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Dashboard</p>
            </Link>
            <Link className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Pacientes" to="/MedPacientesLista">
              <div className="relative shrink-0 size-[18px]" data-name="users">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgUsers2} />
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Pacientes</p>
            </Link>
            <Link className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Monitoreo" to="/MedMonitoreoGridUci">
              <div className="relative shrink-0 size-[18px]" data-name="activity">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgActivity} />
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Monitoreo</p>
            </Link>
            <Link className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Alertas" to="/MedAlertasCentro">
              <div className="relative shrink-0 size-[18px]" data-name="bell">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgBell} />
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Alertas</p>
            </Link>
            <Link className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Reportes" to="/MedReportesPanel">
              <div className="relative shrink-0 size-[18px]" data-name="file-text">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgFileText} />
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Reportes</p>
            </Link>
            <Link className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Dispositivos" to="/MedDispositivosMonitores">
              <div className="relative shrink-0 size-[18px]" data-name="cpu">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgCpu} />
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Dispositivos</p>
            </Link>
          </div>
        </div>
        <Link className="absolute left-[20px] opacity-25 size-[18px] top-[790px]" data-name="help-icon" to="/MedAyudaSoporte">
          <div className="absolute left-0 size-[18px] top-0" data-name="Ellipse">
            <div className="absolute inset-[-4.17%]">
              <img className="block max-w-none size-full" alt="" src={imgHelpIconEllipse} />
            </div>
          </div>
          <p className="[word-break:break-word] absolute font-geist font-bold leading-[normal] left-[5.5px] text-[#64748b] text-[11px] top-[1.5px] whitespace-nowrap">?</p>
        </Link>
        <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="doctor-footer">
          <div className="h-0 relative shrink-0 w-full" data-name="Line">
            <div className="absolute inset-[-1px_0_0_0]">
              <img className="block max-w-none size-full" alt="" src={imgDoctorFooterLine2} />
            </div>
          </div>
          <Link className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-name="user-profile" to="/MedPerfilMiPerfil">
            <div className="relative rounded-[20px] shrink-0 size-[40px]" data-name="avatar">
              <img className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[20px] size-full" alt="" src={imgAvatar10Png} />
            </div>
            <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px relative whitespace-nowrap" data-name="user-info">
              <p className="font-jakarta font-bold overflow-hidden relative shrink-0 text-[13px] text-ellipsis text-white">Dr. Carlos Méndez</p>
              <p className="font-jakarta font-medium overflow-hidden relative shrink-0 text-[#64748b] text-[11px] text-ellipsis">Médico Intensivista</p>
            </div>
            <div className="relative shrink-0 size-[18px]" data-name="log-out">
              <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgLogOut} />
            </div>
          </Link>
        </div>
      </div>
      <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px relative self-stretch" data-name="main-container">
        <div className="bg-white border-[#e2e8f0] border-b border-solid content-stretch flex h-[72px] items-center justify-between px-[32px] relative shrink-0 w-full" data-name="top-bar">
          <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start leading-[normal] relative shrink-0 whitespace-nowrap" data-name="title-breadcrumb">
            <p className="font-jakarta font-medium relative shrink-0 text-[#64748b] text-[12px]">{`SIAPPC > Mi Perfil`}</p>
            <p className="font-jakarta font-extrabold relative shrink-0 text-[#0f172a] text-[20px]">Mi Perfil</p>
          </div>
          <div className="content-stretch flex gap-[20px] items-center overflow-clip relative shrink-0" data-name="right-actions">
            <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="datetime">
              <div className="relative shrink-0 size-[14px]" data-name="calendar">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgCalendar} />
              </div>
              <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[13px] whitespace-nowrap">24 Oct 2025, 08:30</p>
            </div>
            <Link className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex items-center justify-center relative rounded-[18px] shrink-0 size-[36px]" data-name="notification-bell" to="/MedNotificacionesCentro">
              <div className="relative shrink-0 size-[18px]" data-name="IconWrapper">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgIconwrapper} />
              </div>
              <div className="absolute bg-[#ef4444] content-stretch flex items-center justify-center right-[-3px] rounded-[8px] size-[16px] top-[-3px]" data-name="red-badge">
                <p className="[word-break:break-word] font-geist font-extrabold leading-[normal] relative shrink-0 text-[10px] text-white whitespace-nowrap">3</p>
              </div>
            </Link>
          </div>
        </div>
        <div className="content-stretch flex flex-[1_0_0] gap-[24px] items-start min-h-px p-[32px] relative w-full" data-name="page-body">
          <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0 w-[680px]" data-name="left-column">
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex gap-[20px] items-start p-[24px] relative rounded-[12px] shrink-0 w-full" data-name="profile-card">
              <div className="bg-[#2563eb] content-stretch flex flex-col items-center justify-center relative rounded-[40px] shrink-0 size-[80px]" data-name="avatar-large">
                <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[28px] text-white whitespace-nowrap">CM</p>
              </div>
              <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-w-px relative" data-name="profile-summary">
                <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="name-badge-row">
                  <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#0f172a] text-[22px] whitespace-nowrap">Dr. Carlos Méndez Herrera</p>
                  <div className="bg-[rgba(37,99,235,0.15)] content-stretch flex items-start px-[10px] py-[4px] relative rounded-[6px] shrink-0" data-name="badge">
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#2563eb] text-[11px] whitespace-nowrap">Médico</p>
                  </div>
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-col font-jakarta font-normal gap-[4px] items-start leading-[0] relative shrink-0 text-[#64748b] text-[13px] w-full whitespace-nowrap" data-name="meta-list">
                  <p className="relative shrink-0"><span className="leading-[normal]">{`Especialidad: `}</span><span className="font-jakarta font-semibold leading-[normal] text-[#0f172a]">Médico Intensivista</span></p>
                  <p className="relative shrink-0"><span className="leading-[normal]">{`Email: `}</span><span className="font-jakarta font-semibold leading-[normal] text-[#0f172a]">c.mendez@hospital.gob.mx</span></p>
                  <p className="relative shrink-0"><span className="leading-[normal]">{`ID Empleado: `}</span><span className="font-jakarta font-semibold leading-[normal] text-[#0f172a]">MED-0042</span></p>
                </div>
              </div>
            </div>
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[16px] items-start p-[24px] relative rounded-[12px] shrink-0 w-full" data-name="pro-info-card">
              <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#0f172a] text-[16px] whitespace-nowrap">Información Profesional</p>
              <div className="h-0 relative shrink-0 w-full" data-name="Line">
                <div className="absolute inset-[-1px_0_0_0]">
                  <img className="block max-w-none size-full" alt="" src={imgProInfoCardLine} />
                </div>
              </div>
              <div className="[word-break:break-word] content-stretch flex flex-col gap-[12px] items-start leading-[normal] relative shrink-0 text-[13px] w-full whitespace-nowrap" data-name="info-grid">
                <div className="content-stretch flex items-start justify-between py-[4px] relative shrink-0 w-full" data-name="grid-row">
                  <p className="font-jakarta font-medium relative shrink-0 text-[#64748b]">Especialidad principal</p>
                  <p className="font-jakarta font-semibold relative shrink-0 text-[#0f172a]">Medicina Crítica y Terapia Intensiva</p>
                </div>
                <div className="content-stretch flex items-start justify-between py-[4px] relative shrink-0 w-full" data-name="grid-row">
                  <p className="font-jakarta font-medium relative shrink-0 text-[#64748b]">Cédula Profesional</p>
                  <p className="font-jakarta font-semibold relative shrink-0 text-[#0f172a]">DE-882194-X</p>
                </div>
                <div className="content-stretch flex items-start justify-between py-[4px] relative shrink-0 w-full" data-name="grid-row">
                  <p className="font-jakarta font-medium relative shrink-0 text-[#64748b]">Años de experiencia</p>
                  <p className="font-jakarta font-semibold relative shrink-0 text-[#0f172a]">15 años</p>
                </div>
                <div className="content-stretch flex items-start justify-between py-[4px] relative shrink-0 w-full" data-name="grid-row">
                  <p className="font-jakarta font-medium relative shrink-0 text-[#64748b]">Unidad asignada</p>
                  <p className="font-jakarta font-semibold relative shrink-0 text-[#0f172a]">Unidad de Cuidados Intensivos (UCI) - Cama 01 a 12</p>
                </div>
                <div className="content-stretch flex items-start justify-between py-[4px] relative shrink-0 w-full" data-name="grid-row">
                  <p className="font-jakarta font-medium relative shrink-0 text-[#64748b]">Turno asignado</p>
                  <p className="font-jakarta font-semibold relative shrink-0 text-[#0f172a]">Matutino (07:00 AM - 15:00 PM)</p>
                </div>
              </div>
            </div>
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[16px] items-start p-[24px] relative rounded-[12px] shrink-0 w-full" data-name="security-card">
              <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#0f172a] text-[16px] whitespace-nowrap">Seguridad y Acceso</p>
              <div className="h-0 relative shrink-0 w-full" data-name="Line">
                <div className="absolute inset-[-1px_0_0_0]">
                  <img className="block max-w-none size-full" alt="" src={imgProInfoCardLine} />
                </div>
              </div>
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="security-body">
                <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start leading-[normal] min-w-px relative" data-name="security-text">
                  <p className="font-jakarta font-semibold relative shrink-0 text-[#0f172a] text-[14px] whitespace-nowrap">Autenticación y Seguridad</p>
                  <p className="font-jakarta font-normal min-w-full relative shrink-0 text-[#64748b] text-[12px] w-[min-content]">Último cambio de contraseña hace 3 meses. El acceso MFA añade protección crítica.</p>
                </div>
                <div className="content-stretch flex gap-[10px] items-start relative shrink-0" data-name="security-actions">
                  <div className="border border-[#e2e8f0] border-solid content-stretch flex items-start px-[16px] py-[8px] relative rounded-[8px] shrink-0" data-name="btn-password">
                    <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] whitespace-nowrap">Cambiar Contraseña</p>
                  </div>
                  <div className="bg-[#2563eb] content-stretch flex items-start px-[16px] py-[8px] relative rounded-[8px] shrink-0" data-name="btn-mfa">
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[13px] text-white whitespace-nowrap">Configurar MFA</p>
                  </div>
                </div>
              </div>
              <div className="border-[#e2e8f0] border-solid border-t content-stretch flex items-start pt-[10px] relative shrink-0 w-full" data-name="last-login">
                <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#64748b] text-[11px] whitespace-nowrap">Último inicio de sesión: Hoy 24 Oct, 07:02 AM desde IP 192.168.10.45</p>
              </div>
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0 w-[420px]" data-name="right-column">
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[16px] items-start p-[24px] relative rounded-[12px] shrink-0 w-full" data-name="notifications-pref-card">
              <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#0f172a] text-[16px] whitespace-nowrap">Preferencias de Notificaciones</p>
              <div className="h-0 relative shrink-0 w-full" data-name="Line">
                <div className="absolute inset-[-1px_0_0_0]">
                  <img className="block max-w-none size-full" alt="" src={imgNotificationsPrefCardLine} />
                </div>
              </div>
              <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="toggle-list">
                <div className="content-stretch flex items-center justify-between py-[8px] relative shrink-0 w-full" data-name="toggle-row">
                  <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#0f172a] text-[14px] whitespace-nowrap">Alertas críticas en tiempo real</p>
                  <div className="h-[20px] relative shrink-0 w-[36px]" data-name="switch-track">
                    <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgSwitchTrack} />
                  </div>
                </div>
                <div className="content-stretch flex items-center justify-between py-[8px] relative shrink-0 w-full" data-name="toggle-row">
                  <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#0f172a] text-[14px] whitespace-nowrap">Alertas de prioridad alta</p>
                  <div className="h-[20px] relative shrink-0 w-[36px]" data-name="switch-track">
                    <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgSwitchTrack} />
                  </div>
                </div>
                <div className="content-stretch flex items-center justify-between py-[8px] relative shrink-0 w-full" data-name="toggle-row">
                  <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#0f172a] text-[14px] whitespace-nowrap">Nuevas asignaciones de pacientes</p>
                  <div className="h-[20px] relative shrink-0 w-[36px]" data-name="switch-track">
                    <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgSwitchTrack} />
                  </div>
                </div>
                <div className="content-stretch flex items-center justify-between py-[8px] relative shrink-0 w-full" data-name="toggle-row">
                  <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#0f172a] text-[14px] whitespace-nowrap">Reportes de turno semanales</p>
                  <div className="h-[20px] relative shrink-0 w-[36px]" data-name="switch-track">
                    <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgSwitchTrack2} />
                  </div>
                </div>
                <div className="content-stretch flex items-center justify-between py-[8px] relative shrink-0 w-full" data-name="toggle-row">
                  <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#0f172a] text-[14px] whitespace-nowrap">Sonido y vibración de alerta médica</p>
                  <div className="h-[20px] relative shrink-0 w-[36px]" data-name="switch-track">
                    <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgSwitchTrack} />
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[16px] items-start p-[24px] relative rounded-[12px] shrink-0 w-full" data-name="stats-month-card">
              <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#0f172a] text-[16px] whitespace-nowrap">Estadísticas del Mes</p>
              <div className="h-0 relative shrink-0 w-full" data-name="Line">
                <div className="absolute inset-[-1px_0_0_0]">
                  <img className="block max-w-none size-full" alt="" src={imgNotificationsPrefCardLine} />
                </div>
              </div>
              <div className="[word-break:break-word] content-stretch flex flex-col gap-[12px] items-start leading-[normal] relative shrink-0 w-full whitespace-nowrap" data-name="stats-grid">
                <div className="bg-[#f8fafc] content-stretch flex items-center justify-between p-[16px] relative rounded-[10px] shrink-0 w-full" data-name="stat-item">
                  <p className="font-jakarta font-semibold relative shrink-0 text-[#64748b] text-[13px]">Pacientes atendidos</p>
                  <p className="font-jakarta font-extrabold relative shrink-0 text-[#2563eb] text-[18px]">23</p>
                </div>
                <div className="bg-[#f8fafc] content-stretch flex items-center justify-between p-[16px] relative rounded-[10px] shrink-0 w-full" data-name="stat-item">
                  <p className="font-jakarta font-semibold relative shrink-0 text-[#64748b] text-[13px]">Notas SOAP registradas</p>
                  <p className="font-jakarta font-extrabold relative shrink-0 text-[#10b981] text-[18px]">47</p>
                </div>
                <div className="bg-[#f8fafc] content-stretch flex items-center justify-between p-[16px] relative rounded-[10px] shrink-0 w-full" data-name="stat-item">
                  <p className="font-jakarta font-semibold relative shrink-0 text-[#64748b] text-[13px]">Alertas respondidas</p>
                  <p className="font-jakarta font-extrabold relative shrink-0 text-[#ef4444] text-[18px]">31</p>
                </div>
                <div className="bg-[#f8fafc] content-stretch flex items-center justify-between p-[16px] relative rounded-[10px] shrink-0 w-full" data-name="stat-item">
                  <p className="font-jakarta font-semibold relative shrink-0 text-[#64748b] text-[13px]">Tiempo resp. promedio</p>
                  <p className="font-jakarta font-extrabold relative shrink-0 text-[#f59e0b] text-[18px]">2.1 min</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
