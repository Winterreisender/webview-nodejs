try {
    exports.libwebview = require('bindings')('libwebview')
}
catch (error) {
    // For bun build --compile
    exports.libwebview = require('bindings')({
        bindings: 'libwebview.node',
        module_root: 'libwebview'
    });
}

