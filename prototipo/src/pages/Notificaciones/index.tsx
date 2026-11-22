// Pantalla "notificaciones" (Figma node 48:447) — generada desde el diseño original de Figma.
import { Link } from 'react-router-dom';
import imgActivity from '../../assets/activity.svg';
import imgActivity4 from '../../assets/activity-4.svg';
import imgAvatar9Png from '../../assets/avatar-9.png';
import imgBell from '../../assets/bell.svg';
import imgBell4 from '../../assets/bell-4.svg';
import imgBell5 from '../../assets/bell-5.svg';
import imgCheckCircle from '../../assets/check-circle.svg';
import imgChevronDown3 from '../../assets/chevron-down-3.svg';
import imgCpu from '../../assets/cpu.svg';
import imgCpu2 from '../../assets/cpu-2.svg';
import imgCpu3 from '../../assets/cpu-3.svg';
import imgDoctorFooterLine from '../../assets/doctor-footer-line.svg';
import imgFileText from '../../assets/file-text.svg';
import imgHelpIconEllipse from '../../assets/help-icon-ellipse.svg';
import imgIconwrapper from '../../assets/iconwrapper.svg';
import imgLayoutDashboard2 from '../../assets/layout-dashboard-2.svg';
import imgLogOut from '../../assets/log-out.svg';
import imgUnreadIndicatorContainer from '../../assets/unread-indicator-container.svg';
import imgUsers2 from '../../assets/users-2.svg';
import imgUsers4 from '../../assets/users-4.svg';

