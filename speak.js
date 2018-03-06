var edge = require('edge-js');
var util = require('util');

// edge/cs solution source:
// http://www.techresx.com/programming/nodejs-edge-dotnet-speech-synthesizer/

module.exports = util.promisify(edge.func('cs', function () {/*
    #r "C:\Program Files\Reference Assemblies\Microsoft\Framework\v3.0\System.Speech.dll"
 
    using System.Speech.Synthesis;
 
    async (input) => {
        SpeechSynthesizer synth = new SpeechSynthesizer();
        synth.Speak(input.ToString());
        return "Speech successfully played";
    }
*/}));
 