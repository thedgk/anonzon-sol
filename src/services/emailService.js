class EmailService {
  async sendOrderConfirmation({ orderId, amount, currency, ...orderDetails }) {
    console.log('=== Order Confirmation ===');
    console.log(`Order ID: ${orderId}`);
    console.log(`Amount: ${amount} ${currency}`);
    console.log('Customer Details:');
    console.log(`Name: ${orderDetails.name}`);
    console.log('Address:', orderDetails.address);
    console.log('Product Details:');
    console.log(`Title: ${orderDetails.productInfo.title}`);
    console.log(`Price: ${orderDetails.productInfo.price} ${orderDetails.productInfo.currency}`);
    console.log('=======================');
  }
}

module.exports = new EmailService(); 