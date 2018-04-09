type Constructor<T> = new (...args: any[]) => T;
type Disposable = { dispose(): void };

/** Generic async EventEmitter (requires ES6 Map and Promise) */
export class Event<TFirst = never, TSecond = never, TThird = never> {
  /**
   * @param first Shape of first event argument
   * @param second Shape of second event argument
   * @param third Shape of third event argument
   */
  constructor(
    first?: Constructor<TFirst>,
    second?: Constructor<TSecond>,
    third?: Constructor<TThird>
  );

  /**
   * Call event handlers with specified arguments
   * @param first First event argument
   * @param second Second event argument
   * @param third Third event argument
   * @returns Promise that will be resolved when all handlers finish it's execution
   */
  emit(first?: TFirst, second?: TSecond, third?: TThird): Promise<void>;

  /**
   * Attach handler to event
   * @param handler Function that will be called on each event emitting
   * @returns Disposable token that can detach handler form event
   */
  subscribe(
    handler: (
      first: TFirst,
      second: TSecond,
      third: TThird
    ) => Promise<void> | void
  ): Disposable;
  /**
   * Attach handler to event with specified name
   * @param name Predefied first argument of event
   * @param handler Function that will be called on each event emitting
   * @returns Disposable token that can detach handler form event
   */
  subscribe(
    name: TFirst,
    handler: (second: TSecond, third: TThird) => Promise<void> | void
  ): Disposable;

  /**
   * Detach handler from event
   * @param handler Function that will be called on each event emitting
   */
  unsubscribe(
    handler: (
      first: TFirst,
      second: TSecond,
      third: TThird
    ) => Promise<void> | void
  ): void;
  /**
   * Detach handler from event with specified name
   * @param name Predefied first argument of event
   * @param handler Function that will be called on each event emitting
   */
  unsubscribe(
    name: TFirst,
    handler: (second: TSecond, third: TThird) => Promise<void> | void
  ): void;
}
