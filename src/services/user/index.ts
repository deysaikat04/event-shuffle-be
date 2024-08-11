import User, { UserInterface } from "../../models/user";

export async function getUserByEmail(email: string) {
  try {
    const result = await User.findOne(
      { email },
      { _id: 1, name: 1, email: 1, password: 1 }
    );
    return result;
  } catch (e) {
    throw e;
  }
}

export async function createUser(user: Partial<UserInterface>) {
  try {
    const result = await User.create(user);
    return result;
  } catch (e) {
    throw e;
  }
}
