// Pantalla "med/paciente/notas-soap-nueva" (Figma node 29:1881) — generada desde el diseño original de Figma.
import { Link } from 'react-router-dom';
import imgAvatar2Png from '../../assets/avatar-2.png';
import imgBell3 from '../../assets/bell-3.svg';
import imgBtnNuevaNotaFrame from '../../assets/btn-nueva-nota-frame.svg';
import imgBtnReporteFrame from '../../assets/btn-reporte-frame.svg';
import imgCalendar2 from '../../assets/calendar-2.svg';
import imgDoctorFooterLine from '../../assets/doctor-footer-line.svg';
import imgHeaderRowFrame from '../../assets/header-row-frame.svg';
import imgHeaderRowFrame2 from '../../assets/header-row-frame-2.svg';
import imgHelpIconEllipse from '../../assets/help-icon-ellipse.svg';
import imgIconWrap from '../../assets/icon-wrap.svg';
import imgIconWrap2 from '../../assets/icon-wrap-2.svg';
import imgLayoutDashboard from '../../assets/layout-dashboard.svg';
import imgLiveIndicatorEllipse from '../../assets/live-indicator-ellipse.svg';
import imgLogOut from '../../assets/log-out.svg';
import imgMenuItemDispositivosFrame from '../../assets/menu-item-dispositivos-frame.svg';
import imgMenuItemPacientesFrame from '../../assets/menu-item-pacientes-frame.svg';
import imgMenuItemReportesFrame from '../../assets/menu-item-reportes-frame.svg';
import imgModalHeaderFrame from '../../assets/modal-header-frame.svg';
import imgPatientAvatarPng from '../../assets/patient-avatar.png';
import imgSearch4 from '../../assets/search-4.svg';
import imgSoapCardLine3 from '../../assets/soap-card-line-3.svg';
import imgSoapModalLine from '../../assets/soap-modal-line.svg';
import imgWave from '../../assets/wave.svg';
import imgWave2 from '../../assets/wave-2.svg';
import imgWave3 from '../../assets/wave-3.svg';
import imgXCircle from '../../assets/x-circle.svg';

