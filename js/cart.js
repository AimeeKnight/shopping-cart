var Item = Backbone.Model.extend({
	defaults: {
		price: 35,
		photo: "img/shopping_bag.png"
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
  el: "body",
  events: {
    "submit #add": "addItem" //A
  },
  initialize: function() {
    this.itemView = new ItemCollectionView(); //2
  },
  addItem: function(e) { //B
    e.preventDefault();
    //calling CartCollectionView's itemView's (which is ItemCollectionView), addItem()
    this.itemView.addItem(); 
  }
});

var ItemCollectionView = Backbone.View.extend({
  el: '#yourcart',
  initialize: function() {
    this.collection = cartCollection; //3
    this.render();
  },
  render: function() { //4
    this.$el.html("");
    this.collection.each(function(item) {
      this.renderItem(item);
    //this refers to ItemCollectionView Class  
    }, this);
  },
  renderItem: function(item) { //5
    var itemView = new ItemView({model: item});
    this.$el.append(itemView.render().el);
  },
  addItem: function() { //C
    var data = {};
    $("#add").children("input[type='text']").each(function(i, el) {
      data[el.id] = $(el).val();
    });
    var newItem = new Item(data);
    this.collection.add(newItem);
    this.renderItem(newItem);
  }       
});
$(function() {
  var cart = new CartCollectionView(); //1
});