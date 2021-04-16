sap.ui.define([
  "sap/ui/core/Control"
], function (Control) {
  return Control.extend("webc.Injector", {
    metadata: {
      properties: {
        name: "string",
        module: "string",
        iframeuri: "string",
        iframeattrs: "object",
      }
    },
    init: function () {
    },
    renderer: {
      apiVersion: 2,
      render(oRM, oControl) {
        oRM.openStart('ngel-injector', oControl);
        if (oControl.getName()) {
          oRM.attr('name', oControl.getName());
        }
        if (oControl.getModule()) {
          oRM.attr('module', oControl.getModule());
        }
        if (oControl.getIframeuri()) {
          oRM.attr('iframeuri', oControl.getIframeuri());
        }
        if (oControl.getIframeattrs()) {
          try {
            oRM.attr('iframeattrs', JSON.stringify(oControl.getIframeattrs()));
          } catch (e) {
          }
        }
        oRM.openEnd();
        oRM.close('ngel-injector');
      }
    }
  });
});
