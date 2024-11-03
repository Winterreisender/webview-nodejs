/**
 * This is the test for CI (GitHub Actions)
 */
import {Webview} from '../src/webview.js';


function main() {
    let w = new Webview();

}

import test from 'node:test';
test('ci',main);
