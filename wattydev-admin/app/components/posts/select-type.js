import Ember from 'ember';

export default Ember.Component.extend({

    /**
     * The Id of the currently selected type.
     *
     * @property value
     * @type {String}
     */
    value: null,

    /**
     * Set up necessary data.
     *
     * @method setup
     * @return {Void}
     * @private
     */
    _setup: Ember.on('didInsertElement', function () {
        this.get('typesService').getAll();
    }),

    /**
     * Instance of the types service.
     *
     * @property typesService
     * @type {Ember.Service}
     */
    typesService: Ember.inject.service('types'),

    /**
     * The list of available types.
     *
     * @property options
     * @type {Type[]}
     */
    options: Ember.computed.alias('typesService.data'),

    /**
     * Is the selection an editable type?
     *
     * @property isEditable Selection
     * @type {Boolean}
     */
    isEditableSelection: Ember.computed('value', function () {
        return this.get('value') !== '0' && this.get('value') !== 'new';
    }),

    /**
     * Are we currently editing or creating a type?
     *
     * @property editingType
     * @type {Boolean}
     * @default false
     */
    editingType: false,

    actions: {
        /**
         * If new type is selected, create a new type.
         *
         * @method typeSelected
         * @return {Void}
         */
        typeSelected() {
            let value = this.get('value');
            if (value === 'new') {
                this.set('editingType', true);
            }
        },

        /**
         * Edit the selected type.
         *
         * @method editType
         * @return {Void}
         */
        editType(type) {
            console.log('edit type', type);
        },

        doneEditing(response) {
            this.set('editingType', false);
            if (this.get('value') === 'new') {
                if (response.message === 'saved') {
                    Ember.run.next(() => {
                        if (this.isDestroyed) {
                            return;
                        }
                        this.set('value', response.id);
                    });
                } else {
                    this.set('value', '0');
                }
            }
        }
    }
});
