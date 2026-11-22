// Pantalla "med-notificaciones-centro" (Figma node 333:4) — generada desde el diseño original de Figma.
import { Link } from 'react-router-dom';
import imgActivity from '../../assets/activity.svg';
import imgAvatar11Png from '../../assets/avatar-11.png';
import imgBell from '../../assets/bell.svg';
import imgBell6 from '../../assets/bell-6.svg';
import imgBell7 from '../../assets/bell-7.svg';
import imgCheck2 from '../../assets/check-2.svg';
import imgChevronDown from '../../assets/chevron-down.svg';
import imgClipboard2 from '../../assets/clipboard-2.svg';
import imgCpu from '../../assets/cpu.svg';
import imgCpu4 from '../../assets/cpu-4.svg';
import imgDoctorFooterLine2 from '../../assets/doctor-footer-line-2.svg';
import imgFileText from '../../assets/file-text.svg';
import imgFileText5 from '../../assets/file-text-5.svg';
import imgHelpIconEllipse from '../../assets/help-icon-ellipse.svg';
import imgIconwrapper3 from '../../assets/iconwrapper-3.svg';
import imgLayoutDashboard from '../../assets/layout-dashboard.svg';
import imgLogOut from '../../assets/log-out.svg';
import imgSectionHeaderHoyLine from '../../assets/section-header-hoy-line.svg';
import imgUnreadIndicatorContainer2 from '../../assets/unread-indicator-container-2.svg';
import imgUsers2 from '../../assets/users-2.svg';
import imgUsers5 from '../../assets/users-5.svg';

