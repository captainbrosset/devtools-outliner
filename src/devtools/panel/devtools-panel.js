/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

const STYLING_ATTRIBUTE = "__devtools_outlined";

const browser = window.browser || chrome;

function outlineAllElements() {
  browser.devtools.inspectedWindow.eval(
    `[...document.querySelectorAll("[${STYLING_ATTRIBUTE}]")].forEach(node => {
      node.removeAttribute("${STYLING_ATTRIBUTE}");
    });
    $0.setAttribute("${STYLING_ATTRIBUTE}", true);`
  );
}

function clearOutlines() {
  browser.devtools.inspectedWindow.eval(
    `[...document.querySelectorAll("[${STYLING_ATTRIBUTE}]")].forEach(node => {
      node.removeAttribute("${STYLING_ATTRIBUTE}");
    });`
  );
}

const outlineButtonEl = document.querySelector("#outline");
const clearButtonEl = document.querySelector("#clear");

outlineButtonEl.addEventListener("click", outlineAllElements);
clearButtonEl.addEventListener("click", clearOutlines);
