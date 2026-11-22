// Pantalla "med/paciente/monitoreo-detallado" (Figma node 6:267) — generada desde el diseño original de Figma.
import { Link } from 'react-router-dom';
import imgActivity6 from '../../assets/activity-6.svg';
import imgAlertTextEllipse2 from '../../assets/alert-text-ellipse-2.svg';
import imgAlertTriangle3 from '../../assets/alert-triangle-3.svg';
import imgAlertsCardLine from '../../assets/alerts-card-line.svg';
import imgAvatar2Png from '../../assets/avatar-2.png';
import imgBell from '../../assets/bell.svg';
import imgBell3 from '../../assets/bell-3.svg';
import imgBpWave from '../../assets/bp-wave.svg';
import imgCalendar from '../../assets/calendar.svg';
import imgClipboard from '../../assets/clipboard.svg';
import imgCpu from '../../assets/cpu.svg';
import imgDoctorFooterLine from '../../assets/doctor-footer-line.svg';
import imgEcgWave from '../../assets/ecg-wave.svg';
import imgEstadoNeurologicoCardLine from '../../assets/estado-neurologico-card-line.svg';
import imgFileText from '../../assets/file-text.svg';
import imgFileText2 from '../../assets/file-text-2.svg';
import imgHeaderRowFrame from '../../assets/header-row-frame.svg';
import imgHelpIconEllipse from '../../assets/help-icon-ellipse.svg';
import imgLayoutDashboard from '../../assets/layout-dashboard.svg';
import imgLogOut from '../../assets/log-out.svg';
import imgPatientAvatarPng from '../../assets/patient-avatar.png';
import imgSearch2 from '../../assets/search-2.svg';
import imgSpo2Wave from '../../assets/spo2-wave.svg';
import imgTempWave from '../../assets/temp-wave.svg';
import imgUsers2 from '../../assets/users-2.svg';

