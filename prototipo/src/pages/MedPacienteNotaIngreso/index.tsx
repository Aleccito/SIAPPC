// Pantalla "med/paciente/nota-ingreso" (Figma node 183:603) — generada desde el diseño original de Figma.
import { Link, useNavigate } from 'react-router-dom';
import imgActivity from '../../assets/activity.svg';
import imgArrowLeft3 from '../../assets/arrow-left-3.svg';
import imgAvatar14Png from '../../assets/avatar-14.png';
import imgBell from '../../assets/bell.svg';
import imgBell3 from '../../assets/bell-3.svg';
import imgBulletItemEllipse from '../../assets/bullet-item-ellipse.svg';
import imgClipboard from '../../assets/clipboard.svg';
import imgCpu from '../../assets/cpu.svg';
import imgFileText from '../../assets/file-text.svg';
import imgFileText2 from '../../assets/file-text-2.svg';
import imgHelpIconEllipse from '../../assets/help-icon-ellipse.svg';
import imgLayoutDashboard from '../../assets/layout-dashboard.svg';
import imgLogOut from '../../assets/log-out.svg';
import imgOptBuenoEllipse from '../../assets/opt-bueno-ellipse.svg';
import imgOptReservadoEllipse from '../../assets/opt-reservado-ellipse.svg';
import imgPatientAvatar6Png from '../../assets/patient-avatar-6.png';
import imgUsers from '../../assets/users.svg';
import imgVacio from '../../assets/vacio.svg';

