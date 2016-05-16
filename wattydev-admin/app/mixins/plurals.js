import Ember from 'ember';

export default Ember.Mixin.create({
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
    })
});