export default function MedPacienteMonitoreoDetallado() {
  return (
    <div className="bg-[#f8fafc] content-stretch flex h-[1867px] items-start overflow-clip relative shrink-0 w-[1440px]" data-name="med/paciente/monitoreo-detallado">
      <div className="bg-[#0f172a] border-[#e2e8f0] border-r border-solid content-stretch flex flex-col h-full items-start justify-between px-[16px] py-[24px] relative shrink-0 w-[240px]" data-name="sidebar">
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
              <div className="relative shrink-0 size-[18px]" data-name="layout-dashboard">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgLayoutDashboard} />
              </div>
              <p className="[word-break:break-word] font-geist font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Dashboard</p>
            </Link>
            <Link className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Pacientes" to="/MedPacientesLista">
              <div className="relative shrink-0 size-[18px]" data-name="users">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgUsers2} />
              </div>
              <p className="[word-break:break-word] font-geist font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Pacientes</p>
            </Link>
            <Link className="bg-[rgba(37,99,235,0.15)] content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Monitoreo" to="/MedMonitoreoGridUci">
              <div className="relative shrink-0 size-[18px]" data-name="activity">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgActivity6} />
              </div>
              <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[14px] text-white whitespace-nowrap">Monitoreo</p>
            </Link>
            <Link className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Alertas" to="/MedAlertasCentro">
              <div className="relative shrink-0 size-[18px]" data-name="bell">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgBell} />
              </div>
              <p className="[word-break:break-word] font-geist font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Alertas</p>
            </Link>
            <Link className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Reportes" to="/MedReportesPanel">
              <div className="relative shrink-0 size-[18px]" data-name="file-text">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgFileText} />
              </div>
              <p className="[word-break:break-word] font-geist font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Reportes</p>
            </Link>
            <Link className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Dispositivos" to="/MedDispositivosMonitores">
              <div className="relative shrink-0 size-[18px]" data-name="cpu">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgCpu} />
              </div>
              <p className="[word-break:break-word] font-geist font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Dispositivos</p>
            </Link>
          </div>
        </div>
        <Link className="absolute left-[20px] opacity-25 size-[18px] top-[1759px]" data-name="help-icon" to="/MedAyudaSoporte">
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
      <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px relative" data-name="main-container">
        <div className="bg-white border-[#e2e8f0] border-b border-solid content-stretch flex h-[72px] items-center justify-between px-[32px] relative shrink-0 w-full" data-name="top-bar">
          <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start leading-[normal] relative shrink-0 whitespace-nowrap" data-name="title-breadcrumb">
            <p className="font-geist font-medium relative shrink-0 text-[#64748b] text-[12px]">{`Dashboard > Central de Monitoreo > María González`}</p>
            <p className="font-geist font-extrabold relative shrink-0 text-[#0f172a] text-[20px]">Detalle de Paciente</p>
          </div>
          <div className="content-stretch flex gap-[20px] items-center relative shrink-0" data-name="right-actions">
            <div className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex gap-[8px] items-center px-[12px] py-[6px] relative rounded-[8px] shrink-0" data-name="search">
              <div className="relative shrink-0 size-[14px]" data-name="search">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgSearch2} />
              </div>
              <p className="[word-break:break-word] font-geist font-normal leading-[normal] relative shrink-0 text-[#64748b] text-[13px] whitespace-nowrap">Buscar paciente, cama...</p>
            </div>
            <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="datetime">
              <div className="relative shrink-0 size-[14px]" data-name="calendar">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgCalendar} />
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
        <div className="content-stretch flex flex-col gap-[20px] h-[828px] items-start p-[32px] relative shrink-0 w-full" data-name="page-body">
          <div className="bg-white border border-[#e2e8f0] border-solid content-stretch drop-shadow-[0px_4px_6px_rgba(0,0,0,0.02)] flex flex-col items-start p-[20px] relative rounded-[12px] shrink-0 w-full" data-name="patient-header-card">
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
                  <div className="[word-break:break-word] content-stretch flex gap-[20px] items-center leading-[normal] relative shrink-0 whitespace-nowrap" data-name="meta-row">
                    <p className="font-geist font-medium relative shrink-0 text-[#64748b] text-[13px]">ID PT-8821</p>
                    <p className="font-geist font-medium relative shrink-0 text-[#64748b] text-[13px]">67 años</p>
                    <p className="font-geist font-semibold relative shrink-0 text-[#0f172a] text-[13px]">Insuficiencia Cardíaca Congestiva</p>
                    <div className="content-stretch flex gap-[6px] items-center relative shrink-0 text-[12px]" data-name="admission-row">
                      <p className="font-geist font-normal relative shrink-0 text-[#64748b]">Ingreso:</p>
                      <p className="font-geist font-semibold relative shrink-0 text-[#0f172a]">15 Oct 2025</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="content-stretch flex gap-[10px] items-center relative shrink-0" data-name="action-buttons">
                <div className="bg-[#2563eb] content-stretch flex gap-[6px] items-center px-[16px] py-[8px] relative rounded-[8px] shrink-0" data-name="btn-nueva-nota">
                  <div className="relative shrink-0 size-[14px]" data-name="clipboard">
                    <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgClipboard} />
                  </div>
                  <p className="[word-break:break-word] font-geist font-bold leading-[normal] relative shrink-0 text-[13px] text-white whitespace-nowrap">Nueva Nota SOAP</p>
                </div>
                <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex gap-[6px] items-center px-[16px] py-[8px] relative rounded-[8px] shrink-0" data-name="btn-reporte">
                  <div className="relative shrink-0 size-[14px]" data-name="file-text">
                    <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgFileText2} />
                  </div>
                  <p className="[word-break:break-word] font-geist font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] whitespace-nowrap">Generar Reporte</p>
                </div>
              </div>
            </div>
          </div>
          <div className="border-[#e2e8f0] border-b border-solid content-stretch flex gap-[8px] items-start relative shrink-0 w-full" data-name="tab-bar">
            <div className="content-stretch flex items-start px-[16px] py-[12px] relative shrink-0" data-name="tab-Resumen">
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Resumen</p>
            </div>
            <div className="content-stretch flex items-start px-[16px] py-[12px] relative shrink-0" data-name="tab-Historia Clínica">
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Historia Clínica</p>
            </div>
            <div className="content-stretch flex items-start px-[16px] py-[12px] relative shrink-0" data-name="tab-Notas SOAP">
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Notas SOAP</p>
            </div>
            <div className="border-[#2563eb] border-b-2 border-solid content-stretch flex items-start px-[16px] py-[12px] relative shrink-0" data-name="tab-Monitoreo">
              <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#2563eb] text-[14px] whitespace-nowrap">Monitoreo</p>
            </div>
            <div className="content-stretch flex items-start px-[16px] py-[12px] relative shrink-0" data-name="tab-Documentos">
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Documentos</p>
            </div>
          </div>
          <div className="content-stretch flex gap-[20px] items-start relative shrink-0 w-[1150px]" data-name="content-layout">
            <Link className="content-stretch cursor-pointer flex flex-col h-[733px] items-start relative shrink-0 w-[707px]" data-name="left-column" to="/MedPacienteTendenciasVitales">
              <div className="bg-white border border-solid border-white content-stretch drop-shadow-[0px_8px_10px_rgba(0,0,0,0.25)] flex flex-col gap-[14px] h-[733px] items-start p-[20px] relative rounded-[12px] shrink-0 w-[707px]" data-name="monitor-panel">
                <p className="[word-break:break-word] font-geist font-extrabold leading-[normal] relative shrink-0 text-[15px] text-black text-left whitespace-nowrap">Monitor de Cama - Cama 03</p>
                <div className="bg-[#0b1220] border border-solid border-white content-stretch flex flex-col gap-[10px] items-start p-[12px] relative rounded-[10px] shrink-0 w-full" data-name="ecg-section">
                  <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="ecg-header">
                    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="ecg-label">
                      <p className="[word-break:break-word] font-geist font-bold leading-[normal] relative shrink-0 text-[#94a3b8] text-[11px] text-left uppercase whitespace-nowrap">ECG II</p>
                      <div className="content-stretch flex items-center relative shrink-0" data-name="ecg-wave">
                        <div className="relative shrink-0 size-[14px]" data-name="ecg-icon">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgHeaderRowFrame} />
                        </div>
                      </div>
                    </div>
                    <div className="[word-break:break-word] content-stretch flex gap-[6px] items-baseline leading-[normal] relative shrink-0 text-[#22c55e] text-left whitespace-nowrap" data-name="ecg-value">
                      <p className="font-geist font-extrabold relative shrink-0 text-[22px]">134</p>
                      <p className="font-geist font-bold relative shrink-0 text-[12px]">bpm</p>
                    </div>
                  </div>
                  <div className="bg-[#0b1220] border border-solid border-white content-stretch flex flex-col h-[56px] items-start overflow-clip relative rounded-[8px] shrink-0 w-full" data-name="ecg-wave-strip">
                    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px px-[12px] py-[10px] relative w-full" data-name="wave-canvas">
                      <div className="absolute h-[36px] left-0 top-0 w-[560px]" data-name="ecg-wave">
                        <div className="absolute inset-[-2.78%_-0.18%]">
                          <img className="block max-w-none size-full" alt="" src={imgEcgWave} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-[#0b1220] border-l-[3px] border-solid border-white content-stretch flex flex-col gap-[10px] items-start p-[12px] relative rounded-[10px] shrink-0 w-full" data-name="temp-section">
                  <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="temp-header">
                    <p className="[word-break:break-word] font-geist font-bold leading-[normal] relative shrink-0 text-[#94a3b8] text-[11px] text-left uppercase whitespace-nowrap">Temp</p>
                    <div className="content-stretch flex gap-[6px] items-baseline relative shrink-0" data-name="temp-value">
                      <p className="[word-break:break-word] font-geist font-extrabold leading-[normal] relative shrink-0 text-[22px] text-left text-white whitespace-nowrap">38.5</p>
                      <p className="[word-break:break-word] font-geist font-bold leading-[normal] relative shrink-0 text-[12px] text-left text-white whitespace-nowrap">°C</p>
                      <div className="relative shrink-0 size-[14px]" data-name="alert-triangle">
                        <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgAlertTriangle3} />
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#0b1220] border border-solid border-white content-stretch flex flex-col h-[56px] items-start overflow-clip relative rounded-[8px] shrink-0 w-full" data-name="temp-wave-strip">
                    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px px-[12px] py-[10px] relative w-full" data-name="wave-canvas">
                      <div className="absolute h-[36px] left-0 top-0 w-[560px]" data-name="temp-wave">
                        <div className="absolute inset-[-2.78%_-0.18%]">
                          <img className="block max-w-none size-full" alt="" src={imgTempWave} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-[#0b1220] border-l-[3px] border-solid border-white content-stretch flex flex-col gap-[10px] items-start p-[12px] relative rounded-[10px] shrink-0 w-full" data-name="spo2-section">
                  <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="spo2-header">
                    <p className="[word-break:break-word] font-geist font-bold leading-[normal] relative shrink-0 text-[#94a3b8] text-[11px] text-left uppercase whitespace-nowrap">SpO2</p>
                    <div className="content-stretch flex gap-[6px] items-baseline relative shrink-0" data-name="spo2-value">
                      <p className="[word-break:break-word] font-geist font-extrabold leading-[normal] relative shrink-0 text-[#06b6d4] text-[22px] text-left whitespace-nowrap">89</p>
                      <p className="[word-break:break-word] font-geist font-bold leading-[normal] relative shrink-0 text-[#06b6d4] text-[12px] text-left whitespace-nowrap">%</p>
                      <div className="relative shrink-0 size-[14px]" data-name="alert-triangle">
                        <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgAlertTriangle3} />
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#0b1220] border border-solid border-white content-stretch flex flex-col h-[56px] items-start overflow-clip relative rounded-[8px] shrink-0 w-full" data-name="spo2-wave-strip">
                    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px px-[12px] py-[10px] relative w-full" data-name="wave-canvas">
                      <div className="absolute h-[36px] left-0 top-0 w-[560px]" data-name="spo2-wave">
                        <div className="absolute inset-[-2.78%_-0.18%]">
                          <img className="block max-w-none size-full" alt="" src={imgSpo2Wave} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-[#0b1220] border-l-[3px] border-solid border-white content-stretch flex flex-col gap-[10px] items-start p-[12px] relative rounded-[10px] shrink-0 w-full" data-name="bp-section">
                  <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="bp-header">
                    <p className="[word-break:break-word] font-geist font-bold leading-[normal] relative shrink-0 text-[#94a3b8] text-[11px] text-left uppercase whitespace-nowrap">PA</p>
                    <div className="content-stretch flex gap-[6px] items-baseline relative shrink-0" data-name="bp-value">
                      <p className="[word-break:break-word] font-geist font-extrabold leading-[normal] relative shrink-0 text-[#eab308] text-[22px] text-left whitespace-nowrap">140/90</p>
                      <p className="[word-break:break-word] font-geist font-bold leading-[normal] relative shrink-0 text-[#eab308] text-[12px] text-left whitespace-nowrap">mmHg</p>
                      <div className="relative shrink-0 size-[14px]" data-name="alert-triangle">
                        <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgAlertTriangle3} />
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#0b1220] border border-solid border-white content-stretch flex flex-col h-[56px] items-start overflow-clip relative rounded-[8px] shrink-0 w-full" data-name="bp-wave-strip">
                    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px px-[12px] py-[10px] relative w-full" data-name="wave-canvas">
                      <div className="absolute h-[36px] left-0 top-0 w-[560px]" data-name="bp-wave">
                        <div className="absolute inset-[-2.78%_-0.18%]">
                          <img className="block max-w-none size-full" alt="" src={imgBpWave} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-[#0b1220] border border-solid border-white content-stretch flex flex-col gap-[10px] items-start p-[12px] relative rounded-[10px] shrink-0 w-full" data-name="rr-section">
                  <div className="[word-break:break-word] content-stretch flex items-center justify-between leading-[normal] relative shrink-0 text-left w-full whitespace-nowrap" data-name="rr-header">
                    <p className="font-geist font-bold relative shrink-0 text-[#94a3b8] text-[11px] uppercase">FR</p>
                    <div className="content-stretch flex gap-[6px] items-baseline relative shrink-0 text-[#eab308]" data-name="rr-value">
                      <p className="font-geist font-extrabold relative shrink-0 text-[22px]">24</p>
                      <p className="font-geist font-bold relative shrink-0 text-[12px]">rpm</p>
                    </div>
                  </div>
                  <div className="bg-[#0b1220] border border-solid border-white content-stretch flex flex-col h-[56px] items-start overflow-clip relative rounded-[8px] shrink-0 w-full" data-name="rr-wave-strip">
                    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px px-[12px] py-[10px] relative w-full" data-name="wave-canvas">
                      <div className="absolute h-[36px] left-0 top-0 w-[560px]" data-name="rr-wave">
                        <div className="absolute inset-[-2.78%_-0.18%]">
                          <img className="block max-w-none size-full" alt="" src={imgBpWave} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
            <div className="content-stretch flex flex-col gap-[16px] h-[1530px] items-start relative shrink-0 w-[443px]" data-name="right-column">
              <div className="bg-white border border-[#e2e8f0] border-solid content-stretch drop-shadow-[0px_4px_6px_rgba(0,0,0,0.02)] flex flex-col gap-[14px] items-start p-[20px] relative rounded-[12px] shrink-0 w-[443px]" data-name="alerts-card">
                <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="alerts-header">
                  <p className="[word-break:break-word] font-geist font-extrabold leading-[normal] relative shrink-0 text-[#0f172a] text-[15px] whitespace-nowrap">Alertas Activas</p>
                  <div className="bg-[#fef2f2] content-stretch flex items-start px-[8px] py-[2px] relative rounded-[4px] shrink-0" data-name="alerts-count-badge">
                    <p className="[word-break:break-word] font-geist font-extrabold leading-[normal] relative shrink-0 text-[#ef4444] text-[11px] whitespace-nowrap">3</p>
                  </div>
                </div>
                <div className="h-0 relative shrink-0 w-full" data-name="Line">
                  <div className="absolute inset-[-1px_0_0_0]">
                    <img className="block max-w-none size-full" alt="" src={imgAlertsCardLine} />
                  </div>
                </div>
                <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="alerts-list">
                  <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full" data-name="alert-item-1">
                    <div className="relative shrink-0 size-[8px]" data-name="Ellipse">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgAlertTextEllipse2} />
                    </div>
                    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px relative whitespace-nowrap" data-name="alert-text-group">
                      <p className="font-geist font-bold relative shrink-0 text-[#0f172a] text-[13px]">{`SpO2 < 90%`}</p>
                      <p className="font-geist font-normal relative shrink-0 text-[#64748b] text-[11px]">Hace 5 min</p>
                    </div>
                  </div>
                  <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full" data-name="alert-item-2">
                    <div className="relative shrink-0 size-[8px]" data-name="Ellipse">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgAlertTextEllipse2} />
                    </div>
                    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px relative whitespace-nowrap" data-name="alert-text-group">
                      <p className="font-geist font-bold relative shrink-0 text-[#0f172a] text-[13px]">{`FC > 130 bpm`}</p>
                      <p className="font-geist font-normal relative shrink-0 text-[#64748b] text-[11px]">Hace 12 min</p>
                    </div>
                  </div>
                  <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full" data-name="alert-item-3">
                    <div className="relative shrink-0 size-[8px]" data-name="Ellipse">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgAlertTextEllipse2} />
                    </div>
                    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px relative whitespace-nowrap" data-name="alert-text-group">
                      <p className="font-geist font-bold relative shrink-0 text-[#0f172a] text-[13px]">Lactato elevado 4.2 mmol/L</p>
                      <p className="font-geist font-normal relative shrink-0 text-[#64748b] text-[11px]">Última medición</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white border border-[#e2e8f0] border-solid content-stretch drop-shadow-[0px_4px_6px_rgba(0,0,0,0.02)] flex flex-col gap-[12px] h-[243px] items-start p-[20px] relative rounded-[12px] shrink-0 w-[450px]" data-name="estado-neurologico-card">
                <p className="[word-break:break-word] font-geist font-extrabold leading-[normal] relative shrink-0 text-[#0f172a] text-[15px] whitespace-nowrap">Estado Neurológico</p>
                <div className="h-0 relative shrink-0 w-full" data-name="Line">
                  <div className="absolute inset-[-1px_0_0_0]">
                    <img className="block max-w-none size-full" alt="" src={imgEstadoNeurologicoCardLine} />
                  </div>
                </div>
                <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="neuro-grid">
                  <div className="[word-break:break-word] content-stretch flex gap-[12px] items-start leading-[normal] relative shrink-0 w-full whitespace-nowrap" data-name="row-1">
                    <div className="bg-[#f8fafc] content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px p-[12px] relative rounded-[10px]" data-name="glasgow">
                      <p className="font-geist font-bold relative shrink-0 text-[#64748b] text-[11px] uppercase">Glasgow</p>
                      <p className="font-geist font-extrabold relative shrink-0 text-[#0f172a] text-[18px]">8/15</p>
                      <p className="font-geist font-normal relative shrink-0 text-[#64748b] text-[12px]">O2 V3 M3</p>
                    </div>
                    <div className="bg-[#f8fafc] content-stretch flex flex-[1_0_0] flex-col font-geist font-bold gap-[4px] items-start min-w-px p-[12px] relative rounded-[10px]" data-name="pupilas">
                      <p className="relative shrink-0 text-[#64748b] text-[11px] uppercase">Pupilas</p>
                      <p className="relative shrink-0 text-[#0f172a] text-[14px]">Isocóricas reactivas 3mm</p>
                    </div>
                  </div>
                  <div className="content-stretch flex items-start relative shrink-0 w-full" data-name="row-2">
                    <div className="[word-break:break-word] bg-[#f8fafc] content-stretch flex flex-[1_0_0] flex-col font-geist font-bold gap-[4px] items-start leading-[normal] min-w-px p-[12px] relative rounded-[10px] whitespace-nowrap" data-name="conciencia">
                      <p className="relative shrink-0 text-[#64748b] text-[11px] uppercase">Nivel de conciencia</p>
                      <p className="relative shrink-0 text-[#0f172a] text-[14px]">Sedado</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white border border-[#e2e8f0] border-solid content-stretch drop-shadow-[0px_4px_6px_rgba(0,0,0,0.02)] flex flex-col gap-[12px] items-start p-[20px] relative rounded-[12px] shrink-0 w-full" data-name="estado-respiratorio-card">
                <p className="[word-break:break-word] font-geist font-extrabold leading-[normal] relative shrink-0 text-[#0f172a] text-[15px] whitespace-nowrap">Estado Respiratorio</p>
                <div className="h-0 relative shrink-0 w-full" data-name="Line">
                  <div className="absolute inset-[-1px_0_0_0]">
                    <img className="block max-w-none size-full" alt="" src={imgAlertsCardLine} />
                  </div>
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-col gap-[12px] items-start leading-[normal] relative shrink-0 w-full whitespace-nowrap" data-name="respiratory-grid">
                  <div className="content-stretch flex font-geist font-bold gap-[12px] items-start relative shrink-0 w-full" data-name="row-1">
                    <div className="bg-[#f8fafc] content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px p-[12px] relative rounded-[10px]" data-name="ventilacion">
                      <p className="relative shrink-0 text-[#64748b] text-[11px] uppercase">Ventilación mecánica</p>
                      <p className="relative shrink-0 text-[#0f172a] text-[14px]">Sí (modo SIMV)</p>
                    </div>
                    <div className="bg-[#f8fafc] content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px p-[12px] relative rounded-[10px]" data-name="peep">
                      <p className="relative shrink-0 text-[#64748b] text-[11px] uppercase">PEEP</p>
                      <p className="relative shrink-0 text-[#0f172a] text-[14px]">8 cmH2O</p>
                    </div>
                  </div>
                  <div className="content-stretch flex font-geist font-bold gap-[12px] items-start relative shrink-0 w-full" data-name="row-2">
                    <div className="bg-[#f8fafc] content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px p-[12px] relative rounded-[10px]" data-name="fio2">
                      <p className="relative shrink-0 text-[#64748b] text-[11px] uppercase">FiO2</p>
                      <p className="relative shrink-0 text-[#0f172a] text-[14px]">60%</p>
                    </div>
                    <div className="bg-[#f8fafc] content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px p-[12px] relative rounded-[10px]" data-name="etco2">
                      <p className="relative shrink-0 text-[#64748b] text-[11px] uppercase">EtCO2</p>
                      <p className="relative shrink-0 text-[#0f172a] text-[14px]">38 mmHg</p>
                    </div>
                  </div>
                  <div className="bg-[#f8fafc] content-stretch flex flex-col gap-[6px] items-start p-[12px] relative rounded-[10px] shrink-0 w-full" data-name="gasometria">
                    <p className="font-geist font-bold relative shrink-0 text-[#64748b] text-[11px] uppercase">Última gasometría</p>
                    <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full" data-name="gas-values">
                      <div className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start min-w-px relative" data-name="Frame">
                        <p className="font-geist font-normal relative shrink-0 text-[#64748b] text-[11px]">pH</p>
                        <p className="font-geist font-bold relative shrink-0 text-[#0f172a] text-[14px]">7.32</p>
                      </div>
                      <div className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start min-w-px relative" data-name="Frame">
                        <p className="font-geist font-normal relative shrink-0 text-[#64748b] text-[11px]">PaO2</p>
                        <p className="font-geist font-bold relative shrink-0 text-[#0f172a] text-[14px]">85</p>
                      </div>
                      <div className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start min-w-px relative" data-name="Frame">
                        <p className="font-geist font-normal relative shrink-0 text-[#64748b] text-[11px]">PaCO2</p>
                        <p className="font-geist font-bold relative shrink-0 text-[#0f172a] text-[14px]">42</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white border border-[#e2e8f0] border-solid content-stretch drop-shadow-[0px_4px_6px_rgba(0,0,0,0.02)] flex flex-col gap-[12px] items-start p-[20px] relative rounded-[12px] shrink-0 w-full" data-name="balance-hidrico-card">
                <p className="[word-break:break-word] font-geist font-extrabold leading-[normal] relative shrink-0 text-[#0f172a] text-[15px] whitespace-nowrap">Balance Hídrico y Renal</p>
                <div className="h-0 relative shrink-0 w-full" data-name="Line">
                  <div className="absolute inset-[-1px_0_0_0]">
                    <img className="block max-w-none size-full" alt="" src={imgAlertsCardLine} />
                  </div>
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-col font-geist font-bold gap-[12px] items-start leading-[normal] relative shrink-0 w-full whitespace-nowrap" data-name="renal-grid">
                  <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full" data-name="row-1">
                    <div className="bg-[#f8fafc] content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px p-[12px] relative rounded-[10px]" data-name="diuresis">
                      <p className="relative shrink-0 text-[#64748b] text-[11px] uppercase">Diuresis última hora</p>
                      <p className="relative shrink-0 text-[#0f172a] text-[14px]">45 mL/h</p>
                    </div>
                    <div className="bg-[#f8fafc] content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px p-[12px] relative rounded-[10px]" data-name="balance-acumulado">
                      <p className="relative shrink-0 text-[#64748b] text-[11px] uppercase">Balance acumulado</p>
                      <p className="relative shrink-0 text-[#0f172a] text-[14px]">+850 mL</p>
                    </div>
                  </div>
                  <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full" data-name="row-2">
                    <div className="bg-[#f8fafc] content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px p-[12px] relative rounded-[10px]" data-name="cristaloides">
                      <p className="relative shrink-0 text-[#64748b] text-[11px] uppercase">Cristaloides</p>
                      <p className="relative shrink-0 text-[#0f172a] text-[14px]">2500 mL</p>
                    </div>
                    <div className="bg-[#f8fafc] content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px p-[12px] relative rounded-[10px]" data-name="hemoderivados">
                      <p className="relative shrink-0 text-[#64748b] text-[11px] uppercase">Hemoderivados</p>
                      <p className="relative shrink-0 text-[#0f172a] text-[14px]">2 UGRE</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white border border-[#e2e8f0] border-solid content-stretch drop-shadow-[0px_4px_6px_rgba(0,0,0,0.02)] flex flex-col gap-[12px] items-start p-[20px] relative rounded-[12px] shrink-0 w-full" data-name="laboratorios-card">
                <p className="[word-break:break-word] font-geist font-extrabold leading-[normal] relative shrink-0 text-[#0f172a] text-[15px] whitespace-nowrap">Laboratorios Recientes</p>
                <div className="h-0 relative shrink-0 w-full" data-name="Line">
                  <div className="absolute inset-[-1px_0_0_0]">
                    <img className="block max-w-none size-full" alt="" src={imgAlertsCardLine} />
                  </div>
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-col gap-[12px] items-start leading-[normal] relative shrink-0 w-full whitespace-nowrap" data-name="labs-grid">
                  <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full" data-name="row-1">
                    <div className="bg-[#f8fafc] content-stretch flex flex-[1_0_0] flex-col font-geist font-bold gap-[4px] items-start min-w-px p-[12px] relative rounded-[10px]" data-name="hb">
                      <p className="relative shrink-0 text-[#64748b] text-[11px] uppercase">Hb</p>
                      <p className="relative shrink-0 text-[#0f172a] text-[14px]">9.2 g/dL</p>
                    </div>
                    <div className="bg-[#f8fafc] content-stretch flex flex-[1_0_0] flex-col font-geist font-bold gap-[4px] items-start min-w-px p-[12px] relative rounded-[10px]" data-name="hto">
                      <p className="relative shrink-0 text-[#64748b] text-[11px] uppercase">Hto</p>
                      <p className="relative shrink-0 text-[#0f172a] text-[14px]">28%</p>
                    </div>
                    <div className="bg-[#fef2f2] content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px p-[12px] relative rounded-[10px] text-[#ef4444]" data-name="lactato">
                      <p className="font-geist font-bold relative shrink-0 text-[11px] uppercase">Lactato</p>
                      <p className="font-geist font-extrabold relative shrink-0 text-[14px]">4.2 mmol/L</p>
                    </div>
                  </div>
                  <div className="content-stretch flex font-geist font-bold gap-[12px] items-start relative shrink-0 w-full" data-name="row-2">
                    <div className="bg-[#f8fafc] content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px p-[12px] relative rounded-[10px]" data-name="k">
                      <p className="relative shrink-0 text-[#64748b] text-[11px] uppercase">K+</p>
                      <p className="relative shrink-0 text-[#0f172a] text-[14px]">4.1 mEq/L</p>
                    </div>
                    <div className="bg-[#f8fafc] content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px p-[12px] relative rounded-[10px]" data-name="glucosa">
                      <p className="relative shrink-0 text-[#64748b] text-[11px] uppercase">Glucosa</p>
                      <p className="relative shrink-0 text-[#0f172a] text-[14px]">142 mg/dL</p>
                    </div>
                    <div className="bg-[#f8fafc] content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px p-[12px] relative rounded-[10px]" data-name="creatinina">
                      <p className="relative shrink-0 text-[#64748b] text-[11px] uppercase">Creatinina</p>
                      <p className="relative shrink-0 text-[#0f172a] text-[14px]">1.3 mg/dL</p>
                    </div>
                  </div>
                  <div className="content-stretch flex font-geist font-bold gap-[12px] items-start relative shrink-0 w-full" data-name="row-3">
                    <div className="bg-[#f8fafc] content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px p-[12px] relative rounded-[10px]" data-name="inr">
                      <p className="relative shrink-0 text-[#64748b] text-[11px] uppercase">INR</p>
                      <p className="relative shrink-0 text-[#0f172a] text-[14px]">1.4</p>
                    </div>
                    <div className="bg-[#f8fafc] content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px p-[12px] relative rounded-[10px]" data-name="plaquetas">
                      <p className="relative shrink-0 text-[#64748b] text-[11px] uppercase">Plaquetas</p>
                      <p className="relative shrink-0 text-[#0f172a] text-[14px]">145,000</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white border border-[#e2e8f0] border-solid content-stretch drop-shadow-[0px_4px_6px_rgba(0,0,0,0.02)] flex flex-col gap-[12px] items-start p-[20px] relative rounded-[12px] shrink-0 w-full" data-name="perfusion-card">
                <p className="[word-break:break-word] font-geist font-extrabold leading-[normal] relative shrink-0 text-[#0f172a] text-[15px] whitespace-nowrap">Perfusión y Hemodinamia</p>
                <div className="h-0 relative shrink-0 w-full" data-name="Line">
                  <div className="absolute inset-[-1px_0_0_0]">
                    <img className="block max-w-none size-full" alt="" src={imgAlertsCardLine} />
                  </div>
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-col font-geist font-bold gap-[12px] items-start leading-[normal] relative shrink-0 w-full whitespace-nowrap" data-name="hemo-grid">
                  <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full" data-name="row-1">
                    <div className="bg-[#f8fafc] content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px p-[12px] relative rounded-[10px]" data-name="pam">
                      <p className="relative shrink-0 text-[#64748b] text-[11px] uppercase">PAM</p>
                      <p className="relative shrink-0 text-[#0f172a] text-[14px]">68 mmHg</p>
                    </div>
                    <div className="bg-[#f8fafc] content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px p-[12px] relative rounded-[10px]" data-name="llenado">
                      <p className="relative shrink-0 text-[#64748b] text-[11px] uppercase">Llenado capilar</p>
                      <p className="relative shrink-0 text-[#0f172a] text-[14px]">3 seg</p>
                    </div>
                  </div>
                  <div className="bg-[#f8fafc] content-stretch flex flex-col gap-[4px] items-start p-[12px] relative rounded-[10px] shrink-0 w-full" data-name="norepinefrina">
                    <p className="relative shrink-0 text-[#64748b] text-[11px] uppercase">Norepinefrina</p>
                    <p className="relative shrink-0 text-[#0f172a] text-[14px]">0.15 mcg/kg/min</p>
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
