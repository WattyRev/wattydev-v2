import Ember from 'ember';

export default Ember.Object.extend({
    /**
     * Instance of the API service.
     *
     * @property apiService
     * @type {Ember.Service}
     */
    apiService: Ember.inject.service('api'),

    /**
     * Instance of the images service.
     *
     * @property imagesService
     * @type {Ember.Service}
     */
    imagesService: Ember.inject.service('images'),

    /**
     * The id of the image.
     *
     * @property id
     * @type {String}
     */
    id: null,

    /**
     * The title of the image.
     *
     * @property title
     * @type {String}
     */
    title: null,

    /**
     * A description of the image.
     *
     * @property description
     * @type {String}
     */
    description: null,

    /**
     * A url tha references the image.
     *
     * @property url
     * @type {String}
     */
    url: null,

    /**
     * The image file as a base64 encoded png.
     *
     * @property file
     * @type {String}
     */
    file: null,

    /**
     * The date that the image was created.
     *
     * @property created
     * @type {String}
     */
    created: null,

    /**
     * The date that the image was created.
     *
     * @property createdDate
     * @type {DateTime}
     * @readOnly
     */
    createdDate: Ember.computed('created', function () {
        return new Date(this.get('created'));
    }).readOnly(),

    /**
     * Delete the image.
     *
     * @method delete
     * @return {Promise}
     */
    delete() {
        Ember.assert('Cannot delete an image that has not been saved yet.', this.get('id'));
        return this.get('apiService').deleteItem('image', this.get('id'));
    },

    /**
     * Save the image.
     *
     * @method save
     * @return {Promise}
     */
    save() {
        if (this.get('id')) {
            return this._createImage();
        }
        return this._updateImage();
    },

    /**
     * Rollback any unsaved changes.
     *
     * @method rollback
     * @return {Promise}
     */
    rollback() {
        Ember.assert('Cannot rollback a new image.', this.get('id'));
        return this.get('apiService').getImage(this.get('id')).then(image => {
            this.setProperties(Ember.$.extend({
                file: null
            }, image));

            return this;
        });
    },

    /**
     * Save the image as a new item.
     *
     * @method _createImage
     * @return {Promise}
     * @private
     */
    _createImage() {
        return this.get('apiService').addItem('image', {
            title: this.get('title'),
            description: this.get('description'),
            file: this.get('file')
        }).then(response => {
            // Update the model
            this.set('id', response.id);
            this.set('file', null);

            // Add the saved image to the images service
            let imagesService = this.get('imagesService');
            if (imagesService.get('data.length')) {
                let images = imagesService.get('data');
                images.push(this);
                imagesService.set('data', images);
            }
            return response.id;
        });
    },

    /**
     * Update the image record in the database.
     *
     * @method _updateImage
     * @return {Promise}
     * @private
     */
    _updateImage() {
        let image = {
            id: this.get('id'),
            description: this.get('description'),
            title: this.get('title')
        };
        if (this.get('file')) {
            image.file = this.get('file');
        }
        return this.get('apiService').updateItem('image', image).then(() => {
            this.set('file', null);
        });
    }
});
