import DataLoader, { BatchLoadFn } from "dataloader";

type ResolverInfo = { fieldName: string; fieldNodes: Object[] } | Object[];
type KeyAttr = <K extends string | number, V>(item: V) => K;

const __dataloader = Symbol();

function dataLoader<K, V>(
  info: ResolverInfo,
  getLoader: () => DataLoader<K, V>
): DataLoader<K, V>;

function dataLoader<K, V>(
  info: ResolverInfo,
  batchLoad: BatchLoadFn<K, V>
): DataLoader<K, V>;

function dataLoader<K extends string | number, V>(
  info: ResolverInfo,
  keyAttr: string | KeyAttr,
  batchLoad: BatchLoadFn<K, V>
): DataLoader<K, V>;

function dataLoader(info, keyAttr, batchLoad?) {
  let loader = info[__dataloader];
  if (!loader) {
    let loadFunc = keyAttr;
    if (batchLoad) {
      const getKey =
        typeof keyAttr === "string" ? item => item[keyAttr] : keyAttr;
      loadFunc = keys => {
        const itemsByKey = new Map(
          batchLoad(keys).map((item, i) => [getKey(item), item])
        );
        return keys.map(key => itemsByKey.get(key));
      };
    }
    loader = loadFunc.length > 0 ? new DataLoader(loadFunc) : loadFunc;
    info[__dataloader] = loader;
  }
  return loader;
}

export default dataLoader;
