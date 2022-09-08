const {Library, Callback, LIB_EXT} = require('ffi-napi');
let path = require('path')
let fs = require('fs')

class Webview {
    constructor(debug=false,libPath = this.getLibraryPath()) {
        this.lib = Library(libPath, { 
            'webview_create'   : [ 'pointer', [ 'int', 'pointer' ] ],
            'webview_run'      : [ 'void'   , [ 'pointer' ] ],
            'webview_terminate': [ 'void'   , [ 'pointer' ] ],
            'webview_destroy'  : [ 'void'   , [ 'pointer' ] ],
            'webview_set_title': [ 'void'   , [ 'pointer', 'string' ] ],
            'webview_set_html' : [ 'void'   , [ 'pointer', 'string' ] ],
            'webview_navigate' : [ 'void'   , [ 'pointer', 'string' ] ],
            'webview_init'     : [ 'void'   , [ 'pointer', 'string' ] ],
            'webview_eval'     : [ 'void'   , [ 'pointer', 'string' ] ],
            'webview_dispatch' : [ 'void'   , [ 'pointer', 'pointer'] ],
            'webview_bind'     : [ 'void'   , [ 'pointer', 'string', 'pointer', 'pointer' ] ],
            'webview_return'   : [ 'void'   , [ 'pointer', 'string', 'int', 'string' ] ],
            'webview_unbind'   : [ 'void'   , [ 'pointer', 'string' ] ],
            'webview_set_size' : [ 'void'   , [ 'pointer', 'int', 'int', 'int' ] ],
        });
        this.webview = this.lib.webview_create(debug ? 1 : 0,null);

        /** Window size hints */
        this.WindowHint = {
            /** Width and height are default size */
            NONE: 0,
            /** Width and height are minimum bounds */
            MIN: 1,
            /** Width and height are maximum bounds */
            MAX: 2,
            /** Window size can not be changed by a user */
            FIXED: 3,
        };
    }

    title(v) {
        this.lib.webview_set_title(this.webview,v)
    }

    navigate(url) {
        this.lib.webview_navigate(this.webview,url)
    }

    html(v) {
        this.lib.webview_set_html(this.webview,v)
    }

    size(width, height, hints) {
        this.lib.webview_set_size(this.webview,width,height,hints)
    }

    init(js) {
        this.lib.webview_init(this.webview,js)
    }

    eval(js) {
        this.lib.webview_eval(this.webview,js)
    }

    // fn :(req :string,w :Webview)=>[boolean,string]
    bindRaw(name,fn) {
        let callback = Callback('void',['string','string','pointer'], (seq,req,arg) => {
            const [isSuccess,result] = fn(this,req)
            this.lib.webview_return(this.webview,seq,isSuccess?0:1,result);
        });
        this.lib.webview_bind(this.webview, name, callback, null);
        process.on('exit', function() { callback; });
    }

    // fn :(...args :any, w :Webview)=>any
    bind(name,fn) {
        this.bindRaw(name, (w,req)=>{
            let args = JSON.parse(req); // [object]
            
            try {
                return [true,JSON.stringify(fn(w,...args))];
            } catch(error) {
                return [false, JSON.stringify(error)]
            }
        })
    }

    // fn: ()->()
    dispatch(fn) {
        let callback = Callback('void',['pointer','pointer'], (_,arg) => {
            fn(this);
        });
        this.lib.webview_dispatch(this.webview,callback);
        process.on('exit', function() { callback; });
    }

    unbind(name) {
        this.lib.webview_unbind(this.webview,name)
    }

    show() {
        this.lib.webview_run(this.webview)
        this.lib.webview_destroy(this.webview)
    }

    terminate() {
        this.lib.webview_terminate(this.webview)
    }

    getLibraryPath() {
        let dir = __dirname;
        let arch = process.arch;
        let platform = process.platform;
        let libName = 'libwebview' + LIB_EXT;
        if(platform == 'win32'){
            libName = libName.replace(/^(lib)/,'');
            // Copy dlls
            let dst = path.join('.','WebView2Loader.dll');
            if(!fs.existsSync(dst)) {
                fs.copyFileSync(path.join(dir,'libs',platform,arch,'WebView2Loader.dll'),dst);
            }
        }
        
        if(['linux','win32','darwin'].includes(platform) && arch == 'x64') {
            return path.join(dir,'libs',platform,arch,libName)
        }else{
            throw new ReferenceError("Unsupported pattform: " + platform + arch);
        }
    }
}


module.exports = exports = { Webview }

