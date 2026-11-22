// Pantalla "med/paciente/config-umbrales" (Figma node 140:259) — generada desde el diseño original de Figma.
import { Link } from 'react-router-dom';
import imgActivity from '../../assets/activity.svg';
import imgActivity7 from '../../assets/activity-7.svg';
import imgAvatar2Png from '../../assets/avatar-2.png';
import imgBell from '../../assets/bell.svg';
import imgBell3 from '../../assets/bell-3.svg';
import imgBulletItemEllipse from '../../assets/bullet-item-ellipse.svg';
import imgChevronDown from '../../assets/chevron-down.svg';
import imgClipboard from '../../assets/clipboard.svg';
import imgCpu from '../../assets/cpu.svg';
import imgDoctorFooterLine from '../../assets/doctor-footer-line.svg';
import imgDropdownBadgeEllipse from '../../assets/dropdown-badge-ellipse.svg';
import imgDropdownBadgeEllipse2 from '../../assets/dropdown-badge-ellipse-2.svg';
import imgFileText from '../../assets/file-text.svg';
import imgFileText2 from '../../assets/file-text-2.svg';
import imgHeart5 from '../../assets/heart-5.svg';
import imgHelpIconEllipse from '../../assets/help-icon-ellipse.svg';
import imgHome2 from '../../assets/home-2.svg';
import imgLogOut from '../../assets/log-out.svg';
import imgPatientAvatarPng from '../../assets/patient-avatar.png';
import imgSearch2 from '../../assets/search-2.svg';
import imgThermometer from '../../assets/thermometer.svg';
import imgToggleSwitch from '../../assets/toggle-switch.svg';
import imgToggleSwitch2 from '../../assets/toggle-switch-2.svg';
import imgTrendingUp from '../../assets/trending-up.svg';
import imgUsers from '../../assets/users.svg';
import imgWind from '../../assets/wind.svg';

