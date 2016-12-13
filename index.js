/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/**
 * This simple sample has no external dependencies or session management, and shows the most basic
 * example of how to create a Lambda function for handling Alexa Skill requests.
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, tell Hello World to say hello"
 *  Alexa: "Hello World!"
 */

/**
 * App ID for the skill
 */
var APP_ID = "amzn1.ask.skill.1eb6a6ce-c949-46d2-9a3d-fa3eb94865bb"; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";

/**
 * The AlexaSkill prototype and helper functions
 */
require('dotenv').config();
var storage = require('./storage');
var AlexaSkill = require('./AlexaSkill');
var Translator = require('./translator');
var translator = new Translator();

var Wunderground = require('node-weatherunderground');

/**
 * HelloWorld is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var HelloWorld = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
HelloWorld.prototype = Object.create(AlexaSkill.prototype);
HelloWorld.prototype.constructor = HelloWorld;

HelloWorld.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("HelloWorld onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

HelloWorld.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("HelloWorld onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    var speechOutput = "Welcome to Pig Latin Translator.";
    var repromptText = "You can ask for the weather in a city and state, or say a phrase to be translated.";
    response.ask(speechOutput, repromptText);
};

HelloWorld.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("HelloWorld onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

HelloWorld.prototype.intentHandlers = {
    // register custom intent handlers
    "AMAZON.HelpIntent": function (intent, session, response) { 
        response.ask("You can speak a phrase to be translated into Pig Latin, or you can ask the weather in a specific city and state. For example, say 'what is the weather in Seattle Washington'. You can say 'stop' to end. What would you like to translate?"); 
    }, 
    "AMAZON.StopIntent": function (intent, session, response) { 
        response.tell("Goodbye."); 
    }, 
    "PhraseIntent": function (intent, session, response) {
        translator.translate(intent.slots.phrase.value, "PigLatin", function(result){
            // speechOutput, cardTitle, cardContent
            response.tellWithCard("Here is your phrase in Pig Latin: " + result, "Translate Result", "phrase: " + intent.slots.phrase.value + "\nresult:" + result.speech);
        });
    },
    "WeatherIntent": function (intent, session, response) {
        // Get the 
        var client = new Wunderground(process.env.API_KEY, intent.slots.city.value, intent.slots.state.value);
        client.forecast('', function(err, data){
            console.log("result", err, JSON.stringify(data));
            // If it worked
            var string = "";
            if(err || data.txt_forecast === undefined) {
                console.log(err);
                string = "Could not find " + intent.slots.city.value + ", " + intent.slots.state.value + ". What would you like to translate?";
                translator.translate(string, "PigLatin", function(result){
                    // speechOutput, cardTitle, cardContent
                    response.askWithCard(string, "eather-way", "phrase: " + string + "\nresult:" + result.speech);
                });
            } else {
                for( var i = 0; i < data.txt_forecast.forecastday.length; i++ ) {
                    var day = data.txt_forecast.forecastday[i];
                    string += day.title + ", " + day.fcttext + "\n";
                }
                storage.loadUser(session, function(userData){
                    userData.data.slots = intent.slots;
                    userData.save(function(){
                        translator.translate(string, "PigLatin", function(result){
                            // speechOutput, cardTitle, cardContent
                            response.tellWithCard("Here is your phrase in Pig Latin: " + result, "eather-way", "phrase: " + string + "\nresult:" + result.speech);
                        });
                    });
                });
            }
        });
    },
    "StoredWeatherIntent": function (intent, session, response) {
        storage.loadUser(session, function(userData) {
            intent.slots = session.attributes.currentUser.slots;

            if(!session.attributes.currentUser) {
                response.ask("What city and state would you like the weather?", "What city and state would you like the weather?");
            } else {
                // Get the city/state from storage
                for( var i = 0; i < data.txt_forecast.forecastday.length; i++ ) {
                    var day = data.txt_forecast.forecastday[i];
                    string += day.title + ", " + day.fcttext + "\n";
                }
                translator.translate(string, "PigLatin", function(result){
                    // speechOutput, cardTitle, cardContent
                    response.tellWithCard(result, "eather-way", "phrase: " + string + "\nresult:" + result.speech);
                });
            }

        });
    },

};

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the HelloWorld skill.
    var helloWorld = new HelloWorld();
    helloWorld.execute(event, context);
};
