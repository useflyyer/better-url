# @flayyer/better-url

> This is not efficient but is practical for our needs.

Wrapper of `URL` class with additional formatting features.

Implements the `URL` class definition but preserves `base`'s path and queryparams when resolving URLs.

```sh
yarn add @flayyer/better-url
```

We recommend using it in conjunction with https://github.com/sindresorhus/normalize-url

## Usage

```ts
import { BetterURL } from "@flayyer/better-url";

const url = new BetterURL("/subpath?q=bye&title=title", "https://example.com/path?q=hello&desc=desc");
console.log(url.format({ protocol: true, hostname: true, pathname: true, search: true }));
// https://example.com/path/subpath?q=bye&title=title&desc=desc
```
