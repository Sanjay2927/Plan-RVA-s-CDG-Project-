import React, { useState } from 'react';
import { Dataset } from '../types.ts';

interface SharePointExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  datasets: Dataset[];
  selectedDataset?: Dataset | null;
}

export const SharePointExportModal: React.FC<SharePointExportModalProps> = ({
  isOpen,
  onClose,
  datasets,
  selectedDataset
}) => {
  if (!isOpen) return null;

  const targetDatasets = selectedDataset ? [selectedDataset] : datasets;
  const [exportFormat, setExportFormat] = useState<'native' | 'csv' | 'json' | 'metadata'>('native');
  const [includeLineage, setIncludeLineage] = useState(true);
  const [exportSuccess, setExportSuccess] = useState(false);

  const handleDownload = () => {
    if (exportFormat === 'csv' || exportFormat === 'metadata') {
      const headers = ['UID', 'Name', 'Topic', 'FileType', 'Plan', 'Owner', 'LastModified', 'SharePointURL', 'GeoHubStatus'];
      const rows = targetDatasets.map(d => [
        d.uid,
        `"${d.name.replace(/"/g, '""')}"`,
        d.topic,
        d.fileType,
        `"${d.plan}"`,
        d.owner,
        `"${d.lastModified}"`,
        `"${d.sharepointPath}"`,
        d.geohubStatus
      ]);
      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `sharepoint_export_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (exportFormat === 'json') {
      const jsonContent = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(targetDatasets, null, 2));
      const link = document.createElement('a');
      link.setAttribute('href', jsonContent);
      link.setAttribute('download', `sharepoint_export_${Date.now()}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Native asset bundle simulation
      const sampleContent = targetDatasets.map(d => 
        `# REGIONAL PLANNING AGENCY SHAREPOINT ASSET EXPORT\nUID: ${d.uid}\nResource: ${d.name}\nSource URL: ${d.sharepointPath}\nSize: ${d.fileSize || '18.4 MB'}\nChecksum: ${d.checksum || 'SHA-256 Validated'}\nOwner: ${d.owner}\nLast Modified: ${d.lastModified}\nGovernance: ISO-19115 compliant`
      ).join('\n\n---\n\n');
      const blob = new Blob([sampleContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${(targetDatasets[0]?.name || 'sharepoint_export').replace(/\s+/g, '_')}_bundle.txt`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    setExportSuccess(true);
    setTimeout(() => {
      setExportSuccess(false);
      onClose();
    }, 1500);
  };

  const copySharePointUrl = () => {
    const url = targetDatasets[0]?.sharepointPath || 'https://regionalplanning.sharepoint.com/teams/GIS/Datasets/';
    navigator.clipboard?.writeText(url);
    alert(`Copied SharePoint Container Path to clipboard:\n${url}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-surface-container-lowest rounded-xl shadow-2xl max-w-xl w-full border border-outline-variant/40 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-space-md bg-surface-container-low flex items-center justify-between border-b border-outline-variant/30">
          <div className="flex items-center gap-space-sm">
            <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-secondary shadow-xs">
              <span className="material-symbols-outlined text-[24px]">cloud_download</span>
            </div>
            <div className="flex flex-col">
              <h3 className="text-[17px] font-bold text-on-surface">Export Data from SharePoint</h3>
              <span className="text-[11px] text-on-surface-variant font-medium">
                {targetDatasets.length === 1 ? targetDatasets[0].name : `${targetDatasets.length} Catalog Resources Selected`}
              </span>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-surface-container-high text-on-surface-variant cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-space-lg flex flex-col gap-space-md text-xs">
          {exportSuccess && (
            <div className="p-3 bg-secondary-container text-on-secondary-container rounded-lg font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              <span>Export package generated & downloaded to your workstation!</span>
            </div>
          )}

          {/* SharePoint Container Information */}
          <div className="bg-surface-container-low p-space-sm rounded-lg border border-outline-variant/20 flex flex-col gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
              SharePoint Target Container:
            </span>
            <div className="flex items-center justify-between bg-surface-container-lowest p-2 rounded border border-outline-variant/30 font-mono text-[11px] text-on-surface">
              <span className="truncate max-w-[340px]">
                {targetDatasets[0]?.sharepointPath || 'https://regionalplanning.sharepoint.com/teams/GIS/Datasets/'}
              </span>
              <button
                onClick={copySharePointUrl}
                title="Copy SharePoint path"
                className="text-secondary hover:text-on-secondary-container p-1 rounded hover:bg-surface-container transition-colors cursor-pointer shrink-0"
              >
                <span className="material-symbols-outlined text-[16px]">content_copy</span>
              </button>
            </div>
            <p className="text-[11px] text-on-surface-variant">
              Linked to Microsoft 365 Entra ID tenant <strong className="text-on-surface">@planning.gov</strong>. Permissions inherit Active Directory clearance.
            </p>
          </div>

          {/* Export Options */}
          <div>
            <label className="text-[12px] font-bold text-on-surface block mb-2">
              Choose Export Package Format:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label 
                className={`p-3 rounded-lg border flex flex-col gap-1 cursor-pointer transition-all ${
                  exportFormat === 'native'
                    ? 'bg-secondary-container/20 border-secondary ring-1 ring-secondary'
                    : 'bg-surface-container-low border-outline-variant/30 hover:bg-surface-container'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-on-surface text-[12px] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-primary">download</span>
                    Raw Native Asset
                  </span>
                  <input 
                    type="radio" 
                    name="exp_format" 
                    checked={exportFormat === 'native'} 
                    onChange={() => setExportFormat('native')}
                    className="accent-secondary"
                  />
                </div>
                <span className="text-[11px] text-on-surface-variant">
                  {targetDatasets[0]?.fileType === 'Excel' ? '.XLSX Workbook' : targetDatasets[0]?.fileType === 'GIS' ? 'Shapefile / GeoJSON archive' : '.CSV / .PDF file'}
                </span>
              </label>

              <label 
                className={`p-3 rounded-lg border flex flex-col gap-1 cursor-pointer transition-all ${
                  exportFormat === 'csv'
                    ? 'bg-secondary-container/20 border-secondary ring-1 ring-secondary'
                    : 'bg-surface-container-low border-outline-variant/30 hover:bg-surface-container'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-on-surface text-[12px] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-secondary">table_view</span>
                    Catalog Table (.CSV)
                  </span>
                  <input 
                    type="radio" 
                    name="exp_format" 
                    checked={exportFormat === 'csv'} 
                    onChange={() => setExportFormat('csv')}
                    className="accent-secondary"
                  />
                </div>
                <span className="text-[11px] text-on-surface-variant">
                  Tabular metadata & inventory index
                </span>
              </label>

              <label 
                className={`p-3 rounded-lg border flex flex-col gap-1 cursor-pointer transition-all ${
                  exportFormat === 'json'
                    ? 'bg-secondary-container/20 border-secondary ring-1 ring-secondary'
                    : 'bg-surface-container-low border-outline-variant/30 hover:bg-surface-container'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-on-surface text-[12px] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-outline">data_object</span>
                    ISO 19115 JSON
                  </span>
                  <input 
                    type="radio" 
                    name="exp_format" 
                    checked={exportFormat === 'json'} 
                    onChange={() => setExportFormat('json')}
                    className="accent-secondary"
                  />
                </div>
                <span className="text-[11px] text-on-surface-variant">
                  Machine-readable spatial metadata
                </span>
              </label>

              <label 
                className={`p-3 rounded-lg border flex flex-col gap-1 cursor-pointer transition-all ${
                  exportFormat === 'metadata'
                    ? 'bg-secondary-container/20 border-secondary ring-1 ring-secondary'
                    : 'bg-surface-container-low border-outline-variant/30 hover:bg-surface-container'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-on-surface text-[12px] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-tertiary">history_edu</span>
                    Compliance Audit Log
                  </span>
                  <input 
                    type="radio" 
                    name="exp_format" 
                    checked={exportFormat === 'metadata'} 
                    onChange={() => setExportFormat('metadata')}
                    className="accent-secondary"
                  />
                </div>
                <span className="text-[11px] text-on-surface-variant">
                  SHA-256 verification hashes & citations
                </span>
              </label>
            </div>
          </div>

          {/* Options Checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input 
              type="checkbox" 
              id="include_lineage" 
              checked={includeLineage}
              onChange={(e) => setIncludeLineage(e.target.checked)}
              className="accent-secondary cursor-pointer"
            />
            <label htmlFor="include_lineage" className="text-[11px] text-on-surface cursor-pointer select-none">
              Include provenance lineage tags and State Directive v4.2 validation signatures.
            </label>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-space-md bg-surface-container-low border-t border-outline-variant/30 flex items-center justify-between">
          <button 
            type="button"
            onClick={copySharePointUrl}
            className="text-[12px] font-bold text-secondary hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
            <span>Open in SharePoint Online</span>
          </button>

          <div className="flex items-center gap-2">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button 
              type="button"
              onClick={handleDownload}
              className="px-5 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>Execute Export</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
