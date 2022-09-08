//import Webview from "../webview.js";

const Webview = require('../webview.js')

// RPATH Issue https://github.com/node-ffi-napi/node-ffi-napi/issues/158

function main() {
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
}

main()