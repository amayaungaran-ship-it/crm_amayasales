import React, { useState, useEffect } from 'react';
import { X, AlertCircle, CheckCircle, UserPlus, Save } from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { Lead, LeadSource, LeadStatus } from '../../types';

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadToEdit?: Lead | null;
}

export const LeadFormModal: React.FC<LeadFormModalProps> = ({
  isOpen,
  onClose,
  leadToEdit,
}) => {
  const { addLead, updateLead, houseTypes, leads } = useCrm();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Semarang');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [source, setSource] = useState<LeadSource>('Meta Ads');
  const [houseTypeInterest, setHouseTypeInterest] = useState('Linea');
  const [budget, setBudget] = useState(950000000);
  const [paymentMethodPreference, setPaymentMethodPreference] = useState<'Cash Keras' | 'Cash Bertahap' | 'KPR'>('KPR');
  const [picName, setPicName] = useState('Senja');
  const [status, setStatus] = useState<LeadStatus>('Lead');
  const [notes, setNotes] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [phoneWarning, setPhoneWarning] = useState('');

  useEffect(() => {
    if (leadToEdit) {
      setName(leadToEdit.name);
      setPhone(leadToEdit.phone);
      setEmail(leadToEdit.email || '');
      setCity(leadToEdit.city);
      setAddress(leadToEdit.address || '');
      setDate(leadToEdit.date);
      setSource(leadToEdit.source);
      setHouseTypeInterest(leadToEdit.houseTypeInterest);
      setBudget(leadToEdit.budget);
      setPaymentMethodPreference(leadToEdit.paymentMethodPreference);
      setPicName(leadToEdit.picName);
      setStatus(leadToEdit.status);
      setNotes(leadToEdit.notes || '');
    } else {
      // Default reset
      setName('');
      setPhone('');
      setEmail('');
      setCity('Semarang');
      setAddress('');
      setDate(new Date().toISOString().slice(0, 10));
      setSource('Meta Ads');
      setHouseTypeInterest('Linea');
      setBudget(950000000);
      setPaymentMethodPreference('KPR');
      setPicName('Senja');
      setStatus('Lead');
      setNotes('');
    }
    setErrorMessage('');
    setPhoneWarning('');
  }, [leadToEdit, isOpen]);

  // Real-time phone duplication check
  const handlePhoneChange = (val: string) => {
    setPhone(val);
    const cleaned = val.replace(/[^0-9]/g, '');
    if (cleaned.length >= 8 && !leadToEdit) {
      const match = leads.find((l) => l.phone.replace(/[^0-9]/g, '') === cleaned);
      if (match) {
        setPhoneWarning(`Perhatian: Nomor ini sudah terdaftar atas nama ${match.name} (${match.code})`);
      } else {
        setPhoneWarning('');
      }
    } else {
      setPhoneWarning('');
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Nama lengkap konsumen wajib diisi!');
      return;
    }
    if (!phone.trim()) {
      setErrorMessage('Nomor WhatsApp wajib diisi!');
      return;
    }

    const picId = picName.includes('Senja') ? 'usr-3' : picName.includes('Eka') ? 'usr-4' : 'usr-5';

    if (leadToEdit) {
      updateLead(leadToEdit.id, {
        name,
        phone,
        email,
        city,
        address,
        date,
        source,
        houseTypeInterest,
        budget: Number(budget),
        paymentMethodPreference,
        picId,
        picName,
        status,
        notes,
      });
      onClose();
    } else {
      const result = addLead({
        name,
        phone,
        email,
        city,
        address,
        date,
        source,
        houseTypeInterest,
        budget: Number(budget),
        paymentMethodPreference,
        picId,
        picName,
        status,
        notes,
      });

      if (!result.success) {
        setErrorMessage(result.message);
      } else {
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-[#127144] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus size={20} />
            <h3 className="font-bold text-base">
              {leadToEdit ? `Edit Leads: ${leadToEdit.code}` : 'Form Tambah Leads Baru'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
          >
            <X size={18} />
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="m-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nama Lengkap */}
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Nama Lengkap Calon Konsumen *
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Bpk. Bambang Prasetyo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              />
            </div>

            {/* Nomor WhatsApp */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nomor WhatsApp *
              </label>
              <input
                type="text"
                required
                placeholder="081234567890"
                value={phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              />
              {phoneWarning && (
                <p className="text-[11px] text-amber-600 font-medium mt-1">
                  {phoneWarning}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Alamat Email
              </label>
              <input
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              />
            </div>

            {/* Kota */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Kota / Kabupaten *
              </label>
              <input
                type="text"
                required
                placeholder="Semarang / Ungaran / Salatiga"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              />
            </div>

            {/* Tanggal Masuk */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Tanggal Masuk
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              />
            </div>

            {/* Alamat */}
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Alamat Domisili
              </label>
              <input
                type="text"
                placeholder="Jl. Merak No. 12, Gajahmungkur"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              />
            </div>

            {/* Sumber Leads */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Sumber Leads
              </label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value as LeadSource)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              >
                <option value="Meta Ads">Meta Ads</option>
                <option value="Instagram">Instagram</option>
                <option value="Facebook">Facebook</option>
                <option value="Website">Website</option>
                <option value="Referral">Referral</option>
                <option value="Walk In">Walk In</option>
                <option value="Canvassing">Canvassing</option>
                <option value="Open Table">Open Table</option>
                <option value="Event">Event</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            {/* Minat Tipe Rumah */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Minat Tipe Rumah Amaya
              </label>
              <select
                value={houseTypeInterest}
                onChange={(e) => setHouseTypeInterest(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              >
                {houseTypes.map((ht) => (
                  <option key={ht.id} value={ht.name}>
                    {ht.name} (LB {ht.lb} / LT {ht.lt})
                  </option>
                ))}
              </select>
            </div>

            {/* Budget */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Budget Pembelian (Rp)
              </label>
              <input
                type="number"
                step={50000000}
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              />
            </div>

            {/* Cara Pembelian */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Rencana Pembayaran
              </label>
              <select
                value={paymentMethodPreference}
                onChange={(e) => setPaymentMethodPreference(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              >
                <option value="KPR">KPR Bank</option>
                <option value="Cash Keras">Cash Keras (Diskon Khusus)</option>
                <option value="Cash Bertahap">Cash Bertahap (Inhouse)</option>
              </select>
            </div>

            {/* PIC Sales */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                PIC Sales Penanggung Jawab
              </label>
              <select
                value={picName}
                onChange={(e) => setPicName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              >
                <option value="Senja">Senja</option>
                <option value="Eka">Eka</option>
                <option value="Hendra Setiawan">Hendra Setiawan</option>
                <option value="Rina Marketing">Rina Marketing</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Status Calon Konsumen
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as LeadStatus)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              >
                <option value="Lead">Lead (Awal)</option>
                <option value="Warm Prospect">Warm Prospect (Tertarik)</option>
                <option value="Hot Prospect">Hot Prospect (Potensi Tinggi)</option>
              </select>
            </div>

            {/* Catatan Tambahan */}
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Catatan Tambahan
              </label>
              <textarea
                rows={3}
                placeholder="Preferensi unit hadap timur, butuh carport 2 mobil, info promo, dll..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold rounded-xl bg-[#127144] hover:bg-[#0e5c36] text-white flex items-center gap-1.5 shadow-sm"
            >
              <Save size={15} />
              <span>{leadToEdit ? 'Simpan Perubahan' : 'Simpan Leads'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
