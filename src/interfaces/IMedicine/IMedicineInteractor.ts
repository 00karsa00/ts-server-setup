import { Medicine } from "../../entities/medicines";

export interface IMedicineInteractor {
  createMedicine(details: Partial<Medicine>): Promise<Medicine>;
  updateMedicine(
    condition: any,
    details: Partial<Medicine>
  ): Promise<Medicine | null>;
  getAllMedicine(condition: any): Promise<Medicine[]>;
  getMedicine(condition: any): Promise<Medicine | null>;
  // getTiggerMedicineRecurring(condition: any): Promise<any>;
  getTiggerMedicine(condition: any): Promise<any>;
}
