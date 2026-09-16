import { MOCK_PATIENT_MEDICINES, MOCK_PATIENT_PROFILE } from '../data/mockPatientData';
import { PatientMedicine, PatientProfile } from '../types/patient';

class PatientService {
  private medicines: PatientMedicine[] = [...MOCK_PATIENT_MEDICINES];
  private profile: PatientProfile = { ...MOCK_PATIENT_PROFILE };

  public getProfile(): PatientProfile {
    return { ...this.profile };
  }

  public getActiveMedicines(): PatientMedicine[] {
    return this.medicines.filter(m => m.status === 'Active');
  }

  public getAllMedicines(): PatientMedicine[] {
    return [...this.medicines];
  }

  public getById(id: string): PatientMedicine | undefined {
    return this.medicines.find(m => m.id === id);
  }

  public toggleDoseTaken(medicineId: string, timeSlot: string): boolean {
    const med = this.medicines.find(m => m.id === medicineId);
    if (!med) return false;

    const schedule = med.schedules.find(s => s.timeSlot === timeSlot);
    if (!schedule) return false;

    schedule.takenToday = !schedule.takenToday;
    if (schedule.takenToday) {
      const now = new Date();
      schedule.takenTimestamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      // Decrement quantity remaining if marked taken
      if (med.quantityRemaining > 0) {
        med.quantityRemaining -= 1;
        med.daysRemaining = Math.max(0, Math.floor(med.quantityRemaining / Math.max(1, med.dailyDosageUnits)));
      }
    } else {
      schedule.takenTimestamp = undefined;
      med.quantityRemaining += 1;
      med.daysRemaining = Math.floor(med.quantityRemaining / Math.max(1, med.dailyDosageUnits));
    }
    return true;
  }

  public markMedicineStatus(medicineId: string, status: 'Active' | 'Discontinued' | 'Paused'): boolean {
    const med = this.medicines.find(m => m.id === medicineId);
    if (!med) return false;
    med.status = status;
    return true;
  }

  public addMedicine(medicine: PatientMedicine): void {
    this.medicines.push(medicine);
  }

  public getTodaySummary(): {
    totalScheduledDoses: number;
    completedDoses: number;
    adherencePercent: number;
  } {
    const active = this.getActiveMedicines();
    let totalScheduledDoses = 0;
    let completedDoses = 0;

    active.forEach(m => {
      m.schedules.forEach(s => {
        totalScheduledDoses++;
        if (s.takenToday) {
          completedDoses++;
        }
      });
    });

    const adherencePercent = totalScheduledDoses > 0 
      ? Math.round((completedDoses / totalScheduledDoses) * 100) 
      : 100;

    return { totalScheduledDoses, completedDoses, adherencePercent };
  }
}

export const patientService = new PatientService();
