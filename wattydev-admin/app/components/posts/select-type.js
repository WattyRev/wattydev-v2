import Ember from 'ember';

export default Ember.Component.extend({

    /**
     * The Id of the currently selected type.
     *
     * @property
     * @type {}
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
    options: Ember.computed.readOnly('typesService.data'),

    actions: {
        typeSelected() {
            let value = this.get('value');
            if (value === 'new') {
                console.log('create new type');
            }
        }
    }
});
