// Pantalla "med/paciente/interrogatorio-aparatos" (Figma node 183:6) — generada desde el diseño original de Figma.
import { Link, useNavigate } from 'react-router-dom';
import imgAccordionRespiratorioLine from '../../assets/accordion-respiratorio-line.svg';
import imgActivity3 from '../../assets/activity-3.svg';
import imgAvatar5Png from '../../assets/avatar-5.png';
import imgBackArrow from '../../assets/back-arrow.svg';
import imgBone from '../../assets/bone.svg';
import imgBrain from '../../assets/brain.svg';
import imgBtnNuevaNotaVector from '../../assets/btn-nueva-nota-vector.svg';
import imgBtnReporteVector from '../../assets/btn-reporte-vector.svg';
import imgChevronDown2 from '../../assets/chevron-down-2.svg';
import imgCircleX from '../../assets/circle-x.svg';
import imgDoctorFooterLine2 from '../../assets/doctor-footer-line-2.svg';
import imgDroplet from '../../assets/droplet.svg';
import imgHelpIconEllipse from '../../assets/help-icon-ellipse.svg';
import imgIconAlertas from '../../assets/icon-alertas.svg';
import imgIconDashboard from '../../assets/icon-dashboard.svg';
import imgIconDispositivos from '../../assets/icon-dispositivos.svg';
import imgIconMonitoreo from '../../assets/icon-monitoreo.svg';
import imgIconPacientes from '../../assets/icon-pacientes.svg';
import imgIconReportes from '../../assets/icon-reportes.svg';
import imgIconWrapper from '../../assets/icon-wrapper.svg';
import imgIconwrapper2 from '../../assets/iconwrapper-2.svg';
import imgLogout from '../../assets/logout.svg';
import imgPatientAvatar3Png from '../../assets/patient-avatar-3.png';
import imgSparkles from '../../assets/sparkles.svg';

