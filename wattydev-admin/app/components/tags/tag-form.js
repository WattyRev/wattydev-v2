import Ember from 'ember';
import AutoFocusMixin from 'wattydev-admin/mixins/auto-focus';

export default Ember.Component.extend(AutoFocusMixin, {
    /**
     * Instance of the tags service.
     *
     * @property tagsService
     * @type {Ember.Service}
     */
    tagsService: Ember.inject.service('tags'),

    /**
     * Are we currently loading something?
     *
     * @property loading
     * @type {Boolean}
     * @default false
     */
    loading: false,

    /**
     * The tag being edited.
     *
     * @property tag
     * @type {Tag}
     */
    tag: Ember.computed('data', function () {
        if (this.get('data') === 'new') {
            return this.get('tagsService').createNew();
        }
        return Ember.$.extend({}, this.get('tagsService').getOne(this.get('data')));
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
         * Save the tag.
         *
         * @method save
         * @return {Void}
         */
        save() {
            this.set('loading', true);
            if (this.get('data') !== 'new') {
                this.get('tagsService').getOne(this.get('data')).setProperties(this.get('tag'));
            }
            this.get('tagsService').save(this.get('tag')).then(id => {
                this.set('loading', false);
                this.sendAction('onClose', { message: 'saved', id: id });
            });
        },

        /**
         * Delete the tag.
         *
         * @method delete
         * @return {Void}
         */
        delete() {
            this.get('tagsService').delete(this.get('tag.id'));
            this.sendAction('onClose', { message: 'deleted' });
        }
    }
});
