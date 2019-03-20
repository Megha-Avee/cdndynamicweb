"use strict";
// >>> Frontpage JS File
function frontpg() {
  // Run on document ready >>
  $(document).ready(function() {
  //document.addEventListener("turbolinks:load", function() {

    // -------------------------
    // START: Framesizing for border/shadded boxes with images >>
    function framesizing(imgframecontainer, imgframeborder) {
      // $(window).on("load", function() {
      // document.addEventListener("turbolinks:load", function() {
        console.log('in the loop');
        console.log(imgframecontainer, imgframeborder);
        $(imgframeborder).css('height', $(imgframecontainer).height());
        $(imgframeborder).css('width', $(imgframecontainer).width());

        $(window).resize(function(){
          $(imgframeborder).css('height', $(imgframecontainer).height());
          $(imgframeborder).css('width', $(imgframecontainer).width());
        });
      // });
    };
    // Get all elements with a data-border attribute
    for (let elem of $('[data-border')) {
      if (elem !== undefined) {
        console.log(elem);
        framesizing('#'+elem.id, '#'+elem.dataset.border);
      };
    };
    // << END: Framesizing for border/shadded boxes with images
    // -------------------------
    // START: Count timer code >>
    function rollit(rollelementid) {
      let firstgo = 0;
      if (($(window).scrollTop() > $(rollelementid).offset().top - $(window).height()) && $(rollelementid).data("roller")) {
        // Start the counter only when you scroll to the element
        let rolldata = $(rollelementid).data('roller').split(" ");
        $(rollelementid).removeData("roller");
        $(rollelementid).removeAttr("data-roller");

        let startcount = parseFloat(rolldata[0]) || 0;
        let endcount = parseFloat(rolldata[1]) || 0;
        let countby = parseFloat(rolldata[2]) || 1;
        let refreshtime = parseFloat(rolldata[3]) || 10;
        let decimalplaces = parseInt(rolldata[4]) || 0;

        // Interval function does the count down/up
        var timerfunc = setInterval(function() {
            if (parseFloat(startcount.toFixed(5)) > parseFloat(endcount.toFixed(5))) {
              startcount = startcount - countby;
              $(rollelementid).html(startcount.toFixed(decimalplaces));
            } else if (parseFloat(startcount.toFixed(5)) < parseFloat(endcount.toFixed(5))) {
              startcount = startcount + countby;
              $(rollelementid).html(startcount.toFixed(decimalplaces));
            } else {clearInterval(timerfunc)};
        }, refreshtime);
      };
    };

    function rollitonscroll(rollelementid) {
        $(window).scroll(() => {
          if ($(rollelementid)[0] !== undefined) {
            rollit(rollelementid);
          };
        });
      };

    function rollvalue(rollelementid) {
      if ($(rollelementid).offset().top < $(window).height()) {
        rollit(rollelementid);
      }
      else {
        rollitonscroll(rollelementid);
      };
    };
    // Run the timer for all elements with a span and data-roller item
    for (let elem of $('[data-roller')) {
      if (elem !== undefined) {
        rollvalue('#' + elem.id);
      };
    };
    // END: << Count timer code
    // -------------------------


    function animate({timing, draw, duration}) {

      let start = performance.now();
      // console.log(start);

      requestAnimationFrame(function animate(time) {
        // timeFraction goes from 0 to 1
        let timeFraction = (time - start) / duration;
        if (timeFraction > 1) timeFraction = 1;

        // calculate the current animation state
        let progress = timing(timeFraction);

        draw(progress); // draw it

        if (timeFraction < 1) {
          requestAnimationFrame(animate);
        }

      });
    };

    var a = [];

    for (let elem of $('[data-bouncyanimation')) {
      if (document.getElementById(elem.id)) {

        console.log(elem.id);

        let durationtoanimate = 1000;

        let intervaltime = elem.dataset.bouncyanimation || 1000;
        if (elem.dataset.bouncyanimation < 1000) {let intervaltime = 1000}
        else {intervaltime = elem.dataset.bouncyanimation};

        $('#'+elem.id).removeData("bouncyanimation");
        $('#'+elem.id).removeAttr("data-bouncyanimation");

        if (elem.dataset.animationdirection == 'up') {
          document.getElementById(elem.id).style.marginTop = document.getElementById(elem.id).clientHeight*0.5 + 'px';
        };

        function intervalfunc() {
          if (document.getElementById(elem.id)) {
          animate({
            duration: durationtoanimate,
            timing(timeFraction) {
              return (Math.sin(timeFraction*Math.PI));
            },
            draw(progress) {
              if (document.getElementById(elem.id)) {
                if (elem.dataset.animationdirection == 'down') {
                  document.getElementById(elem.id).style.marginTop = document.getElementById(elem.id).clientHeight*0.5*progress + 'px';
                } else if (elem.dataset.animationdirection == 'up') {
                  document.getElementById(elem.id).style.marginTop = document.getElementById(elem.id).clientHeight*0.5*(1-progress) + 'px';
                } else if (elem.dataset.animationdirection == 'left') {
                  document.getElementById(elem.id).style.marginRight = document.getElementById(elem.id).clientHeight*0.5*progress + 'px';
                } else {
                  document.getElementById(elem.id).style.marginLeft = document.getElementById(elem.id).clientHeight*0.5*progress + 'px';
                };
                // console.log(progress);
                document.getElementById(elem.id).style.opacity = 1-progress/2;
                // console.log("drawing animation");
              };
            }
          });
        } else {clearInterval(animationinterval)};
        };
        a.push(setInterval(intervalfunc, intervaltime));
        console.log(a);
      };
    };

  // END: << Bouncy animation
  // -------------------------
  // START: Speech Transcriber

  function speechtranscriber(speechbutton, diagnostic) {

    if (navigator.vendor != "Google Inc.") {
      document.body.querySelector('#errormsg').innerHTML = "Note: The speech recognizer is compatible with Google Chrome only!"
    }

    var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
    var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
    var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

    // var colors = [ 'aqua' , 'azure' , 'beige', 'bisque', 'black', 'blue', 'brown', 'chocolate', 'coral'];
    // var grammar = '#JSGF V1.0; grammar colors; public <color> = ' + colors.join(' | ') + ' ;'
    let grammar = '#JSGF V1.0 ;'

    let recognition = new SpeechRecognition();
    let speechRecognitionList = new SpeechGrammarList();

    speechRecognitionList.addFromString(grammar, 1);

    recognition.grammars = speechRecognitionList;
    //recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    let prevtext = speechbutton.innerHTML;
    let interimtext = '';
    let currentlylistening = false;

    function getoriginalplaceholder(tempmessage) {
      if (diagnostic.value != undefined) {
        diagnostic.value = tempmessage;
        setTimeout(function() {diagnostic.value = ''}, 2000);
      };
    }

    speechbutton.onclick = function() {
      if (currentlylistening==false) {
        recognition.start();
        currentlylistening = true;
        interimtext = '';
        speechbutton.innerHTML = '<i class="fas fa-spinner fa-pulse"></i>';
        // speechbutton.innerHTML = '<div class="spinner-grow text-secondary" role="status" <span class="sr-only"></span> </div>';
        console.log('Ready to receive a color command.');
      } else {
        recognition.stop();
        currentlylistening = false;
        speechbutton.innerHTML = prevtext;
      }
    };

    recognition.onresult = function(event) {
      console.log(event.results[0]);
      var last = event.results.length - 1;
      if (event.results[last]['isFinal']) {
        var text = event.results[last][0].transcript;
        // getoriginalplaceholder(text);
         diagnostic.value = text;
      } else if(event.results[0][0].confidence > 0.5) {
        console.log(event.results[0][0].confidence > 0.5);
        interimtext = event.results[last][0].transcript;
        diagnostic.value = interimtext;
      }
      // bg.style.backgroundColor = color;
      console.log('Confidence: ' + event.results[0][0].confidence);
    };

    recognition.onspeechend = function() {
      speechbutton.innerHTML = prevtext;
      recognition.stop();
    };

    recognition.onnomatch = function(event) {
      speechbutton.innerHTML = prevtext;
      getoriginalplaceholder('I could not transcribe that! Sorry!');
    };

    recognition.onerror = function(event) {
      speechbutton.innerHTML = prevtext;
      console.log('Error occurred in recognition: ' + event.error);
      getoriginalplaceholder('Error occurred in recognition: ' + event.error);
    };
  };

  for (let elem of document.body.querySelectorAll('[data-speechinput]')) {
    // var speechbutton = document.body.querySelector('#speechinputbutton');
    // var diagnostic = document.querySelector('#speechinputout');
    speechtranscriber(document.body.querySelector('#' + elem.id),
                      document.body.querySelector('#' + elem.dataset.speechinput));
  };

  // END: << Speech Transcriber
  // -------------------------

  }); // << End of document ready function

// console.log("in the self invoke fn");
};

var mutationObserver = new MutationObserver(function(mutations) {
  console.log("reload frontpg");
  frontpg();
  mutations.forEach(function(mutation) {
    // console.log(mutation);
  });
});

// Starts listening for changes in the root HTML element of the page.
mutationObserver.observe(document.documentElement, {
  // addedNodes: true
   // attributes: false,
   characterData: false,
   childList: true,
   subtree: false,
   attributeOldValue: false,
   characterDataOldValue: false,
   attributeFilter: ["data-roller", "data-border", "data-bouncyanimation", "data-speechinput"]
});
