const webview = require('../webview')

function main() {
    let w = new webview.Webview(true);
    w.title("Hello");
    w.size(600,600,0);
    w.navigate("https://example.com");
    w.dispatch(()=>{
        w.title("World")
    });
    w.bind("increment", (w,num,inc)=>{
        w.title()
        return num + inc
    });
    w.show();
}

main()