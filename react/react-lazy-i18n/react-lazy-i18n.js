// @ts-check
import {
  createElement,
  createContext,
  useContext,
  useRef,
  useReducer
} from "react";

/** @type { import("react").Context<string | null >} */
export const LocaleContext = createContext(null);

/**
 * Get translation function for component.
 * @param {function(string): any} loadResources Translation resource loader
 * @returns {Function & { locale: string, Provider: any }} Translation function
 */
export function useTranslation(loadResources) {
  if (!loadResources) {
    // eslint-disable-next-line
    return useContext(TranslateContext);
  }
  // eslint-disable-next-line
  const locale = useContext(LocaleContext);
  // eslint-disable-next-line
  const localeRef = useRef(null);
  // eslint-disable-next-line
  const translateRef = useRef(emptyTranslate);
  // eslint-disable-next-line
  const forceUpdate = useForceUpdate();

  if (localeRef.current !== locale) {
    localeRef.current = locale;
    const resourcesOrPromise = loadResources(locale);
    if (resourcesOrPromise instanceof Promise) {
      resourcesOrPromise
        .catch(() => null)
        .then(resources => {
          if (localeRef.current === locale) {
            if (resources && isObject(resources.default)) {
              resources = resources.default;
            }
            translateRef.current = makeTranslate(locale, resources);
            forceUpdate();
          }
        });
    } else {
      translateRef.current = makeTranslate(locale, resourcesOrPromise);
    }
  }

  return translateRef.current;
}

/**
 * HOC that injects translation funciton as `tr` prop.
 * @template {import("react").ComponentType<any>} T
 * @param {function(string): any} loadResources Translation resource loader
 * @returns {function(T): T}
 * @example
 * const MyComponent = ({ name, tr }) => (
 *   <span title={tr`Greeting`}>{tr`Hello, ${name}!`}</span>
 * )
 *
 * @withTranslation(lang => import(`./MyComponent.${lang}.jsx`))
 * class MyComponent extends Component {
 *   render() {
 *     const { name, tr } = this.props;
 *     return <span title={tr`Greeting`}>{tr`Hello, ${name}!`}</span>
 *   }
 * }
 */
export function withTranslation(loadResources) {
  // @ts-ignore
  return Wrapped => props => {
    if (!loadResources) {
      const tr = useContext(TranslateContext);
      return createElement(Wrapped, { tr, ...props });
    }
    const tr = useTranslation(loadResources);
    return createElement(
      tr.Provider,
      { value: tr },
      createElement(Wrapped, { tr, ...props })
    );
  };
}

/**
 * Translation function as render callback.
 * @param {Object} props Component props
 * @param {function(string): any} props.load Translation resource loader
 * @param {function(Function): any} props.children Render callback
 * @example
 * <Translation load={lang => import(`./MyResource.${lang}.jsx`)}>
 *   {tr => <span title={tr`Greeting`}>{tr`Hello, ${name}!`}</span>}
 * </Translation>
 */
export function Translation({ load, children }) {
  if (!load) {
    // eslint-disable-next-line
    const tr = useContext(TranslateContext);
    return children(tr);
  }
  // eslint-disable-next-line
  const tr = useTranslation(load);
  return createElement(tr.Provider, { value: tr }, children(tr));
}

export {
  useTranslation as useTran,
  withTranslation as withTran,
  Translation as Tran
};

function useForceUpdate() {
  const [, dispatch] = useReducer(() => ({}), null);
  return () => dispatch(null);
}

const emptyTranslate = makeTranslate(null, null);

const TranslateContext = createContext(emptyTranslate);

function makeTranslate(locale, resources) {
  resources = prepareKeys(resources);

  function tr(keyOrStrings, ...values) {
    const templateKey = isString(keyOrStrings)
      ? keyOrStrings
      : keyOrStrings.join("{*}").replace(/\s+/g, " ");

    const template = resources && resources[templateKey];

    if (isString(template)) {
      return template;
    }
    if (isFunction(template)) {
      return template(...values);
    }
    if (isString(keyOrStrings)) {
      return null;
    }
    return keyOrStrings
      .reduce((array, str, i) => {
        array.push(str, values[i]);
        return array;
      }, [])
      .join("");
  }

  tr.locale = locale;

  tr.Provider = ({ children }) =>
    createElement(TranslateContext.Provider, { value: tr }, children);

  return tr;
}

/** @type {WeakMap<Object, Object> | Map<Object, Object>} */
const resourcesCache =
  typeof WeakMap === "function" ? new WeakMap() : new Map();

function prepareKeys(resources) {
  if (!resources) {
    return resources;
  }

  const cached = resourcesCache.get(resources);
  if (cached) {
    return cached;
  }

  const prepared = {};

  for (const resourceKey in resources) {
    const templateKey = resourceKey
      .replace(/\$\{\s*[A-Za-z0-9_]+\s*\}/g, "{*}")
      .replace(/\s+/g, " ");

    prepared[templateKey] = resources[resourceKey];
  }

  resourcesCache.set(resources, prepared);
  return prepared;
}

const isString = arg => typeof arg === "string";
const isFunction = arg => typeof arg === "function";
const isObject = arg => arg && typeof arg === "object" && !Array.isArray(arg);