export default function MedPacienteNotasSoapNueva() {
  return (
    <div className="bg-[#f8fafc] h-[900px] relative shrink-0 w-[1440px]" data-name="med/paciente/notas-soap-nueva">
      <div className="absolute bg-[#f8fafc] content-stretch flex h-[900px] items-start left-0 top-0 w-[1440px]" data-name="dashboard-medico-detalle-paciente">
        <div className="bg-[#0f172a] border-[#e2e8f0] border-r border-solid content-stretch flex flex-col h-[900px] items-start justify-between px-[16px] py-[24px] relative shrink-0 w-[240px]" data-name="sidebar">
          <div className="content-stretch flex flex-col gap-[32px] items-start relative shrink-0 w-full" data-name="top-group">
            <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-name="brand">
              <div className="bg-[#2563eb] content-stretch flex flex-col items-center justify-center relative rounded-[8px] shrink-0 size-[32px]" data-name="logo-mark">
                <p className="[word-break:break-word] font-geist font-extrabold leading-[normal] relative shrink-0 text-[14px] text-white whitespace-nowrap">S</p>
              </div>
              <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px relative whitespace-nowrap" data-name="wordmark">
                <p className="font-geist font-extrabold relative shrink-0 text-[16px] text-white">SIAPPC</p>
                <p className="font-geist font-semibold overflow-hidden relative shrink-0 text-[#64748b] text-[10px] text-ellipsis uppercase">CUIDADO CRÍTICO</p>
              </div>
            </div>
            <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="menu">
              <Link className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Dashboard" to="/MedDashboardPrincipal">
                <div className="relative shrink-0 size-[18px]" data-name="icon-wrap">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgLayoutDashboard} />
                </div>
                <p className="[word-break:break-word] flex-[1_0_0] font-geist font-medium leading-[normal] min-w-px relative text-[#64748b] text-[14px]">Dashboard</p>
              </Link>
              <Link className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Pacientes" to="/MedPacientesLista">
                <div className="relative shrink-0 size-[18px]" data-name="icon-wrap">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgMenuItemPacientesFrame} />
                </div>
                <p className="[word-break:break-word] flex-[1_0_0] font-geist font-medium leading-[normal] min-w-px relative text-[#64748b] text-[14px]">Pacientes</p>
              </Link>
              <Link className="bg-[rgba(37,99,235,0.15)] content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Monitoreo" to="/MedMonitoreoGridUci">
                <div className="relative shrink-0 size-[18px]" data-name="icon-wrap">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgIconWrap} />
                </div>
                <p className="[word-break:break-word] flex-[1_0_0] font-jakarta font-bold leading-[normal] min-w-px relative text-[14px] text-white">Monitoreo</p>
              </Link>
              <Link className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Alertas" to="/MedAlertasCentro">
                <div className="relative shrink-0 size-[18px]" data-name="icon-wrap">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgIconWrap2} />
                </div>
                <p className="[word-break:break-word] flex-[1_0_0] font-geist font-medium leading-[normal] min-w-px relative text-[#64748b] text-[14px]">Alertas</p>
              </Link>
              <Link className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Reportes" to="/MedReportesPanel">
                <div className="relative shrink-0 size-[18px]" data-name="icon-wrap">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgMenuItemReportesFrame} />
                </div>
                <p className="[word-break:break-word] flex-[1_0_0] font-geist font-medium leading-[normal] min-w-px relative text-[#64748b] text-[14px]">Reportes</p>
              </Link>
              <Link className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Dispositivos" to="/MedDispositivosMonitores">
                <div className="relative shrink-0 size-[18px]" data-name="icon-wrap">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgMenuItemDispositivosFrame} />
                </div>
                <p className="[word-break:break-word] flex-[1_0_0] font-geist font-medium leading-[normal] min-w-px relative text-[#64748b] text-[14px]">Dispositivos</p>
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
                <img className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[20px] size-full" alt="" src={imgAvatar2Png} />
              </div>
              <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px relative whitespace-nowrap" data-name="user-info">
                <p className="font-geist font-bold overflow-hidden relative shrink-0 text-[13px] text-ellipsis text-white">Dr. Carlos Méndez</p>
                <p className="font-geist font-medium overflow-hidden relative shrink-0 text-[#64748b] text-[11px] text-ellipsis">Médico Intensivista</p>
              </div>
              <div className="relative shrink-0 size-[18px]" data-name="log-out">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgLogOut} />
              </div>
            </Link>
          </div>
        </div>
        <div className="content-stretch flex flex-col h-[900px] items-start relative shrink-0 w-[1200px]" data-name="main-container">
          <div className="bg-white border-[#e2e8f0] border-b border-solid content-stretch flex h-[72px] items-center justify-between px-[32px] relative shrink-0 w-full" data-name="top-bar">
            <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start leading-[normal] relative shrink-0 whitespace-nowrap" data-name="title-breadcrumb">
              <p className="font-geist font-medium relative shrink-0 text-[#64748b] text-[12px]">{`Dashboard > Central de Monitoreo > María González`}</p>
              <p className="font-geist font-extrabold relative shrink-0 text-[#0f172a] text-[20px]">Detalle de Paciente</p>
            </div>
            <div className="content-stretch flex gap-[20px] items-center relative shrink-0" data-name="right-actions">
              <div className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex gap-[8px] items-center px-[12px] py-[6px] relative rounded-[8px] shrink-0" data-name="search">
                <div className="relative shrink-0 size-[14px]" data-name="search">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgSearch4} />
                </div>
                <p className="[word-break:break-word] font-geist font-normal leading-[normal] relative shrink-0 text-[#64748b] text-[13px] whitespace-nowrap">Buscar paciente, cama...</p>
              </div>
              <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="datetime">
                <div className="relative shrink-0 size-[14px]" data-name="calendar">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgCalendar2} />
                </div>
                <p className="[word-break:break-word] font-geist font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[13px] whitespace-nowrap">24 Oct 2025, 08:30</p>
              </div>
              <Link className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex items-center justify-center relative rounded-[18px] shrink-0 size-[36px]" data-name="notification-bell" to="/MedNotificacionesCentro">
                <div className="relative shrink-0 size-[18px]" data-name="bell">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgBell3} />
                </div>
                <div className="absolute bg-[#ef4444] content-stretch flex items-center justify-center right-[-3px] rounded-[8px] size-[16px] top-[-3px]" data-name="red-badge">
                  <p className="[word-break:break-word] font-geist font-extrabold leading-[normal] relative shrink-0 text-[10px] text-white whitespace-nowrap">3</p>
                </div>
              </Link>
            </div>
          </div>
          <div className="content-stretch flex flex-[1_0_0] flex-col gap-[20px] items-start min-h-px overflow-clip p-[32px] relative w-full" data-name="page-body">
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col items-start p-[20px] relative rounded-[12px] shrink-0 w-full" data-name="patient-header-card">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="patient-header-top">
                <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="patient-info-group">
                  <div className="relative rounded-[28px] shrink-0 size-[56px]" data-name="patient-avatar">
                    <img className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[28px] size-full" alt="" src={imgPatientAvatarPng} />
                  </div>
                  <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0" data-name="patient-details">
                    <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="name-badge-row">
                      <p className="[word-break:break-word] font-geist font-extrabold leading-[normal] relative shrink-0 text-[#0f172a] text-[22px] whitespace-nowrap">María González</p>
                      <div className="bg-[#fef2f2] content-stretch flex items-start px-[10px] py-[4px] relative rounded-[6px] shrink-0" data-name="critical-badge">
                        <p className="[word-break:break-word] font-geist font-bold leading-[normal] relative shrink-0 text-[#ef4444] text-[12px] whitespace-nowrap">Crítico</p>
                      </div>
                      <div className="bg-[#eff6ff] content-stretch flex items-start px-[10px] py-[4px] relative rounded-[6px] shrink-0" data-name="bed-badge">
                        <p className="[word-break:break-word] font-geist font-bold leading-[normal] relative shrink-0 text-[#2563eb] text-[12px] whitespace-nowrap">Cama 03</p>
                      </div>
                    </div>
                    <div className="[word-break:break-word] content-stretch flex gap-[20px] items-center leading-[normal] relative shrink-0 text-[13px] whitespace-nowrap" data-name="meta-row">
                      <p className="font-geist font-medium relative shrink-0 text-[#64748b]">ID PT-8821</p>
                      <p className="font-geist font-medium relative shrink-0 text-[#64748b]">67 años</p>
                      <p className="font-geist font-semibold relative shrink-0 text-[#0f172a]">Insuficiencia Cardíaca Congestiva</p>
                      <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="admission-row">
                        <p className="font-geist font-normal relative shrink-0 text-[#64748b]">Ingreso:</p>
                        <p className="font-geist font-semibold relative shrink-0 text-[#0f172a]">15 Oct 2025</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="content-stretch flex gap-[10px] items-center relative shrink-0" data-name="action-buttons">
                  <div className="bg-[#2563eb] content-stretch flex gap-[6px] items-center px-[16px] py-[8px] relative rounded-[8px] shrink-0" data-name="btn-nueva-nota">
                    <div className="relative shrink-0 size-[14px]" data-name="Frame">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgBtnNuevaNotaFrame} />
                    </div>
                    <p className="[word-break:break-word] font-geist font-bold leading-[normal] relative shrink-0 text-[13px] text-white whitespace-nowrap">Nueva Nota SOAP</p>
                  </div>
                  <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex gap-[6px] items-center px-[16px] py-[8px] relative rounded-[8px] shrink-0" data-name="btn-reporte">
                    <div className="relative shrink-0 size-[14px]" data-name="Frame">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgBtnReporteFrame} />
                    </div>
                    <p className="[word-break:break-word] font-geist font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] whitespace-nowrap">Generar Reporte</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="content-stretch flex flex-[1_0_0] gap-[20px] items-start min-h-px relative w-full" data-name="content-layout">
              <div className="content-stretch flex flex-col items-start relative shrink-0 w-[580px]" data-name="left-column">
                <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[14px] items-start p-[20px] relative rounded-[12px] shrink-0 w-full" data-name="monitor-panel">
                  <p className="[word-break:break-word] font-geist font-extrabold leading-[normal] relative shrink-0 text-[#0f172a] text-[15px] whitespace-nowrap">Monitor de Cama - Cama 03</p>
                  <div className="bg-[#0b1220] border border-solid border-white content-stretch flex flex-col gap-[10px] items-start p-[12px] relative rounded-[10px] shrink-0 w-full" data-name="ECG II-section">
                    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="header-row">
                      <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Frame">
                        <p className="[word-break:break-word] font-geist font-bold leading-[normal] relative shrink-0 text-[#94a3b8] text-[11px] uppercase whitespace-nowrap">ECG II</p>
                        <div className="relative shrink-0 size-[14px]" data-name="Frame">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgHeaderRowFrame} />
                        </div>
                      </div>
                      <div className="[word-break:break-word] content-stretch flex gap-[6px] items-baseline leading-[normal] relative shrink-0 text-[#22c55e] whitespace-nowrap" data-name="Frame">
                        <p className="font-geist font-extrabold relative shrink-0 text-[22px]">134</p>
                        <p className="font-geist font-bold relative shrink-0 text-[12px]">bpm</p>
                      </div>
                    </div>
                    <div className="bg-[#0b1220] content-stretch flex flex-col h-[56px] items-start overflow-clip relative rounded-[8px] shrink-0 w-full" data-name="wave-strip">
                      <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px px-[12px] py-[10px] relative w-full" data-name="wave-canvas">
                        <div className="absolute h-[36px] left-0 top-[10px] w-[380px]" data-name="wave">
                          <div className="absolute inset-[-2.78%_-0.26%]">
                            <img className="block max-w-none size-full" alt="" src={imgWave} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#0b1220] border-l-[3px] border-solid border-white content-stretch flex flex-col gap-[10px] items-start p-[12px] relative rounded-[10px] shrink-0 w-full" data-name="SpO2-section">
                    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="header-row">
                      <div className="content-stretch flex items-center relative shrink-0" data-name="Frame">
                        <p className="[word-break:break-word] font-geist font-bold leading-[normal] relative shrink-0 text-[#94a3b8] text-[11px] uppercase whitespace-nowrap">SpO2</p>
                      </div>
                      <div className="content-stretch flex gap-[6px] items-baseline relative shrink-0" data-name="Frame">
                        <p className="[word-break:break-word] font-geist font-extrabold leading-[normal] relative shrink-0 text-[#06b6d4] text-[22px] whitespace-nowrap">89</p>
                        <p className="[word-break:break-word] font-geist font-bold leading-[normal] relative shrink-0 text-[#06b6d4] text-[12px] whitespace-nowrap">%</p>
                        <div className="relative shrink-0 size-[14px]" data-name="Frame">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgHeaderRowFrame2} />
                        </div>
                      </div>
                    </div>
                    <div className="bg-[#0b1220] content-stretch flex flex-col h-[56px] items-start overflow-clip relative rounded-[8px] shrink-0 w-full" data-name="wave-strip">
                      <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px px-[12px] py-[10px] relative w-full" data-name="wave-canvas">
                        <div className="absolute h-[36px] left-0 top-[10px] w-[380px]" data-name="wave">
                          <div className="absolute inset-[-2.78%_-0.26%]">
                            <img className="block max-w-none size-full" alt="" src={imgWave2} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#0b1220] border-l-[3px] border-solid border-white content-stretch flex flex-col gap-[10px] items-start p-[12px] relative rounded-[10px] shrink-0 w-full" data-name="PA-section">
                    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="header-row">
                      <div className="content-stretch flex items-center relative shrink-0" data-name="Frame">
                        <p className="[word-break:break-word] font-geist font-bold leading-[normal] relative shrink-0 text-[#94a3b8] text-[11px] uppercase whitespace-nowrap">PA</p>
                      </div>
                      <div className="content-stretch flex gap-[6px] items-baseline relative shrink-0" data-name="Frame">
                        <p className="[word-break:break-word] font-geist font-extrabold leading-[normal] relative shrink-0 text-[#eab308] text-[22px] whitespace-nowrap">140/90</p>
                        <p className="[word-break:break-word] font-geist font-bold leading-[normal] relative shrink-0 text-[#eab308] text-[12px] whitespace-nowrap">mmHg</p>
                        <div className="relative shrink-0 size-[14px]" data-name="Frame">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgHeaderRowFrame2} />
                        </div>
                      </div>
                    </div>
                    <div className="bg-[#0b1220] content-stretch flex flex-col h-[56px] items-start overflow-clip relative rounded-[8px] shrink-0 w-full" data-name="wave-strip">
                      <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px px-[12px] py-[10px] relative w-full" data-name="wave-canvas">
                        <div className="absolute h-[36px] left-0 top-[10px] w-[380px]" data-name="wave">
                          <div className="absolute inset-[-2.78%_-0.26%]">
                            <img className="block max-w-none size-full" alt="" src={imgWave3} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px relative" data-name="right-column">
                <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[14px] items-start p-[20px] relative rounded-[12px] shrink-0 w-full" data-name="soap-card">
                  <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="soap-header">
                    <p className="[word-break:break-word] font-geist font-extrabold leading-[normal] relative shrink-0 text-[#0f172a] text-[15px] whitespace-nowrap">Última Nota SOAP</p>
                    <div className="bg-[#f1f5f9] content-stretch flex items-start px-[8px] py-[3px] relative rounded-[6px] shrink-0" data-name="soap-date-badge">
                      <p className="[word-break:break-word] font-geist font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[11px] whitespace-nowrap">24 Oct 2025, 08:15</p>
                    </div>
                  </div>
                  <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="soap-author">
                    <div className="relative rounded-[12px] shrink-0 size-[24px]" data-name="author-avatar">
                      <img className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[12px] size-full" alt="" src={imgAvatar2Png} />
                    </div>
                    <p className="[word-break:break-word] font-geist font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[13px] whitespace-nowrap">Dr. Carlos Méndez</p>
                  </div>
                  <div className="h-0 relative shrink-0 w-full" data-name="Line">
                    <div className="absolute inset-[-1px_0_0_0]">
                      <img className="block max-w-none size-full" alt="" src={imgSoapCardLine3} />
                    </div>
                  </div>
                  <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="soap-sections">
                    <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-[344px]" data-name="Frame">
                      <div className="bg-[#eff6ff] content-stretch flex items-start px-[6px] py-[2px] relative rounded-[4px] shrink-0" data-name="Frame">
                        <p className="[word-break:break-word] font-geist font-extrabold leading-[normal] relative shrink-0 text-[#2563eb] text-[11px] whitespace-nowrap">S</p>
                      </div>
                      <p className="[word-break:break-word] flex-[1_0_0] font-geist font-normal leading-[normal] min-w-px overflow-hidden relative text-[#0f172a] text-[13px] text-ellipsis whitespace-nowrap">Disnea progresiva y dificultad para respirar en reposo.</p>
                    </div>
                    <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-[272px]" data-name="Frame">
                      <div className="bg-[#fef3c7] content-stretch flex items-start px-[6px] py-[2px] relative rounded-[4px] shrink-0" data-name="Frame">
                        <p className="[word-break:break-word] font-geist font-extrabold leading-[normal] relative shrink-0 text-[#eab308] text-[11px] whitespace-nowrap">O</p>
                      </div>
                      <p className="[word-break:break-word] flex-[1_0_0] font-geist font-normal leading-[normal] min-w-px overflow-hidden relative text-[#0f172a] text-[13px] text-ellipsis whitespace-nowrap">FC 134, SpO2 89%, estertores bilaterales.</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[14px] items-start p-[20px] relative rounded-[12px] shrink-0 w-full" data-name="device-card">
                  <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="device-header">
                    <p className="[word-break:break-word] font-geist font-extrabold leading-[normal] relative shrink-0 text-[#0f172a] text-[15px] whitespace-nowrap">Dispositivo IoT</p>
                    <div className="bg-[#ecfdf5] content-stretch flex gap-[5px] items-center px-[8px] py-[3px] relative rounded-[6px] shrink-0" data-name="online-badge">
                      <div className="relative shrink-0 size-[6px]" data-name="Ellipse">
                        <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgLiveIndicatorEllipse} />
                      </div>
                      <p className="[word-break:break-word] font-geist font-bold leading-[normal] relative shrink-0 text-[#10b981] text-[11px] whitespace-nowrap">En línea</p>
                    </div>
                  </div>
                  <div className="h-0 relative shrink-0 w-full" data-name="Line">
                    <div className="absolute inset-[-1px_0_0_0]">
                      <img className="block max-w-none size-full" alt="" src={imgSoapCardLine3} />
                    </div>
                  </div>
                  <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="device-info">
                    <div className="[word-break:break-word] content-stretch flex items-center justify-between leading-[normal] relative shrink-0 text-[13px] w-full whitespace-nowrap" data-name="Frame">
                      <p className="font-geist font-normal relative shrink-0 text-[#64748b]">ID del dispositivo</p>
                      <p className="font-geist font-bold relative shrink-0 text-[#0f172a]">RPi-UCI-003</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bg-[rgba(15,23,42,0.5)] content-stretch flex h-[900px] items-center justify-center left-0 top-0 w-[1440px]" data-name="modal-backdrop">
        <div className="bg-white content-stretch drop-shadow-[0px_20px_20px_rgba(15,23,42,0.15)] flex flex-col h-[734px] items-start justify-between p-[32px] relative rounded-[16px] shrink-0 w-[680px]" data-name="soap-modal">
          <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="modal-header">
            <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="Frame">
              <div className="bg-[#eff6ff] content-stretch flex flex-col items-center justify-center relative rounded-[8px] shrink-0 size-[36px]" data-name="Frame">
                <div className="relative shrink-0 size-[18px]" data-name="Frame">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgModalHeaderFrame} />
                </div>
              </div>
              <p className="[word-break:break-word] font-geist font-extrabold leading-[normal] relative shrink-0 text-[#0f172a] text-[22px] whitespace-nowrap">Nueva Nota SOAP</p>
            </div>
            <div className="bg-[#f1f5f9] content-stretch flex h-[32px] items-center justify-center relative rounded-[32px] shrink-0 w-[42px]" data-name="btn-close">
              <div className="overflow-clip relative shrink-0 size-[32px]" data-name="Frame">
                <div className="absolute inset-[20%]" data-name="x-circle">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgXCircle} />
                </div>
              </div>
            </div>
          </div>
          <div className="h-0 relative shrink-0 w-full" data-name="Line">
            <div className="absolute inset-[-1px_0_0_0]">
              <img className="block max-w-none size-full" alt="" src={imgSoapModalLine} />
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="soap-textareas-grid">
            <p className="[word-break:break-word] font-geist font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[14px] uppercase whitespace-nowrap">Notas de Progreso Clínico</p>
            <div className="content-stretch flex flex-col gap-[14px] items-start relative shrink-0 w-full" data-name="Frame">
              <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Frame">
                <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Frame">
                  <div className="bg-[#eff6ff] content-stretch flex items-center justify-center px-[6px] py-[2px] relative rounded-[4px] shrink-0" data-name="Frame">
                    <p className="[word-break:break-word] font-geist font-extrabold leading-[normal] relative shrink-0 text-[#2563eb] text-[11px] whitespace-nowrap">S</p>
                  </div>
                  <p className="[word-break:break-word] font-geist font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[13px] whitespace-nowrap">Subjetivo (S)</p>
                </div>
                <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex h-[80px] items-start p-[12px] relative rounded-[8px] shrink-0 w-full" data-name="Frame">
                  <p className="[word-break:break-word] flex-[1_0_0] font-geist font-normal leading-[1.4] min-w-px relative text-[#64748b] text-[13px]">Ej. Paciente refiere disnea leve en reposo, refiere mejoría del dolor torácico...</p>
                </div>
              </div>
              <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Frame">
                <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Frame">
                  <div className="bg-[#fef3c7] content-stretch flex items-center justify-center px-[6px] py-[2px] relative rounded-[4px] shrink-0" data-name="Frame">
                    <p className="[word-break:break-word] font-geist font-extrabold leading-[normal] relative shrink-0 text-[#eab308] text-[11px] whitespace-nowrap">O</p>
                  </div>
                  <p className="[word-break:break-word] font-geist font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[13px] whitespace-nowrap">Objetivo (O)</p>
                </div>
                <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex h-[80px] items-start p-[12px] relative rounded-[8px] shrink-0 w-full" data-name="Frame">
                  <p className="[word-break:break-word] flex-[1_0_0] font-geist font-normal leading-[1.4] min-w-px relative text-[#64748b] text-[13px]">Ej. FC 120 lpm, SpO2 91% con puntas nasales a 2L, ruidos respiratorios con estertores basales...</p>
                </div>
              </div>
              <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Frame">
                <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Frame">
                  <div className="bg-[#fef2f2] content-stretch flex items-center justify-center px-[6px] py-[2px] relative rounded-[4px] shrink-0" data-name="Frame">
                    <p className="[word-break:break-word] font-geist font-extrabold leading-[normal] relative shrink-0 text-[#ef4444] text-[11px] whitespace-nowrap">A</p>
                  </div>
                  <p className="[word-break:break-word] font-geist font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[13px] whitespace-nowrap">Evaluación / Análisis (A)</p>
                </div>
                <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex h-[80px] items-start p-[12px] relative rounded-[8px] shrink-0 w-full" data-name="Frame">
                  <p className="[word-break:break-word] flex-[1_0_0] font-geist font-normal leading-[1.4] min-w-px relative text-[#64748b] text-[13px]">Ej. Insuficiencia cardíaca congestiva en fase de descompensación moderada estable...</p>
                </div>
              </div>
              <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Frame">
                <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Frame">
                  <div className="bg-[#ecfdf5] content-stretch flex items-center justify-center px-[6px] py-[2px] relative rounded-[4px] shrink-0" data-name="Frame">
                    <p className="[word-break:break-word] font-geist font-extrabold leading-[normal] relative shrink-0 text-[#10b981] text-[11px] whitespace-nowrap">P</p>
                  </div>
                  <p className="[word-break:break-word] font-geist font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[13px] whitespace-nowrap">Plan (P)</p>
                </div>
                <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex h-[80px] items-start p-[12px] relative rounded-[8px] shrink-0 w-full" data-name="Frame">
                  <p className="[word-break:break-word] flex-[1_0_0] font-geist font-normal leading-[1.4] min-w-px relative text-[#64748b] text-[13px]">Ej. Continuar con furosemida 20mg IV cada 12 horas, mantener monitoreo continuo...</p>
                </div>
              </div>
            </div>
          </div>
          <div className="h-0 relative shrink-0 w-full" data-name="Line">
            <div className="absolute inset-[-1px_0_0_0]">
              <img className="block max-w-none size-full" alt="" src={imgSoapModalLine} />
            </div>
          </div>
          <div className="content-stretch flex gap-[12px] items-start justify-end relative shrink-0 w-full" data-name="modal-actions">
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-center justify-center px-[20px] py-[10px] relative rounded-[8px] shrink-0" data-name="btn-cancel">
              <p className="[word-break:break-word] font-geist font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[14px] whitespace-nowrap">Cancelar</p>
            </div>
            <div className="bg-[#2563eb] content-stretch flex items-center justify-center px-[24px] py-[10px] relative rounded-[8px] shrink-0" data-name="btn-save">
              <p className="[word-break:break-word] font-geist font-bold leading-[normal] relative shrink-0 text-[14px] text-white whitespace-nowrap">Guardar Nota</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
