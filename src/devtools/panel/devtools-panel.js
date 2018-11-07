/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

const STYLING_ATTRIBUTE = "__devtools_outlined";
const EVAL_CLEAR_OUTLINES =
  `[...document.querySelectorAll("[${STYLING_ATTRIBUTE}]")].forEach(node => {
    node.removeAttribute("${STYLING_ATTRIBUTE}");
  });`;
const EVAL_SET_OUTLINE_ATTRIBUTE = `$0.setAttribute("${STYLING_ATTRIBUTE}", true);`;

const browser = window.browser || chrome;

const outlineButtonEl = document.querySelector("#outline");
const clearButtonEl = document.querySelector("#clear");

function outlineAllElements() {
  browser.devtools.inspectedWindow.eval(EVAL_CLEAR_OUTLINES + EVAL_SET_OUTLINE_ATTRIBUTE);
}

function clearOutlines() {
  browser.devtools.inspectedWindow.eval(EVAL_CLEAR_OUTLINES);
}

function getCurrentSelectionInfo() {
  return browser.devtools.inspectedWindow.eval(
    `[
       $0.querySelectorAll("*").length,
       $0.nodeName,
       $0.attributes
         ? { id: $0.id, classes: [...$0.classList] }
         : { id: null, classes: [] }
     ]`
  );
}

function createNodePreview(nodeName, { id, classes }) {
  const preview = document.createElement("span");
  preview.classList.add("node-preview");

  const name = document.createElement("span");
  name.classList.add("tag");
  name.textContent = nodeName.toLowerCase();
  preview.appendChild(name);

  if (id) {
    const attribute = document.createElement("span");
    attribute.classList.add("attribute", "id");
    attribute.textContent = "#" + id;
    preview.appendChild(attribute);
  }

  if (classes && classes.length) {
    const attribute = document.createElement("span");
    attribute.classList.add("attribute", "class");
    attribute.textContent = "."+ classes.join(".");
    preview.appendChild(attribute);
  }

  return preview;
}

function updateUI() {
  getCurrentSelectionInfo().then(([result, error]) => {
    if (error) {
      throw new Error(error);
      return;
    }

    const [ nbDescendants, nodeName, attributes ] = result;
    outlineButtonEl.innerHTML = "";
    outlineButtonEl.appendChild(document.createTextNode("Outline"));
    outlineButtonEl.appendChild(createNodePreview(nodeName, attributes));
    if (nbDescendants > 1) {
      outlineButtonEl.appendChild(
        document.createTextNode(`and ${nbDescendants} descendants`));
    } else if (nbDescendants === 1) {
      outlineButtonEl.appendChild(
        document.createTextNode(`and 1 child element`));

    }
  })
}

outlineButtonEl.addEventListener("click", outlineAllElements);
clearButtonEl.addEventListener("click", clearOutlines);
setInterval(updateUI, 1000);
