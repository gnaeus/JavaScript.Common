interface KnockoutSubscription {
  /** Temporary pause subscription */
  pause(): void;

  /** Resume paused subscription */
  resume(): void;
}