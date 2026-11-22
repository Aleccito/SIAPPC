// Pantalla "med/paciente/antecedentes" (Figma node 183:421) — generada desde el diseño original de Figma.
import { Link, useNavigate } from 'react-router-dom';
import imgAvatar13Png from '../../assets/avatar-13.png';
import imgBackArrow from '../../assets/back-arrow.svg';
import imgBtnNuevaNotaVector from '../../assets/btn-nueva-nota-vector.svg';
import imgBtnReporteVector from '../../assets/btn-reporte-vector.svg';
import imgDoctorFooterLine2 from '../../assets/doctor-footer-line-2.svg';
import imgHelpIconEllipse from '../../assets/help-icon-ellipse.svg';
import imgIconAlertas from '../../assets/icon-alertas.svg';
import imgIconDashboard from '../../assets/icon-dashboard.svg';
import imgIconDispositivos from '../../assets/icon-dispositivos.svg';
import imgIconMonitoreo from '../../assets/icon-monitoreo.svg';
import imgIconPacientes from '../../assets/icon-pacientes.svg';
import imgIconReportes from '../../assets/icon-reportes.svg';
import imgIconwrapper2 from '../../assets/iconwrapper-2.svg';
import imgLogout from '../../assets/logout.svg';
import imgPatientAvatar5Png from '../../assets/patient-avatar-5.png';

