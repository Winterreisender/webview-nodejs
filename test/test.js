const webview = require('../webview')

function makeWebview() {
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
    return w;
}

function main() {
    let w1 = makeWebview();
    let w2 = makeWebview();

    Promise.all([w1.show(),w2.show()])
}

main()