let ignoredTags = new Set([
  "PRE",
  "CODE",
  "H1",
  "H2",
  "H3",
  "H4",
  "H5",
  "H6",
  "TABLE",
  "PICTURE",
  "IFRAME",
  "SVG",
  "CANVAS",
  "BUTTON",
  "FORM",
]);

/**
 * @param {HTMLElement} root 
 */
function highlightSentences(root) {
  wrapWords(root);
  paintWords();
}

function paintWords() {
  let hues = [];
  hues[0] = hues[1] = hues[2] = 60;
  hues[3] = hues[4] = 300;
  hues[5] = hues[6] = 0;
  hues[7] = hues[8] = hues[9] = hues[10] = hues[11] = hues[12] = 120;
  hues.push(180);

  let words = document.querySelectorAll("span.word");
  /**
   * @type {HTMLSpanElement[]}
   */
  let sentence = [];

  for (let word of words) {
    sentence.push(word);

    if (/[.!?]$/.test(word.textContent)) {
      highlight();
      sentence = [];
    }
  }

  // Highlight whatever's left as the final sentence.
  highlight();

  function highlight() {
    let count = sentence.length;
    let hue = count in hues ? hues[count] : hues[hues.length - 1];
    let color = `hsla(${hue}, 93%, 90%, 50%)`;
    for (let word of sentence) {
      word.style.backgroundColor = color;
      word.style.boxShadow = `0.2em 0 ${color}, -0.2em 0 ${color}`;
    }
  }
}

/**
 * @param {HTMLElement} element
 */
function wrapWords(element) {
  let childNodes = Array.from(element.childNodes);

  for (let node of childNodes) {
    if (node instanceof Text) {
      let text = node.textContent;
      let words = text.split(/( )/g);

      let wrappedNodes = words.map(word => {
        if (/^\s*$/.test(word)) {
          return document.createTextNode(word);
        } else {
          let span = document.createElement("span");
          span.innerText = word;
          span.className = "word";
          return span;
        }
      });

      node.replaceWith(...wrappedNodes);
    } else if (node instanceof HTMLElement) {
      if (!ignoredTags.has(node.tagName)) {
        wrapWords(node);
      }
    }
  }
}

let painted = false;

if (!painted) {
  painted = true;
  highlightSentences(document.body);
}
