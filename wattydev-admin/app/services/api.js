import Ember from 'ember';

export default Ember.Service.extend(Ember.Evented, {
    /**
     * An instance of the permalink service.
     *
     * @property permalinkService
     * @type {Ember.Service}
     */
    permalinkService: Ember.inject.service('permalink'),

    /**
     * The base url to send ajax requests to.
     *
     * @property apiUrl
     * @type {String}
     * @readOnly
     */
    apiUrl: Ember.computed('permalinkService.{publicRoot,apiPath}', function () {
        return this.get('permalinkService.publicRoot') + this.get('permalinkService.apiPath');
    }).readOnly(),

    /**
     * The authentication token to include with requests.
     *
     * @property token
     * @type {String}
     */
    token: null,

    /**
     * Make an ajax call.
     *
     * @method ajax
     * @param {Object} options jQuery Ajax options
     * @return {Promise}
     * @private
     */
    _ajax(options) {
        let promise = new Ember.RSVP.Promise((resolve, reject) => {
            options.success = function (data) {
                resolve(data);
            };
            options.error = function (error) {
                reject(error);
            };
            options.dataType = 'json';
            options.contentType = "application/json";
            options.crossDomain = true;
            options.xhrFields = { withCredentials: true };
            if (this.get('token')) {
                options.headers = Ember.$.extend({
                    'x-wattydev-authentication': this.get('token')
                }, options.headers);
            }
            Ember.$.ajax(options);
        });

        promise.catch(error => {
            if (error.status === 401) {
                this.set('token', null);
                this.trigger('loggedOut');
                return Ember.RSVP.reject(error);
            }
        });

        return promise;
    },

    /**
     * Make an ajax get request.
     *
     * @method get
     * @param {String} url The URL to send the request to
     * @param {Object} data The data to send with the request
     * @return {Promise}
     */
    _get(path, data) {
        return this._ajax({
            url: this.get('apiUrl') + path,
            data,
            method: 'GET'
        });
    },

    /**
     * Make an ajax put request.
     *
     * @method put
     * @param {String} url The URL to send the request to
     * @param {Object} data The data to send with the request
     * @return {Promise}
     */
    _put(path, data) {
        return this._ajax({
            url: this.get('apiUrl') + path,
            data: JSON.stringify(data),
            method: 'PUT'
        });
    },

    /**
     * Make an ajax delete request.
     *
     * @method delete
     * @param {String} url The URL to send the request to
     * @return {Promise}
     */
    _delete(path) {
        return this._ajax({
            url: this.get('apiUrl') + path,
            method: 'DELETE'
        });
    },

    /**
     * Get authentication token if available.
     *
     * @method getAuthentication
     * @return {Promise}
     */
    getAuthentication() {
        return this._get('authenticate.php');
    },

    /**
     * Make a request to authenticate the user.
     *
     * @method authenticate
     * @return {Promise}
     */
    authenticate(email, password) {
        return this._put('authenticate.php', {
            email,
            password
        });
    },

    signOut() {
        return this._delete('authenticate.php');
    },

    /**
     * Get the path for the specified model.
     *
     * @method _getPath
     * @param {String} model The name of the model to get the path for
     * @return {String}
     * @private
     */
    _getPath(model) {
        let path;
        switch(model) {
            case 'image':
                path = 'images.php';
                break;
            case 'post':
                path = 'posts.php';
                break;
            case 'type':
                path = 'types.php';
                break;
            case 'tag':
                path = 'tags.php';
                break;
        }
        return path;
    },

    /**
     * Get all the data of specified model.
     *
     * @method getItems
     * @param {String} model The model name for what type of data to retrieve
     * @return {Promise}
     */
    getItems(model) {
        return this._get(this._getPath(model));
    },

    /**
     * Get a record of specified model by id.
     *
     * @method getItem
     * @param {String} model The model name for what type of data to retrieve
     * @param {Number} id The item's id
     * @return {Promise}
     */
    getItem(model, id) {
        return this._get(this._getPath(model), { id });
    },

    /**
     * Create a new item of specified model type.
     *
     * @method addItem
     * @param {String} model The model name for what type of data to retrieve
     * @param {Object} data The item to add
     * @return {Promise}
     */
    addItem(model, data) {
        let request = {};
        request[model] = data.getSaveHash();
        return this._put(this._getPath(model), request);
    },

    /**
     * Update an existing item.
     *
     * @method updateItem
     * @param {String} model The model name for what type of data to retrieve
     * @param {Object} data The data to update
     * @return {Promise}
     */
    updateItem(model, data) {
        let request = {};
        request[model] = data;
        return this._put(this._getPath(model) + '?update', request);
    },

    /**
     * Delete an existing item.
     *
     * @property deleteItem
     * @param {String} model The model name for what type of data to retrieve
     * @param {Number} id The ID of the item to delete
     * @type {Promise}
     */
    deleteItem(model, id) {
        return this._delete(this._getPath(model) + '?id=' + id);
    }
});
