import DS from 'ember-data';

export default DS.RESTAdapter.extend({
    namespace: 'beta/api',

    host: 'http://wattydev.com',

    /**
     * Override for ajax to support CORS.
     *
     * See Ember doc for more information
     * http://emberjs.com/api/data/classes/DS.RESTAdapter.html#method_ajax
     *
     * @method ajax
     * @return {Promise}
     */
    ajax: function (url, method, hash) {
        console.log('ajax', url);
        hash = hash || {};
        hash.crossDomain = true;
        return this._super(url, method, hash);
    }
});
