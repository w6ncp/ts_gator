import { createFeed, getFeeds } from "../lib/db/queries/feeds.js";
import { readConfig } from "../config";
import { getUserByName, getAllUsers } from "../lib/db/queries/users";
import { Feed, User } from "../lib/db/schema.js";

export async function handlerAddFeed(cmdName: string, ...args: string[]) {
    if (args.length < 2) {
        throw new Error(`useage: ${cmdName} <feed-name> <url>`);
    }

    const config = readConfig();
    const user = await getUserByName(config.currentUserName);

    if (!user) {
        throw new Error(`User ${config.currentUserName} not found`);
    }

    const [feedName, url] = args.slice(0, 2);

    const feed = await createFeed(feedName, url, user.id);
    if (!feed) {
        throw new Error(`Failed to create feed`);
    }

    console.log("Feed created successfully:");
    printFeed(feed, user);
}

function printFeed(feed: Feed, user: User) {
    console.log(`* ID:         ${feed.id}`);
    console.log(`* Created at: ${feed.createdAt}`);
    console.log(`* Updated at: ${feed.updatedAt}`);
    console.log(`* Name:       ${feed.name}`);
    console.log(`* URL:        ${feed.url}`);
    console.log(`* User:       ${user.name}`);
}

export async function handlerListFeeds(cmdName: string) {
    const feeds = await getFeeds();
    const users = await getAllUsers();

    if (feeds.length === 0) {
        console.log("No feeds found");
        return;
    }
    console.log("Feeds:");
    console.log("=========================");
    for (const feed of feeds) {
        const user = users.find((user) => user.id === feed.userId);
        if (!user) {
            console.log(`* Feed ${feed.id} has no user`);
            continue;
        }
        printFeed(feed, user);
        console.log("=========================");
    }
    console.log(`Total feeds: ${feeds.length}`);
}