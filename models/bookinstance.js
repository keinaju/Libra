const { DateTime } = require("luxon");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookInstanceSchema = new Schema({
    // Reference to the associated book
    book: { type: Schema.Types.ObjectId, ref: "BookModel", required: true }, 
    imprint: { type: String, required: true },
    status: {
        type: String,
        required: true,
        enum: ["Available", "Maintenance", "Loaned", "Reserved"],
        default: "Maintenance",
    },
    due_back: { type: Date, default: Date.now },
});

BookInstanceSchema.virtual("url").get(function () {
    // We don't use an arrow function as we'll need the this object
    return `/catalog/bookinstance/${this._id}`;
});

BookInstanceSchema.virtual("due_back_formatted").get(function () {
    return DateTime.fromJSDate(this.due_back).toLocaleString(DateTime.DATE_MED);
});

BookInstanceSchema.virtual("due_back_yyyy_mm_dd").get(function () {
    return DateTime.fromJSDate(this.due_back).toISODate(); // format 'YYYY-MM-DD'
});

module.exports = mongoose.model("BookInstanceModel", BookInstanceSchema);
