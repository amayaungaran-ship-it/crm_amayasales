/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CrmProvider, useCrm } from './context/CrmContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardView } from './components/dashboard/DashboardView';
import { LeadsView } from './components/leads/LeadsView';
import { LeadFormModal } from './components/leads/LeadFormModal';
import { ProspectingView } from './components/prospecting/ProspectingView';
import { ClosingView } from './components/closing/ClosingView';
import { ClosingFormModal } from './components/closing/ClosingFormModal';
import { CalendarEventView, EventFormModal } from './components/calendar/CalendarEventView';
import { VisitInstansiView } from './components/b2b/VisitInstansiView';
import { KPITargetView } from './components/kpi/KPITargetView';
import { MarketingForecastView } from './components/forecast/MarketingForecastView';
import { HouseTypesView } from './components/master/HouseTypesView';
import { ReportsView } from './components/reports/ReportsView';
import { SettingsBackupView } from './components/settings/SettingsBackupView';
import { Lead, Closing } from './types';
import { X, ShieldCheck, UserCheck } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentUser, users, switchUser } = useCrm();

  // Navigation
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  // Modals state
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  const [leadToEdit, setLeadToEdit] = useState<Lead | null>(null);
  const [selectedLeadForDetail, setSelectedLeadForDetail] = useState<Lead | null>(null);

  const [isAddClosingModalOpen, setIsAddClosingModalOpen] = useState(false);
  const [closingToEdit, setClosingToEdit] = useState<Closing | null>(null);
  const [preselectedLeadForClosing, setPreselectedLeadForClosing] = useState<Lead | null>(null);

  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  const handleOpenEditLead = (lead: Lead) => {
    setLeadToEdit(lead);
    setIsAddLeadModalOpen(true);
  };

  const handleOpenEditClosing = (closing: Closing) => {
    setClosingToEdit(closing);
    setIsAddClosingModalOpen(true);
  };

  const handleOpenClosingWithLead = (lead: Lead) => {
    setPreselectedLeadForClosing(lead);
    setClosingToEdit(null);
    setIsAddClosingModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f4f6f8] text-slate-900 flex">
      {/* Sidebar */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        onOpenUserModal={() => setIsUserModalOpen(true)}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          sidebarCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        <Header
          currentTab={currentTab}
          onOpenAddLeadModal={() => {
            setLeadToEdit(null);
            setIsAddLeadModalOpen(true);
          }}
          onOpenAddClosingModal={() => {
            setClosingToEdit(null);
            setPreselectedLeadForClosing(null);
            setIsAddClosingModalOpen(true);
          }}
          onOpenAddEventModal={() => setIsAddEventModalOpen(true)}
          onOpenUserModal={() => setIsUserModalOpen(true)}
        />

        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'dashboard' && (
            <DashboardView
              onNavigateTab={setCurrentTab}
              onOpenAddLeadModal={() => {
                setLeadToEdit(null);
                setIsAddLeadModalOpen(true);
              }}
              onOpenAddClosingModal={() => {
                setClosingToEdit(null);
                setPreselectedLeadForClosing(null);
                setIsAddClosingModalOpen(true);
              }}
            />
          )}

          {currentTab === 'leads' && (
            <LeadsView
              onOpenAddModal={() => {
                setLeadToEdit(null);
                setIsAddLeadModalOpen(true);
              }}
              selectedLeadForDetail={selectedLeadForDetail}
              onSelectLeadForDetail={setSelectedLeadForDetail}
              onOpenEditModal={handleOpenEditLead}
            />
          )}

          {currentTab === 'prospecting' && (
            <ProspectingView
              onOpenClosingModalWithLead={handleOpenClosingWithLead}
              onSelectLeadForDetail={setSelectedLeadForDetail}
            />
          )}

          {currentTab === 'closing' && (
            <ClosingView
              onOpenAddModal={() => {
                setClosingToEdit(null);
                setPreselectedLeadForClosing(null);
                setIsAddClosingModalOpen(true);
              }}
              onOpenEditModal={handleOpenEditClosing}
            />
          )}

          {currentTab === 'calendar' && (
            <CalendarEventView onOpenAddModal={() => setIsAddEventModalOpen(true)} />
          )}

          {currentTab === 'visit-instansi' && <VisitInstansiView />}

          {currentTab === 'kpi' && <KPITargetView />}

          {currentTab === 'forecast' && <MarketingForecastView />}

          {currentTab === 'house-types' && <HouseTypesView />}

          {currentTab === 'reports' && <ReportsView />}

          {currentTab === 'settings' && <SettingsBackupView />}
        </main>
      </div>

      {/* Global Modals */}
      <LeadFormModal
        isOpen={isAddLeadModalOpen}
        onClose={() => {
          setIsAddLeadModalOpen(false);
          setLeadToEdit(null);
        }}
        leadToEdit={leadToEdit}
      />

      <ClosingFormModal
        isOpen={isAddClosingModalOpen}
        onClose={() => {
          setIsAddClosingModalOpen(false);
          setClosingToEdit(null);
          setPreselectedLeadForClosing(null);
        }}
        closingToEdit={closingToEdit}
        preselectedLead={preselectedLeadForClosing}
      />

      <EventFormModal
        isOpen={isAddEventModalOpen}
        onClose={() => setIsAddEventModalOpen(false)}
      />

      {/* User Switcher Modal */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck size={20} className="text-emerald-700" />
                <h3 className="font-bold text-base text-slate-900">
                  Ganti Akun & Hak Akses
                </h3>
              </div>
              <button
                onClick={() => setIsUserModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Pilih pengguna untuk mensimulasikan hak akses operasional (Super Admin, Manager Sales, Sales, atau Marketing):
            </p>

            <div className="space-y-2">
              {users.map((u) => {
                const isActive = currentUser.id === u.id;
                return (
                  <button
                    key={u.id}
                    onClick={() => {
                      switchUser(u.id);
                      setIsUserModalOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                      isActive
                        ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-600/20'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-xs">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-xs text-slate-900 block">{u.name}</span>
                        <span className="text-[11px] text-slate-500">{u.email}</span>
                      </div>
                    </div>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                        isActive
                          ? 'bg-emerald-700 text-white'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {u.role.replace('_', ' ')}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <CrmProvider>
      <AppContent />
    </CrmProvider>
  );
}
