import {Webview} from '../src/webview.js';

function makeWebview({url}) {
    let w = new Webview(true);
    w.title("Hello");
    w.size(600,600);
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

import test from 'node:test';
test("multi_window", main)