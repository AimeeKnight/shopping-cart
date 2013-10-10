var Item = Backbone.Model.extend({
	defaults: {
		price: 35,
		photo: "img/shopping_bag.png"
	}
});

var Cart = Backbone.Collection.extend({
  model: Item,
  // initialize: function() {
  //   this.on("add", this.updateSet, this);
  // },
  // //update Cart collection when adding new items
  // updateSet: function() {
  //   items = this.models;
  // }
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
    "submit #add": "addItem", //A
    "submit #filter": "filterItems",
    "click #clear-filter": "clearFilter"
  },
  initialize: function() {
    this.itemView = new ItemCollectionView(); //2
  },
  addItem: function(e) { //B
    e.preventDefault();
    //calling CartCollectionView's itemView's (which is ItemCollectionView), addItem()
    this.itemView.addItem(); 
  },
  filterItems: function(e) {
    e.preventDefault();
    this.itemView.filterByPrice();
  },
  clearFilter: function(e) {
    e.preventDefault();
    this.itemView.clearFilter();
  }
});

var ItemCollectionView = Backbone.View.extend({
  el: '#yourcart',
  initialize: function() {
    this.collection = cartCollection; //3
    this.render();
    //when 'reset' event triggered call render() with context bound to this (ItemCollectionView),
    //When detecting collection reset re-render the view
    this.collection.on("reset", this.render, this);
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
  },
  filterByPrice: function() {
    //first reset the collection
    //but do it silently so the event doesn't trigger
    this.collection.reset(items, { silent: true });
    var max = parseFloat($("#less-than").val(), 10);
    var filtered = _.filter(this.collection.models, function(item) {
      return item.get("price") < max;
    });
    //trigger reset again
    //but this time trigger the event so the collection view is rerendered
    this.collection.reset(filtered);
  },
  clearFilter: function() {
    $("#less-than").val("");
    this.collection.reset(items);
  }
});

$(function() {
  var cart = new CartCollectionView(); //1
});