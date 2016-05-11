import Ember from 'ember';

export default Ember.Route.extend({
    /**
     * Instance of the authentication service.
     *
     * @property authenticationService
     * @type {Ember.Service}
     */
    authenticationService: Ember.inject.service('authentication'),

    /**
     * Instance of the api service.
     *
     * @property apiService
     * @type {Ember.Service}
     */
    apiService: Ember.inject.service('api'),

    beforeModel() {
        let auth = this.get('authenticationService');
        return Ember.RSVP.hash({
            authToken: auth.checkAuthentication().catch(() => {
                this.transitionTo('login');
            })
        });
    },

    /**
     * When the user is logged out, transitions to the login screen.
     *
     * @method loggedOut
     * @return {Void}
     */
    loggedOut() {
        this.transitionTo('login');
    },

    /**
     * Listen for the loggedOut event from the api servie.
     *
     * @method watchForLogOut
     * @return {Void}
     */
    watchForLogOut: Ember.on('afterModel', function () {
        let apiService = this.get('apiService');
        apiService.on('loggedOut', this, this.loggedOut);
    })
});
