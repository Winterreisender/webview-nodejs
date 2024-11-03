import {Webview} from '../src/webview.js';

function onButtonPressed(webview, arg) {
    if(arg.length <= 10) {
        webview.title(arg)
        return true;
    } else {
        webview.eval(`
            document.addEventListener('myevent',()=>{alert('too long')},false);
            document.dispatchEvent(new Event('myevent'));
        `);
        throw "too long";
    }

}

function main() {
    let w = new Webview(true);
    w.title("Hello");
    w.size(600,600,3);
    w.html(`
        <html><body>
        <button onclick="set_title(prompt('input title'));">
            set title
        </button>
        </body></html>
    `);
    w.bind("set_title", onButtonPressed);
    w.show();
};

import test from 'node:test';
test("set_title", main)