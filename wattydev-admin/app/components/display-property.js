import Ember from 'ember';
import PluralsMixin from 'wattydev-admin/mixins/plurals';

export default Ember.Component.extend(PluralsMixin, {
    tagName: '',

    /**
     * The name of the model to use.
     *
     * @property model
     * @type {String}
     * @required
     */
    model: null,

    /**
     * The id of the record to display a property from.
     *
     * @property id
     * @type {String}
     * @required
     */
    id: null,

    /**
     * The name of the property to retrieve.
     *
     * @property property
     * @type {String}
     * @required
     */
    property: null,

    /**
     * Instance of types service.
     *
     * @property types
     * @type {Ember.Service}
     */
    types: Ember.inject.service('types'),

    /**
     * Instance of tags service.
     *
     * @property tags
     * @type {Ember.Service}
     */
    tags: Ember.inject.service('tags'),

    /**
     * Instance of types service.
     *
     * @property images
     * @type {Ember.Service}
     */
    images: Ember.inject.service('images'),

    /**
     * Instance of types service.
     *
     * @property posts
     * @type {Ember.Service}
     */
    posts: Ember.inject.service('posts'),

    /**
     * The displayed information.
     *
     * @property display
     * @type {String}
     * @readOnly
     */
    display: Ember.computed('id', 'property', 'service.data.@each', 'model', function () {
        let plurals = this.get('pluralMap');
        let plural = plurals.get(this.get('model'));
        let service = this.get(plural);
        return service.get('data').findBy('id', this.get('id')).get(this.get('property'));
    }).readOnly(),

    /**
     * Validate that the required properties have been provided.
     *
     * @method _validateProperties
     * @return {Void}
     * @private
     */
    _validateProperties: Ember.on('didInsertElement', function () {
        let required = ['model', 'id', 'property'];
        required.forEach(item => {
            Ember.assert(`The ${item} property must be provided to the display-property component.`, this.get(item));
        });
    })
});
