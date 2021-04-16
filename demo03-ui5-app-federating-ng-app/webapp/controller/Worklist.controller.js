sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/base/Log",
	"sap/ui/thirdparty/jquery"
], function (BaseController, JSONModel, formatter, Filter, FilterOperator, Log, jQuery) {
	"use strict";

	return BaseController.extend("com.sap.sapui5POC.controller.Worklist", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		onInit: function () {
			var oJSONModel = this.initSampleDataModel();
			var oView = this.getView();
			oView.setModel(oJSONModel);

			oView.setModel(new JSONModel({
				visibleRowCount: 50
			}), "ui");
			var loadTime = window.performance.timing.domContentLoadedEventEnd-window.performance.timing.navigationStart;
                        console.log('Application load time----'+ loadTime);
		},

		initSampleDataModel: function () {
			var oModel = new JSONModel();

			jQuery.ajax("model/rfqs.json", {
				dataType: "json",
				success: function (oData) {
					var aTemp1 = [];
					var aTemp2 = [];
					var aTemp3 = [];
					var titleData = [];
					var internaldsData = [];
					var statusData = [];
					for (var i = 0; i < oData.length; i++) {
						var oRfq = oData[i];
						oData[i]['index'] = parseInt(i + 1);
						if (oRfq.title && (aTemp1 && Array.prototype.indexOf.call(aTemp1, oRfq.title) < 0)) {
							aTemp1.push(oRfq.title);
							titleData.push({
								Name: oRfq.title
							});
						}
						if (oRfq.internalId && (aTemp2 && Array.prototype.indexOf.call(aTemp2, oRfq.internalId) < 0)) {
							aTemp2.push(oRfq.internalId);
							internaldsData.push({
								Name: oRfq.internalId
							});
						}
						if (oRfq.status && (aTemp3 && Array.prototype.indexOf.call(aTemp3, oRfq.status) < 0)) {
							aTemp3.push(oRfq.status);
							statusData.push({
								Name: oRfq.status
							});
						}
					}

					oData.title = titleData;
					oData.id = internaldsData;
					oData.status = statusData;

					oModel.setData(oData);
					sap.ui.getCore().setModel(oModel, "rfqs");
				},
				error: function () {
					Log.error("failed to load json");
				}
			});

			return oModel;
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Event handler for refresh event. Keeps filter, sort
		 * and group settings and refreshes the list binding.
		 * @param {sap.ui.base.Event} oEvent event
		 */
		onSelectionChange: function (oEvent) {
			var oSource = oEvent.getSource();
			var val = parseInt(oEvent.getParameter("item").getText());
			oSource.getModel().setProperty("/visibleRowCount", val);
		},


		/**
		 * Event handler for the search event.
		 * @param {sap.ui.base.Event} oEvent event
		 */
		onSearch: function (oEvent) {
			if (oEvent.getParameters().refreshButtonPressed) {
				// Search field's 'refresh' button has been pressed.
				// This is visible if you select any master list item.
				// In this case no new search is triggered, we only
				// refresh the list binding.
				this.onRefresh();
			} else {
				var aTableSearchState = [];
				var sQuery = oEvent.getParameter("query");

				if (sQuery && sQuery.length > 0) {
					aTableSearchState = [new Filter("title", FilterOperator.Contains, sQuery)];
				}
				this._applySearch(aTableSearchState);
			}

		},

		/**
		 * Event handler for refresh event. Keeps filter, sort
		 * and group settings and refreshes the list binding.
		 * @public
		 */
		onRefresh: function () {
			var oTable = this.byId("table");
			oTable.getBinding("items").refresh();
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Shows the selected item on the object page
		 * On phones a additional history entry is created
		 * @param {sap.m.ObjectListItem} oItem selected Item
		 * @private
		 */
		_showObject: function (oItem) {
			this.getRouter().navTo("object", {
				viewObj: JSON.stringify(oItem.getBindingContext().getProperty("owner")),
				objectId: oItem.getBindingContext().getProperty("title"),
				totalRFQS:oItem.getBindingContext().getModel().getData().length,
				query: {
						tab : "Info"
					}
			});
		},

		/**
		 * Internal helper method to apply both filter and search state together on the list binding
		 * @param {sap.ui.model.Filter[]} aTableSearchState An array of filters for the search
		 * @private
		 */
		_applySearch: function (aTableSearchState) {
			var oTable = this.byId("table"),
				oViewModel = this.getModel("rfqs");
			oTable.getBinding("columns").filter(aTableSearchState, "Application");
			// changes the noDataText of the list in case there are no filter results
			if (aTableSearchState.length !== 0) {
				oViewModel.setProperty("/tableNoDataText", this.getResourceBundle().getText("worklistNoDataWithSearchText"));
			}
		},
		/**
		 * Event handler when a table item gets pressed
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
		onPress: function (oEvent) {
			this._showObject(oEvent.getSource());

		}

	});
});
