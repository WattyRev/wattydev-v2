import Ember from 'ember';

export default Ember.Object.extend({
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
     * Get a plain hash of the object's properties used to send save requests.
     *
     * @method getSaveHash
     * @return {Object}
     */
    getSaveHash() {
        return this.getProperties([
            'id',
            'title',
            'description',
            'file'
        ]);
    }
});
