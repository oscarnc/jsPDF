/**
 * @name layer
 * @module
 */

import { jsPDF } from "../jspdf";

(function(jsPDFAPI) {
  "use strict";

  var namespace = "layer_";

  var putCatalogCallback = function putCatalogCallback() {
    var out = this.internal.write;
    var groups = this.internal.collections[namespace + "groups"];
    if (groups.length > 0) {
      out("/OCProperties <<");
      var groupIds = [];
      for (var i = 0; i < groups.length; i++) {
        groupIds.push(groups[i].id + " 0 R");
      }
      out("/OCGs [" + groupIds.join(" ") + "]");
      out("/D << /BaseState /ON >>");
      out(">>");
    }
  };

  var putResourcesCallback = function putResourcesCallback() {
    var out = this.internal.write;
    var groups = this.internal.collections[namespace + "groups"];
    for (var i = 0; i < groups.length; i++) {
      groups[i].id = this.internal.newObject();
      out("<<");
      out("/Type /OCG");
      out("/Name (" + groups[i].name + ")");
      out(">>");
      out("endobj");
    }
  };

  var putPropertiesDictCallback = function putPropertiesDictCallback() {
    var out = this.internal.write;
    var groups = this.internal.collections[namespace + "groups"];
    for (var i = 0; i < groups.length; i++) {
      out("/OC" + (i + 1) + " " + groups[i].id + " 0 R");
    }
  };

  var initialize = function() {
    if (!this.internal.collections[namespace + "groups"]) {
      this.internal.collections[namespace + "groups"] = [];
      this.internal.events.subscribe("putCatalog", putCatalogCallback);
      this.internal.events.subscribe("putResources", putResourcesCallback);
      this.internal.events.subscribe(
        "putPropertiesDict",
        putPropertiesDictCallback
      );
    }
  };

  /**
   * @name beginLayer
   * @function
   * @param {string} name The name of the new layer.
   * @returns {jsPDF}
   */
  jsPDFAPI.beginLayer = function beginLayer(name) {
    initialize.call(this);
    var groups = this.internal.collections[namespace + "groups"];
    groups.push({
      id: undefined,
      name: name
    });
    this.internal.write("/OC /OC" + groups.length + " BDC");
    return this;
  };

  /**
   * @name endLayer
   * @function
   * @returns {jsPDF}
   */
  jsPDFAPI.endLayer = function endLayer() {
    this.internal.write("EMC");
    return this;
  };
})(jsPDF.API);
