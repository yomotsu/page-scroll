# pageScroll

a no-dependency function that page scroll smoothly

[![Latest NPM release](https://img.shields.io/npm/v/page-scroll.svg)](https://www.npmjs.com/package/page-scroll)
![MIT License](https://img.shields.io/npm/l/page-scroll.svg)

## demos

- [basic](https://yomotsu.github.io/page-scroll/examples/basic.html)

## Usage

### as Standalone lib

Copy page-scroll.js from /dist/page-scroll.js and place it in your project.

```
<script src="./js/page-scroll.js"></script>
```

### with NPM

```
$ npm install --save page-scroll
```

then

```
import pageScroll from 'page-scroll';
```

### Applying effects

```html
<button onclick="pageScroll( 500 )">to 500px</button>
<button onclick="pageScroll( document.querySelector( '.target' ) )">to the element</button>
```

## options

`pageScroll` takes options in second argument.

```
pageScroll( 500, {
	duration: 500,
	easing: 'easeOutExpo',
	callback: function () {}
} );
```
