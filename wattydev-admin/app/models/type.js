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
     * Instance of the types service.
     *
     * @property typesService
     * @type {Ember.Service}
     */
    typesService: Ember.inject.service('types'),

    /**
     * The id of the type.
     *
     * @property id
     * @type {String}
     */
    id: null,

    /**
     * The title of the type.
     *
     * @property title
     * @type {String}
     */
    title: null,

    /**
     * The URL slug for the type.
     *
     * @property slug
     * @type {String}
     */
    slug: null,

    /**
     * The parent type ID.
     *
     * @property parent
     * @type {Number}
     */
    parent: 0,

    /**
     * The type's children.
     *
     * @property children
     * @type {Type[]}
     */
    children: Ember.makeArray(),

    /**
     * Delete the type.
     *
     * @method delete
     * @return {Promise}
     */
    delete() {
        Ember.assert('Cannot delete a type that has not been saved yet.', this.get('id'));
        return this.get('apiService').deleteItem('type', this.get('id'));
    },

    /**
     * Save the type.
     *
     * @method save
     * @return {Promise}
     */
    save() {
        if (this.get('id')) {
            return this._createType();
        }
        return this._updateType();
    },

    /**
     * Rollback any unsaved changes.
     *
     * @method rollback
     * @return {Promise}
     */
    rollback() {
        Ember.assert('Cannot rollback a new type.', this.get('id'));
        return this.get('apiService').getItem('type', this.get('id')).then(type => {
            this.setProperties(type);
            return this;
        });
    },

    /**
     * Save the type as a new item.
     *
     * @method _createType
     * @return {Promise}
     * @private
     */
    _createType() {
        // Start the promise chain by saving the type
        let promise = this.get('apiService').addItem('type', {
            title: this.get('title'),
            parent: this.get('parent')
        });

        promise = promise.then(response => {
            // Update the model
            this.set('id', response.id);

            // Add the saved post to the posts service
            let typesService = this.get('typesService');
            if (typesService.get('data.length')) {
                let types = typesService.get('data');
                types.push(this);
                typesService.set('data', types);
            }

            // Retrieve the data for the post in order to get other generated properties
            return this.get('apiService').getItem('type', response.id);
        });

        // Set the slug
        promise = promise.then(type => {
            this.set('slug', type.slug);
            this.set('children', type.children);
            return this.get('id');
        });

        return promise;
    },

    /**
     * Update the type record in the database.
     *
     * @method _updateType
     * @return {Promise}
     * @private
     */
    _updateType() {
        return this.get('apiService').updateItem('type', {
            title: this.get('title'),
            parent: this.get('parent')
        });
    }
});
