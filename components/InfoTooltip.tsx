import React, { useState } from 'react';

interface InfoTooltipProps {
  text: string;
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({ text }) => {
  const [show, setShow] = useState(false);

  return (
    <div 
        className="relative ml-2 flex items-center"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
    >
      <svg className="w-4 h-4 text-slate-400 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      {show && (
        <div className="absolute bottom-full mb-2 w-64 bg-slate-700 text-white text-sm rounded-lg p-3 shadow-lg z-10 left-1/2 -translate-x-1/2">
          {text}
        </div>
      )}
    </div>
  );
};

export default InfoTooltip;
