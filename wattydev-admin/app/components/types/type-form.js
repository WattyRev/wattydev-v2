import Ember from 'ember';
import AutoFocusMixin from 'wattydev-admin/mixins/auto-focus';

export default Ember.Component.extend(AutoFocusMixin, {
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
    parentsOptions: Ember.computed('typesService.data', function () {
        return this.get('typesService.data').rejectBy('id', this.get('type.id'));
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
        return Ember.$.extend({}, this.get('typesService').getOne(this.get('data')));
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
            if (this.get('data') !== 'new') {
                this.get('typesService').getOne(this.get('data')).setProperties(this.get('type'));
            }
            this.get('typesService').save(this.get('type')).then(id => {
                this.set('loading', false);
                this.sendAction('onClose', { message: 'saved', id: id });
            });
        },

        /**
         * Delete the type.
         *
         * @method delete
         * @return {Void}
         */
        delete() {
            this.get('typesService').delete(this.get('type.id'));
            this.sendAction('onClose', { message: 'deleted' });
        }
    }
});
