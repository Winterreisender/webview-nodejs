/**
 * This is the simplest example shown in README
 */
import {Webview} from '../src/webview.js';


function main() {
    let w = new Webview();
    w.title("Hello World");
    w.size(800,600);
    w.navigate("https://example.com");
    w.show();
}

import test from 'node:test';
test('helloworld',main);
