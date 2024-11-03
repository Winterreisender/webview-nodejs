/**
 * Due to the [limitations](https://github.com/Winterreisender/webview-nodejs/wiki/limitations-and-workarounds) of webview, 
 * setInterval won't work after calling Webview.show(), even in Node.js Workers
 * This example provides a workaround.
 * Related: https://github.com/Winterreisender/webview-nodejs/discussions/7
 */

import {Webview} from '../src/webview.js';


function main() {
    let w = new Webview(true);
    w.navigate("about:blank");
    w.bind("foo", (w) => {
        // write you setInterval code here
        // In during test using jest, it may not log
        console.log("Hello");

    });
    w.init("setInterval(foo,1000)");
    w.show();
}

import test from 'node:test';
test("set_interval", main)