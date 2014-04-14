/*
 * 	nanolisp v0.1
 *	Author: mion
 */

CodeMirror.commands.save = function () {
	console.log(editor.save());
};

var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
	value: "(def square (fn (x) (* x x)))",
	lineNumbers: true,
	mode: "clojure",
	tabSize: 2,
	vimMode: true,
    showCursorWhenSelecting: true,
    autoCloseBrackets: true,
	matchBrackets: true,
	// theme: "mdn-like"
});

var output = CodeMirror.fromTextArea(document.getElementById("output"), {
	mode: "clojure",
	tabSize: 2,
	readOnly: true,
	theme: "mdn-like"
});

// output.setValue