// Pantalla "med/alertas/centro" (Figma node 48:7) — generada desde el diseño original de Figma.
import { Link } from 'react-router-dom';
import imgActivity from '../../assets/activity.svg';
import imgAvatar23Png from '../../assets/avatar-23.png';
import imgBell10 from '../../assets/bell-10.svg';
import imgBell11 from '../../assets/bell-11.svg';
import imgBell8 from '../../assets/bell-8.svg';
import imgBell9 from '../../assets/bell-9.svg';
import imgCalendar from '../../assets/calendar.svg';
import imgChevronDown3 from '../../assets/chevron-down-3.svg';
import imgCpu from '../../assets/cpu.svg';
import imgDoctorFooterLine from '../../assets/doctor-footer-line.svg';
import imgDropdownBadgeEllipse from '../../assets/dropdown-badge-ellipse.svg';
import imgDropdownBadgeEllipse2 from '../../assets/dropdown-badge-ellipse-2.svg';
import imgFileText from '../../assets/file-text.svg';
import imgHelpIconEllipse from '../../assets/help-icon-ellipse.svg';
import imgIconwrapper from '../../assets/iconwrapper.svg';
import imgLayoutDashboard from '../../assets/layout-dashboard.svg';
import imgLiveIndicatorEllipse from '../../assets/live-indicator-ellipse.svg';
import imgLogOut from '../../assets/log-out.svg';
import imgUsers2 from '../../assets/users-2.svg';

