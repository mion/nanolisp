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

	exports.output = CodeMirror.fromTextArea(document.getElementById("output"), {
		mode: "clojure",
		tabSize: 2,
		readOnly: true,
		theme: "mdn-like"
	});

	var history = [];
	var interpret = function(input) {
		console.log(sprintf("Interpreting: %s", input));
		var result = evaluate(input);
		console.log(result);
		output.setValue(result.toString());
	};

	$( "#repl" ).keypress(function(event) {
		if (event.which == 13) {
			event.preventDefault();
			interpret( $(this).val() );
			$(this).val("");
		}
	});

	// CodeMirror.commands.save = function () {
	// 	run();
	// };
	// CodeMirror.commands.evalFile = function (cm) {
	// 	run();
	// };

	CodeMirror.keyMap.default[ 'Cmd-Enter' ] = function( cm ) {
		var input = editor.getValue();
		interpret( input );
	};

	// exports.run = run;
})( window );