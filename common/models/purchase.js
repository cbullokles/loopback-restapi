'use strict';

module.exports = function(Purchase) {

    Purchase.observe('before save', async function(ctx, next) {
        var purchase = ctx.instance;
        console.log(`Loocking for ${purchase.productId}`);

        var purchasedProduct = await Purchase.app.models.product.findById(purchase.productId);

        if (purchasedProduct.stock >= purchase.quantity) {
            purchasedProduct.stock = purchasedProduct.stock - purchase.quantity;
            await purchasedProduct.save();
            ctx.instance.price = purchasedProduct.price;
        } else {
            ctx.instance.status = 'NO_STOCK';
        }
        
        next();    
    })
};
