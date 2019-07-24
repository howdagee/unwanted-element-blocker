// ==UserScript==
// @name         Unwanted Div Blocker
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Hides containers with class names that are unwanted.
// @author       Jacob Jauregui
// @match        *://*/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.11/lodash.min.js
// @grant        none
// ==/UserScript==


/*jshint multistr: true */
window.addEventListener('load', function() {

    // create a div with an id and class
    createBlockerSnackbar = document.createElement("div");
    createBlockerSnackbar.id = "element-hider";
    createBlockerSnackbar.className = "style-2";

    // attach the div to the inside the body tag
    findBody = document.body;
    findBody.appendChild(createBlockerSnackbar);
    blockerSnackbar = document.getElementById("element-hider");
    blockerSnackbar.addEventListener("mouseleave", resetScrollPos);

            // This will be returned to console after script ends. To show the total bad elements hidden
            badTagsTotal = 0;
            classNames = [];

            // These are the class names which will trigger display none
            const badClassNames = ["modal", "popup", "pop", "overlay", "ad", "ads",
                                "alert", "cookiebanner", "popupally", "blocker",
                                "dialog", "drip", "postMeterBar"];

            var getDivs = document.getElementsByTagName("div");
            for (i=0; i<getDivs.length;i++) {
                if(getDivs[i].hasAttribute("class")) {
                    // console.log("true");
                    classes = getDivs[i].className;
                    //
                    classes = classes.split(/[ -__]+/);
                    if (_.some(badClassNames, (el) => _.includes(classes, el))) {
                        getDivs[i].style.display = "none";
                        badTagsTotal++;
                        className = getDivs[i].className;

                        // index for badElementItem needs to start at zero so
                        // we subtract 1 from badTagsTotal
                        createBadElementItem(className, badTagsTotal -1);
                    }
                } else {
                    //console.log("false");
                }
            }

            console.log("Bad Tags Found:\n" + " " + badTagsTotal);
            if (badTagsTotal > 0) {
                badSnackbar(badTagsTotal);
            }


            setTimeout(function() {
                for (let i=0;i<badTagsTotal;i++) {
                    console.log(classNames[i]);
                    element = document.getElementById("bad-div-" +i);
                    var numberBlocked = document.getElementById("number-blocked");
                    element.addEventListener("click", function(){
                        element = document.getElementsByClassName(classNames[i])[0];
                        if (element.style.display == 'none') {
                            this.style.backgroundColor = 'rgb(2, 106, 0)';
                            currentNumber = parseInt(numberBlocked.innerHTML);
                            numberBlocked.innerHTML = currentNumber - 1;
                            console.log("showing item:\n " + classNames[i]);
                            element.style.display = 'block';
                            return;
                        }
                        if (element.style.display == 'block') {
                            console.log("hiding item:\n " + classNames[i]);
                            this.style.backgroundColor = '#d41010';
                            currentNumber = parseInt(numberBlocked.innerHTML);
                            numberBlocked.innerHTML = currentNumber + 1;
                            element.style.display = 'none';
                            return;
                        }
                    });
                }
            },100);

    });

    function addStyles(str) {
        var node = document.createElement('style');
        node.innerHTML = str;
        document.body.appendChild(node);
    }

    function resetScrollPos() {
            blockerSnackbar.scrollTop = 0;
    }


    function badSnackbar(listTotal) {
            var theList = blockerSnackbar.innerHTML;
            blockerSnackbar.innerHTML = "<div id='number-blocked'>" + listTotal + "</div><div><strong>Elements Blocked:</strong></div>" + theList;
            blockerSnackbar.className = "show-errors";
            setTimeout(function(){ blockerSnackbar.className += " stay"; },
            3000);
    }


    function createBadElementItem(str, index) {
        var badItem = document.createElement("span");
        badItem.id = "bad-div-" + index;
        badItem.innerHTML = str;
        classNames.push(str);
        // findBody = document.body;
        blockerSnackbar.appendChild(badItem);
    }


    addStyles(
    '#element-hider {\
        visibility: hidden;\
        display: block;\
        opacity: .9;\
        background-color: #050505;\
        color: #fff;\
        text-align: center;\
        width 900px;\
        height: 265px;\
        padding: 14px;\
        position: fixed;\
        z-index: 9999;\
        bottom: 50px;\
        right: 50px;\
        box-shadow: 0px 0px 5px #6b6b6b;\
        border-radius: 2px;\
        font-size: 16px;\
        overflow-y: hidden;\
        font-family: monospace;'+
    '}\
    #element-hider span:hover {\
        cursor: pointer;' +
    '}\
    .show-errors {\
        visibility: visible !important;\
        width: 250px;' +
    '}\
    #number-blocked {\
        font-weight: bold;' +
    '}\
    div#element-hider:hover {\
        height: 265px !important;\
        width: 250px !important;\
        animation: all .5 ease;\
        border-radius: 2px !important;\
        line-height: 24px;\
        overflow-y:scroll !important;\
        opacity: .9 !important;' +
    '}\
    #element-hider span {\
        background-color: #d41010;\
        display: block;\
        padding: 2px 6px;\
        margin: 12px 8px;\
        width: auto;\
        max-width: 200px;\
        min-width: 200px;\
        word-wrap: break-word;\
        height: auto;\
        overflow-x: hidden;\
        white-space: normal;' +
    '}\
    #element-hider::-webkit-scrollbar-track {\
	    -webkit-box-shadow: inset 0 0 4px rgba(0,0,0,0.4);\
	    background-color: #050505;\
    }\
    #element-hider::-webkit-scrollbar {\
	    width: 12px;\
	    background-color: #F5F5F5;\
    }\
    #element-hider::-webkit-scrollbar-thumb {\
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);\
        background-color: #1e1e1e;\
    }\
    .stay {\
        width: 50px !important;\
        height: 50px !important;\
        display:block;\
        border-radius: 38px !important;\
        overflow: hidden;\
        word-wrap: unset !important;\
        white-space: nowrap !important;\
        opacity: .35 !important;\
        animation-name: moveDivsBlocked;\
        right: 50px !important;\
        animation-duration: 1.5s;\
        line-height: 28px;' +
    '}\
    @keyframes moveDivsBlocked {\
        0%   {opacity: .9; width: 250px; height: 265px;border-radius: 2px;line-height: 24px;}\
        10%  {opacity: .9;}\
        30% {line-height:24px;}\
        100% {right:50px; opacity: .35; width: 50px; height: 50px; border-radius: 38px;line-height:28px;}' +
        '}\
    ');

