// Pantalla "med/paciente/documentos-clinicos" (Figma node 191:553) — generada desde el diseño original de Figma.
import { Link, useNavigate } from 'react-router-dom';
import imgActivity from '../../assets/activity.svg';
import imgArrowLeft3 from '../../assets/arrow-left-3.svg';
import imgAvatar18Png from '../../assets/avatar-18.png';
import imgBell from '../../assets/bell.svg';
import imgBell3 from '../../assets/bell-3.svg';
import imgClipboard from '../../assets/clipboard.svg';
import imgCpu from '../../assets/cpu.svg';
import imgDoctorFooterLine2 from '../../assets/doctor-footer-line-2.svg';
import imgFileText from '../../assets/file-text.svg';
import imgFileText2 from '../../assets/file-text-2.svg';
import imgFileText7 from '../../assets/file-text-7.svg';
import imgHelpIconEllipse from '../../assets/help-icon-ellipse.svg';
import imgImageIcon from '../../assets/image-icon.svg';
import imgLabIcon from '../../assets/lab-icon.svg';
import imgLayoutDashboard from '../../assets/layout-dashboard.svg';
import imgLogOut from '../../assets/log-out.svg';
import imgPatientAvatar10Png from '../../assets/patient-avatar-10.png';
import imgUpload from '../../assets/upload.svg';
import imgUpload2 from '../../assets/upload-2.svg';
import imgUsers from '../../assets/users.svg';