export default function Notificaciones() {
  return (
    <div className="content-stretch flex flex-col items-start overflow-clip relative rounded-[20px] shrink-0" data-name="notificaciones">
      <div className="bg-[#f8fafc] content-stretch flex h-[900px] items-start overflow-clip relative shrink-0 w-[1440px]" data-name="SIAPPC-Notificaciones">
        <div className="bg-[#0f172a] border-[#1e293b] border-r border-solid content-stretch flex flex-col h-[900px] items-start justify-between px-[16px] py-[24px] relative shrink-0 w-[240px]" data-name="sidebar">
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
              <Link className="bg-[rgba(37,99,235,0.15)] content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Dashboard" to="/MedDashboardPrincipal">
                <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[18px]" data-name="icon-layout-dashboard">
                  <div className="relative shrink-0 size-[18px]" data-name="layout-dashboard">
                    <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgLayoutDashboard2} />
                  </div>
                </div>
                <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[14px] text-white whitespace-nowrap">Dashboard</p>
              </Link>
              <Link className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Pacientes" to="/MedPacientesLista">
                <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[18px]" data-name="icon-users">
                  <div className="relative shrink-0 size-[18px]" data-name="users">
                    <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgUsers2} />
                  </div>
                </div>
                <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#94a3b8] text-[14px] whitespace-nowrap">Pacientes</p>
              </Link>
              <Link className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Monitoreo" to="/MedMonitoreoGridUci">
                <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[18px]" data-name="icon-activity">
                  <div className="relative shrink-0 size-[18px]" data-name="activity">
                    <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgActivity} />
                  </div>
                </div>
                <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#94a3b8] text-[14px] whitespace-nowrap">Monitoreo</p>
              </Link>
              <Link className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Alertas" to="/MedAlertasCentro">
                <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[18px]" data-name="icon-bell">
                  <div className="relative shrink-0 size-[18px]" data-name="bell">
                    <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgBell} />
                  </div>
                </div>
                <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#94a3b8] text-[14px] whitespace-nowrap">Alertas</p>
              </Link>
              <Link className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Reportes" to="/MedReportesPanel">
                <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[18px]" data-name="icon-file-text">
                  <div className="relative shrink-0 size-[18px]" data-name="file-text">
                    <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgFileText} />
                  </div>
                </div>
                <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#94a3b8] text-[14px] whitespace-nowrap">Reportes</p>
              </Link>
              <Link className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Dispositivos" to="/MedDispositivosMonitores">
                <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[18px]" data-name="icon-cpu">
                  <div className="relative shrink-0 size-[18px]" data-name="cpu">
                    <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgCpu} />
                  </div>
                </div>
                <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#94a3b8] text-[14px] whitespace-nowrap">Dispositivos</p>
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
                <img className="block max-w-none size-full" alt="" src={imgDoctorFooterLine} />
              </div>
            </div>
            <Link className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-name="user-profile" to="/MedPerfilMiPerfil">
              <div className="relative rounded-[20px] shrink-0 size-[40px]" data-name="avatar">
                <img className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[20px] size-full" alt="" src={imgAvatar9Png} />
              </div>
              <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px relative whitespace-nowrap" data-name="user-info">
                <p className="font-jakarta font-bold overflow-hidden relative shrink-0 text-[13px] text-ellipsis text-white">Dr. Roberto Silva</p>
                <p className="font-jakarta font-medium overflow-hidden relative shrink-0 text-[#64748b] text-[11px] text-ellipsis">Médico Intensivista</p>
              </div>
              <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[18px]" data-name="icon-log-out">
                <div className="relative shrink-0 size-[18px]" data-name="log-out">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgLogOut} />
                </div>
              </div>
            </Link>
          </div>
        </div>
        <div className="content-stretch flex flex-[1_0_0] flex-col h-full items-start min-w-px relative" data-name="main-container">
          <div className="bg-white border-[#e2e8f0] border-b border-solid content-stretch flex h-[72px] items-center justify-between px-[32px] relative shrink-0 w-full" data-name="top-bar">
            <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start leading-[normal] relative shrink-0 whitespace-nowrap" data-name="title-breadcrumb">
              <p className="font-jakarta font-medium relative shrink-0 text-[#64748b] text-[12px]">{`SIAPPC > Notificaciones`}</p>
              <p className="font-jakarta font-extrabold relative shrink-0 text-[#0f172a] text-[20px]">Bandeja de Notificaciones</p>
            </div>
            <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="right-actions">
              <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Frame">
                <p className="[text-underline-position:from-font] [word-break:break-word] decoration-from-font decoration-solid font-jakarta font-bold leading-[normal] relative shrink-0 text-[#2563eb] text-[13px] underline whitespace-nowrap">Marcar todas como leídas</p>
                <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex gap-[8px] items-start px-[12px] py-[8px] relative rounded-[8px] shrink-0" data-name="filter">
                  <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] whitespace-nowrap">Tipo: Todas</p>
                  <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[12px]" data-name="icon-chevron-down">
                    <div className="relative shrink-0 size-[12px]" data-name="chevron-down">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgChevronDown3} />
                    </div>
                  </div>
                </div>
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
          <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px overflow-clip p-[32px] relative w-full" data-name="page-body">
            <div className="content-stretch flex flex-[1_0_0] flex-col gap-[24px] items-start min-h-px relative w-full" data-name="notifications-scroll">
              <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full" data-name="group-section">
                <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#64748b] text-[13px] uppercase whitespace-nowrap">Hoy</p>
                <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="items-stack">
                  <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex gap-[16px] items-center p-[16px] relative rounded-[12px] shrink-0 w-full" data-name="notification-card">
                    <div className="relative shrink-0 size-[12px]" data-name="unread-indicator-container">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgUnreadIndicatorContainer} />
                    </div>
                    <div className="bg-[#fef2f2] content-stretch flex items-start p-[10px] relative rounded-[100px] shrink-0" data-name="icon-bg">
                      <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[16px]" data-name="icon-bell">
                        <div className="relative shrink-0 size-[16px]" data-name="bell">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgBell4} />
                        </div>
                      </div>
                    </div>
                    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px relative whitespace-nowrap" data-name="text-content">
                      <p className="font-jakarta font-extrabold relative shrink-0 text-[#0f172a] text-[14px]">Alerta Crítica: Cama 03 - Elena Rodríguez</p>
                      <p className="font-jakarta font-normal relative shrink-0 text-[#64748b] text-[12px]">Frecuencia cardíaca superó el límite programado (145 lpm). Requiere atención.</p>
                    </div>
                    <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#94a3b8] text-[11px] text-right w-[100px]">Hace 5 min</p>
                  </div>
                  <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex gap-[16px] items-center p-[16px] relative rounded-[12px] shrink-0 w-full" data-name="notification-card">
                    <div className="relative shrink-0 size-[12px]" data-name="unread-indicator-container">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgUnreadIndicatorContainer} />
                    </div>
                    <div className="bg-[#eff6ff] content-stretch flex items-start p-[10px] relative rounded-[100px] shrink-0" data-name="icon-bg">
                      <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[16px]" data-name="icon-cpu">
                        <div className="relative shrink-0 size-[16px]" data-name="cpu">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgCpu2} />
                        </div>
                      </div>
                    </div>
                    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px relative whitespace-nowrap" data-name="text-content">
                      <p className="font-jakarta font-extrabold relative shrink-0 text-[#0f172a] text-[14px]">Asignación de Paciente: Cama 08</p>
                      <p className="font-jakarta font-normal relative shrink-0 text-[#64748b] text-[12px]">El paciente Javier Mendoza ha sido derivado oficialmente bajo su cuidado.</p>
                    </div>
                    <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#94a3b8] text-[11px] text-right w-[100px]">Hace 1 hora</p>
                  </div>
                  <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex gap-[16px] items-center p-[16px] relative rounded-[12px] shrink-0 w-full" data-name="notification-card">
                    <div className="relative shrink-0 size-[12px]" data-name="unread-indicator-container">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgUnreadIndicatorContainer} />
                    </div>
                    <div className="bg-[#ecfdf5] content-stretch flex items-start p-[10px] relative rounded-[100px] shrink-0" data-name="icon-bg">
                      <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[16px]" data-name="icon-checkmark-circle">
                        <div className="relative shrink-0 size-[16px]" data-name="check-circle">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgCheckCircle} />
                        </div>
                      </div>
                    </div>
                    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px relative whitespace-nowrap" data-name="text-content">
                      <p className="font-jakarta font-extrabold relative shrink-0 text-[#0f172a] text-[14px]">Reporte Clínico Generado con éxito</p>
                      <p className="font-jakarta font-normal relative shrink-0 text-[#64748b] text-[12px]">El consolidado mensual de la Unidad de Cuidados Intensivos Médica está listo para descarga.</p>
                    </div>
                    <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#94a3b8] text-[11px] text-right w-[100px]">Hace 2 horas</p>
                  </div>
                </div>
              </div>
              <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full" data-name="group-section">
                <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#64748b] text-[13px] uppercase whitespace-nowrap">Ayer</p>
                <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="items-stack">
                  <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex gap-[16px] items-center p-[16px] relative rounded-[12px] shrink-0 w-full" data-name="notification-card">
                    <div className="relative shrink-0 size-[12px]" data-name="unread-indicator-container" />
                    <div className="bg-[#dbeafe] content-stretch flex items-start p-[10px] relative rounded-[100px] shrink-0" data-name="icon-bg">
                      <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[16px]" data-name="icon-activity">
                        <div className="relative shrink-0 size-[16px]" data-name="activity">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgActivity4} />
                        </div>
                      </div>
                    </div>
                    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px relative text-[#64748b] whitespace-nowrap" data-name="text-content">
                      <p className="font-jakarta font-semibold relative shrink-0 text-[14px]">Actualización de Sistema Completada</p>
                      <p className="font-jakarta font-normal relative shrink-0 text-[12px]">SIAPPC v2.4.1 ha sido desplegada con mejoras en la latencia de monitoreo cardíaco.</p>
                    </div>
                    <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#94a3b8] text-[11px] text-right w-[100px]">Ayer, 19:40</p>
                  </div>
                  <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex gap-[16px] items-center p-[16px] relative rounded-[12px] shrink-0 w-full" data-name="notification-card">
                    <div className="relative shrink-0 size-[12px]" data-name="unread-indicator-container" />
                    <div className="bg-[#f5f3ff] content-stretch flex items-start p-[10px] relative rounded-[100px] shrink-0" data-name="icon-bg">
                      <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[16px]" data-name="icon-users">
                        <div className="relative shrink-0 size-[16px]" data-name="users">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgUsers4} />
                        </div>
                      </div>
                    </div>
                    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px relative text-[#64748b] whitespace-nowrap" data-name="text-content">
                      <p className="font-jakarta font-semibold relative shrink-0 text-[14px]">Nueva Nota SOAP Registrada</p>
                      <p className="font-jakarta font-normal relative shrink-0 text-[12px]">Dra. Ana Gómez registró una nota de evolución sobre la paciente Elena Rodríguez.</p>
                    </div>
                    <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#94a3b8] text-[11px] text-right w-[100px]">Ayer, 14:12</p>
                  </div>
                  <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex gap-[16px] items-center p-[16px] relative rounded-[12px] shrink-0 w-full" data-name="notification-card">
                    <div className="relative shrink-0 size-[12px]" data-name="unread-indicator-container" />
                    <div className="bg-[#fef3c7] content-stretch flex items-start p-[10px] relative rounded-[100px] shrink-0" data-name="icon-bg">
                      <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[16px]" data-name="icon-bell">
                        <div className="relative shrink-0 size-[16px]" data-name="bell">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgBell5} />
                        </div>
                      </div>
                    </div>
                    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px relative text-[#64748b] whitespace-nowrap" data-name="text-content">
                      <p className="font-jakarta font-semibold relative shrink-0 text-[14px]">Alerta Temprana: Cama 12 - Ricardo Gómez</p>
                      <p className="font-jakarta font-normal relative shrink-0 text-[12px]">Temperatura registrada en 38.3°C. Alerta de nivel moderado enviada.</p>
                    </div>
                    <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#94a3b8] text-[11px] text-right w-[100px]">Ayer, 09:15</p>
                  </div>
                </div>
              </div>
              <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full" data-name="group-section">
                <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#64748b] text-[13px] uppercase whitespace-nowrap">Esta semana</p>
                <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="items-stack">
                  <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex gap-[16px] items-center p-[16px] relative rounded-[12px] shrink-0 w-full" data-name="notification-card">
                    <div className="relative shrink-0 size-[12px]" data-name="unread-indicator-container" />
                    <div className="bg-[#ecfdf5] content-stretch flex items-start p-[10px] relative rounded-[100px] shrink-0" data-name="icon-bg">
                      <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[16px]" data-name="icon-checkmark-circle">
                        <div className="relative shrink-0 size-[16px]" data-name="check-circle">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgCheckCircle} />
                        </div>
                      </div>
                    </div>
                    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px relative text-[#64748b] whitespace-nowrap" data-name="text-content">
                      <p className="font-jakarta font-semibold relative shrink-0 text-[14px]">Alta de Paciente Programada</p>
                      <p className="font-jakarta font-normal relative shrink-0 text-[12px]">Andrés Castro (PT-8824) cuenta con pre-alta firmada para el día 26 de Octubre.</p>
                    </div>
                    <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#94a3b8] text-[11px] text-right w-[100px]">Hace 3 días</p>
                  </div>
                  <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex gap-[16px] items-center p-[16px] relative rounded-[12px] shrink-0 w-full" data-name="notification-card">
                    <div className="relative shrink-0 size-[12px]" data-name="unread-indicator-container" />
                    <div className="bg-[#e2e8f0] content-stretch flex items-start p-[10px] relative rounded-[100px] shrink-0" data-name="icon-bg">
                      <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[16px]" data-name="icon-cpu">
                        <div className="relative shrink-0 size-[16px]" data-name="cpu">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgCpu3} />
                        </div>
                      </div>
                    </div>
                    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px relative text-[#64748b] whitespace-nowrap" data-name="text-content">
                      <p className="font-jakarta font-semibold relative shrink-0 text-[14px]">Mantenimiento Preventivo de Dispositivos</p>
                      <p className="font-jakarta font-normal relative shrink-0 text-[12px]">El sensor biométrico de la cama UCI-05 será recalibrado a las 14:00 horas.</p>
                    </div>
                    <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#94a3b8] text-[11px] text-right w-[100px]">Hace 4 días</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
