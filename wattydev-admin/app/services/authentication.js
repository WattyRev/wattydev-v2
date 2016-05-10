import Ember from 'ember';

export default Ember.Service.extend({
    /**
     * Instance of the API service.
     *
     * @property apiService
     * @type {Ember.Service}
     */
    apiService: Ember.inject.service('api'),

    /**
     * Check if the user has been authenticated.
     *
     * @method checkAuthentication
     * @return {Promise}
     */
    checkAuthentication() {
        let apiService = this.get('apiService');
        return apiService.getAuthentication().then(token => {
            apiService.set('token', token);
        });
    },

    /**
     * Authenticate the user.
     *
     * @method authenticate
     * @return {Promise}
     */
    authenticate(email, password) {
        let apiService = this.get('apiService');
        return apiService.authenticate(email, password).then(token => {
            apiService.set('token', token);
            return token;
        });
    }
});