export default function MedPacienteAntecedentes() {
  const navigate = useNavigate();
  return (
    <div className="bg-[#f8fafc] content-stretch flex h-[900px] items-start overflow-clip relative shrink-0 w-[1440px]" data-name="med/paciente/antecedentes">
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
              <img className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[20px] size-full" alt="" src={imgAvatar13Png} />
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
            <p className="font-jakarta font-medium relative shrink-0 text-[#64748b] text-[12px]">{`SIAPPC > Pacientes > María González > Historia Clínica > Antecedentes`}</p>
            <p className="font-jakarta font-extrabold relative shrink-0 text-[#0f172a] text-[20px]">Antecedentes Completos</p>
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
                  <img className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[28px] size-full" alt="" src={imgPatientAvatar5Png} />
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
          <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex gap-[8px] h-[40px] items-center px-[16px] relative rounded-[12px] shrink-0 w-full" data-name="sub-tab-bar">
            <div className="bg-[#eff6ff] content-stretch flex items-start px-[12px] py-[6px] relative rounded-[6px] shrink-0" data-name="subtab-Heredofamiliares">
              <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#2563eb] text-[13px] whitespace-nowrap">Heredofamiliares</p>
            </div>
            <div className="content-stretch flex items-start px-[12px] py-[6px] relative rounded-[6px] shrink-0" data-name="subtab-Personales Patológicos">
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[13px] whitespace-nowrap">Personales Patológicos</p>
            </div>
            <div className="content-stretch flex items-start px-[12px] py-[6px] relative rounded-[6px] shrink-0" data-name="subtab-No Patológicos">
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[13px] whitespace-nowrap">No Patológicos</p>
            </div>
            <div className="content-stretch flex items-start px-[12px] py-[6px] relative rounded-[6px] shrink-0" data-name="subtab-Gineco-obstétricos">
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[13px] whitespace-nowrap">Gineco-obstétricos</p>
            </div>
          </div>
          <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[20px] items-start p-[24px] relative rounded-[12px] shrink-0 w-full" data-name="antecedentes-panel">
            <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="panel-header">
              <div className="[word-break:break-word] content-stretch flex gap-[8px] items-center leading-[normal] relative shrink-0 whitespace-nowrap" data-name="panel-title-group">
                <p className="font-jakarta font-extrabold relative shrink-0 text-[#0f172a] text-[16px]">Antecedentes Heredofamiliares</p>
                <p className="font-jakarta font-normal relative shrink-0 text-[#64748b] text-[12px]">(5 registros documentados)</p>
              </div>
              <div className="bg-[#eff6ff] content-stretch flex items-start px-[16px] py-[8px] relative rounded-[8px] shrink-0" data-name="btn-add">
                <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#2563eb] text-[13px] whitespace-nowrap">+ Agregar Antecedente</p>
              </div>
            </div>
            <div className="border border-[#e2e8f0] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[8px] shrink-0 w-full" data-name="antecedentes-table">
              <div className="[word-break:break-word] bg-[#f8fafc] border-[#e2e8f0] border-b border-solid content-stretch flex font-jakarta font-bold gap-[12px] items-start leading-[normal] px-[16px] py-[12px] relative shrink-0 text-[#64748b] text-[12px] w-full" data-name="table-header">
                <p className="flex-[1_0_0] min-w-px relative">ENFERMEDAD / CONDICIÓN</p>
                <p className="relative shrink-0 w-[180px]">RELACIÓN FAMILIAR</p>
                <p className="relative shrink-0 w-[140px]">ESTADO</p>
                <p className="relative shrink-0 w-[280px]">OBSERVACIONES / DETALLES</p>
              </div>
              <div className="border-[#e2e8f0] border-b border-solid content-stretch flex gap-[12px] items-center px-[16px] py-[14px] relative shrink-0 w-full" data-name="table-row-1">
                <p className="[word-break:break-word] flex-[1_0_0] font-jakarta font-bold leading-[normal] min-w-px relative text-[#0f172a] text-[14px]">Diabetes Mellitus Tipo 2</p>
                <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#0f172a] text-[14px] w-[180px]">Madre</p>
                <div className="content-stretch flex items-start relative shrink-0 w-[140px]" data-name="Frame">
                  <div className="bg-[#fef2f2] content-stretch flex items-start px-[8px] py-[2px] relative rounded-[4px] shrink-0" data-name="Frame">
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#ef4444] text-[12px] whitespace-nowrap">Positivo</p>
                  </div>
                </div>
                <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#64748b] text-[14px] w-[280px]">Diagnosticada en 2010. Tratamiento oral.</p>
              </div>
              <div className="border-[#e2e8f0] border-b border-solid content-stretch flex gap-[12px] items-center px-[16px] py-[14px] relative shrink-0 w-full" data-name="table-row-2">
                <p className="[word-break:break-word] flex-[1_0_0] font-jakarta font-bold leading-[normal] min-w-px relative text-[#0f172a] text-[14px]">Hipertensión Arterial</p>
                <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#0f172a] text-[14px] w-[180px]">Padre</p>
                <div className="content-stretch flex items-start relative shrink-0 w-[140px]" data-name="Frame">
                  <div className="bg-[#fef2f2] content-stretch flex items-start px-[8px] py-[2px] relative rounded-[4px] shrink-0" data-name="Frame">
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#ef4444] text-[12px] whitespace-nowrap">Positivo</p>
                  </div>
                </div>
                <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#64748b] text-[14px] w-[280px]">En tratamiento farmacológico continuo.</p>
              </div>
              <div className="border-[#e2e8f0] border-b border-solid content-stretch flex gap-[12px] items-center px-[16px] py-[14px] relative shrink-0 w-full" data-name="table-row-3">
                <p className="[word-break:break-word] flex-[1_0_0] font-jakarta font-bold leading-[normal] min-w-px relative text-[#0f172a] text-[14px]">Cáncer Gástrico</p>
                <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#0f172a] text-[14px] w-[180px]">Abuela materna</p>
                <div className="content-stretch flex items-start relative shrink-0 w-[140px]" data-name="Frame">
                  <div className="bg-[#fef2f2] content-stretch flex items-start px-[8px] py-[2px] relative rounded-[4px] shrink-0" data-name="Frame">
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#ef4444] text-[12px] whitespace-nowrap">Positivo</p>
                  </div>
                </div>
                <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#64748b] text-[14px] w-[280px]">Fallecida a los 72 años por neoplasia gástrica.</p>
              </div>
              <div className="border-[#e2e8f0] border-b border-solid content-stretch flex gap-[12px] items-center px-[16px] py-[14px] relative shrink-0 w-full" data-name="table-row-4">
                <p className="[word-break:break-word] flex-[1_0_0] font-jakarta font-medium leading-[normal] min-w-px relative text-[#64748b] text-[14px]">Cardiopatía Isquémica</p>
                <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#64748b] text-[14px] w-[180px]">Negado</p>
                <div className="content-stretch flex items-start relative shrink-0 w-[140px]" data-name="Frame">
                  <div className="bg-[#f8fafc] content-stretch flex items-start px-[8px] py-[2px] relative rounded-[4px] shrink-0" data-name="Frame">
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[12px] whitespace-nowrap">-</p>
                  </div>
                </div>
                <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#64748b] text-[14px] w-[280px]">Sin antecedentes reportados.</p>
              </div>
              <div className="content-stretch flex gap-[12px] items-center px-[16px] py-[14px] relative shrink-0 w-full" data-name="table-row-5">
                <p className="[word-break:break-word] flex-[1_0_0] font-jakarta font-medium leading-[normal] min-w-px relative text-[#64748b] text-[14px]">Enfermedades Psiquiátricas / Mentales</p>
                <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#64748b] text-[14px] w-[180px]">Negado</p>
                <div className="content-stretch flex items-start relative shrink-0 w-[140px]" data-name="Frame">
                  <div className="bg-[#f8fafc] content-stretch flex items-start px-[8px] py-[2px] relative rounded-[4px] shrink-0" data-name="Frame">
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[12px] whitespace-nowrap">-</p>
                  </div>
                </div>
                <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#64748b] text-[14px] w-[280px]">Sin antecedentes reportados.</p>
              </div>
            </div>
          </div>
          <div className="[word-break:break-word] bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[12px] items-start leading-[normal] opacity-60 p-[20px] relative rounded-[12px] shrink-0 w-full whitespace-nowrap" data-name="inactive-tab-preview">
            <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Frame">
              <p className="font-jakarta font-bold relative shrink-0 text-[#64748b] text-[13px]">Sección siguiente: Antecedentes Personales Patológicos</p>
              <p className="font-jakarta font-semibold relative shrink-0 text-[#2563eb] text-[11px]">Ver sección →</p>
            </div>
            <p className="font-jakarta font-normal relative shrink-0 text-[#64748b] text-[12px]">Incluye cirugías previas, hospitalizaciones previas, transfusiones, alergias severas y comorbilidades sistémicas activas.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
