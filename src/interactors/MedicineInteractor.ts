import { inject, injectable } from "inversify";
import {
  MEDICINE_INTERFACE_TYPE,
} from "../utils/appConst";
import { IMedicineInteractor } from "../interfaces/IMedicine/IMedicineInteractor";
import { Medicine } from "../entities/medicines";
import { IMedicineRepository } from "../interfaces/IMedicine/IMedicineRepository";

@injectable()
export class MedicineInteractor implements IMedicineInteractor {
  private repository: IMedicineRepository;

  constructor(
    @inject(MEDICINE_INTERFACE_TYPE.MedicineRepository)
    repository: IMedicineRepository
  ) {
    this.repository = repository;
  }
  async createMedicine(details: Partial<Medicine>): Promise<Medicine> {
    return this.repository.create(details);
  }

  async updateMedicine(
    condition: any,
    details: Partial<Medicine>
  ): Promise<Medicine | null> {
    console.log('updateMedicine => condition ', condition)
    console.log('updateMedicine => details ', details)
    return this.repository.update(condition, details);
  }

  async getAllMedicine(condition: any): Promise<Medicine[]> {
    return this.repository.findAll(condition);
  }

  async getMedicine(condition: any): Promise<Medicine | null> {
    return this.repository.find(condition);
  }

  // async getTiggerMedicineRecurring(condition: any): Promise<any> {
  //   return this.repository.findAllRecurring(condition);
  // }

  async getTiggerMedicine(condition: any): Promise<any> {
    return this.repository.findAllMedicion(condition);
  }
}
