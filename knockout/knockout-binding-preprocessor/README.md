<h3> Attribute binding preprocessor for KnockoutJS </h3>

Example
```html
<div ko-if="myVariable"></div>             =>    <div data-bind="if: myVariable"></div>
<div ko-foreach="[1, 2, 3]"></div>         =>    <div data-bind="foreach: [1, 2, 3]"></div>
<input ko-value="myObservable"/>           =>    <input data-bind="value: myObservable"/>
<span ko-text="myVariable"></span>         =>    <span data-bind="text: myVariable"></span>
<span ko-css="{ 'active': false }"></span> =>    <span data-bind="css: { 'active': false }"></span>
```

<h4>Warning!</h4>
Since HTML is case inseisitive the attribute bindings are also case insensitive.<br>
So only lower case (not camel case) bindings will work.

```html
<div ko-customBinding="..."></div> <!-- BAD -->
<div ko-custombinding="..."></div> <!-- GOOD -->
```