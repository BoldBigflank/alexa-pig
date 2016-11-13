'use strict';
var CMUDict = require('cmudict').CMUDict;
var cmudict = new CMUDict();

function Translator() {
    // var phoneme_str = cmudict.get('prosaic');
}

Translator.prototype.translate = function(phrase, language, cb){
    var result = {
        "type":"SSML",
        "speech":"<speak>" + translatePigLatin(phrase) + "</speak>"
    }
    cb(result);
};

function translatePigLatin(phrase) {
    var result = "";
    // Split the phrase into words
    var phrase_array = phrase.split();
    for (var i = 0; i < phrase_array.length; i++) {
        // Split each word into a phoneme string
        var word = phrase_array[i];
        var phoneme_str = cmudict.get(word);
        var phoneme_array = phoneme_str.split();
        
        // Move the first phoneme to the end, add EY1
        var first = phoneme_array.shift();
        phoneme_array.push(first);
        phoneme_array.push("eɪ");
        result += "<phoneme alphabet='ipa' ph='" + phoneme_array.join() + "'>" + word + "</phoneme>"
    }

    // Turn the CMU Dict symbols to IPA
    return result;
}

module.exports = Translator; 