export default function MedPacienteDocumentosClinicos() {
  const navigate = useNavigate();
  return (
    <div className="bg-[#f8fafc] content-stretch flex h-[900px] items-start relative shrink-0 w-[1440px]" data-name="med/paciente/documentos-clinicos">
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
              <img className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[20px] size-full" alt="" src={imgAvatar18Png} />
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
            <p className="font-jakarta font-medium relative shrink-0 text-[#64748b] text-[11px]">{`SIAPPC > Pacientes > María González > Historia Clínica > Documentos`}</p>
            <p className="font-jakarta font-extrabold relative shrink-0 text-[#0f172a] text-[20px]">Documentos Clínicos Adjuntos</p>
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
                  <img className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[28px] size-full" alt="" src={imgPatientAvatar10Png} />
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
            <div className="content-stretch flex items-start px-[16px] py-[12px] relative shrink-0" data-name="tab-Historia Clínica">
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Historia Clínica</p>
            </div>
            <div className="content-stretch flex items-start px-[16px] py-[12px] relative shrink-0" data-name="tab-Notas SOAP">
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Notas SOAP</p>
            </div>
            <div className="content-stretch flex items-start px-[16px] py-[12px] relative shrink-0" data-name="tab-Monitoreo">
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Monitoreo</p>
            </div>
            <div className="border-[#2563eb] border-b-2 border-solid content-stretch flex items-start px-[16px] py-[12px] relative shrink-0" data-name="tab-Documentos">
              <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#2563eb] text-[14px] whitespace-nowrap">Documentos</p>
            </div>
          </div>
          <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="document-actions-row">
            <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="filters-group">
              <div className="bg-[#2563eb] border border-[#e2e8f0] border-solid content-stretch flex items-start px-[16px] py-[8px] relative rounded-[20px] shrink-0" data-name="pill-Todos">
                <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[13px] text-white whitespace-nowrap">Todos</p>
              </div>
              <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-start px-[16px] py-[8px] relative rounded-[20px] shrink-0" data-name="pill-Laboratorio">
                <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[13px] whitespace-nowrap">Laboratorio</p>
              </div>
              <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-start px-[16px] py-[8px] relative rounded-[20px] shrink-0" data-name="pill-Imagen">
                <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[13px] whitespace-nowrap">Imagen</p>
              </div>
              <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-start px-[16px] py-[8px] relative rounded-[20px] shrink-0" data-name="pill-Consentimiento">
                <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[13px] whitespace-nowrap">Consentimiento</p>
              </div>
              <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-start px-[16px] py-[8px] relative rounded-[20px] shrink-0" data-name="pill-Otro">
                <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[13px] whitespace-nowrap">Otro</p>
              </div>
            </div>
            <div className="bg-[#2563eb] content-stretch flex gap-[6px] items-center px-[16px] py-[8px] relative rounded-[8px] shrink-0" data-name="btn-subir">
              <div className="relative shrink-0 size-[14px]" data-name="upload">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgUpload} />
              </div>
              <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[13px] text-white whitespace-nowrap">Subir documento</p>
            </div>
          </div>
          <div className="content-stretch flex flex-[1_0_0] gap-[20px] items-start min-h-px overflow-clip relative w-full" data-name="docs-layout-split">
            <div className="content-stretch flex flex-[1_0_0] flex-col h-full items-start min-w-px overflow-clip relative" data-name="docs-grid">
              <div className="content-stretch flex flex-[1_0_0] flex-col gap-[12px] items-start min-h-px overflow-clip relative w-full" data-name="docs-list">
                <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col items-start p-[16px] relative rounded-[12px] shrink-0 w-full" data-name="doc-card-0">
                  <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full" data-name="Frame">
                    <div className="bg-[#fef2f2] content-stretch flex flex-col items-center justify-center relative rounded-[8px] shrink-0 size-[40px]" data-name="pdf-icon">
                      <div className="relative shrink-0 size-[20px]" data-name="file-text">
                        <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgFileText7} />
                      </div>
                    </div>
                    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[6px] items-start leading-[normal] min-w-px relative" data-name="Frame">
                      <p className="font-jakarta font-bold overflow-hidden relative shrink-0 text-[#0f172a] text-[14px] text-ellipsis w-full whitespace-nowrap">Consentimiento Informado</p>
                      <p className="font-jakarta font-medium relative shrink-0 text-[#64748b] text-[11px] w-full">Tipo: Consentimiento · Subido por: Admisión</p>
                      <p className="font-jakarta font-medium italic relative shrink-0 text-[#64748b] text-[11px] w-full">Firmado por paciente y familiar responsable al ingreso UCI</p>
                    </div>
                    <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="doc-card-actions">
                      <div className="border border-[#e2e8f0] border-solid content-stretch flex items-start px-[12px] py-[6px] relative rounded-[6px] shrink-0" data-name="Frame">
                        <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#475569] text-[12px] whitespace-nowrap">Ver</p>
                      </div>
                      <div className="bg-[#f1f5f9] border border-[#e2e8f0] border-solid content-stretch flex items-start px-[12px] py-[6px] relative rounded-[6px] shrink-0" data-name="Frame">
                        <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[12px] whitespace-nowrap">Descargar</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col items-start p-[16px] relative rounded-[12px] shrink-0 w-full" data-name="doc-card-1">
                  <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full" data-name="Frame">
                    <div className="bg-[#dcfce7] content-stretch flex flex-col items-center justify-center relative rounded-[8px] shrink-0 size-[40px]" data-name="lab-icon">
                      <div className="relative shrink-0 size-[20px]" data-name="lab-icon">
                        <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgLabIcon} />
                      </div>
                    </div>
                    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[6px] items-start leading-[normal] min-w-px relative" data-name="Frame">
                      <p className="font-jakarta font-bold overflow-hidden relative shrink-0 text-[#0f172a] text-[14px] text-ellipsis w-full whitespace-nowrap">Resultados de Laboratorio - 23 Oct 2025</p>
                      <p className="font-jakarta font-medium relative shrink-0 text-[#64748b] text-[11px] w-full">Tipo: Laboratorio · Subido por: Dr. Carlos Méndez</p>
                      <p className="font-jakarta font-medium italic relative shrink-0 text-[#64748b] text-[11px] w-full">BH completa, QS, electrolitos séricos, gasometría arterial. Valores críticos marcados.</p>
                    </div>
                    <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="doc-card-actions">
                      <div className="border border-[#e2e8f0] border-solid content-stretch flex items-start px-[12px] py-[6px] relative rounded-[6px] shrink-0" data-name="Frame">
                        <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#475569] text-[12px] whitespace-nowrap">Ver</p>
                      </div>
                      <div className="bg-[#f1f5f9] border border-[#e2e8f0] border-solid content-stretch flex items-start px-[12px] py-[6px] relative rounded-[6px] shrink-0" data-name="Frame">
                        <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[12px] whitespace-nowrap">Descargar</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col items-start p-[16px] relative rounded-[12px] shrink-0 w-full" data-name="doc-card-2">
                  <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full" data-name="Frame">
                    <div className="bg-[#dbeafe] content-stretch flex flex-col items-center justify-center relative rounded-[8px] shrink-0 size-[40px]" data-name="image-icon">
                      <div className="relative shrink-0 size-[20px]" data-name="image-icon">
                        <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgImageIcon} />
                      </div>
                    </div>
                    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[6px] items-start leading-[normal] min-w-px relative" data-name="Frame">
                      <p className="font-jakarta font-bold overflow-hidden relative shrink-0 text-[#0f172a] text-[14px] text-ellipsis w-full whitespace-nowrap">Radiografía de Tórax AP</p>
                      <p className="font-jakarta font-medium relative shrink-0 text-[#64748b] text-[11px] w-full">Tipo: Imagen · Subido por: Radiología</p>
                      <p className="font-jakarta font-medium italic relative shrink-0 text-[#64748b] text-[11px] w-full">Infiltrados bilaterales basales compatibles con edema pulmonar. Comparar con estudio previo 18 Oct.</p>
                    </div>
                    <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="doc-card-actions">
                      <div className="border border-[#e2e8f0] border-solid content-stretch flex items-start px-[12px] py-[6px] relative rounded-[6px] shrink-0" data-name="Frame">
                        <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#475569] text-[12px] whitespace-nowrap">Ver</p>
                      </div>
                      <div className="bg-[#f1f5f9] border border-[#e2e8f0] border-solid content-stretch flex items-start px-[12px] py-[6px] relative rounded-[6px] shrink-0" data-name="Frame">
                        <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[12px] whitespace-nowrap">Descargar</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col items-start p-[16px] relative rounded-[12px] shrink-0 w-full" data-name="doc-card-3">
                  <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full" data-name="Frame">
                    <div className="bg-[#dbeafe] content-stretch flex flex-col items-center justify-center relative rounded-[8px] shrink-0 size-[40px]" data-name="image-icon">
                      <div className="relative shrink-0 size-[20px]" data-name="image-icon">
                        <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgImageIcon} />
                      </div>
                    </div>
                    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[6px] items-start leading-[normal] min-w-px relative" data-name="Frame">
                      <p className="font-jakarta font-bold overflow-hidden relative shrink-0 text-[#0f172a] text-[14px] text-ellipsis w-full whitespace-nowrap">Ecocardiograma Transtorácico</p>
                      <p className="font-jakarta font-medium relative shrink-0 text-[#64748b] text-[11px] w-full">Tipo: Imagen · Subido por: Cardiología</p>
                      <p className="font-jakarta font-medium italic relative shrink-0 text-[#64748b] text-[11px] w-full">FEVI 35%, hipocinesia global. Insuficiencia mitral moderada.</p>
                    </div>
                    <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="doc-card-actions">
                      <div className="border border-[#e2e8f0] border-solid content-stretch flex items-start px-[12px] py-[6px] relative rounded-[6px] shrink-0" data-name="Frame">
                        <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#475569] text-[12px] whitespace-nowrap">Ver</p>
                      </div>
                      <div className="bg-[#f1f5f9] border border-[#e2e8f0] border-solid content-stretch flex items-start px-[12px] py-[6px] relative rounded-[6px] shrink-0" data-name="Frame">
                        <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[12px] whitespace-nowrap">Descargar</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[20px] h-full items-start p-[24px] relative rounded-[12px] shrink-0 w-[380px]" data-name="upload-aside">
              <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[15px] whitespace-nowrap">Área de Carga</p>
              <div className="bg-[#f8fafc] border border-[#2563eb] border-dashed content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-center justify-center min-h-px p-[32px] relative rounded-[10px] w-full" data-name="drag-zone">
                <div className="relative shrink-0 size-[32px]" data-name="upload">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgUpload2} />
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-col gap-[8px] items-center leading-[normal] relative shrink-0 text-center whitespace-nowrap" data-name="Frame">
                  <p className="font-jakarta font-bold relative shrink-0 text-[#0f172a] text-[13px]">Arrastra archivos aquí</p>
                  <p className="font-jakarta font-normal relative shrink-0 text-[#64748b] text-[11px]">o haz clic para subir</p>
                  <p className="font-jakarta font-semibold relative shrink-0 text-[#94a3b8] text-[10px]">PDF, JPG, PNG - máx 10MB</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
