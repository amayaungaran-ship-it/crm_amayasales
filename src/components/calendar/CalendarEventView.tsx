import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  MapPin,
  Clock,
  User,
  DollarSign,
  Edit2,
  Trash2,
  CheckCircle,
  X,
  Building,
  Users,
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { CalendarEvent, EventType, EventStatus } from '../../types';
import {
  formatRupiah,
  formatIndonesianDate,
  getEventStatusBadgeStyle,
} from '../../utils/formatters';

interface CalendarEventViewProps {
  onOpenAddModal: () => void;
}

export const CalendarEventView: React.FC<CalendarEventViewProps> = ({
  onOpenAddModal,
}) => {
  const { events, deleteEvent, updateEvent, addEvent } = useCrm();

  // Current calendar view month (default November 2026 as per workspace local time)
  const [currentDate, setCurrentDate] = useState(new Date(2026, 10, 9)); // Month 10 is Nov
  const [selectedDate, setSelectedDate] = useState<string | null>('2026-11-09');

  // Filter state
  const [filterType, setFilterType] = useState<string>('all');
  const [filterPic, setFilterPic] = useState<string>('all');

  // Modal edit event
  const [eventToEdit, setEventToEdit] = useState<CalendarEvent | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Month navigation
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const monthNames = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];

  // Calendar math
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 is Sunday

  // Events map for current month
  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    events.forEach((evt) => {
      if (!map[evt.date]) map[evt.date] = [];
      map[evt.date].push(evt);
    });
    return map;
  }, [events]);

  // Filtered table events
  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      const matchDate = selectedDate ? evt.date === selectedDate : true;
      const matchType = filterType === 'all' || evt.eventType === filterType;
      const matchPic = filterPic === 'all' || evt.picName.includes(filterPic);
      return matchDate && matchType && matchPic;
    });
  }, [events, selectedDate, filterType, filterPic]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Calendar Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
              <CalendarIcon size={22} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                {monthNames[month]} {year}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Jadwal kegiatan promosi, canvassing, pameran, dan gathering Amaya Home Resort
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={prevMonth}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
              title="Bulan Sebelumnya"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setCurrentDate(new Date(2026, 10, 9))}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50"
            >
              Hari Ini
            </button>
            <button
              onClick={nextMonth}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
              title="Bulan Berikutnya"
            >
              <ChevronRight size={18} />
            </button>
            <button
              onClick={onOpenAddModal}
              className="ml-2 px-4 py-2 text-xs font-bold rounded-xl bg-[#127144] hover:bg-[#0e5c36] text-white flex items-center gap-1.5 shadow-sm"
            >
              <Plus size={16} />
              <span>Entry Event Baru</span>
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="mt-5">
          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 text-center font-bold text-xs text-slate-500 uppercase tracking-wider py-2">
            <span className="text-rose-600">Min</span>
            <span>Sen</span>
            <span>Sel</span>
            <span>Rab</span>
            <span>Kam</span>
            <span>Jum</span>
            <span className="text-emerald-700">Sab</span>
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 mt-1">
            {/* Blank offset days */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`blank-${i}`} className="h-16 sm:h-20 bg-slate-50/40 rounded-xl" />
            ))}

            {/* Days in Month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const dayEvents = eventsByDate[dateStr] || [];
              const isSelected = selectedDate === dateStr;
              const isToday = day === 9 && month === 10 && year === 2026;

              return (
                <div
                  key={dateStr}
                  onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                  className={`h-16 sm:h-20 p-1.5 sm:p-2 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-600/30 shadow-xs'
                      : isToday
                      ? 'border-emerald-300 bg-emerald-50/20'
                      : 'border-slate-100 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-mono font-bold ${
                        isSelected
                          ? 'text-emerald-800'
                          : isToday
                          ? 'text-emerald-700'
                          : 'text-slate-700'
                      }`}
                    >
                      {day}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="text-[10px] font-mono font-bold bg-[#127144] text-white px-1.5 py-0.2 rounded-full">
                        {dayEvents.length}
                      </span>
                    )}
                  </div>

                  {/* Activity Preview Pills */}
                  <div className="space-y-0.5 overflow-hidden">
                    {dayEvents.slice(0, 1).map((evt) => (
                      <div
                        key={evt.id}
                        className="truncate text-[10px] font-medium px-1 py-0.5 rounded bg-emerald-100/80 text-emerald-900"
                        title={evt.title}
                      >
                        {evt.title}
                      </div>
                    ))}
                    {dayEvents.length > 1 && (
                      <span className="text-[9px] text-slate-400 font-semibold pl-1">
                        +{dayEvents.length - 1} event lagi
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Date Notice */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className="text-slate-600">
            {selectedDate ? (
              <span>
                Menampilkan event pada tanggal:{' '}
                <strong className="text-emerald-800">{formatIndonesianDate(selectedDate)}</strong>
              </span>
            ) : (
              <span>Menampilkan seluruh kegiatan</span>
            )}
          </div>
          {selectedDate && (
            <button
              onClick={() => setSelectedDate(null)}
              className="text-xs text-emerald-700 hover:underline font-semibold"
            >
              Lihat Semua Tanggal
            </button>
          )}
        </div>
      </div>

      {/* Events Table Below Calendar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-slate-800">
              Tabel Kegiatan & Event Pemasaran
            </span>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-mono tabular-nums">
              {filteredEvents.length} kegiatan
            </span>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 text-xs">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
            >
              <option value="all">Semua Jenis Kegiatan</option>
              <option value="Open Table">Open Table</option>
              <option value="Canvassing">Canvassing</option>
              <option value="Presentasi">Presentasi</option>
              <option value="Gathering">Gathering</option>
              <option value="Pameran">Pameran</option>
              <option value="Event Instansi">Event Instansi</option>
            </select>

            <select
              value={filterPic}
              onChange={(e) => setFilterPic(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
            >
              <option value="all">Semua PIC</option>
              <option value="Senja">Senja</option>
              <option value="Eka">Eka</option>
              <option value="Hendra">Hendra</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-slate-600 border-b border-slate-200/80 font-semibold tracking-wider uppercase text-[11px]">
                <th className="py-3 px-3.5">Tanggal</th>
                <th className="py-3 px-3.5">Nama Kegiatan</th>
                <th className="py-3 px-3.5">Lokasi</th>
                <th className="py-3 px-3.5">Jenis</th>
                <th className="py-3 px-3.5">PIC</th>
                <th className="py-3 px-3.5">Target / Peserta</th>
                <th className="py-3 px-3.5 text-right">Anggaran</th>
                <th className="py-3 px-3.5 text-center">Status</th>
                <th className="py-3 px-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    Tidak ada event terjadwal pada filter ini.
                  </td>
                </tr>
              ) : (
                filteredEvents.map((evt) => {
                  const badgeClass = getEventStatusBadgeStyle(evt.status);
                  return (
                    <tr key={evt.id} className="hover:bg-emerald-50/30 transition-colors">
                      <td className="py-3.5 px-3.5 font-mono whitespace-nowrap text-slate-600">
                        {formatIndonesianDate(evt.date)}
                        <div className="text-[10px] text-slate-400">
                          {evt.startTime} - {evt.endTime}
                        </div>
                      </td>
                      <td className="py-3.5 px-3.5 font-bold text-slate-900 max-w-[220px]">
                        {evt.title}
                        {evt.notes && (
                          <p className="text-[10px] text-slate-500 font-normal line-clamp-1 mt-0.5">
                            {evt.notes}
                          </p>
                        )}
                      </td>
                      <td className="py-3.5 px-3.5 text-slate-600 max-w-[180px]">
                        <div className="flex items-center gap-1">
                          <MapPin size={12} className="text-slate-400 shrink-0" />
                          <span className="truncate">{evt.location}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3.5 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                          {evt.eventType}
                        </span>
                      </td>
                      <td className="py-3.5 px-3.5 whitespace-nowrap font-semibold text-slate-800">
                        {evt.picName}
                      </td>
                      <td className="py-3.5 px-3.5 text-slate-600 whitespace-nowrap">
                        {evt.targetParticipants}
                      </td>
                      <td className="py-3.5 px-3.5 text-right font-mono font-semibold text-slate-800 whitespace-nowrap">
                        {formatRupiah(evt.budget)}
                      </td>
                      <td className="py-3.5 px-3.5 text-center whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${badgeClass}`}>
                          {evt.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setEventToEdit(evt)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-700 hover:bg-blue-50"
                            title="Edit Event"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => deleteEvent(evt.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-700 hover:bg-rose-50"
                            title="Hapus Event"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Event Modal */}
      {eventToEdit && (
        <EventFormModal
          isOpen={true}
          onClose={() => setEventToEdit(null)}
          eventToEdit={eventToEdit}
        />
      )}
    </div>
  );
};

