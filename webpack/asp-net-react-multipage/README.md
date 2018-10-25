# Webpack

см. `webpack.config.js` и `tsconfg.json`

* Webpack рекурсивно обходит каталог `~/Views` и находит все пары файлов
  вида (`[ViewName].cshtml`, `[ViewName].js`) у которых совпадает имя файла.
  Каждая такая пара является отдельной точкой входа (entry) для Webpack.
  Для JavaScript-точек входа также допускаются расширения `.jsx`, `.ts` и `.tsx`.

* Затем Webpack создает бандлы в папке `~/wwwroot`. Именем каждого бандла является
  путь к его точке входа `[ViewName].js` относительно папки `~/Views`.

* На странице `[ViewName].cshtml` вручную прописывается путь к созданному бандлу
  и скрипт загрузки полифиллов из CDN `cdn.polyfill.io`. Она предоставляет полифиллы
  специфичные для каждого браузера на основе его `User-Agent`. Также в `<head>` страницы
  вручную добавляется атрибут `root-url`, содержащий `@Url.Content("~")`.

* Webpack обрабатывает JavaScript, TypeScript и JSX код, CSS и Sass стили, а также
  статические картинки и шрифты.

* Каждая JavaScript точка входа должна импортировать файл `~/ClientApp/Environment.js`,
  который содержит настройки `__webpack_public_path__` (для динамической загрузки модулей Webpack),
  TypeScript runtime и общие CSS-стили.

* Исходный Javascript-код должен находиться в папках `~/ClientApp` или `~/Views`. При этом локальные
  JS-модули можно импортировать не только по отнисительному пути, но и по абсолютному пути начиная от `~/ClientApp`.
  https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping

* В скриптах доступны пременные `process.env.NODE_ENV: "development" | "productiuon"`
  и `DEBUG: boolean` для условной компиляции.

### Пример

```
├───[ClientApp]
│   ├───[Components]
│   │   ├───MyComponent.scss
│   │   └───MyComponent.tsx
│   │
│   └───Environment.js
│
├───[Views]
│   └───[Home]
│       ├───Index.cshtml <<< cshtml точка входа
│       └───Index.tsx    <<< js точка входа
│
└───[wwwroot]
    └───[Home]
        └───Index.js <<< полученный бандл
```

#### Index.cshtml

```html
<html>
<head root-url="@Url.Content("~")">
  <script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=es6,fetch,Array.prototype.includes,Object.values,Object.entries"></script>
</head>
<body>
  <div id="container"></div>
  <script src="~/wwwroot/Home/Index.js"></script>
</body>
</html>
```

#### Index.tsx

```js
import "Environment"; // ~/ClientApp/Environment.ts
import React from "react";
import ReactDOM from "react-dom";
import { MyComponent } from "Components/MyComponent"; // ~/ClientApp/Components/MyComponent.tsx

ReactDOM.render(<MyComponent />, document.getElementById("container"));
```
