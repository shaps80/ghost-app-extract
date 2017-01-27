# ghost-app-extract

Ghost app to enable better excerpt generation.

This app allows you to use the <extract> keyword to mark the portion of the text you would like to use for the excerpt. See below for usage examples.

The value can then be retrieved as such: `{{extract}}`

## Example 1

> Post content

This **WILL** be included in the excerpt for this post.

`<extract />`

This will **NOT** be included!

> `post.hbs`

```handlebars
<div>{{extract}}</div>
```

## Example 2

> Post content

This will **NOT** included in the excerpt for this post.

`<extract>`
This **WILL** be included!
`</extract>`

> `post.hbs`

```handlebars
<div>{{extract}}</div>
```

## Installation

Use this area to talk about how to add this 'app' to your Ghost installation.


