# pageScroll

a no-dependency function that page scroll smoothly

[![Latest NPM release](https://img.shields.io/npm/v/page-scroll.svg)](https://www.npmjs.com/package/page-scroll)
![MIT License](https://img.shields.io/npm/l/page-scroll.svg)

## demos

- [basic](https://yomotsu.github.io/page-scroll/examples/basic.html)

## Usage

### with NPM

```shell
$ npm install --save page-scroll
```

then

```shell
import pageScroll from 'page-scroll';
```

### As a Standalone lib

Copy page-scroll.js from /dist/page-scroll.js and place it in your project.

```html
<script src="./js/page-scroll.js"></script>
```

### Applying effects

```html
<button onclick="pageScroll( 500 )">to 500px</button>
<button onclick="pageScroll( document.querySelector( '.target' ) )">to the element</button>
```

## options

`pageScroll` takes options in second argument.

```javascript
pageScroll( 500, {
	duration: 500,
	easing: 'easeOutExpo',
	callback: function () {}
} );
```
