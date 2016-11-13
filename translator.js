'use strict';

function Translator() {
    
}

Translator.prototype.translate = function(phrase, language, cb){
    var result = {
        "type":"SSML",
        "speech":"<speech>" + phrase + "</speech>"
    }
    cb(result);
};

module.exports = Translator; 