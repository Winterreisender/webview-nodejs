/**
 * This is the simplest example shown in README
 */
const { Webview } = require('webview-nodejs');

function main() {
    let w = new Webview();
    w.title("Hello World");
    w.size(800,600);
    w.navigate("https://example.com");
    w.show();
}

import {test} from '@jest/globals'
test('helloworld',main);
