
import React from 'react';
import { ReportData, DeviceEnvironment } from '../types';

interface ReportPreviewProps {
  data: ReportData;
}

export const ReportPreview: React.FC<ReportPreviewProps> = ({ data }) => {
  const isMobile = data.environment === DeviceEnvironment.IOS || data.environment === DeviceEnvironment.ANDROID;
  const colMaxWidth = isMobile ? 'max-w-[450px]' : 'max-w-full';

  // 格式化標籤：首字母大寫，其餘小寫
  const formatTag = (tag: string) => {
    if (!tag) return '';
    return tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase();
  };

  return (
    <div className="w-full bg-white flex flex-col select-none" style={{ fontFamily: '"Noto Sans TC", sans-serif' }}>
      {/* Header Titles - Two Column Layout */}
      <div className="grid grid-cols-2 w-full mb-10 px-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-slate-800 tracking-tight">測試畫面</h2>
        </div>
        <div className="text-center">
          <h2 className="text-4xl font-bold text-slate-800 tracking-tight">預期畫面</h2>
        </div>
      </div>

      {/* Main Content Area - Comparison Layout */}
      <div className="grid grid-cols-2 w-full items-start gap-12 mb-16 px-8">
        {/* Left Column: Actual Screenshot */}
        <div className="flex flex-col items-center w-full">
          {data.screenshot ? (
            <div className={`relative border-[12px] border-slate-100 rounded-[3rem] shadow-2xl overflow-hidden bg-slate-50 w-full ${colMaxWidth}`}>
               <div className="relative">
                 <img src={data.screenshot} alt="Actual" className="w-full h-auto block bg-black/5" />
                 {data.markerBox && (
                    <div className="absolute pointer-events-none"
                      style={{
                        left: `${data.markerBox.x}%`,
                        top: `${data.markerBox.y}%`,
                        width: `${data.markerBox.width}%`,
                        height: `${data.markerBox.height}%`
                      }}
                    >
                      <div className="w-full h-full border-[6px] border-red-500 rounded-2xl shadow-[0_0_20px_rgba(239,68,68,0.6)]"></div>
                    </div>
                 )}
               </div>
            </div>
          ) : (
            <div className={`w-full aspect-[9/16] flex flex-col items-center justify-center text-slate-300 bg-slate-50 border-[12px] border-slate-100 rounded-[3rem] ${colMaxWidth}`}>
               <span className="font-bold text-3xl">尚未上傳截圖</span>
            </div>
          )}
        </div>

        {/* Right Column: Expected Screen */}
        <div className="flex flex-col items-center w-full">
          {data.expectedResultType === 'image' ? (
            data.expectedImage ? (
              <div className={`relative border-[12px] border-slate-100 rounded-[3rem] shadow-2xl overflow-hidden bg-slate-50 w-full ${colMaxWidth}`}>
                <img src={data.expectedImage} alt="Expected" className="w-full h-auto block bg-black/5" />
              </div>
            ) : (
              <div className={`w-full aspect-[9/16] flex flex-col items-center justify-center text-slate-300 bg-slate-50 border-[12px] border-slate-100 rounded-[3rem] ${colMaxWidth}`}>
                <span className="font-bold text-3xl">尚未上傳截圖</span>
              </div>
            )
          ) : (
            <div className={`w-full flex flex-col items-center justify-center border-4 border-dashed border-slate-100 rounded-[3rem] text-slate-400 bg-slate-50/50 aspect-[9/16] ${colMaxWidth}`}>
               <p className="text-2xl text-slate-600 leading-relaxed whitespace-pre-wrap font-medium text-center px-10">
                 {data.expectedText || "尚未輸入預期效果內容"}
               </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer Info Section (Left Aligned with Dynamic Content) */}
      <div className="w-full pt-12 border-t-[4px] border-slate-100 flex flex-col gap-6 px-12 pb-12">
        <div className="flex items-center gap-6 text-4xl font-bold">
          <span className="text-slate-400 w-[220px] shrink-0">測試設備 :</span>
          <span className="text-slate-800">{data.environment || "未填寫"}</span>
        </div>
        <div className="flex items-center gap-6 text-4xl font-bold">
          <span className="text-slate-400 w-[220px] shrink-0">測試日期 :</span>
          <span className="text-slate-800">{data.testDate ? data.testDate.replace(/-/g, '/') : "未選擇"}</span>
        </div>
        <div className="flex items-start gap-6 text-4xl font-bold">
          <span className="text-slate-400 w-[220px] shrink-0 pt-1">問題描述 :</span>
          <div className="flex flex-col gap-4">
            {/* Tags integrated into Problem Description field - Updated to Purple Theme */}
            {data.tags.length > 0 && (
              <div className="flex flex-wrap gap-4">
                {data.tags.map(tag => (
                  <div key={tag} className="bg-indigo-50 text-indigo-700 px-6 py-1.5 rounded-full font-bold text-xl border border-indigo-200 shadow-sm tracking-wide">
                    {formatTag(tag)}
                  </div>
                ))}
              </div>
            )}
            <span className="text-slate-800 leading-tight">
              {data.problemDescription || "尚未輸入問題描述內容"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
