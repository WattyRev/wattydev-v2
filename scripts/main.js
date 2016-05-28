// Initial setup for page
var WD = {};
$(function () {
    Object.keys(WD).forEach(function (key) {
        var module = WD[key];
        if (module.init && $.isFunction(module.init)) {
            module.init();
        }
    });
});

WD.Main = {
    /**
     * Initialzation.
     *
     * @method init
     * @return {Void}
     */
    init: function () {
        this._watchContact();
    },

    /**
     * Watch actions for the contact form.
     *
     * @method _watchContact
     * @return {Void}
     * @private
     */
    _watchContact: function () {
        $('.show-contact').click(this._showContactForm);
        $('.contact-form .overlay').click(this._hideContactForm);
        $('.contact-form .modal-close').click(this._hideContactForm);
        $('.contact-form form').submit(this, this._submitContactForm);
    },

    /**
     * Display the contact form.
     *
     * @method _showContactForm
     * @return {Void}
     * @private
     */
    _showContactForm: function () {
        $('.contact-form:not(.in)').addClass('in');
        setTimeout(function () {
            $('.contact-form:not(.visible)').addClass('visible');
        }, 1);
    },

    /**
     * Hide the contact form.
     *
     * @method _hideContactForm
     * @return {Void}
     * @private
     */
    _hideContactForm: function () {
        $('.contact-form.visible').removeClass('visible');
        setTimeout(function () {
            $('.contact-form.in').removeClass('in');
            $('.contact-form.sent').removeClass('sent');
        }, 300);
    },

    /**
     * Submit the contact form.
     *
     * @method _submitContactForm
     * @return {Void}
     * @private
     */
    _submitContactForm: function (e) {
        e.preventDefault();
        $('.contact-form:not(.loading)').addClass('loading').removeClass('failed');
        $('.contact-form input, .contact-form textarea, .contact-form button').prop('disabled', true);
        var promise = $.post('http://wattydev.com/site/contact.php', {
            email: $('#contact-email').val(),
            subject: $('#contact-subject').val(),
            message: $('#contact-message').val()
        });
        promise.always(function () {
            $('.contact-form.loading').removeClass('loading');
            $('.contact-form input, .contact-form textarea, .contact-form button').prop('disabled', false);
        });
        promise.done(function () {
            $('.contact-form input, .contact-form textarea, .contact-form button').val('');
            $('.contact-form:not(.sent)').addClass('sent');
            setTimeout(function () {
                e.data._hideContactForm();
            }, 3000);
        });
        promise.fail(function () {
            $('.contact-form:not(.failed)').addClass('failed');
        });
    }
};
