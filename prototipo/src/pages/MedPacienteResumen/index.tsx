// Pantalla "med/paciente/resumen" (Figma node 100:256) — generada desde el diseño original de Figma.
import { Link, useNavigate } from 'react-router-dom';
import imgAlertTextEllipse from '../../assets/alert-text-ellipse.svg';
import imgAlertTextEllipse2 from '../../assets/alert-text-ellipse-2.svg';
import imgArrowLeft2 from '../../assets/arrow-left-2.svg';
import imgAvatar2Png from '../../assets/avatar-2.png';
import imgBell2 from '../../assets/bell-2.svg';
import imgClipboard from '../../assets/clipboard.svg';
import imgCpuIcon from '../../assets/cpu-icon.svg';
import imgDoctorFooterLine2 from '../../assets/doctor-footer-line-2.svg';
import imgFileText2 from '../../assets/file-text-2.svg';
import imgHelpIconEllipse from '../../assets/help-icon-ellipse.svg';
import imgIconContainer from '../../assets/icon-container.svg';
import imgIconContainer2 from '../../assets/icon-container-2.svg';
import imgIconContainer3 from '../../assets/icon-container-3.svg';
import imgIconContainer4 from '../../assets/icon-container-4.svg';
import imgIconContainer5 from '../../assets/icon-container-5.svg';
import imgLiveIndicatorEllipse from '../../assets/live-indicator-ellipse.svg';
import imgLogOut from '../../assets/log-out.svg';
import imgPatientAvatarPng from '../../assets/patient-avatar.png';
import imgPatientDetailCardLine from '../../assets/patient-detail-card-line.svg';
import imgSoapCardLine from '../../assets/soap-card-line.svg';
import imgUsers2 from '../../assets/users-2.svg';
import imgWaveLine from '../../assets/wave-line.svg';

