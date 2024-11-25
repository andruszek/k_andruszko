/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/*!*******************!*\
  !*** ./script.ts ***!
  \*******************/


var style = {
  style1: "styleCSS/style1.css",
  style2: "styleCSS/style2.css",
  style3: "styleCSS/style3.css",
  style4: "styleCSS/style4.css"
};
var obecnyStyl = "style1";
function zmianaStylu(nowyStyl) {
  var linkDoStylu = document.querySelector("link[rel='stylesheet']");
  if (linkDoStylu) {
    linkDoStylu.remove();
  }
  var nowyLinkDoStylu = document.createElement("link");
  nowyLinkDoStylu.rel = "stylesheet";
  nowyLinkDoStylu.href = style[nowyStyl];
  document.head.appendChild(nowyLinkDoStylu);
  obecnyStyl = nowyStyl;
  console.log("Zmieniono styl na: ".concat(nowyStyl));
}
function generowaniePrzyciskow() {
  var container = document.querySelector(".przycisk-tekst");
  if (!container) {
    console.error("Brak miejsca na przyciski.");
    return;
  }
  container.innerHTML = "";
  Object.keys(style).forEach(function (style) {
    var button = document.createElement("button");
    button.className = "style-button";
    button.textContent = "".concat(style);
    button.onclick = function () {
      return zmianaStylu(style);
    };
    container.appendChild(button);
  });
}
document.addEventListener("DOMContentLoaded", function () {
  generowaniePrzyciskow();
  console.log("Przyciski gotowe :P");
});
/******/ })()
;