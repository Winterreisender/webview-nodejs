import path from 'path';
const koffi = require('koffi');

/** Window size hints */
export enum SizeHint {
    /** Width and height are default size */
    None = 0,
    /** Width and height are minimum bounds */
    Min  = 1,
    /** Width and height are maximum bounds */
    Max  = 2,
    /** Window size can not be changed by a user */
    Fixed= 3
}

/** 
 * Get lib's path from node_modules
 * 
 * This fuction is used when the `libPath` is not set during calling the constructor of `Webview`
 * 
 * @return the path to libwebview
*/
export function getLibraryPath() :string {
    let dir = __dirname;
    let arch = process.arch;
    let platform = process.platform;
    let libName = 'libwebview' + '.dll'; // TODO: LIB_EXT
    if(platform == 'win32'){
        libName = libName.replace(/^(lib)/,'');
    }
    if(['linux','win32','darwin'].includes(platform) && arch == 'x64') {
        return path.join(dir,'libs',platform,arch,libName)
    }else{
        throw new Error(`Unsupported pattform: ${platform} ${arch}`);
    }
}

const DispatchCallback = koffi.proto('void DispatchCallback(void* webview, void* args)');                     //  If the C function calls the callback later, the behavior is undefined
const BindCallback     = koffi.proto('void BindCallback(char* seq, char* req, void* args)'); 


export class Webview {
    private lib
    private funcs
    private callbacks = new Array()
    private webview: any
    private isDebug :boolean = false
    
    /**
     * Create a webview.
     *
     * @param debug enable DevTools and other debug features.
     * @param libPath the path to lib(dll/so/dylib). If not set, it will use built in libs.
     * @param target the destination window handle. set it to null if you want to create a new window
     */  
    constructor(debug :boolean = false, libPath :string = getLibraryPath(), target = null) {
        this.lib = koffi.load(libPath);
        this.funcs = {
            'webview_create'    : this.lib.func('webview_create'    , 'void *' , [ 'int', 'void *' ] ),
            'webview_run'       : this.lib.func('webview_run'       , 'void'   , [ 'void *' ] ),
            'webview_terminate' : this.lib.func('webview_terminate' , 'void'   , [ 'void *' ] ),
            'webview_destroy'   : this.lib.func('webview_destroy'   , 'void'   , [ 'void *' ] ),
            'webview_set_title' : this.lib.func('webview_set_title' , 'void'   , [ 'void *', 'string' ] ),
            'webview_set_html'  : this.lib.func('webview_set_html'  , 'void'   , [ 'void *', 'string' ] ),
            'webview_navigate'  : this.lib.func('webview_navigate'  , 'void'   , [ 'void *', 'string' ] ),
            'webview_init'      : this.lib.func('webview_init'      , 'void'   , [ 'void *', 'string' ] ),
            'webview_eval'      : this.lib.func('webview_eval'      , 'void'   , [ 'void *', 'string' ] ),
            'webview_dispatch'  : this.lib.func('webview_dispatch'  , 'void'   , [ 'void *',  koffi.pointer(DispatchCallback)] ),
            'webview_bind'      : this.lib.func('webview_bind'      , 'void'   , [ 'void *', 'string', koffi.pointer(BindCallback), 'string' ] ),
            'webview_return'    : this.lib.func('webview_return'    , 'void'   , [ 'void *', 'string', 'int', 'string' ] ),
            'webview_unbind'    : this.lib.func('webview_unbind'    , 'void'   , [ 'void *', 'string' ] ),
            'webview_set_size'  : this.lib.func('webview_set_size'  , 'void'   , [ 'void *', 'int', 'int', 'int' ] ),
            'webview_get_window': this.lib.func('webview_get_window', 'void *' , [ 'void *' ] ),
            'webview_version'   : this.lib.func('webview_version'   , 'void *' , [] ),
        }

        this.create(debug,target);
    }

    create(debug :boolean = false, target = null) {
        this.webview = this.funcs.webview_create(debug ? 1 : 0, target);
        if(!this.webview) {
            this.webview=null;
            throw new Error("Failed to create webview");
        }
        this.isDebug = debug;
    }

    /**
     * Updates the title of the native window.
     *
     * Must be called from the UI thread.
     *
     * @param v the new title
     */ 
    title(v: string) {
        this.funcs.webview_set_title(this.webview,v)
    }

    /**
     * Navigates webview to the given URL
     *
     * URL may be a data URI, i.e. "data:text/text,...". It is often ok not to url-encode it properly, webview will re-encode it for you. Same as [navigate]
     *
     * @param url the URL or URI
     * */
    navigate(url: string) {
        this.funcs.webview_navigate(this.webview,url)
    }

    /**
     * Set webview HTML directly.
     *
     * @param v the HTML content
     */
    html(v: string) {
        this.funcs.webview_set_html(this.webview,v)
    }

    /**
    * Updates the size of the native window.
    *
    * Accepts a WEBVIEW_HINT
    *
    * @param hints can be one of `NONE(=0)`, `MIN(=1)`, `MAX(=2)` or `FIXED(=3)`
    */    
    size(width: number, height: number, hints: SizeHint | number = SizeHint.None) {
        this.funcs.webview_set_size(this.webview,width,height,hints)
    }

