function $if(condition: boolean, markup: any, elseMarkup: any = null) {
  return condition ? markup : elseMarkup;
}

function $else(markup: any) {
  return markup;
}

function $foreach<T>(array: T[], callback: (element: T, index: number) => any) {
  return array.map(callback);
}
