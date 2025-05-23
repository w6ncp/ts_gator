import { db } from '../index.js';
import { users } from '../schema.js';
import { eq } from 'drizzle-orm';
import { firstOrUndefined } from '../utils.js';

export async function createUser(name: string) {
  const [result] = await db
    .insert(users)
    .values({ name: name })
    .returning();
  return result;
}

export async function getUserByName(name: string) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.name, name));
  return firstOrUndefined(result);
}

export async function deleteAllUsers() {
  await db.delete(users);
  console.log('All users deleted successfully');
}

export async function getAllUsers() {
  const result = await db.select().from(users);
  return result;
}