const shopify = require("../../shopify.app.js");

module.exports = {
  key: "shopify-new-abandoned-cart",
  name: "New Abandoned Cart",
  description: "Emits an event each time a user abandons their cart.",
  version: "0.0.4",
  props: {
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
    shopify,
  },
  async run() {
    const since_id = this.db.get("since_id") || null;
    const results = await this.shopify.getAbandonedCheckouts(since_id);
    for (const cart of results) {
      this.$emit(cart, {
        id: cart.id,
        summary: cart.email,
        ts: Date.now(),
      });
    }
    if (results[results.length - 1])
      this.db.set("since_id", results[results.length - 1].id);
  },
};