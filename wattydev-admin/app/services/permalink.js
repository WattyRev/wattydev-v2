import Ember from 'ember';

export default Ember.Service.extend({
    publicRoot: 'http://wattydev.com/beta/',
    adminPath: 'admin/',
    imagesPath: 'images/',
    apiPath: 'api/',
    baseImageUrl: Ember.computed('publicRoot', 'imagesPath', function () {
        return this.get('publicRoot') + this.get('imagesPath');
    }).readOnly()
});
