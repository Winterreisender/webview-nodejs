# webview-nodejs

[![npm](https://img.shields.io/npm/v/webview-nodejs)](https://www.npmjs.com/package/webview-nodejs)
![last commit](https://img.shields.io/github/last-commit/Winterreisender/webviewko)
![license](https://img.shields.io/github/license/Winterreisender/webviewko?color=3DA639)


A Node.js binding to [webview](https://github.com/webview/webview)


## Getting Started

1. Install via npm
```shell
npm i webview-nodejs
```
2. Import Webview and use webview
```js
import Webview from "webview-nodejs";

let w = new Webview(1);
w.title("Hello");
w.size(600,600,0);
w.navigate("https://example.com");
w.dispatch(()=>{
    w.title("World")
});
w.bind("increment", (it)=>{
    console.log(it);
    it = JSON.parse(it);
    return (it[0]+1).toString();
});
w.show();
```

## Supported Platforms

- win32 x64
- linux x64
- osx x64
- osx aarch64

## Contribution

All suggestions, pull requests, issues and other contributions are welcome and appreciated.

## Credits

| Project                                                                      | License                                                                                          |
|------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------|
| [webview](https://github.com/webview/webview)                                | [MIT](https://github.com/webview/webview/blob/master/LICENSE)                                    |
| [node-ffi-napi](https://github.com/node-ffi-napi/node-ffi-napi)              | [MIT](https://github.com/node-ffi-napi/node-ffi-napi/blob/master/LICENSE)                        |
| [Microsoft Webview2](https://www.nuget.org/packages/Microsoft.Web.WebView2/) | [Microsoft WebView2 License](https://www.nuget.org/packages/Microsoft.Web.WebView2/1.0.1245.22/License)     |

libs are from [webview_deno](https://github.com/webview/webview_deno)

# License

Copyright 2022 Winterreisender.

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0  
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  
See the License for the specific language governing permissions and limitations under the License.

SPDX short identifier: **Apache-2.0**

<img src="https://opensource.org/sites/default/files/public/OSIApproved.svg" width="100" />

