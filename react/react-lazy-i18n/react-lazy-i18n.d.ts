import { Component, ReactNode, ComponentType } from "react";
/** React Context for user's locale */
export declare const LocaleContext: import("react").Context<string | null>;
/**
 * Translation function
 * @example
 * <div>
 *   {tr("nameKey")}: <input value={name} />
 *   {tr("greetingKey", name) || <span>Hello, {name}!</span>}
 * </div>
 *
 * <div>
 *   {tr`Name`}: <input value={name} />
 *   {tr`Hello, ${name}!`}
 * </div>
 */
export interface Translate {
  /** Find translation by key */
  (key: string, ...values: any[]): any;
  /** ES6 template tag */
  (strings: TemplateStringsArray, ...values: any[]): any;
  /** Current Locale */
  locale: string | null;
  /** Translation Provider */
  Provider: (
    props: {
      children: ReactNode;
    }
  ) => ReactNode;
}
interface Resources {
  [key: string]: string | Function;
}
declare type LoadResources = (
  locale: string | null
) =>
  | Resources
  | Promise<Resources>
  | Promise<{
      default: Resources;
    }>
  | null;
/**
 * React 16.7 Hook for loading translate function
 * @example
 * const tr = useTranslation(lang => import(`./MyComponent.${lang}.jsx`));
 * return <span title={tr`Greeting`}>{tr`Hello, ${name}!`}</span>
 */
export declare function useTranslation(load?: LoadResources): Translate;
interface TranslationProps {
  load?: LoadResources;
  children: (translate: Translate) => ReactNode;
}
/**
 * Component for translating it's descendants
 * @example
 * <Translation load={lang => import(`./MyResource.${lang}.jsx`)}>
 *   {tr => <span title={tr`Greeting`}>{tr`Hello, ${name}!`}</span>}
 * </Translation>
 */
export declare class Translation extends Component<TranslationProps> {
  static contextType: import("react").Context<string | null>;
  static displayName: string;
  _locale: string | null;
  _translate: Translate;
  _forceUpdate: any;
  render(): any;
}
/**
 * HOC that injects `translate` prop
 * @example
 * const MyComponent = ({ name, translate: tr }) => (
 *   <span title={tr`Greeting`}>{tr`Hello, ${name}!`}</span>
 * )
 *
 * @withTranslation(lang => import(`./MyComponent.${lang}.jsx`))
 * class MyComponent extends Component {
 *   render() {
 *     const { name, translate: tr } = this.props;
 *     return <span title={tr`Greeting`}>{tr`Hello, ${name}!`}</span>
 *   }
 * }
 */
export declare function withTranslation(
  load?: LoadResources
): <T extends ComponentType<any>>(Wrapped: T) => WithTranslation<T>;
declare type WithTranslation<T> = T & {
  contextType: typeof LocaleContext;
  WrappedComponent: T;
};
export {
  useTranslation as useTran,
  withTranslation as withTran,
  Translation as Tran
};
