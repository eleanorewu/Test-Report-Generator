
import React, { useState } from 'react';
import { ReportData, DeviceEnvironment } from '../types';
import { Smartphone, Monitor, Calendar, Image as ImageIcon, Type, Layout, Plus, RefreshCw, X } from 'lucide-react';

interface ReportFormProps {
  data: ReportData;
  onChange: (data: ReportData) => void;
}

export const ReportForm: React.FC<ReportFormProps> = ({ data, onChange }) => {
  const [isOtherEnvSelected, setIsOtherEnvSelected] = useState(
    ![DeviceEnvironment.IOS, DeviceEnvironment.ANDROID, DeviceEnvironment.WEB].includes(data.environment as DeviceEnvironment)
  );
  
  const [isAddingOtherTag, setIsAddingOtherTag] = useState(false);
  const [otherTagValue, setOtherTagValue] = useState('');

  const defaultTags = ['Development', 'Interaction', 'Content'];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'screenshot' | 'expectedImage') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      if (field === 'screenshot') {
        onChange({ 
          ...data, 
          screenshot: result, 
          screenshotName: file.name, 
          actualMarkerBoxes: [] 
        });
      } else {
        onChange({ 
          ...data, 
          expectedImage: result, 
          expectedImageName: file.name, 
          expectedMarkerBoxes: [] 
        });
      }
    };
    reader.readAsDataURL(file);
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
      onChange({ ...data, environment: '', actualMarkerBoxes: [], expectedMarkerBoxes: [] });
    } else {
      setIsOtherEnvSelected(false);
      onChange({ ...data, environment: env, actualMarkerBoxes: [], expectedMarkerBoxes: [] });
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
          <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
            <ImageIcon className="w-4 h-4" /> 上傳測試截圖
          </label>
          <p className="text-[10px] text-slate-400 font-medium">上傳後請在左側「即時預覽」的大圖上拖曳標記</p>
        </div>
        
        <div className="flex flex-col gap-2">
          {data.screenshot && (
            <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700">
              <span className="truncate" title={data.screenshotName || '已上傳檔案'}>
                {data.screenshotName || '已上傳檔案'}
              </span>
              <button
                type="button"
                onClick={() => onChange({ ...data, screenshot: null, screenshotName: null, actualMarkerBoxes: [] })}
                className="text-red-500 hover:text-red-700 p-1"
                title="刪除檔案"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <label className="inline-flex items-center justify-center gap-2 px-3 h-[52px] rounded-lg border border-dashed border-slate-300 text-slate-600 text-xs font-semibold cursor-pointer hover:bg-slate-50 transition-colors bg-white">
            <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'screenshot')} className="hidden" />
            <ImageIcon className="w-4 h-4 opacity-70" />
            {data.screenshot ? '重新上傳' : '點擊上傳'}
          </label>
        </div>
      </div>

      {/* Expected Result */}
      <div className="pt-4 border-t border-slate-100 space-y-4">
        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
          <Layout className="w-4 h-4" /> 
        </label>
        <div className="flex flex-col gap-2">
          {data.expectedImage && (
            <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700">
              <span className="truncate" title={data.expectedImageName || '已上傳檔案'}>
                {data.expectedImageName || '已上傳檔案'}
              </span>
              <button
                type="button"
                onClick={() => onChange({ ...data, expectedImage: null, expectedImageName: null, expectedMarkerBoxes: [] })}
                className="text-red-500 hover:text-red-700 p-1"
                title="刪除檔案"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <label className="inline-flex items-center justify-center gap-2 px-3 h-[52px] rounded-lg border border-dashed border-slate-300 text-slate-600 text-xs font-semibold cursor-pointer hover:bg-slate-50 transition-colors bg-white">
            <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'expectedImage')} className="hidden" />
            <ImageIcon className="w-4 h-4 opacity-70" />
            {data.expectedImage ? '重新上傳' : '點擊上傳'}
          </label>
        </div>
      </div>
    </div>
  );
};
