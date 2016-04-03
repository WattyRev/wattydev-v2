import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('index/recent-posts', 'Integration | Component | index/recent posts', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{index/recent-posts}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#index/recent-posts}}
      template block text
    {{/index/recent-posts}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
