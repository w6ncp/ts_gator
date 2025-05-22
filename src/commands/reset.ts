import { deleteAllUsers } from "../lib/db/queries/users";
import { deleteAllFeeds } from "../lib/db/queries/feeds.js";

export async function handlerReset(cmdName: string) {
    await deleteAllUsers();
    await deleteAllFeeds();
    console.log("Database fully reset!");
}