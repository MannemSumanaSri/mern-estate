import Listing from "../models/listing.model.js";

export const createListing = async (req, res, next) => {
  try {
    const listingData = {
      ...req.body,
      userRef: req.user.id,
    };

    if (!listingData.offer) {
      listingData.discountPrice = 0;
    }

    const listing = await Listing.create(listingData);

    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};