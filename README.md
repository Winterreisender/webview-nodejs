# webview-nodejs

![npm type definitions](https://img.shields.io/npm/types/webview-nodejs?label=%20&logo=typescript&logoColor=white)
[![npm version](https://img.shields.io/npm/v/webview-nodejs)](https://www.npmjs.com/package/webview-nodejs)
![npm (tag)](https://img.shields.io/npm/v/webview-nodejs/next)
![npm bundle size (version)](https://img.shields.io/bundlephobia/min/webview-nodejs/latest)
![npm download](https://img.shields.io/npm/dt/webview-nodejs)
![last commit](https://img.shields.io/github/last-commit/Winterreisender/webviewko)
![license](https://img.shields.io/github/license/Winterreisender/webviewko?color=3DA639)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FWinterreisender%2Fwebview-nodejs.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2FWinterreisender%2Fwebview-nodejs?ref=badge_shield)

English | [中文(简体)](docs/README.zh-Hans.md)

A Node.js binding and wrapper for [webview](https://github.com/webview/webview), a tiny cross-platform webview library to build modern cross-platform desktop GUIs using WebKit (Gtk/Cocoa) and Edge (Windows).

![screenshot](docs/screenshot/screenshot.webp)

## Getting Started

0. Prerequisites

Node.js `>= 12.22.0`  
Windows: [Webview 2 Runtime](https://developer.microsoft.com/en-us/microsoft-edge/webview2/)  
Linux: [webkitgtk2](https://webkitgtk.org/)


1. Install webview-nodejs

```shell
npm install webview-nodejs==0.1.3
```

2. Import and use webview

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
- [API Reference](https://winterreisender.github.io/webview-nodejs/tsdoc/index.html)
- [Examples](https://github.com/Winterreisender/webview-nodejs/tree/master/test/)
- [webview.dev](https://webview.dev/)
- [Limitations and Workarounds](https://github.com/Winterreisender/webview-nodejs/wiki/Limitations-and-Workarounds)

## Supported Platforms

Build-in support:

- win32 x64
- linux x64
- osx x64 and aarch64

By loading lib manully, other architectures could be supported, you could find them [here](https://github.com/Winterreisender/webview-xmake/releases). Only windows-x64 and linux-x64 are tested.

For more information, see [Prerequisites](https://github.com/Winterreisender/webview-nodejs/wiki/Tutorial#prerequisites).

## Contribution

All suggestions, pull requests, issues, discussions and other contributions are welcome and appreciated.

```plaintext
Developer Certificate of Origin Version 1.1
Copyright (C) 2004, 2006 The Linux Foundation and its contributors.
Everyone is permitted to copy and distribute verbatim copies of this
license document, but changing it is not allowed.

Developer's Certificate of Origin 1.1

By making a contribution to this project, I certify that:
(a) The contribution was created in whole or in part by me and I
    have the right to submit it under the open source license
    indicated in the file; or
(b) The contribution is based upon previous work that, to the best
    of my knowledge, is covered under an appropriate open source
    license and I have the right under that license to submit that
    work with modifications, whether created in whole or in part
    by me, under the same open source license (unless I am
    permitted to submit under a different license), as indicated
    in the file; or
(c) The contribution was provided directly to me by some other
    person who certified (a), (b) or (c) and I have not modified
    it.
(d) I understand and agree that this project and the contribution
    are public and that a record of the contribution (including all
    personal information I submit with it, including my sign-off) is
    maintained indefinitely and may be redistributed consistent with
    this project or the open source license(s) involved.
```

## Credits

| Project                                                                   | License                                                                             |
| ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| [webview](https://github.com/webview/webview)                                | [MIT](https://github.com/webview/webview/blob/master/LICENSE)                          |
| [webview_deno](https://github.com/webview/webview_deno)                      | [MIT](https://github.com/webview/webview_deno/blob/master/LICENSE)                     |
| [koffi](https://koffi.dev/)                                                  | [MIT](https://github.com/Koromix/rygel/blob/master/LICENSE.txt)                        |
| [Microsoft Webview2](https://www.nuget.org/packages/Microsoft.Web.WebView2/) | [BSD-style](https://www.nuget.org/packages/Microsoft.Web.WebView2/1.0.1245.22/License) |

# License

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
