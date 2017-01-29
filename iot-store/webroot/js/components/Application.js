var React = require('react'),
    DropZone = require('./DropZone'),
    Product = require('./Product'),
    Cart = require('./Cart');

var App = React.createClass({
    propTypes: {
        products: React.PropTypes.array.isRequired
    },
    getDefaultProps: function() {
        return {
            products: []
        }
    },
    getInitialState: function() {
        return {
            itemsInCart: []
        }
    },
    updateCart: function(items) {
        this.setState({ itemsInCart: items });
    },
    orderCart: function(e) {
        var that = this,
            items = this.state.itemsInCart,
            xhr;

        xhr = new XMLHttpRequest();
        xhr.open("POST", "submit.php");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                var data = xhr.responseText;
                try {
                    data = JSON.parse(data);
                } catch (exc) {
                }
                that.orderCartCallback(data);
            }
        };

        xhr.send(JSON.stringify(items));
    },
    orderCartCallback() {
        var items = this.state.itemsInCart;
        while(items.length > 0) { items.shift(); }
        this.updateCart(items);
    },
    addItemToCart: function(item) {
        var items = this.state.itemsInCart;
        var existingItem = _.find(items, function(i) {
            return i.id == item.id;
        });

        if (existingItem) {                 // item already exists
            existingItem.qty = existingItem.qty + 1
        } else {                            // push new item
            items.push({
                title: item.title,
                qty: 1,
                price: item.price,
                id: item.id
            })
        }
        this.updateCart(items);
    },
    handleDrop: function(e) {
        // unhighlight the dropzone
        e.target.style.borderWidth = "1px";
        e.stopPropagation();

        var products = this.props.products,
            item = null,
            itemId = e.dataTransfer.getData('text/plain');

        // retrieve the item
        for (var i = 0; i < products.length; i++) {
            if (products[i].id == itemId) {
                item = products[i];
            }
        }
        this.addItemToCart(item);
    },
    handleDragStart: function(e) {
        var target = e.target;
        e.dataTransfer.effectAllowed = 'copy';
        e.dataTransfer.setData('text/plain', target.dataset.item);
    },
    render: function() {
        var items = this.props.products,
            itemsInCart = this.state.itemsInCart;

        return (
            <div className="row">
                <div className="seven columns">
                    <h3>Products</h3>
                    <ul>{
                      items.map(function(item) {
                                return <Product key={item.id}
                                    item={item}
                                    handleDragStart={this.handleDragStart} />}.bind(this))
                      }</ul>
                </div>

                <div className="five columns">
                    <Cart items={this.state.itemsInCart}/>

                    {itemsInCart.length > 0 &&
                    <div>
                        <button className="button-primary" onClick={this.orderCart}>
                            Order
                        </button>
                    </div>
                    }

                    <small>Drag an element to add to cart</small>
                    <DropZone handleDrop={this.handleDrop}/>
                </div>
            </div>
        )
    }
});

module.exports = App;
