/* 
Awfice is a collection of tiny office suite apps
Homepage: https://github.com/zserge/awfice
License: MIT
Author: zserge
*/

const { Webview } = require('webview-nodejs');

function main() {
    let w = new Webview(true);
    w.title("Hello World");

    const awfice_beam = "<body><script>d=document;for(i=0;i<50;i++)d.body.innerHTML+='<div style=\"position:relative;width:90%;padding-top:60%;margin:5%;border:1px solid silver;page-break-after:always\"><div contenteditable style=outline:none;position:absolute;right:10%;bottom:10%;left:10%;top:10%;font-size:5vmin>';d.querySelectorAll(\"div>div\").forEach(e=>e.onkeydown=e=>{n=e.ctrlKey&&e.altKey&&e.keyCode-49,f=\"formatBlock\",j=\"justify\",x=[f,f,j+\"Left\",j+\"Center\",j+\"Right\",\"outdent\",\"indent\",\"insertUnorderedList\"][n],y=[\"<h1>\",\"<div>\"][n],x&&d.execCommand(x,!1,y)})</script><style>@page{size:6in 8in landscape}@media print{*{border:0 !important}}"
    w.html(awfice_beam);

    w.show();
}

test('awfice',main);