export default function MedPacienteNotaIngreso() {
  const navigate = useNavigate();
  return (
    <div className="bg-[#f8fafc] content-stretch flex items-start min-h-[900px] overflow-clip relative shrink-0 w-[1440px]" data-name="med/paciente/nota-ingreso">
      <div className="bg-[#0f172a] border-[#1e293b] border-r border-solid content-stretch flex flex-col items-start justify-between px-[16px] py-[24px] relative self-stretch shrink-0 w-[240px]" data-name="sidebar">
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
        <Link className="absolute left-[20px] opacity-25 size-[18px] top-[1215px]" data-name="help-icon" to="/MedAyudaSoporte">
          <div className="absolute left-0 size-[18px] top-0" data-name="Ellipse">
            <div className="absolute inset-[-4.17%]">
              <img className="block max-w-none size-full" alt="" src={imgHelpIconEllipse} />
            </div>
          </div>
          <p className="[word-break:break-word] absolute font-geist font-bold leading-[normal] left-[5.5px] text-[#64748b] text-[11px] top-[1.5px] whitespace-nowrap">?</p>
        </Link>
        <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="doctor-footer">
          <div className="h-0 relative shrink-0 w-full" data-name="Line">
            <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgVacio} />
          </div>
          <Link className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-name="user-profile" to="/MedPerfilMiPerfil">
            <div className="relative rounded-[20px] shrink-0 size-[40px]" data-name="avatar">
              <img className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[20px] size-full" alt="" src={imgAvatar14Png} />
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
      <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px relative" data-name="main-container">
        <div className="bg-white border-[#e2e8f0] border-b border-solid content-stretch flex h-[72px] items-center justify-between px-[32px] relative shrink-0 w-full" data-name="top-bar">
          <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start leading-[normal] relative shrink-0 whitespace-nowrap" data-name="title-breadcrumb">
            <p className="font-jakarta font-medium relative shrink-0 text-[#64748b] text-[11px]">{`SIAPPC > Pacientes > María González > Historia Clínica > Nota de Ingreso`}</p>
            <p className="font-jakarta font-extrabold relative shrink-0 text-[#0f172a] text-[20px]">Nota de Ingreso</p>
          </div>
          <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="right-actions">
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex gap-[6px] items-center px-[12px] py-[8px] relative rounded-[8px] shrink-0 cursor-pointer" data-name="back-btn" role="button" onClick={() => navigate(-1)}>
              <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[14px]" data-name="back-arrow">
                <div className="relative shrink-0 size-[14px]" data-name="arrow-left">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgArrowLeft3} />
                </div>
              </div>
              <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] whitespace-nowrap">Volver</p>
            </div>
            <Link className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex items-start p-[8px] relative rounded-[999px] shrink-0" data-name="bell-icon-wrapper" to="/MedNotificacionesCentro">
              <div className="relative shrink-0 size-[18px]" data-name="bell">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgBell3} />
              </div>
              <div className="absolute bg-[#ef4444] content-stretch flex items-center justify-center right-[-3px] rounded-[8px] size-[16px] top-[-3px]" data-name="unread-badge">
                <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[9px] text-white whitespace-nowrap">3</p>
              </div>
            </Link>
          </div>
        </div>
        <div className="content-stretch flex flex-col gap-[20px] items-start p-[32px] relative shrink-0 w-full" data-name="page-body">
          <div className="bg-white border border-[#e2e8f0] border-solid content-stretch drop-shadow-[0px_4px_6px_rgba(0,0,0,0.02)] flex flex-col items-start p-[20px] relative rounded-[12px] shrink-0 w-full" data-name="patient-header-card">
            <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="patient-header-top">
              <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="patient-info-group">
                <div className="relative rounded-[28px] shrink-0 size-[56px]" data-name="patient-avatar">
                  <img className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[28px] size-full" alt="" src={imgPatientAvatar6Png} />
                </div>
                <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0" data-name="patient-details">
                  <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="name-badge-row">
                    <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#0f172a] text-[22px] whitespace-nowrap">María González</p>
                    <div className="bg-[#fef2f2] content-stretch flex items-start px-[10px] py-[4px] relative rounded-[6px] shrink-0" data-name="critical-badge">
                      <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#ef4444] text-[12px] whitespace-nowrap">Crítico</p>
                    </div>
                    <div className="bg-[#eff6ff] content-stretch flex items-start px-[10px] py-[4px] relative rounded-[6px] shrink-0" data-name="bed-badge">
                      <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#2563eb] text-[12px] whitespace-nowrap">Cama C-03</p>
                    </div>
                  </div>
                  <div className="[word-break:break-word] content-stretch flex gap-[20px] items-center leading-[normal] relative shrink-0 text-[13px] whitespace-nowrap" data-name="meta-row">
                    <p className="font-jakarta font-medium relative shrink-0 text-[#64748b]">ID PT-8821</p>
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
          <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="form-flow">
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[16px] items-start p-[20px] relative rounded-[12px] shrink-0 w-full" data-name="card-datos-admision">
              <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[15px] whitespace-nowrap">Datos de Admisión</p>
              <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full" data-name="fields-grid">
                <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="info-field">
                  <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[11px] uppercase whitespace-nowrap">Fecha y Hora de Ingreso</p>
                  <div className="bg-[#f8fafc] content-stretch flex items-start p-[12px] relative rounded-[8px] shrink-0 w-full" data-name="field-value-box">
                    <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] whitespace-nowrap">15 Oct 2025 08:30</p>
                  </div>
                </div>
                <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="info-field">
                  <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[11px] uppercase whitespace-nowrap">Servicio</p>
                  <div className="bg-[#f8fafc] content-stretch flex items-start p-[12px] relative rounded-[8px] shrink-0 w-full" data-name="field-value-box">
                    <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] whitespace-nowrap">UCI</p>
                  </div>
                </div>
                <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="info-field">
                  <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[11px] uppercase whitespace-nowrap">Cama Asignada</p>
                  <div className="bg-[#f8fafc] content-stretch flex items-start p-[12px] relative rounded-[8px] shrink-0 w-full" data-name="field-value-box">
                    <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] whitespace-nowrap">C-03</p>
                  </div>
                </div>
                <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="info-field">
                  <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[11px] uppercase whitespace-nowrap">Médico Responsable</p>
                  <div className="bg-[#f8fafc] content-stretch flex items-start p-[12px] relative rounded-[8px] shrink-0 w-full" data-name="field-value-box">
                    <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] whitespace-nowrap">Dr. Carlos Méndez</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[16px] items-start p-[20px] relative rounded-[12px] shrink-0 w-full" data-name="card-narrativa">
              <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="section-textarea">
                <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[12px] uppercase whitespace-nowrap">Motivo de Ingreso</p>
                <div className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex items-start min-h-[56px] p-[14px] relative rounded-[8px] shrink-0 w-full" data-name="textarea-box">
                  <p className="[word-break:break-word] flex-[1_0_0] font-jakarta font-normal leading-[1.5] min-w-px relative text-[#0f172a] text-[13px]">Disnea progresiva y dificultad para respirar en reposo de 48 horas de evolución</p>
                </div>
              </div>
              <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="section-textarea">
                <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[12px] uppercase whitespace-nowrap">Padecimiento Actual</p>
                <div className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex items-start min-h-[56px] p-[14px] relative rounded-[8px] shrink-0 w-full" data-name="textarea-box">
                  <p className="[word-break:break-word] flex-[1_0_0] font-jakarta font-normal leading-[1.5] min-w-px relative text-[#0f172a] text-[13px]">Paciente femenina de 67 años con antecedente de Insuficiencia Cardíaca Congestiva (ICC) que presenta disnea progresiva de 48 horas de evolución, exacerbada en decúbito (ortopnea) y acompañada de tos seca no productiva. Al ingreso se documenta taquipnea, desaturación y signos clínicos compatibles con sobrecarga hídrica aguda / edema agudo de pulmón.</p>
                </div>
              </div>
            </div>
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[16px] items-start p-[20px] relative rounded-[12px] shrink-0 w-full" data-name="card-diagnosticos">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="diagnosticos-header">
                <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[15px] whitespace-nowrap">Diagnósticos de Ingreso</p>
                <div className="bg-[#eff6ff] content-stretch flex items-start px-[12px] py-[6px] relative rounded-[6px] shrink-0" data-name="btn-add-diag">
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#2563eb] text-[12px] whitespace-nowrap">+ Agregar Diagnóstico</p>
                </div>
              </div>
              <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col items-start relative rounded-[8px] shrink-0 w-full" data-name="diagnosticos-table">
                <div className="[word-break:break-word] bg-[#f8fafc] border-[#e2e8f0] border-b border-solid content-stretch flex font-jakarta font-bold gap-[12px] items-start leading-[normal] px-[12px] py-[10px] relative shrink-0 text-[#64748b] text-[11px] w-full" data-name="table-head">
                  <p className="relative shrink-0 w-[100px]">CIE-10</p>
                  <p className="flex-[1_0_0] min-w-px relative">DESCRIPCIÓN</p>
                  <p className="relative shrink-0 w-[120px]">TIPO</p>
                </div>
                <div className="border-[#e2e8f0] border-b border-solid content-stretch flex gap-[12px] items-center p-[12px] relative shrink-0 w-full" data-name="table-row-1">
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[100px]">I50.9</p>
                  <p className="[word-break:break-word] flex-[1_0_0] font-jakarta font-medium leading-[normal] min-w-px relative text-[#0f172a] text-[13px]">Insuficiencia Cardíaca Congestiva</p>
                  <div className="bg-[#ecfdf5] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[6px] shrink-0" data-name="badge-definitivo">
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#10b981] text-[11px] whitespace-nowrap">Definitivo</p>
                  </div>
                </div>
                <div className="border-[#e2e8f0] border-b border-solid content-stretch flex gap-[12px] items-center p-[12px] relative shrink-0 w-full" data-name="table-row-2">
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[100px]">J81</p>
                  <p className="[word-break:break-word] flex-[1_0_0] font-jakarta font-medium leading-[normal] min-w-px relative text-[#0f172a] text-[13px]">Edema Pulmonar</p>
                  <div className="bg-[#fef3c7] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[6px] shrink-0" data-name="badge-presuntivo">
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#f59e0b] text-[11px] whitespace-nowrap">Presuntivo</p>
                  </div>
                </div>
                <div className="content-stretch flex gap-[12px] items-center p-[12px] relative shrink-0 w-full" data-name="table-row-3">
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] w-[100px]">I10</p>
                  <p className="[word-break:break-word] flex-[1_0_0] font-jakarta font-medium leading-[normal] min-w-px relative text-[#0f172a] text-[13px]">Hipertensión Arterial</p>
                  <div className="bg-[#ecfdf5] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[6px] shrink-0" data-name="badge-definitivo">
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#10b981] text-[11px] whitespace-nowrap">Definitivo</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full" data-name="plan-pronostico-row">
              <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[12px] items-start min-w-px p-[20px] relative rounded-[12px]" data-name="card-plan-terapeutico">
                <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[15px] whitespace-nowrap">Plan Terapéutico Inicial</p>
                <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full" data-name="bullet-list">
                  <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="bullet-item">
                    <div className="relative shrink-0 size-[6px]" data-name="Ellipse">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgBulletItemEllipse} />
                    </div>
                    <p className="[word-break:break-word] flex-[1_0_0] font-jakarta font-medium leading-[normal] min-w-px relative text-[#0f172a] text-[13px]">Furosemida 40mg IV c/8h</p>
                  </div>
                  <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="bullet-item">
                    <div className="relative shrink-0 size-[6px]" data-name="Ellipse">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgBulletItemEllipse} />
                    </div>
                    <p className="[word-break:break-word] flex-[1_0_0] font-jakarta font-medium leading-[normal] min-w-px relative text-[#0f172a] text-[13px]">Oxígeno por mascarilla 5L/min</p>
                  </div>
                  <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="bullet-item">
                    <div className="relative shrink-0 size-[6px]" data-name="Ellipse">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgBulletItemEllipse} />
                    </div>
                    <p className="[word-break:break-word] flex-[1_0_0] font-jakarta font-medium leading-[normal] min-w-px relative text-[#0f172a] text-[13px]">Monitoreo hemodinámico continuo</p>
                  </div>
                  <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="bullet-item">
                    <div className="relative shrink-0 size-[6px]" data-name="Ellipse">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgBulletItemEllipse} />
                    </div>
                    <p className="[word-break:break-word] flex-[1_0_0] font-jakarta font-medium leading-[normal] min-w-px relative text-[#0f172a] text-[13px]">Restricción hídrica estricta 1500ml/día</p>
                  </div>
                  <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="bullet-item">
                    <div className="relative shrink-0 size-[6px]" data-name="Ellipse">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgBulletItemEllipse} />
                    </div>
                    <p className="[word-break:break-word] flex-[1_0_0] font-jakarta font-medium leading-[normal] min-w-px relative text-[#0f172a] text-[13px]">Ecocardiograma urgente en cama</p>
                  </div>
                </div>
              </div>
              <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[16px] items-start p-[20px] relative rounded-[12px] shrink-0 w-[400px]" data-name="card-pronostico">
                <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[15px] whitespace-nowrap">Pronóstico de Ingreso</p>
                <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full" data-name="options-selector">
                  <div className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex gap-[12px] items-center p-[12px] relative rounded-[8px] shrink-0 w-full" data-name="opt-Bueno">
                    <div className="relative shrink-0 size-[16px]" data-name="Ellipse">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgOptBuenoEllipse} />
                    </div>
                    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px relative whitespace-nowrap" data-name="Frame">
                      <p className="font-jakarta font-bold relative shrink-0 text-[#0f172a] text-[14px]">Bueno</p>
                      <p className="font-jakarta font-medium relative shrink-0 text-[#64748b] text-[11px]">Evolución favorable esperada</p>
                    </div>
                  </div>
                  <div className="bg-[rgba(245,158,11,0.06)] border border-[#f59e0b] border-solid content-stretch flex gap-[12px] items-center p-[12px] relative rounded-[8px] shrink-0 w-full" data-name="opt-Reservado">
                    <div className="relative shrink-0 size-[16px]" data-name="Ellipse">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgOptReservadoEllipse} />
                    </div>
                    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px relative whitespace-nowrap" data-name="Frame">
                      <p className="font-jakarta font-bold relative shrink-0 text-[#0f172a] text-[14px]">Reservado</p>
                      <p className="font-jakarta font-medium relative shrink-0 text-[#64748b] text-[11px]">Evolución incierta sujeta a monitoreo</p>
                    </div>
                  </div>
                  <div className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex gap-[12px] items-center p-[12px] relative rounded-[8px] shrink-0 w-full" data-name="opt-Grave">
                    <div className="relative shrink-0 size-[16px]" data-name="Ellipse">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgOptBuenoEllipse} />
                    </div>
                    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px relative whitespace-nowrap" data-name="Frame">
                      <p className="font-jakarta font-bold relative shrink-0 text-[#0f172a] text-[14px]">Grave</p>
                      <p className="font-jakarta font-medium relative shrink-0 text-[#64748b] text-[11px]">Alto riesgo de complicaciones inminentes</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="content-stretch flex items-start justify-end relative shrink-0 w-full" data-name="actions-row">
              <div className="bg-[#2563eb] content-stretch flex items-start px-[24px] py-[12px] relative rounded-[8px] shrink-0" data-name="btn-guardar">
                <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[14px] text-white whitespace-nowrap">Guardar Nota de Ingreso</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
