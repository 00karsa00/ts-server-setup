import { Medicine } from "../../entities/medicines";

export interface IMedicineRepository {
  create(data: Partial<Medicine>): Promise<Medicine>;
  update(condition: any, details: Partial<Medicine>): Promise<Medicine | null>;
  find(condition: any): Promise<Medicine | null>;
  findAll(condition: any): Promise<Medicine[]>;
  // findAllRecurring(condition: any): Promise<any>;
  findAllMedicion(condition: any): Promise<any>;
}
