// Pantalla "med/paciente/registro-diagnostico" (Figma node 140:499) — generada desde el diseño original de Figma.
import { Link } from 'react-router-dom';
import imgActivity from '../../assets/activity.svg';
import imgAvatar2Png from '../../assets/avatar-2.png';
import imgBell from '../../assets/bell.svg';
import imgBell3 from '../../assets/bell-3.svg';
import imgCalendar from '../../assets/calendar.svg';
import imgChevronDown from '../../assets/chevron-down.svg';
import imgClipboard from '../../assets/clipboard.svg';
import imgCpu from '../../assets/cpu.svg';
import imgDoctorFooterLine from '../../assets/doctor-footer-line.svg';
import imgFileText from '../../assets/file-text.svg';
import imgFileText2 from '../../assets/file-text-2.svg';
import imgHelpIconEllipse from '../../assets/help-icon-ellipse.svg';
import imgHome2 from '../../assets/home-2.svg';
import imgLogOut from '../../assets/log-out.svg';
import imgPatientAvatarPng from '../../assets/patient-avatar.png';
import imgPrevDiagnosticsColumnLine from '../../assets/prev-diagnostics-column-line.svg';
import imgRadioOptionEllipse from '../../assets/radio-option-ellipse.svg';
import imgRadioOptionEllipse2 from '../../assets/radio-option-ellipse-2.svg';
import imgSearch2 from '../../assets/search-2.svg';
import imgSearch3 from '../../assets/search-3.svg';
import imgUploadCloud from '../../assets/upload-cloud.svg';
import imgUsers from '../../assets/users.svg';

