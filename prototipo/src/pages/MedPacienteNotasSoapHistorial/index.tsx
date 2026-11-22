// Pantalla "med/paciente/notas-soap-historial" (Figma node 29:1308) — generada desde el diseño original de Figma.
import { Link } from 'react-router-dom';
import imgAvatar2Png from '../../assets/avatar-2.png';
import imgChevronRight from '../../assets/chevron-right.svg';
import imgChevronRight2 from '../../assets/chevron-right-2.svg';
import imgDoctorFooterLine from '../../assets/doctor-footer-line.svg';
import imgHelpIconEllipse from '../../assets/help-icon-ellipse.svg';
import imgIconwrapper from '../../assets/iconwrapper.svg';
import imgIconwrapper10 from '../../assets/iconwrapper-10.svg';
import imgIconwrapper11 from '../../assets/iconwrapper-11.svg';
import imgIconwrapper12 from '../../assets/iconwrapper-12.svg';
import imgIconwrapper13 from '../../assets/iconwrapper-13.svg';
import imgIconwrapper14 from '../../assets/iconwrapper-14.svg';
import imgIconwrapper15 from '../../assets/iconwrapper-15.svg';
import imgIconwrapper4 from '../../assets/iconwrapper-4.svg';
import imgIconwrapper5 from '../../assets/iconwrapper-5.svg';
import imgIconwrapper6 from '../../assets/iconwrapper-6.svg';
import imgIconwrapper7 from '../../assets/iconwrapper-7.svg';
import imgIconwrapper8 from '../../assets/iconwrapper-8.svg';
import imgIconwrapper9 from '../../assets/iconwrapper-9.svg';
import imgPatientAvatarPng from '../../assets/patient-avatar.png';
import imgSliders from '../../assets/sliders.svg';
import imgSoapCardLine2 from '../../assets/soap-card-line-2.svg';

