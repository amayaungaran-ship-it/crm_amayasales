import React, { useState } from 'react';
import {
  Home,
  Bed,
  Bath,
  Car,
  Layers,
  Edit2,
  CheckCircle,
  Tag,
  Building,
  Plus,
  Save,
  X,
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { HouseType } from '../../types';
import { formatRupiah } from '../../utils/formatters';

export const HouseTypesView: React.FC = () => {
  const { houseTypes, updateHouseType, currentUser } = useCrm();

  const [typeToEdit, setTypeToEdit] = useState<HouseType | null>(null);

  const isAdmin = currentUser.role === 'super_admin' || currentUser.role === 'manager_sales';

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
            <Home size={22} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              Master Data Tipe Hunian Amaya Home Resort
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Katalog spesifikasi teknis, harga jual pricelist, dan ketersediaan unit kavling
            </p>
          </div>
        </div>

        {isAdmin && (
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
            Mode Akses Admin: Harga & Unit Dapat Diperbarui
          </span>
        )}
      </div>

      {/* House Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {houseTypes.map((ht) => (
          <div
            key={ht.id}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow group"
          >
            <div>
              {/* Image Container */}
              <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100">
                <img
                  src={ht.imageUrl}
                  alt={`Fasad ${ht.name} Amaya Home Resort`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg">
                  Tipe {ht.name}
                </div>
                <div className="absolute top-3 right-3 bg-emerald-800/90 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-sm">
                  Tersedia {ht.availableUnits} dari {ht.totalUnits} Unit
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-3.5">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 tracking-tight">
                      {ht.name}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      LB {ht.lb} m² / LT {ht.lt} m² · {ht.floors} Lantai
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-medium block">Mulai dari</span>
                    <span className="text-base font-bold font-mono text-emerald-900">
                      {formatRupiah(ht.basePrice)}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {ht.description}
                </p>

                {/* Specs Pill Strip */}
                <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-slate-700 text-xs text-center">
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <Bed size={15} className="mx-auto text-emerald-700 mb-1" />
                    <span className="font-bold">{ht.kt}</span>
                    <span className="text-[10px] text-slate-400 block">K. Tidur</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <Bath size={15} className="mx-auto text-emerald-700 mb-1" />
                    <span className="font-bold">{ht.km}</span>
                    <span className="text-[10px] text-slate-400 block">K. Mandi</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <Car size={15} className="mx-auto text-emerald-700 mb-1" />
                    <span className="font-bold">{ht.carport}</span>
                    <span className="text-[10px] text-slate-400 block">Carport</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <Layers size={15} className="mx-auto text-emerald-700 mb-1" />
                    <span className="font-bold">{ht.floors}</span>
                    <span className="text-[10px] text-slate-400 block">Lantai</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer / Edit Button */}
            <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-mono">
                Kode: <strong>{ht.code}</strong>
              </span>

              {isAdmin && (
                <button
                  onClick={() => setTypeToEdit(ht)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Edit2 size={13} />
                  <span>Update Harga & Stok</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Edit House Type Modal */}
      {typeToEdit && (
        <EditHouseTypeModal
          houseType={typeToEdit}
          onClose={() => setTypeToEdit(null)}
          onSave={updateHouseType}
        />
      )}
    </div>
  );
};

interface EditHouseTypeModalProps {
  houseType: HouseType;
  onClose: () => void;
  onSave: (id: string, updates: Partial<HouseType>) => void;
}

const EditHouseTypeModal: React.FC<EditHouseTypeModalProps> = ({
  houseType,
  onClose,
  onSave,
}) => {
  const [basePrice, setBasePrice] = useState(houseType.basePrice);
  const [availableUnits, setAvailableUnits] = useState(houseType.availableUnits);
  const [totalUnits, setTotalUnits] = useState(houseType.totalUnits);
  const [description, setDescription] = useState(houseType.description);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(houseType.id, {
      basePrice: Number(basePrice),
      availableUnits: Number(availableUnits),
      totalUnits: Number(totalUnits),
      description,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-base text-slate-900">
              Update Tipe {houseType.name}
            </h3>
            <p className="text-xs text-slate-500">Amaya Home Resort</p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Harga Pricelist Jual (Rp)
            </label>
            <input
              type="number"
              step={10000000}
              value={basePrice}
              onChange={(e) => setBasePrice(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Ketersediaan Unit
              </label>
              <input
                type="number"
                value={availableUnits}
                onChange={(e) => setAvailableUnits(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Total Alokasi Unit
              </label>
              <input
                type="number"
                value={totalUnits}
                onChange={(e) => setTotalUnits(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Deskripsi Hunian
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
