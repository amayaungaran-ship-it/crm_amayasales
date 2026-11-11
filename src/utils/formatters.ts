import { LeadStatus, ClosingStatus, EventStatus, CooperationStatus } from '../types';

export const formatRupiah = (amount: number): string => {
  if (isNaN(amount) || amount === null || amount === undefined) return 'Rp 0';
  return 'Rp ' + Math.round(amount).toLocaleString('id-ID');
};

export const formatCompactRupiah = (amount: number): string => {
  if (amount >= 1000000000) {
    return 'Rp ' + (amount / 1000000000).toFixed(2).replace(/\.00$/, '') + ' M';
  }
  if (amount >= 1000000) {
    return 'Rp ' + (amount / 1000000).toFixed(1).replace(/\.0$/, '') + ' Jt';
  }
  return formatRupiah(amount);
};

export const formatIndonesianDate = (dateStr: string): string => {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'Mei',
      'Jun',
      'Jul',
      'Agu',
      'Sep',
      'Okt',
      'Nov',
      'Des',
    ];
    return `${String(d.getDate()).padStart(2, '0')} ${months[d.getMonth()]} ${d.getFullYear()}`;
  } catch {
    return dateStr;
  }
};

export const formatIndonesianDateTime = (isoStr: string): string => {
  if (!isoStr) return '-';
  try {
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return isoStr;
    const dateFormatted = formatIndonesianDate(isoStr);
    const timeFormatted = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    return `${dateFormatted} ${timeFormatted}`;
  } catch {
    return isoStr;
  }
};

export const formatWhatsAppLink = (phone: string, customerName?: string, houseType?: string): string => {
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.slice(1);
  } else if (!cleaned.startsWith('62')) {
    cleaned = '62' + cleaned;
  }
  const greeting = customerName
    ? `Halo ${customerName}, saya dari Marketing Gallery Amaya Home Resort Ungaran.`
    : `Halo, saya dari Marketing Gallery Amaya Home Resort Ungaran.`;
  const interestNote = houseType ? ` Terkait informasi hunian tipe ${houseType}...` : '';
  const message = encodeURIComponent(`${greeting}${interestNote}`);
  return `https://wa.me/${cleaned}?text=${message}`;
};

export const getStatusBadgeStyle = (status: LeadStatus | string) => {
  switch (status) {
    case 'Hot Prospect':
      return {
        bg: 'bg-rose-50 border-rose-200 text-rose-700',
        dot: 'bg-rose-500',
        label: 'Hot Prospect',
      };
    case 'Warm Prospect':
      return {
        bg: 'bg-amber-50 border-amber-200 text-amber-800',
        dot: 'bg-amber-500',
        label: 'Warm Prospect',
      };
    case 'Closing':
      return {
        bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
        dot: 'bg-emerald-600',
        label: 'Closing',
      };
    case 'Loss':
      return {
        bg: 'bg-slate-100 border-slate-200 text-slate-600',
        dot: 'bg-slate-400',
        label: 'Loss',
      };
    case 'Lead':
    default:
      return {
        bg: 'bg-sky-50 border-sky-200 text-sky-800',
        dot: 'bg-sky-500',
        label: 'Lead',
      };
  }
};

export const getClosingStatusBadgeStyle = (status: ClosingStatus) => {
  switch (status) {
    case 'Lunas':
      return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    case 'Akad':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'Berkas KPR':
      return 'bg-purple-100 text-purple-800 border-purple-300';
    case 'Tanda Jadi':
      return 'bg-amber-100 text-amber-800 border-amber-300';
    case 'Booking':
      return 'bg-cyan-100 text-cyan-800 border-cyan-300';
    case 'Batal':
      return 'bg-rose-100 text-rose-800 border-rose-300';
    default:
      return 'bg-slate-100 text-slate-800 border-slate-300';
  }
};

export const getEventStatusBadgeStyle = (status: EventStatus) => {
  switch (status) {
    case 'Berlangsung':
      return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    case 'Terjadwal':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'Selesai':
      return 'bg-slate-100 text-slate-700 border-slate-300';
    case 'Dibatalkan':
      return 'bg-rose-100 text-rose-800 border-rose-300';
  }
};

export const getCooperationStatusBadgeStyle = (status: CooperationStatus) => {
  switch (status) {
    case 'Kerja Sama Aktif':
      return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    case 'Negosiasi Kerja Sama':
      return 'bg-amber-100 text-amber-800 border-amber-300';
    case 'Follow-up':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'Sudah Dikunjungi':
      return 'bg-cyan-100 text-cyan-800 border-cyan-300';
    case 'Belum Dikunjungi':
      return 'bg-slate-100 text-slate-700 border-slate-300';
    case 'Tidak Berlanjut':
      return 'bg-rose-100 text-rose-800 border-rose-300';
  }
};

// Export to Excel-compatible CSV with UTF-8 BOM
export const exportToCsv = (filename: string, headers: string[], rows: (string | number)[][]) => {
  const escapeCell = (val: string | number) => {
    if (val === null || val === undefined) return '""';
    const s = String(val).replace(/"/g, '""');
    return `"${s}"`;
  };

  const csvContent =
    '\uFEFF' +
    [
      headers.map(escapeCell).join(','),
      ...rows.map((row) => row.map(escapeCell).join(',')),
    ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};
