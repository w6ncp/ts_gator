import { deleteAllUsers } from "../lib/db/queries/users";

export async function handlerReset(cmdName: string) {
    await deleteAllUsers();
    console.log("Database fully reset!");
}