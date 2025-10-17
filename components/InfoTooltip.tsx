import React from 'react';

interface InfoTooltipProps {
    text: string;
    methodology?: string;
    dataSource?: string;
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({ text, methodology, dataSource }) => {
  if (!text && !methodology && !dataSource) return null;
  
  const content = [
    text,
    methodology ? `Methodology: ${methodology}` : '',
    dataSource ? `Source: ${dataSource}` : ''
  ].filter(Boolean).join('\n\n');


  return (
    <div className="group relative inline-flex items-center ml-2">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <div className="absolute bottom-full mb-2 w-72 bg-slate-800 text-slate-200 text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20 shadow-xl border border-purple-500/20 left-1/2 -translate-x-1/2">
        <p className="whitespace-pre-wrap">{content}</p>
        <svg className="absolute h-2 w-full left-0 top-full text-slate-800" x="0px" y="0px" viewBox="0 0 255 255" xmlSpace="preserve">
          <polygon className="fill-current" points="0,0 127.5,127.5 255,0"/>
        </svg>
      </div>
    </div>
  );
};

export default InfoTooltip;
