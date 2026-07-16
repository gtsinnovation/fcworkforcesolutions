import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { CalendarDays, Clock, Users, FileText, Briefcase, UserCircle } from "lucide-react";
import CaregiverSchedule from "@/components/fcws/caregiver/CaregiverSchedule";
import CareNotesSection from "@/components/fcws/caregiver/CareNotesSection";
import CaregiverIncidents from "@/components/fcws/caregiver/CaregiverIncidents";

export default function CaregiverDashboard() {
  const [user, setUser] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [clients, setClients] = useState([]);
  const [notes, setNotes] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    try {
      const u = await base44.auth.me();
      setUser(u);

      const emps = await base44.entities.Employee.filter({ email: u.email });
      const emp = emps[0] || null;
      setEmployee(emp);

      const scheds = emp ? await base44.entities.ScheduleEntry.filter({ employeeId: emp.id }) : [];
      setSchedules(scheds);

      const clientIds = [...new Set(scheds.map(s => s.clientId))];
      const allClients = await base44.entities.Client.list();
      const myClients = allClients.filter(c => clientIds.includes(c.id));
      setClients(myClients);

      const noteList = await base44.entities.CareNote.list("-created_date", 50);
      setNotes(noteList.filter(n => clientIds.includes(n.clientId)));

      const incs = await base44.entities.IncidentReport.filter({ reportedByUserId: u.id || "" });
      setIncidents(incs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  const clientMap = Object.fromEntries(clients.map(c => [c.id, c]));
  const today = new Date().toISOString().slice(0, 10);
  const todayCount = schedules.filter(s => s.date === today).length;
  const upcomingCount = schedules.filter(s => s.date > today).length;

  if (loading) {
    return <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-muted border-t-secondary rounded-full animate-spin" /></div>;
  }

  if (!employee) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="font-heading font-bold text-2xl text-primary">Caregiver Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome, {user?.full_name || user?.email}</p>
        </div>
        <div className="care-card text-center py-12">
          <UserCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-heading font-semibold text-lg text-primary mb-1">Not Linked Yet</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Your account isn't linked to a caregiver profile yet. An admin must add your email to the Caregivers list and approve your profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading font-bold text-2xl text-primary">Caregiver Dashboard</h1>
        <p className="text-sm text-muted-foreground">Welcome, {user?.full_name || user?.email}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <div className="care-card">
          <div className="flex items-center gap-3 mb-2"><CalendarDays className="w-5 h-5 text-secondary" /><span className="text-sm text-muted-foreground">Today's Visits</span></div>
          <div className="font-heading font-bold text-2xl text-primary">{todayCount}</div>
        </div>
        <div className="care-card">
          <div className="flex items-center gap-3 mb-2"><Clock className="w-5 h-5 text-secondary" /><span className="text-sm text-muted-foreground">Upcoming</span></div>
          <div className="font-heading font-bold text-2xl text-primary">{upcomingCount}</div>
        </div>
        <div className="care-card">
          <div className="flex items-center gap-3 mb-2"><Users className="w-5 h-5 text-secondary" /><span className="text-sm text-muted-foreground">Assigned Clients</span></div>
          <div className="font-heading font-bold text-2xl text-primary">{clients.length}</div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <CaregiverSchedule schedules={schedules} clientMap={clientMap} onSchedulesChange={loadData} />
        <CareNotesSection clients={clients} employeeId={employee?.id} notes={notes} onNotesChange={loadData} />
      </div>

      <div className="mt-6">
        <CaregiverIncidents user={user} clients={clients} incidents={incidents} onIncidentsChange={loadData} />
      </div>
    </div>
  );
}