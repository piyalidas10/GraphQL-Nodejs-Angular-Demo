const mongoose = require("mongoose");

const QuoteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
});

const Quote = mongoose.model("Quote", QuoteSchema);

module.exports = Quote;