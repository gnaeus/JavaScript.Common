Add classes `.container-xl` — `.container-sm`. So elements inside
`.container-md` behaves like them satisfy Media Query for `md` units.

```html
<element class="container-md">
  <!-- works like -md regardless of screen size -->
  <element class="col-xl-2 col-md-3" />
</element>
```