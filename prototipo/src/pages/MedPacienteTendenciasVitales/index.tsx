// Pantalla "med/paciente/tendencias-vitales" (Figma node 140:6) — generada desde el diseño original de Figma.
import { Link, useNavigate } from 'react-router-dom';
import imgActivity from '../../assets/activity.svg';
import imgAlertTextEllipse from '../../assets/alert-text-ellipse.svg';
import imgAlertTextEllipse2 from '../../assets/alert-text-ellipse-2.svg';
import imgArrowLeft4 from '../../assets/arrow-left-4.svg';
import imgAvatar2Png from '../../assets/avatar-2.png';
import imgBell from '../../assets/bell.svg';
import imgBell3 from '../../assets/bell-3.svg';
import imgChartCanvasEllipse from '../../assets/chart-canvas-ellipse.svg';
import imgChartCanvasEllipse2 from '../../assets/chart-canvas-ellipse-2.svg';
import imgChartCanvasEllipse3 from '../../assets/chart-canvas-ellipse-3.svg';
import imgChartCanvasLine from '../../assets/chart-canvas-line.svg';
import imgChartCanvasLine10 from '../../assets/chart-canvas-line-10.svg';
import imgChartCanvasLine11 from '../../assets/chart-canvas-line-11.svg';
import imgChartCanvasLine12 from '../../assets/chart-canvas-line-12.svg';
import imgChartCanvasLine13 from '../../assets/chart-canvas-line-13.svg';
import imgChartCanvasLine14 from '../../assets/chart-canvas-line-14.svg';
import imgChartCanvasLine15 from '../../assets/chart-canvas-line-15.svg';
import imgChartCanvasLine16 from '../../assets/chart-canvas-line-16.svg';
import imgChartCanvasLine17 from '../../assets/chart-canvas-line-17.svg';
import imgChartCanvasLine18 from '../../assets/chart-canvas-line-18.svg';
import imgChartCanvasLine19 from '../../assets/chart-canvas-line-19.svg';
import imgChartCanvasLine2 from '../../assets/chart-canvas-line-2.svg';
import imgChartCanvasLine20 from '../../assets/chart-canvas-line-20.svg';
import imgChartCanvasLine21 from '../../assets/chart-canvas-line-21.svg';
import imgChartCanvasLine22 from '../../assets/chart-canvas-line-22.svg';
import imgChartCanvasLine23 from '../../assets/chart-canvas-line-23.svg';
import imgChartCanvasLine24 from '../../assets/chart-canvas-line-24.svg';
import imgChartCanvasLine25 from '../../assets/chart-canvas-line-25.svg';
import imgChartCanvasLine3 from '../../assets/chart-canvas-line-3.svg';
import imgChartCanvasLine4 from '../../assets/chart-canvas-line-4.svg';
import imgChartCanvasLine5 from '../../assets/chart-canvas-line-5.svg';
import imgChartCanvasLine6 from '../../assets/chart-canvas-line-6.svg';
import imgChartCanvasLine7 from '../../assets/chart-canvas-line-7.svg';
import imgChartCanvasLine8 from '../../assets/chart-canvas-line-8.svg';
import imgChartCanvasLine9 from '../../assets/chart-canvas-line-9.svg';
import imgChartCanvasLinePng from '../../assets/chart-canvas-line.png';
import imgClipboard from '../../assets/clipboard.svg';
import imgCpu from '../../assets/cpu.svg';
import imgDoctorFooterLine from '../../assets/doctor-footer-line.svg';
import imgFileText from '../../assets/file-text.svg';
import imgFileText2 from '../../assets/file-text-2.svg';
import imgHelpIconEllipse from '../../assets/help-icon-ellipse.svg';
import imgHome2 from '../../assets/home-2.svg';
import imgLogOut from '../../assets/log-out.svg';
import imgPatientAvatarPng from '../../assets/patient-avatar.png';
import imgSearch2 from '../../assets/search-2.svg';
import imgUsers from '../../assets/users.svg';

