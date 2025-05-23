import { createFeed } from "../lib/db/queries/feeds.js";
import { createFeedFollow } from "../lib/db/queries/feed_follows.js";
import { User, Feed } from "../lib/db/schema.js";
import { printFeedFollow } from "./feedFollows.js";

export async function handlerAddFeed(cmdName: string, user: User, ...args: string[]) {
    if (args.length < 2) {
        throw new Error(`useage: ${cmdName} <feed-name> <url>`);
    }

    const [feedName, url] = args.slice(0, 2);

    const feed = await createFeed(feedName, url);
    if (!feed) {
        throw new Error(`Failed to create feed`);
    }

    console.log("Feed created successfully!");
    const feedFollow = await createFeedFollow(feed.id, user.id);
    if (!feedFollow) {
        throw new Error(`Failed to follow feed: ${feed.url}`);
    }
    console.log("Feed followed successfully!");
    printFeedFollow(user.name, feedFollow.feedName);
    printFeed(feed);
}

export function printFeed(feed: Feed) {
    console.log(`* ID:         ${feed.id}`);
    console.log(`* Created at: ${feed.createdAt}`);
    console.log(`* Updated at: ${feed.updatedAt}`);
    console.log(`* Name:       ${feed.name}`);
    console.log(`* URL:        ${feed.url}`);
}