export default function MedNotificacionesCentro() {
  return (
    <div className="bg-[#f8fafc] content-stretch flex h-[900px] items-start overflow-clip relative shrink-0 w-[1440px]" data-name="med-notificaciones-centro">
      <div className="bg-[#0f172a] border-[#1e293b] border-r border-solid content-stretch flex flex-col h-full items-start justify-between px-[16px] py-[24px] relative shrink-0 w-[240px]" data-name="sidebar">
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
              <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[18px]" data-name="icon-dashboard">
                <div className="relative shrink-0 size-[18px]" data-name="layout-dashboard">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgLayoutDashboard} />
                </div>
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Dashboard</p>
            </Link>
            <Link className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Pacientes" to="/MedPacientesLista">
              <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[18px]" data-name="icon-users">
                <div className="relative shrink-0 size-[18px]" data-name="users">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgUsers2} />
                </div>
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Pacientes</p>
            </Link>
            <Link className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Monitoreo" to="/MedMonitoreoGridUci">
              <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[18px]" data-name="icon-activity">
                <div className="relative shrink-0 size-[18px]" data-name="activity">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgActivity} />
                </div>
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Monitoreo</p>
            </Link>
            <Link className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Alertas" to="/MedAlertasCentro">
              <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[18px]" data-name="icon-bell">
                <div className="relative shrink-0 size-[18px]" data-name="bell">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgBell} />
                </div>
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Alertas</p>
            </Link>
            <Link className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Reportes" to="/MedReportesPanel">
              <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[18px]" data-name="icon-document">
                <div className="relative shrink-0 size-[18px]" data-name="file-text">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgFileText} />
                </div>
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Reportes</p>
            </Link>
            <Link className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Dispositivos" to="/MedDispositivosMonitores">
              <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[18px]" data-name="icon-cpu">
                <div className="relative shrink-0 size-[18px]" data-name="cpu">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgCpu} />
                </div>
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Dispositivos</p>
            </Link>
          </div>
        </div>
        <Link className="absolute block border-[1.5px] border-[rgba(255,255,255,0.3)] border-solid cursor-pointer left-[20px] opacity-25 overflow-clip rounded-[10px] size-[18px] top-[790px]" data-name="help-icon" to="/MedAyudaSoporte">
          <div className="absolute left-[-1.5px] size-[18px] top-[-1.5px]" data-name="Ellipse">
            <div className="absolute inset-[-4.17%]">
              <img className="block max-w-none size-full" alt="" src={imgHelpIconEllipse} />
            </div>
          </div>
          <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-geist font-bold justify-center leading-[0] left-[7.5px] text-[#64748b] text-[11px] text-center top-[7px] whitespace-nowrap">
            <p className="leading-[normal]">?</p>
          </div>
        </Link>
        <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="doctor-footer">
          <div className="h-0 relative shrink-0 w-full" data-name="Line">
            <div className="absolute inset-[-1px_0_0_0]">
              <img className="block max-w-none size-full" alt="" src={imgDoctorFooterLine2} />
            </div>
          </div>
          <Link className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-name="user-profile" to="/MedPerfilMiPerfil">
            <div className="relative rounded-[20px] shrink-0 size-[40px]" data-name="avatar">
              <img className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[20px] size-full" alt="" src={imgAvatar11Png} />
            </div>
            <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px relative whitespace-nowrap" data-name="user-info">
              <p className="font-jakarta font-bold overflow-hidden relative shrink-0 text-[13px] text-ellipsis text-white">Dr. Carlos Méndez</p>
              <p className="font-jakarta font-medium overflow-hidden relative shrink-0 text-[#64748b] text-[11px] text-ellipsis">Médico Especialista</p>
            </div>
            <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[18px]" data-name="logout-button">
              <div className="relative shrink-0 size-[18px]" data-name="Frame">
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
            <p className="font-jakarta font-extrabold relative shrink-0 text-[#0f172a] text-[20px]">Centro de Notificaciones</p>
          </div>
          <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="right-actions">
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex gap-[8px] items-center px-[16px] py-[8px] relative rounded-[8px] shrink-0" data-name="mark-all-read-btn">
              <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[14px]" data-name="icon-check">
                <div className="relative shrink-0 size-[14px]" data-name="check">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgCheck2} />
                </div>
              </div>
              <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] whitespace-nowrap">Marcar todas como leídas</p>
            </div>
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex gap-[12px] items-center px-[12px] py-[8px] relative rounded-[8px] shrink-0" data-name="dropdown-filter">
              <div className="[word-break:break-word] content-stretch flex flex-col font-jakarta font-semibold gap-[2px] items-start leading-[normal] relative shrink-0 whitespace-nowrap" data-name="label-container">
                <p className="relative shrink-0 text-[#64748b] text-[10px] uppercase">Tipo</p>
                <p className="relative shrink-0 text-[#0f172a] text-[13px]">Todas</p>
              </div>
              <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[14px]" data-name="icon-chevronDown">
                <div className="relative shrink-0 size-[14px]" data-name="chevron-down">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgChevronDown} />
                </div>
              </div>
            </div>
            <Link className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex items-center justify-center relative rounded-[18px] shrink-0 size-[36px]" data-name="notification-bell" to="/MedNotificacionesCentro">
              <div className="relative shrink-0 size-[18px]" data-name="IconWrapper">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgIconwrapper3} />
              </div>
              <div className="absolute bg-[#ef4444] content-stretch flex items-center justify-center right-[-3px] rounded-[8px] size-[16px] top-[-3px]" data-name="red-badge">
                <p className="[word-break:break-word] font-geist font-extrabold leading-[normal] relative shrink-0 text-[10px] text-white whitespace-nowrap">12</p>
              </div>
            </Link>
          </div>
        </div>
        <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px p-[16px] relative w-full" data-name="page-body">
          <div className="bg-white border border-[#e2e8f0] border-solid content-stretch drop-shadow-[0px_4px_4px_rgba(0,0,0,0.01)] flex flex-col items-start p-[12px] relative rounded-[12px] shrink-0 w-full" data-name="notifications-card-container">
            <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="section-hoy">
              <div className="content-stretch flex flex-col gap-[4px] items-start pb-[2px] pt-[8px] relative shrink-0 w-full" data-name="section-header-hoy">
                <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[11px] uppercase whitespace-nowrap">Hoy</p>
                <div className="h-0 relative shrink-0 w-full" data-name="Line">
                  <div className="absolute inset-[-1px_0_0_0]">
                    <img className="block max-w-none size-full" alt="" src={imgSectionHeaderHoyLine} />
                  </div>
                </div>
              </div>
              <div className="bg-[#eff6ff] border-[#e2e8f0] border-b border-solid content-stretch flex gap-[12px] items-center px-[12px] py-[8px] relative shrink-0 w-full" data-name="notification-row">
                <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-[56px]" data-name="left">
                  <div className="h-[8px] relative shrink-0 w-[16px]" data-name="unread-indicator-container">
                    <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgUnreadIndicatorContainer2} />
                  </div>
                  <div className="bg-[#fef2f2] content-stretch flex flex-col items-center justify-center relative rounded-[16px] shrink-0 size-[32px]" data-name="icon-badge">
                    <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[16px]" data-name="icon-bell">
                      <div className="relative shrink-0 size-[20px]" data-name="bell">
                        <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgBell6} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start min-w-px relative" data-name="text-block">
                  <p className="font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-full">Alerta Crítica: María González - Cama C-03</p>
                  <p className="font-jakarta font-normal leading-[16px] relative shrink-0 text-[#64748b] text-[12px] w-full">SpO2 descendió a 87%. Frecuencia cardíaca 134 bpm. Requiere atención inmediata.</p>
                </div>
                <div className="content-stretch flex gap-[12px] items-center justify-end relative shrink-0 w-[220px]" data-name="right-meta">
                  <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[11px] text-right w-[90px]">Hace 5 min</p>
                  <div className="bg-[#fef2f2] content-stretch flex items-start px-[10px] py-[4px] relative rounded-[6px] shrink-0" data-name="tag-pill">
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#ef4444] text-[11px] uppercase whitespace-nowrap">Clínica</p>
                  </div>
                </div>
              </div>
              <div className="bg-[#eff6ff] border-[#e2e8f0] border-b border-solid content-stretch flex gap-[12px] items-center px-[12px] py-[8px] relative shrink-0 w-full" data-name="notification-row">
                <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-[56px]" data-name="left">
                  <div className="h-[8px] relative shrink-0 w-[16px]" data-name="unread-indicator-container">
                    <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgUnreadIndicatorContainer2} />
                  </div>
                  <div className="bg-[#eff6ff] content-stretch flex flex-col items-center justify-center relative rounded-[16px] shrink-0 size-[32px]" data-name="icon-badge">
                    <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[16px]" data-name="icon-users">
                      <div className="relative shrink-0 size-[20px]" data-name="users">
                        <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgUsers5} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start min-w-px relative" data-name="text-block">
                  <p className="font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-full">Nueva Asignación de Paciente</p>
                  <p className="font-jakarta font-normal leading-[16px] relative shrink-0 text-[#64748b] text-[12px] w-full">Ricardo Gómez (PT-9102) ha sido asignado a su cargo. Cama C-09, diagnóstico: TEP.</p>
                </div>
                <div className="content-stretch flex gap-[12px] items-center justify-end relative shrink-0 w-[220px]" data-name="right-meta">
                  <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[11px] text-right w-[90px]">Hace 23 min</p>
                  <div className="bg-[#eff6ff] content-stretch flex items-start px-[10px] py-[4px] relative rounded-[6px] shrink-0" data-name="tag-pill">
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#2563eb] text-[11px] uppercase whitespace-nowrap">Asignación</p>
                  </div>
                </div>
              </div>
              <div className="bg-[#eff6ff] border-[#e2e8f0] border-b border-solid content-stretch flex gap-[12px] items-center px-[12px] py-[8px] relative shrink-0 w-full" data-name="notification-row">
                <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-[56px]" data-name="left">
                  <div className="h-[8px] relative shrink-0 w-[16px]" data-name="unread-indicator-container">
                    <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgUnreadIndicatorContainer2} />
                  </div>
                  <div className="bg-[#ecfdf5] content-stretch flex flex-col items-center justify-center relative rounded-[16px] shrink-0 size-[32px]" data-name="icon-badge">
                    <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[16px]" data-name="icon-document">
                      <div className="relative shrink-0 size-[20px]" data-name="file-text">
                        <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgFileText5} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start min-w-px relative" data-name="text-block">
                  <p className="font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-full">Resultados de Laboratorio Listos</p>
                  <p className="font-jakarta font-normal leading-[16px] relative shrink-0 text-[#64748b] text-[12px] w-full">BH completa y gasometría arterial de María González disponibles. 2 valores fuera de rango.</p>
                </div>
                <div className="content-stretch flex gap-[12px] items-center justify-end relative shrink-0 w-[220px]" data-name="right-meta">
                  <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[11px] text-right w-[90px]">Hace 1 hora</p>
                  <div className="bg-[#ecfdf5] content-stretch flex items-start px-[10px] py-[4px] relative rounded-[6px] shrink-0" data-name="tag-pill">
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#10b981] text-[11px] uppercase whitespace-nowrap">Laboratorio</p>
                  </div>
                </div>
              </div>
              <div className="bg-white border-[#e2e8f0] border-b border-solid content-stretch flex gap-[12px] items-center px-[12px] py-[8px] relative shrink-0 w-full" data-name="notification-row">
                <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-[56px]" data-name="left">
                  <div className="h-[8px] relative shrink-0 w-[16px]" data-name="unread-indicator-container">
                    <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgUnreadIndicatorContainer2} />
                  </div>
                  <div className="bg-[#fef3c7] content-stretch flex flex-col items-center justify-center relative rounded-[16px] shrink-0 size-[32px]" data-name="icon-badge">
                    <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[16px]" data-name="icon-clipboard">
                      <div className="relative shrink-0 size-[20px]" data-name="clipboard">
                        <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgClipboard2} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start min-w-px relative" data-name="text-block">
                  <p className="font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-full">Nota SOAP Pendiente - Juan Pérez</p>
                  <p className="font-jakarta font-normal leading-[16px] relative shrink-0 text-[#64748b] text-[12px] w-full">Llevas 8 horas sin registrar evolución para el paciente Juan Pérez (Cama C-05).</p>
                </div>
                <div className="content-stretch flex gap-[12px] items-center justify-end relative shrink-0 w-[220px]" data-name="right-meta">
                  <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[11px] text-right w-[90px]">Hace 3 horas</p>
                  <div className="bg-[#fef3c7] content-stretch flex items-start px-[10px] py-[4px] relative rounded-[6px] shrink-0" data-name="tag-pill">
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#f59e0b] text-[11px] uppercase whitespace-nowrap">Recordatorio</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="section-ayer">
              <div className="content-stretch flex flex-col gap-[4px] items-start pb-[2px] pt-[8px] relative shrink-0 w-full" data-name="section-header-ayer">
                <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[11px] uppercase whitespace-nowrap">Ayer</p>
                <div className="h-0 relative shrink-0 w-full" data-name="Line">
                  <div className="absolute inset-[-1px_0_0_0]">
                    <img className="block max-w-none size-full" alt="" src={imgSectionHeaderHoyLine} />
                  </div>
                </div>
              </div>
              <div className="bg-white border-[#e2e8f0] border-b border-solid content-stretch flex gap-[12px] items-center px-[12px] py-[8px] relative shrink-0 w-full" data-name="notification-row">
                <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-[56px]" data-name="left">
                  <div className="h-[8px] relative shrink-0 w-[16px]" data-name="unread-indicator-container">
                    <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgUnreadIndicatorContainer2} />
                  </div>
                  <div className="bg-[#fef3c7] content-stretch flex flex-col items-center justify-center relative rounded-[16px] shrink-0 size-[32px]" data-name="icon-badge">
                    <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[16px]" data-name="icon-bell">
                      <div className="relative shrink-0 size-[20px]" data-name="bell">
                        <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgBell7} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start min-w-px relative" data-name="text-block">
                  <p className="font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-full">Alerta Alta: Francisco Díaz - Cama C-09</p>
                  <p className="font-jakarta font-normal leading-[16px] relative shrink-0 text-[#64748b] text-[12px] w-full">Presión arterial 150/95 mmHg. Tendencia ascendente en últimas 2 horas.</p>
                </div>
                <div className="content-stretch flex gap-[12px] items-center justify-end relative shrink-0 w-[220px]" data-name="right-meta">
                  <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[11px] text-right w-[90px]">Ayer, 22:15</p>
                  <div className="bg-[#fef2f2] content-stretch flex items-start px-[10px] py-[4px] relative rounded-[6px] shrink-0" data-name="tag-pill">
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#ef4444] text-[11px] uppercase whitespace-nowrap">Clínica</p>
                  </div>
                </div>
              </div>
              <div className="bg-white border-[#e2e8f0] border-b border-solid content-stretch flex gap-[12px] items-center px-[12px] py-[8px] relative shrink-0 w-full" data-name="notification-row">
                <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-[56px]" data-name="left">
                  <div className="h-[8px] relative shrink-0 w-[16px]" data-name="unread-indicator-container">
                    <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgUnreadIndicatorContainer2} />
                  </div>
                  <div className="bg-[#ecfdf5] content-stretch flex flex-col items-center justify-center relative rounded-[16px] shrink-0 size-[32px]" data-name="icon-badge">
                    <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[16px]" data-name="icon-document">
                      <div className="relative shrink-0 size-[20px]" data-name="file-text">
                        <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgFileText5} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start min-w-px relative" data-name="text-block">
                  <p className="font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-full">Radiografía de Tórax Disponible</p>
                  <p className="font-jakarta font-normal leading-[16px] relative shrink-0 text-[#64748b] text-[12px] w-full">Estudio de María González procesado por radiología. Disponible para revisión.</p>
                </div>
                <div className="content-stretch flex gap-[12px] items-center justify-end relative shrink-0 w-[220px]" data-name="right-meta">
                  <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[11px] text-right w-[90px]">Ayer, 18:40</p>
                  <div className="bg-[#ecfdf5] content-stretch flex items-start px-[10px] py-[4px] relative rounded-[6px] shrink-0" data-name="tag-pill">
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#10b981] text-[11px] uppercase whitespace-nowrap">Imagen</p>
                  </div>
                </div>
              </div>
              <div className="bg-white border-[#e2e8f0] border-b border-solid content-stretch flex gap-[12px] items-center px-[12px] py-[8px] relative shrink-0 w-full" data-name="notification-row">
                <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-[56px]" data-name="left">
                  <div className="h-[8px] relative shrink-0 w-[16px]" data-name="unread-indicator-container">
                    <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgUnreadIndicatorContainer2} />
                  </div>
                  <div className="bg-[#f1f5f9] content-stretch flex flex-col items-center justify-center relative rounded-[16px] shrink-0 size-[32px]" data-name="icon-badge">
                    <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[16px]" data-name="icon-cpu">
                      <div className="relative shrink-0 size-[20px]" data-name="cpu">
                        <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgCpu4} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start min-w-px relative" data-name="text-block">
                  <p className="font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-full">Actualización del Sistema</p>
                  <p className="font-jakarta font-normal leading-[16px] relative shrink-0 text-[#64748b] text-[12px] w-full">Mantenimiento programado completado. Nuevas funciones de exportación de reportes disponibles.</p>
                </div>
                <div className="content-stretch flex gap-[12px] items-center justify-end relative shrink-0 w-[220px]" data-name="right-meta">
                  <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[11px] text-right w-[90px]">Ayer, 06:00</p>
                  <div className="bg-[#f1f5f9] content-stretch flex items-start px-[10px] py-[4px] relative rounded-[6px] shrink-0" data-name="tag-pill">
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[11px] uppercase whitespace-nowrap">Sistema</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="section-esta-semana">
              <div className="content-stretch flex flex-col gap-[4px] items-start pb-[2px] pt-[8px] relative shrink-0 w-full" data-name="section-header-esta-semana">
                <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[11px] uppercase whitespace-nowrap">Esta semana</p>
                <div className="h-0 relative shrink-0 w-full" data-name="Line">
                  <div className="absolute inset-[-1px_0_0_0]">
                    <img className="block max-w-none size-full" alt="" src={imgSectionHeaderHoyLine} />
                  </div>
                </div>
              </div>
              <div className="bg-white border-[#e2e8f0] border-b border-solid content-stretch flex gap-[12px] items-center px-[12px] py-[8px] relative shrink-0 w-full" data-name="notification-row">
                <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-[56px]" data-name="left">
                  <div className="h-[8px] relative shrink-0 w-[16px]" data-name="unread-indicator-container">
                    <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgUnreadIndicatorContainer2} />
                  </div>
                  <div className="bg-[#eff6ff] content-stretch flex flex-col items-center justify-center relative rounded-[16px] shrink-0 size-[32px]" data-name="icon-badge">
                    <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[16px]" data-name="icon-users">
                      <div className="relative shrink-0 size-[20px]" data-name="users">
                        <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgUsers5} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start min-w-px relative" data-name="text-block">
                  <p className="font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-full">Transferencia de Paciente Completada</p>
                  <p className="font-jakarta font-normal leading-[16px] relative shrink-0 text-[#64748b] text-[12px] w-full">Sofía Martínez transferida a Dra. Lucía Torres (turno vespertino) exitosamente.</p>
                </div>
                <div className="content-stretch flex gap-[12px] items-center justify-end relative shrink-0 w-[220px]" data-name="right-meta">
                  <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[11px] text-right w-[90px]">Lun, 14:30</p>
                  <div className="bg-[#eff6ff] content-stretch flex items-start px-[10px] py-[4px] relative rounded-[6px] shrink-0" data-name="tag-pill">
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#2563eb] text-[11px] uppercase whitespace-nowrap">Asignación</p>
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
