var baseSubscribe = ko.subscribable.fn.subscribe;
ko.subscribable.fn.subscribe = function (callback, context, event) {
  var paused = false;
  var pause = function () { paused = true; };
  var resume = function () { paused = false; };
  var newCallback = function () {
    if (!paused) {
      return callback.apply(this, arguments);
    }
  };
  var subscription = baseSubscribe.call(this, newCallback, context, event);
  if (ko.options.deferUpdates) {
    subscription.pause = function () { ko.tasks.schedule(pause); };
    subscription.resume = function () { ko.tasks.schedule(resume); };
  } else {
    subscription.pause = pause;
    subscription.resume = resume;
  }
  return subscription;
};