export default function MedPacienteNotasSoapHistorial() {
  return (
    <div className="bg-[#f8fafc] content-stretch flex h-[900px] items-start overflow-clip relative shrink-0 w-[1440px]" data-name="med/paciente/notas-soap-historial">
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
              <div className="relative shrink-0 size-[18px]" data-name="IconWrapper">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgIconwrapper4} />
              </div>
              <p className="[word-break:break-word] font-geist font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Dashboard</p>
            </Link>
            <Link className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Pacientes" to="/MedPacientesLista">
              <div className="relative shrink-0 size-[18px]" data-name="IconWrapper">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgIconwrapper5} />
              </div>
              <p className="[word-break:break-word] font-geist font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Pacientes</p>
            </Link>
            <Link className="bg-[rgba(37,99,235,0.15)] content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Monitoreo" to="/MedMonitoreoGridUci">
              <div className="relative shrink-0 size-[18px]" data-name="IconWrapper">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgIconwrapper6} />
              </div>
              <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[14px] text-white whitespace-nowrap">Monitoreo</p>
            </Link>
            <Link className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Alertas" to="/MedAlertasCentro">
              <div className="relative shrink-0 size-[18px]" data-name="IconWrapper">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgIconwrapper7} />
              </div>
              <p className="[word-break:break-word] font-geist font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Alertas</p>
            </Link>
            <Link className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Reportes" to="/MedReportesPanel">
              <div className="relative shrink-0 size-[18px]" data-name="IconWrapper">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgIconwrapper8} />
              </div>
              <p className="[word-break:break-word] font-geist font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Reportes</p>
            </Link>
            <Link className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Dispositivos" to="/MedDispositivosMonitores">
              <div className="relative shrink-0 size-[18px]" data-name="IconWrapper">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgIconwrapper9} />
              </div>
              <p className="[word-break:break-word] font-geist font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Dispositivos</p>
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
            <div className="relative shrink-0 size-[18px]" data-name="IconWrapper">
              <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgIconwrapper10} />
            </div>
          </Link>
        </div>
      </div>
      <div className="content-stretch flex flex-[1_0_0] flex-col h-full items-start min-w-px relative" data-name="main-container">
        <div className="bg-white border-[#e2e8f0] border-b border-solid content-stretch flex h-[72px] items-center justify-between px-[32px] relative shrink-0 w-full" data-name="top-bar">
          <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start leading-[normal] relative shrink-0 whitespace-nowrap" data-name="title-breadcrumb">
            <p className="font-geist font-medium relative shrink-0 text-[#64748b] text-[12px]">{`Dashboard > Central de Monitoreo > María González`}</p>
            <p className="font-geist font-extrabold relative shrink-0 text-[#0f172a] text-[20px]">Detalle de Paciente</p>
          </div>
          <div className="content-stretch flex gap-[20px] items-center relative shrink-0" data-name="right-actions">
            <div className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex gap-[8px] items-center px-[12px] py-[6px] relative rounded-[8px] shrink-0" data-name="search">
              <div className="relative shrink-0 size-[14px]" data-name="IconWrapper">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgIconwrapper11} />
              </div>
              <p className="[word-break:break-word] font-geist font-normal leading-[normal] relative shrink-0 text-[#64748b] text-[13px] whitespace-nowrap">Buscar paciente, cama...</p>
            </div>
            <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="datetime">
              <div className="relative shrink-0 size-[14px]" data-name="IconWrapper">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgIconwrapper12} />
              </div>
              <p className="[word-break:break-word] font-geist font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[13px] whitespace-nowrap">24 Oct 2025, 08:30</p>
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
        <div className="content-stretch flex flex-[1_0_0] flex-col gap-[20px] items-start min-h-px overflow-clip p-[32px] relative w-full" data-name="page-body">
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
              <Link className="content-stretch cursor-pointer flex gap-[10px] items-center relative shrink-0" data-name="action-buttons" to="/MedPacienteNotasSoapNueva">
                <div className="bg-[#2563eb] content-stretch flex gap-[6px] items-center px-[16px] py-[8px] relative rounded-[8px] shrink-0" data-name="btn-nueva-nota">
                  <div className="relative shrink-0 size-[14px]" data-name="IconWrapper">
                    <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgIconwrapper13} />
                  </div>
                  <p className="[word-break:break-word] font-geist font-bold leading-[normal] relative shrink-0 text-[13px] text-left text-white whitespace-nowrap">Nueva Nota SOAP</p>
                </div>
                <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex gap-[6px] items-center px-[16px] py-[8px] relative rounded-[8px] shrink-0" data-name="btn-reporte">
                  <div className="relative shrink-0 size-[14px]" data-name="IconWrapper">
                    <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgIconwrapper14} />
                  </div>
                  <p className="[word-break:break-word] font-geist font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] text-left whitespace-nowrap">Generar Reporte</p>
                </div>
              </Link>
            </div>
          </div>
          <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="tab-bar">
            <div className="content-stretch flex items-start overflow-clip px-[16px] py-[12px] relative shrink-0" data-name="tab-Resumen">
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Resumen</p>
            </div>
            <div className="content-stretch flex items-start overflow-clip px-[16px] py-[12px] relative shrink-0" data-name="tab-Historia Clínica">
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Historia Clínica</p>
            </div>
            <div className="border-[#2563eb] border-b-2 border-solid content-stretch flex items-start overflow-clip px-[16px] py-[12px] relative shrink-0" data-name="tab-Notas SOAP">
              <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#2563eb] text-[14px] whitespace-nowrap">Notas SOAP</p>
            </div>
            <div className="content-stretch flex items-start overflow-clip px-[16px] py-[12px] relative shrink-0" data-name="tab-Monitoreo">
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Monitoreo</p>
            </div>
            <div className="content-stretch flex items-start overflow-clip px-[16px] py-[12px] relative shrink-0" data-name="tab-Documentos">
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Documentos</p>
            </div>
          </div>
          <div className="content-stretch flex flex-[1_0_0] gap-[20px] items-start min-h-px relative w-full" data-name="content-layout">
            <div className="content-stretch flex flex-[1_0_0] flex-col h-full items-start min-w-px relative" data-name="left-column">
              <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-h-px p-[20px] relative rounded-[12px] w-full" data-name="soap-list-container">
                <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="list-header">
                  <p className="[word-break:break-word] font-geist font-extrabold leading-[normal] relative shrink-0 text-[#0f172a] text-[15px] whitespace-nowrap">Historial de Notas SOAP</p>
                  <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="search-filters">
                    <div className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex gap-[8px] items-center px-[12px] py-[6px] relative rounded-[8px] shrink-0" data-name="search">
                      <div className="relative shrink-0 size-[12px]" data-name="IconWrapper">
                        <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgIconwrapper15} />
                      </div>
                      <p className="[word-break:break-word] font-geist font-normal leading-[normal] relative shrink-0 text-[#64748b] text-[12px] whitespace-nowrap">Buscar notas...</p>
                    </div>
                    <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex gap-[6px] items-center px-[12px] py-[6px] relative rounded-[8px] shrink-0" data-name="btn-filter">
                      <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0 size-[12px]" data-name="IconWrapper">
                        <div className="relative shrink-0 size-[12px]" data-name="sliders">
                          <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgSliders} />
                        </div>
                      </div>
                      <p className="[word-break:break-word] font-geist font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[12px] whitespace-nowrap">Filtrar</p>
                    </div>
                  </div>
                </div>
                <div className="content-stretch flex flex-[1_0_0] flex-col gap-[10px] items-start min-h-px overflow-clip relative w-full" data-name="soap-rows">
                  <Link className="bg-white border-[#2563eb] border-[1.5px] border-solid content-stretch cursor-pointer drop-shadow-[0px_2px_3px_rgba(0,0,0,0.02)] flex gap-[16px] items-center p-[16px] relative rounded-[10px] shrink-0 w-full" data-name="soap-note-row" to="/MedPacienteNotasSoapDetalle">
                    <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start leading-[normal] relative shrink-0 text-left w-[150px] whitespace-nowrap" data-name="date-doc">
                      <p className="font-geist font-bold relative shrink-0 text-[#0f172a] text-[13px]">24 Oct 2025, 09:15</p>
                      <p className="font-geist font-normal overflow-hidden relative shrink-0 text-[#64748b] text-[12px] text-ellipsis">Dr. Carlos Méndez</p>
                    </div>
                    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px relative" data-name="preview-col">
                      <p className="[word-break:break-word] font-geist font-normal leading-[0] overflow-hidden relative shrink-0 text-[#0f172a] text-[13px] text-ellipsis text-left w-full whitespace-nowrap"><span className="font-geist font-bold leading-[1.4] text-[#2563eb]">{`S: `}</span><span className="leading-[1.4]">Disnea progresiva y dificultad para respirar en reposo. Refiere empeoramiento desde anoche.</span></p>
                    </div>
                    <div className="bg-[#ecfdf5] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[6px] shrink-0" data-name="status-badge">
                      <p className="[word-break:break-word] font-geist font-bold leading-[normal] relative shrink-0 text-[#10b981] text-[11px] text-left whitespace-nowrap">Completada</p>
                    </div>
                    <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0 size-[14px]" data-name="IconWrapper">
                      <div className="relative shrink-0 size-[14px]" data-name="chevron-right">
                        <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgChevronRight} />
                      </div>
                    </div>
                  </Link>
                  <div className="bg-white border border-[#e2e8f0] border-solid content-stretch drop-shadow-[0px_2px_3px_rgba(0,0,0,0.02)] flex gap-[16px] items-center p-[16px] relative rounded-[10px] shrink-0 w-full" data-name="soap-note-row">
                    <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start leading-[normal] relative shrink-0 w-[150px] whitespace-nowrap" data-name="date-doc">
                      <p className="font-geist font-bold relative shrink-0 text-[#0f172a] text-[13px]">22 Oct 2025, 14:30</p>
                      <p className="font-geist font-normal overflow-hidden relative shrink-0 text-[#64748b] text-[12px] text-ellipsis">Dra. Ana Rodríguez</p>
                    </div>
                    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px relative" data-name="preview-col">
                      <p className="[word-break:break-word] font-geist font-normal leading-[0] overflow-hidden relative shrink-0 text-[#0f172a] text-[13px] text-ellipsis w-full whitespace-nowrap"><span className="font-geist font-bold leading-[1.4] text-[#2563eb]">{`S: `}</span><span className="leading-[1.4]">Paciente refiere mejoría parcial, menos fatiga al sentarse, pero persiste tos seca esporádica.</span></p>
                    </div>
                    <div className="bg-[#ecfdf5] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[6px] shrink-0" data-name="status-badge">
                      <p className="[word-break:break-word] font-geist font-bold leading-[normal] relative shrink-0 text-[#10b981] text-[11px] whitespace-nowrap">Completada</p>
                    </div>
                    <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0 size-[14px]" data-name="IconWrapper">
                      <div className="relative shrink-0 size-[14px]" data-name="chevron-right">
                        <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgChevronRight2} />
                      </div>
                    </div>
                  </div>
                  <div className="bg-white border border-[#e2e8f0] border-solid content-stretch drop-shadow-[0px_2px_3px_rgba(0,0,0,0.02)] flex gap-[16px] items-center p-[16px] relative rounded-[10px] shrink-0 w-full" data-name="soap-note-row">
                    <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start leading-[normal] relative shrink-0 w-[150px] whitespace-nowrap" data-name="date-doc">
                      <p className="font-geist font-bold relative shrink-0 text-[#0f172a] text-[13px]">18 Oct 2025, 10:00</p>
                      <p className="font-geist font-normal overflow-hidden relative shrink-0 text-[#64748b] text-[12px] text-ellipsis">Dr. Carlos Méndez</p>
                    </div>
                    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px relative" data-name="preview-col">
                      <p className="[word-break:break-word] font-geist font-normal leading-[0] overflow-hidden relative shrink-0 text-[#0f172a] text-[13px] text-ellipsis w-full whitespace-nowrap"><span className="font-geist font-bold leading-[1.4] text-[#2563eb]">{`S: `}</span><span className="leading-[1.4]">Dolor torácico intermitente al esfuerzo moderado. No refiere mareos ni síncope reciente.</span></p>
                    </div>
                    <div className="bg-[#ecfdf5] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[6px] shrink-0" data-name="status-badge">
                      <p className="[word-break:break-word] font-geist font-bold leading-[normal] relative shrink-0 text-[#10b981] text-[11px] whitespace-nowrap">Completada</p>
                    </div>
                    <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0 size-[14px]" data-name="IconWrapper">
                      <div className="relative shrink-0 size-[14px]" data-name="chevron-right">
                        <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgChevronRight2} />
                      </div>
                    </div>
                  </div>
                  <div className="bg-white border border-[#e2e8f0] border-solid content-stretch drop-shadow-[0px_2px_3px_rgba(0,0,0,0.02)] flex gap-[16px] items-center p-[16px] relative rounded-[10px] shrink-0 w-full" data-name="soap-note-row">
                    <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start leading-[normal] relative shrink-0 w-[150px] whitespace-nowrap" data-name="date-doc">
                      <p className="font-geist font-bold relative shrink-0 text-[#0f172a] text-[13px]">15 Oct 2025, 08:45</p>
                      <p className="font-geist font-normal overflow-hidden relative shrink-0 text-[#64748b] text-[12px] text-ellipsis">Dra. Ana Rodríguez</p>
                    </div>
                    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px relative" data-name="preview-col">
                      <p className="[word-break:break-word] font-geist font-normal leading-[0] overflow-hidden relative shrink-0 text-[#0f172a] text-[13px] text-ellipsis w-full whitespace-nowrap"><span className="font-geist font-bold leading-[1.4] text-[#2563eb]">{`S: `}</span><span className="leading-[1.4]">Disnea severa durante ingreso inicial, ortopnea marcada, sibilancias inspiratorias.</span></p>
                    </div>
                    <div className="bg-[#ecfdf5] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[6px] shrink-0" data-name="status-badge">
                      <p className="[word-break:break-word] font-geist font-bold leading-[normal] relative shrink-0 text-[#10b981] text-[11px] whitespace-nowrap">Completada</p>
                    </div>
                    <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0 size-[14px]" data-name="IconWrapper">
                      <div className="relative shrink-0 size-[14px]" data-name="chevron-right">
                        <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgChevronRight2} />
                      </div>
                    </div>
                  </div>
                  <div className="bg-white border border-[#e2e8f0] border-solid content-stretch drop-shadow-[0px_2px_3px_rgba(0,0,0,0.02)] flex gap-[16px] items-center p-[16px] relative rounded-[10px] shrink-0 w-full" data-name="soap-note-row">
                    <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start leading-[normal] relative shrink-0 w-[150px] whitespace-nowrap" data-name="date-doc">
                      <p className="font-geist font-bold relative shrink-0 text-[#0f172a] text-[13px]">10 Oct 2025, 16:20</p>
                      <p className="font-geist font-normal overflow-hidden relative shrink-0 text-[#64748b] text-[12px] text-ellipsis">Dr. Luis Peralta</p>
                    </div>
                    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px relative" data-name="preview-col">
                      <p className="[word-break:break-word] font-geist font-normal leading-[0] overflow-hidden relative shrink-0 text-[#0f172a] text-[13px] text-ellipsis w-full whitespace-nowrap"><span className="font-geist font-bold leading-[1.4] text-[#2563eb]">{`S: `}</span><span className="leading-[1.4]">Seguimiento de rutina pre-admisión. Reporta hinchazón en extremidades inferiores.</span></p>
                    </div>
                    <div className="bg-[#fef3c7] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[6px] shrink-0" data-name="status-badge">
                      <p className="[word-break:break-word] font-geist font-bold leading-[normal] relative shrink-0 text-[#f59e0b] text-[11px] whitespace-nowrap">En progreso</p>
                    </div>
                    <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0 size-[14px]" data-name="IconWrapper">
                      <div className="relative shrink-0 size-[14px]" data-name="chevron-right">
                        <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgChevronRight2} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="content-stretch flex flex-col h-full items-start relative shrink-0 w-[380px]" data-name="right-column">
              <div className="bg-white border border-[#e2e8f0] border-solid content-stretch drop-shadow-[0px_4px_6px_rgba(0,0,0,0.02)] flex flex-col gap-[14px] items-start p-[20px] relative rounded-[12px] shrink-0 w-full" data-name="soap-card">
                <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="soap-header">
                  <p className="[word-break:break-word] font-geist font-extrabold leading-[normal] relative shrink-0 text-[#0f172a] text-[15px] whitespace-nowrap">Detalle de Nota Seleccionada</p>
                  <div className="bg-[#f8fafc] content-stretch flex items-start px-[8px] py-[3px] relative rounded-[6px] shrink-0" data-name="soap-date-badge">
                    <p className="[word-break:break-word] font-geist font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[11px] whitespace-nowrap">24 Oct 2025, 09:15</p>
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
                    <img className="block max-w-none size-full" alt="" src={imgSoapCardLine2} />
                  </div>
                </div>
                <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="soap-sections">
                  <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="soap-s">
                    <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="soap-badge-container">
                      <div className="bg-[#eff6ff] content-stretch flex items-start px-[6px] py-[2px] relative rounded-[4px] shrink-0" data-name="badge">
                        <p className="[word-break:break-word] font-geist font-extrabold leading-[normal] relative shrink-0 text-[#2563eb] text-[11px] whitespace-nowrap">S</p>
                      </div>
                      <p className="[word-break:break-word] font-geist font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[11px] whitespace-nowrap">Subjetivo</p>
                    </div>
                    <p className="[word-break:break-word] font-geist font-normal leading-[1.4] min-w-full relative shrink-0 text-[#0f172a] text-[13px] w-[min-content]">Disnea progresiva y dificultad para respirar en reposo. Paciente refiere empeoramiento de la fatiga al realizar movimientos mínimos y ortopnea marcada durante la noche anterior.</p>
                  </div>
                  <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="soap-o">
                    <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="soap-badge-container">
                      <div className="bg-[#fef3c7] content-stretch flex items-start px-[6px] py-[2px] relative rounded-[4px] shrink-0" data-name="badge">
                        <p className="[word-break:break-word] font-geist font-extrabold leading-[normal] relative shrink-0 text-[#f59e0b] text-[11px] whitespace-nowrap">O</p>
                      </div>
                      <p className="[word-break:break-word] font-geist font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[11px] whitespace-nowrap">Objetivo</p>
                    </div>
                    <p className="[word-break:break-word] font-geist font-normal leading-[1.4] min-w-full relative shrink-0 text-[#0f172a] text-[13px] w-[min-content]">Frecuencia Cardíaca 134 lpm, SpO2 89% con aire ambiente, Temperatura 38.5°C. Se auscultan estertores crepitantes bilaterales en bases pulmonares. Presión arterial de 140/90 mmHg.</p>
                  </div>
                  <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="soap-a">
                    <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="soap-badge-container">
                      <div className="bg-[#fef2f2] content-stretch flex items-start px-[6px] py-[2px] relative rounded-[4px] shrink-0" data-name="badge">
                        <p className="[word-break:break-word] font-geist font-extrabold leading-[normal] relative shrink-0 text-[#ef4444] text-[11px] whitespace-nowrap">A</p>
                      </div>
                      <p className="[word-break:break-word] font-geist font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[11px] whitespace-nowrap">Análisis</p>
                    </div>
                    <p className="[word-break:break-word] font-geist font-normal leading-[1.4] min-w-full relative shrink-0 text-[#0f172a] text-[13px] w-[min-content]">Paciente con cuadro clínico compatible con descompensación aguda de Insuficiencia Cardíaca Congestiva (ICC) secundaria a probable proceso infeccioso respiratorio en evolución.</p>
                  </div>
                  <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="soap-p">
                    <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="soap-badge-container">
                      <div className="bg-[#ecfdf5] content-stretch flex items-start px-[6px] py-[2px] relative rounded-[4px] shrink-0" data-name="badge">
                        <p className="[word-break:break-word] font-geist font-extrabold leading-[normal] relative shrink-0 text-[#10b981] text-[11px] whitespace-nowrap">P</p>
                      </div>
                      <p className="[word-break:break-word] font-geist font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[11px] whitespace-nowrap">Plan</p>
                    </div>
                    <p className="[word-break:break-word] font-geist font-normal leading-[1.4] min-w-full relative shrink-0 text-[#0f172a] text-[13px] w-[min-content]">{`Ajustar dosis de diuréticos intravenosos, iniciar aporte de oxígeno por mascarilla para mantener SpO2 > 92%, solicitar radiografía de tórax urgente y paraclínicos inflamatorios.`}</p>
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
