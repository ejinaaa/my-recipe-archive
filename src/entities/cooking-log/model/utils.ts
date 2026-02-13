import type { CookingLog, CookingLogDB } from './types';

/**
 * Converts a database cooking log to an application cooking log
 */
export const toCookingLog = (dbLog: CookingLogDB): CookingLog => {
  return {
    id: dbLog.id,
    user_id: dbLog.user_id,
    recipe_id: dbLog.recipe_id,
    cooked_at: new Date(dbLog.cooked_at),
    created_at: new Date(dbLog.created_at),
  };
};
