import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'a',

    attributeBindings: ['type'],

    /**
     * Show the modal by default.
     *
     * @property show
     * @type {Boolean}
     * @default false
     */
    show: false,

    /**
     * The name of the component to use inside the modal.
     *
     * @property component
     * @type {String}
     * @required
     */
    component: null,

    /**
     * The data to pass to the component.
     *
     * @property data
     * @type {Any}
     */
    data: null,

    /**
     * The size of the modal to use.
     * Accepts small, medium, or large
     *
     * @property size
     * @type {String}
     * @default 'medium'
     */
    size: 'medium',

    /**
     * The class to use on the modal to indicate size.
     *
     * @property sizeClass
     * @type {String}
     */
    sizeClass: Ember.computed('size', function () {
        switch(this.get('size')) {
            case 'large':
                return 'modal-lg';
            case 'medium':
                return '';
            case 'small':
                return 'modal-sm';
        }
    }).readOnly(),

    /**
     * Is the modal currently in the dom?
     *
     * @property modalInDom
     * @type {Boolean}
     * @default false
     */
    modalInDom: false,

    /**
     * Is the modal currently visible?
     *
     * @property modalShowing
     * @type {Boolean}
     * @default false
     */
    modalShowing: false,

    /**
     * Make the body fixed when the modal is visible.
     *
     * @method _toggleFixedBody
     * @return {Void}
     * @private
     */
    _toggleFixedBody: Ember.observer('modalShowing', function () {
        let showing = this.get('modalShowing');
        if (showing) {
            Ember.$('body:not(.modal-open)').addClass('modal-open');
        } else {
            Ember.$('body').removeClass('modal-open');
        }
    }),

    /**
     * If show is set to true, open the modal.
     *
     * @method _showOnStart
     * @return {Void}
     * @private
     */
    _showOnStart: Ember.on('didInsertElement', function () {
        if (this.get('show')) {
            this.showModal();
        }
    }),

    /**
     * Watch for clicks on the overlay.
     *
     * @method _watchForOverlayClick
     * @return {Void}
     * @private
     */
    _watchForOverlayClick() {
        Ember.$('.modal').on('click', this, this._evaluateForOverlayClick);
    },

    /**
     * Stop watching for clicks on the overlay.
     *
     * @method _stopWatchingForOverlayClick
     * @return {Void}
     * @private
     */
    _stopWatchingForOverlayClick() {
        Ember.$('.modal').off('click', this._evaluateForOverlayClick);
    },

    /**
     * Evaluate if the user clicked the overlay.
     *
     * @method _evaluateForOverlayClick
     * @return {Void}
     * @private
     */
    _evaluateForOverlayClick(event) {
        let self = event.data;
        let target = Ember.$(event.target);
        if (!target.hasClass('modal-dialog') && !target.parents('.modal-dialog').length) {
            self.hideModal({ message: 'cancel' });
        }
    },

    /**
     * Show the modal.
     *
     * @method showModal
     * @return {Void}
     */
    showModal: Ember.on('click', function () {
        this.set('modalInDom', true);
        Ember.run.next(() => {
            if (!this.isDestroyed) {
                this.set('modalShowing', true);
                this._watchForOverlayClick();
            }
        });
    }),

    /**
     * Hide the modal.
     *
     * @method hideModal
     * @return {Void}
     */
    hideModal(response) {
        this.set('modalShowing', false);
        this._stopWatchingForOverlayClick();
        Ember.run.next(() => {
            if(!this.isDestroyed) {
                this.set('modalInDom', false);
                this.sendAction('onClose', response);
            }
        });
    },

    actions: {
        /**
         * Hide the modal.
         *
         * @method hideModal
         * @return {Void}
         */
        hideModal(response) {
            this.hideModal(response);
        }
    }
});
