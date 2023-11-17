/**
 * This is the test for CI (GitHub Actions)
 */
const { Webview } = require('webview-nodejs');

function main() {
    let w = new Webview();
    console.debug(w.version());
    // TODO: Add GUI Test in headless mode
}

import {test} from '@jest/globals'
test('ci',main);
