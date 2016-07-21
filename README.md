# fsearch

> File search

## Install

``bash
$ npm install --save fsearch
```

## Usage

```js
const fsearch = require('fsearch');

fsearch('Google Chrome.app').then(results => {
  console.log(results);
  //=> ['/Applications/Google Chrome.app']  
});

```
## License

MIT © [Vu Tran](https://github.com/vutran/)
