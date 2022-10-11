# webview-nodejs

[![npm](https://img.shields.io/npm/v/webview-nodejs)](https://www.npmjs.com/package/webview-nodejs) ![npm bundle size (version)](https://img.shields.io/bundlephobia/min/webview-nodejs/latest) ![npm](https://img.shields.io/npm/dt/webview-nodejs)
![last commit](https://img.shields.io/github/last-commit/Winterreisender/webviewko)
![license](https://img.shields.io/github/license/Winterreisender/webviewko?color=3DA639)
![npm type definitions](https://img.shields.io/npm/types/webview-nodejs?label=%20&logo=typescript&logoColor=white)

English | [中文(简体)](docs/README.zh-Hans.md) 

A Node.js binding to [webview](https://github.com/webview/webview), a tiny cross-platform webview library to build modern cross-platform desktop GUIs using [WebView2](https://developer.microsoft.com/en-us/microsoft-edge/webview2/), WebKit and [WebKitGTK](https://webkitgtk.org/).


## Getting Started

1. Install via npm
```shell
npm i webview-nodejs
```
2. Import and use webview
```js
const {Webview} = require('webview-nodejs');

let w = new Webview();
w.title("Hello");
w.size(600,600);
w.navigate("https://example.com");
w.dispatch(()=>{
    w.title("World")
});
w.bind("increment", (w,arg1,arg2)=>{
    w.title(arg1);
    return arg1+arg2;
});
w.show();
```

## Help

- [Documentation](https://winterreisender.github.io/webview-nodejs/tsdoc/index.html)
- [Examples](test/)

## Supported Platforms

Build-in support:

- win32 x64
- linux x64
- osx x64
- osx aarch64

By loading lib manully, other architectures could be supported. osx is not tested.

## Contribution

All suggestions, pull requests, issues and other contributions are welcome and appreciated.

## Credits

| Project | License |
|---|---|
| [webview](https://github.com/webview/webview)                                | [MIT](https://github.com/webview/webview/blob/master/LICENSE)                |
| [webview_deno](https://github.com/webview/webview_deno)                      | [MIT](https://github.com/webview/webview_deno/blob/master/LICENSE)           |
| [node-ffi-napi](https://github.com/node-ffi-napi/node-ffi-napi)              | [MIT](https://github.com/node-ffi-napi/node-ffi-napi/blob/master/LICENSE)    |
| [Microsoft Webview2](https://www.nuget.org/packages/Microsoft.Web.WebView2/) | [BSD-3-Clause](https://www.nuget.org/packages/Microsoft.Web.WebView2/1.0.1245.22/License)     |


# License

Copyright 2022 Winterreisender.

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0  
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  
See the License for the specific language governing permissions and limitations under the License.

SPDX short identifier: **Apache-2.0**

<img src="https://opensource.org/sites/default/files/public/OSIApproved.svg" width="100" />

