import Ember from 'ember';

export default Ember.Object.extend({
    /**
     * The id of the post.
     *
     * @property id
     * @type {String}
     */
    id: null,

    /**
     * The date that the post was created.
     *
     * @property created
     * @type {String}
     */
    created: null,

    /**
     * The date that the post was created.
     *
     * @property createdDate
     * @type {DateTime}
     * @readOnly
     */
    createdDate: Ember.computed('created', function () {
        return new Date(this.get('created'));
    }).readOnly(),

    /**
     * The date that the post was updated.
     *
     * @property updated
     * @type {String}
     */
    updated: null,

    /**
     * The date that the post was updated.
     *
     * @property updatedDate
     * @type {DateTime}
     * @readOnly
     */
    updatedDate: Ember.computed('updated', function () {
        return new Date(this.get('updated'));
    }).readOnly(),

    /**
     * The title of the post.
     *
     * @property title
     * @type {String}
     */
    title: null,

    /**
     * The post's content.
     *
     * @property description
     * @type {String}
     */
    content: null,

    /**
     * The featured image
     *
     * @property featuredImage
     * @type {String}
     */
    featuredImage: '0',

    /**
     * The post type
     *
     * @property type
     * @type {String}
     */
    type: '0',

    /**
     * The post status
     *
     * @property status
     * @type {String}
     */
    status: 'draft',

    /**
     * The post slug
     *
     * @property slug
     * @type {String}
     */
    slug: null,

    /**
     * The post referenceUrl
     *
     * @property referenceUrl
     * @type {String}
     */
    referenceUrl: null,

    /**
     * A list of tags applied to the post.
     *
     * @property tags
     * @type {Tag[]}
     */
    tags: Ember.makeArray()
});
