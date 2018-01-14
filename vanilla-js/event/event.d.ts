/** 
 * Factory that creates event function.
 * Which delegates it's execution to list of handlers.
 */
export declare function event<T = (...args: any[]) => void>(): Delegate<T>;

/** Represents a general typed event */
export type Delegate<T> = T & {
  /**
   * Add the specified handler function to the list of event handlers.
   */
  attach(handler: T): void;
  /**
   * Removes handler, previously registered with `.attach()`, from the event handlers list.
   */
  detach(handler: T): void;
}

/** Represents the typed event when the event provides sender and data. */
export type EventHandler<TEventArgs> = Delegate<(
  sender: object,
  eventArgs: TEventArgs,
) => void>;
