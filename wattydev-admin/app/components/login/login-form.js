import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['row'],

    /**
     * Instance of the authentication service.
     *
     * @property authenticationService
     * @type {Ember.Service}
     */
    authenticationService: Ember.inject.service('authentication'),

    /**
     * The user's email address.
     *
     * @property email
     * @type {String}
     */
    email: null,

    /**
     * The user's password.
     *
     * @property password
     * @type {String}
     */
    password: null,

    /**
     * Was the login invalid?
     *
     * @property invalid
     * @type {Boolean}
     */
    invalid: false,

    /**
     * Are we currently making a request?
     *
     * @property loading
     * @type {Boolean}
     */
    loading: false,

    actions: {
        /**
         * Action for submitting a log in.
         *
         * @method logIn
         * @return {Void}
         */
        logIn() {
            let authenticationService = this.get('authenticationService');
            let promise = authenticationService.authenticate(this.get('email'), this.get('password'));

            this.set('loading', true);
            this.set('invalid', false);
            promise.finally(() => {
                this.set('loading', false);
            });

            promise.then(() => {
                console.log('success');
                this.sendAction('loggedIn');
            });

            promise.catch((error) => {
                console.log('error', error);
                this.set('invalid', true);
            });
        }
    }
});
