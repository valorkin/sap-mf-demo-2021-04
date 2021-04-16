sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"../model/formatter"
], function (BaseController, JSONModel, History, formatter) {
	"use strict";
	var _aValidTabKeys = ["Info", "Suppliers", "Items"];
	//var sObjectId, sViewobj, stotalRFQS;

	return BaseController.extend("com.sap.sapui5POC.controller.Object", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit : function () {
			// Model used to manipulate control states. The chosen values make sure,
			// detail page is busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			var //iOriginalBusyDelay,
				oViewModel = new JSONModel({
					busy : true,
					delay : 0,
					title : ""
				});

			this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);

			// Store original busy indicator delay, so it can be restored later on
			//iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
			this.setModel(oViewModel, "objectView");
			/*
			this.getOwnerComponent().getModel().metadataLoaded().then(function () {
					// Restore original busy indicator delay for the object view
					oViewModel.setProperty("/delay", iOriginalBusyDelay);
				}
			);
			*/


		},

			onUpdateFinished : function (Model) {
				var oModel=this.getView().getModel(Model);
				var oData= this.getView().getModel(Model).getData();
					for (var i = 0; i < oData.length; i++) {
						oData[i]['index'] = parseInt(i + 1);
					}
					oModel.setData(oData);
					sap.ui.getCore().setModel(oModel, Model);
			},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */


		/**
		 * Event handler  for navigating back.
		 * It there is a history entry we go one step back in the browser history
		 * If not, it will replace the current entry of the browser history with the worklist route.
		 * @public
		 */
		onNavBack : function() {
			var sPreviousHash = History.getInstance().getPreviousHash();

			if (sPreviousHash !== undefined) {
				history.go(-1);
			} else {
				this.getRouter().navTo("worklist", {}, true);
			}
		},

		onLinkPressed : function () {
			this.getRouter().navTo("worklist");
		},

		onItemPress: function (oEvent) {
			this.getRouter().navTo("supplier", {
				supplierContactsObj:JSON.stringify(oEvent.getSource().getBindingContext("suppliers").getProperty("contacts")),
				 supplierId: oEvent.getSource().getBindingContext("suppliers").getProperty("id"),
				 supplierName:oEvent.getSource().getBindingContext("suppliers").getProperty("name"),
				 totalSuppliers:oEvent.getSource().getBindingContext("suppliers").getModel().getData().length
			});
		},
		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
		_onObjectMatched : function (oEvent) {
			var oArgs, oView, oQuery;
			this.sObjectId =  oEvent.getParameter("arguments").objectId;
			this.sViewobj =  oEvent.getParameter("arguments").viewObj;
			this.stotalRFQS = oEvent.getParameter("arguments").totalRFQS;
			var a = JSON.parse(this.sViewobj);
			if (this.sViewobj){
				var oModel = new JSONModel(a); // Only set data here.
				this.getView().setModel(oModel, "data");
			}
			if (this.sObjectId) {
				var oViewModel = this.getModel("objectView");
				oViewModel.setProperty("/title", this.sObjectId);
			}

			oArgs = oEvent.getParameter("arguments");
			oView = this.getView();
			oQuery = oArgs["?query"];
			if (oQuery && _aValidTabKeys.indexOf(oQuery.tab) > -1){
				oView.getModel("objectView").setProperty("/selectedTabKey", oQuery.tab);
			} else {
				// the default query param should be visible at all time
				this.getRouter().navTo("object", {
					viewObj: this.sViewobj,
				    objectId: this.sObjectId,
				    totalRFQS : this.stotalRFQS,
					query: {
						tab : _aValidTabKeys[0]
					}
				},true /*no history*/);
			}
		},
		/**
		 * We use this event handler to update the hash in case a new tab is selected.
		 * @param {sap.ui.base.Event} oEvent event
		 */
		onTabSelect : function (oEvent) {
			/*
			var oCtx = this.getView().getBindingContext();
			var oArgs = oEvent.getParameter("arguments");
			*/
			this.getRouter().navTo("object", {
				viewObj: this.sViewobj,
				objectId: this.sObjectId,
				totalRFQS : this.stotalRFQS,
				query: {
					tab : oEvent.getParameter("selectedKey")
				}
			}, true /*without history*/);
		 },

		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {string} sObjectPath path to the object to be bound
		 * @private
		 */
		_bindView : function (sObjectPath) {
			var oViewModel = this.getModel("objectView");//,
				//oDataModel = this.getModel();

			this.getView().bindElement({
				path: sObjectPath,
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function () {
						//oDataModel.metadataLoaded().then(function () {
							// Busy indicator on view should only be set if metadata is loaded,
							// otherwise there may be two busy indications next to each other on the
							// screen. This happens because route matched handler already calls '_bindView'
							// while metadata is loaded.
							oViewModel.setProperty("/busy", true);
						//});
					},
					dataReceived: function () {
						oViewModel.setProperty("/busy", false);
					}
				}
			});

		},

		_onBindingChange : function () {
			var oView = this.getView(),
				oViewModel = this.getModel("objectView"),
				oElementBinding = oView.getElementBinding();

			// No data for the binding
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("objectNotFound");
				return;
			}

			var oResourceBundle = this.getResourceBundle(),
				oObject = oView.getBindingContext('rfqs').getObject(),
				sObjectId = oObject.title,
				sObjectName = oObject.title;


			oViewModel.setProperty("/shareSendEmailSubject",
			oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
			oViewModel.setProperty("/shareSendEmailMessage",
			oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));

		}

	});

});
