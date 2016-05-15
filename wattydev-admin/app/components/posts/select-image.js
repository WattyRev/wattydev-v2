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
     * Is the value currently empty?
     *
     * @property emptyValue
     * @type {Boolean}
     */
    emptyValue: Ember.computed('value', function () {
        return this.get('value') === '0';
    }),

    /**
     * Instance of the permalink service.
     *
     * @property permalinkService
     * @type {Ember.Service}
     */
    permalinkService: Ember.inject.service('permalink'),

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
            value = value || Ember.Object.create({id: '0'});
            this.set('value', value.get('id'));
            return value;
        }
    }),

    /**
     * The full url of the currently selected image.
     *
     * @property imageUrl
     * @type {String}
     */
    imageUrl: Ember.computed('image.url', function () {
        return this.get('permalinkService.baseImageUrl') + this.get('image.url');
    }),

    actions: {
        doneEditing(response) {
            this.set('image', response.image);
        }
    }
});
