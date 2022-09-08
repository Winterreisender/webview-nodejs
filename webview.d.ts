

export declare class Webview {
    declare lib :any
    declare webview :any

    constructor(debug?: boolean,libPath? :string)

    public title(v :string) :void

    public navigate(url :string) :void

    public html(v :string) :void

    public size(width :number, height :number, hints :number) :void

    public init(js :string) :void

    public eval(js :string) :void

    public bindRaw(name :string,fn :(w :Webview, req :string)=>[boolean,string]) :void

    public bind(name :string, fn :(w :Webview, ...args :any)=>any ) :void

    public dispatch(fn :(w :Webview)=>void) :void

    public unbind(name :string) :void

    public show() :void

    public terminate() :void

    public getLibraryPath() :string
}