export default function MedPacienteTendenciasVitales() {
  const navigate = useNavigate();
  return (
    <div className="bg-[#f8fafc] content-stretch flex h-[900px] items-start overflow-clip relative shrink-0 w-[1440px]" data-name="med/paciente/tendencias-vitales">
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
            <p className="font-jakarta font-medium relative shrink-0 text-[#64748b] text-[12px]">{`SIAPPC > Pacientes > María González > Tendencias`}</p>
            <p className="font-jakarta font-extrabold relative shrink-0 text-[#0f172a] text-[20px]">Tendencias de Signos Vitales</p>
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
          <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="control-bar">
            <div className="content-stretch flex gap-[8px] items-center relative shrink-0 cursor-pointer" data-name="btn-back-link" role="button" onClick={() => navigate(-1)}>
              <div className="relative shrink-0 size-[16px]" data-name="arrow-left">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgArrowLeft4} />
              </div>
              <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#2563eb] text-[14px] whitespace-nowrap">Volver a Monitoreo en Vivo</p>
            </div>
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex gap-[4px] items-start p-[4px] relative rounded-[8px] shrink-0" data-name="time-tabs">
              <div className="content-stretch flex items-start px-[14px] py-[6px] relative rounded-[6px] shrink-0" data-name="time-tab-6h">
                <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[13px] whitespace-nowrap">6h</p>
              </div>
              <div className="content-stretch flex items-start px-[14px] py-[6px] relative rounded-[6px] shrink-0" data-name="time-tab-12h">
                <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[13px] whitespace-nowrap">12h</p>
              </div>
              <div className="bg-[#2563eb] content-stretch flex items-start px-[14px] py-[6px] relative rounded-[6px] shrink-0" data-name="time-tab-24h">
                <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[13px] text-white whitespace-nowrap">24h</p>
              </div>
              <div className="content-stretch flex items-start px-[14px] py-[6px] relative rounded-[6px] shrink-0" data-name="time-tab-48h">
                <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[13px] whitespace-nowrap">48h</p>
              </div>
              <div className="content-stretch flex items-start px-[14px] py-[6px] relative rounded-[6px] shrink-0" data-name="time-tab-7d">
                <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#64748b] text-[13px] whitespace-nowrap">7d</p>
              </div>
            </div>
          </div>
          <div className="flex-[1_0_0] gap-x-[20px] gap-y-[20px] grid grid-cols-[repeat(2,minmax(0,1fr))] grid-rows-[repeat(2,minmax(0,1fr))] min-h-px relative w-full" data-name="Frame">
            <div className="bg-white border border-[#e2e8f0] border-solid col-start-1 content-stretch flex flex-col gap-[16px] items-start justify-self-stretch p-[20px] relative rounded-[12px] row-start-1 self-start shrink-0" data-name="chart-card">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="card-header">
                <div className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0" data-name="header-left">
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">FC (Frecuencia Cardíaca)</p>
                  <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="current-badge">
                    <div className="relative shrink-0 size-[8px]" data-name="Ellipse">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgAlertTextEllipse2} />
                    </div>
                    <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#ef4444] text-[12px] whitespace-nowrap">Alerta Taquicardia</p>
                  </div>
                </div>
                <div className="[word-break:break-word] content-stretch flex gap-[4px] items-baseline leading-[normal] relative shrink-0 whitespace-nowrap" data-name="header-right">
                  <p className="font-jakarta font-extrabold relative shrink-0 text-[#ef4444] text-[28px]">112</p>
                  <p className="font-jakarta font-semibold relative shrink-0 text-[#64748b] text-[14px]">bpm</p>
                </div>
              </div>
              <div className="bg-[#0f172a] h-[110px] relative rounded-[8px] shrink-0 w-[512px]" data-name="chart-canvas">
                <div className="absolute h-0 left-0 top-[37px] w-[512px]" data-name="Line">
                  <div className="absolute inset-[-1px_0_0_0]">
                    <img className="block max-w-none size-full" alt="" src={imgChartCanvasLine} />
                  </div>
                </div>
                <div className="absolute h-0 left-0 top-[73px] w-[512px]" data-name="Line">
                  <div className="absolute inset-[-1px_0_0_0]">
                    <img className="block max-w-none size-full" alt="" src={imgChartCanvasLine} />
                  </div>
                </div>
                <div className="absolute h-0 left-0 top-[26px] w-[512px]" data-name="Line">
                  <div className="absolute inset-[-1px_0_0_0]">
                    <img className="block max-w-none size-full" alt="" src={imgChartCanvasLinePng} width="512" height="1" />
                  </div>
                </div>
                <p className="[word-break:break-word] absolute font-jakarta font-bold leading-[normal] left-[10px] text-[#ef4444] text-[9px] top-[14px] whitespace-nowrap">Límite: 120</p>
                <div className="absolute flex h-[9.001px] items-center justify-center left-[20px] top-[86px] w-[94px]">
                  <div className="flex-none rotate-[-5.47deg]">
                    <div className="h-0 relative w-[94.43px]" data-name="Line">
                      <div className="absolute inset-[-1.5px_0_0_0]">
                        <img className="block max-w-none size-full" alt="" src={imgChartCanvasLine2} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute flex h-[39.003px] items-center justify-center left-[114px] top-[47px] w-[95.005px]">
                  <div className="flex-none rotate-[-22.32deg]">
                    <div className="h-0 relative w-[102.7px]" data-name="Line">
                      <div className="absolute inset-[-1.5px_0_0_0]">
                        <img className="block max-w-none size-full" alt="" src={imgChartCanvasLine3} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute flex h-[32.001px] items-center justify-center left-[209px] top-[15px] w-[94.002px]">
                  <div className="flex-none rotate-[-18.8deg]">
                    <div className="h-0 relative w-[99.3px]" data-name="Line">
                      <div className="absolute inset-[-1.5px_0_0_0]">
                        <img className="block max-w-none size-full" alt="" src={imgChartCanvasLine4} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute flex h-[22.001px] items-center justify-center left-[303px] top-[15px] w-[94.995px]">
                  <div className="flex-none rotate-[13.04deg]">
                    <div className="h-0 relative w-[97.51px]" data-name="Line">
                      <div className="absolute inset-[-1.5px_0_0_0]">
                        <img className="block max-w-none size-full" alt="" src={imgChartCanvasLine5} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute flex h-[5.996px] items-center justify-center left-[398px] top-[37px] w-[93.999px]">
                  <div className="flex-none rotate-[3.65deg]">
                    <div className="h-0 relative w-[94.19px]" data-name="Line">
                      <div className="absolute inset-[-1.5px_0_0_0]">
                        <img className="block max-w-none size-full" alt="" src={imgChartCanvasLine6} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute left-[16px] size-[8px] top-[91px]" data-name="Ellipse">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgChartCanvasEllipse} />
                </div>
                <div className="absolute left-[110px] size-[8px] top-[82px]" data-name="Ellipse">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgChartCanvasEllipse} />
                </div>
                <div className="absolute left-[205px] size-[8px] top-[43px]" data-name="Ellipse">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgChartCanvasEllipse} />
                </div>
                <div className="absolute left-[299px] size-[8px] top-[11px]" data-name="Ellipse">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgChartCanvasEllipse} />
                </div>
                <div className="absolute left-[394px] size-[8px] top-[33px]" data-name="Ellipse">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgChartCanvasEllipse} />
                </div>
                <div className="absolute left-[488px] size-[8px] top-[39px]" data-name="Ellipse">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgChartCanvasEllipse} />
                </div>
                <div className="absolute bg-[#2563eb] content-stretch flex items-start left-[452px] px-[6px] py-[2px] rounded-[4px] top-[13px]" data-name="last-val-tooltip">
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[10px] text-white whitespace-nowrap">112</p>
                </div>
              </div>
              <div className="[word-break:break-word] content-stretch flex font-jakarta font-normal items-start justify-between leading-[normal] relative shrink-0 text-[#94a3b8] text-[10px] w-full whitespace-nowrap" data-name="x-labels">
                <p className="relative shrink-0">08:00</p>
                <p className="relative shrink-0">12:00</p>
                <p className="relative shrink-0">16:00</p>
                <p className="relative shrink-0">20:00</p>
                <p className="relative shrink-0">00:00</p>
                <p className="relative shrink-0">04:00</p>
              </div>
            </div>
            <div className="bg-white border border-[#e2e8f0] border-solid col-start-2 content-stretch flex flex-col gap-[16px] items-start justify-self-stretch p-[20px] relative rounded-[12px] row-start-1 self-start shrink-0" data-name="chart-card">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="card-header">
                <div className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0" data-name="header-left">
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">SpO2 (Saturación de Oxígeno)</p>
                  <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="current-badge">
                    <div className="relative shrink-0 size-[8px]" data-name="Ellipse">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgAlertTextEllipse} />
                    </div>
                    <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#f59e0b] text-[12px] whitespace-nowrap">Advertencia Desaturación</p>
                  </div>
                </div>
                <div className="[word-break:break-word] content-stretch flex gap-[4px] items-baseline leading-[normal] relative shrink-0 whitespace-nowrap" data-name="header-right">
                  <p className="font-jakarta font-extrabold relative shrink-0 text-[#0f172a] text-[28px]">93</p>
                  <p className="font-jakarta font-semibold relative shrink-0 text-[#64748b] text-[14px]">%</p>
                </div>
              </div>
              <div className="bg-[#0f172a] h-[110px] relative rounded-[8px] shrink-0 w-[512px]" data-name="chart-canvas">
                <div className="absolute h-0 left-0 top-[37px] w-[512px]" data-name="Line">
                  <div className="absolute inset-[-1px_0_0_0]">
                    <img className="block max-w-none size-full" alt="" src={imgChartCanvasLine} />
                  </div>
                </div>
                <div className="absolute h-0 left-0 top-[73px] w-[512px]" data-name="Line">
                  <div className="absolute inset-[-1px_0_0_0]">
                    <img className="block max-w-none size-full" alt="" src={imgChartCanvasLine} />
                  </div>
                </div>
                <div className="absolute h-0 left-0 top-[84px] w-[512px]" data-name="Line">
                  <div className="absolute inset-[-1px_0_0_0]">
                    <img className="block max-w-none size-full" alt="" src={imgChartCanvasLinePng} width="512" height="1" />
                  </div>
                </div>
                <p className="[word-break:break-word] absolute font-jakarta font-bold leading-[normal] left-[10px] text-[#ef4444] text-[9px] top-[72px] whitespace-nowrap">Límite: 92</p>
                <div className="absolute flex h-[23.001px] items-center justify-center left-[20px] top-[15px] w-[93.997px]">
                  <div className="flex-none rotate-[13.75deg]">
                    <div className="h-0 relative w-[96.77px]" data-name="Line">
                      <div className="absolute inset-[-1.5px_0_0_0]">
                        <img className="block max-w-none size-full" alt="" src={imgChartCanvasLine7} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute flex h-[22.999px] items-center justify-center left-[114px] top-[38px] w-[94.995px]">
                  <div className="flex-none rotate-[13.61deg]">
                    <div className="h-0 relative w-[97.74px]" data-name="Line">
                      <div className="absolute inset-[-1.5px_0_0_0]">
                        <img className="block max-w-none size-full" alt="" src={imgChartCanvasLine8} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute flex h-[34.008px] items-center justify-center left-[209px] top-[61px] w-[93.997px]">
                  <div className="flex-none rotate-[19.89deg]">
                    <div className="h-0 relative w-[99.96px]" data-name="Line">
                      <div className="absolute inset-[-1.5px_0_0_0]">
                        <img className="block max-w-none size-full" alt="" src={imgChartCanvasLine9} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute flex h-[10.991px] items-center justify-center left-[303px] top-[84.01px] w-[94.996px]">
                  <div className="flex-none rotate-[-6.6deg]">
                    <div className="h-0 relative w-[95.63px]" data-name="Line">
                      <div className="absolute inset-[-1.5px_0_0_0]">
                        <img className="block max-w-none size-full" alt="" src={imgChartCanvasLine10} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute flex h-[12.008px] items-center justify-center left-[398px] top-[71.99px] w-[93.996px]">
                  <div className="flex-none rotate-[-7.28deg]">
                    <div className="h-0 relative w-[94.76px]" data-name="Line">
                      <div className="absolute inset-[-1.5px_0_0_0]">
                        <img className="block max-w-none size-full" alt="" src={imgChartCanvasLine11} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute left-[16px] size-[8px] top-[11px]" data-name="Ellipse">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgChartCanvasEllipse} />
                </div>
                <div className="absolute left-[110px] size-[8px] top-[34px]" data-name="Ellipse">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgChartCanvasEllipse} />
                </div>
                <div className="absolute left-[205px] size-[8px] top-[57px]" data-name="Ellipse">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgChartCanvasEllipse} />
                </div>
                <div className="absolute left-[299px] size-[8px] top-[91px]" data-name="Ellipse">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgChartCanvasEllipse} />
                </div>
                <div className="absolute left-[394px] size-[8px] top-[80px]" data-name="Ellipse">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgChartCanvasEllipse} />
                </div>
                <div className="absolute left-[488px] size-[8px] top-[68px]" data-name="Ellipse">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgChartCanvasEllipse} />
                </div>
                <div className="absolute bg-[#2563eb] content-stretch flex items-start left-[452px] px-[6px] py-[2px] rounded-[4px] top-[42px]" data-name="last-val-tooltip">
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[10px] text-white whitespace-nowrap">93</p>
                </div>
              </div>
              <div className="[word-break:break-word] content-stretch flex font-jakarta font-normal items-start justify-between leading-[normal] relative shrink-0 text-[#94a3b8] text-[10px] w-full whitespace-nowrap" data-name="x-labels">
                <p className="relative shrink-0">08:00</p>
                <p className="relative shrink-0">12:00</p>
                <p className="relative shrink-0">16:00</p>
                <p className="relative shrink-0">20:00</p>
                <p className="relative shrink-0">00:00</p>
                <p className="relative shrink-0">04:00</p>
              </div>
            </div>
            <div className="bg-white border border-[#e2e8f0] border-solid col-start-1 content-stretch flex flex-col gap-[16px] items-start justify-self-stretch p-[20px] relative rounded-[12px] row-start-2 self-start shrink-0" data-name="chart-card">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="card-header">
                <div className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0" data-name="header-left">
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">PA (Presión Arterial)</p>
                  <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="current-badge">
                    <div className="relative shrink-0 size-[8px]" data-name="Ellipse">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgAlertTextEllipse} />
                    </div>
                    <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#f59e0b] text-[12px] whitespace-nowrap">PA Elevada</p>
                  </div>
                </div>
                <div className="[word-break:break-word] content-stretch flex gap-[4px] items-baseline leading-[normal] relative shrink-0 whitespace-nowrap" data-name="header-right">
                  <p className="font-jakarta font-extrabold relative shrink-0 text-[#0f172a] text-[28px]">145/92</p>
                  <p className="font-jakarta font-semibold relative shrink-0 text-[#64748b] text-[14px]">mmHg</p>
                </div>
              </div>
              <div className="bg-[#0f172a] h-[110px] relative rounded-[8px] shrink-0 w-[512px]" data-name="chart-canvas">
                <div className="absolute h-0 left-0 top-[37px] w-[512px]" data-name="Line">
                  <div className="absolute inset-[-1px_0_0_0]">
                    <img className="block max-w-none size-full" alt="" src={imgChartCanvasLine} />
                  </div>
                </div>
                <div className="absolute h-0 left-0 top-[73px] w-[512px]" data-name="Line">
                  <div className="absolute inset-[-1px_0_0_0]">
                    <img className="block max-w-none size-full" alt="" src={imgChartCanvasLine} />
                  </div>
                </div>
                <div className="absolute h-0 left-0 top-[23px] w-[512px]" data-name="Line">
                  <div className="absolute inset-[-1px_0_0_0]">
                    <img className="block max-w-none size-full" alt="" src={imgChartCanvasLinePng} width="512" height="1" />
                  </div>
                </div>
                <div className="absolute h-0 left-0 top-[71px] w-[512px]" data-name="Line">
                  <div className="absolute inset-[-1px_0_0_0]">
                    <img className="block max-w-none size-full" alt="" src={imgChartCanvasLinePng} width="512" height="1" />
                  </div>
                </div>
                <div className="absolute flex h-[4.006px] items-center justify-center left-[20px] top-[40.99px] w-[94.005px]">
                  <div className="flex-none rotate-[-2.44deg]">
                    <div className="h-0 relative w-[94.09px]" data-name="Line">
                      <div className="absolute inset-[-1.5px_0_0_0]">
                        <img className="block max-w-none size-full" alt="" src={imgChartCanvasLine12} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute flex h-[3.998px] items-center justify-center left-[114px] top-[37px] w-[94.996px]">
                  <div className="flex-none rotate-[-2.41deg]">
                    <div className="h-0 relative w-[95.08px]" data-name="Line">
                      <div className="absolute inset-[-1.5px_0_0_0]">
                        <img className="block max-w-none size-full" alt="" src={imgChartCanvasLine13} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute flex h-[9.996px] items-center justify-center left-[209px] top-[27px] w-[94px]">
                  <div className="flex-none rotate-[-6.07deg]">
                    <div className="h-0 relative w-[94.53px]" data-name="Line">
                      <div className="absolute inset-[-1.5px_0_0_0]">
                        <img className="block max-w-none size-full" alt="" src={imgChartCanvasLine14} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute flex h-[5.994px] items-center justify-center left-[303px] top-[27px] w-[95.001px]">
                  <div className="flex-none rotate-[3.61deg]">
                    <div className="h-0 relative w-[95.19px]" data-name="Line">
                      <div className="absolute inset-[-1.5px_0_0_0]">
                        <img className="block max-w-none size-full" alt="" src={imgChartCanvasLine15} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute flex h-[2.002px] items-center justify-center left-[398px] top-[33px] w-[93.999px]">
                  <div className="flex-none rotate-[1.22deg]">
                    <div className="h-0 relative w-[94.02px]" data-name="Line">
                      <div className="absolute inset-[-1.5px_0_0_0]">
                        <img className="block max-w-none size-full" alt="" src={imgChartCanvasLine16} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute left-[17px] size-[6px] top-[42px]" data-name="Ellipse">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgChartCanvasEllipse2} />
                </div>
                <div className="absolute left-[111px] size-[6px] top-[38px]" data-name="Ellipse">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgChartCanvasEllipse2} />
                </div>
                <div className="absolute left-[206px] size-[6px] top-[34px]" data-name="Ellipse">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgChartCanvasEllipse2} />
                </div>
                <div className="absolute left-[300px] size-[6px] top-[24px]" data-name="Ellipse">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgChartCanvasEllipse2} />
                </div>
                <div className="absolute left-[395px] size-[6px] top-[30px]" data-name="Ellipse">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgChartCanvasEllipse2} />
                </div>
                <div className="absolute left-[489px] size-[6px] top-[32px]" data-name="Ellipse">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgChartCanvasEllipse2} />
                </div>
                <div className="absolute flex h-[2.002px] items-center justify-center left-[20px] top-[83px] w-[93.999px]">
                  <div className="flex-none rotate-[-1.22deg]">
                    <div className="h-0 relative w-[94.02px]" data-name="Line">
                      <div className="absolute inset-[-1.5px_0_0_0]">
                        <img className="block max-w-none size-full" alt="" src={imgChartCanvasLine17} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute flex h-[3.998px] items-center justify-center left-[114px] top-[79px] w-[94.996px]">
                  <div className="flex-none rotate-[-2.41deg]">
                    <div className="h-0 relative w-[95.08px]" data-name="Line">
                      <div className="absolute inset-[-1.5px_0_0_0]">
                        <img className="block max-w-none size-full" alt="" src={imgChartCanvasLine18} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute flex h-[4.006px] items-center justify-center left-[209px] top-[74.99px] w-[94.005px]">
                  <div className="flex-none rotate-[-2.44deg]">
                    <div className="h-0 relative w-[94.09px]" data-name="Line">
                      <div className="absolute inset-[-1.5px_0_0_0]">
                        <img className="block max-w-none size-full" alt="" src={imgChartCanvasLine19} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute flex h-px items-center justify-center left-[303px] top-[75px] w-[95.005px]">
                  <div className="flex-none rotate-[0.6deg]">
                    <div className="h-0 relative w-[95.01px]" data-name="Line">
                      <div className="absolute inset-[-1.5px_0_0_0]">
                        <img className="block max-w-none size-full" alt="" src={imgChartCanvasLine20} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute flex h-px items-center justify-center left-[398px] top-[76px] w-[94.005px]">
                  <div className="flex-none rotate-[0.61deg]">
                    <div className="h-0 relative w-[94.01px]" data-name="Line">
                      <div className="absolute inset-[-1.5px_0_0_0]">
                        <img className="block max-w-none size-full" alt="" src={imgChartCanvasLine21} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute left-[17px] size-[6px] top-[82px]" data-name="Ellipse">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgChartCanvasEllipse3} />
                </div>
                <div className="absolute left-[111px] size-[6px] top-[80px]" data-name="Ellipse">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgChartCanvasEllipse3} />
                </div>
                <div className="absolute left-[206px] size-[6px] top-[76px]" data-name="Ellipse">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgChartCanvasEllipse3} />
                </div>
                <div className="absolute left-[300px] size-[6px] top-[72px]" data-name="Ellipse">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgChartCanvasEllipse3} />
                </div>
                <div className="absolute left-[395px] size-[6px] top-[73px]" data-name="Ellipse">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgChartCanvasEllipse3} />
                </div>
                <div className="absolute left-[489px] size-[6px] top-[74px]" data-name="Ellipse">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgChartCanvasEllipse3} />
                </div>
              </div>
              <div className="[word-break:break-word] content-stretch flex font-jakarta font-normal items-start justify-between leading-[normal] relative shrink-0 text-[#94a3b8] text-[10px] w-full whitespace-nowrap" data-name="x-labels">
                <p className="relative shrink-0">08:00</p>
                <p className="relative shrink-0">12:00</p>
                <p className="relative shrink-0">16:00</p>
                <p className="relative shrink-0">20:00</p>
                <p className="relative shrink-0">00:00</p>
                <p className="relative shrink-0">04:00</p>
              </div>
            </div>
            <div className="bg-white border border-[#e2e8f0] border-solid col-start-2 content-stretch flex flex-col gap-[16px] items-start justify-self-stretch p-[20px] relative rounded-[12px] row-start-2 self-start shrink-0" data-name="chart-card">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="card-header">
                <div className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0" data-name="header-left">
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Temperatura</p>
                  <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="current-badge">
                    <div className="relative shrink-0 size-[8px]" data-name="Ellipse">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgAlertTextEllipse} />
                    </div>
                    <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#f59e0b] text-[12px] whitespace-nowrap">Estado Febril</p>
                  </div>
                </div>
                <div className="[word-break:break-word] content-stretch flex gap-[4px] items-baseline leading-[normal] relative shrink-0 whitespace-nowrap" data-name="header-right">
                  <p className="font-jakarta font-extrabold relative shrink-0 text-[#0f172a] text-[28px]">37.8</p>
                  <p className="font-jakarta font-semibold relative shrink-0 text-[#64748b] text-[14px]">°C</p>
                </div>
              </div>
              <div className="bg-[#0f172a] h-[110px] relative rounded-[8px] shrink-0 w-[512px]" data-name="chart-canvas">
                <div className="absolute h-0 left-0 top-[37px] w-[512px]" data-name="Line">
                  <div className="absolute inset-[-1px_0_0_0]">
                    <img className="block max-w-none size-full" alt="" src={imgChartCanvasLine} />
                  </div>
                </div>
                <div className="absolute h-0 left-0 top-[73px] w-[512px]" data-name="Line">
                  <div className="absolute inset-[-1px_0_0_0]">
                    <img className="block max-w-none size-full" alt="" src={imgChartCanvasLine} />
                  </div>
                </div>
                <div className="absolute h-0 left-0 top-[20px] w-[512px]" data-name="Line">
                  <div className="absolute inset-[-1px_0_0_0]">
                    <img className="block max-w-none size-full" alt="" src={imgChartCanvasLinePng} width="512" height="1" />
                  </div>
                </div>
                <p className="[word-break:break-word] absolute font-jakarta font-bold leading-[normal] left-[10px] text-[#ef4444] text-[9px] top-[8px] whitespace-nowrap">Límite: 38</p>
                <div className="absolute flex h-[10.993px] items-center justify-center left-[20px] top-[84.01px] w-[93.999px]">
                  <div className="flex-none rotate-[-6.67deg]">
                    <div className="h-0 relative w-[94.64px]" data-name="Line">
                      <div className="absolute inset-[-1.5px_0_0_0]">
                        <img className="block max-w-none size-full" alt="" src={imgChartCanvasLine22} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute flex h-[20.991px] items-center justify-center left-[114px] top-[63.01px] w-[94.999px]">
                  <div className="flex-none rotate-[-12.46deg]">
                    <div className="h-0 relative w-[97.29px]" data-name="Line">
                      <div className="absolute inset-[-1.5px_0_0_0]">
                        <img className="block max-w-none size-full" alt="" src={imgChartCanvasLine23} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute flex h-[47.978px] items-center justify-center left-[209px] top-[15.02px] w-[93.959px]">
                  <div className="flex-none rotate-[-27.05deg]">
                    <div className="h-0 relative w-[105.5px]" data-name="Line">
                      <div className="absolute inset-[-1.5px_0_0_0]">
                        <img className="block max-w-none size-full" alt="" src={imgChartCanvasLine24} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute flex h-[10.991px] items-center justify-center left-[303px] top-[15px] w-[94.996px]">
                  <div className="flex-none rotate-[6.6deg]">
                    <div className="h-0 relative w-[95.63px]" data-name="Line">
                      <div className="absolute inset-[-1.5px_0_0_0]">
                        <img className="block max-w-none size-full" alt="" src={imgChartCanvasLine10} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute flex h-[4.992px] items-center justify-center left-[398px] top-[26px] w-[93.998px]">
                  <div className="flex-none rotate-[3.04deg]">
                    <div className="h-0 relative w-[94.13px]" data-name="Line">
                      <div className="absolute inset-[-1.5px_0_0_0]">
                        <img className="block max-w-none size-full" alt="" src={imgChartCanvasLine25} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute left-[16px] size-[8px] top-[91px]" data-name="Ellipse">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgChartCanvasEllipse} />
                </div>
                <div className="absolute left-[110px] size-[8px] top-[80px]" data-name="Ellipse">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgChartCanvasEllipse} />
                </div>
                <div className="absolute left-[205px] size-[8px] top-[59px]" data-name="Ellipse">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgChartCanvasEllipse} />
                </div>
                <div className="absolute left-[299px] size-[8px] top-[11px]" data-name="Ellipse">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgChartCanvasEllipse} />
                </div>
                <div className="absolute left-[394px] size-[8px] top-[22px]" data-name="Ellipse">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgChartCanvasEllipse} />
                </div>
                <div className="absolute left-[488px] size-[8px] top-[27px]" data-name="Ellipse">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgChartCanvasEllipse} />
                </div>
                <div className="absolute bg-[#2563eb] content-stretch flex items-start left-[452px] px-[6px] py-[2px] rounded-[4px] top-px" data-name="last-val-tooltip">
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[10px] text-white whitespace-nowrap">37.8</p>
                </div>
              </div>
              <div className="[word-break:break-word] content-stretch flex font-jakarta font-normal items-start justify-between leading-[normal] relative shrink-0 text-[#94a3b8] text-[10px] w-full whitespace-nowrap" data-name="x-labels">
                <p className="relative shrink-0">08:00</p>
                <p className="relative shrink-0">12:00</p>
                <p className="relative shrink-0">16:00</p>
                <p className="relative shrink-0">20:00</p>
                <p className="relative shrink-0">00:00</p>
                <p className="relative shrink-0">04:00</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
