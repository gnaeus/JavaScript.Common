import { event, Delegate, EventHandler } from './event';

describe('event', () => {
  class Sender {
    /** @type {Delegate<(sender: this) => void>} */
    onFirst = event();

    /** @type {SenderEventHandler} */
    onSecond = event();
  }

  /** @typedef {EventHandler<SenderEventArgs>} SenderEventHandler */
  class SenderEventArgs { }

  it('should call attached handlers', () => {
    const instance = new Sender();
    let firstCalled = false;
    let secondCalled = false;

    instance.onFirst.attach(sender => {
      firstCalled = true;
      expect(sender).toBe(instance);
    });

    instance.onSecond.attach((sender, args) => {
      secondCalled = true;
      expect(sender).toBe(instance);
      expect(args).toBeInstanceOf(SenderEventArgs);
    });

    instance.onFirst(instance);
    instance.onSecond(instance, new SenderEventArgs());

    expect(firstCalled).toBeTruthy();
    expect(secondCalled).toBeTruthy();
  });

  it('should not call detached handlers', () => {
    const instance = new Sender();
    let firstCalled = false;
    let secondCalled = false;

    const firstHandler = () => { firstCalled = true; };
    const secondHandler = () => { secondCalled = true; };

    instance.onFirst.attach(firstHandler);
    instance.onSecond.attach(secondHandler);

    instance.onFirst.detach(firstHandler);
    instance.onSecond.detach(secondHandler);

    instance.onFirst(instance);
    instance.onSecond(instance, new SenderEventArgs());

    expect(firstCalled).toBeFalsy();
    expect(secondCalled).toBeFalsy();
  });
});
