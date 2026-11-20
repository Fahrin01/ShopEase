# ShopEase

A simple, responsive e-commerce front-end built with HTML, CSS and vanilla JavaScript.

## Features

- Home page with featured products and shop-by-category section
- Product listing with search, category filter and sorting
- Category pages: Electronics, Fashion, Shoes, Accessories, Home & Living
- Shopping cart saved in the browser (localStorage)
- Login and registration (client-side demo)
- About and Contact pages

## Getting started

No build step is needed. Open `index.html` in a browser, or serve the folder with any static server.

## Project structure

```
├── index.html, products.html, categories.html, cart.html, ...
├── css/style.css
├── js/
│   ├── products.js   # product catalog + rendering, search, filter, sort
│   ├── cart.js       # cart logic
│   ├── auth.js       # login / register
│   └── script.js     # shared navigation and UI behaviour
├── fonts/
└── images/
```

## Product images

Products currently show a neutral placeholder. Add photos to `images/` and set the `image` field for each product in `js/products.js`, e.g. `image: "images/headphones.jpg"`.
