import { injectable } from "inversify";
import { Model } from "mongoose";
import { CustomError } from "../utils/error";
import { IMedicineRepository } from "../interfaces/IMedicine/IMedicineRepository";
import { Medicine, MedicineModel } from "../entities/medicines";
import moment from "moment";

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
    console.log("condition => ", condition);
    console.log("details => ", details);
    return await this.repository.findByIdAndUpdate(condition, details);
  }

  async find(condition: any): Promise<Medicine | null> {
    return await this.repository.findOne(condition).lean();
  }

  async findAll(condition: any): Promise<Medicine[]> {
    return await this.repository.find(condition);
  }

  // async findAllRecurring(condition: any): Promise<Medicine[]> {
  //   const conditions: any = {
  //     date: { $lte: moment().format("DD-MM-YYYY") },
  //     endDate: { $gte: moment().format("DD-MM-YYYY") },
  //     time: {
  //       $gte: moment().format("hh:mm A"),
  //       $lt: moment().add(1, "minute").format("hh:mm A"),
  //     },
  //     asDone: false,
  //     type: "recurring",
  //   };
  //   console.log("condition => ", conditions);
  //   let queryBuilder = this.repository.find(conditions);
  //   if (condition.skip !== undefined)
  //     queryBuilder = queryBuilder.skip(condition.skip);
  //   if (condition.limit !== undefined)
  //     queryBuilder = queryBuilder.limit(condition.limit);
  //   return await queryBuilder;
  // }

  async findAllMedicion(condition: any): Promise<Medicine[]> {
    const conditions: any = {};
    if (condition.date) conditions.date = condition.date;
    if (condition.endDate) conditions.endDate = condition.endDate;
    if (condition.time) conditions.time = condition.time;
    // console.log("condition => ", conditions);
    const aggregationPipeline: any[] = [
      { $match: conditions },
      {
        $lookup: {
          from: "users",
          let: { userId: { $toObjectId: "$userId" } }, // Convert userId to ObjectId
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$userId"] } } }, // Match userId with _id
          ],
          as: "users",
        },
      },
      { $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true } }, // Keep null if no match (left join)
    ];
    // let queryBuilder = this.repository.find(conditions).populate("userId");
    if (condition.skip !== undefined) {
      aggregationPipeline.push({ $skip: condition.skip });
    }
    // queryBuilder = queryBuilder.skip(condition.skip);
    if (condition.limit !== undefined) {
      aggregationPipeline.push({ $limit: condition.limit });
    }

    // queryBuilder = queryBuilder.limit(condition.limit);
    // return await queryBuilder;
    return await this.repository.aggregate(aggregationPipeline);
  }
}