export default function MedPacienteRegistroDiagnostico() {
  return (
    <div className="bg-[#f8fafc] content-stretch flex h-[900px] items-start overflow-clip relative shrink-0 w-[1440px]" data-name="med/paciente/registro-diagnostico">
      <div className="bg-[#0f172a] border-[#1e293b] border-r border-solid content-stretch flex flex-col h-full items-start justify-between px-[16px] py-[24px] relative shrink-0 w-[240px]" data-name="sidebar">
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
              <div className="relative shrink-0 size-[18px]" data-name="home">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgHome2} />
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Dashboard</p>
            </Link>
            <Link className="bg-[rgba(37,99,235,0.15)] content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Pacientes" to="/MedPacientesLista">
              <div className="relative shrink-0 size-[18px]" data-name="users">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgUsers} />
              </div>
              <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[14px] text-white whitespace-nowrap">Pacientes</p>
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
              <img className="block max-w-none size-full" alt="" src={imgDoctorFooterLine} />
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
            <div className="relative shrink-0 size-[18px]" data-name="log-out">
              <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgLogOut} />
            </div>
          </Link>
        </div>
      </div>
      <div className="content-stretch flex flex-col h-[900px] items-start relative shrink-0 w-[1200px]" data-name="main-container">
        <div className="bg-white border-[#e2e8f0] border-b border-solid content-stretch flex h-[72px] items-center justify-between px-[32px] relative shrink-0 w-full" data-name="top-bar">
          <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start leading-[normal] relative shrink-0 whitespace-nowrap" data-name="title-breadcrumb">
            <p className="font-jakarta font-medium relative shrink-0 text-[#64748b] text-[12px]">{`SIAPPC > Pacientes > María González > Historia Clínica`}</p>
            <p className="font-jakarta font-extrabold relative shrink-0 text-[#0f172a] text-[20px]">Registro de Nuevo Diagnóstico</p>
          </div>
          <div className="content-stretch flex gap-[20px] items-center relative shrink-0" data-name="right-actions">
            <div className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex gap-[8px] items-center px-[12px] py-[6px] relative rounded-[8px] shrink-0" data-name="search">
              <div className="relative shrink-0 size-[14px]" data-name="search">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgSearch2} />
              </div>
              <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#64748b] text-[13px] whitespace-nowrap">Buscar...</p>
            </div>
            <Link className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex items-center justify-center relative rounded-[18px] shrink-0 size-[36px]" data-name="notification-bell" to="/MedNotificacionesCentro">
              <div className="relative shrink-0 size-[18px]" data-name="bell">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgBell3} />
              </div>
              <div className="absolute bg-[#ef4444] content-stretch flex items-center justify-center right-[-3px] rounded-[8px] size-[16px] top-[-3px]" data-name="red-badge">
                <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[10px] text-white whitespace-nowrap">3</p>
              </div>
            </Link>
          </div>
        </div>
        <div className="content-stretch flex flex-[1_0_0] flex-col gap-[20px] items-start min-h-px p-[32px] relative w-full" data-name="page-body">
          <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="patient-header-group">
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch drop-shadow-[0px_4px_6px_rgba(0,0,0,0.02)] flex flex-col items-start p-[20px] relative rounded-[12px] shrink-0 w-full" data-name="patient-header-card">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="patient-header-top">
                <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="patient-info-group">
                  <div className="relative rounded-[28px] shrink-0 size-[56px]" data-name="patient-avatar">
                    <img className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[28px] size-full" alt="" src={imgPatientAvatarPng} />
                  </div>
                  <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0" data-name="patient-details">
                    <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="name-badge-row">
                      <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#0f172a] text-[22px] whitespace-nowrap">María González</p>
                      <div className="bg-[#fef2f2] content-stretch flex items-start px-[10px] py-[4px] relative rounded-[6px] shrink-0" data-name="critical-badge">
                        <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#ef4444] text-[12px] whitespace-nowrap">Crítico</p>
                      </div>
                      <div className="bg-[#eff6ff] content-stretch flex items-start px-[10px] py-[4px] relative rounded-[6px] shrink-0" data-name="bed-badge">
                        <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#2563eb] text-[12px] whitespace-nowrap">Cama C-03 UCI</p>
                      </div>
                    </div>
                    <div className="[word-break:break-word] content-stretch flex gap-[20px] items-center leading-[normal] relative shrink-0 text-[13px] whitespace-nowrap" data-name="meta-row">
                      <p className="font-jakarta font-medium relative shrink-0 text-[#64748b]">ID PT-0003</p>
                      <p className="font-jakarta font-medium relative shrink-0 text-[#64748b]">67 años</p>
                      <p className="font-jakarta font-semibold relative shrink-0 text-[#0f172a]">Insuficiencia Cardíaca Congestiva</p>
                      <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="admission-row">
                        <p className="font-jakarta font-normal relative shrink-0 text-[#64748b]">Ingreso:</p>
                        <p className="font-jakarta font-semibold relative shrink-0 text-[#0f172a]">15 Oct 2025</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="content-stretch flex gap-[10px] items-center relative shrink-0" data-name="action-buttons">
                  <div className="bg-[#2563eb] content-stretch flex gap-[6px] items-center px-[16px] py-[8px] relative rounded-[8px] shrink-0" data-name="btn-nueva-nota">
                    <div className="relative shrink-0 size-[14px]" data-name="clipboard">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgClipboard} />
                    </div>
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[13px] text-white whitespace-nowrap">Nueva Nota SOAP</p>
                  </div>
                  <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex gap-[6px] items-center px-[16px] py-[8px] relative rounded-[8px] shrink-0" data-name="btn-reporte">
                    <div className="relative shrink-0 size-[14px]" data-name="file-text">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgFileText2} />
                    </div>
                    <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] whitespace-nowrap">Generar Reporte</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-[#e2e8f0] border-b border-solid content-stretch flex gap-[8px] items-start relative shrink-0 w-full" data-name="tab-bar">
              <div className="content-stretch flex items-start px-[16px] py-[12px] relative shrink-0" data-name="tab-Resumen">
                <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Resumen</p>
              </div>
              <div className="border-[#2563eb] border-b-2 border-solid content-stretch flex items-start px-[16px] py-[12px] relative shrink-0" data-name="tab-Historia Clínica">
                <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#2563eb] text-[14px] whitespace-nowrap">Historia Clínica</p>
              </div>
              <div className="content-stretch flex items-start px-[16px] py-[12px] relative shrink-0" data-name="tab-Notas SOAP">
                <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Notas SOAP</p>
              </div>
              <div className="content-stretch flex items-start px-[16px] py-[12px] relative shrink-0" data-name="tab-Monitoreo">
                <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Monitoreo</p>
              </div>
              <div className="content-stretch flex items-start px-[16px] py-[12px] relative shrink-0" data-name="tab-Documentos">
                <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Documentos</p>
              </div>
            </div>
          </div>
          <div className="content-stretch flex flex-[1_0_0] gap-[20px] items-start min-h-px relative w-full" data-name="split-section">
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[20px] items-start min-w-px p-[24px] relative rounded-[12px]" data-name="form-column">
              <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#0f172a] text-[16px] whitespace-nowrap">Formulario de Diagnóstico Clínico</p>
              <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full" data-name="form-row">
                <div className="content-stretch flex flex-[1_0_0] flex-col gap-[6px] items-start min-w-px relative" data-name="tipo-field">
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[12px] whitespace-nowrap">Tipo de Diagnóstico</p>
                  <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-center justify-between px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="select">
                    <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[14px] whitespace-nowrap">Diagnóstico Principal</p>
                    <div className="relative shrink-0 size-[14px]" data-name="chevron-down">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgChevronDown} />
                    </div>
                  </div>
                </div>
                <div className="content-stretch flex flex-[1_0_0] flex-col gap-[6px] items-start min-w-px relative" data-name="cie10-field">
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[12px] whitespace-nowrap">Código CIE-10</p>
                  <div className="bg-white border border-[#2563eb] border-solid content-stretch flex gap-[8px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="autocomplete-search">
                    <div className="relative shrink-0 size-[14px]" data-name="search">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgSearch3} />
                    </div>
                    <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[14px] whitespace-nowrap">I50.9 Insuficiencia cardíaca, no especificada</p>
                  </div>
                </div>
              </div>
              <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full" data-name="description-field">
                <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[12px] whitespace-nowrap">Descripción / Hallazgos Clínicos</p>
                <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex h-[80px] items-start p-[12px] relative rounded-[8px] shrink-0 w-full" data-name="textarea">
                  <p className="[word-break:break-word] flex-[1_0_0] font-jakarta font-normal leading-[20px] min-w-px relative text-[#0f172a] text-[14px]">Paciente femenina de 67 años con historial de insuficiencia cardíaca congestiva que ingresa con disnea en reposo notable, ortopnea y estertores basales crepitantes bilaterales.</p>
                </div>
              </div>
              <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full" data-name="form-row-severity-date">
                <div className="content-stretch flex flex-[1_0_0] flex-col gap-[10px] items-start min-w-px relative" data-name="severidad-field">
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[12px] whitespace-nowrap">Severidad</p>
                  <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="radios-row">
                    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="radio-option">
                      <div className="relative shrink-0 size-[16px]" data-name="Ellipse">
                        <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgRadioOptionEllipse} />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] whitespace-nowrap">Leve</p>
                    </div>
                    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="radio-option">
                      <div className="relative shrink-0 size-[16px]" data-name="Ellipse">
                        <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgRadioOptionEllipse} />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] whitespace-nowrap">Moderada</p>
                    </div>
                    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="radio-option">
                      <div className="relative shrink-0 size-[16px]" data-name="Ellipse">
                        <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgRadioOptionEllipse2} />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] whitespace-nowrap">Severa</p>
                    </div>
                    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="radio-option">
                      <div className="relative shrink-0 size-[16px]" data-name="Ellipse">
                        <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgRadioOptionEllipse} />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] whitespace-nowrap">Crítica</p>
                    </div>
                  </div>
                </div>
                <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-[200px]" data-name="fecha-field">
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[12px] whitespace-nowrap">Fecha de Registro</p>
                  <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-center justify-between px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="date-input">
                    <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[14px] whitespace-nowrap">02 Ago 2026</p>
                    <div className="relative shrink-0 size-[14px]" data-name="calendar">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgCalendar} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full" data-name="notes-field">
                <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[12px] whitespace-nowrap">Notas Adicionales / Plan de Manejo Inicial</p>
                <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex h-[60px] items-start p-[12px] relative rounded-[8px] shrink-0 w-full" data-name="textarea-small">
                  <p className="[word-break:break-word] flex-[1_0_0] font-jakarta font-normal leading-[normal] min-w-px relative text-[#94a3b8] text-[14px]">Iniciar protocolo de diuréticos IV y control estricto de balance hídrico...</p>
                </div>
              </div>
              <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full" data-name="estudios-field">
                <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[12px] whitespace-nowrap">Estudios Adjuntos (Rayos X, Labs, ECG)</p>
                <div className="bg-[#f8fafc] border border-[#e2e8f0] border-dashed content-stretch flex flex-col gap-[8px] items-center justify-center p-[16px] relative rounded-[8px] shrink-0 w-full" data-name="upload-zone">
                  <div className="relative shrink-0 size-[24px]" data-name="upload-cloud">
                    <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgUploadCloud} />
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#2563eb] text-[13px] whitespace-nowrap">Haga clic para subir archivos o arrástrelos aquí</p>
                  <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#94a3b8] text-[11px] whitespace-nowrap">PDF, PNG, JPG hasta 10MB</p>
                </div>
              </div>
              <div className="content-stretch flex gap-[12px] items-start justify-end pt-[12px] relative shrink-0 w-full" data-name="actions">
                <div className="border border-[#e2e8f0] border-solid content-stretch flex items-start pl-[20px] pr-[24px] py-[10px] relative rounded-[8px] shrink-0" data-name="btn-cancel">
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Cancelar</p>
                </div>
                <div className="bg-[#2563eb] content-stretch flex items-start px-[24px] py-[10px] relative rounded-[8px] shrink-0" data-name="btn-submit">
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[14px] text-white whitespace-nowrap">Registrar Diagnóstico</p>
                </div>
              </div>
            </div>
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[16px] h-full items-start p-[20px] relative rounded-[12px] shrink-0 w-[340px]" data-name="prev-diagnostics-column">
              <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#0f172a] text-[15px] whitespace-nowrap">Diagnósticos Previos</p>
              <div className="h-0 relative shrink-0 w-full" data-name="Line">
                <div className="absolute inset-[-1px_0_0_0]">
                  <img className="block max-w-none size-full" alt="" src={imgPrevDiagnosticsColumnLine} />
                </div>
              </div>
              <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="items-list">
                <div className="border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[8px] items-start p-[12px] relative rounded-[8px] shrink-0 w-full" data-name="diag-item">
                  <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="diag-header-row">
                    <div className="bg-[#f1f5f9] content-stretch flex items-start px-[6px] py-[2px] relative rounded-[4px] shrink-0" data-name="code-badge">
                      <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[11px] whitespace-nowrap">I50.9</p>
                    </div>
                    <div className="bg-[#fef2f2] content-stretch flex items-start px-[6px] py-[2px] relative rounded-[4px] shrink-0" data-name="severity-badge">
                      <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#ef4444] text-[10px] whitespace-nowrap">Crítica</p>
                    </div>
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-full">Insuficiencia Cardíaca Congestiva descompensada</p>
                  <div className="[word-break:break-word] content-stretch flex items-start justify-between leading-[normal] relative shrink-0 text-[#64748b] text-[11px] w-full whitespace-nowrap" data-name="meta-footer">
                    <p className="font-jakarta font-normal relative shrink-0">Hace 2 días</p>
                    <p className="font-jakarta font-medium relative shrink-0">Dr. Carlos Méndez</p>
                  </div>
                </div>
                <div className="border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[8px] items-start p-[12px] relative rounded-[8px] shrink-0 w-full" data-name="diag-item">
                  <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="diag-header-row">
                    <div className="bg-[#f1f5f9] content-stretch flex items-start px-[6px] py-[2px] relative rounded-[4px] shrink-0" data-name="code-badge">
                      <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[11px] whitespace-nowrap">I10</p>
                    </div>
                    <div className="bg-[#fef3c7] content-stretch flex items-start px-[6px] py-[2px] relative rounded-[4px] shrink-0" data-name="severity-badge">
                      <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#f59e0b] text-[10px] whitespace-nowrap">Moderada</p>
                    </div>
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-full">Hipertensión Arterial Primaria</p>
                  <div className="[word-break:break-word] content-stretch flex items-start justify-between leading-[normal] relative shrink-0 text-[#64748b] text-[11px] w-full whitespace-nowrap" data-name="meta-footer">
                    <p className="font-jakarta font-normal relative shrink-0">15 Oct 2025</p>
                    <p className="font-jakarta font-medium relative shrink-0">Dra. Lucía Torres</p>
                  </div>
                </div>
                <div className="border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[8px] items-start p-[12px] relative rounded-[8px] shrink-0 w-full" data-name="diag-item">
                  <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="diag-header-row">
                    <div className="bg-[#f1f5f9] content-stretch flex items-start px-[6px] py-[2px] relative rounded-[4px] shrink-0" data-name="code-badge">
                      <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[11px] whitespace-nowrap">E11.9</p>
                    </div>
                    <div className="bg-[#fef3c7] content-stretch flex items-start px-[6px] py-[2px] relative rounded-[4px] shrink-0" data-name="severity-badge">
                      <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#f59e0b] text-[10px] whitespace-nowrap">Leve</p>
                    </div>
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-full">Diabetes Mellitus Tipo 2</p>
                  <div className="[word-break:break-word] content-stretch flex items-start justify-between leading-[normal] relative shrink-0 text-[#64748b] text-[11px] w-full whitespace-nowrap" data-name="meta-footer">
                    <p className="font-jakarta font-normal relative shrink-0">12 May 2024</p>
                    <p className="font-jakarta font-medium relative shrink-0">Dr. Carlos Méndez</p>
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
