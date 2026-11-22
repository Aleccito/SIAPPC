// Pantalla "med/reportes/panel" (Figma node 48:241) — generada desde el diseño original de Figma.
import { Link } from 'react-router-dom';
import imgActivity11 from '../../assets/activity-11.svg';
import imgAlertas from '../../assets/alertas.svg';
import imgAvatar25Png from '../../assets/avatar-25.png';
import imgBell12 from '../../assets/bell-12.svg';
import imgCheckCircle2 from '../../assets/check-circle-2.svg';
import imgClipboard4 from '../../assets/clipboard-4.svg';
import imgClock from '../../assets/clock.svg';
import imgCpu5 from '../../assets/cpu-5.svg';
import imgCuidadoCritico from '../../assets/cuidado-critico.svg';
import imgDashboard from '../../assets/dashboard.svg';
import imgDispositivos from '../../assets/dispositivos.svg';
import imgDrRobertoSilva from '../../assets/dr-roberto-silva.svg';
import imgFileText10 from '../../assets/file-text-10.svg';
import imgFileText8 from '../../assets/file-text-8.svg';
import imgFileText9 from '../../assets/file-text-9.svg';
import imgGenerarNuevoReporte from '../../assets/generar-nuevo-reporte.svg';
import imgHelpIconEllipse from '../../assets/help-icon-ellipse.svg';
import imgIconwrapper17 from '../../assets/iconwrapper-17.svg';
import imgImageIcon from '../../assets/image-icon.svg';
import imgLayoutDashboard3 from '../../assets/layout-dashboard-3.svg';
import imgLineStroke from '../../assets/line-stroke.svg';
import imgLogOut3 from '../../assets/log-out-3.svg';
import imgLogOut4 from '../../assets/log-out-4.svg';
import imgLogoMark from '../../assets/logo-mark.svg';
import imgMedicoIntensivista from '../../assets/medico-intensivista.svg';
import imgModuloDeReportesClinicos from '../../assets/modulo-de-reportes-clinicos.svg';
import imgMonitoreo from '../../assets/monitoreo.svg';
import imgPacientes from '../../assets/pacientes.svg';
import imgPlus2 from '../../assets/plus-2.svg';
import imgRedBadge from '../../assets/red-badge.svg';
import imgReportes from '../../assets/reportes.svg';
import imgSearch from '../../assets/search.svg';
import imgSiappc from '../../assets/siappc.svg';
import imgSiappcReportes from '../../assets/siappc-reportes.svg';
import imgTabsLine from '../../assets/tabs-line.svg';
import imgTimer from '../../assets/timer.svg';
import imgUsers5 from '../../assets/users-5.svg';
import imgUsers6 from '../../assets/users-6.svg';

