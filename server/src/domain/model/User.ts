/**
 * Describes registered user
 */
export interface User {
  /**
   * The unique string identifying the user
   */
  id: string;

  /**
   * Name of this user
   */
  username: string;

  /**
   * Full URL of the user avatar image
   */
  avatarUrl: string;
}
