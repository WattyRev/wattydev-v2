import Ember from 'ember';

export default Ember.Service.extend({
    getImages() {
        return new Ember.RSVP.Promise(function (resolve) {
            resolve(Ember.makeArray([
                Ember.Object.create({
                    id: 1,
                    created: new Date('October 13, 2014 11:13:00'),
                    title: 'My image',
                    url: 'my-picture.png'
                }),
                Ember.Object.create({
                    id: 1,
                    created: new Date('November 13, 2014 11:13:00'),
                    title: 'My second image',
                    url: 'my-picture2.png'
                }),
                Ember.Object.create({
                    id: 1,
                    created: new Date('December 13, 2014 11:13:00'),
                    title: 'My third image',
                    url: 'my-picture3.png'
                })
            ]));
        });
    },

    getImage(id) {
        console.log('getting image by id', id);
        return new Ember.RSVP.Promise(function (resolve) {
            resolve(Ember.Object.create({
                id: 1,
                created: new Date('October 13, 2014 11:13:00'),
                title: 'My image',
                url: 'my-picture.png'
            }));
        });
    }
});
