"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Webview = exports.getLibraryPath = exports.SizeHint = void 0;
const ffi_napi_1 = require("ffi-napi");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
/** Window size hints */
exports.SizeHint = {
    /** Width and height are default size */
    NONE: 0,
    /** Width and height are minimum bounds */
    MIN: 1,
    /** Width and height are maximum bounds */
    MAX: 2,
    /** Window size can not be changed by a user */
    FIXED: 3,
};
/**
 * Get lib's path from node_modules and extract webview2loader in windows
 *
 * This fuction is used when the `libPath` is not set during calling the constructor of `Webview`
 *
 * @return the path to libwebview
*/
function getLibraryPath() {
    let dir = __dirname;
    let arch = process.arch;
    let platform = process.platform;
    let libName = 'libwebview' + ffi_napi_1.LIB_EXT;
    if (platform == 'win32') {
        libName = libName.replace(/^(lib)/, '');
        // Copy dlls
        let dst = path_1.default.join('.', 'WebView2Loader.dll');
        if (!fs_1.default.existsSync(dst)) {
            fs_1.default.copyFileSync(path_1.default.join(dir, 'libs', platform, arch, 'WebView2Loader.dll'), dst);
        }
    }
    if (['linux', 'win32', 'darwin'].includes(platform) && arch == 'x64') {
        return path_1.default.join(dir, 'libs', platform, arch, libName);
    }
    else {
        throw new Error("Unsupported pattform: " + platform + arch);
    }
}
exports.getLibraryPath = getLibraryPath;
class Webview {
    /**
     * Create a webview.
     *
     * @debug enable DevTools and other debug features.
     * @param libPath the path to lib(dll/so/dylib). If not set, it will use built in libs.
     */
    constructor(debug = false, libPath = getLibraryPath()) {
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
        this.lib = new ffi_napi_1.Library(libPath, {
            'webview_create': ['pointer', ['int', 'pointer']],
            'webview_run': ['void', ['pointer']],
            'webview_terminate': ['void', ['pointer']],
            'webview_destroy': ['void', ['pointer']],
            'webview_set_title': ['void', ['pointer', 'string']],
            'webview_set_html': ['void', ['pointer', 'string']],
            'webview_navigate': ['void', ['pointer', 'string']],
            'webview_init': ['void', ['pointer', 'string']],
            'webview_eval': ['void', ['pointer', 'string']],
            'webview_dispatch': ['void', ['pointer', 'pointer']],
            'webview_bind': ['void', ['pointer', 'string', 'pointer', 'pointer']],
            'webview_return': ['void', ['pointer', 'string', 'int', 'string']],
            'webview_unbind': ['void', ['pointer', 'string']],
            'webview_set_size': ['void', ['pointer', 'int', 'int', 'int']],
            'webview_get_window': ['pointer', ['pointer']],
        });
        this.webview = this.lib.webview_create(debug ? 1 : 0, null);
        if (!this.webview) {
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
    title(v) {
        this.lib.webview_set_title(this.webview, v);
    }
    /**
     * Navigates webview to the given URL
     *
     * URL may be a data URI, i.e. "data:text/text,...". It is often ok not to url-encode it properly, webview will re-encode it for you. Same as [navigate]
     *
     * @param url the URL or URI
     * */
    navigate(url) {
        this.lib.webview_navigate(this.webview, url);
    }
    /**
     * Set webview HTML directly.
     *
     * @param v the HTML content
     */
    html(v) {
        this.lib.webview_set_html(this.webview, v);
    }
    /**
    * Updates the size of the native window.
    *
    * Accepts a WEBVIEW_HINT
    *
    * @param hints can be one of `NONE(=0)`, `MIN(=1)`, `MAX(=2)` or `FIXED(=3)`
    */
    size(width, height, hints = exports.SizeHint.NONE) {
        this.lib.webview_set_size(this.webview, width, height, hints);
    }
    /**
    * Injects JS code at the initialization of the new page.
    *
    * Every time the webview will open a new page - this initialization code will be executed. It is guaranteed that code is executed before window.onload.
    *
    * @param js the JS code
    */
    init(js) {
        this.lib.webview_init(this.webview, js);
    }
    /**
     * Evaluates arbitrary JS code in browser.
     *
     * Evaluation happens asynchronously, also the result of the expression is ignored. Use the `bind` function if you want to receive notifications about the results of the evaluation.
     *
     * @param js the JS code
     */
    eval(js) {
        this.lib.webview_eval(this.webview, js);
    }
    /**
     * Binds a native NodeJS callback so that it will appear under the given name as a global browser's JS function.
     *
     * Callback receives an Array from browser's JS. Request string is a JSON array of all the arguments passed to the JS function.
     *
     * @param name the name of the global browser's JS function
     * @param fn the callback function receives the request parameter in webview browser and return the response(=[isSuccess,result]), both in JSON string. If isSuccess=false, it wll reject the Promise.
     */
    bindRaw(name, fn) {
        let callback = (0, ffi_napi_1.Callback)('void', ['string', 'string', 'pointer'], (seq, req, _arg) => {
            const [isError, result] = fn(this, req);
            this.lib.webview_return(this.webview, seq, isError, result);
        });
        this.lib.webview_bind(this.webview, name, callback, null);
        process.on('exit', function () { callback; });
    }
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
    bind(name, fn) {
        this.bindRaw(name, (w, req) => {
            let args = JSON.parse(req);
            try {
                return [0, JSON.stringify(fn(w, ...args))];
            }
            catch (error) {
                return [1, JSON.stringify(error)];
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
    dispatch(fn) {
        let callback = (0, ffi_napi_1.Callback)('void', ['pointer', 'pointer'], (_, arg) => {
            fn(this);
        });
        this.lib.webview_dispatch(this.webview, callback);
        process.on('exit', function () { callback; });
    }
    /**
     * Removes a callback that was previously set by `webview_bind`.
     *
     * @param name the name of JS function used in `webview_bind`
     */
    unbind(name) {
        this.lib.webview_unbind(this.webview, name);
    }
    /**
     * Runs the main loop and destroy it when terminated.
     *
     * This will block the thread.
     */
    show() {
        this.lib.webview_run(this.webview);
        this.lib.webview_destroy(this.webview);
    }
    /**
     * Runs the main loop until it's terminated. **After this function exits - you must destroy the webview**.
     *
     * This will block the thread.
     */
    start() {
        this.lib.webview_run(this.webview);
    }
    /**
     * Destroy the webview and close the native window.
     *
     * You must destroy the webview after [run]
     */
    destroy() {
        this.lib.webview_destroy(this.webview);
    }
    /**
     * Stops the main loop.
     *
     * It is safe to call this function from other background thread.
     */
    terminate() {
        this.lib.webview_terminate(this.webview);
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
        return this.lib.webview_get_window(this.webview);
    }
}
exports.Webview = Webview;
