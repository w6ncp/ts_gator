import { createFeedFollow, getFeedFollowsByUserId, deleteFeedFollow } from "../lib/db/queries/feed_follows.js";
import { getFeedByURL } from "../lib/db/queries/feeds.js";
import { User } from "../lib/db/schema";

export async function handlerFollowFeed(cmdName: string, user: User, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <feed-url>`);
    }

    const feedURL = args[0];
    const feed = await getFeedByURL(feedURL);
    if (!feed) {
        throw new Error(`Feed ${feedURL} not found`);
    }

    const feedFollow = await createFeedFollow(feed.id, user.id);
    if (!feedFollow) {
        throw new Error(`Failed to follow feed`);
    }
    console.log("Feed followed successfully!");
    printFeedFollow(user.name, feedFollow.feedName);
}

export async function handlerListFeeds(cmdName: string, user: User, ...args: string[]) {
    const feeds = await getFeedFollowsByUserId(user.id);
    if (!feeds || feeds.length === 0) {
        console.log(`No feeds found for user ${user.name}`);
        return;
    }
    console.log(`Feeds for user ${user.name}:`);
    console.log("==========================");
    for (const feed of feeds) {
        console.log(`* ID:         ${feed.id}`);
        console.log(`* Created at: ${feed.createdAt}`);
        console.log(`* Updated at: ${feed.updatedAt}`);
        console.log(`* Name:       ${feed.feedName}`);
        console.log(`* URL:        ${feed.feedUrl}`);
        console.log("==========================");
    }
    console.log(`Total feeds: ${feeds.length}`);
}

export function printFeedFollow(userName: string, feedName: string){
    console.log(`* User:       ${userName}`);
    console.log(`* Feed:       ${feedName}`);
}

export async function handlerUnfollowFeed(cmdName: string, user: User, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <feed-url>`);
    }

    const feedURL = args[0];
    const feed = await getFeedByURL(feedURL);
    if (!feed) {
        throw new Error(`Feed ${feedURL} not found`);
    }
    await deleteFeedFollow(user.id, feed.id);
    console.log("Feed unfollowed successfully!");
}