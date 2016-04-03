import DS from 'ember-data';

export default DS.Model.extend({
    /**
     * The id of the post.
     *
     * @property id
     * @type {String}
     */
    id: DS.attr('string'),

    /**
     * The date that the post was created.
     *
     * @property created
     * @type {DateTime}
     */
    created: DS.attr('date'),

    /**
     * The date that the post was udated.
     *
     * @property udated
     * @type {DateTime}
     */
    udated: DS.attr('date'),

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
    //featuredImage: DS.belongsTo('image'),

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
    status: DS.attr('string')
});
