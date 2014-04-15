(function (exports) {
	/*
	 * 	nanolisp v0.1
	 *	Author: mion
	 */

	var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
		value: "(def square (fn (x) (* x x)))",
		lineNumbers: true,
		mode: "clojure",
		tabSize: 2,
		vimMode: true,
    showCursorWhenSelecting: true,
    autoCloseBrackets: true,
		matchBrackets: true
	});

	var output = CodeMirror.fromTextArea(document.getElementById("output"), {
		mode: "clojure",
		tabSize: 2,
		readOnly: true,
		theme: "mdn-like"
	});

	var run = function () {
		var input = editor.getValue();
		var result = evaluate(input);
		console.log(result);
		output.setValue(result.toString());
	};

	// CodeMirror.commands.save = function () {
	// 	run();
	// };
	// CodeMirror.commands.evalFile = function (cm) {
	// 	run();
	// };

	CodeMirror.keyMap.default['Cmd-Enter'] = function (cm) {
		run();
	};

	exports.run = run;
})(window);