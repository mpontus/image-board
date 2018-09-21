/**
 * Describes a page of entities of type T
 */
export interface Page<T> {
  total: number;
  items: T[];
}
