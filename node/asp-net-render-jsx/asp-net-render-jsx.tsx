import * as React from "react";
import { renderToString } from "react-dom/server";

export const render = view => (resolve, ...args) => {
  resolve(null, renderToString(view(...args)));
};

export const globals = vars => (
  <script
    dangerouslySetInnerHTML={{
      __html: Object.keys(vars)
        .map(key => `window.${key} = ${JSON.stringify(vars[key])};`)
        .join("")
    }}
  />
);
