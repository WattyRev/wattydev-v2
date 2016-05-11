import Ember from 'ember';

export default Ember.Service.extend({
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
     * A map of plural forms of models.
     *
     * @property pluralMap
     * @type {Object}
     */
    pluralMap: Ember.Object.create({
        post: 'posts',
        image: 'images',
        type: 'types',
        tag: 'tags'
    }),

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
            let items = Ember.makeArray(data[plural]).map(item => this.get('dataModel').create(item));
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
        if (this.get('data.length')) {
            return this.get('data').findBy('id', id);
        }
        return this.get('apiService').getItem(this.get('modelName'), id).then(item => item ? this.get('dataModel').create(item) : null);
    },

    /**
     * Create a new item.
     *
     * @method createNew
     * @return {Ember.Object}
     */
    createNew() {
        return this.get('dataModel').create();
    }
});
