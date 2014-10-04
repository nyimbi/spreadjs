Template.spreadjsBody.rendered = function() {

	$("#spreadjs").css({
		height: window.innerHeight - ($("#layoutHeader").height() + 2) - ($("#spreadjsHeader").height() + 16) - 1,
		width: window.innerWidth + 1
	}).wijspread({sheetCount: 1});

	$(window).resize(function() {
		$("#spreadjs").css({
			height: window.innerHeight - ($("#layoutHeader").height() + 2) - ($("#spreadjsHeader").height() + 16) - 1,
			width: window.innerWidth + 1
		});
	});

	var spreadjs = $("#spreadjs").wijspread("spread");

	// spreadjs.newTabVisible = false;
	spreadjs.useWijmoTheme = true;
	spreadjs.repaint();

	var activeSheet = spreadjs.sheets[0];

	activeSheet.setName("patent index");

	var data_source = _spreadjs.find({}, {sort: {index: 1, time: 1}}).fetch(),
		col_source = [
			{ name: "_id", displayName: "_id", size: 50, visible: false },
			{ name: "index", displayName: "index", size: 50, visible: false },
			{ name: "input", displayName: "input", size: 100 },
			{ name: "status", displayName: "status", size: 50 },
			{ name: "cc", displayName: "cc", size: 50 },
			{ name: "p_no", displayName: "p_no", size: 100 },
			{ name: "kc", displayName: "kc", size: 50 },
			{ name: "pri_date", displayName: "pri_date", size: 100 },
			{ name: "app_date", displayName: "app_date", size: 100 },
			{ name: "p_date", displayName: "p_date", size: 100 },
			{ name: "ipc", displayName: "ipc", size: 100 },
			{ name: "us_class", displayName: "us_class", size: 100 },
			{ name: "concept", displayName: "concept", size: 100 },
			{ name: "keyword", displayName: "keyword", size: 100 },
			{ name: "pat_title", displayName: "pat_title", size: 100 },
			{ name: "assignee", displayName: "assignee", size: 100 },
			{ name: "inventor", displayName: "inventor", size: 100 }
		];

	if(data_source.length == 0)
		for(var A = 0; A < 20; A++)
			_row_insert(A);

	activeSheet.setDataSource(data_source);
	activeSheet.bindColumns(col_source);

	activeSheet.getDefaultStyle().vAlign = $.wijmo.wijspread.VerticalAlign.center;


	// contextmenu

	var contextmenu = { items: [
		{ action: corner_delete, alias: "corner_delete", icon: "../../img/icon.png", text: "delete" },
		{ type: "splitLine" },
		{ alias: "column", icon: "../../img/icon.png", items: [
			{ action: column_erase, alias: "column_erase", icon: "../../img/icon.png", text: "erase" },
			{ action: column_sort, alias: "column_sort", icon: "../../img/icon.png", text: "sort" }
		], text: "column", type: "group", width: 150},
		{ alias: "row", icon: "../../img/icon.png", items: [
			{ action: row_delete, alias: "row_delete", icon: "../../img/icon.png", text: "delete" },
			{ action: row_insert, alias: "row_insert", icon: "../../img/icon.png", text: "insert" }
		], text: "row", type: "group", width: 150},
		{ type: "splitLine" },
		{ alias: "selection", icon: "../../img/icon.png", items: [
			{ action: selection_erase, alias: "selection_erase", icon: "../../img/icon.png", text: "erase" }
		], text: "selection", type: "group", width: 150}
	], onShow: onShow, width: 150 };

	$("#spreadjs").contextmenu(contextmenu);

	function onShow(menu, event) {
		var hitTest = activeSheet.hitTest(event.pageX - $("#spreadjs").offset().left, event.pageY - $("#spreadjs").offset().top);

		switch(hitTest.hitTestType) {

			case ($.wijmo.wijspread.SheetArea.corner):
				activeSheet.setSelection(-1, -1, activeSheet.getRowCount(), activeSheet.getColumnCount());

				menu.applyrule({ disable: true, items: ["row", "column"], name: "corner" });
			break;

			case ($.wijmo.wijspread.SheetArea.colHeader):
				if(activeSheet.getSelections().find(hitTest.row, hitTest.col) == null) {
					activeSheet.setSelection(-1, hitTest.col, activeSheet.getRowCount(), 1);

					menu.applyrule({ disable: true, items: ["corner_delete", "row"], name: "colHeader" });
				}
			break;

			case ($.wijmo.wijspread.SheetArea.rowHeader):
				if(activeSheet.getSelections().find(hitTest.row, hitTest.col) == null) {
					activeSheet.setSelection(hitTest.row, -1, 1, activeSheet.getColumnCount());

					menu.applyrule({ disable: true, items: ["corner_delete", "column"], name: "rowHeader" });
				}
			break;

			case ($.wijmo.wijspread.SheetArea.viewport):
				if(activeSheet.getSelections().find(hitTest.row, hitTest.col) == null) {
					activeSheet.endEdit();

					activeSheet.setActiveCell(hitTest.row, hitTest.col);

					menu.applyrule({ disable: true, items: ["column", "corner_delete"], name: "viewport" });
				}
			break;

		}
	}

	function Action(target, event) {
		/* console.log(this); console.log(this.data); */
	}

	function corner_delete() {
		(activeSheet.getSelections()).forEach(function(A) {
			if(A.col == -1 && A.row == -1)
				for(var B = 0; B < A.rowCount; B++)
					_row_delete(0);
		});
	}

	function column_erase() {
		(activeSheet.getSelections()).forEach(function(A) {
			if(A.col != -1)
				for(var B = 0; B < activeSheet.getRowCount(); B++)
					_cell_value(B, A.col);
		});
	}

	var col_sort = true

	function column_sort() {
		(activeSheet.getSelections()).forEach(function(A) {
			if(A.col != -1)
				activeSheet.sortRange(0, 0, activeSheet.getRowCount(), activeSheet.getColumnCount(), true,
					[{ index: A.col, ascending: col_sort }]
				);
		});

		col_sort = !col_sort;
	}

	function row_delete() {
		(activeSheet.getSelections()).forEach(function(A) {
			if(A.row != -1)
				for(var B = 0; B < A.rowCount; B++)
					_row_delete(A.row);
		});
	}

	function row_insert() {
		(activeSheet.getSelections()).forEach(function(A) {
			if(A.row != -1)
				_row_insert(A.row + A.rowCount);
		});
	}

	function selection_erase() {
		(activeSheet.getSelections()).forEach(function(A) {
			if(A.col != -1 && A.row != -1)
				for(var B = 0; B < A.rowCount; B++)
					for(var C = 0; C < A.colCount; C++)
						_cell_value(A.row + B, A.col + C);
		});
	}


	// linto's method

	function _cell_value(row, col, value, set) {
		if(typeof(row) != "undefined" && typeof(col) != "undefined" && -1 < parseInt(row) && -1 < parseInt(col)) {
			if(typeof(value) == "undefined") value = null;
			if(typeof(set) == "undefined") activeSheet.setValue(row, col, value);

			var A = {};

			A[activeSheet.getDataColumnName(col)] = value;

			_spreadjs.update({_id: data_source[row]["_id"]}, {$set: A});
		}
	}

	function _row_delete(row) {
		if(typeof(row) != "undefined" && -1 < parseInt(row)) {
			var A = data_source[row]["_id"]; // store _id

			activeSheet.deleteRows(row, 1);

			_spreadjs.remove({_id: A/*, taskId: Session.get('taskId'), userId: Meteor.userId()*/});

			if(activeSheet.getRowCount() == 0) _row_insert(0);
			else {
				$.wijmo.wijspread.SpreadActions.navigationUp.call(activeSheet);

				activeSheet.repaint();
			}
		}
	}

	function _row_insert(row) {
		if(typeof(row) != "undefined" && -1 < parseInt(row)) {
			activeSheet.addRows(row , 1);

			data_source[row] = {_id: Random.id(), index: row/*, taskId: Session.get('taskId'), time: moment().format(), userId: Meteor.userId()*/};

			activeSheet.repaint();

			_spreadjs.insert(data_source[row]);
		}
	}


	// db observer

	_spreadjs.find().observeChanges({

		added: function(A, B) {

			var C = -1,
				D = _.find(data_source, function(E) { C++; return (E["_id"] == A); });

			if(typeof(D) == "undefined") {
				var F = (typeof(B["index"]) != "undefined" && parseInt(B["index"]) <= activeSheet.getRowCount()) ? B["index"] : 0;

				var G = activeSheet.getActiveColumnIndex(),
					H = activeSheet.getActiveRowIndex();

				if(activeSheet.isEditing()) {
					if(F <= H) {
						activeSheet.endEdit();

						activeSheet.addRows(F, 1);

						$.wijmo.wijspread.SpreadActions.navigationDown.call(activeSheet);

						activeSheet.startEdit();
					} else activeSheet.addRows(F, 1);
				} else activeSheet.addRows(F, 1);

				B["_id"] = A;

				_.extend(data_source[F], B);

				activeSheet.repaint();

				$("#status").html('<i class="fa fa-check"></i>&nbsp;&nbsp;row ' + (F + 1) + ' inserted ..');
			} // else {} // SERVER INSERT

		},

		changed: function(A, B) {

			var C = -1,
				D = _.find(data_source, function(E) { C++; return (E["_id"] == A); });

			if(typeof(D) != "undefined")
				if(activeSheet.isEditing()) {
					var F = activeSheet.getDataColumnName(activeSheet.getActiveColumnIndex());
					var G = activeSheet.getActiveRowIndex();

					if((!(F in B)) && (G != C)) {
						_.extend(data_source[C], B);

						activeSheet.repaint();

						$("#status").html('<i class="fa fa-check"></i>&nbsp;&nbsp;row ' + (C + 1) + ' edited ..');
					}
				} else {
					_.extend(data_source[C], B);

					activeSheet.repaint();

					$("#status").html('<i class="fa fa-check"></i>&nbsp;&nbsp;row ' + (C + 1) + ' edited ..');
				}

		},

		removed: function(A) {

			var B = -1,
				C = _.find(data_source, function(D) { B++; return (D["_id"] == A); });

			if(typeof(C) != "undefined") {
				var E = activeSheet.getActiveColumnIndex(),
					F = activeSheet.getActiveRowIndex();

				if(activeSheet.isEditing()) {
					if(B < F) {
						activeSheet.endEdit();

						activeSheet.deleteRows(B, 1);

						$.wijmo.wijspread.SpreadActions.navigationUp.call(activeSheet);

						activeSheet.startEdit();
					}

					else if(B == F) {
						activeSheet.endEdit();

						activeSheet.deleteRows(B, 1);
					}

					else activeSheet.deleteRows(B, 1);
				} else activeSheet.deleteRows(B, 1);

				$("#status").html('<i class="fa fa-check"></i>&nbsp;&nbsp;row ' + (B + 1) + ' deleted ..');
			}

		}

	});


	// spreadjs event

	activeSheet.addKeyMap($.wijmo.wijspread.Key.del, false, false, false, false, selection_erase);
	activeSheet.addKeyMap($.wijmo.wijspread.Key.x, false, false, true, false, row_insert);
	activeSheet.addKeyMap($.wijmo.wijspread.Key.z, false, false, true, false, row_delete);

	activeSheet.bind($.wijmo.wijspread.Events.CellChanged, function(event, A) {
		if(A.sheetArea === $.wijmo.wijspread.SheetArea.viewport)
			switch(A.propertyName) {

				case "formula":
					_cell_value(A.row, A.col, activeSheet.getValue(A.row, A.col));
				break;

				case "value":
					_cell_value(A.row, A.col, activeSheet.getValue(A.row, A.col));
				break;

			}
	});
/*
	activeSheet.bind($.wijmo.wijspread.Events.EditEnded, function(_X, A) {
		_cell_value(A.row, A.col, activeSheet.getValue(A.row, A.col));
	});

	activeSheet.bind($.wijmo.wijspread.Events.ClipboardPasting, function(_X, A) {
		if(typeof(A.cellRange) == "object")
			for(var B = 0; B < A.cellRange.rowCount; B++)
				_row_insert(A.cellRange.row + A.cellRange.rowCount + B);
	});
*/
	activeSheet.bind($.wijmo.wijspread.Events.ClipboardPasted, function(_X, A) {
		if(typeof(A.cellRange) == "object")
			for(var B = 0; B < A.cellRange.rowCount; B++)
				for(var C = 0; C < A.cellRange.colCount; C++)
					_cell_value(A.cellRange.row + B, A.cellRange.col + C, activeSheet.getValue(A.cellRange.row + B, A.cellRange.col + C));
	});

}
