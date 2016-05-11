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
     * Instance of the tags service.
     *
     * @property tagsService
     * @type {Ember.Service}
     */
    tagsService: Ember.inject.service('tags'),

    /**
     * The id of the tag.
     *
     * @property id
     * @type {String}
     */
    id: null,

    /**
     * The title of the tag.
     *
     * @property title
     * @type {String}
     */
    title: null,

    /**
     * The URL slug for the tag.
     *
     * @property slug
     * @type {String}
     */
    slug: null,

    /**
     * Delete the tag.
     *
     * @method delete
     * @return {Promise}
     */
    delete() {
        Ember.assert('Cannot delete a tag that has not been saved yet.', this.get('id'));
        return this.get('apiService').deleteItem('tag', this.get('id'));
    },

    /**
     * Save the tag.
     *
     * @method save
     * @return {Promise}
     */
    save() {
        if (this.get('id')) {
            return this._createTag();
        }
        return this._updateTag();
    },

    /**
     * Rollback any unsaved changes.
     *
     * @method rollback
     * @return {Promise}
     */
    rollback() {
        Ember.assert('Cannot rollback a new tag.', this.get('id'));
        return this.get('apiService').getItem('tag', this.get('id')).then(tag => {
            this.setProperties(tag);
            return this;
        });
    },

    /**
     * Save the tag as a new item.
     *
     * @method _createTag
     * @return {Promise}
     * @private
     */
    _createTag() {
        // Start the promise chain by saving the tag
        let promise = this.get('apiService').addItem('tag', {
            title: this.get('title')
        });

        promise = promise.then(response => {
            // Update the model
            this.set('id', response.id);

            // Add the saved post to the posts service
            let tagsService = this.get('tagsService');
            if (tagsService.get('data.length')) {
                let tags = tagsService.get('data');
                tags.push(this);
                tagsService.set('data', tags);
            }

            // Retrieve the data for the post in order to get other generated properties
            return this.get('apiService').getItem('tag', response.id);
        });

        // Set the slug
        promise = promise.then(tag => {
            this.set('slug', tag.slug);
            return this.get('id');
        });

        return promise;
    },

    /**
     * Update the tag record in the database.
     *
     * @method _updateTag
     * @return {Promise}
     * @private
     */
    _updateTag() {
        return this.get('apiService').updateItem('tag', {
            title: this.get('title')
        });
    }
});
