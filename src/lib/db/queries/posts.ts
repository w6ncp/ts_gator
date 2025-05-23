import { feedFollows, feeds, NewPost, posts } from "../schema";
import { db } from '../index.js';
import { desc, eq } from 'drizzle-orm';
import { firstOrUndefined } from "../utils";

export async function createPost(post: NewPost) {
  const [result] = await db
    .insert(posts)
    .values(post)
    .returning();
    return result;
}

export async function getPostsForUsers(userId: string, limit: number = 2) {
  const result = await db
    .select({
      id: posts.id,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
      title: posts.title,
      url: posts.url,
      description: posts.description,
      publishedAt: posts.publishedAt,
      feedId: posts.feedId,
      feedName: feeds.name,
    })
    .from(posts)
    .innerJoin(feedFollows, eq(feedFollows.feedId, posts.feedId))
    .innerJoin(feeds, eq(feeds.id, posts.feedId))
    .where(eq(feedFollows.userId, userId))
    .orderBy(desc(posts.publishedAt))
    .limit(limit);
  return result;
}

export async function getPostByUrl(url: string) {
  const result = await db
    .select()
    .from(posts)
    .where(eq(posts.url, url));
  return firstOrUndefined(result);
}