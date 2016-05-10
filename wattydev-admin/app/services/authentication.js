import Ember from 'ember';

export default Ember.Service.extend({
    /**
     * Instance of the API service.
     *
     * @property apiService
     * @type {Ember.Service}
     */
    apiService: Ember.inject.service('api'),

    checkAuthentication() {
        let apiService = this.get('apiService');
        return apiService.getAuthentication().then(token => {
            apiService.set('token', token);
        });
    }
});
