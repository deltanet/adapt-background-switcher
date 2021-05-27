define([
  'core/js/adapt'
], function(Adapt) {

  var BackgroundSwitcherView = Backbone.View.extend({

    _blockModels: null,
    $backgroundContainer: null,
    $backgrounds: null,
    $blockElements: null,
    _firstId: null,
    _activeId: null,

    initialize: function() {
      _.bindAll(this, 'onBlockInview');

      this._blockModels = _.filter(this.model.findDescendantModels('blocks'), function(model) {
        return model.get('_backgroundSwitcher');
      });

      if (this._blockModels.length === 0) {
        this.onRemove();
        return;
      }

      this.listenTo(Adapt, {
        'pageView:ready': this.onPageReady,
        remove: this.onRemove
      });

      this.setupBackgroundContainer();
    },

    onPageReady: function() {
      this.$blockElements = {};
      this.$backgrounds = {};

      this._blockModels.forEach(function(blockModel) {
        var id = blockModel.get('_id');

        if (!this._firstId) this._firstId = id;

        var $blockElement = this.$el.find('.'+ id);

        $blockElement.attr('data-backgroundswitcher', id).addClass('has-background-switcher-image');
        $blockElement.on('onscreen.background-switcher', this.onBlockInview);

        var parentId = blockModel.get('_parentId');
        $('.'+parentId).addClass('background-switcher-active');

        var options = blockModel.get('_backgroundSwitcher');

        var $backGround = $('<div class="background-switcher__item" style="background-image: url('+ options.src +');"></div>');
        this.$backgroundContainer.prepend($backGround);
        this.$backgrounds[id] = $backGround;

        this.$blockElements[id] = $blockElement;
      }.bind(this));

      this._activeId = this._firstId;

      this.showBackground();
    },

    setupBackgroundContainer: function() {
      this.$backgroundContainer = $('<div class="background-switcher__container"></div>');
      $('body').addClass('background-switcher-active');
      $('body').prepend(this.$backgroundContainer);
    },

    onBlockInview: function(event, measurements) {
      var isOnscreen = measurements.percentFromTop < 80 && measurements.percentFromBottom < 80;
      if (!isOnscreen) return;

      var $target = $(event.target);
      var id = $target.attr('data-backgroundswitcher');

      if (this._activeId === id) return;

      this._activeId = id;

      this.showBackground();
    },

    showBackground: function() {
      if (Modernizr.csstransitions){
        $('.background-switcher__item.is-active').removeClass('is-active');
        this.$backgrounds[this._activeId].addClass('is-active');
      }
      else {
        $('.background-switcher__item.is-active').animate({ opacity: 0 }, 500, function(){ $(this).removeClass('is-active'); });
        this.$backgrounds[this._activeId].animate({ opacity: 1 }, 500, function(){ $(this).addClass('is-active'); });
      }
    },

    onRemove: function () {
      for (var id in this.$blockElements) {
        this.$blockElements[id].off('onscreen.background-switcher');
      }
      this.$blockElements = null;
      this.$backgroundContainer = null;
      this.$backgrounds = null;
      this._blockModels = null;

      this.remove();
    },

    remove: function() {
      Adapt.trigger('plugin:beginWait');

      _.defer(_.bind(function() {
        this.$el.off('onscreen.adaptView');
        this._isRemoved = true;
        this.model.setOnChildren('_isReady', false);
        this.model.set('_isReady', false);
        $('.background-switcher__container').remove();
        this.stopListening();
        Adapt.trigger('plugin:endWait');
      }, this));

      return this;
    }

  });

  Adapt.on('pageView:postRender', function(view) {
    var model = view.model;
    if (model.get('_backgroundSwitcher') && model.get('_backgroundSwitcher')._isActive) {
      new BackgroundSwitcherView({model: model, el: view.el });
    }
  });

});