export default function MedPacienteConfigUmbrales() {
  return (
    <div className="bg-[#f8fafc] content-stretch flex h-[900px] items-start overflow-clip relative shrink-0 w-[1440px]" data-name="med/paciente/config-umbrales">
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
            <p className="font-jakarta font-medium relative shrink-0 text-[#64748b] text-[12px]">{`SIAPPC > Pacientes > María González > Umbrales`}</p>
            <p className="font-jakarta font-extrabold relative shrink-0 text-[#0f172a] text-[20px]">Configuración de Umbrales de Alarma</p>
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
          </div>
          <div className="bg-white border border-[#e2e8f0] border-solid content-stretch drop-shadow-[0px_4px_6px_rgba(0,0,0,0.01)] flex flex-col gap-[20px] items-start p-[24px] relative rounded-[12px] shrink-0 w-full" data-name="form-card">
            <div className="[word-break:break-word] content-stretch flex flex-col gap-[6px] items-start leading-[normal] relative shrink-0 w-full" data-name="form-header">
              <p className="font-jakarta font-extrabold relative shrink-0 text-[#0f172a] text-[16px] whitespace-nowrap">Configuración de Parámetros Clínicos</p>
              <p className="font-jakarta font-normal min-w-full relative shrink-0 text-[#64748b] text-[13px] w-[min-content]">Configure los límites fisiológicos personalizados para disparar alertas en la central de monitoreo.</p>
            </div>
            <div className="[word-break:break-word] content-stretch flex font-jakarta font-bold gap-[16px] items-start leading-[normal] px-[16px] relative shrink-0 text-[#94a3b8] text-[12px] w-full" data-name="list-header">
              <p className="relative shrink-0 w-[220px]">SIGNO VITAL</p>
              <p className="relative shrink-0 w-[300px]">LÍMITES (MIN / MAX)</p>
              <p className="relative shrink-0 w-[180px]">SEVERIDAD POR DEFECTO</p>
              <p className="flex-[1_0_0] min-w-px relative text-right">ESTADO</p>
            </div>
            <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full" data-name="rows-container">
              <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex gap-[16px] items-center px-[16px] py-[12px] relative rounded-[8px] shrink-0 w-full" data-name="threshold-row">
                <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-[220px]" data-name="vital-identifier">
                  <div className="bg-[#eff6ff] content-stretch flex flex-col items-center justify-center relative rounded-[18px] shrink-0 size-[36px]" data-name="icon-circle">
                    <div className="relative shrink-0 size-[16px]" data-name="activity">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgActivity7} />
                    </div>
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[14px] whitespace-nowrap">FC (Frecuencia Cardíaca)</p>
                </div>
                <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-[300px]" data-name="inputs-group">
                  <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="min-input-field">
                    <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#64748b] text-[13px] whitespace-nowrap">Min</p>
                    <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-start justify-center px-[12px] py-[8px] relative rounded-[6px] shrink-0 w-[80px]" data-name="input-box">
                      <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] whitespace-nowrap">50</p>
                    </div>
                  </div>
                  <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="max-input-field">
                    <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#64748b] text-[13px] whitespace-nowrap">Max</p>
                    <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-start justify-center px-[12px] py-[8px] relative rounded-[6px] shrink-0 w-[80px]" data-name="input-box">
                      <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[13px] text-black whitespace-nowrap">120</p>
                    </div>
                  </div>
                </div>
                <div className="content-stretch flex items-start relative shrink-0 w-[180px]" data-name="severity-column">
                  <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-[1_0_0] items-center justify-between min-w-px px-[12px] py-[8px] relative rounded-[6px]" data-name="select-dropdown">
                    <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="dropdown-badge">
                      <div className="relative shrink-0 size-[6px]" data-name="Ellipse">
                        <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgDropdownBadgeEllipse} />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] whitespace-nowrap">Crítica</p>
                    </div>
                    <div className="relative shrink-0 size-[14px]" data-name="chevron-down">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgChevronDown} />
                    </div>
                  </div>
                </div>
                <div className="content-stretch flex flex-[1_0_0] items-start justify-end min-w-px relative" data-name="toggle-column">
                  <div className="h-[24px] relative shrink-0 w-[44px]" data-name="toggle-switch">
                    <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgToggleSwitch} />
                  </div>
                </div>
              </div>
              <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex gap-[16px] items-center px-[16px] py-[12px] relative rounded-[8px] shrink-0 w-full" data-name="threshold-row">
                <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-[220px]" data-name="vital-identifier">
                  <div className="bg-[#eff6ff] content-stretch flex flex-col items-center justify-center relative rounded-[18px] shrink-0 size-[36px]" data-name="icon-circle">
                    <div className="relative shrink-0 size-[16px]" data-name="wind">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgWind} />
                    </div>
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[14px] whitespace-nowrap">SpO2 (Saturación)</p>
                </div>
                <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-[300px]" data-name="inputs-group">
                  <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="min-input-field">
                    <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#64748b] text-[13px] whitespace-nowrap">Min</p>
                    <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-start justify-center px-[12px] py-[8px] relative rounded-[6px] shrink-0 w-[80px]" data-name="input-box">
                      <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] whitespace-nowrap">92</p>
                    </div>
                  </div>
                  <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="max-input-field">
                    <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#64748b] text-[13px] whitespace-nowrap">Max</p>
                    <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-start justify-center px-[12px] py-[8px] relative rounded-[6px] shrink-0 w-[80px]" data-name="input-box">
                      <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[13px] text-[transparent] whitespace-nowrap">-</p>
                    </div>
                  </div>
                </div>
                <div className="content-stretch flex items-start relative shrink-0 w-[180px]" data-name="severity-column">
                  <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-[1_0_0] items-center justify-between min-w-px px-[12px] py-[8px] relative rounded-[6px]" data-name="select-dropdown">
                    <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="dropdown-badge">
                      <div className="relative shrink-0 size-[6px]" data-name="Ellipse">
                        <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgDropdownBadgeEllipse} />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] whitespace-nowrap">Crítica</p>
                    </div>
                    <div className="relative shrink-0 size-[14px]" data-name="chevron-down">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgChevronDown} />
                    </div>
                  </div>
                </div>
                <div className="content-stretch flex flex-[1_0_0] items-start justify-end min-w-px relative" data-name="toggle-column">
                  <div className="h-[24px] relative shrink-0 w-[44px]" data-name="toggle-switch">
                    <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgToggleSwitch} />
                  </div>
                </div>
              </div>
              <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex gap-[16px] items-center px-[16px] py-[12px] relative rounded-[8px] shrink-0 w-full" data-name="threshold-row">
                <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-[220px]" data-name="vital-identifier">
                  <div className="bg-[#eff6ff] content-stretch flex flex-col items-center justify-center relative rounded-[18px] shrink-0 size-[36px]" data-name="icon-circle">
                    <div className="relative shrink-0 size-[16px]" data-name="heart">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgHeart5} />
                    </div>
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[14px] whitespace-nowrap">PA Sistólica</p>
                </div>
                <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-[300px]" data-name="inputs-group">
                  <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="min-input-field">
                    <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#64748b] text-[13px] whitespace-nowrap">Min</p>
                    <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-start justify-center px-[12px] py-[8px] relative rounded-[6px] shrink-0 w-[80px]" data-name="input-box">
                      <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#94a3b8] text-[13px] whitespace-nowrap">-</p>
                    </div>
                  </div>
                  <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="max-input-field">
                    <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#64748b] text-[13px] whitespace-nowrap">Max</p>
                    <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-start justify-center px-[12px] py-[8px] relative rounded-[6px] shrink-0 w-[80px]" data-name="input-box">
                      <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[13px] text-black whitespace-nowrap">160</p>
                    </div>
                  </div>
                </div>
                <div className="content-stretch flex items-start relative shrink-0 w-[180px]" data-name="severity-column">
                  <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-[1_0_0] items-center justify-between min-w-px px-[12px] py-[8px] relative rounded-[6px]" data-name="select-dropdown">
                    <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="dropdown-badge">
                      <div className="relative shrink-0 size-[6px]" data-name="Ellipse">
                        <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgDropdownBadgeEllipse2} />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] whitespace-nowrap">Alta</p>
                    </div>
                    <div className="relative shrink-0 size-[14px]" data-name="chevron-down">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgChevronDown} />
                    </div>
                  </div>
                </div>
                <div className="content-stretch flex flex-[1_0_0] items-start justify-end min-w-px relative" data-name="toggle-column">
                  <div className="h-[24px] relative shrink-0 w-[44px]" data-name="toggle-switch">
                    <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgToggleSwitch} />
                  </div>
                </div>
              </div>
              <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex gap-[16px] items-center px-[16px] py-[12px] relative rounded-[8px] shrink-0 w-full" data-name="threshold-row">
                <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-[220px]" data-name="vital-identifier">
                  <div className="bg-[#eff6ff] content-stretch flex flex-col items-center justify-center relative rounded-[18px] shrink-0 size-[36px]" data-name="icon-circle">
                    <div className="relative shrink-0 size-[16px]" data-name="heart">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgHeart5} />
                    </div>
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[14px] whitespace-nowrap">PA Diastólica</p>
                </div>
                <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-[300px]" data-name="inputs-group">
                  <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="min-input-field">
                    <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#64748b] text-[13px] whitespace-nowrap">Min</p>
                    <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-start justify-center px-[12px] py-[8px] relative rounded-[6px] shrink-0 w-[80px]" data-name="input-box">
                      <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#94a3b8] text-[13px] whitespace-nowrap">-</p>
                    </div>
                  </div>
                  <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="max-input-field">
                    <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#64748b] text-[13px] whitespace-nowrap">Max</p>
                    <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-start justify-center px-[12px] py-[8px] relative rounded-[6px] shrink-0 w-[80px]" data-name="input-box">
                      <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[13px] text-black whitespace-nowrap">100</p>
                    </div>
                  </div>
                </div>
                <div className="content-stretch flex items-start relative shrink-0 w-[180px]" data-name="severity-column">
                  <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-[1_0_0] items-center justify-between min-w-px px-[12px] py-[8px] relative rounded-[6px]" data-name="select-dropdown">
                    <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="dropdown-badge">
                      <div className="relative shrink-0 size-[6px]" data-name="Ellipse">
                        <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgDropdownBadgeEllipse2} />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] whitespace-nowrap">Alta</p>
                    </div>
                    <div className="relative shrink-0 size-[14px]" data-name="chevron-down">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgChevronDown} />
                    </div>
                  </div>
                </div>
                <div className="content-stretch flex flex-[1_0_0] items-start justify-end min-w-px relative" data-name="toggle-column">
                  <div className="h-[24px] relative shrink-0 w-[44px]" data-name="toggle-switch">
                    <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgToggleSwitch} />
                  </div>
                </div>
              </div>
              <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex gap-[16px] items-center px-[16px] py-[12px] relative rounded-[8px] shrink-0 w-full" data-name="threshold-row">
                <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-[220px]" data-name="vital-identifier">
                  <div className="bg-[#eff6ff] content-stretch flex flex-col items-center justify-center relative rounded-[18px] shrink-0 size-[36px]" data-name="icon-circle">
                    <div className="relative shrink-0 size-[16px]" data-name="thermometer">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgThermometer} />
                    </div>
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[14px] whitespace-nowrap">Temp (Temperatura)</p>
                </div>
                <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-[300px]" data-name="inputs-group">
                  <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="min-input-field">
                    <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#64748b] text-[13px] whitespace-nowrap">Min</p>
                    <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-start justify-center px-[12px] py-[8px] relative rounded-[6px] shrink-0 w-[80px]" data-name="input-box">
                      <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#94a3b8] text-[13px] whitespace-nowrap">-</p>
                    </div>
                  </div>
                  <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="max-input-field">
                    <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#64748b] text-[13px] whitespace-nowrap">Max</p>
                    <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-start justify-center px-[12px] py-[8px] relative rounded-[6px] shrink-0 w-[80px]" data-name="input-box">
                      <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[13px] text-black whitespace-nowrap">38.5</p>
                    </div>
                  </div>
                </div>
                <div className="content-stretch flex items-start relative shrink-0 w-[180px]" data-name="severity-column">
                  <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-[1_0_0] items-center justify-between min-w-px px-[12px] py-[8px] relative rounded-[6px]" data-name="select-dropdown">
                    <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="dropdown-badge">
                      <div className="relative shrink-0 size-[6px]" data-name="Ellipse">
                        <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgBulletItemEllipse} />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] whitespace-nowrap">Media</p>
                    </div>
                    <div className="relative shrink-0 size-[14px]" data-name="chevron-down">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgChevronDown} />
                    </div>
                  </div>
                </div>
                <div className="content-stretch flex flex-[1_0_0] items-start justify-end min-w-px relative" data-name="toggle-column">
                  <div className="h-[24px] relative shrink-0 w-[44px]" data-name="toggle-switch">
                    <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgToggleSwitch} />
                  </div>
                </div>
              </div>
              <div className="bg-[#f1f5f9] border border-[#e2e8f0] border-solid content-stretch flex gap-[16px] items-center opacity-65 px-[16px] py-[12px] relative rounded-[8px] shrink-0 w-full" data-name="threshold-row">
                <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-[220px]" data-name="vital-identifier">
                  <div className="bg-[#e2e8f0] content-stretch flex flex-col items-center justify-center relative rounded-[18px] shrink-0 size-[36px]" data-name="icon-circle">
                    <div className="relative shrink-0 size-[16px]" data-name="trending-up">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgTrendingUp} />
                    </div>
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#94a3b8] text-[14px] whitespace-nowrap">FR (Frecuencia Resp.)</p>
                </div>
                <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-[300px]" data-name="inputs-group">
                  <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="min-input-field">
                    <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#64748b] text-[13px] whitespace-nowrap">Min</p>
                    <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-start justify-center px-[12px] py-[8px] relative rounded-[6px] shrink-0 w-[80px]" data-name="input-box">
                      <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] whitespace-nowrap">10</p>
                    </div>
                  </div>
                  <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="max-input-field">
                    <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#64748b] text-[13px] whitespace-nowrap">Max</p>
                    <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-start justify-center px-[12px] py-[8px] relative rounded-[6px] shrink-0 w-[80px]" data-name="input-box">
                      <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[13px] text-black whitespace-nowrap">30</p>
                    </div>
                  </div>
                </div>
                <div className="content-stretch flex items-start relative shrink-0 w-[180px]" data-name="severity-column">
                  <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-[1_0_0] items-center justify-between min-w-px px-[12px] py-[8px] relative rounded-[6px]" data-name="select-dropdown">
                    <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="dropdown-badge">
                      <div className="relative shrink-0 size-[6px]" data-name="Ellipse">
                        <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgBulletItemEllipse} />
                      </div>
                      <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] whitespace-nowrap">Media</p>
                    </div>
                    <div className="relative shrink-0 size-[14px]" data-name="chevron-down">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgChevronDown} />
                    </div>
                  </div>
                </div>
                <div className="content-stretch flex flex-[1_0_0] items-start justify-end min-w-px relative" data-name="toggle-column">
                  <div className="h-[24px] relative shrink-0 w-[44px]" data-name="toggle-switch">
                    <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgToggleSwitch2} />
                  </div>
                </div>
              </div>
            </div>
            <div className="content-stretch flex gap-[16px] items-start justify-end pt-[12px] relative shrink-0 w-full" data-name="form-actions">
              <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Restablecer valores sugeridos</p>
              <div className="bg-[#2563eb] content-stretch flex items-start px-[24px] py-[10px] relative rounded-[8px] shrink-0" data-name="btn-save">
                <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[14px] text-white whitespace-nowrap">Guardar Configuración</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
