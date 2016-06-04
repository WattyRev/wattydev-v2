import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'form',

    /**
     * The image being edited.
     *
     * @property image
     * @type {Image}
     */
    image: null,

    /**
     * Instance of the images service.
     *
     * @property imagesService
     * @type {Ember.Service}
     */
    imagesService: Ember.inject.service('images'),

    /**
     * Instance of the permalink service.
     *
     * @property permalinkService
     * @type {Ember.Service}
     */
    permalinkService: Ember.inject.service('permalink'),

    /**
     * The full url for the image.
     *
     * @property fullImageUrl
     * @type {String}
     */
    fullImageUrl: Ember.computed('permalinkService.baseImageUrl', 'image.url', 'image.file', function () {
        if (this.get('image.url')) {
            return this.get('permalinkService.baseImageUrl') + this.get('image.url');
        }
        if (this.get('image.file')) {
            return 'data:image/png;base64,' + this.get('image.file');
        }
        return null;
    }),

    /**
     * Save the record.
     *
     * @method save
     * @return {Void}
     */
    saveImage: Ember.on('submit', function(event) {
        this.set('loading', true);
        event.preventDefault();
        this.get('imagesService').save(this.get('image')).then(id => {
            this.set('loading', false);
            this.sendAction('saved', id);
        });
    }),

    /**
     * Rollback changes when the component is destroyed.
     *
     * @method _revertChanges
     * @return {Promise}
     * @private
     */
    _revertChanges: Ember.on('willDestroyElement', function () {
        if (this.get('image.id')) {
            return this.get('imagesService').rollback(this.get('image'));
        }
    }),

    /**
     * Are we currently loading something?
     *
     * @property loading
     * @type {Boolean}
     */
    loading: false,

    /**
     * Disable form submission.
     *
     * @property disableSubmission
     * @type {Boolean}
     */
    disableSubmission: Ember.computed('loading', 'image.file', 'image.url', function () {
        return this.get('loading') || (!this.get('image.url') && !this.get('image.file'));
    }),

    actions: {
        /**
         * Select the contents of the url input.
         *
         * @method selectUrl
         * @return {Void}
         */
        selectUrl() {
            this.$('.url-input').select();
        },

        /**
         * Delete the image.
         *
         * @method delete
         * @return {Void}
         */
        delete() {
            this.set('loading', true);
            this.get('imagesService').delete(this.get('image.id'));
            this.sendAction('deleted');
        }
    }
});
