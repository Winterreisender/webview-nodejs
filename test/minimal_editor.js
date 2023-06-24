'use strict';

const { Webview } = require('webview-nodejs');
const fs = require("fs");

let w = null

let txt = "";
let path = "texteditor.txt";

let html = `
<html>

<style>
    #text {
        width: 100%;
        height: 90%;
    }
</style>

<body>
    <button onclick="doCmd('load')">load</button>
    <button onclick="doCmd('save', getText());">save</button>
    <button onclick="doCmd('quit');">quit </button>

    <div id="text" contenteditable>type something here ...</div>
</body>
<script>
    'use strict';

    function setText(t) {
        document.querySelector("#text").innerText = t
    }

    function getText() {
        return document.querySelector("#text").innerText
    }

    doCmd("load")

</script>

</html>
`

function main() {
    // let html = fs.readFileSync("texteditor.html", { encoding: "utf8", flag: "r" });

    w = new Webview(true);
    w.title("Minimal Text Editor");
    w.size(600, 400, 3);
    w.html(html);

    w.bind("doCmd", (w, c, t) => {
        console.log("cmd:", c);
        if (c == "quit") w.terminate();
        if (c == "load") {
            txt = fs.readFileSync(path, { encoding: "utf8", flag: "r" });
            txt = JSON.stringify(txt)
            w.eval(`setText(${txt})`);
        }
        if (c == "save") fs.writeFileSync(path, t, { encoding: "utf8" });

    });
    w.show();
};

main()
