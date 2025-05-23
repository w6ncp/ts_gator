import { getNextFeedToFetch, markFeedFetched } from "../lib/db/queries/feeds.js";
import { fetchFeed } from "../lib/rss.js";
import { parseDuration } from "../lib/time.js";
import { Feed, NewPost } from "../lib/db/schema.js";
import { createPost, getPostByUrl } from "../lib/db/queries/posts.js";

export async function handlerAgg(cmdName: string, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <time_between_requests>`);
    }

    const timeArg = args[0];
    const timeBetweenRequests = parseDuration(timeArg);
    if (!timeBetweenRequests) {
        throw new Error(`invalid duration: ${timeArg} - use format 1h, 30m, 15s, or 3500ms`);
    }

    console.log(`Collecting feeds every ${timeArg}...`);

    scrapeFeeds().catch(handleError);

    const interval = setInterval(() => {
        scrapeFeeds().catch(handleError);
    }, timeBetweenRequests);

    await new Promise<void>((resolve) => {
        process.on("SIGINT", () => {
            console.log("Shutting down feed aggregator...");
            clearInterval(interval);
            resolve();
        });
    });
}

async function scrapeFeeds() {
    const feed = await getNextFeedToFetch();
    if (!feed) {
        console.log("No feeds to fetch");
        return;
    }
    console.log("==========================");
    console.log(`Found a feed to fetch: ${feed.name}`);
    console.log("--------------------------");
    scrapeFeed(feed);
}

async function scrapeFeed(feed: Feed) {
  await markFeedFetched(feed.id);

  const feedData = await fetchFeed(feed.url);

  for (let item of feedData.channel.item) {
    // Check if the post already exists
    const existingPost = await getPostByUrl(item.link);
    if (existingPost) {
      console.log(`Post already exists: ${item.title}`);
      continue;
    }

    // Create a new post
    console.log(`Found Post: ${item.title}`);
    const now = new Date();
    await createPost({
      url: item.link,
      feedId: feed.id,
      title: item.title,
      createdAt: now,
      updatedAt: now,
      description: item.description,
      publishedAt: new Date(item.pubDate),
    } satisfies NewPost);
  }

  console.log(`Feed ${feed.name} collected, ${feedData.channel.item.length} posts found`);
}

async function handleError(err: Error) {
    console.error(
        `Error scrapting feeds: ${err instanceof Error ? err.message : err}`,
    )
}