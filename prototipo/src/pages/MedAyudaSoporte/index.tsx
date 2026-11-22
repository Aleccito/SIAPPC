// Pantalla "med/ayuda/soporte" (Figma node 331:1578) — generada desde el diseño original de Figma.
import { Link } from 'react-router-dom';
import imgActivity5 from '../../assets/activity-5.svg';
import imgAvatar12Png from '../../assets/avatar-12.png';
import imgBook from '../../assets/book.svg';
import imgChevronDown2 from '../../assets/chevron-down-2.svg';
import imgChevronDown4 from '../../assets/chevron-down-4.svg';
import imgClipboard3 from '../../assets/clipboard-3.svg';
import imgDoctorFooterLine2 from '../../assets/doctor-footer-line-2.svg';
import imgHelpIconEllipse from '../../assets/help-icon-ellipse.svg';
import imgIconAlertas from '../../assets/icon-alertas.svg';
import imgIconAsset0fb36318 from '../../assets/icon-asset-0fb36318.svg';
import imgIconAsset5eb9b748 from '../../assets/icon-asset-5eb9b748.svg';
import imgIconAsset7cf55aea from '../../assets/icon-asset-7cf55aea.svg';
import imgIconAssetBe1a93ac from '../../assets/icon-asset-be1a93ac.svg';
import imgIconDashboard from '../../assets/icon-dashboard.svg';
import imgIconDispositivos from '../../assets/icon-dispositivos.svg';
import imgIconMonitoreo from '../../assets/icon-monitoreo.svg';
import imgLiveIndicatorEllipse from '../../assets/live-indicator-ellipse.svg';
import imgLogout from '../../assets/logout.svg';
import imgPhone from '../../assets/phone.svg';
import imgStatusPillEllipse from '../../assets/status-pill-ellipse.svg';
import imgWrench from '../../assets/wrench.svg';

