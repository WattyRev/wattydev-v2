import DS from 'ember-data';

export default DS.RESTAdapter.extend({
    namespace: 'beta/api',

    host: 'http://wattydev.com',

    buildURL: function(record, suffix) {
        var s = this._super(record, suffix);
        return s + ".php";
    },

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
        hash = hash || {};
        hash.crossDomain = true;
        return this._super(url, method, hash);
    }
});
