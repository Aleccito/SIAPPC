// Pantalla "med/paciente/diagnosticos-activos" (Figma node 191:230) — generada desde el diseño original de Figma.
import { Link, useNavigate } from 'react-router-dom';
import imgActivity from '../../assets/activity.svg';
import imgArrowLeft3 from '../../assets/arrow-left-3.svg';
import imgAvatar16Png from '../../assets/avatar-16.png';
import imgBell from '../../assets/bell.svg';
import imgBell3 from '../../assets/bell-3.svg';
import imgClipboard from '../../assets/clipboard.svg';
import imgCpu from '../../assets/cpu.svg';
import imgDoctorFooterLine2 from '../../assets/doctor-footer-line-2.svg';
import imgFileText from '../../assets/file-text.svg';
import imgFileText2 from '../../assets/file-text-2.svg';
import imgFileText6 from '../../assets/file-text-6.svg';
import imgHelpIconEllipse from '../../assets/help-icon-ellipse.svg';
import imgLayoutDashboard from '../../assets/layout-dashboard.svg';
import imgLogOut from '../../assets/log-out.svg';
import imgPatientAvatar8Png from '../../assets/patient-avatar-8.png';
import imgUsers from '../../assets/users.svg';

export default function MedPacienteDiagnosticosActivos() {
  const navigate = useNavigate();
  return (
    <div className="bg-[#f8fafc] content-stretch flex h-[900px] items-start relative shrink-0 w-[1440px]" data-name="med/paciente/diagnosticos-activos">
      <div className="bg-[#0f172a] border-[#1e293b] border-r border-solid content-stretch flex flex-col h-full items-start justify-between px-[16px] py-[24px] relative shrink-0 w-[240px]" data-name="sidebar">
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
            <Link className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Dashboard" to="/MedDashboardPrincipal">
              <div className="relative shrink-0 size-[18px]" data-name="layout-dashboard">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgLayoutDashboard} />
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
              <img className="block max-w-none size-full" alt="" src={imgDoctorFooterLine2} />
            </div>
          </div>
          <Link className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-name="user-profile" to="/MedPerfilMiPerfil">
            <div className="relative rounded-[20px] shrink-0 size-[40px]" data-name="avatar">
              <img className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[20px] size-full" alt="" src={imgAvatar16Png} />
            </div>
            <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px relative whitespace-nowrap" data-name="user-info">
              <p className="font-jakarta font-bold overflow-hidden relative shrink-0 text-[13px] text-ellipsis text-white">Dr. Roberto Silva</p>
              <p className="font-jakarta font-medium overflow-hidden relative shrink-0 text-[#64748b] text-[11px] text-ellipsis">Médico Especialista</p>
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
            <p className="font-jakarta font-medium relative shrink-0 text-[#64748b] text-[11px]">{`SIAPPC > Pacientes > María González > Historia Clínica > Diagnósticos`}</p>
            <p className="font-jakarta font-extrabold relative shrink-0 text-[#0f172a] text-[20px]">Diagnósticos y Problemas Activos</p>
          </div>
          <div className="content-stretch flex gap-[20px] items-center relative shrink-0" data-name="right-actions">
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex gap-[6px] items-center px-[12px] py-[8px] relative rounded-[8px] shrink-0 cursor-pointer" data-name="back-btn" role="button" onClick={() => navigate(-1)}>
              <div className="relative shrink-0 size-[14px]" data-name="arrow-left">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgArrowLeft3} />
              </div>
              <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] whitespace-nowrap">Volver</p>
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
          <div className="bg-white border border-[#e2e8f0] border-solid content-stretch drop-shadow-[0px_4px_6px_rgba(0,0,0,0.02)] flex flex-col items-start p-[20px] relative rounded-[12px] shrink-0 w-full" data-name="patient-header-card">
            <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="patient-header-top">
              <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="patient-info-group">
                <div className="relative rounded-[28px] shrink-0 size-[56px]" data-name="patient-avatar">
                  <img className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[28px] size-full" alt="" src={imgPatientAvatar8Png} />
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
          <div className="content-stretch flex flex-[1_0_0] gap-[20px] items-start min-h-px overflow-clip relative w-full" data-name="content-layout">
            <div className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px relative" data-name="diag-main-col">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="diag-action-row">
                <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#0f172a] text-[16px] whitespace-nowrap">Problemas Médicos Activos</p>
                <div className="bg-[#2563eb] content-stretch flex items-center px-[14px] py-[8px] relative rounded-[8px] shrink-0" data-name="btn-nuevo-diagnostico">
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[13px] text-white whitespace-nowrap">+ Nuevo Diagnóstico</p>
                </div>
              </div>
              <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[12px] shrink-0 w-full" data-name="active-diag-table">
                <div className="[word-break:break-word] bg-[#f8fafc] border-[#e2e8f0] border-b border-solid content-stretch flex font-jakarta font-bold gap-[12px] items-start leading-[normal] p-[12px] relative shrink-0 text-[#64748b] text-[11px] w-full" data-name="table-head">
                  <p className="relative shrink-0 w-[90px]">CIE-10</p>
                  <p className="flex-[1_0_0] min-w-px relative">DESCRIPCIÓN</p>
                  <p className="relative shrink-0 w-[110px]">TIPO</p>
                  <p className="relative shrink-0 w-[100px]">FECHA DX</p>
                  <p className="relative shrink-0 w-[100px]">ESTADO</p>
                  <p className="relative shrink-0 text-right w-[80px]">ACCIONES</p>
                </div>
                <div className="border-[#e2e8f0] border-b border-solid content-stretch flex gap-[12px] items-center p-[12px] relative shrink-0 w-full" data-name="row-I50.9">
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[90px]">I50.9</p>
                  <p className="[word-break:break-word] flex-[1_0_0] font-jakarta font-semibold leading-[normal] min-w-px relative text-[#0f172a] text-[13px]">Insuficiencia Cardíaca Congestiva</p>
                  <div className="content-stretch flex items-start relative shrink-0 w-[110px]" data-name="Frame">
                    <div className="bg-[#ecfdf5] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[6px] shrink-0" data-name="Frame">
                      <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#10b981] text-[11px] whitespace-nowrap">Definitivo</p>
                    </div>
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#64748b] text-[13px] w-[100px]">15 Oct 2025</p>
                  <div className="content-stretch flex items-start relative shrink-0 w-[100px]" data-name="Frame">
                    <div className="bg-[#fef2f2] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[6px] shrink-0" data-name="Frame">
                      <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#ef4444] text-[11px] whitespace-nowrap">Activo</p>
                    </div>
                  </div>
                  <div className="content-stretch flex items-start justify-end relative shrink-0 w-[80px]" data-name="Frame">
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#2563eb] text-[13px] whitespace-nowrap">editar</p>
                  </div>
                </div>
                <div className="border-[#e2e8f0] border-b border-solid content-stretch flex gap-[12px] items-center p-[12px] relative shrink-0 w-full" data-name="row-J81">
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[90px]">J81</p>
                  <p className="[word-break:break-word] flex-[1_0_0] font-jakarta font-semibold leading-[normal] min-w-px relative text-[#0f172a] text-[13px]">Edema Pulmonar</p>
                  <div className="content-stretch flex items-start relative shrink-0 w-[110px]" data-name="Frame">
                    <div className="bg-[#fef3c7] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[6px] shrink-0" data-name="Frame">
                      <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#f59e0b] text-[11px] whitespace-nowrap">Presuntivo</p>
                    </div>
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#64748b] text-[13px] w-[100px]">15 Oct 2025</p>
                  <div className="content-stretch flex items-start relative shrink-0 w-[100px]" data-name="Frame">
                    <div className="bg-[#fef2f2] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[6px] shrink-0" data-name="Frame">
                      <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#ef4444] text-[11px] whitespace-nowrap">Activo</p>
                    </div>
                  </div>
                  <div className="content-stretch flex items-start justify-end relative shrink-0 w-[80px]" data-name="Frame">
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#2563eb] text-[13px] whitespace-nowrap">editar</p>
                  </div>
                </div>
                <div className="border-[#e2e8f0] border-b border-solid content-stretch flex gap-[12px] items-center p-[12px] relative shrink-0 w-full" data-name="row-I10">
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[90px]">I10</p>
                  <p className="[word-break:break-word] flex-[1_0_0] font-jakarta font-semibold leading-[normal] min-w-px relative text-[#0f172a] text-[13px]">Hipertensión Arterial</p>
                  <div className="content-stretch flex items-start relative shrink-0 w-[110px]" data-name="Frame">
                    <div className="bg-[#ecfdf5] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[6px] shrink-0" data-name="Frame">
                      <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#10b981] text-[11px] whitespace-nowrap">Definitivo</p>
                    </div>
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#64748b] text-[13px] w-[100px]">Año 2018</p>
                  <div className="content-stretch flex items-start relative shrink-0 w-[100px]" data-name="Frame">
                    <div className="bg-[#fef2f2] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[6px] shrink-0" data-name="Frame">
                      <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#ef4444] text-[11px] whitespace-nowrap">Activo</p>
                    </div>
                  </div>
                  <div className="content-stretch flex items-start justify-end relative shrink-0 w-[80px]" data-name="Frame">
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#2563eb] text-[13px] whitespace-nowrap">editar</p>
                  </div>
                </div>
                <div className="border-0 border-[#e2e8f0] border-solid content-stretch flex gap-[12px] items-center p-[12px] relative shrink-0 w-full" data-name="row-E11">
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[90px]">E11</p>
                  <p className="[word-break:break-word] flex-[1_0_0] font-jakarta font-semibold leading-[normal] min-w-px relative text-[#0f172a] text-[13px]">Diabetes Mellitus Tipo 2</p>
                  <div className="content-stretch flex items-start relative shrink-0 w-[110px]" data-name="Frame">
                    <div className="bg-[#ecfdf5] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[6px] shrink-0" data-name="Frame">
                      <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#10b981] text-[11px] whitespace-nowrap">Definitivo</p>
                    </div>
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#64748b] text-[13px] w-[100px]">Año 2020</p>
                  <div className="content-stretch flex items-start relative shrink-0 w-[100px]" data-name="Frame">
                    <div className="bg-[#fef2f2] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[6px] shrink-0" data-name="Frame">
                      <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#ef4444] text-[11px] whitespace-nowrap">Activo</p>
                    </div>
                  </div>
                  <div className="content-stretch flex items-start justify-end relative shrink-0 w-[80px]" data-name="Frame">
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#2563eb] text-[13px] whitespace-nowrap">editar</p>
                  </div>
                </div>
              </div>
              <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#0f172a] text-[16px] whitespace-nowrap">Problemas Resueltos Históricos</p>
              <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[12px] shrink-0 w-full" data-name="resolved-diag-table">
                <div className="content-stretch flex gap-[12px] items-center p-[12px] relative shrink-0 w-full" data-name="resolved-row">
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[13px] w-[90px]">N39.0</p>
                  <p className="[word-break:break-word] flex-[1_0_0] font-jakarta font-semibold leading-[normal] min-w-px relative text-[#0f172a] text-[13px]">Infección de Vías Urinarias Complicada</p>
                  <div className="content-stretch flex items-start relative shrink-0 w-[110px]" data-name="Frame">
                    <div className="bg-[#ecfdf5] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[6px] shrink-0" data-name="Frame">
                      <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#10b981] text-[11px] whitespace-nowrap">Resuelto</p>
                    </div>
                  </div>
                  <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#64748b] text-[13px] w-[280px]">Fecha de Resolución: Julio 2024</p>
                </div>
              </div>
            </div>
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[16px] items-start p-[20px] relative rounded-[12px] shrink-0 w-[380px]" data-name="diag-notes-panel">
              <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="notes-header">
                <div className="relative shrink-0 size-[18px]" data-name="file-text">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgFileText6} />
                </div>
                <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[15px] whitespace-nowrap">Notas Clínicas Correlativas</p>
              </div>
              <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] min-w-full relative shrink-0 text-[#64748b] text-[12px] w-[min-content]">Nota general sobre evolución e interrelación fisiopatológica de los diagnósticos:</p>
              <div className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex flex-col items-start p-[12px] relative rounded-[8px] shrink-0 w-full" data-name="textarea-container">
                <div className="[word-break:break-word] font-jakarta font-normal leading-[0] relative shrink-0 text-[#0f172a] text-[13px] w-full whitespace-pre-wrap">
                  <p className="leading-[1.5] mb-0">Paciente ingresa con cuadro severo de descompensación de ICC secundario a crisis hipertensiva. Se identifica edema pulmonar agudo clínico y radiológico.</p>
                  <p className="leading-[1.5] mb-0">​</p>
                  <p className="leading-[1.5]">El manejo hemodinámico requiere estrecha vigilancia metabólica debido a su antecedente de Diabetes Tipo 2. Se prioriza el uso de diuréticos de asa y soporte de ventilación no invasiva.</p>
                </div>
              </div>
              <div className="bg-[#2563eb] content-stretch flex items-start justify-center px-[16px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="btn-save-note">
                <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[13px] text-white whitespace-nowrap">Actualizar Nota</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
