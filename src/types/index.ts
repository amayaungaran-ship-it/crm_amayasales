export type UserRole = 'super_admin' | 'manager_sales' | 'sales' | 'marketing';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone: string;
}

export type LeadSource =
  | 'Meta Ads'
  | 'Instagram'
  | 'Facebook'
  | 'Website'
  | 'Referral'
  | 'Walk In'
  | 'Canvassing'
  | 'Open Table'
  | 'Event'
  | 'Lainnya';

export type LeadStatus = 'Lead' | 'Warm Prospect' | 'Hot Prospect' | 'Closing' | 'Loss';

export type ClosingStatus = 'Booking' | 'Tanda Jadi' | 'Berkas KPR' | 'Akad' | 'Lunas' | 'Batal';

export interface HouseType {
  id: string;
  name: string;
  code: string;
  lb: number; // Luas Bangunan m2
  lt: number; // Luas Tanah m2
  kt: number; // Kamar Tidur
  km: number; // Kamar Mandi
  carport: number;
  floors: number;
  basePrice: number;
  imageUrl: string;
  description: string;
  availableUnits: number;
  totalUnits: number;
}

export interface Lead {
  id: string;
  code: string; // e.g. AHR-0001
  date: string; // YYYY-MM-DD
  name: string;
  city: string;
  phone: string;
  email: string;
  address?: string;
  houseTypeInterest: string;
  budget: number;
  paymentMethodPreference: 'Cash Keras' | 'Cash Bertahap' | 'KPR';
  source: LeadSource;
  picId: string;
  picName: string;
  status: LeadStatus;
  notes: string;
  interestLevel?: 'Tinggi' | 'Sedang' | 'Rendah';
  surveyScheduledDate?: string;
  estimatedClosingMonth?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FollowUp {
  id: string;
  leadId: string;
  leadCode?: string;
  leadName?: string;
  date: string;
  time: string;
  method: 'WhatsApp' | 'Telepon' | 'Bertemu Langsung' | 'Video Call';
  result: string;
  consumerResponse: 'Sangat Tertarik' | 'Tertarik' | 'Pikir-Pikir' | 'Belum Ada Respon' | 'Tidak Berminat';
  actionPlan: string;
  nextFollowUpDate?: string;
  picName: string;
  createdAt: string;
}

export interface StatusHistory {
  id: string;
  leadId: string;
  fromStatus: LeadStatus;
  toStatus: LeadStatus;
  changedBy: string;
  timestamp: string;
  reason?: string;
}

export interface Closing {
  id: string;
  closingCode: string; // e.g. CLS-AHR-0001
  leadId?: string;
  closingDate: string;
  consumerName: string;
  phone: string;
  houseType: string;
  unitNumber: string;
  unitPrice: number;
  discount: number;
  finalPrice: number;
  paymentMethod: 'Cash Keras' | 'Cash Bertahap' | 'KPR';
  bookingDate: string;
  bookingFee: number;
  paymentDate: string;
  picId: string;
  picName: string;
  commission: number;
  transactionStatus: ClosingStatus;
  notes: string;
}

export type EventType =
  | 'Open Table'
  | 'Canvassing'
  | 'Presentasi'
  | 'Seminar'
  | 'Gathering'
  | 'Pameran'
  | 'Visit Konsumen'
  | 'Event Instansi'
  | 'Lainnya';

export type EventStatus = 'Terjadwal' | 'Berlangsung' | 'Selesai' | 'Dibatalkan';

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime: string;
  endTime: string;
  location: string;
  eventType: EventType;
  picName: string;
  targetParticipants: string;
  budget: number;
  notes: string;
  status: EventStatus;
}

export type InstansiCategory =
  | 'Perusahaan Swasta'
  | 'BUMN'
  | 'Instansi Pemerintah'
  | 'Komunitas'
  | 'Bank / Finansial'
  | 'Rumah Sakit'
  | 'Lainnya';

export type CooperationStatus =
  | 'Belum Dikunjungi'
  | 'Sudah Dikunjungi'
  | 'Follow-up'
  | 'Negosiasi Kerja Sama'
  | 'Kerja Sama Aktif'
  | 'Tidak Berlanjut';

export interface Instansi {
  id: string;
  code: string;
  name: string;
  category: InstansiCategory;
  city: string;
  address?: string;
  picInstansi: string;
  phone: string;
  picSalesId: string;
  picSalesName: string;
  cooperationStatus: CooperationStatus;
  notes: string;
  potentialEmployees?: number;
  createdAt: string;
}

export interface InstansiVisit {
  id: string;
  instansiId: string;
  instansiName: string;
  visitDate: string;
  picMet: string;
  salesPic: string;
  objective: string;
  meetingResult: string;
  potentialLeadsCount: number;
  actionPlan: string;
  nextVisitDate?: string;
  createdAt: string;
}

export interface KPITarget {
  id: string;
  month: string; // YYYY-MM
  salesId: string;
  salesName: string;
  targetLeads: number;
  targetWarm: number;
  targetHot: number;
  targetSurvey: number;
  targetBooking: number;
  targetClosing: number;
  targetOmzet: number;
}

export interface ActivityLog {
  id: string;
  user: string;
  action: string;
  module: string;
  detail: string;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'urgent' | 'info' | 'success' | 'warning';
  time: string;
  isRead: boolean;
  linkTab?: string;
  leadId?: string;
}

export type TimePeriodFilter =
  | 'Semua periode'
  | 'Hari Ini'
  | 'Minggu Ini'
  | 'Bulan Ini'
  | 'Bulan Sebelumnya'
  | 'Tahun Ini'
  | 'Custom Date Range';
