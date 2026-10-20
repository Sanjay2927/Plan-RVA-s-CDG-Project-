import React from 'react';

export const HelpView: React.FC = () => {
  return (
    <div className="flex flex-col gap-space-lg w-full max-w-[1520px] mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col pb-space-sm">
        <div className="flex items-center gap-space-xs text-on-surface-variant text-[11px] font-bold uppercase tracking-wider mb-1">
          <span>Standards & Regulatory Compliance</span>
          <span>/</span>
          <span className="text-secondary font-bold">Directive v4.2</span>
        </div>
        <h1 className="text-[30px] font-bold text-on-surface tracking-tight">RPA Core Standards & Help Desk</h1>
        <p className="text-[14px] text-on-surface-variant mt-0.5">
          Comprehensive reference guide for metadata hygiene, naming taxonomy, and role-based clearance across the spatial repository.
        </p>
      </div>

      {/* Grid of Standard Guidelines */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
        {/* Card 1: Naming Convention */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-xs border border-outline-variant/30 flex flex-col gap-space-sm">
          <div className="flex items-center gap-2 text-primary font-bold">
            <span className="material-symbols-outlined text-[22px] text-secondary">label</span>
            <h2 className="text-[16px]">Taxonomy Directive 2024-C</h2>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            All files committed to SharePoint drives and GeoHub feature layers must adhere to the standardized nomenclature format:
          </p>
          <div className="p-2.5 bg-surface-container-low rounded font-mono text-xs text-on-surface font-semibold border border-outline-variant/20">
            [Agency]_[Topic]_[Geography]_[Year]
          </div>
          <ul className="text-xs text-on-surface space-y-1.5 list-disc list-inside text-on-surface-variant">
            <li><strong className="text-on-surface">Agency:</strong> Official code (e.g. RPA, DOT, DEP)</li>
            <li><strong className="text-on-surface">Topic:</strong> Master category (Demographics, Environment, Economy)</li>
            <li><strong className="text-on-surface">Geography:</strong> Regional, County, TAZ, Municipal</li>
            <li><strong className="text-on-surface">Year:</strong> 4-digit anchor year (e.g. 2020, 2026)</li>
          </ul>
        </div>

        {/* Card 2: ISO 19115 Schema */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-xs border border-outline-variant/30 flex flex-col gap-space-sm">
          <div className="flex items-center gap-2 text-primary font-bold">
            <span className="material-symbols-outlined text-[22px] text-secondary">verified</span>
            <h2 className="text-[16px]">ISO 19115 Geographic Information</h2>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Geographic dataset entries require mandatory spatial extents and bounding parameters:
          </p>
          <div className="p-2.5 bg-surface-container-low rounded text-xs text-on-surface space-y-1 border border-outline-variant/20 font-mono">
            <div>• Coordinate Ref: EPSG:6441 / NAD83</div>
            <div>• Bounding Box: West/East/North/South Lat-Lon</div>
            <div>• Temporal Extent: Validated epoch timestamps</div>
          </div>
          <p className="text-xs text-on-surface-variant">
            Datasets missing complete contact points or bounding coordinates are flagged with <em>Audit: Pending Verification</em>.
          </p>
        </div>

        {/* Card 3: RBAC Roles */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-xs border border-outline-variant/30 flex flex-col gap-space-sm">
          <div className="flex items-center gap-2 text-primary font-bold">
            <span className="material-symbols-outlined text-[22px] text-tertiary">badge</span>
            <h2 className="text-[16px]">RBAC Role Entitlements</h2>
          </div>
          <div className="space-y-2 text-xs">
            <div className="p-2 rounded bg-surface-container-low border border-outline-variant/20">
              <span className="font-bold text-on-surface block">Viewer (Default Tier)</span>
              <span className="text-on-surface-variant">Read, query with GovAI, and fetch raw file assets.</span>
            </div>
            <div className="p-2 rounded bg-secondary-container/20 border border-secondary-container">
              <span className="font-bold text-secondary block">Editor (Elevated Tier)</span>
              <span className="text-on-surface-variant">Modify schema, ingest new shapefile layers, and register entries.</span>
            </div>
            <div className="p-2 rounded bg-tertiary/10 border border-tertiary/20">
              <span className="font-bold text-tertiary block">Principal Data Manager (Admin)</span>
              <span className="text-on-surface-variant">Exclusive privilege to assign roles and audit user changes.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Support & Contact Desk */}
      <div className="bg-surface-container-lowest p-space-xl rounded-xl shadow-xs border border-outline-variant/30 flex flex-col md:flex-row items-center justify-between gap-space-md">
        <div className="flex items-center gap-space-md">
          <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-secondary shrink-0">
            <span className="material-symbols-outlined text-[28px]">support_agent</span>
          </div>
          <div>
            <h3 className="text-[18px] font-bold text-on-surface">Need Spatial IT Assistance or Schema Waivers?</h3>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Contact the Regional Planning Agency Data Desk at Extension 4400 or via email at <code className="font-mono text-secondary">datamanagement@planning.gov</code>
            </p>
          </div>
        </div>

        <button 
          onClick={() => alert('Support ticket #RPA-8849 generated. Data Management desk notified.')}
          className="px-5 py-2.5 bg-primary hover:bg-primary-container text-on-primary rounded-lg text-xs font-bold shrink-0 cursor-pointer shadow-xs"
        >
          Submit Support Ticket
        </button>
      </div>
    </div>
  );
};
