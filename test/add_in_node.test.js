/**
 * This is the test for CI (GitHub Actions)
 */
const { Webview } = require('webview-nodejs');

function main() {
    let w = new Webview();
    w.title("Hello");
    w.size(600,600);
    w.html(`
        <html><body>
        <button onclick="addInNode(prompt(), prompt()).then((r)=>alert(r))">
            Test
        </button>
        </body></html>
    `);
    
    w.bind("addInNode", (w,arg1,arg2)=>{           // The first parameter is the Webview and the rest are user's.
        let r = parseInt(arg1) + parseInt(arg2);   // This will run in Node.js
        console.log(r);                            // This will run in Node.js
        return r;                                  // return the result to webview
    });
    
    w.show();
}

import {test} from '@jest/globals'
test('add_in_node',main);



