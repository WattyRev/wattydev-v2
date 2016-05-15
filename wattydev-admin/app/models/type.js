import Ember from 'ember';

export default Ember.Object.extend({
    /**
     * The id of the type.
     *
     * @property id
     * @type {String}
     */
    id: null,

    /**
     * The title of the type.
     *
     * @property title
     * @type {String}
     */
    title: null,

    /**
     * The URL slug for the type.
     *
     * @property slug
     * @type {String}
     */
    slug: null,

    /**
     * The parent type ID.
     *
     * @property parent
     * @type {Number}
     */
    parent: 0,

    /**
     * The type's children.
     *
     * @property children
     * @type {Type[]}
     */
    children: Ember.makeArray()
});
