import Ember from 'ember';

export default Ember.Component.extend({
    /**
     * The original data value.
     *
     * @property _originalValue
     * @type {String}
     * @private
     */
    _originalValue: Ember.computed(function () {
        return this.get('data');
    }),

    /**
     * Force the _originalValue to populate.
     *
     * @method _saveOriginalValue
     * @return {String}
     * @private
     */
    _saveOriginalValue: Ember.on('didInsertElement', function () {
        return this.get('_originalValue');
    }),

    /**
     * The currently selected value id.
     *
     * @property value
     * @type {String}
     */
    value: Ember.computed.oneWay('data'),

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
     * The currently selected image.
     *
     * @property selectedImage
     * @type {Image}
     */
    selectedImage: Ember.computed('value', {
        get() {
            let image = this.get('imagesService.data').findBy('id', this.get('value'));
            console.log('updating selectedImage', image);
            return image;
        },
        set(key, value) {
            console.log('setting selectedImage', value);
            this.set('value', value.get('id'));
            return value;
        }
    }),

    /**
     * Is an image not currently selected?
     *
     * @property emptySelection
     * @type {Boolean}
     */
    emptySelection: Ember.computed.empty('selectedImage'),

    /**
     * The new image that the user is creating.
     *
     * @property newImage
     * @type {Ember.Object}
     */
    newImage: Ember.Object.create({
        title: '',
        description: '',
        file: ''
    }),

    /**
     * Is the new image currently invalid?
     *
     * @property invalidNewImage
     * @type {Boolean}
     */
    invalidNewImage: Ember.computed('newImage.{title,file}', 'loading', function () {
        return this.get('isLoading') || !this.get('newImage.title') || !this.get('newImage.file');
    }),

    /**
     * The list of available images to choose from.
     *
     * @property availableImages
     * @type {Image[]}
     */
    availableImages: Ember.computed('imagesService.data.@each', 'selectedImage.id', function () {
        let images = this.get('imagesService.data').rejectBy('id', this.get('selectedImage.id'));
        console.log('updating availableImages', images);
        return images;
    }),

    actions: {
        /**
         * When a new image has been submitted.
         *
         * @method submittedFile
         * @return {Void}
         */
        addImage() {
            this.set('isLoading', true);
            let service = this.get('imagesService');
            let rawNewImage = this.get('newImage');
            let image = service.createNew();
            image.setProperties({
                title: rawNewImage.get('title'),
                description: rawNewImage.get('description'),
                file: 'data:image/png;base64,' + rawNewImage.get('file')
            });
            service.save(image).then(id => {
                rawNewImage.setProperties({
                    title: '',
                    description: '',
                    file: ''
                });
                this.set('value', id);
                this.set('isLoading', false);
            });
        },

        /**
         * Select the provided image.
         *
         * @method selectImage
         * @param {Image} image The image to select
         * @return {Void}
         */
        selectImage(image) {
            this.set('selectedImage', image);
        },

        /**
         * Cancel image selection.
         *
         * @method cancel
         * @return {Void}
         */
        cancel() {
            this.sendAction('onClose', { message: 'cancel' });
        },

        /**
         * Save the selection.
         *
         * @method save
         * @return {Void}
         */
        save() {
            this.sendAction('onClose', { message: 'save', image: this.get('selectedImage') });
        }
    }
});
