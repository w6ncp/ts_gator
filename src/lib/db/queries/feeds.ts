import { db } from "../index.js";
import { feeds } from "../schema.js";
import { eq } from 'drizzle-orm';
import { firstOrUndefined } from "../utils.js";

export async function createFeed(
    feedName: string,
    url: string,
){
    const result = await db
        .insert(feeds)
        .values({
            name: feedName,
            url,
        })
        .returning();
    return firstOrUndefined(result);
}

export async function getFeeds() {
    const result = await db.select().from(feeds);
    return result;
}

export async function getFeedByURL(url: string) {
    const result = await db
        .select()
        .from(feeds)
        .where(eq(feeds.url, url));
    return firstOrUndefined(result);
}

export async function deleteAllFeeds() {
    await db.delete(feeds);
    console.log('All feeds deleted successfully');
}

export async function markFeedFetched(feedId: string) {
    const result = await db
        .update(feeds)
        .set({ 
            lastFetchedAt: new Date(),
            updatedAt: new Date(),
        })
        .where(eq(feeds.id, feedId))
        .returning();
    return firstOrUndefined(result);
}