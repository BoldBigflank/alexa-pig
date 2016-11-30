'use strict';
var CMUDict = require('./cmudict');

function Translator() {
    // var phoneme_str = cmudict.get('prosaic');
    this._cache = null;
}

Translator.prototype.translate = function(phrase, language, cb){
    var result = {
        "type":"SSML",
        "speech":"<speak>" + translatePigLatin(phrase) + "</speak>"
    };
    return cb(result);
};

function translatePigLatin(phrase) {
    var result = "";
    // Split the phrase into words
    var phrase_array = phrase.split(" ");
    for (var i = 0; i < phrase_array.length; i++) {
        // Split each word into a phoneme string
        var word = phrase_array[i];
        var phoneme_str = CMUDict.get(word);
        
        // Move the first phoneme to the end, add EY1
        // var phoneme_array = phoneme_str.split(" ");
        // var first = phoneme_array.shift();
        // phoneme_array.push(first);
        // phoneme_array.push("eɪ");

        if(phoneme_str === undefined) {
            // go letter by letter
            result += " " + word + " ";
        } else {
            var phoneme_str_pig = phoneme_str.substr(1) + phoneme_str.charAt(0) + "eɪ";
            result += "<phoneme alphabet='ipa' ph='" + phoneme_str_pig + "'>" + word + "</phoneme>"
        }
    }

    // Turn the CMU Dict symbols to IPA
    return result;
}

module.exports = Translator; 