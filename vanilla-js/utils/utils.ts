export function hashCode(str: string): number {
  let hash = 0,
    chr: number;
  if (str.length == 0) {
    return hash;
  }
  for (let i = 0, len = str.length; i < len; ++i) {
    chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

export function normalizeUrl(url: string): string {
  if (typeof url !== "string" || url === "") {
    throw new Error("Argument: url is empty");
  }
  return url.slice(-1) === "/" ? url : url + "/";
}

export function normalizeGuid(guid: string): string {
  return guid.startsWith("{") && guid.endsWith("}") ? guid.substring(1, guid.length - 1) : guid;
}

export function toQueryString(obj: Object, prefix: string = null): string {
  if (typeof obj !== "object") {
    throw new Error("Argument: obj is not an Object");
  }
  if (obj === null) {
    return "";
  }
  return Object.keys(obj)
    .map(key => {
      const name = prefix ? prefix + "[" + key + "]" : key;
      const value = obj[key];
      if (value === void 0) {
        return "";
      }
      if (value instanceof Date) {
        const dateString = (value as Date).toISOString();
        return encodeURIComponent(name) + "=" + encodeURIComponent(dateString);
      }
      if (typeof value !== "object") {
        return encodeURIComponent(name) + "=" + encodeURIComponent(value);
      }
      return toQueryString(value, name);
    })
    .filter(v => v !== "")
    .join("&");
}

//obsolete
export function ensureSuccessStatusCode(response: Response): void {
  if (response.status < 200 || response.status >= 300) {
    const error = new Error(response.statusText);
    error["response"] = response;
    throw error;
  }
}

export function getJsonOrThrow<TResult>(response: Response): Promise<TResult> {
  ensureSuccessStatusCode(response);
  return response.json<TResult>();
}

/**
 * Execute callback only if event is 'Enter' keypress
 */
export function onEnter(data: any, event: KeyboardEvent, callback: (data?: any) => void): boolean {
  const keyCode = event.which ? event.which : event.keyCode;
  if (keyCode === 13) {
    callback(data);
    return false;
  }
  return true;
}

/**
 * Prevent horizontal moving when user selects text
 */
export function preventScrollLeft(event: Event): void {
  (event.target as Element).scrollLeft = 0;
}

/**
 * Prevent all user input to some element and all it's descentants
 */
export function captureUserInput(element: Node, capture: boolean): void {
  ["mousedown", "click", "contextmenu", "focus"].forEach(event => {
    if (capture) {
      element.addEventListener(event, preventInput, true);
    } else {
      element.removeEventListener(event, preventInput, true);
    }
  });
  if (capture) {
    (document.activeElement as HTMLElement).blur();
  }
}

function preventInput(event: Event): void {
  event.stopPropagation();
  event.preventDefault();
  if (event.type === "focus") {
    (event.target as HTMLElement).blur();
  }
}

type Order = "asc" | "desc";
type Expression<T> = (item: T) => any;
type Comparer<T> = (left: T, right: T) => number;

export function makeComparer<T>(expr: Expression<T>, order: Order): Comparer<T>;
export function makeComparer<T>(expr1: Expression<T>, order1: Order, expr2: Expression<T>, order2: Order): Comparer<T>;
export function makeComparer<T>(
  expr1: Expression<T>,
  order1: Order,
  expr2: Expression<T>,
  order2: Order,
  expr3: Expression<T>,
  order3: Order
): Comparer<T>;
/**
 * Create comparer for methods like Array.prototype.sort(...) 
 */
export function makeComparer<T>(...args: any[]): Comparer<T> {
  return (left: T, right: T) => {
    for (let i = 0; i < args.length; i += 2) {
      const expr = args[i] as Expression<T>;
      const order = args[i + 1] as Order;

      const leftVal = expr(left);
      const rightVal = expr(right);

      if (leftVal < rightVal) {
        return order === "desc" ? 1 : -1;
      }
      if (leftVal > rightVal) {
        return order === "desc" ? -1 : 1;
      }
    }
    return 0;
  };
}

export function throttle<T extends Function>(fn: T, immediate = false): T {
  let slice = Array.prototype.slice;
  let frameRequested = false;
  return function() {
    if (frameRequested) return;
    frameRequested = true;

    let args: any[];
    if (immediate) {
      fn.apply(this, arguments);
    } else {
      args = slice.call(arguments);
    }
    requestAnimationFrame(() => {
      frameRequested = false;
      if (!immediate) {
        fn.apply(this, args);
      }
    });
  } as any;
}

/**
 * Get some person's full name from name parts
 */
export function getFullName(person: { FirstName: string; MiddleName?: string; LastName: string }): string {
  let fullName = person.LastName + " " + person.FirstName;
  if (person.MiddleName) {
    fullName += " " + person.MiddleName;
  }
  return fullName;
}

/**
 * Parse string dates in target object and replace them by Date instances
 */
export function convertUtcStringsToDate(target: Object): void {
  if (target !== undefined && target !== null) {
    Object.keys(target).filter(key => key.endsWith("Utc")).forEach(key => {
      let value = target[key];
      if (typeof value === "string") {
        target[key] = new Date(Date.parse(value));
      }
    });
  }
}

/**
 * Async delay for testing
 */
export function delay(msec: number): Promise<void> {
  return new Promise<void>(resolve => setTimeout(resolve, msec));
}

/**
 * Converts UTC time to local time
 * Use when you need to pass local time to the server
 */
export function convertToLocalTime(time?: Date) {
  if (time === undefined || time === null) {
    return null;
  } else {
    const localTime = new Date(time.valueOf());
    localTime.setMinutes(time.getMinutes() - time.getTimezoneOffset());
    return localTime;
  }
}
