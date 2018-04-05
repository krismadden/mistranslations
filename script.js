var lang = ['sq','am','ar','hy','az','eu','be','bn','bs','bg','ca','ceb','ny','zh-CN','zh-TW','co','hr','cs','da','nl','en','eo','et','tl','fi','fr','fy','gl','ka','de','el', 'gu', 'ht', 'ha', 'haw', 'iw', 'hi', 'hmn', 'hu', 'is', 'ig', 'id', 'ga', 'it', 'ja', 'jw', 'kn', 'kk', 'km', 'ko', 'ku', 'ky', 'lo', 'la', 'lv', 'lt', 'lb', 'mk', 'mg', 'ms', 'ml', 'mt', 'mi', 'mr', 'mn', 'my', 'ne', 'no', 'ps', 'fa', 'pl', 'pt','ro', 'ru', 'sm', 'sr', 'st', 'sn', 'sd', 'si', 'sk', 'sl', 'es', 'su', 'sw', 'sv', 'tg', 'ta', 'te', 'th', 'tr', 'uk', 'ur', 'uz', 'vi', 'cy', 'xh', 'yi', 'yo', 'zu','en']; //'so', 
            // 'gd' has problems with '
var key = "[Your Key Here]"; //put your own key here!
//var lagguageTo;
var translationArray = [];
var numtranslations = 4; //translates number - 1 times. 
var x;
//var startlang;
var lastlang = [];
var isdone = true;

$(document).ready(function(){

  setText("Hello, world!");

  $( "#button" ).click(function() {
    console.log('click')
    $(this).addClass( "onclic");
    letsgo();
  });

  $(document).keypress(function(e) {
      if (e.which == 13) {
          $( "#button" ).addClass( "onclic");
          letsgo();
      }
  });
});



function letsgo(){
  restart();
  getDefault(lang[0], translationArray[0]);
}

function getData(target, source, text, x, numtranslations){
  $.ajax({ 
    type: 'GET', 
    url: 'https://www.googleapis.com/language/translate/v2?key=' + key + '&source=' + source +'&target=' + target + '&q=' + text , 
    data: { get_param: 'value' }, 
    dataType: 'jsonp',
    crossDomain: true, 
    success: function (data) { 
      $.each( data.data, function( i, item ) { // Iterate through each data values
        var translationText = item[0].translatedText;
        var defaultlang = item[0].detectedSourceLanguage;
        translationArray.push(translationText);
        $('.sourceText').removeClass("sourceText");
        document.getElementById("sourceText").value = translationText;
        console.log(" from " + source + " to " + target + "     " + translationText);
        lastlang.push(target);
        if(x==0){
          console.log("first " + text, defaultlang);
          //push this to a new file????
        }else if(x == numtranslations - 1){
          console.log("last " + translationText, target);
          run = true;
          done();
          //push this to a new file????
        }
      });
    },
    error: function() { 
      console.log(target + " error here");
      //alert('Failed!'); 
    },
  });
}


function getDefault(target, text){
  $.ajax({ 
    type: 'GET', 
    url: 'https://www.googleapis.com/language/translate/v2?key=' + key + '&target=' + target + '&q=' + text , 
    data: { get_param: 'value' }, 
    dataType: 'jsonp',
    crossDomain: true, 
    success: function (data) { 
      $.each( data.data, function( i, item ) { // Iterate through each data values
        var defaultlang = item[0].detectedSourceLanguage;
        //window.setTimeout(function(){
          lastlang.push(defaultlang);
          console.log(lastlang);
        //}, 100); 
        for(x=0; x<numtranslations; x++){ //x<numtranslations
          (function(x){
            window.setTimeout(function(){
              if(x == numtranslations-1){
                console.log('if == 4', lastlang[0])
                getData(lastlang[0], lastlang[x], translationArray[x], x, numtranslations);
              }else{
                var z = Math.floor(Math.random()*lang.length);
                console.log('else', lang[z])
                getData(lang[z], lastlang[x], translationArray[x], x, numtranslations);
              }
            }, x * 650); //650
          }(x));      
        }
      });
    },
    error: function() { 
      console.log(target + " error here");
      //alert('Failed!'); 
    },
  });
}

//run this when the button is first clicked or enter is pressed.
function restart(){
  resetTimer();
  errorTimer();
  $('#cursor').hide();
  translationArray = [];
  lastlang = [];
  translationArray.push(document.getElementById('sourceText').value);
}

function resetTimer(){
  setTimeout(function(){
    setText("Hi, everybody!");
    restart();
  },60000); //1 minute
}

function errorTimer(){
  if(isdone == false){
    done();
    setTimeout(function(){
    setText("Well this is embarrassing... please try again.");
    restart();
    },5000); //5 seconds
    setTimeout(function(){
      setText("Hello, Worldz.");
      restart();
    },10000); //5 seconds after timer above
  }
}

function setText(text){
  var sourceTextDiv = document.getElementById("sourceText");
  sourceTextDiv.value = text;
  sourceTextDiv.focus();
}


// run this when the translations have finished.
function done(){

  $('#cursor').show();
  $('#sourceText').focus();
  console.log(lastlang);
  console.log("done");
  isdone = true;

  setTimeout(function() {
    $( "#button" ).removeClass( "onclic" );
    $( "#button" ).addClass( "validate");
  }, 10 );

  setTimeout(function() {
    $( "#button" ).removeClass( "validate" );
  }, 900 );

}
