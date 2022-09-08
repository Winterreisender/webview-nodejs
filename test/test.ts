import {Webview} from "../webview";

function main() {
    let w = new Webview();
    w.title("Hello");
    w.size(600,600,0);
    w.navigate("https://example.com");
    w.dispatch(()=>{
        w.title("World")
    });
    w.bind("increment", (it)=>{
        console.log(it);
        it = JSON.parse(it);
        return (it[0]+1).toString();
    });
    w.show();
}

main()