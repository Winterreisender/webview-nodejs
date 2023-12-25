import path from 'path';
import {libwebview} from 'libwebview-nodejs';
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


export class Webview {
    private lib :any
    private webview :any
    private isDebug :boolean
    
    /**
     * Create a webview.
     *
     * @param debug enable DevTools and other debug features.
     * @param libPath the path to lib(dll/so/dylib). If not set, it will use built in libs.
     * @param target the destination window handle. set it to null if you want to create a new window
     */  
    constructor(debug :boolean = false, target = null) {
        this.webview = libwebview.webview_create(debug ? 1 : 0, target);
        this.isDebug = debug
        if(!this.webview) {
            throw new Error("Failed to create webview");
        }
    }

    /**
     * Updates the title of the native window.
     *
     * Must be called from the UI thread.
     *
     * @param v the new title
     */ 
    title(v: string) {
        libwebview.webview_set_title(this.webview ,v)
    }

    /**
     * Navigates webview to the given URL
     *
     * URL may be a data URI, i.e. "data:text/text,...". It is often ok not to url-encode it properly, webview will re-encode it for you. Same as [navigate]
     *
     * @param url the URL or URI
     * */
    navigate(url: string) {
        libwebview.webview_navigate(this.webview ,url)
    }

    /**
     * Set webview HTML directly.
     *
     * @param v the HTML content
     */
    html(v: string) {
        libwebview.webview_set_html(this.webview ,v)
    }

    /**
    * Updates the size of the native window.
    *
    * Accepts a WEBVIEW_HINT
    *
    * @param hints can be one of `NONE(=0)`, `MIN(=1)`, `MAX(=2)` or `FIXED(=3)`
    */    
    size(width: number, height: number, hints: SizeHint | number = SizeHint.None) {
        libwebview.webview_set_size(this.webview ,width,height,hints)
    }

    /**
    * Injects JS code at the initialization of the new page.
    *
    * Every time the webview will open a new page - this initialization code will be executed. It is guaranteed that code is executed before window.onload.
    *
    * @param js the JS code
    */
    init(js: string) {
        libwebview.webview_init(this.webview ,js)
    }

    /**
     * Evaluates arbitrary JS code in browser.
     *
     * Evaluation happens asynchronously, also the result of the expression is ignored. Use the `bind` function if you want to receive notifications about the results of the evaluation.
     *
     * @param js the JS code
     */
    eval(js: string) {
        libwebview.webview_eval(this.webview ,js)
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
        let callback = (seq :string,req :string, _arg :string) => {
            const [isError,result] = fn(this,req)
            libwebview.webview_return(this.webview ,seq,isError,result);
        };
        libwebview.webview_bind(this.webview, name, null, callback);
        process.on('exit', function() { callback; }); // Avoid GC
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
        throw "Not Implemeted";
        // let callback = Callback('void',['pointer','pointer'], (_,arg) => {
        //     fn(this);
        // });
        // libwebview.webview_dispatch(this.webview ,callback);
        // process.on('exit', function() { callback; });
    }

    /**
     * Removes a callback that was previously set by `webview_bind`.
     *
     * @param name the name of JS function used in `webview_bind`
     */    
    unbind(name: string) {
        libwebview.webview_unbind(this.webview ,name)
    }

    /**
     * Runs the main loop and destroy it when terminated.
     *
     * This will block the thread. Functions like `setInterval` won't work.
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
        libwebview.webview_run(this.webview )
    }

    /**
     * Destroy the webview and close the native window.
     *
     * You must destroy the webview after [run]
     */
    destroy() {
        libwebview.webview_destroy(this.webview )
        this.webview = null;
    }

    /**
     * Stops the main loop.
     *
     * It is safe to call this function from other background thread.
     */
    terminate() {
        libwebview.webview_terminate(this.webview )
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
        return libwebview.webview_get_window(this.webview );
    }

}