export default function MedAyudaSoporte() {
  return (
    <div className="bg-[#f8fafe] content-stretch flex h-[900px] items-start overflow-clip relative shrink-0 w-[1440px]" data-name="med/ayuda/soporte">
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
              <div className="relative shrink-0 size-[18px]" data-name="Icon-asset:9a502ccf">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgIconDashboard} />
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Dashboard</p>
            </Link>
            <Link className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Pacientes" to="/MedPacientesLista">
              <div className="relative shrink-0 size-[18px]" data-name="Icon-asset:0fb36318">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgIconAsset0fb36318} />
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Pacientes</p>
            </Link>
            <Link className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Monitoreo" to="/MedMonitoreoGridUci">
              <div className="relative shrink-0 size-[18px]" data-name="Icon-asset:432e56f3">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgIconMonitoreo} />
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Monitoreo</p>
            </Link>
            <Link className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Alertas" to="/MedAlertasCentro">
              <div className="relative shrink-0 size-[18px]" data-name="Icon-asset:2ca5b09a">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgIconAlertas} />
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Alertas</p>
            </Link>
            <Link className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Reportes" to="/MedReportesPanel">
              <div className="relative shrink-0 size-[18px]" data-name="Icon-asset:7cf55aea">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgIconAsset7cf55aea} />
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Reportes</p>
            </Link>
            <Link className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Dispositivos" to="/MedDispositivosMonitores">
              <div className="relative shrink-0 size-[18px]" data-name="Icon-asset:701497d8">
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
              <img className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[20px] size-full" alt="" src={imgAvatar12Png} />
            </div>
            <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px relative whitespace-nowrap" data-name="user-info">
              <p className="font-jakarta font-bold overflow-hidden relative shrink-0 text-[13px] text-ellipsis text-white">Dr. Roberto Silva</p>
              <p className="font-jakarta font-medium overflow-hidden relative shrink-0 text-[#64748b] text-[11px] text-ellipsis">Médico Especialista</p>
            </div>
            <div className="relative shrink-0 size-[18px]" data-name="Icon-asset:c5be5c7b">
              <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgLogout} />
            </div>
          </Link>
        </div>
      </div>
      <div className="content-stretch flex flex-col h-full items-start relative shrink-0 w-[1200px]" data-name="main-container">
        <div className="bg-white border-[#e2e8f0] border-b border-solid content-stretch flex h-[72px] items-center justify-between px-[32px] relative shrink-0 w-full" data-name="top-bar">
          <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start leading-[normal] relative shrink-0 whitespace-nowrap" data-name="title-breadcrumb">
            <p className="font-jakarta font-medium relative shrink-0 text-[#64748b] text-[12px]">{`SIAPPC > Ayuda y Soporte`}</p>
            <p className="font-jakarta font-extrabold relative shrink-0 text-[#0f172a] text-[20px]">Centro de Soporte</p>
          </div>
          <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="right-actions">
            <div className="bg-[#d1fae5] content-stretch flex gap-[8px] items-center px-[12px] py-[6px] relative rounded-[999px] shrink-0" data-name="status-pill">
              <div className="relative shrink-0 size-[8px]" data-name="Ellipse">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgStatusPillEllipse} />
              </div>
              <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#10b981] text-[12px] whitespace-nowrap">Servicios Operativos</p>
            </div>
            <Link className="bg-[#f8fafe] border border-[#e2e8f0] border-solid content-stretch flex items-center justify-center relative rounded-[18px] shrink-0 size-[36px]" data-name="notification-bell" to="/MedNotificacionesCentro">
              <div className="relative shrink-0 size-[18px]" data-name="Icon-asset:5eb9b748">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgIconAsset5eb9b748} />
              </div>
              <div className="absolute bg-[#ef4444] content-stretch flex items-center justify-center right-[-3px] rounded-[8px] size-[16px] top-[-3px]" data-name="red-badge">
                <p className="[word-break:break-word] font-geist font-extrabold leading-[normal] relative shrink-0 text-[10px] text-white whitespace-nowrap">3</p>
              </div>
            </Link>
          </div>
        </div>
        <div className="content-stretch flex flex-[1_0_0] flex-col gap-[28px] items-start min-h-px p-[32px] relative w-full" data-name="page-body">
          <div className="[word-break:break-word] content-stretch flex flex-col gap-[6px] items-start leading-[normal] relative shrink-0 w-full whitespace-nowrap" data-name="page-header">
            <p className="font-jakarta font-extrabold relative shrink-0 text-[#0f172a] text-[24px]">Ayuda y Soporte</p>
            <p className="font-jakarta font-normal relative shrink-0 text-[#64748b] text-[14px]">Encuentra respuestas o contacta al equipo técnico</p>
          </div>
          <div className="bg-white border border-[#e2e8f0] border-solid content-stretch drop-shadow-[0px_2px_4px_rgba(0,0,0,0.02)] flex gap-[12px] items-center px-[16px] py-[12px] relative rounded-[12px] shrink-0 w-full" data-name="search">
            <div className="relative shrink-0 size-[18px]" data-name="Icon-asset:be1a93ac">
              <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgIconAssetBe1a93ac} />
            </div>
            <p className="[word-break:break-word] flex-[1_0_0] font-jakarta font-normal leading-[normal] min-w-px relative text-[#94a3b8] text-[15px]">Busca en la base de conocimiento...</p>
          </div>
          <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="categories-section">
            <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#0f172a] text-[16px] whitespace-nowrap">Base de conocimiento</p>
            <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full" data-name="grid-row-1">
              <div className="bg-white border border-[#e2e8f0] border-solid content-stretch drop-shadow-[0px_4px_6px_rgba(0,0,0,0.02)] flex flex-[1_0_0] gap-[16px] items-center min-w-px p-[24px] relative rounded-[12px]" data-name="category-card-Uso del Sistema">
                <div className="bg-[rgba(37,99,235,0.15)] content-stretch flex flex-col items-center justify-center p-[12px] relative rounded-[10px] shrink-0" data-name="icon-wrapper">
                  <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[24px]" data-name="Icon-caption:book">
                    <div className="relative shrink-0 size-[24px]" data-name="book">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgBook} />
                    </div>
                  </div>
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start leading-[normal] min-w-px relative" data-name="text-group">
                  <p className="font-jakarta font-bold relative shrink-0 text-[#0f172a] text-[16px] w-full">Uso del Sistema</p>
                  <p className="font-geist font-normal relative shrink-0 text-[#64748b] text-[13px] w-full">Guías generales y primeros pasos</p>
                </div>
              </div>
              <div className="bg-white border border-[#e2e8f0] border-solid content-stretch drop-shadow-[0px_4px_6px_rgba(0,0,0,0.02)] flex flex-[1_0_0] gap-[16px] items-center min-w-px p-[24px] relative rounded-[12px]" data-name="category-card-Monitoreo y Alertas">
                <div className="bg-[rgba(37,99,235,0.15)] content-stretch flex flex-col items-center justify-center p-[12px] relative rounded-[10px] shrink-0" data-name="icon-wrapper">
                  <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[24px]" data-name="Icon-caption:activity">
                    <div className="relative shrink-0 size-[24px]" data-name="activity">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgActivity5} />
                    </div>
                  </div>
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start leading-[normal] min-w-px relative" data-name="text-group">
                  <p className="font-jakarta font-bold relative shrink-0 text-[#0f172a] text-[16px] w-full">Monitoreo y Alertas</p>
                  <p className="font-geist font-normal relative shrink-0 text-[#64748b] text-[13px] w-full">Configuración y gestión de umbrales clínicos</p>
                </div>
              </div>
            </div>
            <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full" data-name="grid-row-2">
              <div className="bg-white border border-[#e2e8f0] border-solid content-stretch drop-shadow-[0px_4px_6px_rgba(0,0,0,0.02)] flex flex-[1_0_0] gap-[16px] items-center min-w-px p-[24px] relative rounded-[12px]" data-name="category-card-Notas SOAP e Historia Clínica">
                <div className="bg-[rgba(37,99,235,0.15)] content-stretch flex flex-col items-center justify-center p-[12px] relative rounded-[10px] shrink-0" data-name="icon-wrapper">
                  <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[24px]" data-name="Icon-caption:clipboard">
                    <div className="relative shrink-0 size-[24px]" data-name="clipboard">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgClipboard3} />
                    </div>
                  </div>
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start leading-[normal] min-w-px relative" data-name="text-group">
                  <p className="font-jakarta font-bold relative shrink-0 text-[#0f172a] text-[16px] w-full">Notas SOAP e Historia Clínica</p>
                  <p className="font-geist font-normal relative shrink-0 text-[#64748b] text-[13px] w-full">Documentación y registro clínico estructurado</p>
                </div>
              </div>
              <div className="bg-white border border-[#e2e8f0] border-solid content-stretch drop-shadow-[0px_4px_6px_rgba(0,0,0,0.02)] flex flex-[1_0_0] gap-[16px] items-center min-w-px p-[24px] relative rounded-[12px]" data-name="category-card-Problemas Técnicos / Conectividad">
                <div className="bg-[rgba(37,99,235,0.15)] content-stretch flex flex-col items-center justify-center p-[12px] relative rounded-[10px] shrink-0" data-name="icon-wrapper">
                  <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[24px]" data-name="Icon-caption:wrench">
                    <div className="relative shrink-0 size-[24px]" data-name="wrench">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgWrench} />
                    </div>
                  </div>
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start leading-[normal] min-w-px relative" data-name="text-group">
                  <p className="font-jakarta font-bold relative shrink-0 text-[#0f172a] text-[16px] w-full">Problemas Técnicos / Conectividad</p>
                  <p className="font-geist font-normal relative shrink-0 text-[#64748b] text-[13px] w-full">Diagnósticos de red y sensores inalámbricos</p>
                </div>
              </div>
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="faq-section">
            <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#0f172a] text-[16px] whitespace-nowrap">Preguntas frecuentes</p>
            <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="faq-list">
              <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col gap-[12px] items-start p-[18px] relative rounded-[10px] shrink-0 w-full" data-name="faq-item">
                <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="header-row">
                  <p className="[word-break:break-word] flex-[1_0_0] font-jakarta font-semibold leading-[normal] min-w-px overflow-hidden relative text-[#0f172a] text-[15px] text-ellipsis whitespace-nowrap">¿Cómo confirmo una alerta?</p>
                  <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[16px]" data-name="Icon-caption:chevron-up">
                    <div className="relative shrink-0 size-[16px]" data-name="chevron-up">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgChevronDown2} />
                    </div>
                  </div>
                </div>
                <div className="content-stretch flex flex-col items-start pt-[4px] relative shrink-0 w-full" data-name="answer-row">
                  <p className="[word-break:break-word] font-geist font-normal leading-[22px] relative shrink-0 text-[#64748b] text-[14px] w-full">Para confirmar una alerta activa, presione el indicador de alerta en el panel de monitoreo y seleccione 'Confirmar Atención'. Deberá registrar brevemente la acción realizada en el paciente para archivar la alerta correctamente en el historial.</p>
                </div>
              </div>
              <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col items-start p-[18px] relative rounded-[10px] shrink-0 w-full" data-name="faq-item">
                <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="header-row">
                  <p className="[word-break:break-word] flex-[1_0_0] font-jakarta font-semibold leading-[normal] min-w-px overflow-hidden relative text-[#0f172a] text-[15px] text-ellipsis whitespace-nowrap">¿Qué hago si un sensor se desconecta?</p>
                  <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[16px]" data-name="Icon-caption:chevron-down">
                    <div className="relative shrink-0 size-[16px]" data-name="chevron-down">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgChevronDown4} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col items-start p-[18px] relative rounded-[10px] shrink-0 w-full" data-name="faq-item">
                <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="header-row">
                  <p className="[word-break:break-word] flex-[1_0_0] font-jakarta font-semibold leading-[normal] min-w-px overflow-hidden relative text-[#0f172a] text-[15px] text-ellipsis whitespace-nowrap">¿Cómo registro una nota SOAP?</p>
                  <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[16px]" data-name="Icon-caption:chevron-down">
                    <div className="relative shrink-0 size-[16px]" data-name="chevron-down">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgChevronDown4} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col items-start p-[18px] relative rounded-[10px] shrink-0 w-full" data-name="faq-item">
                <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="header-row">
                  <p className="[word-break:break-word] flex-[1_0_0] font-jakarta font-semibold leading-[normal] min-w-px overflow-hidden relative text-[#0f172a] text-[15px] text-ellipsis whitespace-nowrap">¿Puedo modificar umbrales de un paciente?</p>
                  <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[16px]" data-name="Icon-caption:chevron-down">
                    <div className="relative shrink-0 size-[16px]" data-name="chevron-down">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgChevronDown4} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col items-start p-[18px] relative rounded-[10px] shrink-0 w-full" data-name="faq-item">
                <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="header-row">
                  <p className="[word-break:break-word] flex-[1_0_0] font-jakarta font-semibold leading-[normal] min-w-px overflow-hidden relative text-[#0f172a] text-[15px] text-ellipsis whitespace-nowrap">¿Cómo genero un reporte de turno?</p>
                  <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[16px]" data-name="Icon-caption:chevron-down">
                    <div className="relative shrink-0 size-[16px]" data-name="chevron-down">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgChevronDown4} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex flex-col items-start p-[18px] relative rounded-[10px] shrink-0 w-full" data-name="faq-item">
                <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="header-row">
                  <p className="[word-break:break-word] flex-[1_0_0] font-jakarta font-semibold leading-[normal] min-w-px overflow-hidden relative text-[#0f172a] text-[15px] text-ellipsis whitespace-nowrap">¿Dónde veo el historial de signos vitales?</p>
                  <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[16px]" data-name="Icon-caption:chevron-down">
                    <div className="relative shrink-0 size-[16px]" data-name="chevron-down">
                      <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgChevronDown4} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-[#e2e8f0] border-solid content-stretch drop-shadow-[0px_4px_8px_rgba(0,0,0,0.03)] flex items-center justify-between p-[24px] relative rounded-[16px] shrink-0 w-full" data-name="contact-support-card">
            <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0" data-name="contact-left">
              <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#0f172a] text-[18px] whitespace-nowrap">Contacto directo</p>
              <p className="[word-break:break-word] font-geist font-normal leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Soporte técnico 24/7 disponible para incidencias clínicas críticas</p>
              <div className="content-stretch flex gap-[8px] items-center pt-[8px] relative shrink-0" data-name="phone-number">
                <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[16px]" data-name="Icon-caption:phone">
                  <div className="relative shrink-0 size-[16px]" data-name="phone">
                    <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgPhone} />
                  </div>
                </div>
                <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#2563eb] text-[16px] whitespace-nowrap">+52 800 123 4567</p>
              </div>
            </div>
            <div className="content-stretch flex flex-col gap-[12px] items-end relative shrink-0" data-name="contact-right">
              <div className="bg-[#2563eb] content-stretch flex items-start px-[24px] py-[12px] relative rounded-[8px] shrink-0" data-name="cta-button">
                <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[14px] text-white whitespace-nowrap">Contactar Soporte Técnico</p>
              </div>
              <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="sub-status">
                <div className="relative shrink-0 size-[6px]" data-name="Ellipse">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgLiveIndicatorEllipse} />
                </div>
                <p className="[word-break:break-word] font-geist font-normal leading-[normal] relative shrink-0 text-[#64748b] text-[12px] whitespace-nowrap">Todos los sistemas operativos</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
