# libwebview-nodejs

A C++ extension porting of webview for webview-nodejs using NAPI.

# Credits

- swig
- webview/webview
- cmake.js

# generate node module
In swig 4.2+

    swig -c++ -javascript -napi webview.i

# TODO
- try move cmakejs to node-gyp thought I don't like node-gyp. But it would improve the DX hugely.