export default function MedPacienteInterrogatorioAparatos() {
  const navigate = useNavigate();
  return (
    <div className="bg-[#f8fafc] content-stretch flex h-[1240px] items-start overflow-clip relative shrink-0 w-[1440px]" data-name="med/paciente/interrogatorio-aparatos">
      <div className="bg-[#0f172a] border-[#1e293b] border-r border-solid content-stretch flex flex-col h-full items-start justify-between px-[16px] py-[24px] relative shrink-0 w-[240px]" data-name="sidebar">
        <div className="content-stretch flex flex-col gap-[32px] items-start relative shrink-0 w-full" data-name="top-group">
          <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-name="brand">
            <div className="bg-[#2563eb] content-stretch flex flex-col items-center justify-center relative rounded-[8px] shrink-0 size-[32px]" data-name="logo-mark">
              <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[14px] text-white whitespace-nowrap">S</p>
            </div>
            <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px relative whitespace-nowrap" data-name="wordmark">
              <p className="font-jakarta font-extrabold relative shrink-0 text-[16px] text-white">SIAPPC</p>
              <p className="font-jakarta font-semibold overflow-hidden relative shrink-0 text-[#64748b] text-[10px] text-ellipsis uppercase">CUIDADO CRÍTICO</p>
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="menu">
            <Link className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Dashboard" to="/MedDashboardPrincipal">
              <div className="relative shrink-0 size-[18px]" data-name="icon-Dashboard">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgIconDashboard} />
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Dashboard</p>
            </Link>
            <Link className="bg-[rgba(37,99,235,0.15)] content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Pacientes" to="/MedPacientesLista">
              <div className="relative shrink-0 size-[18px]" data-name="icon-Pacientes">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgIconPacientes} />
              </div>
              <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[14px] text-white whitespace-nowrap">Pacientes</p>
            </Link>
            <Link className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Monitoreo" to="/MedMonitoreoGridUci">
              <div className="relative shrink-0 size-[18px]" data-name="icon-Monitoreo">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgIconMonitoreo} />
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Monitoreo</p>
            </Link>
            <Link className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Alertas" to="/MedAlertasCentro">
              <div className="relative shrink-0 size-[18px]" data-name="icon-Alertas">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgIconAlertas} />
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Alertas</p>
            </Link>
            <Link className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Reportes" to="/MedReportesPanel">
              <div className="relative shrink-0 size-[18px]" data-name="icon-Reportes">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgIconReportes} />
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Reportes</p>
            </Link>
            <Link className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Dispositivos" to="/MedDispositivosMonitores">
              <div className="relative shrink-0 size-[18px]" data-name="icon-Dispositivos">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgIconDispositivos} />
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Dispositivos</p>
            </Link>
          </div>
        </div>
        <Link className="absolute left-[20px] opacity-25 size-[18px] top-[1132px]" data-name="help-icon" to="/MedAyudaSoporte">
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
              <img className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[20px] size-full" alt="" src={imgAvatar5Png} />
            </div>
            <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px relative whitespace-nowrap" data-name="user-info">
              <p className="font-jakarta font-bold overflow-hidden relative shrink-0 text-[13px] text-ellipsis text-white">Dr. Roberto Silva</p>
              <p className="font-jakarta font-medium overflow-hidden relative shrink-0 text-[#64748b] text-[11px] text-ellipsis">Médico Especialista</p>
            </div>
            <div className="relative shrink-0 size-[18px]" data-name="logout">
              <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgLogout} />
            </div>
          </Link>
        </div>
      </div>
      <div className="content-stretch flex flex-[1_0_0] flex-col h-full items-start min-w-px relative" data-name="main-container">
        <div className="bg-white border-[#e2e8f0] border-b border-solid content-stretch flex h-[72px] items-center justify-between px-[32px] relative shrink-0 w-full" data-name="top-bar">
          <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start leading-[normal] relative shrink-0 whitespace-nowrap" data-name="title-breadcrumb">
            <p className="font-jakarta font-medium relative shrink-0 text-[#64748b] text-[12px]">{`SIAPPC > Pacientes > María González > Historia Clínica > Interrogatorio`}</p>
            <p className="font-jakarta font-extrabold relative shrink-0 text-[#0f172a] text-[20px]">Interrogatorio por Aparatos y Sistemas</p>
          </div>
          <div className="content-stretch flex gap-[20px] items-center overflow-clip relative shrink-0" data-name="right-actions">
            <div className="content-stretch flex items-center relative shrink-0" data-name="perfil-nav">
              <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex gap-[6px] items-center px-[12px] py-[8px] relative rounded-[8px] shrink-0 cursor-pointer" data-name="back-btn" role="button" onClick={() => navigate(-1)}>
                <div className="relative shrink-0 size-[14px]" data-name="back-arrow">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgBackArrow} />
                </div>
                <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] whitespace-nowrap">Volver</p>
              </div>
            </div>
            <Link className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex items-center justify-center relative rounded-[18px] shrink-0 size-[36px]" data-name="notification-bell" to="/MedNotificacionesCentro">
              <div className="relative shrink-0 size-[18px]" data-name="IconWrapper">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgIconwrapper2} />
              </div>
              <div className="absolute bg-[#ef4444] content-stretch flex items-center justify-center right-[-3px] rounded-[8px] size-[16px] top-[-3px]" data-name="red-badge">
                <p className="[word-break:break-word] font-geist font-extrabold leading-[normal] relative shrink-0 text-[10px] text-white whitespace-nowrap">3</p>
              </div>
            </Link>
          </div>
        </div>
        <div className="content-stretch flex flex-col gap-[20px] items-start p-[32px] relative shrink-0 w-full" data-name="page-body">
          <div className="bg-white border border-[#e2e8f0] border-solid content-stretch drop-shadow-[0px_4px_6px_rgba(0,0,0,0.02)] flex flex-col items-start p-[20px] relative rounded-[12px] shrink-0 w-full" data-name="patient-header-card">
            <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="patient-header-top">
              <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="patient-info-group">
                <div className="relative rounded-[28px] shrink-0 size-[56px]" data-name="patient-avatar">
                  <img className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[28px] size-full" alt="" src={imgPatientAvatar3Png} />
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
                  <div className="relative shrink-0 size-[14px]" data-name="Vector">
                    <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgBtnNuevaNotaVector} />
                  </div>
                  <p className="[word-break:break-word] font-geist font-bold leading-[normal] relative shrink-0 text-[13px] text-white whitespace-nowrap">Nueva Nota SOAP</p>
                </div>
                <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex gap-[6px] items-center px-[16px] py-[8px] relative rounded-[8px] shrink-0" data-name="btn-reporte">
                  <div className="relative shrink-0 size-[14px]" data-name="Vector">
                    <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgBtnReporteVector} />
                  </div>
                  <p className="[word-break:break-word] font-geist font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] whitespace-nowrap">Generar Reporte</p>
                </div>
              </div>
            </div>
          </div>
          <div className="border-[#e2e8f0] border-b border-solid content-stretch flex gap-[8px] h-[42px] items-start relative shrink-0 w-full" data-name="tab-bar">
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
          <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="accordion-sections">
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[16px] items-start p-[20px] relative rounded-[12px] shrink-0 w-full" data-name="accordion-respiratorio">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="accordion-header">
                <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="header-title">
                  <div className="bg-[#eff6ff] content-stretch flex items-center justify-center relative rounded-[6px] shrink-0 size-[24px]" data-name="icon-wrapper">
                    <div className="relative shrink-0 size-[14px]" data-name="circle-x">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgCircleX} />
                    </div>
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[16px] whitespace-nowrap">Aparato Respiratorio</p>
                </div>
                <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="header-actions">
                  <div className="bg-[#fef3c7] content-stretch flex items-start px-[12px] py-[4px] relative rounded-[20px] shrink-0" data-name="status-badge">
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#f59e0b] text-[12px] whitespace-nowrap">Con hallazgos</p>
                  </div>
                  <div className="bg-[#f1f5f9] border border-[#dbeafe] border-solid content-stretch flex items-center justify-center relative rounded-[14px] shrink-0 size-[28px]" data-name="collapse-icon">
                    <div className="relative shrink-0 size-[16px]" data-name="chevron-up">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgChevronDown2} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-0 relative shrink-0 w-full" data-name="Line">
                <div className="absolute inset-[-1px_0_0_0]">
                  <img className="block max-w-none size-full" alt="" src={imgAccordionRespiratorioLine} />
                </div>
              </div>
              <div className="content-start flex flex-wrap gap-[8px_16px] items-start relative shrink-0 w-full" data-name="Frame">
                <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Frame">
                  <div className="bg-[#2563eb] relative rounded-[4px] shrink-0 size-[18px]" data-name="Rectangle" />
                  <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#0f172a] text-[14px] whitespace-nowrap">Disnea</p>
                </div>
                <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Frame">
                  <div className="bg-[#2563eb] relative rounded-[4px] shrink-0 size-[18px]" data-name="Rectangle" />
                  <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#0f172a] text-[14px] whitespace-nowrap">Tos</p>
                </div>
                <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Frame">
                  <div className="border border-[#e2e8f0] border-solid relative rounded-[4px] shrink-0 size-[18px]" data-name="Rectangle" />
                  <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Expectoración</p>
                </div>
                <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Frame">
                  <div className="border border-[#e2e8f0] border-solid relative rounded-[4px] shrink-0 size-[18px]" data-name="Rectangle" />
                  <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Hemoptisis</p>
                </div>
                <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Frame">
                  <div className="bg-[#2563eb] relative rounded-[4px] shrink-0 size-[18px]" data-name="Rectangle" />
                  <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#0f172a] text-[14px] whitespace-nowrap">Dolor torácico</p>
                </div>
                <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Frame">
                  <div className="bg-[#2563eb] relative rounded-[4px] shrink-0 size-[18px]" data-name="Rectangle" />
                  <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#0f172a] text-[14px] whitespace-nowrap">Sibilancias</p>
                </div>
              </div>
              <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="observations">
                <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[12px] whitespace-nowrap">OBSERVACIONES</p>
                <div className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex items-start p-[12px] relative rounded-[8px] shrink-0 w-full" data-name="textarea">
                  <p className="[word-break:break-word] flex-[1_0_0] font-jakarta font-normal leading-[normal] min-w-px relative text-[#0f172a] text-[14px]">Paciente refiere disnea de medianos esfuerzos que progresa a pequeños esfuerzos. Tos esporádica no productiva, acompañada de sibilancias inspiratorias ocasionales y dolor torácico opresivo leve.</p>
                </div>
              </div>
            </div>
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[16px] items-start p-[20px] relative rounded-[12px] shrink-0 w-full" data-name="accordion-cardiovascular">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="accordion-header">
                <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="header-title">
                  <div className="relative shrink-0 size-[24px]" data-name="icon-wrapper">
                    <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgIconWrapper} />
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[16px] whitespace-nowrap">Aparato Cardiovascular</p>
                </div>
                <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="header-actions">
                  <div className="bg-[#fef3c7] content-stretch flex items-start px-[12px] py-[4px] relative rounded-[20px] shrink-0" data-name="status-badge">
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#f59e0b] text-[12px] whitespace-nowrap">Con hallazgos</p>
                  </div>
                  <div className="bg-[#f1f5f9] border border-[#dbeafe] border-solid content-stretch flex items-center justify-center relative rounded-[14px] shrink-0 size-[28px]" data-name="collapse-icon">
                    <div className="relative shrink-0 size-[16px]" data-name="chevron-up">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgChevronDown2} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-0 relative shrink-0 w-full" data-name="Line">
                <div className="absolute inset-[-1px_0_0_0]">
                  <img className="block max-w-none size-full" alt="" src={imgAccordionRespiratorioLine} />
                </div>
              </div>
              <div className="content-start flex flex-wrap gap-[8px_16px] items-start relative shrink-0 w-full" data-name="Frame">
                <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Frame">
                  <div className="bg-[#2563eb] relative rounded-[4px] shrink-0 size-[18px]" data-name="Rectangle" />
                  <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#0f172a] text-[14px] whitespace-nowrap">Dolor precordial</p>
                </div>
                <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Frame">
                  <div className="bg-[#2563eb] relative rounded-[4px] shrink-0 size-[18px]" data-name="Rectangle" />
                  <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#0f172a] text-[14px] whitespace-nowrap">Palpitaciones</p>
                </div>
                <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Frame">
                  <div className="bg-[#2563eb] relative rounded-[4px] shrink-0 size-[18px]" data-name="Rectangle" />
                  <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#0f172a] text-[14px] whitespace-nowrap">Edema</p>
                </div>
                <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Frame">
                  <div className="bg-[#2563eb] relative rounded-[4px] shrink-0 size-[18px]" data-name="Rectangle" />
                  <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#0f172a] text-[14px] whitespace-nowrap">Disnea de esfuerzo</p>
                </div>
                <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Frame">
                  <div className="border border-[#e2e8f0] border-solid relative rounded-[4px] shrink-0 size-[18px]" data-name="Rectangle" />
                  <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Claudicación</p>
                </div>
              </div>
              <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="observations">
                <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[12px] whitespace-nowrap">OBSERVACIONES</p>
                <div className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex items-start p-[12px] relative rounded-[8px] shrink-0 w-full" data-name="textarea">
                  <p className="[word-break:break-word] flex-[1_0_0] font-jakarta font-normal leading-[normal] min-w-px relative text-[#0f172a] text-[14px]">Se constata edema bilateral de miembros inferiores, grado II. Paciente refiere palpitaciones recurrentes tras mínimos esfuerzos y ortopnea.</p>
                </div>
              </div>
            </div>
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-center justify-between p-[16px] relative rounded-[8px] shrink-0 w-full" data-name="accordion-digestivo">
              <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="section-title">
                <div className="bg-[#eff6ff] content-stretch flex items-center justify-center relative rounded-[6px] shrink-0 size-[24px]" data-name="icon-wrapper">
                  <div className="relative shrink-0 size-[14px]" data-name="circle-x">
                    <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgCircleX} />
                  </div>
                </div>
                <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[14px] whitespace-nowrap">Aparato Digestivo</p>
              </div>
              <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="right-group">
                <div className="bg-[#ecfdf5] content-stretch flex items-start px-[10px] py-[4px] relative rounded-[20px] shrink-0" data-name="status-badge">
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#10b981] text-[12px] whitespace-nowrap">Normal</p>
                </div>
                <div className="bg-[#f1f5f9] border border-[#dbeafe] border-solid content-stretch flex items-center justify-center relative rounded-[14px] shrink-0 size-[28px]" data-name="collapse-icon">
                  <div className="flex items-center justify-center relative shrink-0">
                    <div className="flex-none rotate-180">
                      <div className="relative size-[16px]" data-name="chevron-down">
                        <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgChevronDown2} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-center justify-between p-[16px] relative rounded-[8px] shrink-0 w-full" data-name="accordion-genitourinario">
              <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="section-title">
                <div className="bg-[#eff6ff] content-stretch flex items-center justify-center relative rounded-[6px] shrink-0 size-[24px]" data-name="icon-wrapper">
                  <div className="relative shrink-0 size-[14px]" data-name="droplet">
                    <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgDroplet} />
                  </div>
                </div>
                <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[14px] whitespace-nowrap">Aparato Genitourinario</p>
              </div>
              <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="right-group">
                <div className="bg-[#ecfdf5] content-stretch flex items-start px-[10px] py-[4px] relative rounded-[20px] shrink-0" data-name="status-badge">
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#10b981] text-[12px] whitespace-nowrap">Normal</p>
                </div>
                <div className="bg-[#f1f5f9] border border-[#dbeafe] border-solid content-stretch flex items-center justify-center relative rounded-[14px] shrink-0 size-[28px]" data-name="collapse-icon">
                  <div className="flex items-center justify-center relative shrink-0">
                    <div className="flex-none rotate-180">
                      <div className="relative size-[16px]" data-name="chevron-down">
                        <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgChevronDown2} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-center justify-between p-[16px] relative rounded-[8px] shrink-0 w-full" data-name="accordion-musculo">
              <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="section-title">
                <div className="bg-[#eff6ff] content-stretch flex items-center justify-center relative rounded-[6px] shrink-0 size-[24px]" data-name="icon-wrapper">
                  <div className="relative shrink-0 size-[14px]" data-name="bone">
                    <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgBone} />
                  </div>
                </div>
                <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[14px] whitespace-nowrap">Sistema Músculo-esquelético</p>
              </div>
              <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="right-group">
                <div className="bg-[#ecfdf5] content-stretch flex items-start px-[10px] py-[4px] relative rounded-[20px] shrink-0" data-name="status-badge">
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#10b981] text-[12px] whitespace-nowrap">Normal</p>
                </div>
                <div className="bg-[#f1f5f9] border border-[#dbeafe] border-solid content-stretch flex items-center justify-center relative rounded-[14px] shrink-0 size-[28px]" data-name="collapse-icon">
                  <div className="flex items-center justify-center relative shrink-0">
                    <div className="flex-none rotate-180">
                      <div className="relative size-[16px]" data-name="chevron-down">
                        <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgChevronDown2} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-center justify-between p-[16px] relative rounded-[8px] shrink-0 w-full" data-name="accordion-neurologico">
              <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="section-title">
                <div className="bg-[#eff6ff] content-stretch flex items-center justify-center relative rounded-[6px] shrink-0 size-[24px]" data-name="icon-wrapper">
                  <div className="relative shrink-0 size-[14px]" data-name="brain">
                    <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgBrain} />
                  </div>
                </div>
                <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[14px] whitespace-nowrap">Sistema Neurológico</p>
              </div>
              <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="right-group">
                <div className="bg-[#ecfdf5] content-stretch flex items-start px-[10px] py-[4px] relative rounded-[20px] shrink-0" data-name="status-badge">
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#10b981] text-[12px] whitespace-nowrap">Normal</p>
                </div>
                <div className="bg-[#f1f5f9] border border-[#dbeafe] border-solid content-stretch flex items-center justify-center relative rounded-[14px] shrink-0 size-[28px]" data-name="collapse-icon">
                  <div className="flex items-center justify-center relative shrink-0">
                    <div className="flex-none rotate-180">
                      <div className="relative size-[16px]" data-name="chevron-down">
                        <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgChevronDown2} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-center justify-between p-[16px] relative rounded-[8px] shrink-0 w-full" data-name="accordion-endocrino">
              <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="section-title">
                <div className="bg-[#eff6ff] content-stretch flex items-center justify-center relative rounded-[6px] shrink-0 size-[24px]" data-name="icon-wrapper">
                  <div className="relative shrink-0 size-[14px]" data-name="activity">
                    <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgActivity3} />
                  </div>
                </div>
                <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[14px] whitespace-nowrap">Sistema Endocrino</p>
              </div>
              <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="right-group">
                <div className="bg-[#ecfdf5] content-stretch flex items-start px-[10px] py-[4px] relative rounded-[20px] shrink-0" data-name="status-badge">
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#10b981] text-[12px] whitespace-nowrap">Normal</p>
                </div>
                <div className="bg-[#f1f5f9] border border-[#dbeafe] border-solid content-stretch flex items-center justify-center relative rounded-[14px] shrink-0 size-[28px]" data-name="collapse-icon">
                  <div className="flex items-center justify-center relative shrink-0">
                    <div className="flex-none rotate-180">
                      <div className="relative size-[16px]" data-name="chevron-down">
                        <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgChevronDown2} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-center justify-between p-[16px] relative rounded-[8px] shrink-0 w-full" data-name="accordion-piel">
              <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="section-title">
                <div className="bg-[#eff6ff] content-stretch flex items-center justify-center relative rounded-[6px] shrink-0 size-[24px]" data-name="icon-wrapper">
                  <div className="relative shrink-0 size-[14px]" data-name="sparkles">
                    <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgSparkles} />
                  </div>
                </div>
                <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[14px] whitespace-nowrap">Piel y Anexos</p>
              </div>
              <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="right-group">
                <div className="bg-[#ecfdf5] content-stretch flex items-start px-[10px] py-[4px] relative rounded-[20px] shrink-0" data-name="status-badge">
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#10b981] text-[12px] whitespace-nowrap">Normal</p>
                </div>
                <div className="bg-[#f1f5f9] border border-[#dbeafe] border-solid content-stretch flex items-center justify-center relative rounded-[14px] shrink-0 size-[28px]" data-name="collapse-icon">
                  <div className="flex items-center justify-center relative shrink-0">
                    <div className="flex-none rotate-180">
                      <div className="relative size-[16px]" data-name="chevron-down">
                        <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgChevronDown2} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="content-stretch flex items-start justify-end pt-[12px] relative shrink-0 w-full" data-name="bottom-actions-row">
            <div className="bg-[#2563eb] content-stretch flex items-start px-[24px] py-[12px] relative rounded-[8px] shrink-0" data-name="btn-save">
              <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[14px] text-white whitespace-nowrap">Guardar Interrogatorio</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
