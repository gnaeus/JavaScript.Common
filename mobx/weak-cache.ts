
import { computed, IComputedValue, IComputedValueOptions } from "mobx";

export class WeakCache<TKey extends object = object, TValue = any> {
  private _weakMap = new WeakMap<object, any>();

  public get<V extends TValue>(key: TKey): V | undefined {
    return this._weakMap.get(key);
  }

  public set(key: TKey, value: TValue): this {
    this._weakMap.set(key, value);
    return this;
  }

  public getOrAdd<K extends TKey, V extends TValue>(key: K, getValue: (key: K) => V): V {
    let value = this._weakMap.get(key);
    if (!value) {
      value = getValue(key);
      this._weakMap.set(key, value);
    }
    return value;
  }
}

export class ComputedCache<TKey extends object = object, TValue = any> {
  private _weakMap = new WeakMap<object, IComputedValue<any>>();

  public get<V extends TValue>(key: TKey): V | undefined {
    const computedValue = this._weakMap.get(key);
    return computedValue && computedValue.get();
  }

  public getOrAdd<K extends TKey, V extends TValue>(key: K, getValue: () => V): V;
  public getOrAdd<K extends TKey, V extends TValue>(
    key: K,
    options: IComputedValueOptions<V>,
    getValue: () => V
  ): V;
  public getOrAdd<K extends TKey, V extends TValue>(
    key: K,
    optionsOrGetValue: any,
    getValue?: () => V
  ) {
    let computedValue = this._weakMap.get(key);
    if (!computedValue) {
      computedValue = getValue
        ? computed(getValue, optionsOrGetValue)
        : computed(optionsOrGetValue);
      this._weakMap.set(key, computedValue);
    }
    return computedValue.get();
  }
}
