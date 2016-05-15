import Ember from 'ember';

export default Ember.Component.extend({
    /**
     * The currently selected value.
     *
     * @property value
     * @type {String}
     */
    value: null,

    /**
     * Instance of the permalink service.
     *
     * @property permalinkService
     * @type {Ember.Service}
     */
    parmalinkService: Ember.inject.service('parmalink'),

    /**
     * Instance of the images service.
     *
     * @property imagesService
     * @type {Ember.Service}
     */
    imagesService: Ember.inject.service('images'),

    /**
     * The currently selected image.
     *
     * @property image
     * @type {Image}
     */
    image: Ember.computed('value', 'imagesService.data.@each', {
        get() {
            this.get('imagesService.data').findBy('id', this.get('value'));
        },
        set(key, value) {
            this.set('value', value.get('id'));
        }
    }),

    imageUrl: Ember.computed('image', function () {
        return this.get('permalink.publicRoot') + this.get('permalink.imagesPath') + this.get('image.url');
    }),

    actions: {
        doneEditing() {

        }
    }
});
