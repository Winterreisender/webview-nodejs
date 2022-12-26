# webview-nodejs

![npm type definitions](https://img.shields.io/npm/types/webview-nodejs?label=%20&logo=typescript&logoColor=white)
[![npm](https://img.shields.io/npm/v/webview-nodejs)](https://www.npmjs.com/package/webview-nodejs) ![npm bundle size (version)](https://img.shields.io/bundlephobia/min/webview-nodejs/latest?label=体积) ![npm download](https://img.shields.io/npm/dt/webview-nodejs?label=下载次数)
![last commit](https://img.shields.io/github/last-commit/Winterreisender/webviewko?label=上次提交)
![license](https://img.shields.io/github/license/Winterreisender/webviewko?color=3DA639&label=许可)

[English](../README.md) | **中文(简体)**

一个[webview](https://github.com/webview/webview)的Node.js绑定。 [webview](https://github.com/webview/webview) 是一个小巧、跨平台的网页视图库，可用以构建现代跨平台桌面软件。

![](screenshot/screenshot.webp)

## 快速开始

1. 通过NPM来安装
```shell
npm i webview-nodejs
```
2. 导入并使用
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

## 帮助

- [文档](https://winterreisender.github.io/webview-nodejs/tsdoc/index.html)
- [例子](test/)

## 支持的平台

内置:

- win32 x64
- linux x64
- osx x64
- osx aarch64

通过指定动态库位置`libPath`，也可支持其他平台。OSX未经测试。需Node.js 10+。

## 参与进来

我们欢迎并感谢任何建议,issue,pr和其他贡献。

## 引用

| 项目 | 许可 |
|---|---|
| [webview](https://github.com/webview/webview)                                | [MIT](https://github.com/webview/webview/blob/master/LICENSE)                |
| [webview_deno](https://github.com/webview/webview_deno)                      | [MIT](https://github.com/webview/webview_deno/blob/master/LICENSE)           |
| [node-ffi-napi](https://github.com/node-ffi-napi/node-ffi-napi)              | [MIT](https://github.com/node-ffi-napi/node-ffi-napi/blob/master/LICENSE)    |
| [Microsoft Webview2](https://www.nuget.org/packages/Microsoft.Web.WebView2/) | [BSD-3-Clause](https://www.nuget.org/packages/Microsoft.Web.WebView2/1.0.1245.22/License)     |


## 版权与许可

Copyright 2022 Winterreisender and [other contributors](https://github.com/Winterreisender/webview-nodejs/graphs/contributors).

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0  
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  
See the License for the specific language governing permissions and limitations under the License.

SPDX标识: **Apache-2.0**

<img src="https://opensource.org/sites/default/files/public/OSIApproved.svg" width="100" />
