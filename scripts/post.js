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
    },

    _sizeEmbed: function () {
        if ($('.video').length) {
            return;
        }
        var iframe = $('iframe');
        if (!iframe.length) {
            return;
        }

        if (iframe.width() < iframe.parent().width()) {
            return;
        }

        var scale = iframe.parent().width() / iframe.width();
        iframe.css('transform', 'scale(' + scale + ')');
    }
};
