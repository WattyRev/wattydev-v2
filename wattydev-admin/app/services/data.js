import Ember from 'ember';
import PluralsMixin from 'wattydev-admin/mixins/plurals';

export default Ember.Service.extend(PluralsMixin, {
    /**
     * The name of the model that this service works with.
     * Provide this property when extending this service.
     *
     * @property modelName
     * @type {String}
     */
    modelName: null,

    /**
     * The model to cast data to.
     * Provide this property wen extending this serice.
     *
     * @property dataModel
     * @type {Ember.Model}
     */
    dataModel: null,

    /**
     * Instance of the API service.
     *
     * @property apiService
     * @type {Ember.Service}
     */
    apiService: Ember.inject.service('api'),

    /**
     * Get the list of posts.
     *
     * @method getPosts
     * @return {Promise}
     */
    getAll() {
        let plural = this.get('pluralMap.' + this.get('modelName'));
        if (this.get('data.length')) {
            return Ember.RSVP.resolve(this.get('data'));
        }
        return this.get('apiService').getItems(this.get('modelName')).then(data => {
            // Make JSON values if possible
            let rawItems = Ember.makeArray(data[plural]);
            let items = rawItems.map(item => {
                Object.keys(item).forEach(key => {
                    let value = item[key];
                    if (value[0] === '[' || value[0] === '{') {
                        item[key] = JSON.parse(value);
                    }
                });
                return this.get('dataModel').create(item);
            });
            this.set('data', items);
            return items;
        });
    },

    /**
     * Refresh the data.
     *
     * @method refresh
     * @return {Promise}
     */
    refresh() {
        this.set('posts', Ember.makeArray());
        return this.getAll();
    },

    /**
     * The cached data.
     *
     * @property data
     * @type {Image[]}
     */
    data: Ember.makeArray(),

    /**
     * Get a specific item by id.
     *
     * @method getOne
     * @param {Number} id The id of the item to get
     * @return {Promise}
     */
    getOne(id) {
        if (id === '0') {
            return Ember.RSVP.resolve();
        }
        if (this.get('data.length')) {
            return this.get('data').findBy('id', id);
        }
        return this.get('apiService').getItem(this.get('modelName'), id).then(item => {
            Object.keys(item).forEach(key => {
                let value = item[key];
                if (value[0] === '[' || value[0] === '{') {
                    item[key] = JSON.parse(value);
                }
            });
            return item ? this.get('dataModel').create(item) : null;
        });
    },

    /**
     * Create a new item.
     *
     * @method createNew
     * @return {Ember.Object}
     */
    createNew() {
        return this.get('dataModel').create();
    },

    /**
     * Delete a specified item.
     *
     * @method delete
     * @param {String} id The id of the item to delete
     * @return {Promise}
     */
    delete(id) {
        Ember.assert('An id is required to delete an item', id);
        let data = this.get('data');
        let item = data.findBy('id', id);
        data.splice(data.indexOf(item), 1);
        this.set('data', data.slice());
        return this.get('apiService').deleteItem(this.get('modelName'), id);
    },

    /**
     * Save a specified item.
     *
     * @method save
     * @param {Ember.Object} item The full item object to save
     * @return {Promise}
     */
    save(item) {
        if (item.get('id')) {
            return this._updateItem(item);
        }
        return this._createItem(item);
    },

    /**
     * Rollback changes on specified item.
     *
     * @method rollback
     * @param {Ember.Object} item The full item object to roll back
     * @return {Promise}
     */
    rollback(item) {
        Ember.assert('Cannot rollback a new item.', item.get('id'));
        return this.get('apiService').getItem(this.get('modelName'), item.get('id')).then(original => {
            item.setProperties(original);
            return item;
        });
    },

    /**
     * Save the item as a new item.
     *
     * @method _createItem
     * @param {Ember.Object} item The item to create
     * @return {Promise}
     * @private
     */
    _createItem(item) {
        // Start the promise chain by saving the post
        let promise = this.get('apiService').addItem(this.get('modelName'), item);

        promise = promise.then(response => {
            // Update the model
            item.set('id', response.id);

            // Add the saved post to the posts service
            if (this.get('data.length')) {
                let items = this.get('data');
                items.push(item);
                this.set('data', items.slice());
            }

            // Retrieve the data for the post in order to get other generated properties
            return this.get('apiService').getItem(this.get('modelName'), response.id);
        });

        // Set the other properties
        promise = promise.then(requestedItem => {
            item.setProperties(requestedItem);
            return item.get('id');
        });

        return promise;
    },

    /**
     * Update the item record in the database.
     *
     * @method _updateItem
     * @param {Ember.Object} item The item to update
     * @return {Promise}
     * @private
     */
    _updateItem(item) {
        return this.get('apiService').updateItem(this.get('modelName'), item);
    }
});
