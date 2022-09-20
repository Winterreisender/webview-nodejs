const {Webview} = require('webview-nodejs');
import {test} from '@jest/globals'

function main() {
    let w = new Webview();
    w.title("Hello");
    w.size(600,600);
    w.navigate("https://example.com");
    w.dispatch(()=>{
        w.title("World")
    });
    w.bind("increment", (w,arg1,arg2)=>{
        w.title(arg1);
        return arg1+arg2;
    });
    w.show();
}

test('demo ts',main);

