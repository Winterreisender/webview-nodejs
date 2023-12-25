/**
 * This is the test for CI (GitHub Actions)
 */
const { Webview } = require('webview-nodejs');

function main() {
    let w = new Webview();

}

import {test} from '@jest/globals'
test('ci',main);
