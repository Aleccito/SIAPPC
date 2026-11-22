// Pantalla "med/paciente/historia-clinica-general" (Figma node 45:505) — generada desde el diseño original de Figma.
import { Link, useNavigate } from 'react-router-dom';
import imgActivity from '../../assets/activity.svg';
import imgActivity2 from '../../assets/activity-2.svg';
import imgArrowLeft3 from '../../assets/arrow-left-3.svg';
import imgAvatar4Png from '../../assets/avatar-4.png';
import imgBell from '../../assets/bell.svg';
import imgChevronDown2 from '../../assets/chevron-down-2.svg';
import imgClipboard from '../../assets/clipboard.svg';
import imgClipboardList from '../../assets/clipboard-list.svg';
import imgCpu from '../../assets/cpu.svg';
import imgDoctorFooterLine3 from '../../assets/doctor-footer-line-3.svg';
import imgFileText from '../../assets/file-text.svg';
import imgFileText2 from '../../assets/file-text-2.svg';
import imgFileText3 from '../../assets/file-text-3.svg';
import imgHeart from '../../assets/heart.svg';
import imgHelpIconEllipse from '../../assets/help-icon-ellipse.svg';
import imgHome from '../../assets/home.svg';
import imgIconwrapper from '../../assets/iconwrapper.svg';
import imgLayoutDashboard from '../../assets/layout-dashboard.svg';
import imgLogOut from '../../assets/log-out.svg';
import imgPatientAvatarPng from '../../assets/patient-avatar.png';
import imgPill from '../../assets/pill.svg';
import imgSectionDatosLine from '../../assets/section-datos-line.svg';
import imgShieldAlert from '../../assets/shield-alert.svg';
import imgStethoscope from '../../assets/stethoscope.svg';
import imgUser from '../../assets/user.svg';
import imgUsers from '../../assets/users.svg';

