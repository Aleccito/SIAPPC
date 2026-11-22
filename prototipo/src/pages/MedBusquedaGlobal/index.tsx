// Pantalla "med/busqueda/global" (Figma node 245:498) — generada desde el diseño original de Figma.
import { Link } from 'react-router-dom';
import imgAvatar8Png from '../../assets/avatar-8.png';
import imgBell3 from '../../assets/bell-3.svg';
import imgClipboard2 from '../../assets/clipboard-2.svg';
import imgDoctorFooterLine5 from '../../assets/doctor-footer-line-5.svg';
import imgFile from '../../assets/file.svg';
import imgHelpIconEllipse from '../../assets/help-icon-ellipse.svg';
import imgLayoutDashboard from '../../assets/layout-dashboard.svg';
import imgLogOut from '../../assets/log-out.svg';
import imgMenuItemAlertasFrame from '../../assets/menu-item-alertas-frame.svg';
import imgMenuItemDispositivosFrame from '../../assets/menu-item-dispositivos-frame.svg';
import imgMenuItemMonitoreoFrame from '../../assets/menu-item-monitoreo-frame.svg';
import imgMenuItemPacientesFrame from '../../assets/menu-item-pacientes-frame.svg';
import imgMenuItemReportesFrame from '../../assets/menu-item-reportes-frame.svg';
import imgSearch2 from '../../assets/search-2.svg';
import imgUser2 from '../../assets/user-2.svg';
import imgUser3 from '../../assets/user-3.svg';
import imgX from '../../assets/x.svg';

