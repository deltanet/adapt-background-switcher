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

			this.disableSmoothScrolling();

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

				$blockElement.attr('data-backgroundswitcher', id).addClass('background-switcher-block');
				$blockElement.on('onscreen.background-switcher', this.onBlockInview);

				var options = blockModel.get('_backgroundSwitcher');

				var $backGround = $('<div class="background-switcher-background" style="background-image: url('+ options.src +');"></div>');
				this.$backgroundContainer.prepend($backGround);
				this.$backgrounds[id] = $backGround;

				$blockElement.find('.block-inner').addClass('background-switcher-block-mobile').css({'background-image': 'url('+ options.mobileSrc +')'});
				this.$blockElements[id] = $blockElement;
			}.bind(this));

			this._activeId = this._firstId;

			this.showBackground();
		},

		setupBackgroundContainer : function() {
			this.$backgroundContainer = $('<div class="background-switcher-container"></div>');
			this.$el.addClass('background-switcher-active');
			this.$el.prepend(this.$backgroundContainer);
		},

		/**
		 * Turn off smooth scrolling in IE and Edge to stop the background from flickering on scroll
		 */
		disableSmoothScrolling: function() {
			var browser = Adapt.device.browser;

			if (browser !== 'internet explorer' && browser !== 'microsoft edge') return;

			$('body').on('wheel', function(event) {
				event.preventDefault();

				window.scrollTo(0, window.pageYOffset + event.originalEvent.deltaY);
			});
		},

		onBlockInview: function(event, measurements) {
			var $target = $(event.target);
			var id = $target.attr('data-backgroundswitcher');

			if (this.$blockElements[id].hasClass('visibility-hidden')) return;

			var isOnscreenY = measurements.percentFromTop < 80 && measurements.percentFromTop > 0;
			var isOnscreenX = measurements.percentInviewHorizontal == 100;
			var isOnscreen = measurements.onscreen;

			if (!isOnscreenY || !isOnscreenX || !isOnscreen) return;

			if (this._activeId === id) return;

			this._activeId = id;

			this.showBackground();
		},

		showBackground: function() {
			if(Modernizr.csstransitions){
				this.$('.background-switcher-background.active').removeClass('active');
				this.$backgrounds[this._activeId].addClass('active');
			}
			else {
				this.$('.background-switcher-background.active').animate({opacity:0}, 1000, function(){ $(this).removeClass('active'); });
				this.$backgrounds[this._activeId].animate({opacity:1}, 1000, function(){ $(this).addClass('active'); });
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
		}
	});

	Adapt.on('pageView:postRender', function(view) {
		var model = view.model;
		if (model.get('_backgroundSwitcher') && model.get('_backgroundSwitcher')._isActive) {
			new BackgroundSwitcherView({model: model, el: view.el });
		}
	});

});