export default function MedPacienteHistoriaClinicaGeneral() {
  const navigate = useNavigate();
  return (
    <div className="bg-[#f8fafc] content-stretch flex h-[2304px] items-start min-h-[900px] relative shrink-0 w-[1440px]" data-name="med/paciente/historia-clinica-general">
      <div className="bg-[#0f172a] border-[#1e293b] border-r border-solid content-stretch flex flex-col h-[2304px] items-start justify-between px-[16px] py-[24px] relative shrink-0 w-[230px]" data-name="sidebar">
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
              <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[18px]" data-name="icon-Dashboard">
                <div className="relative shrink-0 size-[18px]" data-name="layout-dashboard">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgLayoutDashboard} />
                </div>
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Dashboard</p>
            </Link>
            <Link className="bg-[rgba(37,99,235,0.15)] content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Pacientes" to="/MedPacientesLista">
              <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[18px]" data-name="icon-Pacientes">
                <div className="relative shrink-0 size-[18px]" data-name="users">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgUsers} />
                </div>
              </div>
              <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[14px] text-white whitespace-nowrap">Pacientes</p>
            </Link>
            <Link className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Monitoreo" to="/MedMonitoreoGridUci">
              <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[18px]" data-name="icon-Monitoreo">
                <div className="relative shrink-0 size-[18px]" data-name="activity">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgActivity} />
                </div>
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Monitoreo</p>
            </Link>
            <Link className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Alertas" to="/MedAlertasCentro">
              <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[18px]" data-name="icon-Alertas">
                <div className="relative shrink-0 size-[18px]" data-name="bell">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgBell} />
                </div>
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Alertas</p>
            </Link>
            <Link className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Reportes" to="/MedReportesPanel">
              <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[18px]" data-name="icon-Reportes">
                <div className="relative shrink-0 size-[18px]" data-name="file-text">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgFileText} />
                </div>
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Reportes</p>
            </Link>
            <Link className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Dispositivos" to="/MedDispositivosMonitores">
              <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[18px]" data-name="icon-Dispositivos">
                <div className="relative shrink-0 size-[18px]" data-name="cpu">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgCpu} />
                </div>
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Dispositivos</p>
            </Link>
          </div>
        </div>
        <Link className="absolute left-[20px] opacity-25 size-[18px] top-[2196px]" data-name="help-icon" to="/MedAyudaSoporte">
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
              <img className="block max-w-none size-full" alt="" src={imgDoctorFooterLine3} />
            </div>
          </div>
          <Link className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-name="user-profile" to="/MedPerfilMiPerfil">
            <div className="relative rounded-[20px] shrink-0 size-[40px]" data-name="avatar">
              <img className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[20px] size-full" alt="" src={imgAvatar4Png} />
            </div>
            <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px relative whitespace-nowrap" data-name="user-info">
              <p className="font-jakarta font-bold overflow-hidden relative shrink-0 text-[13px] text-ellipsis text-white">Dr. Roberto Silva</p>
              <p className="font-jakarta font-medium overflow-hidden relative shrink-0 text-[#64748b] text-[11px] text-ellipsis">Médico Especialista</p>
            </div>
            <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[18px]" data-name="logout">
              <div className="relative shrink-0 size-[18px]" data-name="log-out">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgLogOut} />
              </div>
            </div>
          </Link>
        </div>
      </div>
      <div className="content-stretch flex flex-col items-start relative shrink-0 w-[1198px]" data-name="main-container">
        <div className="bg-white border-[#e2e8f0] border-b border-solid content-stretch flex h-[72px] items-center justify-between px-[32px] relative shrink-0 w-full" data-name="top-bar">
          <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start leading-[normal] relative shrink-0 whitespace-nowrap" data-name="title-breadcrumb">
            <p className="font-jakarta font-medium relative shrink-0 text-[#64748b] text-[12px]">{`SIAPPC > Pacientes > María González > Historia Clínica`}</p>
            <p className="font-jakarta font-extrabold relative shrink-0 text-[#0f172a] text-[20px]">Historia Clínica General</p>
          </div>
          <div className="content-stretch flex gap-[20px] items-center overflow-clip relative shrink-0" data-name="right-actions">
            <div className="content-stretch flex items-center relative shrink-0" data-name="perfil-nav">
              <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex gap-[6px] items-center px-[12px] py-[8px] relative rounded-[8px] shrink-0 cursor-pointer" data-name="back-btn" role="button" onClick={() => navigate(-1)}>
                <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[14px]" data-name="back-arrow">
                  <div className="relative shrink-0 size-[14px]" data-name="arrow-left">
                    <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgArrowLeft3} />
                  </div>
                </div>
                <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] whitespace-nowrap">Volver</p>
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
        <div className="content-stretch flex flex-col gap-[20px] h-[2232px] items-start p-[32px] relative shrink-0 w-full" data-name="page-body">
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
            <Link className="[word-break:break-word] bg-[#eff6ff] content-stretch cursor-pointer flex font-jakarta font-semibold gap-[4px] items-center leading-[normal] overflow-clip px-[12px] py-[6px] relative rounded-[6px] shrink-0 text-[#2563eb] text-[13px] text-left whitespace-nowrap" data-name="btn-add-diagnostico" to="/MedPacienteRegistroDiagnostico">
              <p className="relative shrink-0">+</p>
              <p className="relative shrink-0">Agregar Diagnóstico</p>
            </Link>
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[12px] items-start p-[16px] relative rounded-[12px] shrink-0 w-full" data-name="section-datos">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="header">
                <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="left">
                  <div className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex flex-col items-center justify-center relative rounded-[14px] shrink-0 size-[28px]" data-name="icon-circle">
                    <div className="relative shrink-0 size-[16px]" data-name="user">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgUser} />
                    </div>
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[14px] whitespace-nowrap">Datos Personales y Demográficos</p>
                </div>
                <div className="opacity-0 relative shrink-0 size-[28px]" data-name="spacer" />
                <div className="bg-[#f1f5f9] border border-[#dbeafe] border-solid content-stretch flex items-center justify-center overflow-clip relative rounded-[14px] shrink-0 size-[28px]" data-name="collapse-icon">
                  <div className="flex items-center justify-center relative shrink-0">
                    <div className="flex-none rotate-180">
                      <div className="relative size-[16px]" data-name="chevron-down">
                        <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgChevronDown2} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-0 relative shrink-0 w-full" data-name="Line">
                <div className="absolute inset-[-1px_0_0_0]">
                  <img className="block max-w-none size-full" alt="" src={imgSectionDatosLine} />
                </div>
              </div>
              <p className="[word-break:break-word] font-jakarta font-normal leading-[1.5] min-w-full relative shrink-0 text-[#64748b] text-[13px] w-[min-content]">María González · 67 años · Femenino · O+ · Casada · ID PT-8821</p>
              <Link className="bg-[#eff2ff] content-stretch cursor-pointer flex items-start overflow-clip px-[16px] py-[8px] relative rounded-[20px] shrink-0" data-name="btn-nav" to="/MedPacienteDatosPersonales">
                <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#2663eb] text-[13px] text-left whitespace-nowrap">Ver datos completos →</p>
              </Link>
            </div>
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[12px] items-start p-[16px] relative rounded-[12px] shrink-0 w-full" data-name="section-antecedentes">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="header">
                <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="left">
                  <div className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex flex-col items-center justify-center relative rounded-[14px] shrink-0 size-[28px]" data-name="icon-circle">
                    <div className="relative shrink-0 size-[16px]" data-name="heart">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgHeart} />
                    </div>
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[14px] whitespace-nowrap">Antecedentes Patológicos Diagnosticados</p>
                </div>
                <div className="bg-[#f1f5f9] border border-[#dbeafe] border-solid content-stretch flex items-center justify-center relative rounded-[14px] shrink-0 size-[28px]" data-name="collapse-icon">
                  <div className="relative shrink-0 size-[16px]" data-name="chevron-up">
                    <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgChevronDown2} />
                  </div>
                </div>
              </div>
              <div className="h-0 relative shrink-0 w-full" data-name="Line">
                <div className="absolute inset-[-1px_0_0_0]">
                  <img className="block max-w-none size-full" alt="" src={imgSectionDatosLine} />
                </div>
              </div>
              <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="antecedentes-list">
                <div className="bg-[#f8fafc] content-stretch flex items-start p-[12px] relative rounded-[8px] shrink-0 w-full" data-name="item-hipertension">
                  <p className="[word-break:break-word] flex-[1_0_0] font-jakarta font-bold leading-[0] min-w-px relative text-[#0f172a] text-[13px]"><span className="leading-[normal]">{`Hipertensión Arterial Sistémica `}</span><span className="font-jakarta font-medium leading-[normal] text-[#64748b]">(2018)</span></p>
                </div>
                <div className="bg-[#f8fafc] content-stretch flex items-start p-[12px] relative rounded-[8px] shrink-0 w-full" data-name="item-diabetes">
                  <p className="[word-break:break-word] flex-[1_0_0] font-jakarta font-bold leading-[0] min-w-px relative text-[#0f172a] text-[13px]"><span className="leading-[normal]">{`Diabetes Mellitus Tipo 2 `}</span><span className="font-jakarta font-medium leading-[normal] text-[#64748b]">(2020)</span></p>
                </div>
                <div className="bg-[#f8fafc] content-stretch flex items-start p-[12px] relative rounded-[8px] shrink-0 w-full" data-name="item-cirugia">
                  <p className="[word-break:break-word] flex-[1_0_0] font-jakarta font-bold leading-[0] min-w-px relative text-[#0f172a] text-[13px]"><span className="leading-[normal]">{`Revascularización Miocárdica Quirúrgica `}</span><span className="font-jakarta font-medium leading-[normal] text-[#64748b]">(Cirugía)</span></p>
                </div>
              </div>
              <div className="bg-[#eff6ff] border border-[#dbeafe] border-solid content-stretch flex items-center px-[16px] py-[8px] relative rounded-[20px] shrink-0" data-name="btn-nav-antecedentes-completos">
                <Link className="[word-break:break-word] block cursor-pointer font-jakarta font-semibold leading-[0] relative shrink-0 text-[#2563eb] text-[13px] whitespace-nowrap" to="/MedPacienteAntecedentes">
                  <p className="leading-[normal]">Ver historial completo de antecedentes →</p>
                </Link>
              </div>
            </div>
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[12px] items-start p-[16px] relative rounded-[12px] shrink-0 w-full" data-name="section-interrogatorio">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="header">
                <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="left">
                  <div className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex flex-col items-center justify-center relative rounded-[14px] shrink-0 size-[28px]" data-name="icon-circle">
                    <div className="relative shrink-0 size-[16px]" data-name="clipboard-list">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgClipboardList} />
                    </div>
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[14px] whitespace-nowrap">Interrogatorio por Aparatos y Sistemas</p>
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
              <div className="h-0 relative shrink-0 w-full" data-name="Line">
                <div className="absolute inset-[-1px_0_0_0]">
                  <img className="block max-w-none size-full" alt="" src={imgSectionDatosLine} />
                </div>
              </div>
              <p className="[word-break:break-word] font-jakarta font-normal leading-[1.5] min-w-full relative shrink-0 text-[#64748b] text-[13px] w-[min-content]">Hallazgos: Cardiovascular (Disnea), Respiratorio (Tos productiva), Renal (Edema MsIs)</p>
              <Link className="bg-[#eff2ff] content-stretch cursor-pointer flex items-start overflow-clip px-[16px] py-[8px] relative rounded-[20px] shrink-0" data-name="btn-nav" to="/MedPacienteInterrogatorioAparatos">
                <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#2663eb] text-[13px] text-left whitespace-nowrap">Ver interrogatorio completo →</p>
              </Link>
            </div>
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[12px] items-start p-[16px] relative rounded-[12px] shrink-0 w-full" data-name="section-exploracion">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="header">
                <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="left">
                  <div className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex flex-col items-center justify-center relative rounded-[14px] shrink-0 size-[28px]" data-name="icon-circle">
                    <div className="relative shrink-0 size-[16px]" data-name="activity">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgActivity2} />
                    </div>
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[14px] whitespace-nowrap">Exploración Física</p>
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
              <div className="h-0 relative shrink-0 w-full" data-name="Line">
                <div className="absolute inset-[-1px_0_0_0]">
                  <img className="block max-w-none size-full" alt="" src={imgSectionDatosLine} />
                </div>
              </div>
              <p className="[word-break:break-word] font-jakarta font-normal leading-[1.5] min-w-full relative shrink-0 text-[#64748b] text-[13px] w-[min-content]">FC 92bpm · PA 145/90 · FR 24rpm · SpO₂ 91% · Temp 36.8°C</p>
              <Link className="bg-[#eff2ff] content-stretch cursor-pointer flex items-start overflow-clip px-[16px] py-[8px] relative rounded-[20px] shrink-0" data-name="btn-nav" to="/MedPacienteExploracionFisica">
                <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#2663eb] text-[13px] text-left whitespace-nowrap">Ver exploración completa →</p>
              </Link>
            </div>
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[12px] items-start p-[16px] relative rounded-[8px] shrink-0 w-full" data-name="section-alergias">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="header">
                <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="section-title">
                  <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[16px]" data-name="shield-alert-icon">
                    <div className="relative shrink-0 size-[16px]" data-name="shield-alert">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgShieldAlert} />
                    </div>
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[14px] whitespace-nowrap">Alergias y Reacciones Adversas</p>
                </div>
                <div className="bg-[#f1f5f9] border border-[#dbeafe] border-solid content-stretch flex items-center justify-center overflow-clip relative rounded-[14px] shrink-0 size-[28px]" data-name="collapse-icon">
                  <div className="relative shrink-0 size-[16px]" data-name="chevron-up">
                    <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgChevronDown2} />
                  </div>
                </div>
              </div>
              <div className="h-0 relative shrink-0 w-full" data-name="Line">
                <div className="absolute inset-[-1px_0_0_0]">
                  <img className="block max-w-none size-full" alt="" src={imgSectionDatosLine} />
                </div>
              </div>
              <div className="[word-break:break-word] content-stretch flex gap-[12px] items-start leading-[normal] relative shrink-0 w-full whitespace-nowrap" data-name="alergias-cards-row">
                <div className="bg-[#fef2f2] border border-[#ef4444] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px p-[12px] relative rounded-[8px] text-[#ef4444]" data-name="alergia-penicilina">
                  <p className="font-jakarta font-bold relative shrink-0 text-[13px]">Penicilina</p>
                  <p className="font-jakarta font-semibold relative shrink-0 text-[11px]">Severidad: SEVERA (Shock Anafiláctico)</p>
                </div>
                <div className="bg-[#fef3c7] border border-[#f59e0b] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px p-[12px] relative rounded-[8px] text-[#f59e0b]" data-name="alergia-aines">
                  <p className="font-jakarta font-bold relative shrink-0 text-[13px]">AINEs (Antiinflamatorios no esteroideos)</p>
                  <p className="font-jakarta font-semibold relative shrink-0 text-[11px]">Severidad: MODERADA (Broncoespasmo)</p>
                </div>
              </div>
            </div>
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[12px] items-start p-[16px] relative rounded-[8px] shrink-0 w-full" data-name="section-medicamentos">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="header">
                <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="section-title">
                  <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[16px]" data-name="pill-icon">
                    <div className="relative shrink-0 size-[16px]" data-name="pill">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgPill} />
                    </div>
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[14px] whitespace-nowrap">Medicamentos y Tratamientos Actuales</p>
                </div>
                <div className="bg-[#f1f5f9] border border-[#dbeafe] border-solid content-stretch flex items-center justify-center overflow-clip relative rounded-[14px] shrink-0 size-[28px]" data-name="collapse-icon">
                  <div className="relative shrink-0 size-[16px]" data-name="chevron-up">
                    <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgChevronDown2} />
                  </div>
                </div>
              </div>
              <div className="h-0 relative shrink-0 w-full" data-name="Line">
                <div className="absolute inset-[-1px_0_0_0]">
                  <img className="block max-w-none size-full" alt="" src={imgSectionDatosLine} />
                </div>
              </div>
              <div className="[word-break:break-word] bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col items-start leading-[normal] overflow-clip relative rounded-[8px] shrink-0 w-full" data-name="meds-table">
                <div className="bg-[#f8fafc] border-[#e2e8f0] border-b border-solid content-stretch flex font-jakarta font-bold gap-[12px] items-center px-[12px] py-[10px] relative shrink-0 text-[#64748b] text-[11px] w-full" data-name="meds-header">
                  <p className="flex-[1_0_0] min-w-px relative">MEDICAMENTO</p>
                  <p className="relative shrink-0 w-[130px]">DOSIS</p>
                  <p className="relative shrink-0 w-[150px]">FRECUENCIA</p>
                  <p className="relative shrink-0 w-[110px]">VÍA</p>
                  <p className="relative shrink-0 w-[110px]">INICIO</p>
                </div>
                <div className="border-[#e2e8f0] border-b border-solid content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative shrink-0 text-[13px] w-full" data-name="med-row-0">
                  <p className="flex-[1_0_0] font-jakarta font-bold min-w-px relative text-[#0f172a]">Noradrenalina</p>
                  <p className="font-jakarta font-normal relative shrink-0 text-[#0f172a] w-[130px]">0.15 mcg/kg/min</p>
                  <p className="font-jakarta font-normal relative shrink-0 text-[#64748b] w-[150px]">Infusión Continua</p>
                  <p className="font-jakarta font-normal relative shrink-0 text-[#0f172a] w-[110px]">Vía Central</p>
                  <p className="font-jakarta font-normal relative shrink-0 text-[#64748b] w-[110px]">02 Ago, 08:30</p>
                </div>
                <div className="border-[#e2e8f0] border-b border-solid content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative shrink-0 text-[13px] w-full" data-name="med-row-1">
                  <p className="flex-[1_0_0] font-jakarta font-bold min-w-px relative text-[#0f172a]">Fentanilo</p>
                  <p className="font-jakarta font-normal relative shrink-0 text-[#0f172a] w-[130px]">2 mcg/kg/h</p>
                  <p className="font-jakarta font-normal relative shrink-0 text-[#64748b] w-[150px]">Infusión Continua</p>
                  <p className="font-jakarta font-normal relative shrink-0 text-[#0f172a] w-[110px]">Vía Central</p>
                  <p className="font-jakarta font-normal relative shrink-0 text-[#64748b] w-[110px]">02 Ago, 09:00</p>
                </div>
                <div className="border-[#e2e8f0] border-b border-solid content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative shrink-0 text-[13px] w-full" data-name="med-row-2">
                  <p className="flex-[1_0_0] font-jakarta font-bold min-w-px relative text-[#0f172a]">Omeprazol</p>
                  <p className="font-jakarta font-normal relative shrink-0 text-[#0f172a] w-[130px]">40 mg</p>
                  <p className="font-jakarta font-normal relative shrink-0 text-[#64748b] w-[150px]">Cada 24 horas</p>
                  <p className="font-jakarta font-normal relative shrink-0 text-[#0f172a] w-[110px]">Intravenosa</p>
                  <p className="font-jakarta font-normal relative shrink-0 text-[#64748b] w-[110px]">03 Ago, 06:00</p>
                </div>
                <div className="border-[#e2e8f0] border-b border-solid content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative shrink-0 text-[13px] w-full" data-name="med-row-3">
                  <p className="flex-[1_0_0] font-jakarta font-bold min-w-px relative text-[#0f172a]">Enoxaparina</p>
                  <p className="font-jakarta font-normal relative shrink-0 text-[#0f172a] w-[130px]">40 mg</p>
                  <p className="font-jakarta font-normal relative shrink-0 text-[#64748b] w-[150px]">Cada 24 horas</p>
                  <p className="font-jakarta font-normal relative shrink-0 text-[#0f172a] w-[110px]">Subcutánea</p>
                  <p className="font-jakarta font-normal relative shrink-0 text-[#64748b] w-[110px]">03 Ago, 20:00</p>
                </div>
              </div>
            </div>
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[12px] items-start p-[16px] relative rounded-[12px] shrink-0 w-full" data-name="section-diagnosticos">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="header">
                <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="left">
                  <div className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex flex-col items-center justify-center relative rounded-[14px] shrink-0 size-[28px]" data-name="icon-circle">
                    <div className="relative shrink-0 size-[16px]" data-name="stethoscope">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgStethoscope} />
                    </div>
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[14px] whitespace-nowrap">Diagnósticos y Problemas Activos</p>
                </div>
                <div className="opacity-0 relative shrink-0 size-[28px]" data-name="spacer" />
                <div className="bg-[#f1f5f9] border border-[#dbeafe] border-solid content-stretch flex items-center justify-center overflow-clip relative rounded-[14px] shrink-0 size-[28px]" data-name="collapse-icon">
                  <div className="flex items-center justify-center relative shrink-0">
                    <div className="flex-none rotate-180">
                      <div className="relative size-[16px]" data-name="chevron-down">
                        <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgChevronDown2} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-0 relative shrink-0 w-full" data-name="Line">
                <div className="absolute inset-[-1px_0_0_0]">
                  <img className="block max-w-none size-full" alt="" src={imgSectionDatosLine} />
                </div>
              </div>
              <p className="[word-break:break-word] font-jakarta font-normal leading-[1.5] min-w-full relative shrink-0 text-[#64748b] text-[13px] w-[min-content]">3 diagnósticos activos - I50.9 ICC, J81 Edema Pulmonar, I10 HTA</p>
              <Link className="bg-[#eff2ff] content-stretch cursor-pointer flex items-start overflow-clip px-[16px] py-[8px] relative rounded-[20px] shrink-0" data-name="btn-nav" to="/MedPacienteDiagnosticosActivos">
                <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#2663eb] text-[13px] text-left whitespace-nowrap">Ver diagnósticos →</p>
              </Link>
            </div>
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[12px] items-start p-[16px] relative rounded-[12px] shrink-0 w-full" data-name="section-hospitalizaciones">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="header">
                <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="left">
                  <div className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex flex-col items-center justify-center relative rounded-[14px] shrink-0 size-[28px]" data-name="icon-circle">
                    <div className="relative shrink-0 size-[16px]" data-name="home">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgHome} />
                    </div>
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[14px] whitespace-nowrap">Historial de Hospitalizaciones e Intervenciones</p>
                </div>
                <div className="opacity-0 relative shrink-0 size-[28px]" data-name="spacer" />
                <div className="bg-[#f1f5f9] border border-[#dbeafe] border-solid content-stretch flex items-center justify-center overflow-clip relative rounded-[14px] shrink-0 size-[28px]" data-name="collapse-icon">
                  <div className="flex items-center justify-center relative shrink-0">
                    <div className="flex-none rotate-180">
                      <div className="relative size-[16px]" data-name="chevron-down">
                        <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgChevronDown2} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-0 relative shrink-0 w-full" data-name="Line">
                <div className="absolute inset-[-1px_0_0_0]">
                  <img className="block max-w-none size-full" alt="" src={imgSectionDatosLine} />
                </div>
              </div>
              <p className="[word-break:break-word] font-jakarta font-normal leading-[1.5] min-w-full relative shrink-0 text-[#64748b] text-[13px] w-[min-content]">Última: 15 Oct 2025 · UCI · Cama C-03 · Dr. Méndez</p>
              <Link className="bg-[#eff2ff] content-stretch cursor-pointer flex items-start overflow-clip px-[16px] py-[8px] relative rounded-[20px] shrink-0" data-name="btn-nav" to="/MedPacienteHistorialHospitalizaciones">
                <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#2663eb] text-[13px] text-left whitespace-nowrap">Ver historial completo →</p>
              </Link>
            </div>
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[12px] items-start p-[16px] relative rounded-[12px] shrink-0 w-full" data-name="section-nota-ingreso">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="header">
                <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="left">
                  <div className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex flex-col items-center justify-center relative rounded-[14px] shrink-0 size-[28px]" data-name="icon-circle">
                    <div className="relative shrink-0 size-[16px]" data-name="file-text">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgFileText3} />
                    </div>
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[14px] whitespace-nowrap">Nota de Ingreso / Admisión</p>
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
              <div className="h-0 relative shrink-0 w-full" data-name="Line">
                <div className="absolute inset-[-1px_0_0_0]">
                  <img className="block max-w-none size-full" alt="" src={imgSectionDatosLine} />
                </div>
              </div>
              <p className="[word-break:break-word] font-jakarta font-normal leading-[1.5] min-w-full relative shrink-0 text-[#64748b] text-[13px] w-[min-content]">Ingreso 15 Oct 2025 · Dx principal: ICC · Pronóstico Reservado</p>
              <Link className="bg-[#eff2ff] content-stretch cursor-pointer flex items-start overflow-clip px-[16px] py-[8px] relative rounded-[20px] shrink-0" data-name="btn-nav" to="/MedPacienteNotaIngreso">
                <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#2663eb] text-[13px] text-left whitespace-nowrap">Ver nota de ingreso →</p>
              </Link>
            </div>
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[12px] items-start p-[16px] relative rounded-[12px] shrink-0 w-full" data-name="section-indicaciones">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="header">
                <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="left">
                  <div className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex flex-col items-center justify-center relative rounded-[14px] shrink-0 size-[28px]" data-name="icon-circle">
                    <div className="relative shrink-0 size-[16px]" data-name="pill">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgPill} />
                    </div>
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[14px] whitespace-nowrap">Indicaciones Médicas</p>
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
              <div className="h-0 relative shrink-0 w-full" data-name="Line">
                <div className="absolute inset-[-1px_0_0_0]">
                  <img className="block max-w-none size-full" alt="" src={imgSectionDatosLine} />
                </div>
              </div>
              <p className="[word-break:break-word] font-jakarta font-normal leading-[1.5] min-w-full relative shrink-0 text-[#64748b] text-[13px] w-[min-content]">4 medicamentos · 2 soluciones IV · Dieta blanda hiposódica</p>
              <Link className="bg-[#eff2ff] content-stretch cursor-pointer flex items-start overflow-clip px-[16px] py-[8px] relative rounded-[20px] shrink-0" data-name="btn-nav" to="/MedPacienteIndicacionesMedicas">
                <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#2663eb] text-[13px] text-left whitespace-nowrap">Ver indicaciones médicas →</p>
              </Link>
            </div>
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[12px] items-start p-[16px] relative rounded-[12px] shrink-0 w-full" data-name="section-documentos">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="header">
                <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="left">
                  <div className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex flex-col items-center justify-center relative rounded-[14px] shrink-0 size-[28px]" data-name="icon-circle">
                    <div className="relative shrink-0 size-[16px]" data-name="file-text">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgFileText3} />
                    </div>
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[14px] whitespace-nowrap">Documentos Clínicos Adjuntos</p>
                </div>
                <div className="opacity-0 relative shrink-0 size-[28px]" data-name="spacer" />
                <div className="bg-[#f1f5f9] border border-[#dbeafe] border-solid content-stretch flex items-center justify-center overflow-clip relative rounded-[14px] shrink-0 size-[28px]" data-name="collapse-icon">
                  <div className="flex items-center justify-center relative shrink-0">
                    <div className="flex-none rotate-180">
                      <div className="relative size-[16px]" data-name="chevron-down">
                        <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgChevronDown2} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-0 relative shrink-0 w-full" data-name="Line">
                <div className="absolute inset-[-1px_0_0_0]">
                  <img className="block max-w-none size-full" alt="" src={imgSectionDatosLine} />
                </div>
              </div>
              <p className="[word-break:break-word] font-jakarta font-normal leading-[1.5] min-w-full relative shrink-0 text-[#64748b] text-[13px] w-[min-content]">3 documentos adjuntos · Subir archivo (PDF, JPG)</p>
              <Link className="bg-[#eff2ff] content-stretch cursor-pointer flex items-start overflow-clip px-[16px] py-[8px] relative rounded-[20px] shrink-0" data-name="btn-nav" to="/MedPacienteDocumentosClinicos">
                <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#2663eb] text-[13px] text-left whitespace-nowrap">Ver documentos →</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
