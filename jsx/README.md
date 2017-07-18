### JSX Helpers
JSX control-flow helper functions

```jsx
import { $if, $else, $foreach } from "./jsx-helpers.tsx"

let condition = true;

<div>
  {$if(condition,
    <ul>
      {$foreach([1, 2, 3], item =>
        <li data-id={item}></li>
      )}
    </ul>,
  $else(
    <span></span>
  ))}
</div>;
```