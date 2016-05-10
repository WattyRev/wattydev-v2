import Ember from 'ember';
import ImageModel from 'wattydev-admin/models/image';

export default Ember.Service.extend({
    /**
     * Instance of the API service.
     *
     * @property apiService
     * @type {Ember.Service}
     */
    apiService: Ember.inject.service('api'),

    /**
     * Get the list of images.
     *
     * @method getImages
     * @return {Promise}
     */
    getImages() {
        if (this.get('images.length')) {
            return Ember.RSVP.resolve(this.get('images'));
        }
        return this.get('apiService').getImages().then(data => {
            let images = Ember.makeArray(data.images).map(image => ImageModel.create(image));
            this.set('images', images);
            return images;
        });
    },

    /**
     * Refresh the images.
     *
     * @method refresh
     * @return {Promise}
     */
    refresh() {
        this.set('images', Ember.makeArray());
        return this.getImages();
    },

    /**
     * The list of images currently cached.
     *
     * @property images
     * @type {Image[]}
     */
    images: Ember.makeArray(),

    /**
     * Get a specific image by id.
     *
     * @method getImage
     * @param {Number} id The id of the image to get
     * @return {Promise}
     */
    getImage(id) {
        if (this.get('images.length')) {
            return this.get('images').findBy('id', id);
        }
        return this.get('apiService').getImage(id).then(image => image ? ImageModel.create(image) : null);
    },

    /**
     * Create a new image.
     *
     * @method createNew
     * @return {Image}
     */
    createNew() {
        return ImageModel.create();
    }
});
