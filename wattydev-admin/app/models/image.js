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
    url: null
});
