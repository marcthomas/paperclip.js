// Generated by CoffeeScript 1.6.2
var BlockWriter, Clip, ClipBinding, blockBindingFactory, loaf, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

loaf = require("loaf");

blockBindingFactory = require("../bindings/block/factory");

Clip = require("../../clip");

ClipBinding = require("../bindings/clip");

BlockWriter = (function(_super) {
  __extends(BlockWriter, _super);

  function BlockWriter() {
    this.write = __bind(this.write, this);    _ref = BlockWriter.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  /*
  */


  BlockWriter.prototype.write = function(script, contentFactory, childBlockFactory) {
    var childTpl, clip, section, tpl, _ref1;

    tpl = contentFactory ? this.template.creator(contentFactory) : void 0;
    childTpl = childBlockFactory ? this.template.creator(childBlockFactory) : void 0;
    section = loaf(this.nodeFactory);
    clip = new Clip({
      script: script,
      watch: false
    });
    (_ref1 = this.bindings).push.apply(_ref1, blockBindingFactory.getBindings({
      section: section,
      clip: clip,
      template: tpl,
      nodeFactory: this.nodeFactory,
      childBlockTemplate: childTpl
    }));
    return section.toFragment();
  };

  return BlockWriter;

})(require("./base"));

module.exports = BlockWriter;