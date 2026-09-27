import React, { useState } from 'react';
import { ChevronLeft, UserPlus, Sparkles } from 'lucide-react';
import { LanguageCode } from '../../types';
import { TRANSLATIONS } from '../../data/translations';

interface RegisterPatientScreenProps {
  lang: LanguageCode;
  onBack: () => void;
  onNext: (patientData: {
    name: string;
    age: number;
    gender: 'Female' | 'Male';
    isPregnant: boolean;
    village: string;
  }) => void;
  isWireframe?: boolean;
}

export const RegisterPatientScreen: React.FC<RegisterPatientScreenProps> = ({
  lang,
  onBack,
  onNext,
  isWireframe,
}) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const [patientId] = useState('HS-000127');
  const [name, setName] = useState('Ama Mensah');
  const [age, setAge] = useState<number>(28);
  const [gender, setGender] = useState<'Female' | 'Male'>('Female');
  const [isPregnant, setIsPregnant] = useState<boolean>(true);
  const [village, setVillage] = useState('Abokobi Community');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onNext({
      name,
      age: Number(age) || 25,
      gender,
      isPregnant: gender === 'Female' ? isPregnant : false,
      village: village || 'Local Community',
    });
  };

  const handleFillDemo = (type: 'pregnant' | 'child' | 'adult_male') => {
    if (type === 'pregnant') {
      setName('Ama Mensah');
      setAge(28);
      setGender('Female');
      setIsPregnant(true);
      setVillage('Abokobi Community');
    } else if (type === 'child') {
      setName('Kwame Addo');
      setAge(5);
      setGender('Male');
      setIsPregnant(false);
      setVillage('Oyarifa Ward 2');
    } else {
      setName('Yaw Asare');
      setAge(40);
      setGender('Male');
      setIsPregnant(false);
      setVillage('Danfa South');
    }
  };

  if (isWireframe) {
    return (
      <div className="flex flex-col h-full bg-slate-900 text-slate-200 p-4 font-mono text-xs select-none">
        {/* Wireframe Header */}
        <div className="flex justify-between items-center border-b border-slate-700 pb-2 mb-4">
          <button onClick={onBack} className="text-slate-400">
            [ &lt; CANCEL ]
          </button>
          <span className="font-bold text-slate-100">[NEW_PATIENT_FORM]</span>
          <span className="text-[10px] text-slate-500">STEP 1/7</span>
        </div>

        {/* Wireframe Form Elements */}
        <div className="space-y-3 flex-1 overflow-y-auto pr-1">
          {/* Patient ID (Auto) */}
          <div className="p-2 border border-dashed border-slate-600 rounded bg-slate-950/40">
            <div className="text-[10px] text-slate-400">FIELD: PATIENT_ID (AUTO)</div>
            <div className="font-bold text-slate-200">{patientId}</div>
          </div>

          {/* Full Name */}
          <div className="p-2 border border-slate-700 rounded">
            <div className="text-[10px] text-slate-400">FIELD: FULL_NAME (TEXT)</div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-transparent border-b border-slate-600 text-slate-200 mt-1 font-mono outline-none"
            />
          </div>

          {/* Age & Gender Grid */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 border border-slate-700 rounded">
              <div className="text-[10px] text-slate-400">FIELD: AGE (NUM)</div>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full bg-transparent border-b border-slate-600 text-slate-200 mt-1 font-mono outline-none"
              />
            </div>

            <div className="p-2 border border-slate-700 rounded">
              <div className="text-[10px] text-slate-400">FIELD: SEX (ENUM)</div>
              <div className="flex gap-1 mt-1">
                <button
                  type="button"
                  onClick={() => setGender('Female')}
                  className={`flex-1 py-1 text-[10px] rounded border ${
                    gender === 'Female' ? 'border-rose-400 bg-rose-950/60' : 'border-slate-700'
                  }`}
                >
                  FEMALE
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setGender('Male');
                    setIsPregnant(false);
                  }}
                  className={`flex-1 py-1 text-[10px] rounded border ${
                    gender === 'Male' ? 'border-rose-400 bg-rose-950/60' : 'border-slate-700'
                  }`}
                >
                  MALE
                </button>
              </div>
            </div>
          </div>

          {/* Pregnancy Status */}
          {gender === 'Female' && (
            <div className="p-2 border border-slate-700 rounded bg-slate-950/20">
              <div className="text-[10px] text-slate-400">FIELD: PREGNANCY_STATUS (BOOL)</div>
              <div className="flex gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setIsPregnant(true)}
                  className={`flex-1 py-1 text-[10px] rounded border ${
                    isPregnant ? 'border-rose-400 bg-rose-950/60 font-bold' : 'border-slate-700'
                  }`}
                >
                  YES (PREGNANT)
                </button>
                <button
                  type="button"
                  onClick={() => setIsPregnant(false)}
                  className={`flex-1 py-1 text-[10px] rounded border ${
                    !isPregnant ? 'border-rose-400 bg-rose-950/60 font-bold' : 'border-slate-700'
                  }`}
                >
                  NO
                </button>
              </div>
            </div>
          )}

          {/* Community */}
          <div className="p-2 border border-slate-700 rounded">
            <div className="text-[10px] text-slate-400">FIELD: VILLAGE / COMMUNITY</div>
            <input
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              className="w-full bg-transparent border-b border-slate-600 text-slate-200 mt-1 font-mono outline-none"
            />
          </div>
        </div>

        {/* Wireframe Action */}
        <div className="mt-auto pt-3 border-t border-slate-800">
          <button
            onClick={handleSubmit}
            className="w-full h-12 border-2 border-rose-500 bg-rose-950/50 text-rose-200 font-bold rounded-xl flex items-center justify-center"
          >
            [ NEXT ➔ CAPTURE_EYE ]
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white text-slate-900 select-none">
      {/* Top Header matching the screenshot */}
      <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
        <button
          id="btn-register-cancel"
          onClick={onBack}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 py-1 px-2 rounded-lg"
        >
          {t.cancel}
        </button>

        <div className="text-center">
          <h2 className="text-sm font-bold text-slate-900">{t.newPatient}</h2>
          <div className="text-[10px] text-slate-400 font-medium">Step 1 of 7</div>
        </div>

        <div className="w-12 text-right">
          <span className="text-[10px] font-mono font-bold text-[#8B1E3F] bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
            AUTO
          </span>
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="flex-1 px-5 py-4 flex flex-col justify-between overflow-y-auto">
        <div className="space-y-4">
          {/* Quick Demo Pre-fill Pill Bar */}
          <div className="flex items-center justify-between bg-slate-50 p-2 rounded-xl border border-slate-200/80">
            <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#8B1E3F]" />
              Quick fill:
            </span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => handleFillDemo('pregnant')}
                className="text-[10px] font-semibold bg-white border border-slate-200 px-2 py-0.5 rounded-md hover:bg-slate-100 text-slate-700 active:scale-95"
              >
                Ama (Pregnant)
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo('adult_male')}
                className="text-[10px] font-semibold bg-white border border-slate-200 px-2 py-0.5 rounded-md hover:bg-slate-100 text-slate-700 active:scale-95"
              >
                Yaw (Male)
              </button>
            </div>
          </div>

          {/* Patient ID (Auto) */}
          <div className="flex justify-between items-center py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-xs font-medium text-slate-600">{t.patientId}</span>
            <span className="text-xs font-mono font-bold text-slate-800">{patientId}</span>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {t.fullName} <span className="text-rose-500">*</span>
            </label>
            <input
              id="input-patient-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ama Mensah"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#8B1E3F]/30 focus:border-[#8B1E3F] transition-all bg-white"
            />
          </div>

          {/* Age and Sex in 2 columns */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {t.age} <span className="text-rose-500">*</span>
              </label>
              <input
                id="input-patient-age"
                type="number"
                min="0"
                max="120"
                required
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#8B1E3F]/30 focus:border-[#8B1E3F] transition-all bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {t.sex} <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setGender('Female')}
                  className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                    gender === 'Female'
                      ? 'bg-[#8B1E3F] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.female}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setGender('Male');
                    setIsPregnant(false);
                  }}
                  className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                    gender === 'Male'
                      ? 'bg-[#8B1E3F] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.male}
                </button>
              </div>
            </div>
          </div>

          {/* Pregnancy Status (Shown if female) */}
          {gender === 'Female' && (
            <div className="p-3 bg-rose-50/70 border border-rose-100 rounded-xl space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-800">
                  {t.pregnancy} Status
                </label>
                <span className="text-[10px] font-medium text-[#8B1E3F] bg-white px-2 py-0.5 rounded-md border border-rose-200">
                  Risk Stratification
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setIsPregnant(true)}
                  className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all ${
                    isPregnant
                      ? 'bg-[#8B1E3F] text-white border-[#8B1E3F] shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  ✓ {t.yes} (Pregnant)
                </button>
                <button
                  type="button"
                  onClick={() => setIsPregnant(false)}
                  className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all ${
                    !isPregnant
                      ? 'bg-[#8B1E3F] text-white border-[#8B1E3F] shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  ✕ {t.no}
                </button>
              </div>
            </div>
          )}

          {/* Village / Community */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {t.village}
            </label>
            <input
              id="input-patient-village"
              type="text"
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              placeholder="e.g. Abokobi Community"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#8B1E3F]/30 focus:border-[#8B1E3F] transition-all bg-white"
            />
          </div>
        </div>

        {/* Submit / Next Button */}
        <div className="pt-4 mt-auto">
          <button
            id="btn-register-next"
            type="submit"
            className="w-full py-3.5 rounded-xl bg-[#8B1E3F] text-white font-bold text-sm shadow-md shadow-[#8B1E3F]/20 hover:bg-[#731833] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
          >
            <span>{t.next}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
