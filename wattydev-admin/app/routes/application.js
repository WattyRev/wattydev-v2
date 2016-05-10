import Ember from 'ember';

export default Ember.Route.extend({
    /**
     * Instance of the authentication service.
     *
     * @property authenticationService
     * @type {Ember.Service}
     */
    authenticationService: Ember.inject.service('authentication'),

    model() {
        let auth = this.get('authenticationService');
        return Ember.RSVP.hash({
            authToken: auth.checkAuthentication().catch(() => {
                this.transitionTo('login');
            })
        });
    }
});
