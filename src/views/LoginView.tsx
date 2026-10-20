import React, { useState } from 'react';
import { ScreenMode } from '../types.ts';

interface LoginViewProps {
  onLoginSuccess: (user: { name: string; role: string; email: string }) => void;
  onNavigate: (screen: ScreenMode) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLoginSuccess,
  onNavigate
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<'admin' | 'editor' | 'viewer'>('admin');
  const [deviceTrust, setDeviceTrust] = useState(true);

  const personas = {
    admin: { name: 'Alex Mercer', role: 'Principal Data Manager', email: 'a.mercer@planning.gov' },
    editor: { name: 'J. Doe', role: 'Lead Demographer (Editor)', email: 'j.doe@planning.gov' },
    viewer: { name: 'C. Patel', role: 'Research Intern (Viewer)', email: 'c.patel@planning.gov' }
  };

  const handleSsoClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const chosen = personas[selectedPersona];
      onLoginSuccess(chosen);
      onNavigate('home');
    }, 1200);
  };

  return (
    <div className="relative w-full overflow-hidden py-space-xl flex flex-col items-center justify-center max-w-5xl mx-auto pb-20">
      {/* Ambient Civic Grid and Glow Backdrop */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-secondary-container/20 blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 -right-40 w-[30rem] h-[30rem] rounded-full bg-surface-container-high/60 blur-3xl pointer-events-none"></div>

      {/* Main Container */}
      <div className="w-full flex flex-col gap-space-xl relative z-10">
        {/* Breadcrumb & Classification Bar */}
        <div className="flex flex-wrap items-center justify-between gap-space-sm bg-surface-container-lowest px-space-lg py-space-sm rounded-xl shadow-xs border border-outline-variant/30">
          <div className="flex items-center gap-space-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse"></span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-secondary">State Spatial Federation</span>
            <span className="text-outline-variant">•</span>
            <span className="text-[12px] text-on-surface-variant font-medium">
              Tenant Node: <strong className="text-on-surface font-semibold">agency-entra-id.rpa.gov</strong>
            </span>
          </div>
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">lock</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-surface-container-high text-on-surface uppercase tracking-wide">
              Official Agency Portal
            </span>
          </div>
        </div>

        {/* Split Layout Authentication Frame */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-stretch">
          {/* Left Column: Primary Microsoft / Entra ID Gateway Card (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between bg-surface-container-lowest rounded-xl p-space-xl shadow-md border border-outline-variant/30">
            <div className="flex flex-col gap-space-lg">
              {/* Agency Header & Official Emblem */}
              <div className="flex items-start justify-between gap-space-md">
                <div className="flex items-center gap-space-md">
                  <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center shadow-md shrink-0">
                    <span className="material-symbols-outlined text-secondary-fixed text-[32px]">apartment</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-space-xs">
                      <span className="text-[10px] uppercase tracking-widest text-secondary font-bold">State Planning Commission</span>
                      <span className="material-symbols-outlined text-secondary text-[16px]">verified</span>
                    </div>
                    <h1 className="text-[24px] font-bold text-on-surface tracking-tight">Regional Planning Agency</h1>
                    <span className="text-[12px] text-on-surface-variant">Civil Spatial Infrastructure & Data Portal</span>
                  </div>
                </div>
              </div>

              {/* Page Intent & Compliance Badge Strip */}
              <div className="flex flex-col gap-space-xs pt-space-xs">
                <div className="flex flex-wrap gap-space-xs mb-space-xs">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-surface-container-low text-primary border border-outline-variant/20">
                    NIST SP 800-53 Rev. 5
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-secondary-container/50 text-on-secondary-container">
                    Directive v4.2 Certified
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">
                    FIPS 140-3
                  </span>
                </div>
                <h2 className="text-[18px] font-bold text-primary">Sign in to Enterprise Data Catalog</h2>
                <p className="text-[14px] text-on-surface-variant leading-relaxed">
                  Connect using your verified organizational Microsoft 365 / Entra ID credentials to access regional spatial layers, GeoHub feeds, and automated GovAI analysis pipelines.
                </p>
              </div>

              {/* Persona Selector for Testing */}
              <div className="p-space-sm bg-surface-container rounded-lg border border-outline-variant/30 flex flex-col gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                  Select User Account to Authenticate:
                </span>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { key: 'admin', label: 'Alex Mercer', role: 'Data Manager' },
                    { key: 'editor', label: 'J. Doe', role: 'Editor' },
                    { key: 'viewer', label: 'C. Patel', role: 'Viewer' }
                  ].map(p => (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => setSelectedPersona(p.key as any)}
                      className={`px-2 py-1.5 rounded text-left transition-colors cursor-pointer border ${
                        selectedPersona === p.key
                          ? 'bg-primary text-on-primary border-primary'
                          : 'bg-surface-container-lowest text-on-surface border-outline-variant/30 hover:bg-surface-container-high'
                      }`}
                    >
                      <div className="text-[11px] font-bold leading-tight">{p.label}</div>
                      <div className="text-[9px] opacity-80">{p.role}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tenant Identification Block */}
              <div className="flex items-center justify-between p-space-sm px-space-md bg-surface-container-low rounded-lg border border-outline-variant/20">
                <div className="flex items-center gap-space-sm min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-surface-container-lowest flex items-center justify-center shadow-xs shrink-0">
                    <span className="material-symbols-outlined text-secondary text-[20px]">domain</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Verified Tenant</span>
                    <span className="text-[13px] font-bold text-on-surface truncate">@planning.gov • RPA Single Sign-On</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0 px-2 py-1 rounded bg-secondary/10 text-secondary">
                  <span className="material-symbols-outlined text-[16px]">domain_verification</span>
                  <span className="text-[11px] font-bold">Federated</span>
                </div>
              </div>

              {/* SSO Action Primary Area */}
              <div className="flex flex-col gap-space-md pt-space-xs">
                {/* Microsoft Entra ID Button */}
                <button 
                  type="button"
                  onClick={handleSsoClick}
                  disabled={isLoading}
                  className="group relative w-full h-14 bg-primary text-on-primary rounded-lg flex items-center justify-between px-space-lg shadow-md hover:bg-primary-container focus:outline-none focus:ring-4 focus:ring-secondary/40 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-space-md">
                    {/* Official 4-color Microsoft Symbol */}
                    <div className="w-6 h-6 grid grid-cols-2 gap-0.5 p-0.5 bg-surface-container-lowest rounded shrink-0 shadow-xs">
                      <div className="bg-[#F25022] rounded-[1px]"></div>
                      <div className="bg-[#7FBA00] rounded-[1px]"></div>
                      <div className="bg-[#00A4EF] rounded-[1px]"></div>
                      <div className="bg-[#FFB900] rounded-[1px]"></div>
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-[14px] font-bold text-on-primary group-hover:text-secondary-fixed transition-colors">
                        Sign in with Microsoft 365
                      </span>
                      <span className="text-[11px] text-on-primary-container">Single Sign-On (Entra ID Directory)</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-space-xs">
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-secondary-fixed border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-primary-container text-secondary-fixed">Active</span>
                        <span className="material-symbols-outlined text-secondary-fixed text-[20px] group-hover:translate-x-1 transition-transform">
                          arrow_forward
                        </span>
                      </>
                    )}
                  </div>
                </button>

                {/* Keep signed in */}
                <div className="flex items-start gap-space-sm pt-space-xs px-1">
                  <input 
                    type="checkbox"
                    id="device-trust"
                    checked={deviceTrust}
                    onChange={(e) => setDeviceTrust(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded text-secondary focus:ring-secondary accent-secondary cursor-pointer"
                  />
                  <label htmlFor="device-trust" className="text-[12px] text-on-surface-variant cursor-pointer select-none leading-snug">
                    <strong className="text-on-surface font-semibold">Keep me signed in on this authorized agency workstation.</strong> Uncheck if accessing via an unmanaged terminal or temporary kiosk.
                  </label>
                </div>
              </div>

              {/* Role Assignment Notice */}
              <div className="bg-surface-container p-space-md rounded-lg flex gap-space-sm items-start border border-outline-variant/20">
                <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">badge</span>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[12px] font-bold text-primary">Automated Security Group Provisioning</span>
                  <p className="text-[12px] text-on-surface-variant leading-relaxed">
                    Roles are mapped dynamically via agency Entra ID groups (<em className="text-on-surface not-italic font-medium">GIS-Analysts, Spatial-Managers, Regional-Viewers</em>). Elevated privileges sync automatically upon token refresh.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Help */}
            <div className="pt-space-md mt-space-lg bg-surface-container-low/70 -mx-space-xl -mb-space-xl p-space-md px-space-xl rounded-b-xl flex flex-wrap items-center justify-between gap-space-sm border-t border-outline-variant/30">
              <div className="flex items-center gap-space-xs text-on-surface-variant text-[12px]">
                <span className="material-symbols-outlined text-[18px] text-secondary">contact_support</span>
                <span>Having sign-in difficulties?</span>
              </div>
              <button 
                type="button"
                onClick={() => alert('IT Service Desk contacted: ticket logged for active workstation node.')}
                className="text-[12px] font-bold text-secondary hover:text-on-secondary-container flex items-center gap-0.5 transition-colors cursor-pointer"
              >
                <span>Contact Agency IT Desk (Ext. 4400)</span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            </div>
          </div>

          {/* Right Column: System Telemetry & GovAI Guard (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-space-md">
            {/* System Status */}
            <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-xs border border-outline-variant/30 flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-secondary text-[20px]">hub</span>
                  <span className="text-[16px] font-bold text-on-surface">System Status</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container">
                  All Operational
                </span>
              </div>

              <div className="flex flex-col gap-space-xs">
                <div className="flex items-center justify-between p-space-sm rounded-lg bg-surface-container-low border border-outline-variant/20">
                  <div className="flex items-center gap-space-sm">
                    <span className="w-2 h-2 rounded-full bg-secondary"></span>
                    <span className="text-[12px] text-on-surface font-medium">Entra ID SSO Cluster</span>
                  </div>
                  <span className="font-tabular-data text-[12px] text-secondary font-bold">99.98% SLA</span>
                </div>

                <div className="flex items-center justify-between p-space-sm rounded-lg bg-surface-container-low border border-outline-variant/20">
                  <div className="flex items-center gap-space-sm">
                    <span className="w-2 h-2 rounded-full bg-secondary"></span>
                    <span className="text-[12px] text-on-surface font-medium">SharePoint Spatial DB</span>
                  </div>
                  <span className="font-tabular-data text-[12px] text-secondary font-bold">Synced (14m ago)</span>
                </div>

                <div className="flex items-center justify-between p-space-sm rounded-lg bg-surface-container-low border border-outline-variant/20">
                  <div className="flex items-center gap-space-sm">
                    <span className="w-2 h-2 rounded-full bg-secondary"></span>
                    <span className="text-[12px] text-on-surface font-medium">Regional GeoHub API v3</span>
                  </div>
                  <span className="font-tabular-data text-[12px] text-secondary font-bold">Responding</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-space-xs text-on-surface-variant text-[12px] border-t border-outline-variant/20">
                <span>Security Topology:</span>
                <span className="text-[12px] text-on-surface font-bold">Zero Trust Conditional Access</span>
              </div>
            </div>

            {/* GovAI Spatial Guard Callout */}
            <div className="bg-gradient-to-br from-surface-container-lowest to-surface-container-low rounded-xl p-space-lg shadow-xs border border-outline-variant/30 flex flex-col gap-space-sm relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-secondary-container/40 blur-xl pointer-events-none"></div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-xs">
                  <div className="w-7 h-7 rounded-lg bg-secondary-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-secondary-container text-[18px]">auto_awesome</span>
                  </div>
                  <span className="text-[14px] font-bold text-on-surface">GovAI Spatial Guard</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed uppercase">
                  Scoped
                </span>
              </div>

              <p className="text-[12px] text-on-surface-variant leading-relaxed">
                GovAI operates strictly within the security context of your authenticated Entra ID user identity. Metadata edits, geospatial queries, and automated catalog indexing respect internal agency redaction rules.
              </p>

              <div className="flex items-center gap-space-xs text-secondary text-[11px] font-bold pt-space-xs">
                <span className="material-symbols-outlined text-[16px]">policy</span>
                <span>Compliant with Civil Data Ethics Protocol 2024</span>
              </div>
            </div>

            {/* Authorized Account Domains Card */}
            <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-xs border border-outline-variant/30 flex flex-col gap-space-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                Authorized Account Domains
              </span>

              <div className="flex flex-col gap-space-xs">
                <div className="flex items-center justify-between p-2 rounded bg-surface-container border border-outline-variant/20">
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-primary text-[18px]">domain</span>
                    <span className="text-[12px] font-bold text-on-surface">@planning.gov</span>
                  </div>
                  <span className="text-[11px] font-bold text-secondary">Full Catalog & GIS Write</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-surface-container border border-outline-variant/20">
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-primary text-[18px]">corporate_fare</span>
                    <span className="text-[12px] font-bold text-on-surface">@regionalplanning.gov</span>
                  </div>
                  <span className="text-[11px] font-bold text-on-surface-variant">Federated Agency Node</span>
                </div>
              </div>

              <p className="text-[11px] text-on-surface-variant pt-space-xs leading-snug">
                External contractors require an agency sponsor and multi-factor authentication (MFA) via Microsoft Authenticator.
              </p>
            </div>
          </div>
        </div>

        {/* Official Government Warning Banner */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md px-space-lg shadow-xs border border-outline-variant/30 flex flex-col md:flex-row items-center justify-between gap-space-md text-on-surface-variant">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-secondary text-[22px] shrink-0">verified_user</span>
            <span className="text-[12px] leading-snug">
              <strong className="text-on-surface">Official Government Warning:</strong> Unauthorized access to this spatial information system is prohibited and subject to civil and criminal sanctions under State Administrative Code Title 24.
            </span>
          </div>

          <div className="flex items-center gap-space-md shrink-0 text-[12px] font-bold">
            <button type="button" onClick={() => onNavigate('help')} className="hover:text-primary transition-colors cursor-pointer">
              Security Policy
            </button>
            <span className="text-outline-variant">•</span>
            <button type="button" onClick={() => onNavigate('help')} className="hover:text-primary transition-colors cursor-pointer">
              Data Custodianship
            </button>
            <span className="text-outline-variant">•</span>
            <button type="button" onClick={() => onNavigate('help')} className="hover:text-primary transition-colors cursor-pointer">
              Privacy Notice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
