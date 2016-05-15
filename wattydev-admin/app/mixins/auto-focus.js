import Ember from 'ember';

export default Ember.Mixin.create({
    _focus: Ember.on('didInsertElement', function () {
        Ember.assert('The auto focus mixin does not work with tagless components.', this.get('tagName') !== '');
        this.$(this.$('input')[0]).focus();
    })
});
