'use strict';

module.exports = function(Product) {
    Product.hasStock = async function(productId) {
        return true;
    };

};
