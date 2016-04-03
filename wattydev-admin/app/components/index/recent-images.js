import Ember from 'ember';

export default Ember.Component.extend({
    /**
     * The full list of images.
     *
     * @property images
     * @type {Ember.Object[]}
     */
    images: null,

    /**
     * The five most recently created images.
     *
     * @property recentImages
     * @type {Ember.Object[]}
     */
    recentImages: Ember.computed('images.@each', function () {
        let images = Ember.makeArray(this.get('images'));
        return images.sortBy('created').slice(0, 5);
    })
});
