### [Демо](https://codesandbox.io/s/ypmx3nq3l9)

## Локализация

Локаль пользователя задается с помощью `LocaleContext` в формате RFC 3066 (`en-US`, `ru-RU`, `kk-KZ`, etc.).
```jsx
import { LocaleContext } from "react-lazy-i18n";

const App = () => (
  <LocaleContext.Provider value="ru-RU">
    {/* ... */}
  </LocaleContext.Provider>
);
```

### Локализация React компонентов

Допустим, нам нужно локализовать компонент `<UserProfile>`:

```jsx
class UserProfile extends React.Component {
  render() {
    const { firstName, lastName } = this.props;
    return (
      <article>
        Hello, {firstName}!
        <div>First Name: {firstName}</div>
        <div>Last Name: {lastName}</div>
        <footer>
          Full Name: {firstName} {lastName}
        </footer>
      </article>
    );
  }
}
```

1.  Создаем файл с переводами`./UserProfile.ru-RU.jsx`:

```jsx
export default {
  "First Name": "Имя",
  "Last Name": "Фамилия",
  "Hello, ${firstName}!": firstName => `Привет, ${firstName}!`,
  footer: (firstName, lastName) => (
    <footer>
      Полное Имя: {firstName} {lastName}
    </footer>
  )
};
```

Файл переводов экспортирует JavaScript-объект, значениями которого являются строки и функции,
возвращающие строки или даже JSX разметку.

2.  Используем HOC `withTranslation()`, который внедряет функцию перевода в свойство `tr`:

```jsx
import { withTranslation } from "react-lazy-i18n";

@withTranslation(lang =>
  import(/* webpackChunkName: "i18n-" */ `./UserProfile.${lang}.jsx`)
)
class UserProfile extends React.Component {
  render() {
    const { tr, firstName, lastName } = this.props;
    return (
      <article>
        {tr`Hello, ${firstName}!`}
        <div>
          {tr`First Name`}: {firstName}
        </div>
        <div>
          {tr`Last Name`}: {lastName}
        </div>
        {tr("footer", firstName, lastName) || (
          <footer>
            Full Name: {firstName} {lastName}
          </footer>
        )}
      </article>
    );
  }
}
```

HOC `withTranslation()` принимает функцию, которая при изменении локали динамически подгружает запрошенный перевод.
С помощью `webpackChunkName` все переводы по одному языку складываются в один бандл и подгружаются по требованию.

Функция перевода `tr` работает в даух режимах:

* Как ES6 template tag она вычисляет ключ и аргументы для локализации на основе шаблона. А если ключ отсутствует в файле перевода, то сам ES6 шаблон используется как fallback.
* Как обычная функция, она использует первый аргумент в качестве ключа, а остальные — как аргументы для найденного шаблона перевода. Если ключ отсутствует в файле перевода, то возвращается `null`.

Также функция `tr` имеет свойство `tr.locale`, содержащее текущую локаль, и свойство `Provider` для распростарения перевода вних по дереву компонентов.

Переводы вышестоящего компонента доступны в компонентах вниз по Virtual DOM дереву, для которых в HOC `withTranslation()` не указана функция загрузки перевода. Пример:

```jsx
// UserProfile.jsx
import { withTranslation } from "react-lazy-i18n";

@withTranslation(lang =>
  import(/* webpackChunkName: "i18n-" */ `./UserProfile.${lang}.jsx`)
)
class UserProfile extends React.Component {
  render() {
    return <UserProfileHeader />;
  }
}
```

```jsx
// UserProfileHeader.jsx
import { withTranslation } from "react-lazy-i18n";

@withTranslation()
class UserProfile extends React.Component {
  render() {
    const { tr } = this.props;
    return <div>{tr`Hello!`}</div>;
  }
}
```

3. Вместо HOC `withTranslation` можно использовать Hook `useTranslation()` или Render Callback `<Translation>`:

```jsx
// UserProfile.jsx
import { useTranslation, Translation } from "react-lazy-i18n";

const UserProfile = props => {
  const tr = useTranslation(lang => import(`./UserProfile.${lang}.jsx`));

  return <div>{tr`Hello!`}</div>;
};

const UserProfile = props => (
  <Translation load={lang => import(`./UserProfile.${lang}.jsx`)}>
    {tr => <div>{tr`Hello!`}</div>}
  </Translation>
);
```
