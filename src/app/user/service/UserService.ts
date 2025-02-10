import {txProcess} from "@lib/db";
import User from "@user/entity/User";

export async function addUser({
    name,
  }: {
    name: string;
  }) {
    return await txProcess(async manager => {
      const repository = manager.getRepository(User);
      const user = await repository.save({name});
      return user;
    });
  }