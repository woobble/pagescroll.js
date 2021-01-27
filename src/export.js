import pScroll from './core'

(function (root, pScroll){

    "use strict"

    if ( typeof define === "function" && define.amd ) {
        define( "pagescroll", [], function() {
            return pScroll();
        } );
    }else if(typeof module === "object" && typeof module.exports === "object") {
        module.exports = root.document ?
            pScroll() : function (w) {
                if(!w.document) {
                    throw new Error("pagescroll.js requires a window with a document")
                }
                return pScroll()
            }
    }else{
        window.pagescroll = pScroll()
    }

})(typeof window !== "undefined" ? window : this, function () {
    return pScroll
});