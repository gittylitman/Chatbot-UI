import { v4 as uuidv4 } from 'uuid';

export function generateId(prefix: string): string {
  const cleanUUID = uuidv4().replaceAll('-', '');
  const dbEntitiesId = process.env.DB_ENTITIES_ID;
  if (dbEntitiesId) {
    return `${prefix}_${dbEntitiesId}_${cleanUUID}`;
  }
  return `${prefix}_${cleanUUID}`;
}
