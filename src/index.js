import {transpile} from "typescript";
import * as Decoders from "decoders";
import hljs from "highlight.js";
import javascript from "highlight.js/lib/languages/javascript"
import 'highlight.js/styles/github.css';

globalThis.Decoders = Decoders;
globalThis.D = Decoders;
hljs.registerLanguage('javascript', require('highlight.js/lib/languages/javascript'));

const res = transpile(`
interface User {
  name: string;
  id: number;
}

class UserAccount {
  name: string;
  id: number;
 
  constructor(name: string, id: number) {
    this.name = name;
    this.id = id;
  }
}
// const res = Decoders.either(Decoders.string, Decoders.number).verify({});
// console.log(res);
`);

function initEditor(editor) {
  editor.addEventListener("input", (e) => {
    hljs.registerLanguage('javascript', javascript);
    const restorePosition = saveCaretPosition(editor);
    delete editor.dataset.highlighted;
    const highlight = hljs.highlight(
      editor.textContent,
      { language: 'javascript' }
    );
    editor.innerHTML = highlight.value;
    restorePosition();
  });
}

const decodersEditor = document.querySelector("#decoders");
const verificationEditor = document.querySelector("#verification");
initEditor(decodersEditor);
initEditor(verificationEditor);
// decodersEditor.addEventListener("input", (e) => {
//   hljs.registerLanguage('javascript', javascript);
//   const restorePosition = saveCaretPosition(decodersEditor);
//   delete decodersEditor.dataset.highlighted;
//   const highlight = hljs.highlight(
//     decodersEditor.textContent,
//     { language: 'javascript' }
//   );
//   decodersEditor.innerHTML = highlight.value;
//   restorePosition();
// });


// Cursor management - start //
function saveCaretPosition(context){
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  range.setStart(  context, 0 );
  const len = range.toString().length;

  return () => {
      var pos = getTextNodeAtPosition(context, len);
      selection.removeAllRanges();
      var range = new Range();
      range.setStart(pos.node ,pos.position);
      selection.addRange(range);

  }
}

// TODO: Simplify
function getTextNodeAtPosition(root, index){
  const NODE_TYPE = NodeFilter.SHOW_TEXT;
  const treeWalker = document.createTreeWalker(root, NODE_TYPE, function next(elem) {
      if(index > elem.textContent.length){
          index -= elem.textContent.length;
          return NodeFilter.FILTER_REJECT
      }
      return NodeFilter.FILTER_ACCEPT;
  });
  const c = treeWalker.nextNode();
  return {
      node: c? c: root,
      position: index
  };
}

// Cursor management - end //

const resultEditor = document.querySelector("#result");
const runButton = document.querySelector("#verify");

runButton.addEventListener("click", (e) => { 
  const decoderCode = `const decoder = ${decodersEditor.textContent}
  decoder.verify(${verificationEditor.textContent})`;
  console.log("decoderCode", decoderCode);
  let res = "";
  try {
    res = JSON.stringify(eval(decoderCode), null, 2);
  } catch(e) {
    res = e.message;
  }
  resultEditor.textContent = res;
});

// Remove formatting on paste
function removeFormattingOnPaste(el) {
  el.addEventListener("paste", (e) => {
    e.preventDefault();
    var text = '';
    if (e.clipboardData || e.originalEvent.clipboardData) {
      text = (e.originalEvent || e).clipboardData.getData('text/plain');
    } else if (window.clipboardData) {
      text = window.clipboardData.getData('Text');
    }
    if (document.queryCommandSupported('insertText')) {
      document.execCommand('insertText', false, text);
    } else {
      document.execCommand('paste', false, text);
    }
  });
}
removeFormattingOnPaste(decodersEditor);
removeFormattingOnPaste(verificationEditor);



console.log(eval(res));