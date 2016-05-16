import Ember from 'ember';

export default Ember.Object.extend({
    /**
     * The id of the tag.
     *
     * @property id
     * @type {String}
     */
    id: null,

    /**
     * The title of the tag.
     *
     * @property title
     * @type {String}
     */
    title: null,

    /**
     * The URL slug for the tag.
     *
     * @property slug
     * @type {String}
     */
    slug: null,

    /**
     * Get a plain hash of the object's properties used to send save requests.
     *
     * @method getSaveHash
     * @return {Object}
     */
    getSaveHash() {
        return this.getProperties([
            'id',
            'title'
        ]);
    }
});
