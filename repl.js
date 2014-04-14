/*
 * 	nanolisp v0.1
 *	Author: mion
 */

CodeMirror.commands.save = function () { alert('Saving...'); }

var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
	lineNumbers: true,
	mode: "clojure",
	tabSize: 2,
	matchBrackets: true,
	theme: "mdn-like"
});

var output = CodeMirror.fromTextArea(document.getElementById("output"), {
	mode: "clojure",
	tabSize: 2,
	readOnly: true
});