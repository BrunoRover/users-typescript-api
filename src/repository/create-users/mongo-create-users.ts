import { MongoClient } from "../../database/mongo";
import { User } from "../../models/user";
import {
  CreateUserParams,
  ICreateRepository,
} from "../../controllers/create-user/protocols";
import { MongoUser } from "../mongo-protocols";

export class MongoCreateUserRepository implements ICreateRepository {
  async createUser(params: CreateUserParams): Promise<User> {
    const { insertedId } = await MongoClient.db
      .collection("users")
      .insertOne(params);

    const user = await MongoClient.db
      .collection<MongoUser>("users")
      .findOne({ _id: insertedId });

    if (!user) {
      throw new Error("User not created");
    }

    const { _id, ...rest } = user;
    return { id: _id.toHexString(), ...rest };
  }
}
