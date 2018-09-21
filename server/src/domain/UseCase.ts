/**
 * Describes a use case
 */
export interface UseCase<Params, Result> {
  /**
   * Executes business logic
   */
  execute(params: Params): Promise<Result>;
}
