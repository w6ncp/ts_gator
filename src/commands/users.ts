import { readConfig, setUser } from "../config";
import { createUser, getAllUsers, getUserByName } from "../lib/db/queries/users.js";

export async function handlerLogin(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <name>`);
  }

  const userName = args[0];
  const user = await getUserByName(userName);
  if (!user) {
    throw new Error(`User ${userName} not found`);
  }
  setUser(user.name);
  console.log("User switched successfully!");
}

export async function handlerRetister(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <name>`);
  }

  const userName = args[0];
  const user = await createUser(userName);
  if (!user) {
    throw new Error(`User ${userName} not found`);
  }
  setUser(user.name);
  console.log("User created successfully!");
}

export async function handlerUsers(cmdName: string) {
  const users = await getAllUsers();
  const config = readConfig();
  for (const user of users) {
    if (user.name === config.currentUserName) {
      console.log(`* ${user.name} (current)`);
    } else {
      console.log(`* ${user.name}`);
    }
  }
}