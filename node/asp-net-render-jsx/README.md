### Controllers/HomeController.cs
```csharp
public async Task<IActionResult> Index([FromServices] INodeServices nodeServices)
{
    string body = await nodeServices.InvokeAsync<string>("./Views/Home/Index.js", model);

    return View("_Layout", body);
}
```

### Views/Home/Index.tsx
```jsx
import * as React from "react";
import { render, globals } from "./asp-net-render-jsx";

module.exports = render(model => (
  <body>
    <h1>This is JSX</h1>

    <section>
      <h3>Author: {model.author.name}</h3>
      {model.author.posts.map(post => (
        <article>
          <h2>{post.title}</h2>
          <p>{post.body}</p>
        </article>
      ))}
    </section>

    {globals({ model })}
  </body>
));
```

### Result
```html
<body>
  <h1>This is JSX</h1>

  <section>
    <h3>Author: John Doe</h3>
    <article>
      <h2>How to render JSX in ASP.NET Core</h2>
      <p></p>
      <div style="font-size: 20px;">1. Install AspNetCore.NodeServices</div>
      <p></p>
    </article>
  </section>
  
  <script>
    window.model = {
      author: {
        id: 1,
        name: "John Doe",
        posts: [
          {
            id: 0,
            title: "How to render JSX in ASP.NET Core",
            body:
              '<div style="font-size: 16px;">1. Install AspNetCore.NodeServices</div>',
            author: null
          }
        ]
      }
    };
  </script>
</body>
```