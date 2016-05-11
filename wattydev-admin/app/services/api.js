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
                console.log('ajax success');
                resolve(data);
            };
            options.error = function (error, a, b) {
                console.log('ajax error', error, a, b);
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

    /**
     * Get all the images.
     *
     * @method getImages
     * @return {Promise}
     */
    getImages() {
        return this._get('images.php');
    },

    /**
     * Get an image by id.
     *
     * @method getImage
     * @return {Promise}
     */
    getImage(id) {
        return this._get('images.php', { id });
    },

    /**
     * Add a new image.
     *
     * @method addImage
     * @param {Object} image The image to add
     * @return {Promise}
     */
    addImage(image) {
        return this._put('images.php', { image });
    },

    /**
     * Update an existing image.
     *
     * @method updateImage
     * @param {Object} image The image to update
     * @return {Promise}
     */
    updateImage(image) {
        return this._put('images.php?update', { image });
    },

    /**
     * Delete an existing image.
     *
     * @property deleteImage
     * @param {Number} id The ID of the image to delete
     * @type {Promise}
     */
    deleteImage(id) {
        return this._delete('images.php?id=' + id);
    },

    /**
     * Get all the posts.
     *
     * @method getPosts
     * @return {Promise}
     */
    getPosts() {
        return this._get('posts.php');
    },

    /**
     * Get a post by id.
     *
     * @method getPost
     * @return {Promise}
     */
    getPost(id) {
        return this._get('posts.php', { id });
    },

    /**
     * Add a new post.
     *
     * @method addPost
     * @param {Object} post The post to add
     * @return {Promise}
     */
    addPost(post) {
        return this._put('posts.php', { post });
    },

    /**
     * Update an existing post.
     *
     * @method updatePost
     * @param {Object} post The post to update
     * @return {Promise}
     */
    updatePost(post) {
        return this._put('posts.php?update', { post });
    },

    /**
     * Delete an existing post.
     *
     * @property deletePost
     * @param {Number} id The ID of the post to delete
     * @type {Promise}
     */
    deletePost(id) {
        return this._delete('posts.php?id=' + id);
    }
});
