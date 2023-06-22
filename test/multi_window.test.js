import {SizeHint, Webview} from 'webview-nodejs';
import {test} from '@jest/globals'

function makeWebview({url}) {
    let w = new Webview(true);
    w.title("Hello");
    w.size(600,600,SizeHint.None);
    w.navigate(url);
    w.dispatch((w)=>{
        w.title("World")
    });
    w.bind("increment", (w,num,inc)=>{
        w.title()
        return num + inc
    });
    return w;
}

function main() {
    let w1 = makeWebview({url: "https://nodejs.org/en/about/"});
    let w2 = makeWebview({url: "https://example.com"});
    Promise.all([w1.show(),w2.show()]);
}

test("multi_window", main)