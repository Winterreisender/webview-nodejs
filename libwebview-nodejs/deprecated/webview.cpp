#include <iostream>
#include <webview.h>
#include <napi.h>

using namespace Napi;

Value CreateMethod(const CallbackInfo& info) {
  Env env = info.Env();
  if (info.Length() < 2) {
    Napi::TypeError::New(env, "Wrong number of arguments").ThrowAsJavaScriptException();
    return env.Null();
  }
  if (!info[0].IsNumber()) {
    Napi::TypeError::New(env, "Wrong arguments").ThrowAsJavaScriptException();
    return env.Null();
  }

  double debug = info[0].As<Napi::Number>().Int32Value();
  double wnd   = info[1].As<Napi::Number>().Int64Value(); // TODO: Should be pointer

  webview_t w = webview_create(debug, nullptr);

  return Object::New(env, w);
}

String EvalMethod(const CallbackInfo& info) {
  Env env = info.Env();

  return String::New(env, "world");
}

String EvalMethod(const CallbackInfo& info) {
  Env env = info.Env();

  return String::New(env, "world");
}


Object Init(Env env, Object exports) {
  exports.Set(String::New(env, "webview_create"), Function::New(env, CreateMethod));
  exports.Set(String::New(env, "webview_eval"), Function::New(env, EvalMethod));
  exports.Set(String::New(env, "webview_run"), Function::New(env, EvalMethod));
  return exports;
}

NODE_API_MODULE(webview_cpp, Init)