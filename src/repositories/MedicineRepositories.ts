import { injectable } from "inversify";
import { Model } from "mongoose";
import { IMedicineRepository } from "../interfaces/IMedicine/IMedicineRepository";
import { Medicine, MedicineModel } from "../entities/medicines";

@injectable()
export class MedicineRepository implements IMedicineRepository {
  private repository: Model<Medicine>;
  constructor() {
    this.repository = MedicineModel;
  }

  async create(data: Medicine): Promise<Medicine> {
    const medicine = new this.repository(data);
    return await medicine.save();
  }

  async update(
    condition: any,
    details: Partial<Medicine>
  ): Promise<Medicine | null> {
    return await this.repository.findByIdAndUpdate(condition, details);
  }

  async find(condition: any): Promise<Medicine | null> {
    return await this.repository.findOne(condition).lean();
  }

  async findAll(condition: any): Promise<Medicine[]> {
    return await this.repository.find(condition);
  }

  async findAllMedicion(condition: any): Promise<Medicine[]> {
    const conditions: any = {};
    if (condition.date) conditions.date = condition.date;
    if (condition.endDate) conditions.endDate = condition.endDate;
    if (condition.time) conditions.time = condition.time;
    const aggregationPipeline: any[] = [
      { $match: conditions },
      {
        $lookup: {
          from: "users",
          let: { userId: { $toObjectId: "$userId" } }, 
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$userId"] } } }, 
          ],
          as: "users",
        },
      },
      { $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true } }, 
    ];
    if (condition.skip !== undefined) {
      aggregationPipeline.push({ $skip: condition.skip });
    }
    if (condition.limit !== undefined) {
      aggregationPipeline.push({ $limit: condition.limit });
    }
    return await this.repository.aggregate(aggregationPipeline);
  }
}
