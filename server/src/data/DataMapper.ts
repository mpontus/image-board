/**
 * Generic mapper which transforms entity of one type to another
 */
export interface DataMapper<T, S> {
  transform(data: T): S;
}