    /**
    * Injects JS code at the initialization of the new page.
    *
    * Every time the webview will open a new page - this initialization code will be executed. It is guaranteed that code is executed before window.onload.
    *
    * @param js the JS code
    */
    init(js: string) {
        this.funcs.webview_init(this.webview,js)
    }

    /**
     * Evaluates arbitrary JS code in browser.
     *
     * Evaluation happens asynchronously, also the result of the expression is ignored. Use the `bind` function if you want to receive notifications about the results of the evaluation.
     *
     * @param js the JS code
     */
    eval(js: string) {
        this.funcs.webview_eval(this.webview,js)
    }

    /**
     * Binds a native NodeJS callback so that it will appear under the given name as a global webview's JS function.
     *
     * Callback receives an Array from browser's JS. Request string is a JSON array of all the arguments passed to the JS function.
     *
     * @param name the name of the global browser's JS function
     * @param fn the callback function receives the request parameter in webview browser and return the response(=[isSuccess,result]), both in JSON string. If isSuccess=false, it wll reject the Promise.
     */
    bindRaw(name :string, fn :(w: Webview, req :string)=>[number,string]) {      
        const callback = koffi.register((seq: string, req: string, _arg: any) => {
            const [isError,result] = fn(this,req)
            this.funcs.webview_return(this.webview,seq,isError,result);
        }, koffi.pointer(BindCallback));
        this.callbacks.push(callback); // for GC

        this.funcs.webview_bind(this.webview, name, callback, null);
    }

    /**
    * Binds a Node.js callback so that it will appear under the given name as a global JS function in webview .
    *
    * @param name the name of the global browser's JS function
    * @param fn the callback function which receives the parameter and return the result to Webview. Any exception happened in Node.js here will reject the `Promise` instead of crash the program.
    * 
    * ### Example
    * 
    * ```js
    * bind("sumInNodeJS",(webview, arg0,arg1) => {
    *   return arg0+arg1;
    * });
    * ```
    * in webview browser, you should call `await sumInNodeJS(1,2)` and get `3`
    */
    bind(name: string,fn: (w: Webview, ...args :any[]) => any) {
        this.bindRaw(name, (w: any,req: string)=>{
            let args :any[] = JSON.parse(req);
            try {
                const resultValue = fn(w, ...args) ?? null; // convert undefined to null
                const result = JSON.stringify(resultValue);

                if (result === undefined) {
                    // need JSON.stringify to wrap string in quotes
                    return [1, JSON.stringify(`JSON.stringify failed for return value ${resultValue}`)];
                }

                return [0, result];
            }
            catch (error) {
                // JSON.stringify(error) returns "[object Object]", call String to get message, need JSON.stringify to wrap string in quotes
                return [1, JSON.stringify(String(error))];
            }
        });
    }

    /**
    * Posts a function to be executed on the main thread.
    *
    * It safely schedules the callback to be run on the main thread on the next main loop iteration.
    *
    * @param fn the function to be executed on the main thread.
    */
    dispatch(fn: (webview: Webview) => void) {
        const callback = koffi.register((_w: any,_arg: any) => {
            fn(this);
        }, koffi.pointer(DispatchCallback));
        this.callbacks.push(callback);
        
        this.funcs.webview_dispatch(this.webview,callback);
    }

    /**
     * Removes a callback that was previously set by `webview_bind`.
     *
     * @param name the name of JS function used in `webview_bind`
     */    
    unbind(name: string) {
        this.funcs.webview_unbind(this.webview,name)
    }

    /**
     * Runs the main loop and destroy it when terminated.
     *
     * This will block the thread. Functions like `setInterval` won't work.
     * For workarounds, see https://github.com/Winterreisender/webview-nodejs/wiki/Limitations-and-Workarounds
     */
    show() {
        this.start()
        this.terminate()
        this.destroy()
    }

    /**
     * Runs the main loop until it's terminated. **After this function exits - you must destroy the webview**.
     *
     * This will block the thread.
     */
    start() {
        this.funcs.webview_run(this.webview)
    }

    /**
     * Destroy the webview and close the native window.
     *
     * You must destroy the webview after [run]
     */
    destroy() {
        this.funcs.webview_destroy(this.webview);
        this.callbacks.forEach((v)=>koffi.unregister(v));
        this.callbacks = [];
        this.webview = null;
    }

    /**
     * Stops the main loop.
     *
     * It is safe to call this function from other background thread.
     */
    terminate() {
        this.funcs.webview_terminate(this.webview)
    }

    /** 
     * **UNSAFE**: An unsafe pointer to the webview
     * 
     * This API comes from webview_deno.
     * 
     */
    get unsafeHandle() {
        return this.webview;
    }

    /** 
     * **UNSAFE**: An unsafe pointer to the webviews platform specific native window handle.
     *
     * An unsafe pointer to the webviews platform specific native window handle.
     * When using GTK backend the pointer is `GtkWindow` pointer, when using Cocoa
     * backend the pointer is `NSWindow` pointer, when using Win32 backend the
     * pointer is `HWND` pointer. This API comes from webview_deno.
     */
    get unsafeWindowHandle() {
        return this.funcs.webview_get_window(this.webview);
    }

    get version() {
        return this.funcs.webview_version()
    }
}

