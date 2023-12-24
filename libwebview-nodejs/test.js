const libwebview = require('bindings')('libwebview')
const w = libwebview.webview_create(1,null);
libwebview.webview_navigate(w,"https://example.com");

libwebview.webview_eval(w,"1");
libwebview.webview_dispatch(w, ()=>{console.log("Dispatch!!");}, null);
libwebview.webview_run(w);
libwebview.webview_destroy(w);

