import DS from 'ember-data';

export default DS.Model.extend({

    /**
     * The date that the post was created.
     *
     * @property created
     * @type {DateTime}
     */
    created: DS.attr('date'),

    /**
     * The date that the post was updated.
     *
     * @property updated
     * @type {DateTime}
     */
    updated: DS.attr('date'),

    /**
     * The title of the post.
     *
     * @property title
     * @type {String}
     */
    title: DS.attr('string'),

    /**
     * The post's content.
     *
     * @property description
     * @type {String}
     */
    content: DS.attr('string'),

    /**
     * The featured image
     *
     * @property featuredImage
     * @type {Ember.Model}
     */
    featuredImage: DS.belongsTo('image'),

    /**
     * The post type
     *
     * @property type
     * @type {String}
     */
    type: DS.attr('string'),

    /**
     * The post subType
     *
     * @property subType
     * @type {String}
     */
    subType: DS.attr('string'),

    /**
     * The post status
     *
     * @property status
     * @type {String}
     */
    status: DS.attr('string'),

    /**
     * The post slug
     *
     * @property slug
     * @type {String}
     */
    slug: DS.attr('string'),

    /**
     * The post referenceUrl
     *
     * @property referenceUrl
     * @type {String}
     */
    referenceUrl: DS.attr('string')
});