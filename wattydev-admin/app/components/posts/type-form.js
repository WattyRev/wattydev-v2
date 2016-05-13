import Ember from 'ember';

export default Ember.Component.extend({
    tagName: '',

    /**
     * Instance of the types service.
     *
     * @property typesService
     * @type {Ember.Service}
     */
    typesService: Ember.inject.service('types'),

    /**
     * Are we currently loading something?
     *
     * @property loading
     * @type {Boolean}
     * @default false
     */
    loading: false,

    /**
     * Options for selecting a parent type.
     *
     * @property parentsOptions
     * @type {Tyoe[]}
     */
    parentsOptions: Ember.computed(function () {
        return this.get('typesService').getAll().then(types => types.rejectBy('id', this.get('type.id')));
    }),

    /**
     * The type being edited.
     *
     * @property type
     * @type {Type}
     */
    type: Ember.computed('data', function () {
        if (this.get('data') === 'new') {
            return this.get('typesService').createNew();
        }
        return this.get('typesService').getOne(this.get('data'));
    }),

    actions: {
        /**
         * Cancel editing.
         *
         * @method cancel
         * @return {Void}
         */
        cancel() {
            this.sendAction('onClose', { message: 'cancel' });
        },

        /**
         * Save the type.
         *
         * @method save
         * @return {Void}
         */
        save() {
            this.set('loading', true);
            this.get('type').save().then(response => {
                this.set('loading', false);
                this.sendAction('onClose', { message: 'saved', id: response.id });
            });
        },
    }
});
