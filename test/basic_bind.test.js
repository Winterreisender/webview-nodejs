const {Webview} = require('webview-nodejs');
import {test} from '@jest/globals'

function main() {
    let w = new Webview(true);
    w.title("Hello");
    w.size(600,600);
    w.html(`
        <html><body>
        <button onclick="addInNode(parseInt(prompt()), parseInt(prompt()));">
            Test
        </button>
        </body></html>
    `);

    w.bind("addInNode", (w,arg1,arg2)=>{
        let r = arg1 + arg2;           // This will run in Node.js
        w.eval(`alert(${r})`);         // `alert` will run in webview
        return r;                      // return to webview
    });
    
    w.show();
}

test('demo',main);

