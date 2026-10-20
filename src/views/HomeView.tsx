import React, { useState } from 'react';
import { Dataset, FileType, TopicType, ScreenMode } from '../types.ts';

interface HomeViewProps {
  datasets: Dataset[];
  onSelectDataset: (dataset: Dataset) => void;
  onNavigate: (screen: ScreenMode) => void;
  onOpenGovAi: (prompt?: string) => void;
  onPreviewDataset: (dataset: Dataset) => void;
  onSearchQuery: (query: string) => void;
  onOpenSharePointExport?: (dataset?: Dataset) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  datasets,
  onSelectDataset,
  onNavigate,
  onOpenGovAi,
  onPreviewDataset,
  onSearchQuery,
  onOpenSharePointExport
}) => {
  const [searchMode, setSearchMode] = useState<'catalog' | 'govai'>('catalog');
  const [searchInput, setSearchInput] = useState('');
  
  // Filter States
  const [selectedTypes, setSelectedTypes] = useState<FileType[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<TopicType[]>([]);
  const [selectedPlans, setSelectedPlans] = useState<string[]>([]);
  const [selectedOwner, setSelectedOwner] = useState<string>('');

  const toggleType = (t: FileType) => {
    setSelectedTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  };

  const toggleTopic = (tp: TopicType) => {
    setSelectedTopics(prev => prev.includes(tp) ? prev.filter(x => x !== tp) : [...prev, tp]);
  };

  const togglePlan = (p: string) => {
    setSelectedPlans(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  };

  const resetFilters = () => {
    setSelectedTypes([]);
    setSelectedTopics([]);
    setSelectedPlans([]);
    setSelectedOwner('');
    setSearchInput('');
  };

  const handleExecuteSearch = () => {
    if (searchMode === 'govai') {
      onOpenGovAi(searchInput || 'Search datasets across regional spatial repository');
    } else {
      onSearchQuery(searchInput);
      onNavigate('browse-by-topic');
    }
  };

  // Filter datasets for the "Recently Updated Datasets" view
  const filteredDatasets = datasets.filter(d => {
    if (selectedTypes.length > 0 && !selectedTypes.includes(d.fileType)) return false;
    if (selectedTopics.length > 0 && !selectedTopics.includes(d.topic)) return false;
    if (selectedPlans.length > 0 && !selectedPlans.includes(d.plan)) return false;
    if (selectedOwner && !d.owner.toLowerCase().includes(selectedOwner.toLowerCase())) return false;
    if (searchInput) {
      const q = searchInput.toLowerCase();
      return (
        d.name.toLowerCase().includes(q) ||
        d.topic.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.owner.toLowerCase().includes(q) ||
        d.uid.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="flex flex-col w-full max-w-[1520px] mx-auto pb-12">
      {/* Hero Banner Container */}
      <div className="relative w-full overflow-hidden bg-primary text-on-primary rounded-xl p-space-xl shadow-md mb-space-xl border border-outline-variant/20">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-secondary opacity-15 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-surface-variant opacity-15 blur-2xl pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl flex flex-col gap-space-md">
          {/* Top Trust Ribbons */}
          <div className="flex items-center gap-space-sm flex-wrap">
            <span className="inline-flex items-center gap-space-xs px-2.5 py-1 rounded bg-primary-container text-on-primary-container text-[11px] font-bold uppercase tracking-wider border border-outline-variant/20">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              Authoritative Regional Gateway
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container-low text-tertiary text-[11px] font-bold">
              <span className="material-symbols-outlined text-[15px] text-tertiary">verified</span>
              State Metadata v4.2 Validated
            </span>
          </div>

          {/* Headline & Abstract */}
          <div>
            <h1 className="text-[32px] font-bold text-on-primary tracking-tight leading-tight">
              Regional Planning Data Catalog
            </h1>
            <p className="text-[16px] text-primary-fixed-dim mt-space-xs max-w-2xl leading-relaxed">
              SharePoint & GeoHub Central Repository for unified GIS boundaries, socio-economic projections, and regional zoning archives.
            </p>
          </div>

          {/* Unified Search Box Widget */}
          <div className="mt-space-sm bg-surface-container-lowest rounded-xl p-space-sm shadow-xl text-on-surface border border-outline-variant/30">
            {/* Mode Switcher Tabs */}
            <div className="flex items-center gap-space-xs p-1 bg-surface-container-low rounded-lg w-fit mb-space-sm">
              <button 
                onClick={() => setSearchMode('catalog')}
                className={`flex items-center gap-space-xs px-space-md py-1.5 rounded-md text-[14px] font-semibold transition-all cursor-pointer ${
                  searchMode === 'catalog'
                    ? 'bg-surface-container-lowest text-on-surface shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[18px] text-primary">search</span>
                <span>Search catalog</span>
              </button>

              <button 
                onClick={() => setSearchMode('govai')}
                className={`flex items-center gap-space-xs px-space-md py-1.5 rounded-md text-[14px] font-semibold transition-all cursor-pointer ${
                  searchMode === 'govai'
                    ? 'bg-surface-container-lowest text-on-surface shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[18px] text-secondary">auto_awesome</span>
                <span>Ask GovAI</span>
                <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-secondary-container text-on-secondary-container">
                  GovAI
                </span>
              </button>
            </div>

            {/* Input Field & Execute Button */}
            <div className="relative flex items-center">
              <span className={`material-symbols-outlined absolute left-space-md pointer-events-none text-[22px] ${
                searchMode === 'govai' ? 'text-secondary' : 'text-outline'
              }`}>
                {searchMode === 'govai' ? 'auto_awesome' : 'search'}
              </span>

              <input 
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleExecuteSearch();
                }}
                className="w-full pl-12 pr-32 py-3 bg-surface-container-low text-on-surface placeholder:text-on-surface-variant/70 text-[16px] rounded-lg focus:outline-none focus:bg-surface-container-lowest transition-all border border-transparent focus:border-secondary"
                placeholder={
                  searchMode === 'govai'
                    ? "Ask GovAI where to find data, e.g., latest county population data or parks boundary..."
                    : "Search spatial layers, tabular spreadsheets, agency custodians, or metadata tags..."
                }
                type="text"
              />

              <div className="absolute right-2 flex items-center gap-space-xs">
                <button 
                  onClick={handleExecuteSearch}
                  className="bg-primary hover:bg-primary-container text-on-primary px-space-md py-2 rounded-lg text-[14px] font-semibold transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {searchMode === 'govai' ? 'auto_awesome' : 'travel_explore'}
                  </span>
                  <span>Execute</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Metric Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md mb-space-xl">
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs border border-outline-variant/30 flex items-start justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Total Datasets</span>
            <div className="flex items-baseline gap-space-xs mt-1">
              <span className="text-[32px] font-bold text-on-surface leading-none font-tabular-data">142</span>
              <span className="text-[12px] text-secondary font-semibold">+6 this month</span>
            </div>
            <span className="text-[12px] text-on-surface-variant mt-space-xs">100% compliant with ISO 19115 schema</span>
          </div>
          <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center shrink-0 text-primary">
            <span className="material-symbols-outlined text-[26px]">folder_copy</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs border border-outline-variant/30 flex items-start justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">GeoHub Synced</span>
            <div className="flex items-baseline gap-space-xs mt-1">
              <span className="text-[32px] font-bold text-secondary leading-none font-tabular-data">48</span>
              <span className="text-[12px] text-on-surface-variant font-medium">/ 52 eligible</span>
            </div>
            <span className="text-[12px] text-on-surface-variant mt-space-xs">ArcGIS Server & Feature Services active</span>
          </div>
          <div className="w-12 h-12 rounded-lg bg-secondary-container/40 flex items-center justify-center shrink-0 text-secondary">
            <span className="material-symbols-outlined text-[26px]">public</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs border border-outline-variant/30 flex items-start justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">SharePoint Repositories</span>
            <div className="flex items-baseline gap-space-xs mt-1">
              <span className="text-[32px] font-bold text-tertiary-container leading-none font-tabular-data">12</span>
              <span className="text-[12px] text-secondary font-semibold">All Online</span>
            </div>
            <span className="text-[12px] text-on-surface-variant mt-space-xs">Departmental document drives linked</span>
          </div>
          <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0 text-tertiary">
            <span className="material-symbols-outlined text-[26px]">cloud_sync</span>
          </div>
        </div>
      </div>

      {/* Structured Catalog Filters Tray */}
      <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs border border-outline-variant/30 mb-space-xl flex flex-col gap-space-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-secondary text-[20px]">filter_list</span>
            <span className="text-[14px] font-bold text-on-surface">Structured Catalog Filters</span>
          </div>
          <button 
            onClick={resetFilters}
            className="text-[12px] font-semibold text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[14px]">restart_alt</span>
            <span>Reset all</span>
          </button>
        </div>

        <div className="flex flex-col gap-space-sm">
          {/* File Type Filters */}
          <div className="flex items-center gap-space-sm flex-wrap text-[13px]">
            <span className="w-20 shrink-0 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">File type:</span>
            <div className="flex items-center gap-space-xs flex-wrap">
              {(['Excel', 'CSV', 'GIS', 'PDF'] as FileType[]).map((type) => {
                const isSelected = selectedTypes.includes(type);
                return (
                  <button
                    key={type}
                    onClick={() => toggleType(type)}
                    className={`px-space-sm py-1 rounded-md text-[12px] font-semibold transition-colors flex items-center gap-1 cursor-pointer border ${
                      isSelected
                        ? 'bg-primary text-on-primary border-primary'
                        : 'bg-surface-container hover:bg-surface-container-high text-on-surface border-outline-variant/20'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {type === 'Excel' ? 'table_view' : type === 'CSV' ? 'grid_on' : type === 'GIS' ? 'layers' : 'picture_as_pdf'}
                    </span>
                    <span>{type}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Topic Filters */}
          <div className="flex items-center gap-space-sm flex-wrap text-[13px]">
            <span className="w-20 shrink-0 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Topic:</span>
            <div className="flex items-center gap-space-xs flex-wrap">
              {(['Demographics', 'Economy', 'Environment', 'Transportation', 'Land Use', 'Housing'] as TopicType[]).map((topic) => {
                const isSelected = selectedTopics.includes(topic);
                return (
                  <button
                    key={topic}
                    onClick={() => toggleTopic(topic)}
                    className={`px-space-sm py-1 rounded-md text-[12px] font-semibold transition-colors cursor-pointer border ${
                      isSelected
                        ? 'bg-primary text-on-primary border-primary'
                        : 'bg-surface-container hover:bg-surface-container-high text-on-surface border-outline-variant/20'
                    }`}
                  >
                    {topic}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Plan Filters */}
          <div className="flex items-center gap-space-sm flex-wrap text-[13px]">
            <span className="w-20 shrink-0 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Plan:</span>
            <div className="flex items-center gap-space-xs flex-wrap">
              {[
                { key: 'Economic Development Strategy', label: 'Economic Development Strategy', icon: 'assignment' },
                { key: 'Natural Resources Plan', label: 'Natural Resources Plan', icon: 'park' }
              ].map(plan => {
                const isSelected = selectedPlans.includes(plan.key);
                return (
                  <button
                    key={plan.key}
                    onClick={() => togglePlan(plan.key)}
                    className={`px-space-sm py-1 rounded-md text-[12px] font-semibold transition-colors flex items-center gap-1 cursor-pointer border ${
                      isSelected
                        ? 'bg-primary text-on-primary border-primary'
                        : 'bg-surface-container hover:bg-surface-container-high text-on-surface border-outline-variant/20'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[15px] text-secondary">{plan.icon}</span>
                    <span>{plan.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Owner Filter */}
          <div className="flex items-center gap-space-sm flex-wrap text-[13px]">
            <span className="w-20 shrink-0 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Owner:</span>
            <div className="relative">
              <select
                value={selectedOwner}
                onChange={(e) => setSelectedOwner(e.target.value)}
                className="px-space-sm py-1 bg-surface-container rounded-md text-on-surface text-[12px] font-semibold appearance-none pr-8 cursor-pointer focus:outline-none border border-outline-variant/20"
              >
                <option value="">Filter by Staff / Custodian...</option>
                <option value="J. Doe">J. Doe (Planning Analytics)</option>
                <option value="A. Smith">A. Smith (GIS Coordinator)</option>
                <option value="B. Lee">B. Lee (Transit Modeler)</option>
                <option value="Alex Mercer">Alex Mercer (Data Manager)</option>
              </select>
              <span className="material-symbols-outlined text-[16px] text-on-surface-variant absolute right-2 top-1.5 pointer-events-none">
                expand_more
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Recently Updated Datasets & Planning Scope Rail */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-xl">
        {/* Left Column (8 cols): Dataset Feed */}
        <div className="xl:col-span-8 flex flex-col gap-space-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-primary text-[20px]">history</span>
              <h2 className="text-[18px] font-bold text-on-surface">Recently Updated Datasets</h2>
            </div>
            <span className="text-[12px] text-on-surface-variant">
              Showing {filteredDatasets.length} administrative records
            </span>
          </div>

          <div className="flex flex-col gap-space-sm">
            {filteredDatasets.length === 0 ? (
              <div className="bg-surface-container-lowest p-space-xl rounded-xl text-center border border-outline-variant/30">
                <p className="text-on-surface font-semibold">No datasets matched your active filters.</p>
                <button 
                  onClick={resetFilters} 
                  className="mt-2 text-xs text-secondary font-bold hover:underline cursor-pointer"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              filteredDatasets.map((dataset) => (
                <div 
                  key={dataset.id}
                  className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs hover:shadow-md transition-shadow flex flex-col gap-space-sm border border-outline-variant/30"
                >
                  <div className="flex items-start justify-between gap-space-sm">
                    <div className="flex items-start gap-space-sm">
                      <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center shrink-0 mt-0.5 text-secondary">
                        <span className="material-symbols-outlined text-[22px]">
                          {dataset.fileType === 'Excel' ? 'table_chart' : dataset.fileType === 'GIS' ? 'map' : 'bar_chart'}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-space-xs flex-wrap">
                          <button
                            onClick={() => {
                              onSelectDataset(dataset);
                              onNavigate('dataset-details');
                            }}
                            className="text-[16px] text-on-surface hover:text-secondary font-bold text-left transition-colors cursor-pointer"
                          >
                            {dataset.name}
                          </button>
                          <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant text-[11px] font-bold">
                            {dataset.topic}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface text-[11px] font-bold">
                            {dataset.formatLabel}
                          </span>
                          {dataset.geohubPublished && (
                            <span className="px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container text-[11px] font-bold flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                              GeoHub Published
                            </span>
                          )}
                          {dataset.geohubStatus === 'unsure' && (
                            <span className="px-2 py-0.5 rounded bg-surface-container-highest text-on-surface-variant text-[11px] font-bold flex items-center gap-1">
                              <span className="material-symbols-outlined text-[13px] text-outline">help_outline</span>
                              GeoHub Status: Unsure
                            </span>
                          )}
                        </div>
                        <p className="text-[13px] text-on-surface-variant mt-1 leading-snug">
                          {dataset.description}
                        </p>
                      </div>
                    </div>

                    <span className="text-[11px] font-medium text-on-surface-variant shrink-0 bg-surface-container-low px-2 py-1 rounded border border-outline-variant/20">
                      {dataset.lastModifiedAgo}
                    </span>
                  </div>

                  {/* Card Bottom Meta Bar */}
                  <div className="flex items-center justify-between pt-space-xs text-[12px] text-on-surface-variant bg-surface-container-low px-space-sm py-1.5 rounded-lg border border-outline-variant/20">
                    <div className="flex items-center gap-space-sm truncate">
                      <span className="flex items-center gap-1 text-[11px] font-bold text-on-surface shrink-0">
                        <span className="material-symbols-outlined text-[16px] text-outline">person</span>
                        Custody: {dataset.owner}
                      </span>
                      <span className="text-outline-variant">•</span>
                      <span className="font-tabular-data text-on-surface-variant truncate">
                        {dataset.fileType === 'GIS' && dataset.geohubPublished ? (
                          <span className="text-secondary font-medium">ESRI REST: /Hosted/Parks_Boundary/FeatureServer</span>
                        ) : dataset.geohubStatus === 'unsure' ? (
                          'Sync state: Pending Verification'
                        ) : (
                          `SharePoint: ${dataset.sharepointPath}`
                        )}
                      </span>
                    </div>

                    <div className="flex items-center gap-space-xs shrink-0 pl-2">
                      <button 
                        onClick={() => onPreviewDataset(dataset)}
                        className="px-2 py-1 rounded hover:bg-surface-container-highest text-on-surface text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {dataset.fileType === 'GIS' ? 'map' : 'visibility'}
                        </span>
                        <span>{dataset.fileType === 'GIS' ? 'Web Map' : 'Preview'}</span>
                      </button>

                      <button 
                        onClick={() => {
                          if (dataset.fileType === 'GIS' || dataset.geohubStatus === 'unsure') {
                            onSelectDataset(dataset);
                            onNavigate('dataset-details');
                          } else if (onOpenSharePointExport) {
                            onOpenSharePointExport(dataset);
                          } else {
                            onSelectDataset(dataset);
                            onNavigate('dataset-details');
                          }
                        }}
                        className="px-2 py-1 rounded bg-primary text-on-primary text-[11px] font-bold flex items-center gap-1 hover:bg-primary-container transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {dataset.fileType === 'GIS' || dataset.geohubStatus === 'unsure' ? 'file_open' : 'download'}
                        </span>
                        <span>{dataset.fileType === 'GIS' || dataset.geohubStatus === 'unsure' ? 'Metadata' : 'Fetch'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column (4 cols): Geographic Scope, Format Bars, Verification Status */}
        <div className="xl:col-span-4 flex flex-col gap-space-md">
          {/* Regional Planning Scope Widget */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs border border-outline-variant/30 flex flex-col gap-space-sm">
            <div className="flex items-center gap-space-xs text-on-surface">
              <span className="material-symbols-outlined text-secondary text-[20px]">map</span>
              <span className="text-[14px] font-bold">Regional Planning Scope</span>
            </div>

            {/* Geographic Box Image with Hotlink */}
            <div 
              className="w-full h-44 bg-cover bg-center rounded-lg shadow-inner relative overflow-hidden border border-outline-variant/30"
              style={{
                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDoMnw5U1CGYhhb2-DeUH-S5o1Svqlkc3Ol9adEwZKb83EsXmxSZUn_-PVZnU8d1DSjXzWkOwUDPfhECs6OBXScnWLGZN-tWgLzRHlrn-bFGf6jgcOGevkDkywEI_E8U80Px5GWmVgJI3RbFMBHV_HyLll5SquwjZrKu8Mtot6rhpz1ro-oYwi-cCWO114T8eF9U0trJsbnVBLu8UD2RaOhKPIYMoFIxgk8Z7o2Z3x1kAimfQjo_853')`
              }}
            >
              <div className="absolute bottom-2 left-2 bg-surface/90 backdrop-blur-md px-2 py-1 rounded text-[11px] font-bold text-on-surface border border-outline-variant/20 shadow-xs">
                County Boundary Grid • WGS 84
              </div>
            </div>

            <p className="text-[12px] text-on-surface-variant leading-relaxed">
              Tri-county jurisdictional boundary. 24 municipal civil divisions mapped with live sync to the State Open Data Portal.
            </p>
          </div>

          {/* Catalog Storage by Format */}
          <div className="bg-surface-container-low p-space-md rounded-xl flex flex-col gap-space-sm border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <span className="text-[14px] font-bold text-on-surface">Catalog Storage by Format</span>
              <span className="text-[11px] font-tabular-data text-on-surface-variant">142 total</span>
            </div>

            <div className="flex flex-col gap-space-xs pt-1">
              <div>
                <div className="flex justify-between text-[11px] font-medium text-on-surface mb-1">
                  <span>GIS Geodatabases & Layers</span>
                  <span className="font-tabular-data font-semibold">48 (34%)</span>
                </div>
                <div className="w-full h-2 rounded bg-surface-container overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: '34%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-medium text-on-surface mb-1">
                  <span>Tabular (Excel & CSV)</span>
                  <span className="font-tabular-data font-semibold">65 (46%)</span>
                </div>
                <div className="w-full h-2 rounded bg-surface-container overflow-hidden">
                  <div className="h-full bg-secondary" style={{ width: '46%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-medium text-on-surface mb-1">
                  <span>Reports & Policy PDFs</span>
                  <span className="font-tabular-data font-semibold">29 (20%)</span>
                </div>
                <div className="w-full h-2 rounded bg-surface-container overflow-hidden">
                  <div className="h-full bg-tertiary-container" style={{ width: '20%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Data Verification Status Circular Gauge */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs border border-outline-variant/30 flex flex-col gap-space-sm">
            <div className="flex items-center justify-between">
              <span className="text-[14px] font-bold text-on-surface">Data Verification Status</span>
              <span className="text-[11px] text-secondary font-bold">Audit Active</span>
            </div>

            <div className="flex items-center gap-space-md pt-1">
              <svg className="w-16 h-16 shrink-0" viewBox="0 0 36 36">
                <path 
                  className="text-surface-container" 
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="3.5"
                />
                <path 
                  className="text-secondary" 
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeDasharray="92, 100" 
                  strokeLinecap="round" 
                  strokeWidth="3.5"
                />
                <text 
                  className="fill-current text-on-surface font-bold text-center" 
                  fontSize="9" 
                  textAnchor="middle" 
                  x="18" 
                  y="20.5"
                >
                  92%
                </text>
              </svg>

              <div className="flex flex-col">
                <span className="text-[12px] font-bold text-on-surface">Metadata Completeness</span>
                <span className="text-[12px] text-on-surface-variant leading-snug">
                  131 of 142 records have complete spatial extents & contact points.
                </span>
              </div>
            </div>
          </div>

          {/* Security & Retention Guard Callout */}
          <div className="bg-secondary-container/20 rounded-xl p-space-md flex flex-col gap-space-xs border border-secondary-container/40">
            <div className="flex items-center gap-space-xs text-on-secondary-container font-bold text-[12px]">
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
              <span>Security & Retention Guard</span>
            </div>
            <p className="text-[12px] text-on-surface-variant leading-relaxed">
              Public disclosure classification active. Datasets marked restricted require authenticated state single sign-on.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