export default function MedAlertasCentro() {
  return (
    <div className="content-stretch flex flex-col items-start overflow-clip relative rounded-[20px] shrink-0" data-name="med/alertas/centro">
      <div className="bg-[#f8fafc] content-stretch flex h-[900px] items-start overflow-clip relative shrink-0 w-[1440px]" data-name="SIAPPC-Panel-Alertas">
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
              <Link className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Dashboard" to="/MedDashboardPrincipal">
                <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[18px]" data-name="icon-layout-dashboard">
                  <div className="relative shrink-0 size-[18px]" data-name="layout-dashboard">
                    <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgLayoutDashboard} />
                  </div>
                </div>
                <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#94a3b8] text-[14px] whitespace-nowrap">Dashboard</p>
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
              <Link className="bg-[rgba(37,99,235,0.15)] content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Alertas" to="/MedAlertasCentro">
                <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[18px]" data-name="icon-bell">
                  <div className="relative shrink-0 size-[18px]" data-name="bell">
                    <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgBell8} />
                  </div>
                </div>
                <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[14px] text-white whitespace-nowrap">Alertas</p>
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
                <img className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[20px] size-full" alt="" src={imgAvatar23Png} />
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
              <p className="font-jakarta font-medium relative shrink-0 text-[#64748b] text-[12px]">{`SIAPPC > Alertas`}</p>
              <p className="font-jakarta font-extrabold relative shrink-0 text-[#0f172a] text-[20px]">Centro de Alertas Críticas</p>
            </div>
            <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="right-actions">
              <div className="content-stretch flex gap-[10px] items-center relative shrink-0" data-name="Frame">
                <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex gap-[8px] items-start px-[12px] py-[8px] relative rounded-[8px] shrink-0" data-name="filter">
                  <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] whitespace-nowrap">Severidad: Todas</p>
                  <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[12px]" data-name="icon-chevron-down">
                    <div className="relative shrink-0 size-[12px]" data-name="chevron-down">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgChevronDown3} />
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex gap-[8px] items-start px-[12px] py-[8px] relative rounded-[8px] shrink-0" data-name="filter">
                  <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] whitespace-nowrap">Estado: Activas</p>
                  <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[12px]" data-name="icon-chevron-down">
                    <div className="relative shrink-0 size-[12px]" data-name="chevron-down">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgChevronDown3} />
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex gap-[8px] items-start px-[12px] py-[8px] relative rounded-[8px] shrink-0" data-name="datepicker">
                  <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[14px]" data-name="icon-calendar">
                    <div className="relative shrink-0 size-[14px]" data-name="calendar">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgCalendar} />
                    </div>
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[13px] whitespace-nowrap">Hoy, 24 Oct 2025</p>
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
          <div className="content-stretch flex flex-[1_0_0] flex-col gap-[24px] items-start min-h-px p-[32px] relative w-full" data-name="page-body">
            <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full" data-name="kpi-row">
              <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-w-px p-[20px] relative rounded-[12px]" data-name="kpi-card">
                <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[11px] uppercase whitespace-nowrap">Alertas Activas</p>
                <div className="content-stretch flex items-baseline justify-between relative shrink-0 w-full" data-name="value-container">
                  <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#ef4444] text-[32px] whitespace-nowrap">5</p>
                  <div className="bg-[#fef2f2] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[4px] shrink-0" data-name="badge">
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#ef4444] text-[10px] whitespace-nowrap">Acción Urgente</p>
                  </div>
                </div>
              </div>
              <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-w-px p-[20px] relative rounded-[12px]" data-name="kpi-card">
                <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[11px] uppercase whitespace-nowrap">Pendientes de Atención</p>
                <div className="content-stretch flex items-baseline justify-between relative shrink-0 w-full" data-name="value-container">
                  <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#f59e0b] text-[32px] whitespace-nowrap">3</p>
                  <div className="bg-[#fef3c7] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[4px] shrink-0" data-name="badge">
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#f59e0b] text-[10px] whitespace-nowrap">En Cola</p>
                  </div>
                </div>
              </div>
              <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-w-px p-[20px] relative rounded-[12px]" data-name="kpi-card">
                <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[11px] uppercase whitespace-nowrap">Tiempo Resp. Promedio</p>
                <div className="content-stretch flex items-baseline justify-between relative shrink-0 w-full" data-name="value-container">
                  <p className="[word-break:break-word] font-jakarta font-extrabold leading-[0] relative shrink-0 text-[#10b981] text-[0px] whitespace-nowrap"><span className="leading-[normal] text-[32px]">{`2.3 `}</span><span className="font-jakarta font-semibold leading-[normal] text-[18px]">min</span></p>
                  <div className="bg-[#ecfdf5] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[4px] shrink-0" data-name="badge">
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#10b981] text-[10px] whitespace-nowrap">Bajo el límite</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="content-stretch flex flex-[1_0_0] gap-[24px] items-start min-h-px relative w-full" data-name="columns-layout">
              <div className="content-stretch flex flex-[1_0_0] flex-col gap-[12px] h-full items-start min-w-px relative" data-name="alerts-list-container">
                <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#0f172a] text-[16px] whitespace-nowrap">Alertas Críticas Activas</p>
                <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="alerts-stack">
                  <div className="bg-[#fef2f2] border border-[#e2e8f0] border-solid content-stretch flex items-start overflow-clip relative rounded-[12px] shrink-0 w-full" data-name="alert-card">
                    <div className="bg-[#ef4444] relative self-stretch shrink-0 w-[6px]" data-name="severity-indicator" />
                    <div className="content-stretch flex flex-[1_0_0] items-center justify-between min-w-px p-[16px] relative" data-name="card-body">
                      <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-[420px]" data-name="left-block">
                        <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="title-row">
                          <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[14px]" data-name="icon-bell">
                            <div className="relative shrink-0 size-[14px]" data-name="bell">
                              <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgBell9} />
                            </div>
                          </div>
                          <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#0f172a] text-[15px] whitespace-nowrap">C-03 María González</p>
                        </div>
                        <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#ef4444] text-[13px] whitespace-nowrap">SpO2 Crítico — 84% en ventilador mecánico</p>
                        <div className="[word-break:break-word] content-stretch flex gap-[16px] items-center leading-[normal] relative shrink-0 text-[11px] whitespace-nowrap" data-name="meta-row">
                          <p className="font-jakarta font-medium relative shrink-0 text-[#94a3b8]">Hace 1 min</p>
                          <p className="font-jakarta font-semibold relative shrink-0 text-[#2563eb]">Dr. Roberto Silva (Asignado)</p>
                        </div>
                      </div>
                      <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="actions">
                        <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-start px-[16px] py-[8px] relative rounded-[8px] shrink-0" data-name="btn-mute">
                          <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[12px] whitespace-nowrap">Silenciar</p>
                        </div>
                        <div className="bg-[#2563eb] content-stretch flex items-start px-[16px] py-[8px] relative rounded-[8px] shrink-0" data-name="btn-attend">
                          <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[12px] text-white whitespace-nowrap">Atender</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#eff6ff] border-2 border-[#2563eb] border-solid content-stretch flex items-start overflow-clip relative rounded-[12px] shrink-0 w-full" data-name="alert-card">
                    <div className="bg-[#f59e0b] relative self-stretch shrink-0 w-[6px]" data-name="severity-indicator" />
                    <div className="content-stretch flex flex-[1_0_0] items-center justify-between min-w-px p-[16px] relative" data-name="card-body">
                      <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-[420px]" data-name="left-block">
                        <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="title-row">
                          <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[14px]" data-name="icon-bell">
                            <div className="relative shrink-0 size-[14px]" data-name="bell">
                              <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgBell10} />
                            </div>
                          </div>
                          <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#0f172a] text-[15px] whitespace-nowrap">C-09 Francisco Díaz</p>
                        </div>
                        <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#d97706] text-[13px] whitespace-nowrap">FC Elevada — Taquicardia de 145 lpm detectada</p>
                        <div className="[word-break:break-word] content-stretch flex gap-[16px] items-center leading-[normal] relative shrink-0 text-[11px] whitespace-nowrap" data-name="meta-row">
                          <p className="font-jakarta font-medium relative shrink-0 text-[#94a3b8]">Hace 3 min</p>
                          <p className="font-jakarta font-semibold relative shrink-0 text-[#d97706]">Atendiendo</p>
                        </div>
                      </div>
                      <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="actions">
                        <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-start px-[16px] py-[8px] relative rounded-[8px] shrink-0" data-name="btn-mute">
                          <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[12px] whitespace-nowrap">Silenciar</p>
                        </div>
                        <div className="bg-[#d97706] content-stretch flex items-start px-[16px] py-[8px] relative rounded-[8px] shrink-0" data-name="btn-attend">
                          <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[12px] text-white whitespace-nowrap">Atendiendo</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-start overflow-clip relative rounded-[12px] shrink-0 w-full" data-name="alert-card">
                    <div className="bg-[#f59e0b] relative self-stretch shrink-0 w-[6px]" data-name="severity-indicator" />
                    <div className="content-stretch flex flex-[1_0_0] items-center justify-between min-w-px p-[16px] relative" data-name="card-body">
                      <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-[420px]" data-name="left-block">
                        <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="title-row">
                          <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[14px]" data-name="icon-bell">
                            <div className="relative shrink-0 size-[14px]" data-name="bell">
                              <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgBell10} />
                            </div>
                          </div>
                          <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#0f172a] text-[15px] whitespace-nowrap">C-01 Ricardo Gómez</p>
                        </div>
                        <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[13px] whitespace-nowrap">Temperatura Elevada — 39.1°C persistente</p>
                        <div className="[word-break:break-word] content-stretch flex gap-[16px] items-center leading-[normal] relative shrink-0 text-[11px] whitespace-nowrap" data-name="meta-row">
                          <p className="font-jakarta font-medium relative shrink-0 text-[#94a3b8]">Hace 8 min</p>
                          <p className="font-jakarta font-semibold relative shrink-0 text-[#2563eb]">Dra. Ana Gómez</p>
                        </div>
                      </div>
                      <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="actions">
                        <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-start px-[16px] py-[8px] relative rounded-[8px] shrink-0" data-name="btn-mute">
                          <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[12px] whitespace-nowrap">Silenciar</p>
                        </div>
                        <div className="bg-[#2563eb] content-stretch flex items-start px-[16px] py-[8px] relative rounded-[8px] shrink-0" data-name="btn-attend">
                          <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[12px] text-white whitespace-nowrap">Atender</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-start overflow-clip relative rounded-[12px] shrink-0 w-full" data-name="alert-card">
                    <div className="bg-[#f59e0b] relative self-stretch shrink-0 w-[6px]" data-name="severity-indicator" />
                    <div className="content-stretch flex flex-[1_0_0] items-center justify-between min-w-px p-[16px] relative" data-name="card-body">
                      <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-[420px]" data-name="left-block">
                        <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="title-row">
                          <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[14px]" data-name="icon-bell">
                            <div className="relative shrink-0 size-[14px]" data-name="bell">
                              <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgBell10} />
                            </div>
                          </div>
                          <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#0f172a] text-[15px] whitespace-nowrap">C-06 Javier Mendoza</p>
                        </div>
                        <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[13px] whitespace-nowrap">Presión Arterial Límite — 148/92 mmHg</p>
                        <div className="[word-break:break-word] content-stretch flex gap-[16px] items-center leading-[normal] relative shrink-0 text-[11px] whitespace-nowrap" data-name="meta-row">
                          <p className="font-jakarta font-medium relative shrink-0 text-[#94a3b8]">Hace 12 min</p>
                          <p className="font-jakarta font-semibold relative shrink-0 text-[#2563eb]">Dr. Roberto Silva</p>
                        </div>
                      </div>
                      <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="actions">
                        <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-start px-[16px] py-[8px] relative rounded-[8px] shrink-0" data-name="btn-mute">
                          <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[12px] whitespace-nowrap">Silenciar</p>
                        </div>
                        <div className="bg-[#2563eb] content-stretch flex items-start px-[16px] py-[8px] relative rounded-[8px] shrink-0" data-name="btn-attend">
                          <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[12px] text-white whitespace-nowrap">Atender</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-start overflow-clip relative rounded-[12px] shrink-0 w-full" data-name="alert-card">
                    <div className="bg-[#10b981] relative self-stretch shrink-0 w-[6px]" data-name="severity-indicator" />
                    <div className="content-stretch flex flex-[1_0_0] items-center justify-between min-w-px p-[16px] relative" data-name="card-body">
                      <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-[420px]" data-name="left-block">
                        <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="title-row">
                          <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[14px]" data-name="icon-bell">
                            <div className="relative shrink-0 size-[14px]" data-name="bell">
                              <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgBell11} />
                            </div>
                          </div>
                          <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#0f172a] text-[15px] whitespace-nowrap">C-11 Sofía Martínez</p>
                        </div>
                        <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[13px] whitespace-nowrap">Desconexión de Sonda Vesical detectada</p>
                        <div className="[word-break:break-word] content-stretch flex gap-[16px] items-center leading-[normal] relative shrink-0 text-[11px] whitespace-nowrap" data-name="meta-row">
                          <p className="font-jakarta font-medium relative shrink-0 text-[#94a3b8]">Hace 15 min</p>
                          <p className="font-jakarta font-semibold relative shrink-0 text-[#2563eb]">Enf. Lucía Fernández</p>
                        </div>
                      </div>
                      <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="actions">
                        <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-start px-[16px] py-[8px] relative rounded-[8px] shrink-0" data-name="btn-mute">
                          <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[12px] whitespace-nowrap">Silenciar</p>
                        </div>
                        <div className="bg-[#2563eb] content-stretch flex items-start px-[16px] py-[8px] relative rounded-[8px] shrink-0" data-name="btn-attend">
                          <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[12px] text-white whitespace-nowrap">Atender</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="content-stretch flex flex-col gap-[12px] h-full items-start relative shrink-0 w-[450px]" data-name="history-container">
                <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#0f172a] text-[16px] whitespace-nowrap">Historial Resuelto (Últimas horas)</p>
                <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[12px] shrink-0 w-full" data-name="table-box">
                  <div className="[word-break:break-word] bg-[#f8fafc] border-[#e2e8f0] border-b border-solid content-stretch flex font-jakarta font-bold gap-[12px] items-start leading-[normal] px-[12px] py-[10px] relative shrink-0 text-[#64748b] text-[11px] w-[426px]" data-name="header">
                    <p className="relative shrink-0 w-[45px]">HORA</p>
                    <p className="relative shrink-0 w-[105px]">PACIENTE</p>
                    <p className="relative shrink-0 w-[110px]">EVENTO</p>
                    <p className="relative shrink-0 text-right w-[80px]">RESP.</p>
                  </div>
                  <div className="bg-white border-[#e2e8f0] border-b border-solid content-stretch flex gap-[12px] items-start p-[12px] relative shrink-0 w-[426px]" data-name="row">
                    <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[12px] w-[45px]">08:15</p>
                    <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-[105px]" data-name="patient-cell">
                      <div className="relative shrink-0 size-[6px]" data-name="Ellipse">
                        <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgLiveIndicatorEllipse} />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] overflow-hidden relative shrink-0 text-[#0f172a] text-[13px] text-ellipsis whitespace-nowrap">Andrés Castro</p>
                    </div>
                    <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 w-[110px] whitespace-nowrap" data-name="info-cell">
                      <p className="font-jakarta font-semibold relative shrink-0 text-[#0f172a] text-[12px]">SpO2 Recuperado</p>
                      <p className="font-jakarta font-normal relative shrink-0 text-[#94a3b8] text-[10px]">Enf. Carlos M.</p>
                    </div>
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#10b981] text-[12px] text-right w-[80px]">1.5 min</p>
                  </div>
                  <div className="bg-[#f8fafc] border-[#e2e8f0] border-b border-solid content-stretch flex gap-[12px] items-start p-[12px] relative shrink-0 w-[426px]" data-name="row">
                    <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[12px] w-[45px]">08:02</p>
                    <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-[105px]" data-name="patient-cell">
                      <div className="relative shrink-0 size-[6px]" data-name="Ellipse">
                        <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgDropdownBadgeEllipse} />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] overflow-hidden relative shrink-0 text-[#0f172a] text-[13px] text-ellipsis whitespace-nowrap">Elena Rodríguez</p>
                    </div>
                    <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 w-[110px] whitespace-nowrap" data-name="info-cell">
                      <p className="font-jakarta font-semibold relative shrink-0 text-[#0f172a] text-[12px]">FC Muy Alta</p>
                      <p className="font-jakarta font-normal relative shrink-0 text-[#94a3b8] text-[10px]">Dr. R. Silva</p>
                    </div>
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#10b981] text-[12px] text-right w-[80px]">2.1 min</p>
                  </div>
                  <div className="bg-white border-[#e2e8f0] border-b border-solid content-stretch flex gap-[12px] items-start p-[12px] relative shrink-0 w-[426px]" data-name="row">
                    <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[12px] w-[45px]">07:45</p>
                    <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-[105px]" data-name="patient-cell">
                      <div className="relative shrink-0 size-[6px]" data-name="Ellipse">
                        <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgDropdownBadgeEllipse2} />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] overflow-hidden relative shrink-0 text-[#0f172a] text-[13px] text-ellipsis whitespace-nowrap">Gabriela Ruiz</p>
                    </div>
                    <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 w-[110px] whitespace-nowrap" data-name="info-cell">
                      <p className="font-jakarta font-semibold relative shrink-0 text-[#0f172a] text-[12px]">Ritmo Inestable</p>
                      <p className="font-jakarta font-normal relative shrink-0 text-[#94a3b8] text-[10px]">Dr. C. Méndez</p>
                    </div>
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#10b981] text-[12px] text-right w-[80px]">3.2 min</p>
                  </div>
                  <div className="bg-[#f8fafc] border-[#e2e8f0] border-b border-solid content-stretch flex gap-[12px] items-start p-[12px] relative shrink-0 w-[426px]" data-name="row">
                    <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[12px] w-[45px]">07:30</p>
                    <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-[105px]" data-name="patient-cell">
                      <div className="relative shrink-0 size-[6px]" data-name="Ellipse">
                        <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgDropdownBadgeEllipse2} />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] overflow-hidden relative shrink-0 text-[#0f172a] text-[13px] text-ellipsis whitespace-nowrap">Lucía Fernández</p>
                    </div>
                    <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 w-[110px] whitespace-nowrap" data-name="info-cell">
                      <p className="font-jakarta font-semibold relative shrink-0 text-[#0f172a] text-[12px]">Fiebre 38.9°C</p>
                      <p className="font-jakarta font-normal relative shrink-0 text-[#94a3b8] text-[10px]">Enf. Carlos M.</p>
                    </div>
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#10b981] text-[12px] text-right w-[80px]">4.0 min</p>
                  </div>
                  <div className="bg-white border-[#e2e8f0] border-b border-solid content-stretch flex gap-[12px] items-start p-[12px] relative shrink-0 w-[426px]" data-name="row">
                    <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[12px] w-[45px]">07:12</p>
                    <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-[105px]" data-name="patient-cell">
                      <div className="relative shrink-0 size-[6px]" data-name="Ellipse">
                        <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgDropdownBadgeEllipse} />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] overflow-hidden relative shrink-0 text-[#0f172a] text-[13px] text-ellipsis whitespace-nowrap">Javier Mendoza</p>
                    </div>
                    <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 w-[110px] whitespace-nowrap" data-name="info-cell">
                      <p className="font-jakarta font-semibold relative shrink-0 text-[#0f172a] text-[12px]">SpO2 Crítico</p>
                      <p className="font-jakarta font-normal relative shrink-0 text-[#94a3b8] text-[10px]">Dr. R. Silva</p>
                    </div>
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#10b981] text-[12px] text-right w-[80px]">1.8 min</p>
                  </div>
                  <div className="bg-[#f8fafc] border-[#e2e8f0] border-b border-solid content-stretch flex gap-[12px] items-start p-[12px] relative shrink-0 w-[426px]" data-name="row">
                    <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[12px] w-[45px]">06:50</p>
                    <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-[105px]" data-name="patient-cell">
                      <div className="relative shrink-0 size-[6px]" data-name="Ellipse">
                        <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgDropdownBadgeEllipse2} />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] overflow-hidden relative shrink-0 text-[#0f172a] text-[13px] text-ellipsis whitespace-nowrap">Elena Rodríguez</p>
                    </div>
                    <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 w-[110px] whitespace-nowrap" data-name="info-cell">
                      <p className="font-jakarta font-semibold relative shrink-0 text-[#0f172a] text-[12px]">Presión Baja</p>
                      <p className="font-jakarta font-normal relative shrink-0 text-[#94a3b8] text-[10px]">Dra. A. Gómez</p>
                    </div>
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#10b981] text-[12px] text-right w-[80px]">2.5 min</p>
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
