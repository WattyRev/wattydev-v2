import Ember from 'ember';

export default Ember.Object.extend({
    /**
     * Instance of the API service.
     *
     * @property apiService
     * @type {Ember.Service}
     */
    apiService: Ember.inject.service('api'),

    /**
     * Instance of the posts service.
     *
     * @property postsService
     * @type {Ember.Service}
     */
    postsService: Ember.inject.service('posts'),

    /**
     * The id of the post.
     *
     * @property id
     * @type {String}
     */
    id: null,

    /**
     * The date that the post was created.
     *
     * @property created
     * @type {String}
     */
    created: null,

    /**
     * The date that the post was created.
     *
     * @property createdDate
     * @type {DateTime}
     * @readOnly
     */
    createdDate: Ember.computed('created', function () {
        return new Date(this.get('created'));
    }).readOnly(),

    /**
     * The date that the post was updated.
     *
     * @property updated
     * @type {String}
     */
    updated: null,

    /**
     * The date that the post was updated.
     *
     * @property updatedDate
     * @type {DateTime}
     * @readOnly
     */
    updatedDate: Ember.computed('updated', function () {
        return new Date(this.get('updated'));
    }).readOnly(),

    /**
     * The title of the post.
     *
     * @property title
     * @type {String}
     */
    title: null,

    /**
     * The post's content.
     *
     * @property description
     * @type {String}
     */
    content: null,

    /**
     * The featured image
     *
     * @property featuredImage
     * @type {Ember.Model}
     */
    featuredImage: 0,

    /**
     * The post type
     *
     * @property type
     * @type {String}
     */
    type: 0,

    /**
     * The post status
     *
     * @property status
     * @type {String}
     */
    status: 'draft',

    /**
     * The post slug
     *
     * @property slug
     * @type {String}
     */
    slug: null,

    /**
     * The post referenceUrl
     *
     * @property referenceUrl
     * @type {String}
     */
    referenceUrl: null,

    /**
     * A list of tags applied to the post.
     *
     * @property tags
     * @type {Tag[]}
     */
    tags: Ember.makeArray(),

    /**
     * Delete the post.
     *
     * @method delete
     * @return {Promise}
     */
    delete() {
        Ember.assert('Cannot delete a post that has not been saved yet.', this.get('id'));
        return this.get('apiService').deletePost(this.get('id'));
    },

    /**
     * Save the post.
     *
     * @method save
     * @return {Promise}
     */
    save() {
        if (this.get('id')) {
            return this._createPost();
        }
        return this._updatePost();
    },

    /**
     * Rollback any unsaved changes.
     *
     * @method rollback
     * @return {Promise}
     */
    rollback() {
        Ember.assert('Cannot rollback a new post.', this.get('id'));
        return this.get('apiService').getPost(this.get('id')).then(post => {
            this.setProperties(post);
            return this;
        });
    },

    /**
     * Save the image as a new item.
     *
     * @method _createPost
     * @return {Promise}
     * @private
     */
    _createPost() {
        // Start the promise chain by saving the post
        let promise = this.get('apiService').addPost({
            title: this.get('title'),
            content: this.get('content'),
            featuredImage: this.get('featuredImage'),
            type: this.get('type'),
            status: this.get('status'),
            referenceUrl: this.get('referenceUrl'),
            tags: this.get('tags')
        });

        promise = promise.then(id => {
            // Update the model
            this.set('id', id);

            // Add the saved post to the posts service
            let postsService = this.get('postsService');
            if (postsService.get('posts.length')) {
                let posts = postsService.get('posts');
                posts.push(this);
                postsService.set('posts', posts);
            }

            // Retrieve the data for the post in order to get other generated properties
            return this.get('apiService').getPost(id);
        });

        // Set the slug
        promise = promise.then(post => {
            this.set('slug', post.slug);
            return this.get('id');
        });

        return promise;
    },

    /**
     * Update the post record in the database.
     *
     * @method _updatePost
     * @return {Promise}
     * @private
     */
    _updatePost() {
        return this.get('apiService').updateImage({
            title: this.get('title'),
            content: this.get('content'),
            featuredImage: this.get('featuredImage'),
            type: this.get('type'),
            status: this.get('status'),
            referenceUrl: this.get('referenceUrl'),
            tags: this.get('tags')
        });
    }
});
