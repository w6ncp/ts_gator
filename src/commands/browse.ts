import { User } from "../lib/db/schema.js";
import { getPostsForUsers } from "../lib/db/queries/posts.js";

export async function handlerBrowse(cmdName: string, user: User, ...args: string[]) {
  let limit = 2;
  if (args.length === 1) {
    let specifiedlimit = parseInt(args[0]);
    if (specifiedlimit) {
      limit = specifiedlimit;
    } else {
      throw new Error(`usage: ${cmdName} [limit]`);
    }
  }

  const posts = await getPostsForUsers(user.id, limit);
  if (!posts || posts.length === 0) {
    console.log(`No posts found for user ${user.name}`);
    return;
  }
  console.log(`Found ${posts.length} posts for user ${user.name}`);
  console.log("==========================");
  for (let post of posts) {
    console.log(`${post.publishedAt} from ${post.feedName}`);
    console.log(`--- ${post.title} ---`);
    console.log(`    ${post.description}`);
    console.log(`Link: ${post.url}`);
    console.log("==========================");
  }
}