import * as qs from "qs";

type HttpVerb = "GET" | "POST" | "PUT" | "DELETE";

export interface FetchError extends Error {
  statusCode: number;
  statusText: string;
  response: Response;
}

export function fetchJson(url: string, data?: Object, method?: HttpVerb): Promise<void>;
export function fetchJson<TResponse>(url: string, data?: Object, method?: HttpVerb): Promise<TResponse>;

/**
 * Fetch JSON from specified URL or throw FetchError.
 * @throws {FetchError}
 */
export function fetchJson(url: string, data?: Object, method: HttpVerb = "GET") {
  const init = {
    method: method,
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      //this is needed by HttpRequestBase.IsAjaxRequest
      "X-Requested-With": "XMLHttpRequest"
    }
  } as RequestInit;

  if (data) {
    if (method === "GET" || method === "DELETE") {
      url += "?" + qs.stringify(data);
    } else if (method === "POST" || method === "PUT") {
      Object.assign(init.headers, {
        "Content-Type": "application/json"
      });
      init.body = JSON.stringify(data);
    }
  }

  return fetch(url, init).then(getJsonOrThrow);
}

export function fetchFormData(url: string, formData: FormData): Promise<void>;
export function fetchFormData<TResponse>(url: string, formData: FormData): Promise<TResponse>;

/**
 * Post FormData to specified URL then read JSON or throw FetchError.
 * @throws {FetchError}
 */
export function fetchFormData(url: string, formData: FormData) {
  return fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      //this is needed by HttpRequestBase.IsAjaxRequest
      "X-Requested-With": "XMLHttpRequest"
    },
    body: formData
  }).then(getJsonOrThrow);
}

function getJsonOrThrow(response: Response) {
  if (response.ok) {
    const contentLength = parseInt(response.headers.get("Content-Length"));
    if (contentLength > 0) {
      return response.json();
    } else {
      return Promise.resolve();
    }
  } else {
    const error = new Error(response.statusText) as FetchError;
    error.statusCode = response.status;
    error.statusText = response.statusText;
    error.response = response;
    throw error;
  }
}
