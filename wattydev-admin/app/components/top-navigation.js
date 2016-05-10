import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'nav',

    classNames: ['navbar', 'navbar-inverse', 'navbar-fixed-top'],

    /**
     * Instance of the api service.
     *
     * @property apiService
     * @type {Ember.Service}
     */
    apiService: Ember.inject.service('api'),

    /**
     * Is the user logged in?
     *
     * @property loggedIn
     * @type {Boolean}
     * @readOnly
     */
    isVisible: Ember.computed.bool('apiService.token')
});
