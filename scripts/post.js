WD.Post = {
    /**
     * Initialization.
     *
     * @method init
     * @return {Void}
     */
    init: function () {
        if (!$('.post').length) {
            return;
        }
        this._sizeEmbed();
        this._watchResize();
    },

    _watchResize: function () {
        $(window).resize(this, this._sizeEmbed);
    },

    _sizeEmbed: function () {
        if ($('.video').length) {
            return;
        }
        var iframe = $('iframe');
        if (!iframe.length) {
            return;
        }

        var sectionHeight = $('.preview').height();
        if (iframe.width() < iframe.parent().width() && iframe.height() < sectionHeight) {
            return;
        }

        var scalex = iframe.parent().width() / iframe.width();
        var scaley = sectionHeight / iframe.height();
        scale = scalex < scaley ? scalex : scaley;
        iframe.css('transform', 'scale(' + scale + ')');

        // center horizontally
        if (scalex === scale) {
            // Don't do anything if scaled horizontally.
            return;
        }

        var iframeWidth = iframe[0].getBoundingClientRect().width;
        var containerWidth = iframe.parent().width();
        var margin = (containerWidth - iframeWidth) / 2;
        iframe.css('margin-left', margin);
        console.log(scale);
    }
};
