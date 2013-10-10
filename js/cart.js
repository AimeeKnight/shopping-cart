var Item = Backbone.Model.extend({
	defaults: {
		price: 35,
		photo: "http://aimeemarieknight.com/wp-content/uploads/2013/08/1377384423_github_square_black.png"
	}
});

var Cart = Backbone.Collection.extend({
	model: Item
});
var items = [
  { title: "Macbook Air", price: 799 },
  { title: "Macbook Pro", price: 999 },
  { title: "The new iPad", price: 399 },
  { title: "Magic Mouse", price: 50 },
  { title: "Cinema Display", price: 799 }
];
var cartCollection = new Cart(items);

var ItemView = Backbone.View.extend({
  tagName: "div",
  className: "item-wrap",
  template: $("#itemTemplate").html(),

  render: function() {
    var templ = _.template(this.template);
    this.$el.html(templ(this.model.toJSON()));
    return this;
  }
});

var CartCollectionView = Backbone.View.extend({
  el: $("#yourcart"),
  initialize: function() {
    this.collection = cartCollection;
    this.render();
  },
  render: function() {
    this.collection.each(function(item) {
      this.renderItem(item);
      //this refers to CartCollectionView Class
    }, this);
  },
  renderItem: function(item) {
    var itemView = new ItemView({ model: item });
    this.$el.append(itemView.render().el); 
  }
});
$(function() {
  var cart = new CartCollectionView();
});