
import React, { useRef, useState } from 'react';
import { ReportData, DeviceEnvironment } from '../types';
import { Smartphone, Monitor, Calendar, Image as ImageIcon, Type, Layout, MousePointer2, Eraser, Plus, RefreshCw, X, Tag } from 'lucide-react';

interface ReportFormProps {
  data: ReportData;
  onChange: (data: ReportData) => void;
}

export const ReportForm: React.FC<ReportFormProps> = ({ data, onChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [isOtherEnvSelected, setIsOtherEnvSelected] = useState(
    ![DeviceEnvironment.IOS, DeviceEnvironment.ANDROID, DeviceEnvironment.WEB].includes(data.environment as DeviceEnvironment)
  );
  
  const [isAddingOtherTag, setIsAddingOtherTag] = useState(false);
  const [otherTagValue, setOtherTagValue] = useState('');

  const isWeb = data.environment === DeviceEnvironment.WEB;
  const isMobile = data.environment === DeviceEnvironment.IOS || data.environment === DeviceEnvironment.ANDROID;
  
  const containerBaseClass = "relative border-2 border-dashed border-slate-200 rounded-xl overflow-hidden transition-all bg-slate-50 group flex items-center justify-center";
  const containerSizeClass = isWeb 
    ? "w-full min-h-[150px]" 
    : `w-full max-w-[160px] ${isMobile ? 'aspect-[9/19.5]' : 'aspect-[16/10]'}`;

  const defaultTags = ['Development', 'Interaction', 'Content'];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'screenshot' | 'expectedImage') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (field === 'screenshot') {
          onChange({ ...data, [field]: result, markerBox: null });
        } else {
          onChange({ ...data, [field]: result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current || !data.screenshot) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setStartPos({ x, y });
    setIsDrawing(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const currentX = ((e.clientX - rect.left) / rect.width) * 100;
    const currentY = ((e.clientY - rect.top) / rect.height) * 100;

    const x = Math.min(startPos.x, currentX);
    const y = Math.min(startPos.y, currentY);
    const width = Math.abs(currentX - startPos.x);
    const height = Math.abs(currentY - startPos.y);

    onChange({
      ...data,
      markerBox: { x, y, width, height }
    });
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const toggleTag = (tag: string) => {
    const newTags = data.tags.includes(tag)
      ? data.tags.filter(t => t !== tag)
      : [...data.tags, tag];
    onChange({ ...data, tags: newTags });
  };

  const addCustomTag = () => {
    if (otherTagValue.trim() && !data.tags.includes(otherTagValue.trim())) {
      onChange({ ...data, tags: [...data.tags, otherTagValue.trim()] });
      setOtherTagValue('');
      setIsAddingOtherTag(false);
    }
  };

  const selectEnvironment = (env: DeviceEnvironment) => {
    if (env === DeviceEnvironment.OTHER) {
      setIsOtherEnvSelected(true);
      onChange({ ...data, environment: '', markerBox: null });
    } else {
      setIsOtherEnvSelected(false);
      onChange({ ...data, environment: env, markerBox: null });
    }
  };

  const environments = [
    { value: DeviceEnvironment.IOS, label: 'iOS', icon: <Smartphone className="w-4 h-4" /> },
    { value: DeviceEnvironment.ANDROID, label: 'Android', icon: <Smartphone className="w-4 h-4" /> },
    { value: DeviceEnvironment.WEB, label: 'Web', icon: <Monitor className="w-4 h-4" /> },
    { value: DeviceEnvironment.OTHER, label: '其他', icon: <Plus className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Environment Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
          <Layout className="w-4 h-4" /> 裝置環境
        </label>
        <div className="grid grid-cols-2 gap-2">
          {environments.map((env) => (
            <button
              key={env.value}
              onClick={() => selectEnvironment(env.value)}
              className={`flex items-center justify-center gap-2 px-2 py-2 rounded-lg border text-xs font-bold transition-all ${
                (isOtherEnvSelected ? DeviceEnvironment.OTHER : data.environment) === env.value
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
              }`}
            >
              {env.icon}
              {env.label}
            </button>
          ))}
        </div>
        
        {isOtherEnvSelected && (
          <div className="mt-2 animate-in fade-in slide-in-from-top-1 duration-200">
            <input
              type="text"
              placeholder="請輸入環境名稱"
              value={data.environment}
              onChange={(e) => onChange({ ...data, environment: e.target.value })}
              className="w-full px-4 py-2 text-sm rounded-lg border border-indigo-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-white text-slate-900 shadow-sm"
            />
          </div>
        )}
      </div>

      {/* Test Date */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
          <Calendar className="w-4 h-4" /> 測試日期
        </label>
        <input
          type="date"
          value={data.testDate}
          onChange={(e) => onChange({ ...data, testDate: e.target.value })}
          className="w-full px-4 py-2 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-900 bg-white"
        />
      </div>

      {/* Problem Description with Tags */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
          <Type className="w-4 h-4" /> 問題描述
        </label>

        {/* Tags Multi-select UI */}
        <div className="flex flex-wrap gap-2 mb-2">
          {defaultTags.map(tag => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all border ${
                data.tags.includes(tag)
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-300'
              }`}
            >
              {tag}
            </button>
          ))}
          
          {/* Custom Tags */}
          {data.tags.filter(t => !defaultTags.includes(t)).map(tag => (
             <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className="px-3 py-1 rounded-full text-[10px] font-bold bg-indigo-600 text-white border border-indigo-600 shadow-sm flex items-center gap-1.5"
            >
              {tag}
              <X className="w-3 h-3 opacity-80 hover:opacity-100" />
            </button>
          ))}

          {isAddingOtherTag ? (
            <div className="flex items-center gap-1 animate-in zoom-in-95 duration-200">
              <input
                type="text"
                autoFocus
                value={otherTagValue}
                onChange={(e) => setOtherTagValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addCustomTag()}
                onBlur={() => !otherTagValue && setIsAddingOtherTag(false)}
                placeholder="輸入標籤..."
                className="px-3 py-1 rounded-full text-[10px] font-bold border border-indigo-300 outline-none w-24 bg-indigo-50 text-indigo-900"
              />
              <button onClick={addCustomTag} className="p-1 bg-indigo-600 text-white rounded-full">
                <Plus className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAddingOtherTag(true)}
              className="px-3 py-1 rounded-full text-[10px] font-bold text-indigo-600 border border-indigo-200 border-dashed hover:bg-indigo-50 transition-colors flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> 其他
            </button>
          )}
        </div>

        <textarea
          value={data.problemDescription}
          onChange={(e) => onChange({ ...data, problemDescription: e.target.value })}
          placeholder="描述遇到的問題..."
          className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all min-h-[80px] resize-none text-xs text-slate-900 bg-white"
        />
      </div>

      {/* Screenshot Upload */}
      <div className="space-y-2">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <ImageIcon className="w-4 h-4" /> 上傳測試截圖
            </label>
            {data.screenshot && (
              <button 
                onClick={(e) => { e.stopPropagation(); onChange({ ...data, markerBox: null }); }}
                className="text-[10px] font-bold text-red-500 flex items-center gap-1 hover:text-red-700 transition-colors uppercase"
              >
                <Eraser className="w-3 h-3" /> 清除標記
              </button>
            )}
          </div>
          <p className="text-[10px] text-slate-400 font-medium">在測試截圖上拖曳可標示紅框</p>
        </div>
        
        <div className="flex flex-col items-center gap-3">
          <div 
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className={`${containerBaseClass} ${containerSizeClass} ${data.screenshot ? 'cursor-crosshair' : 'cursor-pointer'}`}
          >
            {!data.screenshot && (
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'screenshot')}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
            )}

            {data.screenshot ? (
              <div className="relative w-full h-full select-none flex items-center justify-center">
                <img src={data.screenshot} alt="Preview" className="w-full h-auto block object-contain pointer-events-none" />
                {data.markerBox && (
                  <div 
                    className="absolute border-2 border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)] pointer-events-none"
                    style={{
                      left: `${data.markerBox.x}%`,
                      top: `${data.markerBox.y}%`,
                      width: `${data.markerBox.width}%`,
                      height: `${data.markerBox.height}%`
                    }}
                  />
                )}
                {!data.markerBox && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10 pointer-events-none">
                    <div className="bg-white/90 px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-sm text-slate-900">
                      <MousePointer2 className="w-3 h-3" /> 拖曳標記
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-400 p-4">
                <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                <span className="text-[10px] font-bold">點擊上傳</span>
              </div>
            )}
          </div>

          {data.screenshot && (
            <label className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 hover:border-indigo-300 cursor-pointer transition-all group active:scale-95">
              <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'screenshot')} className="hidden" />
              <RefreshCw className="w-3.5 h-3.5 text-indigo-500 group-hover:rotate-180 transition-transform duration-500" />
              <span className="text-[11px] font-bold text-slate-600">更換圖片</span>
            </label>
          )}
        </div>
      </div>

      {/* Expected Result */}
      <div className="pt-4 border-t border-slate-100 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
            <Layout className="w-4 h-4" /> 預期畫面
          </label>
          {/* Updated Toggle Style to match Page Layout Toggle */}
          <div className="flex items-center bg-slate-50 p-1 rounded-xl border border-slate-200 shadow-sm">
            <button
              onClick={() => onChange({ ...data, expectedResultType: 'text' })}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                data.expectedResultType === 'text' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              <Type className="w-3.5 h-3.5" /> 文字
            </button>
            <button
              onClick={() => onChange({ ...data, expectedResultType: 'image' })}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                data.expectedResultType === 'image' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" /> 圖片
            </button>
          </div>
        </div>

        {data.expectedResultType === 'text' ? (
          <textarea
            value={data.expectedText}
            onChange={(e) => onChange({ ...data, expectedText: e.target.value })}
            placeholder="描述預期效果..."
            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all min-h-[80px] resize-none text-xs text-slate-900 bg-white"
          />
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className={`${containerBaseClass} ${containerSizeClass} cursor-pointer`}>
              {!data.expectedImage && <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'expectedImage')} className="absolute inset-0 opacity-0 cursor-pointer z-10" />}
              {data.expectedImage ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <img src={data.expectedImage} alt="Expected" className="w-full h-auto block object-contain rounded" />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400 p-4">
                  <ImageIcon className="w-6 h-6 mb-1 opacity-50" />
                  <span className="text-[10px] font-bold">預期畫面</span>
                </div>
              )}
            </div>
            
            {data.expectedImage && (
              <label className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 hover:border-indigo-300 cursor-pointer transition-all group active:scale-95">
                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'expectedImage')} className="hidden" />
                <RefreshCw className="w-3.5 h-3.5 text-indigo-500 group-hover:rotate-180 transition-transform duration-500" />
                <span className="text-[11px] font-bold text-slate-600">更換圖片</span>
              </label>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
