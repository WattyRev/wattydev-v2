import DS from 'ember-data';

export default DS.Model.extend({
    /**
     * The id of the image.
     *
     * @property id
     * @type {String}
     */
    id: DS.attr('string'),

    /**
     * The title of the image.
     *
     * @property title
     * @type {String}
     */
    title: DS.attr('string'),

    /**
     * A description of the image.
     *
     * @property description
     * @type {String}
     */
    description: DS.attr('string'),

    /**
     * A url tha references the image.
     *
     * @property url
     * @type {String}
     */
    url: DS.attr('string')
});
