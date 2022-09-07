import {Library, Callback, LIB_EXT} from 'ffi-napi';

export default class Webview {
    constructor(debug=0) {
        this.lib = Library('webview' + LIB_EXT, { 
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
        this.webview = this.lib.webview_create(debug,null);
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

    // fn: String->String
    bind(name,fn) {
        var resolve = (function (seq,result,isError) { this.lib.webview_return(this.webview,seq,isError,result); }).bind(this);
        var callback = Callback('void',['string','string','pointer'], function(seq,req,arg) {
            var isError = 0;
            var result = "";
            try {
                result = fn(req);
            } catch (error) {
                isError = 1;
                result = JSON.stringify(error);
            }
            resolve(seq,result,0);
        });
        this.lib.webview_bind(this.webview, name, callback, null);
        process.on('exit', function() { callback; });
    }

    // fn: ()->()
    dispatch(fn) {
        var callback = Callback('void',['pointer','pointer'], function (w,arg) {
            fn();
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
}
