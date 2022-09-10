import {Webview} from '../dist/webview';
import {test} from '@jest/globals'


test('ts demo',()=>{
    let w = new Webview();
    w.title("Hello");
    w.size(600,600,0);
    w.navigate("https://example.com");
    w.dispatch(()=>{
        w.title("World")
    });
    w.bind("increment", (w,num,inc)=>{
        return num + inc
    });
    w.show();
})
