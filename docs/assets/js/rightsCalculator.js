(() => {
	const NUM_COLUMNS = 3;

	// Grab it from the above markdown table and parse it. Simply don't have multiple tables in the page lol
	const rights =
		// grab the table data elements
		[...document.querySelectorAll("td")]
			.map((x) => x.innerText) // get their content
			.map(
				(x, i) =>
					x.indexOf("<<") == 2 // if this column is the `value` column
						? x.split(" ").reverse()[0] // get the value we shift by
						: x, // otherwise dont do anything
			);

	const mount = document.getElementById("rights-container");
	const outputMount = document.getElementById("rights-output");
	var calculated = 0n;

	const calcBitsFromInput = () => {
		const value = BigInt(outputMount.value);
		calculated = value;

		for (const div of mount.children) {
			const toggle = div.children[0];
			const flag = BigInt(toggle.getAttribute("id"));
			toggle.checked = ((value >> flag) & 1n) != 0n;
		}
	};

	outputMount.addEventListener("input", calcBitsFromInput);

	for (var i = 0; i < rights.length; i += NUM_COLUMNS) {
		const name = rights[i];
		const shift = rights[i + 1];
		const desc = rights[i + 2];

		const div = document.createElement("div");
		const input = document.createElement("input");
		input.setAttribute("type", "checkbox");
		input.setAttribute("id", shift);
		const label = document.createElement("label");
		label.setAttribute("for", input.id);
		label.innerText = name.toUpperCase();

		div.appendChild(input);
		div.appendChild(label);

		mount.append(div);

		input.addEventListener("click", (event) => {
			const value = 1n << BigInt(event.target.getAttribute("id"));

			// bit messy, oh well
			if (value == 1n) {
				if (event.target.checked) {
					for (var elem of mount.children) {
						elem.children[0].setAttribute("disabled", true);
					}
					event.target.removeAttribute("disabled");

					calculated++;
					outputMount.value = "1";
					return;
				} else {
					for (var elem of mount.children) {
						elem.children[0].removeAttribute("disabled");
					}
					outputMount.value = --calculated;
					return;
				}
			}

			calculated = event.target.checked
				? calculated + value
				: calculated - value;

			outputMount.value = calculated;
		});
	}

	// if you reload the page, your input is still present.
	calcBitsFromInput();
})();
