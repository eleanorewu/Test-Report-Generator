
import React, { useState, useRef } from 'react';
import { ReportForm } from './components/ReportForm';
import { ReportPreview } from './components/ReportPreview';
import { ReportData, DeviceEnvironment } from './types';
import { Download, CheckCircle2, PanelLeft, PanelRight } from 'lucide-react';

declare global {
  interface Window {
    html2canvas: any;
  }
}

const App: React.FC = () => {
  const [reportData, setReportData] = useState<ReportData>({
    environment: DeviceEnvironment.IOS,
    testDate: new Date().toISOString().split('T')[0],
    screenshot: null,
    problemDescription: '',
    expectedResultType: 'image', // 預設改為圖片
    expectedText: '',
    expectedImage: null,
    markerBox: null,
    tags: [],
  });

  const [formPosition, setFormPosition] = useState<'left' | 'right'>('right');
  const [isExporting, setIsExporting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const handleExport = async () => {
    if (!reportRef.current) return;
    
    setIsExporting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const canvas = await window.html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });
      
      const image = canvas.toDataURL('image/png', 1.0);
      
      // 獲取目前輸出日（YYYYMMDD）
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const dateStr = `${year}${month}${day}`;

      const link = document.createElement('a');
      link.download = `${dateStr}_test_report.png`;
      link.href = image;
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
      alert('匯出失敗，請重試');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 md:px-8 bg-slate-50">
      <header className="max-w-[1920px] mx-auto mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-100">
              <CheckCircle2 className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">QA 測試回報產生器</h1>
          </div>
          <p className="text-slate-500">快速建立並匯出專業的視覺化測試報告</p>
        </div>
      </header>

      <main className={`max-w-[1920px] mx-auto flex flex-col lg:flex-row gap-8 ${formPosition === 'left' ? 'lg:flex-row-reverse' : ''}`}>
        {/* Preview Column */}
        <section className="flex-1 overflow-x-auto">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">即時預覽</h2>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className={`py-2 px-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-all text-sm ${
                isExporting 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98] shadow-md shadow-indigo-100'
              }`}
            >
              {isExporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin" />
                  正在產生...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  下載圖片
                </>
              )}
            </button>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 min-w-[1000px]">
            <div ref={reportRef} className="bg-white p-12">
              <ReportPreview data={reportData} />
            </div>
          </div>
        </section>

        {/* Input Form Column (Adjusted to 400px) */}
        <section className="w-full lg:w-[400px] shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 h-fit sticky top-8">
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">
                  填寫測試資訊
                </h2>
              </div>
              
              <div className="flex items-center bg-slate-50 p-1 rounded-xl border border-slate-200 shadow-sm w-fit">
                <button 
                  onClick={() => setFormPosition('left')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${formPosition === 'left' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`}
                >
                  <PanelLeft className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => setFormPosition('right')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${formPosition === 'right' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`}
                >
                  <PanelRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            
            <ReportForm data={reportData} onChange={setReportData} />
          </div>
        </section>
      </main>

      <footer className="max-w-[1920px] mx-auto mt-12 pt-8 border-t border-slate-200 text-center text-slate-400 text-sm">
        &copy; 2026 Eleanore Wu
      </footer>
    </div>
  );
};

export default App;
