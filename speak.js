var path = require('path');
var edge = require('edge-js');

// edge/cs solution source:
// http://www.techresx.com/programming/nodejs-edge-dotnet-speech-synthesizer/

var csSpeech = edge.func('cs', function () {/*
    #r "C:\Program Files\Reference Assemblies\Microsoft\Framework\v3.0\System.Speech.dll"
 
    using System.Speech.Synthesis;
 
    async (input) => {
        SpeechSynthesizer synth = new SpeechSynthesizer();
        synth.Speak(input.ToString());
        return "Speech successfully played";
    }
*/});
 
function speak(input, callback) {
    // changing the voice hasn't been implemented
    csSpeech(input, function(error, result) {
        if(error) {
            if(typeof callback !== "undefined") callback(error, result);
            throw error;
        }
        else if(typeof callback !== "undefined") callback(null, result);
    });
}

module.exports = speak;
