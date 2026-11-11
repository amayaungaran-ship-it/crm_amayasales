import React, { useState, useEffect } from 'react';
import { X, Handshake, DollarSign, Save } from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { Closing, ClosingStatus, Lead } from '../../types';

interface ClosingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  closingToEdit?: Closing | null;
  preselectedLead?: Lead | null;
}

export const ClosingFormModal: React.FC<ClosingFormModalProps> = ({
  isOpen,
  onClose,
  closingToEdit,
  preselectedLead,
}) => {
  const { addClosing, updateClosing, houseTypes, leads } = useCrm();

  const [selectedLeadId, setSelectedLeadId] = useState('');
  const [consumerName, setConsumerName] = useState('');
  const [phone, setPhone] = useState('');
  const [closingDate, setClosingDate] = useState(new Date().toISOString().slice(0, 10));
  const [houseType, setHouseType] = useState('Foresta');
  const [unitNumber, setUnitNumber] = useState('Blok A-05');
  const [unitPrice, setUnitPrice] = useState(1450000000);
  const [discount, setDiscount] = useState(25000000);
  const [paymentMethod, setPaymentMethod] = useState<'Cash Keras' | 'Cash Bertahap' | 'KPR'>('KPR');
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().slice(0, 10));
  const [bookingFee, setBookingFee] = useState(20000000);
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().slice(0, 10));
  const [picName, setPicName] = useState('Senja');
  const [commission, setCommission] = useState(21375000);
  const [transactionStatus, setTransactionStatus] = useState<ClosingStatus>('Tanda Jadi');
  const [notes, setNotes] = useState('');

  // Auto-calculated final price
  const finalPrice = Math.max(0, unitPrice - discount);

  useEffect(() => {
    if (closingToEdit) {
      setSelectedLeadId(closingToEdit.leadId || '');
      setConsumerName(closingToEdit.consumerName);
      setPhone(closingToEdit.phone);
      setClosingDate(closingToEdit.closingDate);
      setHouseType(closingToEdit.houseType);
      setUnitNumber(closingToEdit.unitNumber);
      setUnitPrice(closingToEdit.unitPrice);
      setDiscount(closingToEdit.discount);
      setPaymentMethod(closingToEdit.paymentMethod);
      setBookingDate(closingToEdit.bookingDate);
      setBookingFee(closingToEdit.bookingFee);
      setPaymentDate(closingToEdit.paymentDate);
      setPicName(closingToEdit.picName);
      setCommission(closingToEdit.commission);
      setTransactionStatus(closingToEdit.transactionStatus);
      setNotes(closingToEdit.notes || '');
    } else if (preselectedLead) {
      setSelectedLeadId(preselectedLead.id);
      setConsumerName(preselectedLead.name);
      setPhone(preselectedLead.phone);
      setHouseType(preselectedLead.houseTypeInterest || 'Foresta');
      setPicName(preselectedLead.picName);
      const ht = houseTypes.find((h) => h.name === preselectedLead.houseTypeInterest);
      const basePrice = ht ? ht.basePrice : preselectedLead.budget || 1450000000;
      setUnitPrice(basePrice);
      setDiscount(20000000);
      setCommission(Math.round((basePrice - 20000000) * 0.015));
    } else {
      // Default
      setSelectedLeadId('');
      setConsumerName('');
      setPhone('');
      setClosingDate(new Date().toISOString().slice(0, 10));
      setHouseType('Foresta');
      setUnitNumber('Blok B-10');
      setUnitPrice(1450000000);
      setDiscount(20000000);
      setCommission(21450000);
      setTransactionStatus('Tanda Jadi');
      setNotes('');
    }
  }, [closingToEdit, preselectedLead, isOpen]);

  // When lead is picked from dropdown
  const handleSelectLead = (leadId: string) => {
    setSelectedLeadId(leadId);
    const found = leads.find((l) => l.id === leadId);
    if (found) {
      setConsumerName(found.name);
      setPhone(found.phone);
      setHouseType(found.houseTypeInterest);
      setPicName(found.picName);
      const ht = houseTypes.find((h) => h.name === found.houseTypeInterest);
      const baseP = ht ? ht.basePrice : found.budget;
      setUnitPrice(baseP);
      setCommission(Math.round((baseP - discount) * 0.015));
    }
  };

  // When house type changes, update price
  const handleHouseTypeChange = (typeName: string) => {
    setHouseType(typeName);
    const ht = houseTypes.find((h) => h.name === typeName);
    if (ht) {
      setUnitPrice(ht.basePrice);
      setCommission(Math.round((ht.basePrice - discount) * 0.015));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consumerName.trim()) return;

    const picId = picName.includes('Senja') ? 'usr-3' : picName.includes('Eka') ? 'usr-4' : 'usr-5';

    if (closingToEdit) {
      updateClosing(closingToEdit.id, {
        leadId: selectedLeadId || undefined,
        closingDate,
        consumerName,
        phone,
        houseType,
        unitNumber,
        unitPrice: Number(unitPrice),
        discount: Number(discount),
        finalPrice,
        paymentMethod,
        bookingDate,
        bookingFee: Number(bookingFee),
        paymentDate,
        picId,
        picName,
        commission: Number(commission),
        transactionStatus,
        notes,
      });
    } else {
      addClosing({
        leadId: selectedLeadId || undefined,
        closingDate,
        consumerName,
        phone,
        houseType,
        unitNumber,
        unitPrice: Number(unitPrice),
        discount: Number(discount),
        finalPrice,
        paymentMethod,
        bookingDate,
        bookingFee: Number(bookingFee),
        paymentDate,
        picId,
        picName,
        commission: Number(commission),
        transactionStatus,
        notes,
      });
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-[#127144] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Handshake size={20} />
            <h3 className="font-bold text-base">
              {closingToEdit ? `Edit Transaksi: ${closingToEdit.closingCode}` : 'Form Input Transaksi Closing Unit'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Pre-fill from existing leads */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Pilih dari Calon Konsumen / Prospect Terdaftar (Opsional)
            </label>
            <select
              value={selectedLeadId}
              onChange={(e) => handleSelectLead(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-600"
            >
              <option value="">-- Input Konsumen Baru / Manual --</option>
              {leads.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.code} - {l.name} ({l.houseTypeInterest} - {l.city}) - {l.status}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nama Konsumen */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nama Lengkap Pembeli *
              </label>
              <input
                type="text"
                required
                value={consumerName}
                onChange={(e) => setConsumerName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-600"
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
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            {/* Tipe Rumah */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Tipe Rumah Amaya *
              </label>
              <select
                value={houseType}
                onChange={(e) => handleHouseTypeChange(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-600"
              >
                {houseTypes.map((ht) => (
                  <option key={ht.id} value={ht.name}>
                    {ht.name} (LB {ht.lb} / LT {ht.lt})
                  </option>
                ))}
              </select>
            </div>

            {/* Nomor Unit */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nomor Kavling / Unit *
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Blok B-08 / Hook A-01"
                value={unitNumber}
                onChange={(e) => setUnitNumber(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            {/* Tanggal Closing */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Tanggal Closing / Transaksi
              </label>
              <input
                type="date"
                value={closingDate}
                onChange={(e) => setClosingDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            {/* Metode Pembayaran */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Metode Pembayaran
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-600"
              >
                <option value="KPR">KPR Bank (Mandiri, BCA, BNI)</option>
                <option value="Cash Keras">Cash Keras</option>
                <option value="Cash Bertahap">Cash Bertahap 12x / 24x</option>
              </select>
            </div>

            {/* Harga Unit */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Harga Unit Pricelist (Rp)
              </label>
              <input
                type="number"
                step={10000000}
                value={unitPrice}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setUnitPrice(val);
                  setCommission(Math.round((val - discount) * 0.015));
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            {/* Diskon */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Potongan / Diskon (Rp)
              </label>
              <input
                type="number"
                step={5000000}
                value={discount}
                onChange={(e) => {
                  const d = Number(e.target.value);
                  setDiscount(d);
                  setCommission(Math.round((unitPrice - d) * 0.015));
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            {/* Net Final Price Display */}
            <div className="sm:col-span-2 p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
              <span className="font-semibold text-emerald-900">
                Harga Bersih Kesepakatan (Net):
              </span>
              <span className="text-base font-bold font-mono text-emerald-900">
                Rp {finalPrice.toLocaleString('id-ID')}
              </span>
            </div>

            {/* Booking Fee */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Booking Fee / Tanda Jadi (Rp)
              </label>
              <input
                type="number"
                step={5000000}
                value={bookingFee}
                onChange={(e) => setBookingFee(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            {/* Tanggal Tanda Jadi */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Tanggal Booking Fee Masuk
              </label>
              <input
                type="date"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            {/* PIC Sales */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Sales / PIC Penanggung Jawab
              </label>
              <select
                value={picName}
                onChange={(e) => setPicName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-600"
              >
                <option value="Senja">Senja</option>
                <option value="Eka">Eka</option>
                <option value="Hendra Setiawan">Hendra Setiawan</option>
              </select>
            </div>

            {/* Komisi Sales */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nominal Komisi Sales (Rp)
              </label>
              <input
                type="number"
                step={500000}
                value={commission}
                onChange={(e) => setCommission(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            {/* Status Transaksi */}
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Status Transaksi Saat Ini
              </label>
              <select
                value={transactionStatus}
                onChange={(e) => setTransactionStatus(e.target.value as ClosingStatus)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-600 font-medium"
              >
                <option value="Booking">Booking (Baru bayar booking fee)</option>
                <option value="Tanda Jadi">Tanda Jadi (Sudah penandatanganan SPK)</option>
                <option value="Berkas KPR">Berkas KPR (Sedang proses verifikasi bank)</option>
                <option value="Akad">Akad (Akad kredit / notaris dijadwalkan)</option>
                <option value="Lunas">Lunas (Pelunasan 100% diterima)</option>
                <option value="Batal">Batal</option>
              </select>
            </div>

            {/* Catatan Transaksi */}
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Catatan Transaksi / Promo Tambahan
              </label>
              <textarea
                rows={2}
                placeholder="Bonus AC tiap kamar, free canopy, jadwal serah terima, dsb..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-600"
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
              <span>{closingToEdit ? 'Simpan Perubahan' : 'Catat Transaksi Closing'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
