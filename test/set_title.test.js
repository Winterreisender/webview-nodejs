import {Webview} from '../dist/webview';
import {test} from '@jest/globals'

function onButtonPressed(webview, arg) {
    if(arg.length <= 10) {
        webview.title(arg)
        return true;
    } else {
        throw Error("too long");
    }

}

function main() {
    let w = new Webview(true);
    w.title("Hello");
    w.size(600,600);
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

test("set_title", main)