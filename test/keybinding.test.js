/**
 * This example is provided by [Dirk Krause](https://github.com/dirkk0) with modifications.
 */

import {Webview} from '../src/webview.js';


function main() {
  let html = `
  <body>
    <div id="d1"></div>
    <p>Press Alt+Q or ⌘ +Q to exit</p>
    <script>
      let counter = 0
      window.addEventListener("keydown", (event) => {
        if (event.metaKey || event.altKey && event.key === 'q') {
          doCmd("quit")
          event.preventDefault();
        }
      })

      setInterval(function () {
        document.querySelector("#d1").innerText = counter
        doLog("counter is " + counter)
        counter += 1
      }, 1000);
    </script>
  </body>
  `

  let w = new Webview(true);

  w.size(600, 600);
  w.html(html);

  w.bind("doLog", (w, t) => {
    console.log(t);
    w.title(t)
  });

  w.bind("doCmd", (w, cmd) => {
    console.log("cmd:", cmd);
    if (cmd == "quit") w.terminate();
  });

  w.show();
}


import test from 'node:test';
test('keybinding',main);