export default function MedBusquedaGlobal() {
  return (
    <div className="bg-[#f8fafc] content-stretch flex h-[900px] items-start overflow-clip relative shrink-0 w-[1440px]" data-name="med/busqueda/global">
      <div className="bg-[#0f172a] border-[#1e293b] border-r border-solid content-stretch flex flex-col h-full items-start justify-between px-[16px] py-[24px] relative shrink-0 w-[240px]" data-name="sidebar">
        <div className="content-stretch flex flex-col gap-[32px] items-start relative shrink-0 w-full" data-name="top-group">
          <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-name="brand">
            <div className="bg-[#2563eb] content-stretch flex flex-col items-center justify-center relative rounded-[8px] shrink-0 size-[32px]" data-name="logo-mark">
              <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[14px] text-white whitespace-nowrap">S</p>
            </div>
            <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[normal] min-w-px relative whitespace-nowrap" data-name="wordmark">
              <p className="font-jakarta font-extrabold relative shrink-0 text-[16px] text-white">SIAPPC</p>
              <p className="font-jakarta font-semibold overflow-hidden relative shrink-0 text-[#94a3b8] text-[10px] text-ellipsis uppercase">CUIDADO CRÍTICO</p>
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="menu">
            <Link className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Dashboard" to="/MedDashboardPrincipal">
              <div className="relative shrink-0 size-[18px]" data-name="Frame">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgLayoutDashboard} />
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Dashboard</p>
            </Link>
            <Link className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Pacientes" to="/MedPacientesLista">
              <div className="relative shrink-0 size-[18px]" data-name="Frame">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgMenuItemPacientesFrame} />
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Pacientes</p>
            </Link>
            <Link className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Monitoreo" to="/MedMonitoreoGridUci">
              <div className="relative shrink-0 size-[18px]" data-name="Frame">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgMenuItemMonitoreoFrame} />
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Monitoreo</p>
            </Link>
            <Link className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Alertas" to="/MedAlertasCentro">
              <div className="relative shrink-0 size-[18px]" data-name="Frame">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgMenuItemAlertasFrame} />
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Alertas</p>
            </Link>
            <Link className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Reportes" to="/MedReportesPanel">
              <div className="relative shrink-0 size-[18px]" data-name="Frame">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgMenuItemReportesFrame} />
              </div>
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Reportes</p>
            </Link>
            <Link className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="menu-item-Dispositivos" to="/MedDispositivosMonitores">
              <div className="relative shrink-0 size-[18px]" data-name="Frame">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgMenuItemDispositivosFrame} />
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
              <img className="block max-w-none size-full" alt="" src={imgDoctorFooterLine5} />
            </div>
          </div>
          <Link className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-name="user-profile" to="/MedPerfilMiPerfil">
            <div className="relative rounded-[20px] shrink-0 size-[40px]" data-name="avatar">
              <img className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[20px] size-full" alt="" src={imgAvatar8Png} />
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
      <div className="content-stretch flex flex-[1_0_0] flex-col h-full items-start min-w-px relative" data-name="main-container">
        <div className="bg-white border-[#e2e8f0] border-b border-solid content-stretch flex h-[72px] items-center justify-between px-[32px] relative shrink-0 w-full" data-name="top-bar">
          <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start leading-[normal] relative shrink-0 whitespace-nowrap" data-name="title-breadcrumb">
            <p className="font-jakarta font-medium relative shrink-0 text-[#64748b] text-[11px]">{`SIAPPC > Búsqueda`}</p>
            <p className="font-jakarta font-extrabold relative shrink-0 text-[#0f172a] text-[20px]">Búsqueda Global</p>
          </div>
          <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="right-actions-custom">
            <Link className="bg-[#f8fafc] border border-[#e2e8f0] border-solid content-stretch flex gap-[8px] items-center px-[12px] py-[8px] relative rounded-[8px] shrink-0 w-[280px]" data-name="search-mimic" to="/MedBusquedaGlobal">
              <div className="relative shrink-0 size-[14px]" data-name="search">
                <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgSearch2} />
              </div>
              <p className="[word-break:break-word] flex-[1_0_0] font-jakarta font-normal leading-[normal] min-w-px relative text-[#0f172a] text-[13px]">González</p>
              <div className="overflow-clip relative shrink-0 size-[14px]" data-name="Frame">
                <div className="absolute left-0 size-[10px] top-0" data-name="x">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgX} />
                </div>
              </div>
            </Link>
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
        <div className="content-stretch flex flex-[1_0_0] flex-col gap-[20px] items-start min-h-px p-[32px] relative w-full" data-name="page-body">
          <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start leading-[normal] relative shrink-0 w-full whitespace-nowrap" data-name="Frame">
            <p className="font-jakarta font-extrabold relative shrink-0 text-[#0f172a] text-[22px]">Resultados de búsqueda para "González"</p>
            <p className="font-jakarta font-medium relative shrink-0 text-[#64748b] text-[14px]">4 resultados encontrados en el sistema SIAPPC</p>
          </div>
          <div className="border-[#e2e8f0] border-b border-solid content-stretch flex gap-[8px] h-[42px] items-start relative shrink-0 w-full" data-name="tab-bar">
            <div className="border-[#2563eb] border-b-2 border-solid content-stretch flex items-start px-[16px] py-[12px] relative shrink-0" data-name="tab-all">
              <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#2563eb] text-[14px] whitespace-nowrap">Todos (4)</p>
            </div>
            <div className="content-stretch flex items-start px-[16px] py-[12px] relative shrink-0" data-name="tab-patients">
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Pacientes (2)</p>
            </div>
            <div className="content-stretch flex items-start px-[16px] py-[12px] relative shrink-0" data-name="tab-soap">
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Notas SOAP (1)</p>
            </div>
            <div className="content-stretch flex items-start px-[16px] py-[12px] relative shrink-0" data-name="tab-docs">
              <p className="[word-break:break-word] font-jakarta font-medium leading-[normal] relative shrink-0 text-[#64748b] text-[14px] whitespace-nowrap">Documentos (1)</p>
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="results-list">
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex gap-[16px] items-center p-[20px] relative rounded-[12px] shrink-0 w-full" data-name="result-card-1">
              <div className="bg-[#eff6ff] content-stretch flex items-center justify-center relative rounded-[24px] shrink-0 size-[48px]" data-name="patient-avatar-circle">
                <div className="relative shrink-0 size-[20px]" data-name="user">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgUser2} />
                </div>
              </div>
              <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="details-and-meta">
                <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="title-row">
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[16px] whitespace-nowrap">María González</p>
                  <div className="bg-[#fef2f2] content-stretch flex items-start px-[8px] py-[3px] relative rounded-[6px] shrink-0" data-name="status-badge">
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#ef4444] text-[11px] whitespace-nowrap">Crítico</p>
                  </div>
                  <div className="bg-[#eff6ff] content-stretch flex items-start px-[8px] py-[3px] relative rounded-[6px] shrink-0" data-name="bed-badge">
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#2563eb] text-[11px] whitespace-nowrap">UCI Cama D3</p>
                  </div>
                </div>
                <div className="[word-break:break-word] content-stretch flex font-jakarta font-normal gap-[16px] items-start leading-[0] relative shrink-0 text-[#64748b] text-[13px] whitespace-nowrap" data-name="info-sub-row">
                  <p className="relative shrink-0"><span className="leading-[normal]">{`HC: `}</span><span className="font-jakarta font-semibold leading-[normal] text-[#0f172a]">PT-8821</span></p>
                  <p className="relative shrink-0"><span className="leading-[normal]">{`Diagnóstico: `}</span><span className="font-jakarta font-semibold leading-[normal] text-[#0f172a]">Insuficiencia Cardíaca Congestiva</span></p>
                </div>
              </div>
              <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="action-buttons">
                <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-start px-[16px] py-[8px] relative rounded-[8px] shrink-0" data-name="btn-perfil">
                  <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] whitespace-nowrap">Ver Perfil</p>
                </div>
                <div className="bg-[#2563eb] content-stretch flex items-start px-[16px] py-[8px] relative rounded-[8px] shrink-0" data-name="btn-monitoreo">
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[13px] text-white whitespace-nowrap">Monitoreo</p>
                </div>
              </div>
            </div>
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex gap-[16px] items-center p-[20px] relative rounded-[12px] shrink-0 w-full" data-name="result-card-2">
              <div className="bg-[#ecfdf5] content-stretch flex items-center justify-center relative rounded-[24px] shrink-0 size-[48px]" data-name="patient-avatar-circle">
                <div className="relative shrink-0 size-[20px]" data-name="user">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgUser3} />
                </div>
              </div>
              <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="details-and-meta">
                <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="title-row">
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[16px] whitespace-nowrap">Roberto González Vega</p>
                  <div className="bg-[#ecfdf5] content-stretch flex items-start px-[8px] py-[3px] relative rounded-[6px] shrink-0" data-name="status-badge">
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#10b981] text-[11px] whitespace-nowrap">Estable</p>
                  </div>
                  <div className="bg-[#f1f5f9] content-stretch flex items-start px-[8px] py-[3px] relative rounded-[6px] shrink-0" data-name="bed-badge">
                    <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#64748b] text-[11px] whitespace-nowrap">Piso 2 Cama 8</p>
                  </div>
                </div>
                <div className="[word-break:break-word] content-stretch flex font-jakarta font-normal gap-[16px] items-start leading-[0] relative shrink-0 text-[#64748b] text-[13px] whitespace-nowrap" data-name="info-sub-row">
                  <p className="relative shrink-0"><span className="leading-[normal]">{`HC: `}</span><span className="font-jakarta font-semibold leading-[normal] text-[#0f172a]">PT-4412</span></p>
                  <p className="relative shrink-0"><span className="leading-[normal]">{`Diagnóstico: `}</span><span className="font-jakarta font-semibold leading-[normal] text-[#0f172a]">Fractura femoral expuesta</span></p>
                </div>
              </div>
              <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="action-buttons">
                <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-start px-[16px] py-[8px] relative rounded-[8px] shrink-0" data-name="btn-perfil">
                  <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] whitespace-nowrap">Ver Perfil</p>
                </div>
                <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-start px-[16px] py-[8px] relative rounded-[8px] shrink-0" data-name="btn-historia">
                  <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] whitespace-nowrap">Ver Historia</p>
                </div>
              </div>
            </div>
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex gap-[16px] items-center p-[20px] relative rounded-[12px] shrink-0 w-full" data-name="result-card-3">
              <div className="bg-[#fef3c7] content-stretch flex items-center justify-center relative rounded-[24px] shrink-0 size-[48px]" data-name="icon-circle">
                <div className="relative shrink-0 size-[20px]" data-name="clipboard">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgClipboard2} />
                </div>
              </div>
              <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start leading-[normal] min-w-px relative whitespace-nowrap" data-name="details-and-meta">
                <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="title-row">
                  <p className="font-jakarta font-bold relative shrink-0 text-[#0f172a] text-[16px]">Nota SOAP — González, María</p>
                  <p className="font-jakarta font-normal relative shrink-0 text-[#64748b] text-[12px]">15 Oct 2025</p>
                </div>
                <p className="font-jakarta font-normal overflow-hidden relative shrink-0 text-[#64748b] text-[13px] text-ellipsis w-[700px]">"Paciente presenta deterioro hemodinámico, con elevación de presión pulmonar capilar. Se incrementa dosis de soporte..."</p>
              </div>
              <div className="content-stretch flex items-start relative shrink-0" data-name="action-buttons">
                <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-start px-[16px] py-[8px] relative rounded-[8px] shrink-0" data-name="btn-ver-nota">
                  <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] whitespace-nowrap">Ver Nota</p>
                </div>
              </div>
            </div>
            <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex gap-[16px] items-center p-[20px] relative rounded-[12px] shrink-0 w-full" data-name="result-card-4">
              <div className="bg-[rgba(239,68,68,0.1)] content-stretch flex items-center justify-center relative rounded-[24px] shrink-0 size-[48px]" data-name="icon-circle">
                <div className="relative shrink-0 size-[20px]" data-name="file">
                  <img className="absolute block inset-0 max-w-none size-full" alt="" src={imgFile} />
                </div>
              </div>
              <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-w-px relative" data-name="details-and-meta">
                <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="title-row">
                  <p className="[word-break:break-word] font-jakarta font-bold leading-[normal] relative shrink-0 text-[#0f172a] text-[16px] whitespace-nowrap">TAC_Gonzalez_Maria.pdf</p>
                  <div className="bg-[#fef2f2] content-stretch flex items-start px-[6px] py-[2px] relative rounded-[4px] shrink-0" data-name="pdf-badge">
                    <p className="[word-break:break-word] font-jakarta font-extrabold leading-[normal] relative shrink-0 text-[#ef4444] text-[10px] whitespace-nowrap">PDF</p>
                  </div>
                </div>
                <p className="[word-break:break-word] font-jakarta font-normal leading-[normal] relative shrink-0 text-[#64748b] text-[13px] whitespace-nowrap">Subido el 12 Oct 2025 • Radiología & Imagenología UCI</p>
              </div>
              <div className="content-stretch flex items-start relative shrink-0" data-name="action-buttons">
                <div className="bg-white border border-[#e2e8f0] border-solid content-stretch flex items-start px-[16px] py-[8px] relative rounded-[8px] shrink-0" data-name="btn-ver-documento">
                  <p className="[word-break:break-word] font-jakarta font-semibold leading-[normal] relative shrink-0 text-[#0f172a] text-[13px] whitespace-nowrap">Ver Documento</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
