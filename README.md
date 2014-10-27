

Paperclip is a very fast template engine for JavaScript. 


### Features

- inline javascript
- compiled templates
- explicit data-binding (one-way, two-way, unbound operators)


### Performance


Paperclip templates are translated from HTML, straight to JavaScript - this also includes data-bindings. For example, here's a template:

```html
hello {{name}}!
```

Here's the templated translated to JavaScript:

```javascript
module.exports = (function(fragment, block, element, text, comment, parser, modifiers) {
  return fragment([text("hello "), block({
    'value': {
      run: function() {
          return this.context.name;
      },
      refs: [ ["name"] ]
    }
  })]);
});
```

Pretty clear what's going on. Here's what we know at a glance:

Generated DOM is identical to the HTML templates. No weird manipulations here.
Data-bindings are identified as the template is created. Note that this happens once for every template. Paperclip takes each translated template, caches them, and uses the browser's native cloneNode() whenever a template is used.
JavaScript references within the templates are identified at translation time, and cached in the data-binding.
As it turns out, the method above for generating templates is very efficient. Essentially, paperclip does the least amount of work necessary to update the DOM since it know where everything is.

Paperclip will also lazily batch DOM changes together into one update, and run them on requestAnimationFrame. This kind of optimization is similar to how layout engines work, and helps prevent unnecessary performance penalties in the browser.


### Installation

```
npm install paperclip --save-exact
```

## Template Syntax

#### &#123;&#123; blocks &#125;&#125;

Variable blocks as placeholders for information that might change. For example:


```html
hello {{ name.first }} {{ name.last }}!
```

You can also specify blocks within attributes.

```html
my favorite color is <span style="color: {{color}}">{{color}}</span>
```

Paperclip also supports **inline javascript**. For example:

```html
hello {{ message || "World" }}! <br />
inline-json {{ {'5+10 is':5+10, 'message is defined?' : message ? 'yes' : 'no' } | json }}
```

### Modifiers

Modifiers format data in a variable block. A good example of this might be presenting data to the user depending on their locale, or parsing data into markdown. Here are a few examples of how you can use
modifiers:


```html

Converting content to markdown:

{{ html: content | markdown }}

Uppercasing & converting to markdown:

{{ html: content | uppercase | markdown }}

Modifiers with parameters:

A human that is {{age}} years old is like a {{ age | divide(5.6) }} year old dog!
```


### Binding Operators

Paperclip comes with various binding operators that give you full control over how references are handled. You can easily
specify whether to bind one way, two ways, or not at all. Here's the basic syntax:

```javascript
Two-way binding:
<input class="form-control" data-bind="{{ model: <~>fullName }}" />

Bind input value to fullName only:
<input class="form-control" data-bind="{{ model: ~>fullName }}" />

Bind fullName to input value only:

<input class="form-control" data-bind="{{ model: <~fullName }}" />

Unbound helper - don't watch for any changes:
{{ ~fullName }}
```

### Built-in components

#### &#123;&#123; html: content &#125;&#125;

Similar to escaping content in mustache (`&#123;&#123;&#123;content&#125;&#125;&#125;`). Good for security.

```html
Unsafe:
{{ html: content }} <br />

Safe:
{{ content }} <br />
```

#### &#123;&#123; #if: condition &#125;&#125;

Conditional block helper

```html
<input type="text" class="form-control" placeholder="What's your age?" data-bind="{{ model: <~>age }}"></input>
{{#if: age >= 18 }}
  You're legally able to vote in the U.S.
{{/elseif: age > 16 }}
  You're almost old enough to vote in the U.S.
{{/else}}
  You're too young to vote in the U.S.
{{/}}
```

### data-bind attributes

data-bind attributes are inspired by [knockout.js](http://knockoutjs.com/). This is useful if you want to attach behavior to any DOM element.


#### &#123;&#123; model: context &#125;&#125;

Input data-binding

```html
<input type="text" class="form-control" placeholder="Type in a message" data-bind="{{ model: <~>message }}"></input>
<h3>{{message}}</h3>
```

Notice the `<~>` operator. This tells paperclip to bind both ways. See [binding operators](#binding-operators) for more info.

#### &#123;&#123; event: expression &#125;&#125;

Executed when an event is fired on the DOM element. Here are all the available events:

- `onChange` - called when an element changes
- `onClick` - called when an element is clicked
- `onLoad` - called when an element loads - useful for `&lt;img /&gt;`
- `onSubmit` - called on submit - useful for `&lt;form /&gt;`
- `onMouseDown` - called on mouse down
- `onMouseUp` - called on mouse up
- `onMouseOver` - called on mouse over
- `onMouseOut` - called on mouse out
- `onKeyDown` - called on key down
- `onKeyUp` - called on key up
- `onEnter` - called on enter key up
- `onDelete` - called on delete key up

```html
<input type="text" class="form-control" placeholder="Type in a message" data-bind="{{ onEnter: enterPressed = true, focus: true }}"></input>

{{#if: enterPressed }}
  enter pressed
{{/}}
```


#### &#123;&#123; show: bool &#125;&#125;

Toggles the display mode of a given element. This is similar to the ` &#123;&#123;#if: expression &#125;&#125;` conditional helper.


#### &#123;&#123; css: styles &#125;&#125;

Sets the css of a given element. [For example](http://jsfiddle.net/JTxdM/81/):

```html
how hot is it (fahrenheit)?: <input type="text" class="form-control" data-bind="{{ model: <~>temp }}"></input> <br />

<style type="text/css">
.cool { color: blue;   }
.warm { color: yellow; }
.hot  { color: red;    }
</style>

<strong data-bind="{{
  css: {
    cool    : temp > 0 || !temp,
    warm    : temp > 60,
    hot     : temp > 90
  }
}}">
  {{
    temp > 60 ?
    temp > 90 ? "it's hot" : "it's warm" :
    "it's cool"
  }}
</strong>
```

#### &#123;&#123; style: styles &#125;&#125;

Sets the style of a given element.

```html
color: <input type="text" data-bind="{{ model: <~>color }}" class="form-control"></input> <br />
size: <input type="text" data-bind="{{ model: <~>size }}" class="form-control"></input> <br />
<span data-bind="{{
  style: {
    color       : color,
    'font-size' : size
  }
}}">Hello World</span>
```

#### &#123;&#123; disable: bool &#125;&#125;

Toggles the enabled state of an element.

```html
<button data-bind={{ disable: !formIsValid }}>Sign Up</button>
```

#### &#123;&#123; focus: bool &#125;&#125;

Focuses cursor on an element.

```html
<input data-bind={{ focus: true }}></input>
```

### Basic API


#### paperclip([application])

initializes paperclip with the given application. `Application.main` will be used if this is omitted.

#### paperclip.modifier(modifierName, modifier)

registers a new paperclip modifier within the context of the application. See example above.

#### template paperclip.template(source)

Parses a template.

#### template.bind(context).render()

Binds a template, and returns a document fragment.

**For core paperclip documentation, see [Core API](/docs/core-api)**

<!--
extended API - router docs
-->