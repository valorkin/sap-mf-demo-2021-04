sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/model/odata/v2/ODataModel",
	"com/sap/sapui5POC/test/localService/mockserver"
], function(Opa5, ODataModel, mockserver) {
	"use strict";

	return Opa5.extend("com.sap.sapui5POC.test.integration.arrangements.Startup", {

		/**
		 * Initializes mock server, then starts the app component
		 * @param {object} oOptionsParameter An object that contains the configuration for starting up the app
		 * @param {integer} oOptionsParameter.delay A custom delay to start the app with
		 * @param {string} [oOptionsParameter.hash] The in-app hash can also be passed separately for better readability in tests
		 * @param {boolean} [oOptionsParameter.autoWait=true] Automatically wait for pending requests while the application is starting up
		 */
		iStartMyApp : function (oOptionsParameter) {
			var oOptions = oOptionsParameter || {};

			this._clearSharedData();

			// start the app with a minimal delay to make tests fast but still async to discover basic timing issues
			oOptions.delay = oOptions.delay || 1;

			// configure mock server with the current options
			var oMockServerInitialized = mockserver.init(oOptions);

			this.iWaitForPromise(oMockServerInitialized);
			// start the app UI component
			this.iStartMyUIComponent({
				componentConfig: {
					name: "com.sap.sapui5POC",
					async: true
				},
				hash: oOptions.hash,
				autoWait: oOptions.autoWait
			});
		},
		iRestartTheAppWithTheRememberedItem : function (oOptions) {
			var sObjectId;
			this.waitFor({
				success : function () {
					sObjectId = this.getContext().currentItem.id;
				}
			});

			this.waitFor({
				success : function() {
					oOptions.hash = "ProcOrdConf2/" + encodeURIComponent(sObjectId);
					this.iStartMyApp(oOptions);
				}
			});
		},
		_clearSharedData: function () {
			// clear shared metadata in ODataModel to allow tests for loading the metadata
			ODataModel.mSharedData = { server: {}, service: {}, meta: {} };
		}
	});
});
