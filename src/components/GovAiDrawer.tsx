import React, { useState, useRef, useEffect } from 'react';
import { Dataset, ChatMessage, ScreenMode } from '../types.ts';
import { INITIAL_CHAT_MESSAGES } from '../mockData.ts';

interface GovAiDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  datasets: Dataset[];
  onSelectDataset: (dataset: Dataset) => void;
  onNavigate: (screen: ScreenMode) => void;
  initialPrompt?: string;
}

export const GovAiDrawer: React.FC<GovAiDrawerProps> = ({
  isOpen,
  onClose,
  datasets,
  onSelectDataset,
  onNavigate,
  initialPrompt
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages]);

  useEffect(() => {
    if (initialPrompt && isOpen) {
      handleSend(initialPrompt);
    }
  }, [initialPrompt]);

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsGenerating(true);

    // Simulate intelligent civic response
    setTimeout(() => {
      const lower = query.toLowerCase();
      let responseText = '';
      let embeddedDataset: Dataset | undefined;
      let accessNotice: string | undefined;

      if (lower.includes('population') || lower.includes('census') || lower.includes('demographic')) {
        const found = datasets.find(d => d.id === 'rpa-pop-2020') || datasets[0];
        responseText = `The primary authoritative demographic record is '${found.name}' (Excel .xlsx), curated by ${found.owner}, validated under ISO-19115. It covers 9 counties and 48 municipal districts.`;
        embeddedDataset = found;
      } else if (lower.includes('gis') || lower.includes('shapefile') || lower.includes('geohub') || lower.includes('spatial') || lower.includes('map')) {
        const gisDatasets = datasets.filter(d => d.fileType === 'GIS');
        responseText = `Found ${gisDatasets.length} spatial GIS layers in the registry: ${gisDatasets.map(d => `'${d.name}'`).join(', ')}. Of these, ${gisDatasets.filter(d => d.geohubPublished).length} are currently synced to the public GeoHub portal.`;
        embeddedDataset = gisDatasets[0];
      } else if (lower.includes('natural resource') || lower.includes('parks') || lower.includes('flood') || lower.includes('watershed')) {
        const nrDatasets = datasets.filter(d => d.plan === 'Natural Resources Plan');
        responseText = `The Natural Resources Plan is supported by ${nrDatasets.length} registered datasets: ${nrDatasets.map(d => `'${d.name}'`).join(', ')}. All layers adhere to State Directive v4.2 standards.`;
        embeddedDataset = nrDatasets[0];
      } else if (lower.includes('edit') || lower.includes('permission') || lower.includes('access')) {
        responseText = `Your current security role allows read and fetch permissions across all public and internal layers. To modify schemas, upload GeoJSON revisions, or commit edits, Editor clearance must be approved by Principal Data Manager Alex Mercer.`;
        accessNotice = 'RBAC Active Policy';
      } else if (lower.includes('employment') || lower.includes('economy') || lower.includes('wage')) {
        const found = datasets.find(d => d.id === 'rpa-econ-emp-2026');
        responseText = `'Employment by Industry' contains quarterly NAICS 2-digit industry wage and employment quarterly rolls compiled with state labor agency data.`;
        embeddedDataset = found;
      } else {
        responseText = `GovAI analyzed your catalog query across the tri-county spatial repository. Found matching metadata attributes and ISO 19115 schema entries for "${query}".`;
        embeddedDataset = datasets[0];
      }

      const aiMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'govai',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        embeddedDataset,
        accessNotice,
        sourceTag: 'Data Catalog'
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsGenerating(false);
    }, 600);
  };

  return (
    <>
      {/* Backdrop Scrim */}
      <div 
        onClick={onClose}
        className="fixed inset-0 top-16 left-72 bg-primary/20 backdrop-blur-[2px] z-40 transition-opacity" 
      />

      {/* Sliding Drawer Panel */}
      <aside 
        className={`fixed top-16 right-0 bottom-0 w-[460px] bg-surface-container-lowest shadow-[0_10px_25px_-5px_rgba(11,28,48,0.2),0_8px_10px_-6px_rgba(11,28,48,0.1)] z-50 flex flex-col justify-between overflow-hidden transition-all duration-300 border-l border-outline-variant/30 ${
          isMinimized ? 'h-16 bottom-auto' : ''
        }`}
      >
        {/* Panel Header */}
        <div className="h-16 px-space-lg bg-surface-container-lowest flex items-center justify-between shrink-0 shadow-xs border-b border-outline-variant/30">
          <div className="flex items-center gap-space-sm min-w-0">
            <div className="flex items-center gap-1.5 bg-secondary-container px-2.5 py-1 rounded">
              <span className="material-symbols-outlined text-on-secondary-container text-[16px]">auto_awesome</span>
              <span className="text-[11px] font-bold text-on-secondary-container uppercase tracking-wider">GovAI</span>
            </div>
            <span className="text-[18px] font-bold text-on-surface tracking-tight">Data Assistant</span>
          </div>

          <div className="flex items-center gap-1">
            <button 
              onClick={() => setIsMinimized(!isMinimized)}
              aria-label="Minimize" 
              className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors cursor-pointer" 
              title={isMinimized ? "Expand drawer" : "Minimize drawer"}
            >
              <span className="material-symbols-outlined text-[20px]">{isMinimized ? 'expand_less' : 'minimize'}</span>
            </button>
            <button 
              onClick={onClose}
              aria-label="Close" 
              className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors cursor-pointer" 
              title="Close assistant"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Chat Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto px-space-lg py-space-md flex flex-col gap-space-lg bg-surface-container-low/40">
              {/* Security Pill */}
              <div className="flex items-center justify-center">
                <span className="text-[11px] font-bold px-space-sm py-0.5 rounded-full bg-surface-container-high text-on-surface-variant uppercase tracking-wider border border-outline-variant/20">
                  Catalog Session • Security Tier II
                </span>
              </div>

              {/* Message List */}
              {messages.map((msg) => (
                <div key={msg.id} className="flex flex-col">
                  {msg.sender === 'user' ? (
                    <div className="flex flex-col items-end gap-1 pl-12">
                      <div className="flex items-center gap-space-xs mb-0.5">
                        <span className="text-[11px] text-on-surface-variant">You</span>
                        <span className="font-tabular-data text-[10px] text-on-surface-variant/80">{msg.timestamp}</span>
                      </div>
                      <div className="bg-primary text-on-primary px-space-md py-space-sm rounded-xl rounded-tr-none shadow-sm max-w-full">
                        <p className="text-[14px] text-on-primary leading-snug">{msg.text}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-start gap-space-xs pr-4">
                      <div className="flex items-center gap-space-xs mb-0.5">
                        <div className="w-4 h-4 rounded bg-secondary-container flex items-center justify-center">
                          <span className="material-symbols-outlined text-on-secondary-container text-[12px]">auto_awesome</span>
                        </div>
                        <span className="text-[11px] font-bold text-secondary">GovAI Assistant</span>
                        <span className="font-tabular-data text-[10px] text-on-surface-variant/80">{msg.timestamp}</span>
                      </div>

                      <div className="bg-surface-container-lowest p-space-md rounded-xl rounded-tl-none shadow-sm flex flex-col gap-space-sm w-full border border-outline-variant/30">
                        <p className="text-[14px] text-on-surface leading-normal">
                          {msg.text}
                        </p>

                        {/* Embedded Dataset Card */}
                        {msg.embeddedDataset && (
                          <div className="bg-surface-container-low rounded-lg p-space-sm shadow-2xs flex flex-col gap-space-xs border border-outline-variant/30">
                            <div className="flex items-start justify-between gap-space-xs">
                              <div className="flex items-start gap-space-xs">
                                <span className="material-symbols-outlined text-secondary text-[20px] mt-0.5">
                                  {msg.embeddedDataset.fileType === 'Excel' ? 'table_view' : msg.embeddedDataset.fileType === 'GIS' ? 'layers' : 'description'}
                                </span>
                                <div className="flex flex-col">
                                  <span className="text-[14px] font-semibold text-on-surface leading-tight">
                                    {msg.embeddedDataset.name}
                                  </span>
                                  <span className="text-[12px] text-on-surface-variant">
                                    {msg.embeddedDataset.topic} • {msg.embeddedDataset.uid}
                                  </span>
                                </div>
                              </div>
                              <span className="text-[11px] font-bold bg-secondary-container text-on-secondary-container px-1.5 py-0.5 rounded">
                                {msg.embeddedDataset.fileType.toUpperCase()}
                              </span>
                            </div>

                            {/* Metadata list */}
                            <div className="grid grid-cols-2 gap-space-xs py-space-xs bg-surface-container-lowest/80 px-space-xs rounded border border-outline-variant/20">
                              <div className="flex flex-col">
                                <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">Custodian</span>
                                <span className="font-tabular-data text-[12px] text-on-surface font-medium truncate">
                                  {msg.embeddedDataset.owner}
                                </span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">Audit Date</span>
                                <span className="font-tabular-data text-[12px] text-on-surface font-medium">
                                  {msg.embeddedDataset.lastModified}
                                </span>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-space-xs pt-1">
                              <button 
                                onClick={() => {
                                  alert(`Downloading authoritative file package for ${msg.embeddedDataset?.name} (${msg.embeddedDataset?.fileSize || '24 MB'})`);
                                }}
                                className="flex-1 bg-primary text-on-primary hover:bg-primary-container px-space-sm py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-xs font-semibold"
                              >
                                <span className="material-symbols-outlined text-[16px]">download</span>
                                <span>Download</span>
                              </button>
                              <button 
                                onClick={() => {
                                  if (msg.embeddedDataset) {
                                    onSelectDataset(msg.embeddedDataset);
                                    onNavigate('dataset-details');
                                    onClose();
                                  }
                                }}
                                className="flex-1 bg-surface-container-high text-on-surface hover:bg-surface-variant px-space-sm py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-xs font-semibold"
                              >
                                <span className="material-symbols-outlined text-[16px]">visibility</span>
                                <span>View details</span>
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Access Notice */}
                        {msg.accessNotice && (
                          <div className="bg-surface-container-low px-space-sm py-1.5 rounded-lg flex items-center justify-between border border-outline-variant/30">
                            <div className="flex items-center gap-space-xs">
                              <span className="material-symbols-outlined text-on-surface-variant text-[16px]">shield_person</span>
                              <span className="text-[12px] text-on-surface-variant font-medium">Your Active Role</span>
                            </div>
                            <span className="text-[11px] font-bold bg-surface-container-highest text-on-surface px-2 py-0.5 rounded">
                              {msg.accessNotice}
                            </span>
                          </div>
                        )}

                        {/* Bottom Source Tag */}
                        <div className="flex items-center gap-1 pt-0.5 text-on-surface-variant">
                          <span className="material-symbols-outlined text-[14px] text-secondary">verified</span>
                          <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">
                            Source: {msg.sourceTag || 'Data Catalog'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isGenerating && (
                <div className="flex items-center gap-2 p-3 bg-surface-container-lowest rounded-xl shadow-xs border border-outline-variant/30 text-xs text-on-surface-variant">
                  <div className="w-4 h-4 border-2 border-secondary border-t-transparent rounded-full animate-spin"></div>
                  <span>GovAI indexing spatial catalog and access rules...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Bottom Controls & Input Tray */}
            <div className="p-space-md bg-surface-container-lowest shrink-0 shadow-[0_-4px_12px_rgba(0,0,0,0.03)] border-t border-outline-variant/30 flex flex-col gap-space-sm">
              {/* Suggested Follow-up Prompts */}
              <div className="flex items-center gap-space-xs overflow-x-auto pb-1 scrollbar-none">
                <span className="text-[10px] uppercase text-on-surface-variant shrink-0 font-bold tracking-wider">
                  Suggested:
                </span>
                <button 
                  onClick={() => handleSend('Show all GIS files')}
                  className="shrink-0 bg-surface-container-high hover:bg-surface-variant text-on-surface text-[12px] font-medium px-space-sm py-1 rounded-full transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px] text-secondary">tune</span>
                  <span>Show all GIS files</span>
                </button>
                <button 
                  onClick={() => handleSend('List datasets in Natural Resources Plan')}
                  className="shrink-0 bg-surface-container-high hover:bg-surface-variant text-on-surface text-[12px] font-medium px-space-sm py-1 rounded-full transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px] text-secondary">folder_special</span>
                  <span>List datasets in Natural Resources Plan</span>
                </button>
              </div>

              {/* Message Input Box */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }} 
                className="relative flex items-center"
              >
                <input 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask GovAI where to find data, e.g., latest county population..." 
                  type="text"
                  className="w-full h-11 pl-space-md pr-12 bg-surface-container-low text-on-surface placeholder:text-on-surface-variant/60 text-[14px] rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-surface-container-lowest transition-all border border-outline-variant/30"
                />
                <button 
                  type="submit"
                  aria-label="Send query" 
                  className="absolute right-1.5 w-8 h-8 rounded-lg bg-primary hover:bg-primary-container text-on-primary flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                >
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </form>

              {/* Governance Disclaimer */}
              <div className="flex items-center gap-1.5 text-center justify-center px-space-xs pt-0.5 text-on-surface-variant">
                <span className="material-symbols-outlined text-[13px] shrink-0">policy</span>
                <p className="text-[11px] leading-tight">
                  GovAI answers are based on the data catalog and respect your access level
                </p>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
};
