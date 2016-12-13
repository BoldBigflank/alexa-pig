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

var cardinals = {
    "N": "north",
    "NNE": "north northeast",
    "NE": "northeast",
    "ENE": "east northeast",
    "E": "east",
    "ESE": "east southeast",
    "SE": "southeast",
    "SSE": "south southeast",
    "S": "south",
    "SSW": "south southwest",
    "SW": "southwest",
    "WSW":"west southwest",
    "W": "west",
    "WNW": "west northwest",
    "NW": "northwest",
    "NNW": "north northwest"
}

function translatePigLatin(phrase) {
    console.log("translating:", phrase);
    var result = "";

    // Replace numbers to words
    var tempRegex = /(\d+)F/g;
    phrase = phrase.replace(tempRegex, "$1 degrees fahrenheit");

    var negRegex = /-(\d+)/g;
    phrase = phrase.replace(negRegex, "negative $1");

    var precentRegex = /%/g;
    phrase = phrase.replace(percentRegex, " percent ");

    var numberRegex = /(\d+)/g;





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
    console.log("result:", result);
    return result;
}

// Turning numbers to words
var ONE_TO_NINETEEN = [
  "one", "two", "three", "four", "five",
  "six", "seven", "eight", "nine", "ten",
  "eleven", "twelve", "thirteen", "fourteen", "fifteen",
  "sixteen", "seventeen", "eighteen", "nineteen"
];

var TENS = [
  "ten", "twenty", "thirty", "forty", "fifty",
  "sixty", "seventy", "eighty", "ninety"
];

var SCALES = ["thousand", "million", "billion", "trillion"];

// helper function for use with Array.filter
function isTruthy(item) {
  return !!item;
}

// convert a number into "chunks" of 0-999
function chunk(number) {
  var thousands = [];

  while(number > 0) {
    thousands.push(number % 1000);
    number = Math.floor(number / 1000);
  }

  return thousands;
}

// translate a number from 1-999 into English
function inEnglish(number) {
  var thousands, hundreds, tens, ones, words = [];

  if(number < 20) {
    return ONE_TO_NINETEEN[number - 1]; // may be undefined
  }

  if(number < 100) {
    ones = number % 10;
    tens = number / 10 | 0; // equivalent to Math.floor(number / 10)

    words.push(TENS[tens - 1]);
    words.push(inEnglish(ones));

    return words.filter(isTruthy).join("-");
  }

  hundreds = number / 100 | 0;
  words.push(inEnglish(hundreds));
  words.push("hundred");
  words.push(inEnglish(number % 100));

  return words.filter(isTruthy).join(" ");
}

// append the word for a scale. Made for use with Array.map
function appendScale(chunk, exp) {
  var scale;
  if(!chunk) {
    return null;
  }
  scale = SCALES[exp - 1];
  return [chunk, scale].filter(isTruthy).join(" ");
}


module.exports = Translator; 