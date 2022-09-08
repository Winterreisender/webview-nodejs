export declare class Webview {
    declare lib :any
    declare webview :any

    /**
     * Updates the title of the native window.
     *
     * Must be called from the UI thread.
     * @debug enable DevTools and other debug features.
     * @param libPath the path to lib(dll/so/dylib). If not set, it will use built in libs.
     */
    constructor(debug?: boolean,libPath? :string)

    /**
     * Updates the title of the native window.
     *
     * Must be called from the UI thread.
     *
     * @param v the new title
     */
    public title(v :string) :void

    /**
     * Navigates webview to the given URL
     *
     * URL may be a data URI, i.e. "data:text/text,...". It is often ok not to url-encode it properly, webview will re-encode it for you. Same as [navigate]
     *
     * @param v the URL or URI
     * */
    public navigate(url :string) :void

    /**
     * Set webview HTML directly.
     *
     * @param v the HTML content
     */
    public html(v :string) :void

    /**
    * Updates the size of the native window.
    *
    * Accepts a WEBVIEW_HINT
    *
    * @param hints can be one of `NONE(=0)`, `MIN(=1)`, `MAX(=2)` or `FIXED(=3)`
    */
    public size(width :number, height :number, hints :number) :void

    /**
    * Injects JS code at the initialization of the new page.
    *
    * Every time the webview will open a new page - this initialization code will be executed. It is guaranteed that code is executed before window.onload.
    *
    * @param js the JS code
    */
    public init(js :string) :void

    /**
     * Evaluates arbitrary JS code.
     *
     * Evaluation happens asynchronously, also the result of the expression is ignored. Use the `webview_bind` function if you want to receive notifications about the results of the evaluation.
     *
     * @param js the JS code
     */
    public eval(js :string) :void

    /**
     * Binds a native Kotlin/Java callback so that it will appear under the given name as a global JS function.
     *
     * Callback receives a request string. Request string is a JSON array of all the arguments passed to the JS function.
     *
     * @param name the name of the global JS function
     * @param fn the callback function receives the request parameter in webview browser and return the response(=[isSuccess,result]), both in JSON string. If isSuccess=false, it wll reject the Promise.
     */
    public bindRaw(name :string,fn :(w :Webview, req :string)=>[boolean,string]) :void

    /**
    * Binds a Kotlin callback so that it will appear under the given name as a global JS function.
    *
    * @param name the name of the global browser JS function
    * @param fn the callback function which receives the parameter and return the result to Webview. Any exception happened in Node.js here will reject the `Promise` instead of crash the program.
    * 
    * ### Example
    * 
    * ```js
    * bind("sumInNodeJS",(arg0,arg1) => {
    *   return arg0+arg1;
    * });
    * ```
    * in Webview browser, you should call `await sumInNodeJS(1,2)` and get `3`
    */
    public bind(name :string, fn :(w :Webview, ...args :any)=>any ) :void

    /**
    * Posts a function to be executed on the main thread.
    *
    * It safely schedules the callback to be run on the main thread on the next main loop iteration.
    *
    * @param fn the function to be executed on the main thread.
    *
    */
    public dispatch(fn :(w :Webview)=>void) :void

    /**
     * Removes a callback that was previously set by `webview_bind`.
     *
     * @param name the name of JS function used in `webview_bind`
     */
    public unbind(name :string) :void

    /**
     * Runs the main loop and destroy it when terminated.
     *
     * This will block the thread.
     */
    public show() :void

    /**
     * Stops the main loop.
     *
     * It is safe to call this function from another other background thread.
     */
    public terminate() :void

    private getLibraryPath() :string
}