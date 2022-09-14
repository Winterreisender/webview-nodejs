import { ForeignFunction } from 'ffi-napi';
import { Pointer } from 'ref-napi';
/** Window size hints */
export declare type SizeHint = typeof SizeHint[keyof typeof SizeHint];
/** Window size hints */
export declare const SizeHint: {
    /** Width and height are default size */
    readonly NONE: 0;
    /** Width and height are minimum bounds */
    readonly MIN: 1;
    /** Width and height are maximum bounds */
    readonly MAX: 2;
    /** Window size can not be changed by a user */
    readonly FIXED: 3;
};
export declare type webview_t = Pointer<unknown>;
export declare type WebviewFFI = {
    webview_create: ForeignFunction<webview_t, [number, Pointer<unknown>]>;
    webview_run: ForeignFunction<void, [webview_t]>;
    webview_terminate: ForeignFunction<void, [webview_t]>;
    webview_destroy: ForeignFunction<void, [webview_t]>;
    webview_set_title: ForeignFunction<void, [webview_t, string]>;
    webview_set_html: ForeignFunction<void, [webview_t, string]>;
    webview_navigate: ForeignFunction<void, [webview_t, string]>;
    webview_init: ForeignFunction<void, [webview_t, string]>;
    webview_eval: ForeignFunction<void, [webview_t, string]>;
    webview_dispatch: ForeignFunction<void, [webview_t, Pointer<unknown>]>;
    webview_bind: ForeignFunction<void, [webview_t, string, Pointer<(...args: ("string" | "pointer")[]) => void>, Pointer<unknown>]>;
    webview_return: ForeignFunction<void, [webview_t, string, number, string]>;
    webview_unbind: ForeignFunction<void, [webview_t, string]>;
    webview_set_size: ForeignFunction<void, [webview_t, number, number, number]>;
    webview_get_window: ForeignFunction<Pointer<unknown>, [webview_t]>;
};
/**
 * Get lib's path from node_modules and extract webview2loader in windows
 *
 * This fuction is used when the `libPath` is not set during calling the constructor of `Webview`
 *
 * @return the path to libwebview
*/
export declare function getLibraryPath(): string;
export declare class Webview {
    private lib;
    private webview;
    WindowHint: {
        /** Width and height are default size */
        readonly NONE: 0;
        /** Width and height are minimum bounds */
        readonly MIN: 1;
        /** Width and height are maximum bounds */
        readonly MAX: 2;
        /** Window size can not be changed by a user */
        readonly FIXED: 3;
    };
    /**
     * Create a webview.
     *
     * @debug enable DevTools and other debug features.
     * @param libPath the path to lib(dll/so/dylib). If not set, it will use built in libs.
     */
    constructor(debug?: boolean, libPath?: string);
    /**
     * Updates the title of the native window.
     *
     * Must be called from the UI thread.
     *
     * @param v the new title
     */
    title(v: string): void;
    /**
     * Navigates webview to the given URL
     *
     * URL may be a data URI, i.e. "data:text/text,...". It is often ok not to url-encode it properly, webview will re-encode it for you. Same as [navigate]
     *
     * @param url the URL or URI
     * */
    navigate(url: string): void;
    /**
     * Set webview HTML directly.
     *
     * @param v the HTML content
     */
    html(v: string): void;
    /**
    * Updates the size of the native window.
    *
    * Accepts a WEBVIEW_HINT
    *
    * @param hints can be one of `NONE(=0)`, `MIN(=1)`, `MAX(=2)` or `FIXED(=3)`
    */
    size(width: number, height: number, hints?: SizeHint | number): void;
    /**
    * Injects JS code at the initialization of the new page.
    *
    * Every time the webview will open a new page - this initialization code will be executed. It is guaranteed that code is executed before window.onload.
    *
    * @param js the JS code
    */
    init(js: string): void;
    /**
     * Evaluates arbitrary JS code in browser.
     *
     * Evaluation happens asynchronously, also the result of the expression is ignored. Use the `bind` function if you want to receive notifications about the results of the evaluation.
     *
     * @param js the JS code
     */
    eval(js: string): void;
    /**
     * Binds a native NodeJS callback so that it will appear under the given name as a global browser's JS function.
     *
     * Callback receives an Array from browser's JS. Request string is a JSON array of all the arguments passed to the JS function.
     *
     * @param name the name of the global browser's JS function
     * @param fn the callback function receives the request parameter in webview browser and return the response(=[isSuccess,result]), both in JSON string. If isSuccess=false, it wll reject the Promise.
     */
    bindRaw(name: string, fn: (w: Webview, req: string) => [number, string]): void;
    /**
    * Binds a NodeJS callback so that it will appear under the given name as a global JS function in browser JS .
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
    bind(name: string, fn: (w: Webview, ...args: any[]) => any): void;
    /**
    * Posts a function to be executed on the main thread.
    *
    * It safely schedules the callback to be run on the main thread on the next main loop iteration.
    *
    * @param fn the function to be executed on the main thread.
    */
    dispatch(fn: (webview: Webview) => void): void;
    /**
     * Removes a callback that was previously set by `webview_bind`.
     *
     * @param name the name of JS function used in `webview_bind`
     */
    unbind(name: string): void;
    /**
     * Runs the main loop and destroy it when terminated.
     *
     * This will block the thread.
     */
    show(): void;
    /**
     * Runs the main loop until it's terminated. **After this function exits - you must destroy the webview**.
     *
     * This will block the thread.
     */
    start(): void;
    /**
     * Destroy the webview and close the native window.
     *
     * You must destroy the webview after [run]
     */
    destroy(): void;
    /**
     * Stops the main loop.
     *
     * It is safe to call this function from other background thread.
     */
    terminate(): void;
    /**
     * **UNSAFE**: An unsafe pointer to the webview
     *
     * This API comes from webview_deno.
     *
     */
    get unsafeHandle(): webview_t;
    /**
     * **UNSAFE**: An unsafe pointer to the webviews platform specific native window handle.
     *
     * An unsafe pointer to the webviews platform specific native window handle.
     * When using GTK backend the pointer is `GtkWindow` pointer, when using Cocoa
     * backend the pointer is `NSWindow` pointer, when using Win32 backend the
     * pointer is `HWND` pointer. This API comes from webview_deno.
     */
    get unsafeWindowHandle(): Pointer<unknown>;
}
