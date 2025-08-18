const Joi=require('joi');
const Listing = require('./models/listing');

module.exports.listingschema=Joi.object({
    listing:Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        price:Joi.number().required().min(0),
        country:Joi.string().required(),
        location:Joi.string().required(),
        image: Joi.string().uri().allow('').optional()
    }).required()
})

module.exports.reviewSchema=Joi.object({
    review:Joi.object({
        rating:Joi.number().required().min(1).max(5),
        Comment:Joi.string().required()
    })
})