// Sub-component: Event Form Modal
interface EventFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventToEdit?: CalendarEvent | null;
}

export const EventFormModal: React.FC<EventFormModalProps> = ({
  isOpen,
  onClose,
  eventToEdit,
}) => {
  const { addEvent, updateEvent } = useCrm();

  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('17:00');
  const [location, setLocation] = useState('Marketing Gallery Amaya');
  const [eventType, setEventType] = useState<EventType>('Open Table');
  const [picName, setPicName] = useState('Senja');
  const [targetParticipants, setTargetParticipants] = useState('50 Calon Konsumen');
  const [budget, setBudget] = useState(2000000);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<EventStatus>('Terjadwal');

  useState(() => {
    if (eventToEdit) {
      setTitle(eventToEdit.title);
      setDate(eventToEdit.date);
      setStartTime(eventToEdit.startTime);
      setEndTime(eventToEdit.endTime);
      setLocation(eventToEdit.location);
      setEventType(eventToEdit.eventType);
      setPicName(eventToEdit.picName);
      setTargetParticipants(eventToEdit.targetParticipants);
      setBudget(eventToEdit.budget);
      setNotes(eventToEdit.notes || '');
      setStatus(eventToEdit.status);
    }
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (eventToEdit) {
      updateEvent(eventToEdit.id, {
        title,
        date,
        startTime,
        endTime,
        location,
        eventType,
        picName,
        targetParticipants,
        budget: Number(budget),
        notes,
        status,
      });
    } else {
      addEvent({
        title,
        date,
        startTime,
        endTime,
        location,
        eventType,
        picName,
        targetParticipants,
        budget: Number(budget),
        notes,
        status,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-bold text-base text-slate-900">
            {eventToEdit ? 'Edit Kegiatan / Event' : 'Entry Event & Promosi Baru'}
          </h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Nama Kegiatan / Event *
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Open Table Promo Akhir Tahun Superindo"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Tanggal Kegiatan
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white focus:ring-2 focus:ring-emerald-600"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Jam Pelaksanaan
              </label>
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-1/2 px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-center"
                />
                <span className="text-slate-400">-</span>
                <input
                  type="text"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-1/2 px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-center"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Jenis Kegiatan
              </label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="Open Table">Open Table</option>
                <option value="Canvassing">Canvassing</option>
                <option value="Presentasi">Presentasi</option>
                <option value="Gathering">Gathering</option>
                <option value="Pameran">Pameran</option>
                <option value="Visit Konsumen">Visit Konsumen</option>
                <option value="Event Instansi">Event Instansi</option>
                <option value="Seminar">Seminar</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Sales PIC
              </label>
              <select
                value={picName}
                onChange={(e) => setPicName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="Senja">Senja</option>
                <option value="Eka">Eka</option>
                <option value="Hendra Setiawan">Hendra Setiawan</option>
                <option value="Rina Marketing">Rina Marketing</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Lokasi Acara *
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Target / Peserta
              </label>
              <input
                type="text"
                placeholder="Contoh: 30 Leads Valid"
                value={targetParticipants}
                onChange={(e) => setTargetParticipants(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Anggaran (Rp)
              </label>
              <input
                type="number"
                step={500000}
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Status Kegiatan
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            >
              <option value="Terjadwal">Terjadwal</option>
              <option value="Berlangsung">Berlangsung</option>
              <option value="Selesai">Selesai</option>
              <option value="Dibatalkan">Dibatalkan</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Catatan / Kebutuhan Logistik
            </label>
            <textarea
              rows={2}
              placeholder="Roll banner, maket, merchandise souvenir..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-sm"
            >
              Simpan Kegiatan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
