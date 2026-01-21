
import React, { useMemo, useRef, useState } from 'react';
import { ReportData, DeviceEnvironment, MarkerBox } from '../types';
import { Eraser } from 'lucide-react';

interface ReportPreviewProps {
  data: ReportData;
  onChange: (data: ReportData) => void;
  showClearButtons?: boolean;
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

export const ReportPreview: React.FC<ReportPreviewProps> = ({ data, onChange, showClearButtons = true }) => {
  const isMobile = data.environment === DeviceEnvironment.IOS || data.environment === DeviceEnvironment.ANDROID || data.environment === DeviceEnvironment.TABLET;
  const colMaxWidth = isMobile ? 'max-w-[450px]' : 'max-w-full';

  const actualContainerRef = useRef<HTMLDivElement>(null);
  const expectedContainerRef = useRef<HTMLDivElement>(null);

  const [isDrawingActual, setIsDrawingActual] = useState(false);
  const [actualStartPos, setActualStartPos] = useState<{ x: number; y: number } | null>(null);
  const [actualDraftBox, setActualDraftBox] = useState<MarkerBox | null>(null);

  const [isDrawingExpected, setIsDrawingExpected] = useState(false);
  const [expectedStartPos, setExpectedStartPos] = useState<{ x: number; y: number } | null>(null);
  const [expectedDraftBox, setExpectedDraftBox] = useState<MarkerBox | null>(null);

  // 格式化標籤：首字母大寫，其餘小寫
  const formatTag = (tag: string) => {
    if (!tag) return '';
    return tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase();
  };

  const actualMarkerBoxes = useMemo(() => data.actualMarkerBoxes ?? [], [data.actualMarkerBoxes]);
  const expectedMarkerBoxes = useMemo(() => data.expectedMarkerBoxes ?? [], [data.expectedMarkerBoxes]);

  const getPercentPos = (el: HTMLDivElement | null, clientX: number, clientY: number) => {
    if (!el) return null;
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    return { x: clamp(x, 0, 100), y: clamp(y, 0, 100) };
  };

  const handleActualPointerDown = (e: React.PointerEvent) => {
    if (!data.screenshot) return;
    const p = getPercentPos(actualContainerRef.current, e.clientX, e.clientY);
    if (!p) return;
    (e.currentTarget as HTMLDivElement).setPointerCapture?.(e.pointerId);
    setIsDrawingActual(true);
    setActualStartPos(p);
    setActualDraftBox({ x: p.x, y: p.y, width: 0, height: 0 });
  };

  const handleActualPointerMove = (e: React.PointerEvent) => {
    if (!isDrawingActual || !actualStartPos) return;
    const p = getPercentPos(actualContainerRef.current, e.clientX, e.clientY);
    if (!p) return;

    const x = Math.min(actualStartPos.x, p.x);
    const y = Math.min(actualStartPos.y, p.y);
    const width = Math.abs(p.x - actualStartPos.x);
    const height = Math.abs(p.y - actualStartPos.y);
    setActualDraftBox({ x, y, width, height });
  };

  const finishActualDrawing = () => {
    setIsDrawingActual(false);
    setActualStartPos(null);

    if (!actualDraftBox) return;
    const MIN_SIZE = 0.6; // percent
    const isValid = actualDraftBox.width >= MIN_SIZE && actualDraftBox.height >= MIN_SIZE;
    setActualDraftBox(null);
    if (!isValid) return;

    onChange({
      ...data,
      actualMarkerBoxes: [...actualMarkerBoxes, actualDraftBox],
    });
  };

  const handleExpectedPointerDown = (e: React.PointerEvent) => {
    if (!data.expectedImage) return;
    const p = getPercentPos(expectedContainerRef.current, e.clientX, e.clientY);
    if (!p) return;
    (e.currentTarget as HTMLDivElement).setPointerCapture?.(e.pointerId);
    setIsDrawingExpected(true);
    setExpectedStartPos(p);
    setExpectedDraftBox({ x: p.x, y: p.y, width: 0, height: 0 });
  };

  const handleExpectedPointerMove = (e: React.PointerEvent) => {
    if (!isDrawingExpected || !expectedStartPos) return;
    const p = getPercentPos(expectedContainerRef.current, e.clientX, e.clientY);
    if (!p) return;

    const x = Math.min(expectedStartPos.x, p.x);
    const y = Math.min(expectedStartPos.y, p.y);
    const width = Math.abs(p.x - expectedStartPos.x);
    const height = Math.abs(p.y - expectedStartPos.y);
    setExpectedDraftBox({ x, y, width, height });
  };

  const finishExpectedDrawing = () => {
    setIsDrawingExpected(false);
    setExpectedStartPos(null);

    if (!expectedDraftBox) return;
    const MIN_SIZE = 0.6; // percent
    const isValid = expectedDraftBox.width >= MIN_SIZE && expectedDraftBox.height >= MIN_SIZE;
    setExpectedDraftBox(null);
    if (!isValid) return;

    onChange({
      ...data,
      expectedMarkerBoxes: [...expectedMarkerBoxes, expectedDraftBox],
    });
  };

  return (
    <div className="w-full bg-white flex flex-col select-none" style={{ fontFamily: '"Noto Sans TC", sans-serif' }}>
      {/* Header Titles - Two Column Layout */}
      <div className="grid grid-cols-2 w-full mb-6 px-8 gap-6">
        <div className="relative flex items-center justify-center text-center min-h-[56px]">
          <h2 className="text-2xl font-semibold text-slate-800 tracking-tight text-center w-full">測試畫面</h2>
          {showClearButtons && data.screenshot && actualMarkerBoxes.length > 0 && (
            <button
              onClick={() => onChange({ ...data, actualMarkerBoxes: [] })}
              className="absolute right-0 top-1/2 -translate-y-1/2 py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all text-sm bg-white text-red-600 border border-slate-200 hover:border-red-300 hover:bg-red-50 active:scale-[0.98]"
              title="清除測試畫面標記"
            >
              <Eraser className="w-4 h-4" />
              清除測試標記
            </button>
          )}
        </div>
        <div className="relative flex items-center justify-center text-center min-h-[56px]">
          <h2 className="text-2xl font-semibold text-slate-800 tracking-tight text-center w-full">預期畫面</h2>
          {showClearButtons && data.expectedImage && expectedMarkerBoxes.length > 0 && (
            <button
              onClick={() => onChange({ ...data, expectedMarkerBoxes: [] })}
              className="absolute right-0 top-1/2 -translate-y-1/2 py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all text-sm bg-white text-red-600 border border-slate-200 hover:border-red-300 hover:bg-red-50 active:scale-[0.98]"
              title="清除預期畫面標記"
            >
              <Eraser className="w-4 h-4" />
              清除預期標記
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area - Comparison Layout */}
      <div className="grid grid-cols-2 w-full items-start gap-12 mb-16 px-8">
        {/* Left Column: Actual Screenshot */}
        <div className="flex flex-col items-center w-full">
          {data.screenshot ? (
            <div className={`relative w-full ${colMaxWidth}`}>
              <div
                ref={actualContainerRef}
                className={`relative touch-none ${data.screenshot ? 'cursor-crosshair' : ''}`}
                onPointerDown={handleActualPointerDown}
                onPointerMove={handleActualPointerMove}
                onPointerUp={finishActualDrawing}
                onPointerCancel={finishActualDrawing}
                onPointerLeave={() => { if (isDrawingActual) finishActualDrawing(); }}
                aria-label="在截圖上拖曳以新增標記"
              >
                <img src={data.screenshot} alt="Actual" className="w-full h-auto block pointer-events-none" />

                {actualMarkerBoxes.map((box, idx) => (
                  <div
                    key={`${idx}-${box.x}-${box.y}-${box.width}-${box.height}`}
                    className="absolute pointer-events-none"
                    style={{
                      left: `${box.x}%`,
                      top: `${box.y}%`,
                      width: `${box.width}%`,
                      height: `${box.height}%`,
                    }}
                  >
                    <div className="w-full h-full border-[6px] border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.6)]"></div>
                  </div>
                ))}

                {actualDraftBox && (
                  <div
                    className="absolute pointer-events-none"
                    style={{
                      left: `${actualDraftBox.x}%`,
                      top: `${actualDraftBox.y}%`,
                      width: `${actualDraftBox.width}%`,
                      height: `${actualDraftBox.height}%`,
                    }}
                  >
                    <div className="w-full h-full border-[6px] border-red-500/80 shadow-[0_0_20px_rgba(239,68,68,0.35)]"></div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className={`w-full aspect-[9/16] flex flex-col items-center justify-center text-slate-300 bg-slate-50 ${colMaxWidth}`}>
               <span className="font-semibold text-2xl">尚未上傳截圖</span>
            </div>
          )}
        </div>

        {/* Right Column: Expected Screen */}
        <div className="flex flex-col items-center w-full">
          {data.expectedImage ? (
            <div className={`relative w-full ${colMaxWidth}`}>
              <div
                ref={expectedContainerRef}
                className="relative touch-none cursor-crosshair"
                onPointerDown={handleExpectedPointerDown}
                onPointerMove={handleExpectedPointerMove}
                onPointerUp={finishExpectedDrawing}
                onPointerCancel={finishExpectedDrawing}
                onPointerLeave={() => { if (isDrawingExpected) finishExpectedDrawing(); }}
                aria-label="在預期畫面上拖曳以新增標記"
              >
                <img src={data.expectedImage} alt="Expected" className="w-full h-auto block pointer-events-none" />

                {expectedMarkerBoxes.map((box, idx) => (
                  <div
                    key={`${idx}-${box.x}-${box.y}-${box.width}-${box.height}`}
                    className="absolute pointer-events-none"
                    style={{
                      left: `${box.x}%`,
                      top: `${box.y}%`,
                      width: `${box.width}%`,
                      height: `${box.height}%`,
                    }}
                  >
                    <div className="w-full h-full border-[6px] border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.6)]"></div>
                  </div>
                ))}

                {expectedDraftBox && (
                  <div
                    className="absolute pointer-events-none"
                    style={{
                      left: `${expectedDraftBox.x}%`,
                      top: `${expectedDraftBox.y}%`,
                      width: `${expectedDraftBox.width}%`,
                      height: `${expectedDraftBox.height}%`,
                    }}
                  >
                    <div className="w-full h-full border-[6px] border-red-500/80 shadow-[0_0_20px_rgba(239,68,68,0.35)]"></div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className={`w-full aspect-[9/16] flex flex-col items-center justify-center text-slate-300 bg-slate-50 ${colMaxWidth}`}>
              <span className="font-semibold text-2xl">尚未上傳截圖</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Info Section (Left Aligned with Dynamic Content) */}
      <div className="w-full pt-12 border-t-[4px] border-slate-100 flex flex-col gap-6 px-12 pb-12">
        <div className="flex items-center gap-3" style={{ fontSize: '24px' }}>
          <span className="text-slate-400 w-[180px] shrink-0 font-medium">測試設備 :</span>
          <span className="text-slate-800 font-medium">{data.environment || "未填寫"}</span>
        </div>
        <div className="flex items-center gap-3" style={{ fontSize: '24px' }}>
          <span className="text-slate-400 w-[180px] shrink-0 font-medium">測試日期 :</span>
          <span className="text-slate-800 font-medium">{data.testDate ? data.testDate.replace(/-/g, '/') : "未選擇"}</span>
        </div>
        <div className="flex items-start gap-3" style={{ fontSize: '24px' }}>
          <span className="text-slate-400 w-[180px] shrink-0 pt-1 font-medium">問題描述 :</span>
          <div className="flex flex-col gap-2">
            {data.tags.length > 0 && (
              <span className="text-slate-800 leading-tight font-medium">
                {data.tags.map((tag, index) => (
                  <React.Fragment key={tag}>
                    {index > 0 && '、'}
                    <span className="text-indigo-600">{formatTag(tag)}</span>
                  </React.Fragment>
                ))}
              </span>
            )}
            {data.problemDescription && (
              <span className="text-slate-800 leading-tight font-medium">
                {data.problemDescription}
              </span>
            )}
            {!data.problemDescription && data.tags.length === 0 && (
              <span className="text-slate-800 leading-tight font-medium">
                尚未輸入問題描述內容
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
