import Ember from 'ember';

export default Ember.Route.extend({
    /**
     * Instance of the api service.
     *
     * @property apiService
     * @type {Ember.Service}
     */
    apiService: Ember.inject.service('api'),

    beforeModel() {
        if (this.get('apiService.token')) {
            this.transitionTo('/');
        }
    },

    actions: {
        /**
         * When the user has logged in, transition to root.
         *
         * @method
         * @return {}
         */
        loggedIn() {
            this.transitionTo('/');
        }
    }
});
