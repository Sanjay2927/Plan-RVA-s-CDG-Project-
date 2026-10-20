import React, { useState } from 'react';
import { Dataset, ScreenMode } from '../types.ts';

interface BrowseViewProps {
  datasets: Dataset[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectDataset: (dataset: Dataset) => void;
  onNavigate: (screen: ScreenMode) => void;
  onOpenGovAi: (prompt?: string) => void;
  onPreviewDataset: (dataset: Dataset) => void;
  onOpenSharePointExport?: (dataset?: Dataset) => void;
}

export const BrowseView: React.FC<BrowseViewProps> = ({
  datasets,
  searchQuery,
  onSearchChange,
  onSelectDataset,
  onNavigate,
  onOpenGovAi,
  onPreviewDataset,
  onOpenSharePointExport
}) => {
  const currentQuery = searchQuery || 'county population and regional environment';
  const [queryInput, setQueryInput] = useState(currentQuery);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'name' | 'lastModified'>('lastModified');
  const [sortAsc, setSortAsc] = useState(false);
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [activeTopicFilter, setActiveTopicFilter] = useState<string>('all');
  const [savedQueries, setSavedQueries] = useState<string[]>([]);
  const [saveQueryToast, setSaveQueryToast] = useState(false);

  // Active constraint chips
  const [activeConstraints, setActiveConstraints] = useState<{ id: string; label: string; val: string }[]>([
    { id: 'kw', label: 'Keywords', val: 'Population, Environment' },
    { id: 'jur', label: 'Jurisdiction', val: 'Tri-County RPA Region' },
    { id: 'time', label: 'Timeframe', val: '2020 – Present' },
    { id: 'life', label: 'Lifecycle', val: 'Published & Approved' }
  ]);

  const removeConstraint = (id: string) => {
    setActiveConstraints(prev => prev.filter(c => c.id !== id));
  };

  const clearAllConstraints = () => {
    setActiveConstraints([]);
  };

  const handleSaveQuery = () => {
    if (!savedQueries.includes(currentQuery)) {
      setSavedQueries(prev => [...prev, currentQuery]);
    }
    setSaveQueryToast(true);
    setTimeout(() => setSaveQueryToast(false), 3000);
  };

  // Filter & sort
  let displayedDatasets = [...datasets].filter(d => {
    if (activeTopicFilter !== 'all' && d.topic !== activeTopicFilter) return false;
    return true;
  });

  displayedDatasets.sort((a, b) => {
    if (sortBy === 'name') {
      return sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    } else {
      return sortAsc ? a.lastModified.localeCompare(b.lastModified) : b.lastModified.localeCompare(a.lastModified);
    }
  });

  const allSelected = displayedDatasets.length > 0 && selectedIds.length === displayedDatasets.length;
  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(displayedDatasets.map(d => d.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const exportSelectedCsv = () => {
    const toExport = selectedIds.length > 0 
      ? datasets.filter(d => selectedIds.includes(d.id))
      : displayedDatasets;
    
    const headers = ['UID', 'Name', 'Topic', 'Format', 'Plan', 'Owner', 'LastModified', 'GeoHub', 'Access'];
    const rows = toExport.map(d => [
      d.uid,
      `"${d.name.replace(/"/g, '""')}"`,
      d.topic,
      d.fileType,
      `"${d.plan}"`,
      d.owner,
      `"${d.lastModified}"`,
      d.geohubStatus,
      d.userAccess
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rpa_catalog_query_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-space-lg w-full max-w-[1520px] mx-auto pb-16">
      {/* Toast Notification */}
      {saveQueryToast && (
        <div className="fixed top-20 right-8 z-50 bg-primary text-on-primary px-4 py-2 rounded-lg shadow-xl flex items-center gap-2 border border-secondary text-xs font-semibold animate-in fade-in">
          <span className="material-symbols-outlined text-[18px] text-secondary">bookmark_check</span>
          <span>Query "{currentQuery}" saved to your administrative workspace.</span>
        </div>
      )}

      {/* Query Header Strip */}
      <div className="flex flex-col gap-space-sm pt-space-xs">
        <div className="flex items-center justify-between gap-space-md flex-wrap">
          <div className="flex flex-col gap-space-xs">
            <div className="flex items-center gap-space-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-secondary">Catalog Query Index</span>
              <span className="text-on-surface-variant text-[11px]">•</span>
              <span className="text-[11px] text-on-surface-variant font-medium">Live Production Mirror</span>
            </div>
            <div className="flex items-baseline gap-space-sm flex-wrap">
              <h1 className="text-[28px] md:text-[32px] font-bold text-on-surface tracking-tight">
                “{currentQuery}”
              </h1>
              <span className="text-[12px] font-bold text-on-surface-variant bg-surface-container-high px-2.5 py-0.5 rounded-full border border-outline-variant/30">
                {displayedDatasets.length} results match
              </span>
            </div>
          </div>

          <div className="flex items-center gap-space-sm">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                onSearchChange(queryInput);
              }}
              className="relative flex items-center"
            >
              <span className="material-symbols-outlined absolute left-3 text-[18px] text-on-surface-variant pointer-events-none">
                search
              </span>
              <input 
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                className="bg-surface-container-lowest text-on-surface text-[14px] pl-9 pr-space-md py-1.5 h-10 rounded-lg shadow-xs w-80 focus:outline-none focus:bg-surface-container-low transition-colors border border-outline-variant/30 focus:border-secondary" 
                type="text" 
              />
            </form>

            <button 
              onClick={handleSaveQuery}
              className="bg-surface-container-high hover:bg-surface-variant text-on-surface px-space-md h-10 rounded-lg text-[14px] font-semibold flex items-center gap-space-xs shadow-xs transition-colors cursor-pointer border border-outline-variant/30"
            >
              <span className="material-symbols-outlined text-[18px]">saved_search</span>
              <span>Save Query</span>
            </button>
          </div>
        </div>

        {/* Active Constraints Filter Pills */}
        <div className="flex items-center gap-space-sm flex-wrap pt-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mr-1">
            Active Constraints:
          </span>

          {activeConstraints.map(c => (
            <div 
              key={c.id} 
              className="flex items-center gap-1.5 bg-surface-container-lowest text-on-surface px-space-sm py-1 rounded-full shadow-2xs border border-outline-variant/30 text-[12px]"
            >
              <span className="text-on-surface-variant">{c.label}:</span>
              <span className="font-semibold">{c.val}</span>
              <button 
                onClick={() => removeConstraint(c.id)}
                className="hover:text-error flex items-center text-on-surface-variant transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">close</span>
              </button>
            </div>
          ))}

          {activeConstraints.length > 0 && (
            <button 
              onClick={clearAllConstraints}
              className="text-[11px] text-secondary hover:underline px-2 py-1 font-bold ml-auto cursor-pointer"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>

      {/* GovAI Result Summary Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-surface-container-low via-surface-container to-surface-container-high rounded-xl p-space-lg shadow-xs border border-outline-variant/30">
        <div className="absolute -right-8 -top-12 w-64 h-64 bg-secondary-container/40 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-space-lg">
          <div className="flex flex-col gap-space-xs max-w-3xl">
            <div className="flex items-center gap-space-sm flex-wrap">
              <span className="text-[11px] font-bold bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded uppercase tracking-wider">
                GovAI
              </span>
              <h2 className="text-[18px] font-bold text-on-surface tracking-tight">
                GovAI Result Summary
              </h2>
              <span className="text-[11px] font-medium text-on-surface-variant bg-surface-container-lowest/80 px-2 py-0.5 rounded-full border border-outline-variant/20">
                Automated Synthesis • Confidence 98.4%
              </span>
            </div>

            <p className="text-[16px] text-on-surface font-medium mt-1">
              GovAI found {displayedDatasets.length} datasets. The most recently updated is ‘County Population Estimates 2020’.
            </p>

            <div className="flex items-center gap-space-md mt-space-xs flex-wrap">
              <div className="flex items-center gap-1 text-on-surface-variant text-[11px] font-medium">
                <span className="material-symbols-outlined text-[16px] text-secondary">verified</span>
                <span>Matched across 3 planning sectors</span>
              </div>
              <div className="flex items-center gap-1 text-on-surface-variant text-[11px] font-medium">
                <span className="material-symbols-outlined text-[16px]">history_toggle_off</span>
                <span>Audit verification timestamp: Today, 09:42 EST</span>
              </div>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-space-sm">
            <button 
              onClick={() => onOpenGovAi(`Synthesize current query results for: ${currentQuery}`)}
              className="bg-secondary hover:bg-on-secondary-container text-on-secondary px-space-lg py-2.5 rounded-lg text-[14px] font-bold flex items-center gap-space-xs shadow-md transition-all active:scale-[0.98] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
              <span>Ask GovAI about these results</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric 4-Card Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-space-md">
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-outline-variant/30 flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-[11px] font-bold uppercase tracking-wider">Spatial Layer Match</span>
            <span className="material-symbols-outlined text-[18px] text-secondary">layers</span>
          </div>
          <div className="flex items-baseline gap-space-xs mt-space-sm">
            <span className="text-[24px] font-bold text-on-surface font-tabular-data">2</span>
            <span className="text-[12px] text-on-surface-variant font-medium">GIS Geodatabases</span>
          </div>
          <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-space-sm overflow-hidden">
            <div className="bg-secondary h-full rounded-full" style={{ width: '40%' }}></div>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-outline-variant/30 flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-[11px] font-bold uppercase tracking-wider">GeoHub Synchronized</span>
            <span className="material-symbols-outlined text-[18px] text-secondary">sync_alt</span>
          </div>
          <div className="flex items-baseline gap-space-xs mt-space-sm">
            <span className="text-[24px] font-bold text-on-surface font-tabular-data">1 / 5</span>
            <span className="text-[12px] text-on-surface-variant font-medium">Live on public portal</span>
          </div>
          <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-space-sm overflow-hidden">
            <div className="bg-primary h-full rounded-full" style={{ width: '20%' }}></div>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-outline-variant/30 flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-[11px] font-bold uppercase tracking-wider">Editor Ownership</span>
            <span className="material-symbols-outlined text-[18px] text-secondary">edit_document</span>
          </div>
          <div className="flex items-baseline gap-space-xs mt-space-sm">
            <span className="text-[24px] font-bold text-on-surface font-tabular-data">2 Records</span>
            <span className="text-[12px] text-secondary font-bold">Write Access</span>
          </div>
          <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-space-sm overflow-hidden">
            <div className="bg-secondary h-full rounded-full" style={{ width: '40%' }}></div>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-outline-variant/30 flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-[11px] font-bold uppercase tracking-wider">Planning Mandates</span>
            <span className="material-symbols-outlined text-[18px] text-secondary">account_tree</span>
          </div>
          <div className="flex items-baseline gap-space-xs mt-space-sm">
            <span className="text-[24px] font-bold text-on-surface font-tabular-data">4 Linked</span>
            <span className="text-[12px] text-on-surface-variant font-medium">1 General unlinked</span>
          </div>
          <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-space-sm overflow-hidden">
            <div className="bg-primary-container h-full rounded-full" style={{ width: '80%' }}></div>
          </div>
        </div>
      </div>

      {/* Data Table Container */}
      <div className="bg-surface-container-lowest rounded-xl shadow-xs border border-outline-variant/30 flex flex-col overflow-hidden">
        {/* Table Action Utility Subheader */}
        <div className="p-space-md bg-surface-container-low flex items-center justify-between flex-wrap gap-space-sm border-b border-outline-variant/30">
          <div className="flex items-center gap-space-sm flex-wrap">
            <button 
              onClick={() => setFilterPanelOpen(!filterPanelOpen)}
              className={`px-space-md h-9 rounded-lg text-[13px] font-semibold flex items-center gap-space-xs shadow-2xs transition-colors cursor-pointer border ${
                filterPanelOpen 
                  ? 'bg-surface-container-high text-on-surface border-secondary' 
                  : 'bg-surface-container-lowest hover:bg-surface-container text-on-surface border-outline-variant/30'
              }`}
            >
              <span className="material-symbols-outlined text-[18px] text-secondary">tune</span>
              <span>Filter Panel</span>
              <span className="bg-surface-container-high text-on-surface px-1.5 py-0.2 rounded text-[11px] font-bold">
                {activeConstraints.length}
              </span>
            </button>

            <div className="h-6 w-px bg-outline-variant/30"></div>

            <div className="flex items-center gap-space-xs">
              <div className="relative group">
                <button 
                  onClick={() => {
                    if (selectedIds.length === 0) {
                      alert('Please select one or more datasets first using the checkboxes.');
                    } else {
                      alert(`Bulk operation for ${selectedIds.length} datasets: Validated metadata schemas and permissions.`);
                    }
                  }}
                  className="bg-surface-container-lowest hover:bg-surface-container text-on-surface px-space-sm h-9 rounded-lg text-[13px] font-semibold flex items-center gap-space-xs shadow-2xs transition-colors cursor-pointer border border-outline-variant/30"
                >
                  <span className="material-symbols-outlined text-[18px]">checklist</span>
                  <span>Bulk Actions</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_drop_down</span>
                </button>
              </div>

              <span className="text-[12px] text-on-surface-variant pl-space-xs font-tabular-data">
                {selectedIds.length} of {displayedDatasets.length} selected
              </span>
            </div>
          </div>

          <div className="flex items-center gap-space-sm flex-wrap">
            <button 
              onClick={() => {
                if (onOpenSharePointExport) {
                  onOpenSharePointExport();
                } else {
                  exportSelectedCsv();
                }
              }}
              className="bg-primary hover:bg-primary-container text-on-primary px-space-md h-9 rounded-lg text-[13px] font-bold flex items-center gap-space-xs shadow-xs transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] text-secondary-fixed">cloud_download</span>
              <span>Export from SharePoint</span>
            </button>

            <button 
              onClick={exportSelectedCsv}
              className="bg-surface-container-lowest hover:bg-surface-container text-on-surface px-space-md h-9 rounded-lg text-[13px] font-semibold flex items-center gap-space-xs shadow-2xs transition-colors cursor-pointer border border-outline-variant/30"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>Export CSV</span>
            </button>

            <button 
              onClick={() => {
                alert('Column display options: All 8 core columns are currently visible according to RPA standard template.');
              }}
              className="bg-surface-container-lowest hover:bg-surface-container text-on-surface px-space-sm h-9 rounded-lg text-[13px] font-semibold flex items-center gap-space-xs shadow-2xs transition-colors cursor-pointer border border-outline-variant/30"
            >
              <span className="material-symbols-outlined text-[18px]">table_chart_view</span>
              <span>Columns</span>
            </button>

            <button 
              onClick={() => {
                setQueryInput(currentQuery);
              }}
              title="Refresh catalog data"
              className="bg-surface-container-lowest hover:bg-surface-container text-on-surface w-9 h-9 rounded-lg flex items-center justify-center shadow-2xs transition-colors cursor-pointer border border-outline-variant/30"
            >
              <span className="material-symbols-outlined text-[18px]">refresh</span>
            </button>
          </div>
        </div>

        {/* Collapsible Quick Topic Filter Strip */}
        {filterPanelOpen && (
          <div className="p-3 bg-surface-container border-b border-outline-variant/30 flex items-center gap-2 flex-wrap text-xs animate-in slide-in-from-top-1">
            <span className="font-bold text-on-surface-variant uppercase tracking-wider text-[11px]">Filter by Topic:</span>
            {['all', 'Demographics', 'Environment', 'Economy', 'Transportation', 'Land Use'].map(topic => (
              <button
                key={topic}
                onClick={() => setActiveTopicFilter(topic)}
                className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer border transition-colors ${
                  activeTopicFilter === topic
                    ? 'bg-primary text-on-primary border-primary'
                    : 'bg-surface-container-lowest text-on-surface border-outline-variant/30 hover:bg-surface-container-high'
                }`}
              >
                {topic === 'all' ? 'All Topics' : topic}
              </button>
            ))}
          </div>
        )}

        {/* Table Records */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant text-[12px] font-semibold tracking-tight h-10 select-none border-b border-outline-variant/30">
                <th className="w-10 px-space-md py-2">
                  <input 
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    type="checkbox"
                    className="w-4 h-4 rounded text-secondary focus:ring-0 cursor-pointer accent-secondary"
                  />
                </th>
                <th 
                  onClick={() => {
                    setSortBy('name');
                    setSortAsc(!sortAsc);
                  }}
                  className="px-space-md py-2 font-bold cursor-pointer hover:text-on-surface"
                >
                  <div className="flex items-center gap-1">
                    <span>Dataset name</span>
                    <span className="material-symbols-outlined text-[16px]">unfold_more</span>
                  </div>
                </th>
                <th className="px-space-md py-2 font-bold">Topic</th>
                <th className="px-space-md py-2 font-bold">File type</th>
                <th className="px-space-md py-2 font-bold">Plan it supports</th>
                <th className="px-space-md py-2 font-bold">Owner</th>
                <th 
                  onClick={() => {
                    setSortBy('lastModified');
                    setSortAsc(!sortAsc);
                  }}
                  className="px-space-md py-2 font-bold cursor-pointer hover:text-on-surface"
                >
                  <div className="flex items-center gap-1">
                    <span>Last modified</span>
                    <span className="material-symbols-outlined text-[16px] text-secondary">
                      {sortAsc ? 'arrow_upward' : 'arrow_downward'}
                    </span>
                  </div>
                </th>
                <th className="px-space-md py-2 font-bold">Also on GeoHub</th>
                <th className="px-space-md py-2 font-bold">Your access</th>
                <th className="w-12 px-space-sm py-2 text-right"></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-outline-variant/20 text-on-surface text-[14px]">
              {displayedDatasets.map((dataset) => {
                const isChecked = selectedIds.includes(dataset.id);
                return (
                  <tr 
                    key={dataset.id}
                    className={`transition-colors group ${
                      isChecked ? 'bg-secondary-container/15' : 'hover:bg-surface-container-low/70'
                    }`}
                  >
                    <td className="px-space-md py-space-sm">
                      <input 
                        checked={isChecked}
                        onChange={() => toggleSelectRow(dataset.id)}
                        type="checkbox"
                        className="w-4 h-4 rounded text-secondary focus:ring-0 cursor-pointer accent-secondary"
                      />
                    </td>

                    <td className="px-space-md py-space-sm">
                      <div className="flex flex-col">
                        <button
                          onClick={() => {
                            onSelectDataset(dataset);
                            onNavigate('dataset-details');
                          }}
                          className="text-[15px] font-bold text-primary hover:text-secondary flex items-center gap-space-xs text-left cursor-pointer transition-colors"
                        >
                          <span>{dataset.name}</span>
                          <span className="material-symbols-outlined text-[14px] opacity-0 group-hover:opacity-100 transition-opacity">
                            open_in_new
                          </span>
                        </button>
                        <span className="font-tabular-data text-[12px] text-on-surface-variant">
                          UID: {dataset.uid} • {dataset.fileType === 'Excel' ? 'GeoJSON & Tabular bundle' : dataset.formatLabel}
                        </span>
                      </div>
                    </td>

                    <td className="px-space-md py-space-sm">
                      <span className="text-[13px]">{dataset.topic}</span>
                    </td>

                    <td className="px-space-md py-space-sm">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[18px] text-secondary">
                          {dataset.fileType === 'Excel' ? 'table_view' : dataset.fileType === 'GIS' ? 'map' : 'description'}
                        </span>
                        <span className="text-[12px] font-bold uppercase">{dataset.fileType}</span>
                      </div>
                    </td>

                    <td className="px-space-md py-space-sm">
                      <span className={`text-[13px] ${dataset.plan === 'None' ? 'text-on-surface-variant italic' : 'text-on-surface'}`}>
                        {dataset.plan}
                      </span>
                    </td>

                    <td className="px-space-md py-space-sm">
                      <div className="flex items-center gap-space-xs">
                        <div className="w-6 h-6 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center text-[10px] font-bold">
                          {dataset.ownerInitials}
                        </div>
                        <span className="text-[13px]">{dataset.owner}</span>
                      </div>
                    </td>

                    <td className="px-space-md py-space-sm">
                      <div className="flex flex-col font-tabular-data">
                        <span className="text-[13px] font-semibold">{dataset.lastModified}</span>
                        <span className="text-[11px] text-on-surface-variant">{dataset.lastModifiedAgo}</span>
                      </div>
                    </td>

                    <td className="px-space-md py-space-sm">
                      {dataset.geohubStatus === 'yes' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#89f5e7] text-[#00201d]">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                          <span>Yes</span>
                        </span>
                      ) : dataset.geohubStatus === 'unsure' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-surface-container-highest text-on-surface">
                          <span className="w-1.5 h-1.5 rounded-full bg-outline"></span>
                          <span>Unsure</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-medium bg-surface-container-high text-on-surface-variant">
                          <span className="w-1.5 h-1.5 rounded-full bg-outline"></span>
                          <span>No</span>
                        </span>
                      )}
                    </td>

                    <td className="px-space-md py-space-sm">
                      {dataset.userAccess === 'Editor' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-secondary-container text-on-secondary-container">
                          <span className="material-symbols-outlined text-[14px]">edit</span>
                          <span>Editor</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-medium bg-surface-container text-on-surface-variant">
                          <span className="material-symbols-outlined text-[14px]">visibility</span>
                          <span>Viewer</span>
                        </span>
                      )}
                    </td>

                    <td className="px-space-sm py-space-sm text-right">
                      <button 
                        onClick={() => onPreviewDataset(dataset)}
                        className="text-on-surface-variant hover:text-on-surface p-1 rounded hover:bg-surface-container cursor-pointer"
                        title="Preview dataset"
                      >
                        <span className="material-symbols-outlined text-[20px]">more_vert</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Footer Pagination */}
        <div className="p-space-md bg-surface-container-lowest flex items-center justify-between flex-wrap gap-space-md border-t border-outline-variant/30">
          <div className="flex items-center gap-space-xs text-[12px] text-on-surface-variant font-medium">
            <span>Displaying 1-{displayedDatasets.length} of {displayedDatasets.length} datasets</span>
            <span className="mx-1">•</span>
            <span>100% indexed in RPA spatial registry</span>
          </div>

          <div className="flex items-center gap-space-xs">
            <button 
              disabled 
              className="px-space-sm py-1 rounded bg-surface-container-low text-on-surface-variant text-[12px] cursor-not-allowed opacity-50 flex items-center"
            >
              <span className="material-symbols-outlined text-[16px]">chevron_left</span>
              <span>Previous</span>
            </button>
            <button className="w-8 h-8 rounded bg-primary text-on-primary text-[12px] font-bold flex items-center justify-center">
              1
            </button>
            <button 
              onClick={() => alert('All matching records are displayed on Page 1.')}
              className="px-space-sm py-1 rounded bg-surface-container-low hover:bg-surface-container text-on-surface text-[12px] font-medium flex items-center cursor-pointer"
            >
              <span>Next</span>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Federated Cross-Catalog Links & Compliance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg mt-space-xs">
        <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-xs border border-outline-variant/30 flex flex-col justify-between">
          <div className="flex items-start justify-between gap-space-md">
            <div className="flex flex-col gap-space-xs">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-secondary text-[20px]">hub</span>
                <span className="text-[16px] font-bold text-on-surface">Federated Cross-Catalog Links</span>
              </div>
              <p className="text-[14px] text-on-surface-variant leading-relaxed">
                The query also surfaced 3 related environmental monitoring stations stored within State USGS endpoints not hosted locally.
              </p>
            </div>
            <span className="bg-secondary-container text-on-secondary-container text-[11px] font-bold px-2 py-0.5 rounded uppercase shrink-0">
              External
            </span>
          </div>

          <div className="pt-space-md mt-space-md border-t border-outline-variant/20 flex items-center justify-between">
            <span className="text-[12px] text-on-surface-variant font-medium">USGS Quadrangle 40105-H1 • Regional Flow</span>
            <button 
              onClick={() => alert('Connected to State USGS Gateway. External layers: Station #04192000, Streamflow gauge #12B.')}
              className="text-[13px] text-secondary hover:underline flex items-center gap-1 font-bold cursor-pointer"
            >
              <span>Query USGS Gateway</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-xs border border-outline-variant/30 flex flex-col justify-between">
          <div className="flex items-start justify-between gap-space-md">
            <div className="flex flex-col gap-space-xs">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-tertiary text-[20px]">history_edu</span>
                <span className="text-[16px] font-bold text-on-surface">Metadata Compliance & Audit Log</span>
              </div>
              <p className="text-[14px] text-on-surface-variant leading-relaxed">
                All {displayedDatasets.length} retrieved records meet FGDC and RPA Core Standard v4.2 specifications. No orphaned records found.
              </p>
            </div>
            <span className="bg-surface-container-high text-on-surface-variant text-[11px] font-bold px-2 py-0.5 rounded uppercase shrink-0">
              Audit Ok
            </span>
          </div>

          <div className="pt-space-md mt-space-md border-t border-outline-variant/20 flex items-center justify-between">
            <span className="text-[12px] text-on-surface-variant font-medium">Last automated scan: 04:00 AM EST</span>
            <button 
              onClick={() => onNavigate('help')}
              className="text-[13px] text-primary hover:underline flex items-center gap-1 font-bold cursor-pointer"
            >
              <span>View Full Audit Certificate</span>
              <span className="material-symbols-outlined text-[16px]">verified</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
