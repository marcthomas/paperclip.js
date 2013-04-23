// Generated by CoffeeScript 1.6.2
var AttributesExpression,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AttributesExpression = (function(_super) {
  __extends(AttributesExpression, _super);

  AttributesExpression.prototype._type = "attributes";

  /*
  */


  function AttributesExpression(items) {
    AttributesExpression.__super__.constructor.call(this, items);
  }

  /*
  */


  AttributesExpression.prototype.toString = function() {
    var attr, buffer, _i, _len, _ref;

    buffer = [];
    _ref = this.items;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      attr = _ref[_i];
      buffer.push(attr);
    }
    return buffer.join(".");
  };

  return AttributesExpression;

})(require("./collection"));

module.exports = AttributesExpression;