import Ember from 'ember';

export default Ember.Component.extend({
    /**
     * The full list of images.
     *
     * @property images
     * @type {Ember.Object[]}
     */
    images: null,

    /**
     * Instance of the permalink service.
     *
     * @property permalinkService
     * @type {Ember.Service}
     */
    permalinkService: Ember.inject.service('permalink'),

    /**
     * The base url for the images directory.
     *
     * @property publicRoot
     * @type {String}
     * @readOnly
     */
    baseUrl: Ember.computed('permalinkService.{publicRoot,imagesPath}', function () {
        return this.get('permalinkService.publicRoot') + this.get('permalinkService.imagesPath');
    }).readOnly(),

    /**
     * The five most recently created images.
     *
     * @property recentImages
     * @type {Ember.Object[]}
     */
    recentImages: Ember.computed('images.@each', function () {
        let images = Ember.makeArray(this.get('images'));
        return images.sortBy('created').slice(0, 5);
    })
});
