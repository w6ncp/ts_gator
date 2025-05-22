import { db } from "../index.js";
import { feeds } from "../schema.js";
import { firstOrUndefined } from "../utils.js";

export async function createFeed(
    feedName: string,
    url: string,
    userId: string,
){
    const result = await db
        .insert(feeds)
        .values({
            name: feedName,
            url,
            userId,
        })
        .returning();
    return firstOrUndefined(result);
}

export async function getFeeds() {
    const result = await db.select().from(feeds);
    return result;
}