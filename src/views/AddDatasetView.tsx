import React, { useState } from 'react';
import { Dataset, FileType, TopicType, ScreenMode, GeoHubStatus } from '../types.ts';

interface AddDatasetViewProps {
  onAddDataset: (newDataset: Dataset) => void;
  onNavigate: (screen: ScreenMode) => void;
}

export const AddDatasetView: React.FC<AddDatasetViewProps> = ({
  onAddDataset,
  onNavigate
}) => {
  const [datasetName, setDatasetName] = useState('RPA_Parks_Regional_2023');
  const [sharepointUrl, setSharepointUrl] = useState('https://regionalplanning.sharepoint.com/teams/GIS/SpatialLayers/RPA_Parks_Regional_2023.gdb');
  const [description, setDescription] = useState('Vector polygons demarcating designated public regional parks, county reserves, and municipal greenways within the five-county metropolitan planning boundary. Georeferenced in NAD83 State Plane Coordinate System.');
  const [fileType, setFileType] = useState<FileType>('GIS');
  const [topic, setTopic] = useState<TopicType>('Environment');
  const [plan, setPlan] = useState('Natural Resources Plan');
  const [owner, setOwner] = useState('Sarah Lin, GIS Natural Assets Team');
  const [cadence, setCadence] = useState('Annually');
  const [geohubStatus, setGeohubStatus] = useState<GeoHubStatus>('yes');
  
  // GovAI Assist state
  const [showGovAiSuggestion, setShowGovAiSuggestion] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleGovAiSuggest = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowGovAiSuggestion(true);
    }, 700);
  };

  const handlePopulateFields = () => {
    setDatasetName('RPA_Parks_Regional_2023');
    setTopic('Environment');
    setFileType('GIS');
    setPlan('Natural Resources Plan');
    setDescription('Vector polygons demarcating designated public regional parks, county reserves, and municipal greenways within the five-county metropolitan planning boundary. Georeferenced in NAD83 State Plane Coordinate System.');
    setGeohubStatus('yes');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: Dataset = {
      id: `rpa-cat-${Date.now()}`,
      uid: datasetName.toUpperCase(),
      name: datasetName.replace(/_/g, ' '),
      topic: topic,
      fileType: fileType,
      formatLabel: fileType === 'GIS' ? 'GIS Shapefile / GeoPackage' : fileType === 'Excel' ? 'Excel (.xlsx)' : fileType === 'CSV' ? 'CSV (Delimited)' : 'PDF Report',
      plan: plan,
      owner: owner.split(',')[0],
      ownerInitials: owner.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'SL',
      ownerRole: owner.split(',')[1]?.trim() || 'GIS Specialist',
      lastModified: 'Today',
      lastModifiedAgo: 'Just now',
      geohubStatus: geohubStatus,
      geohubPublished: geohubStatus === 'yes',
      geohubText: geohubStatus === 'yes' ? 'Yes' : geohubStatus === 'unsure' ? 'Unsure' : 'No',
      userAccess: 'Editor',
      description: description,
      sharepointPath: sharepointUrl,
      fileSize: '36.5 MB',
      updateCadence: cadence,
      nextScheduled: 'Nov 2026',
      jurisdictionScope: '5 Counties Covered • EPSG:6441',
      totalEntities: '1,124 Features',
      medianMetric: '14.2 acres',
      yoyMetric: '+2.4%',
      completenessMetric: '100%',
      checksum: 'SHA-256 Validated (#9931-88F)',
      complianceStandard: 'ISO 19115 Open GIS Schema',
      authorizedUsers: [
        { name: 'Alex Mercer', initials: 'AM', role: 'Editor', title: 'Principal Data Manager', avatarBg: 'bg-primary text-on-primary' },
        { name: owner.split(',')[0], initials: 'SL', role: 'Editor', title: 'Data Custodian', avatarBg: 'bg-secondary text-on-secondary' }
      ]
    };

    onAddDataset(newEntry);
    setSubmitSuccess(true);
    setTimeout(() => {
      onNavigate('browse-by-topic');
    }, 1800);
  };

  return (
    <div className="flex flex-col w-full max-w-[1520px] mx-auto pb-16">
      {/* Success Notification */}
      {submitSuccess && (
        <div className="fixed top-20 right-8 z-50 bg-secondary text-on-secondary px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-sm font-bold animate-in fade-in">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          <span>Dataset specification successfully submitted & published to production mirror!</span>
        </div>
      )}

      {/* Status & Security Header Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-space-lg gap-space-sm">
        <div className="flex flex-col">
          <div className="flex items-center gap-space-xs text-on-surface-variant text-[11px] font-bold uppercase tracking-wider mb-1">
            <span>Metadata Intake System</span>
            <span>/</span>
            <span className="text-secondary font-bold">Standard Spec ISO-19115</span>
          </div>
          <h1 className="text-[30px] font-bold text-on-surface tracking-tight">Add or Update Dataset</h1>
          <p className="text-[14px] text-on-surface-variant mt-0.5">
            Catalog a new SharePoint resource and verify public GeoHub availability.
          </p>
        </div>

        <div className="flex items-center gap-space-sm bg-surface-container-high px-space-md py-space-xs rounded-lg self-start md:self-auto border border-outline-variant/30">
          <span className="material-symbols-outlined text-secondary text-[20px] fill">shield_with_heart</span>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-on-surface uppercase tracking-wide">Privilege Tier 2 Active</span>
            <span className="text-[12px] text-secondary font-bold">Authorized: Editors & Principal Data Manager</span>
          </div>
        </div>
      </div>

      {/* Team Standard Directives Banner */}
      <div className="bg-surface-container-low p-space-md rounded-lg flex items-start gap-space-md shadow-xs mb-space-lg border border-outline-variant/30">
        <div className="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center shrink-0 text-on-surface">
          <span className="material-symbols-outlined text-[20px]">info</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-space-xs">
            <span className="text-[14px] font-bold text-on-surface">Standard Naming Syntax Enforced</span>
            <span className="bg-surface-container-highest text-on-surface-variant px-2 py-0.5 rounded text-[11px] font-mono font-bold">
              Directive 2024-C
            </span>
          </div>
          <p className="text-[13px] text-on-surface-variant mt-1 leading-snug">
            Follow the official agency taxonomy:{' '}
            <code className="font-mono text-on-surface font-bold bg-surface-container px-1.5 py-0.5 rounded text-[12px]">
              [Agency]_[Topic]_[Geography]_[Year]
            </code>
            <span className="text-on-surface-variant ml-1 font-normal">(e.g., RPA_Demographics_County_2020)</span>
          </p>
        </div>
      </div>

      {/* Primary Split Grid: Form (8 Cols) & Sidebar (4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-start">
        {/* Left Column (8 Cols): Form Core */}
        <div className="lg:col-span-8 flex flex-col gap-space-lg">
          {/* GovAI Suggestion Smart Component */}
          <div className="relative overflow-hidden bg-surface-container-lowest p-space-lg rounded-xl shadow-xs border border-outline-variant/30">
            <div className="absolute top-0 right-0 w-64 h-32 bg-gradient-to-bl from-secondary-container/40 via-surface-container-low/20 to-transparent pointer-events-none"></div>

            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md">
              <div className="flex items-start gap-space-md">
                <div className="w-10 h-10 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <span className="material-symbols-outlined text-[24px]">auto_awesome</span>
                </div>
                <div>
                  <div className="flex items-center gap-space-xs mb-1">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-secondary-container text-on-secondary-container uppercase tracking-wider">
                      GovAI Assist
                    </span>
                    <span className="text-[11px] text-on-surface-variant font-medium">• Verified Model v2.8</span>
                  </div>
                  <h2 className="text-[16px] font-bold text-on-surface">Smart Metadata Extraction</h2>
                  <p className="text-[12px] text-on-surface-variant max-w-xl mt-0.5 leading-snug">
                    GovAI can inspect the SharePoint path, parse spatial coordinates, and automatically suggest a standard title, abstract, and thematic topic.
                  </p>
                </div>
              </div>

              <button 
                type="button"
                onClick={handleGovAiSuggest}
                disabled={isAnalyzing}
                className="shrink-0 inline-flex items-center gap-space-xs px-space-md py-space-sm bg-primary text-on-primary rounded-lg text-[13px] font-bold hover:bg-primary-container transition-all shadow-xs cursor-pointer"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-secondary-fixed border-t-transparent rounded-full animate-spin"></div>
                    <span>Extracting...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-secondary-fixed text-[18px]">bolt</span>
                    <span>Suggest with GovAI</span>
                  </>
                )}
              </button>
            </div>

            {/* GovAI Suggestion Result Card */}
            {showGovAiSuggestion && (
              <div className="mt-space-md pt-space-md bg-surface-container-low p-space-md rounded-lg border border-secondary/30 animate-in fade-in">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-[12px] font-bold text-secondary flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">verified</span>
                    Automated Extraction Confidence: 98.4%
                  </span>
                  <button 
                    type="button"
                    onClick={handlePopulateFields}
                    className="text-[11px] font-bold text-on-surface bg-surface-container-highest px-space-sm py-1 rounded hover:bg-surface-container-high transition-colors cursor-pointer border border-outline-variant/30"
                  >
                    Populate All Fields
                  </button>
                </div>
                <p className="text-[12px] text-on-surface-variant mt-2 font-mono leading-relaxed">
                  Identified: <strong className="text-on-surface font-sans">RPA_Parks_Regional_2023.gdb</strong> → Topic: <span className="text-on-surface font-semibold">Environment</span> | Agency: <span className="text-on-surface font-semibold">RPA Open Spaces Dept</span> | Geometry: <span className="text-secondary font-semibold">NAD83 Polygon</span>
                </p>
              </div>
            )}
          </div>

          {/* Main Form */}
          <form onSubmit={handleSubmit} className="bg-surface-container-lowest p-space-lg rounded-xl shadow-xs border border-outline-variant/30 flex flex-col gap-space-xl">
            {/* Section 1: Resource Identity */}
            <div className="flex flex-col gap-space-md">
              <div className="flex items-center justify-between pb-space-xs bg-surface-container-low px-space-sm py-1.5 rounded border border-outline-variant/20">
                <span className="text-[11px] uppercase tracking-wider text-on-surface font-bold">
                  01. Resource Identity
                </span>
                <span className="text-[11px] text-on-surface-variant">Fields with <span className="text-error font-bold">*</span> are mandatory</span>
              </div>

              {/* Dataset Name */}
              <div className="flex flex-col gap-1">
                <label className="text-[13px] font-bold text-on-surface flex items-center gap-1">
                  Dataset Name <span className="text-error font-bold">*</span>
                </label>
                <input 
                  required
                  value={datasetName}
                  onChange={(e) => setDatasetName(e.target.value)}
                  placeholder="e.g., RPA_Parks_Regional_2023"
                  className="w-full h-10 px-space-md bg-surface-container-lowest rounded-lg text-[14px] text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-surface-container-low transition-all shadow-2xs border border-outline-variant/40"
                  type="text" 
                />
                <span className="text-[11px] text-on-surface-variant">
                  Must follow team convention: [Agency]_[Topic]_[Geography]_[Year]
                </span>
              </div>

              {/* SharePoint URL */}
              <div className="flex flex-col gap-1">
                <label className="text-[13px] font-bold text-on-surface flex items-center gap-1">
                  SharePoint Storage URL <span className="text-error font-bold">*</span>
                </label>
                <div className="flex items-center gap-space-sm">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-2.5 material-symbols-outlined text-on-surface-variant text-[20px]">link</span>
                    <input 
                      required
                      value={sharepointUrl}
                      onChange={(e) => setSharepointUrl(e.target.value)}
                      placeholder="https://regionalplanning.sharepoint.com/teams/GIS/Datasets/..."
                      className="w-full h-10 pl-10 pr-space-md bg-surface-container-lowest rounded-lg text-[14px] text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-surface-container-low transition-all shadow-2xs border border-outline-variant/40"
                      type="url" 
                    />
                  </div>
                  <button 
                    type="button"
                    onClick={() => {
                      alert('SharePoint picker simulated: Selected /GIS/SpatialLayers/RPA_Parks_Regional_2023.gdb');
                    }}
                    className="h-10 px-space-md bg-surface-container text-on-surface text-[12px] font-bold rounded-lg flex items-center gap-1.5 hover:bg-surface-container-high transition-colors shrink-0 cursor-pointer border border-outline-variant/30"
                  >
                    <span className="material-symbols-outlined text-[18px]">cloud_sync</span>
                    <span>Picker</span>
                  </button>
                </div>
                <span className="text-[11px] text-on-surface-variant">
                  Validated internal tenant URLs only. Access controls inherit automatically.
                </span>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1">
                <label className="text-[13px] font-bold text-on-surface flex items-center gap-1">
                  Technical Description / Abstract <span className="text-error font-bold">*</span>
                </label>
                <textarea 
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide a comprehensive operational abstract detailing collection methodology, projections, and known limitations..."
                  className="w-full p-space-md bg-surface-container-lowest rounded-lg text-[14px] text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-surface-container-low transition-all shadow-2xs border border-outline-variant/40 leading-relaxed"
                />
                <div className="flex justify-between items-center text-on-surface-variant text-[11px]">
                  <span>Include spatial bounds & CRS if geometric data</span>
                  <span className="font-mono font-bold">{description.length} characters</span>
                </div>
              </div>
            </div>

            {/* Section 2: Classification & Format */}
            <div className="flex flex-col gap-space-md">
              <div className="flex items-center justify-between pb-space-xs bg-surface-container-low px-space-sm py-1.5 rounded border border-outline-variant/20">
                <span className="text-[11px] uppercase tracking-wider text-on-surface font-bold">
                  02. Classification & Format
                </span>
                <span className="text-[11px] text-secondary font-bold">Standard RPA Taxonomy v2</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                {/* File Type */}
                <div className="flex flex-col gap-1 md:col-span-2">
                  <label className="text-[13px] font-bold text-on-surface flex items-center gap-1">
                    Format / File Type <span className="text-error font-bold">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm pt-1">
                    {(['GIS', 'CSV', 'Excel', 'PDF'] as FileType[]).map((ft) => (
                      <label 
                        key={ft}
                        className={`cursor-pointer flex items-center justify-center gap-space-xs p-space-sm rounded-lg text-[13px] font-bold border transition-colors ${
                          fileType === ft
                            ? 'bg-primary-container text-on-primary border-primary'
                            : 'bg-surface-container text-on-surface hover:bg-surface-container-high border-outline-variant/20'
                        }`}
                      >
                        <input 
                          type="radio" 
                          name="file_type" 
                          value={ft} 
                          checked={fileType === ft}
                          onChange={() => setFileType(ft)}
                          className="hidden" 
                        />
                        <span className="material-symbols-outlined text-[18px]">
                          {ft === 'GIS' ? 'layers' : ft === 'CSV' ? 'table_chart' : ft === 'Excel' ? 'grid_on' : 'picture_as_pdf'}
                        </span>
                        <span>{ft === 'GIS' ? 'GIS / Spatial' : ft === 'CSV' ? 'CSV / Tabular' : ft === 'Excel' ? 'Excel Workbook' : 'PDF Report'}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Topic Select */}
                <div className="flex flex-col gap-1">
                  <label className="text-[13px] font-bold text-on-surface flex items-center gap-1">
                    Core Topic <span className="text-error font-bold">*</span>
                  </label>
                  <div className="relative">
                    <select 
                      value={topic}
                      onChange={(e) => setTopic(e.target.value as TopicType)}
                      className="cursor-pointer w-full h-10 px-space-md bg-surface-container-lowest rounded-lg text-[13px] text-on-surface appearance-none focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-surface-container-low transition-all shadow-2xs border border-outline-variant/40"
                    >
                      <option value="Demographics">Demographics</option>
                      <option value="Economy">Economy</option>
                      <option value="Environment">Environment</option>
                      <option value="Transportation">Transportation</option>
                      <option value="Land Use">Land Use</option>
                      <option value="Housing">Housing</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-2.5 pointer-events-none text-on-surface-variant text-[20px]">
                      expand_more
                    </span>
                  </div>
                </div>

                {/* Plan It Supports */}
                <div className="flex flex-col gap-1">
                  <label className="text-[13px] font-bold text-on-surface">
                    Strategic Plan Supported
                  </label>
                  <div className="relative">
                    <select 
                      value={plan}
                      onChange={(e) => setPlan(e.target.value)}
                      className="cursor-pointer w-full h-10 px-space-md bg-surface-container-lowest rounded-lg text-[13px] text-on-surface appearance-none focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-surface-container-low transition-all shadow-2xs border border-outline-variant/40"
                    >
                      <option value="Natural Resources Plan">Natural Resources Plan (2025-2035)</option>
                      <option value="Economic Development Strategy">Economic Development Strategy</option>
                      <option value="None">None / General Administrative Catalog</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-2.5 pointer-events-none text-on-surface-variant text-[20px]">
                      expand_more
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Stewardship & Cadence */}
            <div className="flex flex-col gap-space-md">
              <div className="flex items-center justify-between pb-space-xs bg-surface-container-low px-space-sm py-1.5 rounded border border-outline-variant/20">
                <span className="text-[11px] uppercase tracking-wider text-on-surface font-bold">
                  03. Stewardship & Cadence
                </span>
                <span className="text-[11px] text-on-surface-variant">Governance Requirements</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                <div className="flex flex-col gap-1">
                  <label className="text-[13px] font-bold text-on-surface flex items-center gap-1">
                    Data Custodian / Owner <span className="text-error font-bold">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 material-symbols-outlined text-on-surface-variant text-[20px]">badge</span>
                    <input 
                      required
                      value={owner}
                      onChange={(e) => setOwner(e.target.value)}
                      placeholder="e.g., J. Doe, Demographics Unit"
                      className="w-full h-10 pl-10 pr-space-md bg-surface-container-lowest rounded-lg text-[13px] text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-surface-container-low transition-all shadow-2xs border border-outline-variant/40"
                      type="text" 
                    />
                  </div>
                  <span className="text-[11px] text-on-surface-variant">
                    Primary point of contact for QA/QC validations
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[13px] font-bold text-on-surface flex items-center gap-1">
                    Update Cadence <span className="text-error font-bold">*</span>
                  </label>
                  <div className="relative">
                    <select 
                      value={cadence}
                      onChange={(e) => setCadence(e.target.value)}
                      className="cursor-pointer w-full h-10 px-space-md bg-surface-container-lowest rounded-lg text-[13px] text-on-surface appearance-none focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-surface-container-low transition-all shadow-2xs border border-outline-variant/40"
                    >
                      <option value="Annually">Annually (Next: Nov 2026)</option>
                      <option value="Quarterly">Quarterly</option>
                      <option value="Monthly">Monthly</option>
                      <option value="As Needed">As Needed / Continuous</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-2.5 pointer-events-none text-on-surface-variant text-[20px]">
                      expand_more
                    </span>
                  </div>
                  <span className="text-[11px] text-on-surface-variant">
                    Automated audit reminders sent 30 days prior
                  </span>
                </div>
              </div>
            </div>

            {/* Section 4: Public Distribution Verification */}
            <div className="flex flex-col gap-space-sm bg-surface-container-low p-space-md rounded-lg border border-outline-variant/20">
              <div className="flex items-center justify-between">
                <label className="text-[13px] text-on-surface flex items-center gap-1.5 font-bold">
                  <span className="material-symbols-outlined text-secondary text-[20px]">public</span>
                  Published to GeoHub Open Data Portal? <span className="text-error font-bold">*</span>
                </label>
                <span className="text-[11px] font-bold bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded">
                  Open Access Policy
                </span>
              </div>

              <p className="text-[12px] text-on-surface-variant leading-relaxed">
                Indicate whether this geospatial layer is simultaneously exposed via the public-facing GeoHub API endpoint.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm pt-2">
                {[
                  { val: 'yes', title: 'Yes, Published', desc: 'Direct API sync live' },
                  { val: 'no', title: 'No (Internal Only)', desc: 'Pre-decisional or restricted' },
                  { val: 'unsure', title: 'Unsure / Pending Review', desc: 'Legal review flag assigned' }
                ].map((opt) => (
                  <label 
                    key={opt.val}
                    className={`cursor-pointer p-space-sm rounded-lg flex items-start gap-space-xs transition-colors border ${
                      geohubStatus === opt.val
                        ? 'bg-secondary-container/30 border-secondary'
                        : 'bg-surface-container-lowest hover:bg-surface-bright border-outline-variant/30'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="geohub_status" 
                      value={opt.val}
                      checked={geohubStatus === opt.val}
                      onChange={() => setGeohubStatus(opt.val as GeoHubStatus)}
                      className="mt-0.5 accent-secondary cursor-pointer" 
                    />
                    <div className="flex flex-col">
                      <span className="text-[13px] font-bold text-on-surface">{opt.title}</span>
                      <span className="text-[11px] text-on-surface-variant">{opt.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Form Actions Footer */}
            <div className="flex flex-wrap items-center justify-between gap-space-md pt-space-md border-t border-outline-variant/30">
              <div className="flex items-center gap-space-xs text-on-surface-variant text-[12px]">
                <span className="material-symbols-outlined text-[18px] text-secondary">history</span>
                <span>Draft autosaved 2 minutes ago</span>
              </div>

              <div className="flex items-center gap-space-sm">
                <button 
                  type="button"
                  onClick={() => onNavigate('home')}
                  className="px-space-md py-space-sm text-on-surface text-[13px] font-semibold hover:bg-surface-container rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  onClick={() => alert('Draft specifications preserved in local storage.')}
                  className="px-space-md py-space-sm bg-surface-container text-on-surface text-[13px] font-semibold rounded-lg hover:bg-surface-container-high transition-colors cursor-pointer border border-outline-variant/20"
                >
                  Save Draft
                </button>
                <button 
                  type="submit"
                  className="px-space-lg py-space-sm bg-primary text-on-primary text-[14px] font-bold rounded-lg hover:bg-primary-container transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Submit for Review</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Right Column (4 Cols): Companion Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-space-lg">
          {/* Naming Standard Checklist Card */}
          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-xs border border-outline-variant/30">
            <div className="flex items-center justify-between pb-space-sm mb-space-sm border-b border-outline-variant/20">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-secondary text-[20px]">fact_check</span>
                <h3 className="text-[16px] font-bold text-on-surface">Standard Checklist</h3>
              </div>
              <span className="text-[11px] font-bold bg-surface-container px-2 py-0.5 rounded text-secondary">
                3/3 Passed
              </span>
            </div>

            <p className="text-[12px] text-on-surface-variant mb-space-md leading-relaxed">
              Dataset assets must pass automated integrity gates before publication into the regional production lake.
            </p>

            <div className="flex flex-col gap-space-sm">
              <div className="flex items-start gap-space-sm p-space-sm rounded-lg bg-surface-container-low border border-outline-variant/20">
                <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">check_circle</span>
                <div className="flex flex-col">
                  <span className="text-[13px] font-bold text-on-surface">ISO Temporal Format</span>
                  <span className="text-[11px] text-on-surface-variant leading-snug">
                    Validated 4-digit calendar anchor "2023" found in layer slug.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-space-sm p-space-sm rounded-lg bg-surface-container-low border border-outline-variant/20">
                <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">check_circle</span>
                <div className="flex flex-col">
                  <span className="text-[13px] font-bold text-on-surface">Approved Topic Taxonomy</span>
                  <span className="text-[11px] text-on-surface-variant leading-snug">
                    "Environment" maps to Regional Master Scheme Category 04.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-space-sm p-space-sm rounded-lg bg-surface-container-low border border-outline-variant/20">
                <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">check_circle</span>
                <div className="flex flex-col">
                  <span className="text-[13px] font-bold text-on-surface">SharePoint Path Validated</span>
                  <span className="text-[11px] text-on-surface-variant leading-snug">
                    Read permissions verified on target File Geodatabase container.
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-space-md pt-space-sm text-center border-t border-outline-variant/20">
              <button 
                type="button"
                onClick={() => onNavigate('help')}
                className="text-[12px] font-bold text-secondary hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Read full Data Custodianship Guidelines v4.2</span>
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </button>
            </div>
          </div>

          {/* Spatial Visual Context Preview Card */}
          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-xs border border-outline-variant/30 overflow-hidden flex flex-col gap-space-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Boundary Verification</span>
              <span className="text-[11px] font-bold text-secondary">Live Extent</span>
            </div>

            <div 
              className="w-full h-44 bg-cover bg-center rounded-lg relative overflow-hidden flex items-end p-space-sm border border-outline-variant/30"
              style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDoMnw5U1CGYhhb2-DeUH-S5o1Svqlkc3Ol9adEwZKb83EsXmxSZUn_-PVZnU8d1DSjXzWkOwUDPfhECs6OBXScnWLGZN-tWgLzRHlrn-bFGf6jgcOGevkDkywEI_E8U80Px5GWmVgJI3RbFMBHV_HyLll5SquwjZrKu8Mtot6rhpz1ro-oYwi-cCWO114T8eF9U0trJsbnVBLu8UD2RaOhKPIYMoFIxgk8Z7o2Z3x1kAimfQjo_853')` }}
            >
              <div className="bg-surface/90 backdrop-blur-sm p-2 rounded w-full flex items-center justify-between border border-outline-variant/30">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-secondary"></span>
                  <span className="text-[11px] font-bold text-on-surface">5 Counties Covered</span>
                </div>
                <span className="text-[11px] font-mono font-bold text-on-surface-variant">EPSG: 6441</span>
              </div>
            </div>

            <p className="text-[12px] text-on-surface-variant leading-relaxed">
              Geometry bounding box parsed dynamically from the referenced geodatabase link.
            </p>
          </div>

          {/* Audit Metadata Log */}
          <div className="bg-surface-container-low p-space-md rounded-xl flex flex-col gap-space-xs border border-outline-variant/20">
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="text-[11px] uppercase font-bold">Catalog ID</span>
              <span className="font-mono text-[12px] font-bold text-on-surface">RPA-CAT-88910</span>
            </div>
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="text-[11px] uppercase font-bold">Creation Mode</span>
              <span className="text-[12px] font-medium text-on-surface">Interactive Registration</span>
            </div>
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="text-[11px] uppercase font-bold">Reviewer Pool</span>
              <span className="text-[12px] font-medium text-on-surface">GIS Technical Leads</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
