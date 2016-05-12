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
     * The base url for posts.
     *
     * @property publicRoot
     * @type {String}
     * @readOnly
     */
    baseUrl: Ember.computed('permalinkService.{publicRoot,imagesPath}', function () {
        return this.get('permalinkService.publicRoot') + this.get('permalinkService.imagesPath');
    }).readOnly(),
});