export default function MedPacienteResumen() {
  const navigate = useNavigate();
  return (
    <div className="bg-[#f8fafc] content-stretch flex h-[900px] items-start overflow-clip relative shrink-0 w-[1440px]" data-name="med/paciente/resumen">
      <div className="bg-[#0f172a] border-[#e2e8f0] border-r border-solid content-stretch flex flex-col h-[900px] items-start justify-between px-[16px] py-[24px] relative shrink-0 w-[240px]" data-name="sidebar">
        <div className="content-stretch flex flex-col gap-[32px] items-start relative shrink-0 w-full" data-name="top-group">
          <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-name="brand">
            <div className="bg-[#2563eb] content-stretch flex flex-col items-center justify-center relative rounded-[8px] shrink-0 size-[32px]" data-name="logo-mark">
              <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[16px] text-white whitespace-nowrap">S</p>
            </div>
            <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px relative whitespace-nowrap" data-name="wordmark">
              <p className="font-jakarta font-extrabold relative shrink-0 text-[16px] text-white">SIAPPC</p>
              <p className="font-jakarta font-semibold relative shrink-0 text-[#64748b] text-[10px] uppercase">CUIDADO CRÍTICO</p>
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="menu">
            <Link className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Dashboard" to="/MedDashboardPrincipal">
              <div className="relative shrink-0 size-[18px]" data-name="icon-container">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgIconContainer} />
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Dashboard</p>
            </Link>
            <Link className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Pacientes" to="/MedPacientesLista">
              <div className="content-stretch flex flex-col items-start overflow-clip relative shrink-0 w-[18px]" data-name="icon-Pacientes">
                <div className="relative shrink-0 size-[18px]" data-name="users">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgUsers2} />
                </div>
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Pacientes</p>
            </Link>
            <Link className="bg-[rgba(37,99,235,0.15)] content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Monitoreo" to="/MedMonitoreoGridUci">
              <div className="relative shrink-0 size-[18px]" data-name="icon-container">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgIconContainer2} />
              </div>
              <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[14px] text-white whitespace-nowrap">Monitoreo</p>
            </Link>
            <Link className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Alertas" to="/MedAlertasCentro">
              <div className="relative shrink-0 size-[18px]" data-name="icon-container">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgIconContainer3} />
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Alertas</p>
            </Link>
            <Link className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Reportes" to="/MedReportesPanel">
              <div className="relative shrink-0 size-[18px]" data-name="icon-container">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgIconContainer4} />
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Reportes</p>
            </Link>
            <Link className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Dispositivos" to="/MedDispositivosMonitores">
              <div className="relative shrink-0 size-[18px]" data-name="icon-container">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgIconContainer5} />
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
              <img className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[20px] size-full" alt="" src={imgAvatar2Png} />
            </div>
            <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px relative whitespace-nowrap" data-name="user-info">
              <p className="font-jakarta font-bold overflow-hidden relative shrink-0 text-[13px] text-ellipsis text-white">Dr. Carlos Méndez</p>
              <p className="font-jakarta font-medium overflow-hidden relative shrink-0 text-[#64748b] text-[11px] text-ellipsis">Médico Intensivista</p>
            </div>
            <div className="relative shrink-0 size-[18px]" data-name="logout">
              <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgLogOut} />
            </div>
          </Link>
        </div>
      </div>
      <div className="content-stretch flex flex-col h-[900px] items-start relative shrink-0 w-[1200px]" data-name="main-container">
        <div className="bg-white border-[#e2e8f0] border-b border-solid content-stretch flex h-[72px] items-center justify-between px-[32px] relative shrink-0 w-full" data-name="top-bar">
          <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start leading-[normal] relative shrink-0 whitespace-nowrap" data-name="title-breadcrumb">
            <p className="font-jakarta font-medium relative shrink-0 text-[#64748b] text-[12px]">{`SIAPPC > Monitoreo > Mapa de Camas > C-03`}</p>
            <p className="font-jakarta font-extrabold relative shrink-0 text-[#0f172a] text-[20px]">Cama C-03 — María González</p>
          </div>
          <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="top-bar-actions">
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex gap-[6px] items-center px-[16px] py-[8px] relative rounded-[8px] shrink-0 cursor-pointer" data-name="btn-back" role="button" onClick={() => navigate(-1)}>
              <div className="overflow-clip relative shrink-0 size-[14px]" data-name="arrow-left">
                <div className="absolute inset-[15%]" data-name="arrow-left">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgArrowLeft2} />
                </div>
              </div>
              <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] whitespace-nowrap">Volver al Mapa</p>
            </div>
            <Link className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex items-center justify-center relative rounded-[18px] shrink-0 size-[36px]" data-name="notification-bell" to="/MedNotificacionesCentro">
              <div className="relative shrink-0 size-[18px]" data-name="bell">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgBell2} />
              </div>
              <div className="absolute bg-[#ef4444] content-stretch flex items-center justify-center right-[-3px] rounded-[8px] size-[16px] top-[-3px]" data-name="red-badge">
                <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[10px] text-white whitespace-nowrap">3</p>
              </div>
            </Link>
          </div>
        </div>
        <div className="content-stretch flex flex-[1_0_0] flex-col gap-[20px] items-start min-h-px p-[32px] relative w-full" data-name="page-body">
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
                      <p className="[word-break:break-word] font-geist font-bold leading-[normal] relative shrink-0 text-[#2563eb] text-[12px] whitespace-nowrap">Cama C-03</p>
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
            <div className="border-[#2563eb] border-b-2 border-solid content-stretch flex items-start px-[16px] py-[12px] relative shrink-0" data-name="tab-Resumen">
              <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#2563eb] text-[14px] whitespace-nowrap">Resumen</p>
            </div>
            <Link className="content-stretch cursor-pointer flex items-start px-[16px] py-[12px] relative shrink-0" data-name="tab-Historia Clínica" to="/MedPacienteHistoriaClinicaGeneral">
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] text-left whitespace-nowrap">Historia Clínica</p>
            </Link>
            <Link className="content-stretch cursor-pointer flex items-start px-[16px] py-[12px] relative shrink-0" data-name="tab-Notas SOAP" to="/MedPacienteNotasSoapHistorial">
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] text-left whitespace-nowrap">Notas SOAP</p>
            </Link>
            <Link className="content-stretch cursor-pointer flex items-start px-[16px] py-[12px] relative shrink-0" data-name="tab-Monitoreo" to="/MedPacienteMonitoreoDetallado">
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] text-left whitespace-nowrap">Monitoreo</p>
            </Link>
            <Link className="content-stretch cursor-pointer flex items-start px-[16px] py-[12px] relative shrink-0" data-name="tab-Documentos" to="/MedPacienteDocumentosClinicos">
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] text-left whitespace-nowrap">Documentos</p>
            </Link>
          </div>
          <div className="content-stretch flex gap-[20px] items-start relative shrink-0 w-full" data-name="columns-split">
            <div className="content-stretch flex flex-col h-[571px] items-start relative shrink-0 w-[630px]" data-name="left-column">
              <div className="bg-[#0b1220] content-stretch drop-shadow-[0px_8px_10px_rgba(0,0,0,0.25)] flex flex-[1_0_0] flex-col gap-[16px] items-start min-h-px p-[20px] relative rounded-[12px] w-full" data-name="monitor-panel">
                <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="monitor-header">
                  <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[15px] text-white whitespace-nowrap">Monitor de Signos Vitales — Cama C-03</p>
                  <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="live-indicator">
                    <div className="relative shrink-0 size-[6px]" data-name="Ellipse">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgLiveIndicatorEllipse} />
                    </div>
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#10b981] text-[12px] whitespace-nowrap">En vivo</p>
                  </div>
                  <Link className="[word-break:break-word] bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)] border-solid content-stretch cursor-pointer flex gap-[6px] items-center justify-center leading-[normal] not-italic overflow-clip px-[10px] py-[4px] relative rounded-[6px] shrink-0 text-[#94a3b8] text-left whitespace-nowrap" data-name="btn-config-umbrales" to="/MedPacienteConfigUmbrales">
                    <p className="font-inter font-normal relative shrink-0 text-[12px]">⚙</p>
                    <p className="font-inter font-medium relative shrink-0 text-[11px]">Configurar Umbrales</p>
                  </Link>
                </div>
                <div className="bg-[#090e17] border border-[#1e293b] border-solid content-stretch flex flex-col gap-[10px] items-start p-[12px] relative rounded-[10px] shrink-0 w-full" data-name="ecg-section">
                  <div className="[word-break:break-word] content-stretch flex font-jakarta font-bold items-center justify-between leading-[normal] relative shrink-0 w-full whitespace-nowrap" data-name="ecg-title-row">
                    <p className="relative shrink-0 text-[#94a3b8] text-[11px] uppercase">ECG II</p>
                    <p className="relative shrink-0 text-[#22c55e] text-[12px]">Filtro: Activo</p>
                  </div>
                  <div className="content-stretch flex flex-col h-[60px] items-start overflow-clip relative shrink-0 w-full" data-name="ecg-wave-strip">
                    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="wave-canvas">
                      <div className="absolute h-[36px] left-0 top-[12px] w-[560px]" data-name="wave-line">
                        <div className="absolute inset-[-2.78%_-0.18%]">
                          <img className="block max-w-none size-full" alt="" src={imgWaveLine} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="vitals-matrix-container">
                  <div className="[word-break:break-word] content-stretch flex gap-[12px] items-start leading-[normal] relative shrink-0 w-full whitespace-nowrap" data-name="matrix-row-1">
                    <div className="bg-[#0b1220] border border-[#1e293b] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[6px] items-start min-w-px p-[14px] relative rounded-[8px]" data-name="vital-FC (Frecuencia Cardíaca)">
                      <p className="font-jakarta font-bold relative shrink-0 text-[#94a3b8] text-[11px] uppercase">FC (Frecuencia Cardíaca)</p>
                      <div className="content-stretch flex gap-[6px] items-baseline relative shrink-0 text-[#ef4444]" data-name="value-row">
                        <p className="font-jakarta font-extrabold relative shrink-0 text-[28px]">112</p>
                        <p className="font-jakarta font-bold relative shrink-0 text-[12px]">lpm</p>
                      </div>
                    </div>
                    <div className="bg-[#0b1220] border border-[#1e293b] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[6px] items-start min-w-px p-[14px] relative rounded-[8px]" data-name="vital-SpO2 (Oxígeno)">
                      <p className="font-jakarta font-bold relative shrink-0 text-[#94a3b8] text-[11px] uppercase">SpO2 (Oxígeno)</p>
                      <div className="content-stretch flex gap-[6px] items-baseline relative shrink-0 text-[#f59e0b]" data-name="value-row">
                        <p className="font-jakarta font-extrabold relative shrink-0 text-[28px]">93</p>
                        <p className="font-jakarta font-bold relative shrink-0 text-[12px]">%</p>
                      </div>
                    </div>
                  </div>
                  <div className="[word-break:break-word] content-stretch flex gap-[12px] items-start leading-[normal] relative shrink-0 w-full whitespace-nowrap" data-name="matrix-row-2">
                    <div className="bg-[#0b1220] border border-[#1e293b] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[6px] items-start min-w-px p-[14px] relative rounded-[8px]" data-name="vital-PA (Presión Arterial)">
                      <p className="font-jakarta font-bold relative shrink-0 text-[#94a3b8] text-[11px] uppercase">PA (Presión Arterial)</p>
                      <div className="content-stretch flex gap-[6px] items-baseline relative shrink-0 text-[#f59e0b]" data-name="value-row">
                        <p className="font-jakarta font-extrabold relative shrink-0 text-[28px]">145/92</p>
                        <p className="font-jakarta font-bold relative shrink-0 text-[12px]">mmHg</p>
                      </div>
                    </div>
                    <div className="bg-[#0b1220] border border-[#1e293b] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[6px] items-start min-w-px p-[14px] relative rounded-[8px]" data-name="vital-Temp (Temperatura)">
                      <p className="font-jakarta font-bold relative shrink-0 text-[#94a3b8] text-[11px] uppercase">Temp (Temperatura)</p>
                      <div className="content-stretch flex gap-[6px] items-baseline relative shrink-0 text-[#f59e0b]" data-name="value-row">
                        <p className="font-jakarta font-extrabold relative shrink-0 text-[28px]">37.8</p>
                        <p className="font-jakarta font-bold relative shrink-0 text-[12px]">°C</p>
                      </div>
                    </div>
                  </div>
                  <div className="content-stretch flex items-start relative shrink-0 w-full" data-name="matrix-row-3">
                    <div className="[word-break:break-word] bg-[#0b1220] border border-[#1e293b] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[6px] items-start leading-[normal] min-w-px p-[14px] relative rounded-[8px] whitespace-nowrap" data-name="vital-FR (Frecuencia Resp.)">
                      <p className="font-jakarta font-bold relative shrink-0 text-[#94a3b8] text-[11px] uppercase">FR (Frecuencia Resp.)</p>
                      <div className="content-stretch flex gap-[6px] items-baseline relative shrink-0 text-white" data-name="value-row">
                        <p className="font-jakarta font-extrabold relative shrink-0 text-[28px]">22</p>
                        <p className="font-jakarta font-bold relative shrink-0 text-[12px]">rpm</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="[word-break:break-word] border-[#1e293b] border-solid border-t content-stretch flex items-center justify-between leading-[normal] pt-[8px] relative shrink-0 text-[#94a3b8] text-[12px] w-full whitespace-nowrap" data-name="monitor-footer">
                  <p className="font-jakarta font-normal relative shrink-0">Última actualización: hace 3 seg</p>
                  <p className="font-jakarta font-bold relative shrink-0">Ref: RPi-UCI-003</p>
                </div>
              </div>
            </div>
            <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-[474px]" data-name="right-column">
              <div className="bg-white border border-[#e2e8f0] border-solid content-stretch drop-shadow-[0px_4px_6px_rgba(0,0,0,0.02)] flex flex-col gap-[12px] items-start p-[18px] relative rounded-[12px] shrink-0 w-full" data-name="patient-detail-card">
                <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#0f172a] text-[15px] whitespace-nowrap">Información del Paciente</p>
                <div className="h-0 relative shrink-0 w-full" data-name="Line">
                  <div className="absolute inset-[-1px_0_0_0]">
                    <img className="block max-w-none size-full" alt="" src={imgPatientDetailCardLine} />
                  </div>
                </div>
                <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="details-list">
                  <div className="[word-break:break-word] content-stretch flex items-center justify-between leading-[normal] relative shrink-0 text-[13px] w-full whitespace-nowrap" data-name="item-0">
                    <p className="font-jakarta font-medium relative shrink-0 text-[#64748b]">Nombre Completo</p>
                    <p className="font-jakarta font-bold relative shrink-0 text-[#0f172a]">María González</p>
                  </div>
                  <div className="[word-break:break-word] content-stretch flex items-center justify-between leading-[normal] relative shrink-0 text-[13px] w-full whitespace-nowrap" data-name="item-1">
                    <p className="font-jakarta font-medium relative shrink-0 text-[#64748b]">Fecha de Nacimiento</p>
                    <p className="font-jakarta font-bold relative shrink-0 text-[#0f172a]">14 May 1959 (67 años)</p>
                  </div>
                  <div className="[word-break:break-word] content-stretch flex items-center justify-between leading-[normal] relative shrink-0 text-[13px] w-full whitespace-nowrap" data-name="item-2">
                    <p className="font-jakarta font-medium relative shrink-0 text-[#64748b]">Grupo Sanguíneo</p>
                    <p className="font-jakarta font-bold relative shrink-0 text-[#0f172a]">A+ (Positivo)</p>
                  </div>
                  <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="item-3">
                    <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[13px] whitespace-nowrap">Alergias</p>
                    <div className="bg-[#fef2f2] content-stretch flex items-start px-[8px] py-[2px] relative rounded-[4px] shrink-0" data-name="allergy-badge">
                      <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#ef4444] text-[11px] whitespace-nowrap">Penicilina</p>
                    </div>
                  </div>
                  <div className="[word-break:break-word] content-stretch flex items-center justify-between leading-[normal] relative shrink-0 text-[13px] w-full whitespace-nowrap" data-name="item-4">
                    <p className="font-jakarta font-medium relative shrink-0 text-[#64748b]">Médico Responsable</p>
                    <p className="font-jakarta font-bold relative shrink-0 text-[#0f172a]">Dr. Carlos Méndez</p>
                  </div>
                  <div className="[word-break:break-word] content-stretch flex items-center justify-between leading-[normal] relative shrink-0 text-[13px] w-full whitespace-nowrap" data-name="item-5">
                    <p className="font-jakarta font-medium relative shrink-0 text-[#64748b]">Diagnóstico Principal</p>
                    <p className="font-jakarta font-bold relative shrink-0 text-[#0f172a]">Insuficiencia Cardíaca Congestiva</p>
                  </div>
                  <div className="[word-break:break-word] content-stretch flex items-center justify-between leading-[normal] relative shrink-0 text-[13px] w-full whitespace-nowrap" data-name="item-6">
                    <p className="font-jakarta font-medium relative shrink-0 text-[#64748b]">Contacto de Emergencia</p>
                    <p className="font-jakarta font-bold relative shrink-0 text-[#0f172a]">Juan González — +52 55 1234 5678</p>
                  </div>
                  <div className="[word-break:break-word] content-stretch flex items-center justify-between leading-[normal] relative shrink-0 text-[13px] w-full whitespace-nowrap" data-name="item-7">
                    <p className="font-jakarta font-medium relative shrink-0 text-[#64748b]">Seguro Médico</p>
                    <p className="font-jakarta font-bold relative shrink-0 text-[#0f172a]">IMSS — Póliza #4821903</p>
                  </div>
                </div>
              </div>
              <div className="bg-white border border-[#e2e8f0] border-solid content-stretch drop-shadow-[0px_4px_6px_rgba(0,0,0,0.02)] flex flex-col gap-[14px] items-start p-[20px] relative rounded-[12px] shrink-0 w-full" data-name="soap-card">
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
                  <p className="[word-break:break-word] font-geist font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[12px] whitespace-nowrap">Dr. Carlos Méndez</p>
                </div>
                <div className="h-0 relative shrink-0 w-full" data-name="Line">
                  <div className="absolute inset-[-1px_0_0_0]">
                    <img className="block max-w-none size-full" alt="" src={imgSoapCardLine} />
                  </div>
                </div>
                <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full" data-name="soap-sections">
                  <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="soap-s">
                    <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="s-label">
                      <div className="bg-[#eff6ff] content-stretch flex items-start px-[6px] py-[2px] relative rounded-[4px] shrink-0" data-name="s-badge">
                        <p className="[word-break:break-word] font-geist font-extrabold leading-[normal] relative shrink-0 text-[#2563eb] text-[11px] whitespace-nowrap">S</p>
                      </div>
                      <p className="[word-break:break-word] font-geist font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[11px] whitespace-nowrap">Subjetivo</p>
                    </div>
                    <p className="[word-break:break-word] font-geist font-normal leading-[1.4] min-w-full relative shrink-0 text-[#0f172a] text-[12px] w-[min-content]">Disnea progresiva y dificultad para respirar en reposo.</p>
                  </div>
                  <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="soap-o">
                    <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="o-label">
                      <div className="bg-[#fef3c7] content-stretch flex items-start px-[6px] py-[2px] relative rounded-[4px] shrink-0" data-name="o-badge">
                        <p className="[word-break:break-word] font-geist font-extrabold leading-[normal] relative shrink-0 text-[#f59e0b] text-[11px] whitespace-nowrap">O</p>
                      </div>
                      <p className="[word-break:break-word] font-geist font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[11px] whitespace-nowrap">Objetivo</p>
                    </div>
                    <p className="[word-break:break-word] font-geist font-normal leading-[1.4] min-w-full relative shrink-0 text-[#0f172a] text-[12px] w-[min-content]">FC 134, SpO2 89%, estertores bilaterales.</p>
                  </div>
                  <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="soap-a">
                    <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="a-label">
                      <div className="bg-[#fef2f2] content-stretch flex items-start px-[6px] py-[2px] relative rounded-[4px] shrink-0" data-name="a-badge">
                        <p className="[word-break:break-word] font-geist font-extrabold leading-[normal] relative shrink-0 text-[#ef4444] text-[11px] whitespace-nowrap">A</p>
                      </div>
                      <p className="[word-break:break-word] font-geist font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[11px] whitespace-nowrap">Análisis</p>
                    </div>
                    <p className="[word-break:break-word] font-geist font-normal leading-[1.4] min-w-full relative shrink-0 text-[#0f172a] text-[12px] w-[min-content]">Descompensación aguda ICC.</p>
                  </div>
                  <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="soap-p">
                    <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="p-label">
                      <div className="bg-[#ecfdf5] content-stretch flex items-start px-[6px] py-[2px] relative rounded-[4px] shrink-0" data-name="p-badge">
                        <p className="[word-break:break-word] font-geist font-extrabold leading-[normal] relative shrink-0 text-[#10b981] text-[11px] whitespace-nowrap">P</p>
                      </div>
                      <p className="[word-break:break-word] font-geist font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[11px] whitespace-nowrap">Plan</p>
                    </div>
                    <p className="[word-break:break-word] font-geist font-normal leading-[1.4] min-w-full relative shrink-0 text-[#0f172a] text-[12px] w-[min-content]">Ajustar diurético IV, O2 por mascarilla.</p>
                  </div>
                </div>
              </div>
              <div className="bg-white border border-[#e2e8f0] border-solid content-stretch drop-shadow-[0px_4px_6px_rgba(0,0,0,0.02)] flex flex-col gap-[12px] items-start p-[18px] relative rounded-[12px] shrink-0 w-full" data-name="alerts-card">
                <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="alerts-header">
                  <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#0f172a] text-[15px] whitespace-nowrap">Alertas Activas</p>
                  <div className="bg-[#fef2f2] content-stretch flex items-start px-[8px] py-[2px] relative rounded-[4px] shrink-0" data-name="count-badge">
                    <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#ef4444] text-[11px] whitespace-nowrap">2</p>
                  </div>
                </div>
                <div className="h-0 relative shrink-0 w-full" data-name="Line">
                  <div className="absolute inset-[-1px_0_0_0]">
                    <img className="block max-w-none size-full" alt="" src={imgPatientDetailCardLine} />
                  </div>
                </div>
                <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="alerts-list">
                  <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="alert-0">
                    <div className="content-stretch flex gap-[10px] items-center relative shrink-0" data-name="alert-text">
                      <div className="relative shrink-0 size-[8px]" data-name="Ellipse">
                        <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgAlertTextEllipse} />
                      </div>
                      <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 whitespace-nowrap" data-name="text-group">
                        <p className="font-jakarta font-bold relative shrink-0 text-[#0f172a] text-[13px]">{`SpO2 < 95% — Advertencia de Saturación`}</p>
                        <p className="font-jakarta font-normal relative shrink-0 text-[#64748b] text-[11px]">Saturación actual 93%. Detectada hace 8 min</p>
                      </div>
                    </div>
                    <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-start px-[12px] py-[6px] relative rounded-[6px] shrink-0" data-name="btn-atender">
                      <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[11px] whitespace-nowrap">Atender</p>
                    </div>
                  </div>
                  <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="alert-1">
                    <div className="content-stretch flex gap-[10px] items-center relative shrink-0" data-name="alert-text">
                      <div className="relative shrink-0 size-[8px]" data-name="Ellipse">
                        <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgAlertTextEllipse2} />
                      </div>
                      <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 whitespace-nowrap" data-name="text-group">
                        <p className="font-jakarta font-bold relative shrink-0 text-[#0f172a] text-[13px]">{`FC > 110 bpm — Alerta Taquicardia`}</p>
                        <p className="font-jakarta font-normal relative shrink-0 text-[#64748b] text-[11px]">Ritmo actual 112 lpm. Detectada hace 12 min</p>
                      </div>
                    </div>
                    <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-start px-[12px] py-[6px] relative rounded-[6px] shrink-0" data-name="btn-atender">
                      <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[11px] whitespace-nowrap">Atender</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white border border-[#e2e8f0] border-solid content-stretch drop-shadow-[0px_4px_6px_rgba(0,0,0,0.02)] flex flex-col gap-[14px] items-start p-[20px] relative rounded-[12px] shrink-0 w-full" data-name="device-card">
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
                    <img className="block max-w-none size-full" alt="" src={imgSoapCardLine} />
                  </div>
                </div>
                <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full" data-name="device-info">
                  <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="device-id-row">
                    <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="device-id-label">
                      <div className="relative shrink-0 size-[14px]" data-name="cpu-icon">
                        <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgCpuIcon} />
                      </div>
                      <p className="[word-break:break-word] font-geist font-normal leading-[normal] relative shrink-0 text-[#64748b] text-[12px] whitespace-nowrap">ID del dispositivo</p>
                    </div>
                    <p className="[word-break:break-word] font-geist font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] whitespace-nowrap">RPi-UCI-003</p>
                  </div>
                  <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="signal-row">
                    <p className="[word-break:break-word] font-geist font-normal leading-[normal] relative shrink-0 text-[#64748b] text-[12px] whitespace-nowrap">Señal</p>
                    <div className="bg-[#ecfdf5] content-stretch flex items-start px-[8px] py-[2px] relative rounded-[4px] shrink-0" data-name="signal-badge">
                      <p className="[word-break:break-word] font-geist font-bold leading-[normal] relative shrink-0 text-[#10b981] text-[11px] whitespace-nowrap">Excelente</p>
                    </div>
                  </div>
                  <div className="[word-break:break-word] content-stretch flex items-center justify-between leading-[normal] relative shrink-0 w-full whitespace-nowrap" data-name="uptime-row">
                    <p className="font-geist font-normal relative shrink-0 text-[#64748b] text-[12px]">Uptime</p>
                    <p className="font-geist font-bold relative shrink-0 text-[#0f172a] text-[13px]">72h continuas</p>
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
