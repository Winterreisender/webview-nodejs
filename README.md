# webview-nodejs

[![npm version](https://img.shields.io/npm/v/webview-nodejs)](https://www.npmjs.com/package/webview-nodejs)
![npm bundle size (version)](https://img.shields.io/bundlephobia/min/webview-nodejs/latest)
![npm download](https://img.shields.io/npm/dt/webview-nodejs)
![last commit](https://img.shields.io/github/last-commit/Winterreisender/webview-nodejs)
![license](https://img.shields.io/github/license/Winterreisender/webviewko?color=3DA639)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FWinterreisender%2Fwebview-nodejs.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2FWinterreisender%2Fwebview-nodejs?ref=badge_shield)

English | [中文(简体)](docs/README.zh-Hans.md)

A Node.js binding and wrapper for [webview](https://github.com/webview/webview), a tiny cross-platform webview library to build modern cross-platform desktop GUIs using WebKit (Gtk/Cocoa) and Edge (Windows).

![screenshot](docs/screenshot/screenshot.webp)

## Getting Started

1. Prerequisites

- `Node.js >= 12`
- CMake, you can install it by `winget install Kitware.CMake`, `apt install cmake` or `brew install cmake` (please reopen your console after the installation)
- Windows: [Webview 2 Runtime](https://developer.microsoft.com/en-us/microsoft-edge/webview2/), Visual Studio Build Tools or Visual Studio with C++ support  
- Linux: [webkitgtk2](https://webkitgtk.org/), gcc  
- macOS: XCode  
For more information, see [webview#prerequisites](https://github.com/webview/webview#prerequisites)


2. Install webview-nodejs

```shell
npm install webview-nodejs
```

> v0.4.0 uses new SWIG and NAPI technologies and are not widely tested,
> You can still use webview-nodejs@0.1.5 powered by ffi-api with the same API.

3. Import and use webview

```js
const { Webview } = require('webview-nodejs');

let w = new Webview();
w.title("Hello World");
w.size(800,600);
w.navigate("https://example.com");
w.show();
```

For more examples like interacting between Node.js and webview and more detailed instructions, see [Tutorial](https://github.com/Winterreisender/webview-nodejs/wiki/Tutorial).

## Help

- [Tutorial](https://github.com/Winterreisender/webview-nodejs/wiki/Tutorial)
- [API Reference](https://winterreisender.github.io/webview-nodejs/docs/jsdoc/index.html)
- [Examples](https://github.com/Winterreisender/webview-nodejs/tree/master/test/)
- [webview.dev](https://webview.dev/)
- [Limitations and Workarounds](https://github.com/Winterreisender/webview-nodejs/wiki/Limitations-and-Workarounds)


## Contribution

All suggestions, pull requests, issues, discussions and other contributions are welcome and appreciated.  
[![](https://opencollective.com/Winterreisender/webview-nodejs.svg?width=890&button=false)](https://github.com/Winterreisender/webview-nodejs/graphs/contributors)

## License

```text
Copyright 2022-2023 Winterreisender and other contributors.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
