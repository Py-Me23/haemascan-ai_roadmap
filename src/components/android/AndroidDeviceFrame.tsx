import React, { useState, useEffect } from 'react';
import { Home, Users, BarChart3, Settings as SettingsIcon, Battery, Wifi, WifiOff, Signal, Sparkles, LayoutGrid, Eye, ArrowLeft, RotateCcw } from 'lucide-react';
import { ScreenId, LanguageCode } from '../../types';
import { TRANSLATIONS } from '../../data/translations';

interface AndroidDeviceFrameProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  lang: LanguageCode;
  isOnline: boolean;
  isWireframe: boolean;
  pendingSyncCount?: number;
  onToggleWireframe: () => void;
  onToggleOnline: () => void;
  children: React.ReactNode;
}

export const AndroidDeviceFrame: React.FC<AndroidDeviceFrameProps> = ({
  currentScreen,
  onNavigate,
  lang,
  isOnline,
  isWireframe,
  pendingSyncCount = 0,
  onToggleWireframe,
  onToggleOnline,
  children,
}) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const [timeStr, setTimeStr] = useState('09:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      setTimeStr(`${hours}:${mins}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  // Determine if bottom navigation should be visible on this screen
  const showBottomNav =
    currentScreen === 'home' ||
    currentScreen === 'patient_list' ||
    currentScreen === 'reports' ||
    currentScreen === 'settings';

  return (
    <div className="relative flex flex-col items-center select-none">
      {/* Outer Phone Shell */}
      <div
        className={`relative w-[360px] sm:w-[380px] h-[780px] sm:h-[800px] rounded-[48px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] transition-all duration-300 ${
          isWireframe
            ? 'bg-slate-950 border-4 border-slate-700 shadow-slate-900/50'
            : 'bg-gradient-to-b from-slate-800 via-slate-900 to-black border-4 border-slate-700/80'
        }`}
      >
        {/* Physical hardware buttons simulation */}
        {/* Volume Up/Down on Left */}
        <div className="absolute -left-4 top-28 w-1 h-14 bg-slate-700 rounded-l-md" />
        <div className="absolute -left-4 top-46 w-1 h-14 bg-slate-700 rounded-l-md" />
        {/* Power Button on Right */}
        <div className="absolute -right-4 top-36 w-1 h-16 bg-slate-700 rounded-r-md" />

        {/* Inner Screen Bezel */}
        <div className="relative w-full h-full rounded-[38px] overflow-hidden bg-white flex flex-col shadow-inner">
          {/* Android Status Bar */}
          <div
            className={`h-7 px-6 flex items-center justify-between text-[11px] font-semibold tracking-tight z-50 select-none ${
              isWireframe
                ? 'bg-slate-950 text-slate-400 border-b border-slate-800'
                : currentScreen === 'capture_eye' || currentScreen === 'scan_test_strip' || currentScreen === 'splash'
                ? 'bg-slate-950 text-white'
                : 'bg-white text-slate-800'
            }`}
          >
            {/* Clock */}
            <span className="font-mono text-[11px]">{timeStr}</span>

            {/* Front Camera Punch-Hole */}
            <div className="w-4 h-4 rounded-full bg-black border border-slate-800 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
            </div>

            {/* Status Icons */}
            <div className="flex items-center gap-1.5 text-xs">
              <button
                onClick={() => onNavigate('offline_queue')}
                className="flex items-center gap-0.5 hover:opacity-80 transition-opacity"
                title="Open Offline Queue Manager"
              >
                {isOnline ? (
                  <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <WifiOff className="w-3.5 h-3.5 text-amber-500" />
                )}
                {pendingSyncCount > 0 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                )}
              </button>
              <Signal className="w-3.5 h-3.5" />
              <div className="flex items-center gap-0.5">
                <span className="text-[10px] font-mono">92%</span>
                <Battery className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Active Screen View */}
          <div className="flex-1 overflow-hidden relative flex flex-col bg-slate-50">
            {children}
          </div>

          {/* Android Material 3 Bottom Navigation Bar */}
          {showBottomNav && (
            <div
              className={`h-16 px-4 border-t flex items-center justify-around z-40 transition-colors ${
                isWireframe
                  ? 'bg-slate-950 border-slate-800 text-slate-400 font-mono text-[10px]'
                  : 'bg-white border-slate-100 text-slate-600'
              }`}
            >
              {/* Home Tab */}
              <button
                id="nav-tab-home"
                onClick={() => onNavigate('home')}
                className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition-all ${
                  currentScreen === 'home'
                    ? isWireframe
                      ? 'text-rose-400 font-bold'
                      : 'text-[#8B1E3F] font-bold'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <div
                  className={`p-1 rounded-full ${
                    currentScreen === 'home' && !isWireframe ? 'bg-rose-50 text-[#8B1E3F]' : ''
                  }`}
                >
                  <Home className="w-4 h-4" />
                </div>
                <span className="text-[10px] mt-0.5">{t.home}</span>
              </button>

              {/* Patients Tab */}
              <button
                id="nav-tab-patients"
                onClick={() => onNavigate('patient_list')}
                className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition-all ${
                  currentScreen === 'patient_list' || currentScreen === 'patient_summary'
                    ? isWireframe
                      ? 'text-rose-400 font-bold'
                      : 'text-[#8B1E3F] font-bold'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <div
                  className={`p-1 rounded-full ${
                    (currentScreen === 'patient_list' || currentScreen === 'patient_summary') && !isWireframe
                      ? 'bg-rose-50 text-[#8B1E3F]'
                      : ''
                  }`}
                >
                  <Users className="w-4 h-4" />
                </div>
                <span className="text-[10px] mt-0.5">{t.patients}</span>
              </button>

              {/* Reports Tab */}
              <button
                id="nav-tab-reports"
                onClick={() => onNavigate('reports')}
                className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition-all ${
                  currentScreen === 'reports'
                    ? isWireframe
                      ? 'text-rose-400 font-bold'
                      : 'text-[#8B1E3F] font-bold'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <div
                  className={`p-1 rounded-full ${
                    currentScreen === 'reports' && !isWireframe ? 'bg-rose-50 text-[#8B1E3F]' : ''
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                </div>
                <span className="text-[10px] mt-0.5">{t.reports}</span>
              </button>

              {/* Settings Tab */}
              <button
                id="nav-tab-settings"
                onClick={() => onNavigate('settings')}
                className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition-all ${
                  currentScreen === 'settings'
                    ? isWireframe
                      ? 'text-rose-400 font-bold'
                      : 'text-[#8B1E3F] font-bold'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <div
                  className={`p-1 rounded-full ${
                    currentScreen === 'settings' && !isWireframe ? 'bg-rose-50 text-[#8B1E3F]' : ''
                  }`}
                >
                  <SettingsIcon className="w-4 h-4" />
                </div>
                <span className="text-[10px] mt-0.5">{t.settings}</span>
              </button>
            </div>
          )}

          {/* Android Home Gesture Pill */}
          <div
            className={`h-4 w-full flex items-center justify-center select-none ${
              isWireframe
                ? 'bg-slate-950'
                : currentScreen === 'capture_eye' || currentScreen === 'scan_test_strip' || currentScreen === 'splash'
                ? 'bg-slate-950'
                : 'bg-white'
            }`}
          >
            <div
              className={`w-28 h-1 rounded-full ${
                isWireframe ? 'bg-slate-700' : 'bg-slate-300'
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
