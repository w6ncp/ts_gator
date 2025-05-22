import { db } from "../index.js";
import { feedFollows, feeds, users, User } from "../schema.js";
import { eq, and } from 'drizzle-orm';
import { firstOrUndefined } from "../utils.js";
import { getFeedByURL } from "./feeds.js";

export async function createFeedFollow(
    feedId: string,
    userId: string,
) {
    const [feedFollow] = await db
    .insert(feedFollows)
    .values({ feedId, userId});

    const joinedFeedFollow = await db
    .select({
        id: feedFollows.id,
        createdAt: feedFollows.createdAt,
        updatedAt: feedFollows.updatedAt,
        feedName: feeds.name,
        feedUrl: feeds.url,
        userName: users.name,
    })
    .from(feedFollows)
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .innerJoin(users, eq(feedFollows.userId, users.id))
    .where(eq(feeds.id, feedId));

    return firstOrUndefined(joinedFeedFollow);
}

export async function getFeedFollowsByUserId(userId: string) {
    const result = await db
        .select({
            id: feedFollows.id,
            createdAt: feedFollows.createdAt,
            updatedAt: feedFollows.updatedAt,
            feedName: feeds.name,
            feedUrl: feeds.url,
            userName: users.name,
        })
        .from(feedFollows)
        .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
        .innerJoin(users, eq(feedFollows.userId, users.id))
        .where(eq(feedFollows.userId, userId));
    return result;
}

export async function deleteFeedFollow(
    userId: string,
    feedId: string,
){
    await db
    .delete(feedFollows)
    .where(and(
        eq(feedFollows.userId, userId),
        eq(feedFollows.feedId, feedId)
    ));
}