export default function MedReportesPanel() {
  return (
    <div className="content-stretch flex flex-col items-start overflow-clip relative rounded-[20px] shrink-0" data-name="med/reportes/panel">
      <div className="bg-[#f8fafc] content-stretch flex h-[900px] items-start overflow-clip relative shrink-0 w-[1440px]" data-name="SIAPPC-Reportes">
        <div className="bg-[#0f172a] border-[#1e293b] border-r border-solid content-stretch flex flex-col h-[900px] items-start justify-between px-[16px] py-[24px] relative shrink-0 w-[240px]" data-name="sidebar">
          <div className="content-stretch flex flex-col gap-[32px] items-start relative shrink-0 w-full" data-name="top-group">
            <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-name="brand">
              <div className="relative shrink-0 size-[32px]" data-name="logo-mark">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgLogoMark} />
              </div>
              <div className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start min-w-px relative" data-name="wordmark">
                <div className="h-[12.304px] relative shrink-0 w-[58.749px]" data-name="SIAPPC">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgSiappc} />
                </div>
                <div className="h-[10.211px] relative shrink-0 w-[90.131px]" data-name="CUIDADO CRÍTICO">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgCuidadoCritico} />
                </div>
              </div>
            </div>
            <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="menu">
              <Link className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Dashboard" to="/MedDashboardPrincipal">
                <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[18px]" data-name="icon-layout-dashboard">
                  <div className="relative shrink-0 size-[18px]" data-name="layout-dashboard">
                    <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgLayoutDashboard3} />
                  </div>
                </div>
                <div className="h-[10.766px] relative shrink-0 w-[72.274px]" data-name="Dashboard">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgDashboard} />
                </div>
              </Link>
              <Link className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Pacientes" to="/MedPacientesLista">
                <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[18px]" data-name="icon-users">
                  <div className="relative shrink-0 size-[18px]" data-name="users">
                    <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgUsers6} />
                  </div>
                </div>
                <div className="h-[10.598px] relative shrink-0 w-[64.272px]" data-name="Pacientes">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgPacientes} />
                </div>
              </Link>
              <Link className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Monitoreo" to="/MedMonitoreoGridUci">
                <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[18px]" data-name="icon-activity">
                  <div className="relative shrink-0 size-[18px]" data-name="activity">
                    <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgActivity11} />
                  </div>
                </div>
                <div className="h-[10.598px] relative shrink-0 w-[67.888px]" data-name="Monitoreo">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgMonitoreo} />
                </div>
              </Link>
              <Link className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Alertas" to="/MedAlertasCentro">
                <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[18px]" data-name="icon-bell">
                  <div className="relative shrink-0 size-[18px]" data-name="bell">
                    <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgBell12} />
                  </div>
                </div>
                <div className="h-[10.766px] relative shrink-0 w-[46.099px]" data-name="Alertas">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgAlertas} />
                </div>
              </Link>
              <Link className="bg-[rgba(37,99,235,0.15)] content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Reportes" to="/MedReportesPanel">
                <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[18px]" data-name="icon-file-text">
                  <div className="relative shrink-0 size-[18px]" data-name="file-text">
                    <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgFileText8} />
                  </div>
                </div>
                <div className="h-[13.23px] relative shrink-0 w-[61.314px]" data-name="Reportes">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgReportes} />
                </div>
              </Link>
              <Link className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Dispositivos" to="/MedDispositivosMonitores">
                <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[18px]" data-name="icon-cpu">
                  <div className="relative shrink-0 size-[18px]" data-name="cpu">
                    <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgCpu5} />
                  </div>
                </div>
                <div className="h-[13.23px] relative shrink-0 w-[80.501px]" data-name="Dispositivos">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgDispositivos} />
                </div>
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
            <div className="h-px relative shrink-0 w-full" data-name="Line (Stroke)">
              <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgLineStroke} />
            </div>
            <Link className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-name="user-profile" to="/MedPerfilMiPerfil">
              <div className="relative shrink-0 size-[40px]" data-name="avatar">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgAvatar25Png} width="40" height="40" />
              </div>
              <div className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start min-w-px relative" data-name="user-info">
                <div className="h-[9.997px] relative shrink-0 w-[103.616px]" data-name="Dr. Roberto Silva">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgDrRobertoSilva} />
                </div>
                <div className="h-[8.91px] relative shrink-0 w-[99.71px]" data-name="Médico Intensivista">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgMedicoIntensivista} />
                </div>
              </div>
              <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[18px]" data-name="icon-log-out">
                <div className="relative shrink-0 size-[18px]" data-name="log-out">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgLogOut3} />
                </div>
              </div>
            </Link>
          </div>
        </div>
        <div className="content-stretch flex flex-[1_0_0] flex-col h-full items-start min-w-px relative" data-name="main-container">
          <div className="bg-white border-[#e2e8f0] border-b border-solid content-stretch flex h-[72px] items-center justify-between px-[32px] relative shrink-0 w-full" data-name="top-bar">
            <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0" data-name="title-breadcrumb">
              <div className="h-[11.484px] relative shrink-0 w-[107.248px]" data-name="SIAPPC > Reportes">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgSiappcReportes} />
              </div>
              <div className="h-[20.4px] relative shrink-0 w-[278.027px]" data-name="Módulo de Reportes Clínicos">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgModuloDeReportesClinicos} />
              </div>
            </div>
            <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="right-actions">
              <div className="bg-[#2563eb] content-stretch flex gap-[8px] items-start px-[16px] py-[10px] relative rounded-[8px] shrink-0" data-name="btn-generate-top">
                <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[14px]" data-name="icon-plus">
                  <div className="relative shrink-0 size-[14px]" data-name="plus">
                    <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgPlus2} />
                  </div>
                </div>
                <div className="h-[12.441px] relative shrink-0 w-[147.451px]" data-name="Generar Nuevo Reporte">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgGenerarNuevoReporte} />
                </div>
              </div>
              <Link className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex items-center justify-center relative rounded-[18px] shrink-0 size-[36px]" data-name="notification-bell" to="/MedNotificacionesCentro">
                <div className="relative shrink-0 size-[18px]" data-name="IconWrapper">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgIconwrapper17} />
                </div>
                <div className="absolute right-[-3px] size-[16px] top-[-3px]" data-name="red-badge">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgRedBadge} />
                </div>
              </Link>
            </div>
          </div>
          <div className="content-stretch flex flex-col items-start px-[32px] relative shrink-0 w-full" data-name="tabs">
            <div className="content-stretch flex flex-col items-start pt-[16px] px-[32px] relative shrink-0 w-full" data-name="tabs">
              <div className="content-stretch flex gap-[24px] items-end relative shrink-0 w-full" data-name="tabs-row">
                <div className="content-stretch flex flex-col gap-[10px] items-start pb-[8px] relative shrink-0" data-name="tab-resumen">
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#2563eb] text-[13px] whitespace-nowrap">Resumen</p>
                  <div className="bg-[#2563eb] h-[2px] relative shrink-0 w-full" data-name="inactive-indicator" />
                </div>
                <div className="content-stretch flex flex-col gap-[10px] items-start pb-[8px] relative shrink-0" data-name="tab-historial">
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[13px] whitespace-nowrap">Historial de Entregas</p>
                  <div className="bg-[rgba(0,0,0,0)] h-[2px] relative rounded-[1px] shrink-0 w-full" data-name="active-indicator" />
                </div>
              </div>
              <div className="h-0 relative shrink-0 w-full" data-name="Line">
                <div className="absolute inset-[-1px_0_0_0]">
                  <img className="block max-w-none size-full" alt="" src={imgTabsLine} />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[#f8fafc] content-stretch flex flex-[1_0_0] flex-col gap-[24px] items-start min-h-px p-[32px] relative w-full" data-name="page-body">
            <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="summary-section">
              <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start leading-[normal] relative shrink-0 w-full" data-name="section-header">
                <p className="font-jakarta font-bold relative shrink-0 text-[#0f172a] text-[18px] whitespace-nowrap">Resumen Personal del Médico</p>
                <p className="font-jakarta font-normal min-w-full relative shrink-0 text-[#64748b] text-[13px] w-[min-content]">Indicadores clave de entrega de resultados para este mes.</p>
              </div>
              <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full" data-name="kpi-row">
                <div className="bg-white border border-[#e2e8f0] border-solid content-stretch drop-shadow-[0px_2px_5px_rgba(15,23,42,0.05)] flex flex-[1_0_0] flex-col gap-[10px] items-start min-w-px p-[16px] relative rounded-[12px]" data-name="kpi-card">
                  <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full" data-name="Frame">
                    <div className="bg-[#eff6ff] content-stretch flex flex-col items-center justify-center relative rounded-[10px] shrink-0 size-[36px]" data-name="Frame">
                      <div className="relative shrink-0 size-[18px]" data-name="file-text">
                        <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgFileText9} />
                      </div>
                    </div>
                    <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[13px] whitespace-nowrap">Reportes Generados</p>
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#0f172a] text-[28px] whitespace-nowrap">12</p>
                  <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#64748b] text-[12px] whitespace-nowrap">Este mes</p>
                </div>
                <div className="bg-white border border-[#e2e8f0] border-solid content-stretch drop-shadow-[0px_2px_5px_rgba(15,23,42,0.05)] flex flex-[1_0_0] flex-col gap-[10px] items-start min-w-px p-[16px] relative rounded-[12px]" data-name="kpi-card">
                  <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full" data-name="Frame">
                    <div className="bg-[#ffedd5] content-stretch flex flex-col items-center justify-center relative rounded-[10px] shrink-0 size-[36px]" data-name="Frame">
                      <div className="relative shrink-0 size-[18px]" data-name="clock">
                        <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgClock} />
                      </div>
                    </div>
                    <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[13px] whitespace-nowrap">Pendientes</p>
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#0f172a] text-[28px] whitespace-nowrap">3</p>
                  <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#64748b] text-[12px] whitespace-nowrap">En revisión</p>
                </div>
                <div className="bg-white border border-[#e2e8f0] border-solid content-stretch drop-shadow-[0px_2px_5px_rgba(15,23,42,0.05)] flex flex-[1_0_0] flex-col gap-[10px] items-start min-w-px p-[16px] relative rounded-[12px]" data-name="kpi-card">
                  <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full" data-name="Frame">
                    <div className="bg-[#ecfdf5] content-stretch flex flex-col items-center justify-center relative rounded-[10px] shrink-0 size-[36px]" data-name="Frame">
                      <div className="relative shrink-0 size-[18px]" data-name="check-circle">
                        <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgCheckCircle2} />
                      </div>
                    </div>
                    <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[13px] whitespace-nowrap">Entregados</p>
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#0f172a] text-[28px] whitespace-nowrap">8</p>
                  <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#64748b] text-[12px] whitespace-nowrap">Esta semana</p>
                </div>
                <div className="bg-white border border-[#e2e8f0] border-solid content-stretch drop-shadow-[0px_2px_5px_rgba(15,23,42,0.05)] flex flex-[1_0_0] flex-col gap-[10px] items-start min-w-px p-[16px] relative rounded-[12px]" data-name="kpi-card">
                  <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full" data-name="Frame">
                    <div className="bg-[#eff6ff] content-stretch flex flex-col items-center justify-center relative rounded-[10px] shrink-0 size-[36px]" data-name="Frame">
                      <div className="relative shrink-0 size-[18px]" data-name="timer">
                        <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgTimer} />
                      </div>
                    </div>
                    <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[13px] whitespace-nowrap">Tiempo promedio</p>
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#0f172a] text-[28px] whitespace-nowrap">2.4 días</p>
                  <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#64748b] text-[12px] whitespace-nowrap">De entrega</p>
                </div>
              </div>
            </div>
            <Link className="bg-gradient-to-r border border-[#e2e8f0] border-solid content-stretch cursor-pointer drop-shadow-[0px_2px_5px_rgba(15,23,42,0.05)] flex from-[#eff6ff] h-[96px] items-center justify-between p-[16px] relative rounded-[12px] shrink-0 to-white w-full" data-name="quick-access-handoff" to="/MedTurnoEntregaHandoff">
              <div className="content-stretch flex flex-[1_0_0] gap-[12px] items-center min-w-px relative" data-name="left">
                <div className="bg-[#2563eb] content-stretch flex flex-col items-center justify-center relative rounded-[12px] shrink-0 size-[40px]" data-name="icon">
                  <div className="relative shrink-0 size-[20px]" data-name="clipboard">
                    <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgClipboard4} />
                  </div>
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative text-left" data-name="copy">
                  <p className="font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#0f172a] text-[14px] whitespace-nowrap">Reporte de Entrega de Turno</p>
                  <p className="font-jakarta font-normal leading-[1.4] min-w-full relative shrink-0 text-[#64748b] text-[12px] w-[min-content]">Genera el reporte general de handoff con el resumen de todos los pacientes a tu cargo</p>
                  <p className="font-jakarta font-semibold leading-[normal] min-w-full relative shrink-0 text-[#64748b] text-[11px] w-[min-content]">Último generado: 24 Oct 2025, 07:00 — Turno Matutino</p>
                </div>
              </div>
              <div className="bg-[#2563eb] content-stretch flex h-[40px] items-center justify-center px-[16px] py-[8px] relative rounded-[8px] shrink-0" data-name="btn-generate">
                <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[13px] text-left text-white whitespace-nowrap">Generar Reporte de Turno</p>
              </div>
            </Link>
            <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="pending-section">
              <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start leading-[normal] relative shrink-0 w-full" data-name="section-header">
                <p className="font-jakarta font-bold relative shrink-0 text-[#0f172a] text-[18px] whitespace-nowrap">Reportes Pendientes de Entrega</p>
                <p className="font-jakarta font-normal min-w-full relative shrink-0 text-[#64748b] text-[13px] w-[min-content]">Revisa y finaliza los reportes que requieren tu atención.</p>
              </div>
              <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[12px] shadow-[0px_2px_10px_0px_rgba(15,23,42,0.05)] shrink-0 w-full" data-name="pending-table">
                <div className="[word-break:break-word] bg-[#f8fafc] border-[#e2e8f0] border-b border-solid content-stretch flex font-jakarta font-bold gap-[12px] items-center leading-[normal] px-[16px] py-[12px] relative shrink-0 text-[#64748b] text-[12px] w-full" data-name="table-header">
                  <p className="flex-[1_0_0] min-w-px relative">Paciente</p>
                  <p className="relative shrink-0 w-[180px]">Tipo de Reporte</p>
                  <p className="relative shrink-0 w-[140px]">Fecha Generación</p>
                  <p className="relative shrink-0 w-[140px]">Estado</p>
                  <p className="relative shrink-0 text-right w-[120px]">Acción</p>
                </div>
                <div className="border-[#e2e8f0] border-b border-solid content-stretch flex gap-[12px] items-center px-[16px] py-[14px] relative shrink-0 w-full" data-name="row">
                  <p className="[word-break:break-word] flex-[1_0_0] font-jakarta font-semibold leading-[normal] min-w-px relative text-[#0f172a] text-[13px]">María González</p>
                  <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[180px]">Evolución Clínica</p>
                  <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[140px]">24 Oct 2025</p>
                  <div className="content-stretch flex items-start relative shrink-0 w-[140px]" data-name="Frame">
                    <div className="bg-[#ffedd5] content-stretch flex items-start px-[10px] py-[4px] relative rounded-[999px] shrink-0" data-name="Frame">
                      <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#f97316] text-[12px] whitespace-nowrap">Pendiente revisión</p>
                    </div>
                  </div>
                  <div className="content-stretch flex items-start justify-end relative shrink-0 w-[120px]" data-name="Frame">
                    <div className="bg-[#eff6ff] content-stretch flex items-start px-[12px] py-[8px] relative rounded-[8px] shrink-0" data-name="Frame">
                      <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#2563eb] text-[13px] whitespace-nowrap">Entregar</p>
                    </div>
                  </div>
                </div>
                <div className="border-[#e2e8f0] border-b border-solid content-stretch flex gap-[12px] items-center px-[16px] py-[14px] relative shrink-0 w-full" data-name="row">
                  <p className="[word-break:break-word] flex-[1_0_0] font-jakarta font-semibold leading-[normal] min-w-px relative text-[#0f172a] text-[13px]">Javier Mendoza</p>
                  <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[180px]">Alta Médica</p>
                  <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[140px]">23 Oct 2025</p>
                  <div className="content-stretch flex items-start relative shrink-0 w-[140px]" data-name="Frame">
                    <div className="bg-[#ecfdf5] content-stretch flex items-start px-[10px] py-[4px] relative rounded-[999px] shrink-0" data-name="Frame">
                      <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#10b981] text-[12px] whitespace-nowrap">Listo para entregar</p>
                    </div>
                  </div>
                  <div className="content-stretch flex items-start justify-end relative shrink-0 w-[120px]" data-name="Frame">
                    <div className="bg-[#eff6ff] content-stretch flex items-start px-[12px] py-[8px] relative rounded-[8px] shrink-0" data-name="Frame">
                      <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#2563eb] text-[13px] whitespace-nowrap">Entregar</p>
                    </div>
                  </div>
                </div>
                <div className="content-stretch flex gap-[12px] items-center px-[16px] py-[14px] relative shrink-0 w-full" data-name="row">
                  <p className="[word-break:break-word] flex-[1_0_0] font-jakarta font-semibold leading-[normal] min-w-px relative text-[#0f172a] text-[13px]">Sofía Martínez</p>
                  <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[180px]">Interconsulta</p>
                  <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[140px]">22 Oct 2025</p>
                  <div className="content-stretch flex items-start relative shrink-0 w-[140px]" data-name="Frame">
                    <div className="bg-[#f3f4f6] content-stretch flex items-start px-[10px] py-[4px] relative rounded-[999px] shrink-0" data-name="Frame">
                      <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[12px] whitespace-nowrap">Pendiente firma</p>
                    </div>
                  </div>
                  <div className="content-stretch flex items-start justify-end relative shrink-0 w-[120px]" data-name="Frame">
                    <div className="bg-[#eff6ff] content-stretch flex items-start px-[12px] py-[8px] relative rounded-[8px] shrink-0" data-name="Frame">
                      <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#2563eb] text-[13px] whitespace-nowrap">Entregar</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="history-section">
              <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start leading-[normal] relative shrink-0 w-full" data-name="section-header">
                <p className="font-jakarta font-bold relative shrink-0 text-[#0f172a] text-[18px] whitespace-nowrap">Reportes por Paciente</p>
                <p className="font-jakarta font-normal min-w-full relative shrink-0 text-[#64748b] text-[13px] w-[min-content]">Historial de entregas recientes.</p>
              </div>
              <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[12px] shadow-[0px_2px_10px_0px_rgba(15,23,42,0.05)] shrink-0 w-full" data-name="history-table">
                <div className="[word-break:break-word] bg-[#f8fafc] border-[#e2e8f0] border-b border-solid content-stretch flex font-jakarta font-bold gap-[12px] items-center leading-[normal] px-[16px] py-[12px] relative shrink-0 text-[#64748b] text-[12px] w-full" data-name="table-header">
                  <p className="flex-[1_0_0] min-w-px relative">NOMBRE DEL ARCHIVO</p>
                  <p className="relative shrink-0 w-[140px]">TIPO</p>
                  <p className="relative shrink-0 w-[140px]">FECHA</p>
                  <p className="relative shrink-0 w-[160px]">GENERADO POR</p>
                  <p className="relative shrink-0 w-[80px]">FORMATO</p>
                  <p className="relative shrink-0 text-right w-[120px]">ACCIONES</p>
                </div>
                <div className="border-[#e2e8f0] border-b border-solid content-stretch flex gap-[12px] items-center px-[16px] py-[14px] relative shrink-0 w-full" data-name="row">
                  <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-w-px relative" data-name="file-cell">
                    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 size-[16px]" data-name="Frame">
                      <div className="relative shrink-0 size-[16px]" data-name="file-text">
                        <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgFileText10} />
                      </div>
                    </div>
                    <p className="[word-break:break-word] flex-[1_0_0] font-jakarta font-semibold leading-[normal] min-w-px relative text-[#0f172a] text-[13px]">Reporte_Clinico_PT-8821_Rodríguez.pdf</p>
                  </div>
                  <div className="content-stretch flex items-start relative shrink-0 w-[140px]" data-name="Frame">
                    <div className="bg-[#eff6ff] content-stretch flex items-start px-[10px] py-[4px] relative rounded-[999px] shrink-0" data-name="Frame">
                      <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#2563eb] text-[12px] whitespace-nowrap">CLÍNICO</p>
                    </div>
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[140px]">24 Oct 2025</p>
                  <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[160px]">Dr. Roberto Silva</p>
                  <div className="content-stretch flex items-start relative shrink-0 w-[80px]" data-name="Frame">
                    <div className="bg-[#fee2e2] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[999px] shrink-0" data-name="Frame">
                      <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#ef4444] text-[12px] whitespace-nowrap">PDF</p>
                    </div>
                  </div>
                  <div className="content-stretch flex gap-[12px] items-start justify-end relative shrink-0 w-[120px]" data-name="Frame">
                    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 size-[16px]" data-name="Frame">
                      <div className="relative shrink-0 size-[16px]" data-name="search">
                        <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgSearch} />
                      </div>
                    </div>
                    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 size-[16px]" data-name="Frame">
                      <div className="relative shrink-0 size-[16px]" data-name="log-out">
                        <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgLogOut4} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="border-[#e2e8f0] border-b border-solid content-stretch flex gap-[12px] items-center px-[16px] py-[14px] relative shrink-0 w-full" data-name="row">
                  <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-w-px relative" data-name="file-cell">
                    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 size-[16px]" data-name="Frame">
                      <div className="relative shrink-0 size-[16px]" data-name="file-text">
                        <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgFileText10} />
                      </div>
                    </div>
                    <p className="[word-break:break-word] flex-[1_0_0] font-jakarta font-semibold leading-[normal] min-w-px relative text-[#0f172a] text-[13px]">Resumen_Ocupacion_UCI_S42.xlsx</p>
                  </div>
                  <div className="content-stretch flex items-start relative shrink-0 w-[140px]" data-name="Frame">
                    <div className="bg-[#ecfdf5] content-stretch flex items-start px-[10px] py-[4px] relative rounded-[999px] shrink-0" data-name="Frame">
                      <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#10b981] text-[12px] whitespace-nowrap">OPERATIVO</p>
                    </div>
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[140px]">23 Oct 2025</p>
                  <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[160px]">Sist. Administrativo</p>
                  <div className="content-stretch flex items-start relative shrink-0 w-[80px]" data-name="Frame">
                    <div className="bg-[#ecfdf5] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[999px] shrink-0" data-name="Frame">
                      <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#10b981] text-[12px] whitespace-nowrap">EXCEL</p>
                    </div>
                  </div>
                  <div className="content-stretch flex gap-[12px] items-start justify-end relative shrink-0 w-[120px]" data-name="Frame">
                    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 size-[16px]" data-name="Frame">
                      <div className="relative shrink-0 size-[16px]" data-name="search">
                        <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgSearch} />
                      </div>
                    </div>
                    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 size-[16px]" data-name="Frame">
                      <div className="relative shrink-0 size-[16px]" data-name="log-out">
                        <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgLogOut4} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="border-[#e2e8f0] border-b border-solid content-stretch flex gap-[12px] items-center px-[16px] py-[14px] relative shrink-0 w-full" data-name="row">
                  <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-w-px relative" data-name="file-cell">
                    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 size-[16px]" data-name="Frame">
                      <div className="relative shrink-0 size-[16px]" data-name="file-text">
                        <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgFileText10} />
                      </div>
                    </div>
                    <p className="[word-break:break-word] flex-[1_0_0] font-jakarta font-semibold leading-[normal] min-w-px relative text-[#0f172a] text-[13px]">Analisis_Alertas_Criticas_Septiembre.pdf</p>
                  </div>
                  <div className="content-stretch flex items-start relative shrink-0 w-[140px]" data-name="Frame">
                    <div className="bg-[#f3f4f6] content-stretch flex items-start px-[10px] py-[4px] relative rounded-[999px] shrink-0" data-name="Frame">
                      <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[12px] whitespace-nowrap">ADMINISTRATIVO</p>
                    </div>
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[140px]">01 Oct 2025</p>
                  <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[160px]">Dr. Carlos Méndez</p>
                  <div className="content-stretch flex items-start relative shrink-0 w-[80px]" data-name="Frame">
                    <div className="bg-[#fee2e2] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[999px] shrink-0" data-name="Frame">
                      <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#ef4444] text-[12px] whitespace-nowrap">PDF</p>
                    </div>
                  </div>
                  <div className="content-stretch flex gap-[12px] items-start justify-end relative shrink-0 w-[120px]" data-name="Frame">
                    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 size-[16px]" data-name="Frame">
                      <div className="relative shrink-0 size-[16px]" data-name="search">
                        <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgSearch} />
                      </div>
                    </div>
                    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 size-[16px]" data-name="Frame">
                      <div className="relative shrink-0 size-[16px]" data-name="log-out">
                        <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgLogOut4} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="border-[#e2e8f0] border-b border-solid content-stretch flex gap-[12px] items-center px-[16px] py-[14px] relative shrink-0 w-full" data-name="row">
                  <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-w-px relative" data-name="file-cell">
                    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 size-[16px]" data-name="Frame">
                      <div className="relative shrink-0 size-[16px]" data-name="file-text">
                        <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgFileText10} />
                      </div>
                    </div>
                    <p className="[word-break:break-word] flex-[1_0_0] font-jakarta font-semibold leading-[normal] min-w-px relative text-[#0f172a] text-[13px]">Evolucion_Mendoza_PT-8822.pdf</p>
                  </div>
                  <div className="content-stretch flex items-start relative shrink-0 w-[140px]" data-name="Frame">
                    <div className="bg-[#eff6ff] content-stretch flex items-start px-[10px] py-[4px] relative rounded-[999px] shrink-0" data-name="Frame">
                      <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#2563eb] text-[12px] whitespace-nowrap">CLÍNICO</p>
                    </div>
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[140px]">29 Sep 2025</p>
                  <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[160px]">Dr. Roberto Silva</p>
                  <div className="content-stretch flex items-start relative shrink-0 w-[80px]" data-name="Frame">
                    <div className="bg-[#fee2e2] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[999px] shrink-0" data-name="Frame">
                      <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#ef4444] text-[12px] whitespace-nowrap">PDF</p>
                    </div>
                  </div>
                  <div className="content-stretch flex gap-[12px] items-start justify-end relative shrink-0 w-[120px]" data-name="Frame">
                    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 size-[16px]" data-name="Frame">
                      <div className="relative shrink-0 size-[16px]" data-name="search">
                        <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgSearch} />
                      </div>
                    </div>
                    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 size-[16px]" data-name="Frame">
                      <div className="relative shrink-0 size-[16px]" data-name="log-out">
                        <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgLogOut4} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="content-stretch flex gap-[12px] items-center px-[16px] py-[14px] relative shrink-0 w-full" data-name="row">
                  <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-w-px relative" data-name="file-cell">
                    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 size-[16px]" data-name="Frame">
                      <div className="relative shrink-0 size-[16px]" data-name="file-text">
                        <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgFileText10} />
                      </div>
                    </div>
                    <p className="[word-break:break-word] flex-[1_0_0] font-jakarta font-semibold leading-[normal] min-w-px relative text-[#0f172a] text-[13px]">Consolidado_Farmacos_UCI_Q3.xlsx</p>
                  </div>
                  <div className="content-stretch flex items-start relative shrink-0 w-[140px]" data-name="Frame">
                    <div className="bg-[#ecfdf5] content-stretch flex items-start px-[10px] py-[4px] relative rounded-[999px] shrink-0" data-name="Frame">
                      <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#10b981] text-[12px] whitespace-nowrap">OPERATIVO</p>
                    </div>
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[140px]">15 Sep 2025</p>
                  <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[160px]">Enf. Lucía Fernández</p>
                  <div className="content-stretch flex items-start relative shrink-0 w-[80px]" data-name="Frame">
                    <div className="bg-[#ecfdf5] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[999px] shrink-0" data-name="Frame">
                      <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#10b981] text-[12px] whitespace-nowrap">EXCEL</p>
                    </div>
                  </div>
                  <div className="content-stretch flex gap-[12px] items-start justify-end relative shrink-0 w-[120px]" data-name="Frame">
                    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 size-[16px]" data-name="Frame">
                      <div className="relative shrink-0 size-[16px]" data-name="search">
                        <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgSearch} />
                      </div>
                    </div>
                    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 size-[16px]" data-name="Frame">
                      <div className="relative shrink-0 size-[16px]" data-name="log-out">
                        <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgLogOut4} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="content-stretch flex items-center justify-between pt-[12px] relative shrink-0 w-full" data-name="pagination">
                <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#64748b] text-[13px] whitespace-nowrap">Mostrando 5 de 18 reportes generados</p>
                <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="buttons">
                  <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-start px-[12px] py-[8px] relative rounded-[8px] shrink-0" data-name="Frame">
                    <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] whitespace-nowrap">Anterior</p>
                  </div>
                  <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-start px-[12px] py-[8px] relative rounded-[8px] shrink-0" data-name="Frame">
                    <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] whitespace-nowrap">Siguiente</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="templates-section">
              <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start leading-[normal] relative shrink-0 w-full" data-name="section-header">
                <p className="font-jakarta font-bold relative shrink-0 text-[#0f172a] text-[18px] whitespace-nowrap">Plantillas de Reporte Rápido</p>
                <p className="font-jakarta font-normal min-w-full relative shrink-0 text-[#64748b] text-[13px] w-[min-content]">Accede a las plantillas más usadas para generar resultados.</p>
              </div>
              <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full" data-name="template-cards">
                <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[12px] h-[180px] items-start min-w-px overflow-clip p-[20px] relative rounded-[12px] shadow-[0px_2px_10px_0px_rgba(15,23,42,0.05)]" data-name="template-card">
                  <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-name="top">
                    <div className="bg-[#eff6ff] content-stretch flex flex-col items-center justify-center relative rounded-[10px] shrink-0 size-[40px]" data-name="Frame">
                      <div className="relative shrink-0 size-[20px]" data-name="users">
                        <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgUsers5} />
                      </div>
                    </div>
                    <p className="[word-break:break-word] flex-[1_0_0] font-jakarta font-bold leading-[normal] min-w-px relative text-[#0f172a] text-[14px]">Evolución Clínica Individual</p>
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#64748b] text-[13px] w-full">Monitoreo longitudinal de signos vitales, parámetros ventilatorios y notas SOAP.</p>
                  <div className="bg-[#eff6ff] content-stretch flex items-start justify-center px-[12px] py-[8px] relative rounded-[6px] shrink-0 w-full" data-name="btn-generate">
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#2563eb] text-[13px] whitespace-nowrap">Configurar y Generar</p>
                  </div>
                </div>
                <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[12px] h-[180px] items-start min-w-px overflow-clip p-[20px] relative rounded-[12px] shadow-[0px_2px_10px_0px_rgba(15,23,42,0.05)]" data-name="template-card">
                  <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-name="top">
                    <div className="bg-[#eff6ff] content-stretch flex flex-col items-center justify-center relative rounded-[10px] shrink-0 size-[40px]" data-name="Frame">
                      <div className="relative shrink-0 size-[20px]" data-name="file-text">
                        <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgImageIcon} />
                      </div>
                    </div>
                    <p className="[word-break:break-word] flex-[1_0_0] font-jakarta font-bold leading-[normal] min-w-px relative text-[#0f172a] text-[14px]">Reporte de Alta</p>
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#64748b] text-[13px] w-full">Documento final con recomendaciones, medicación y seguimiento post-egreso.</p>
                  <div className="bg-[#eff6ff] content-stretch flex items-start justify-center px-[12px] py-[8px] relative rounded-[6px] shrink-0 w-full" data-name="btn-generate">
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#2563eb] text-[13px] whitespace-nowrap">Configurar y Generar</p>
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
