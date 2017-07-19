export function $if(condition: boolean, markup: any, elseMarkup: any = null) {
  return condition ? markup : elseMarkup;
}

export function $else(markup: any) {
  return markup;
}

export function $foreach<T>(array: T[], callback: (element: T, index: number) => any) {
  return array.map(callback);
}
