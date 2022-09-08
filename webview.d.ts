import fs from 'fs';
import ffi from 'ffi-napi'

declare class Webview {
    lib :any
    webview :any

    constructor(debug: boolean,libPath :fs.PathLike)

    public title(v :string) :void

    public navigate(url :string) :void

    public html(v :string) :void

    public size(width :number, height :number, hints :number) :void

    public init(js :string) :void

    public eval(js :string) :void

    public bind(name :string,fn :(req :string)=>string) :void

    public dispatch(fn :()=>void) :void

    public unbind(name :string) :void

    public show() :void

    public terminate() :void

    public getLibraryPath() :fs.PathLike
}