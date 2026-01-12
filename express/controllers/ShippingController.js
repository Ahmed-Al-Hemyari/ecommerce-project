import Order from '../models/Order.js';
import Shipping from '../models/Shipping.js'
import User from '../models/User.js'

export const getShippingsForUser = async (req, res) => {
    try {
        let userId;
        if (req.params.id && req.user.role === 'admin') {
            userId = req.params.id;
        } else {
            userId = req.user._id;
        }
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const shippings = await Shipping.find({ "user" : user._id});

        const formattedShippings = shippings.map(shipping => ({
            ...shipping.toObject(),
            name: `${shipping.address1} - ${shipping.city}, ${shipping.country}`
        }))

        res.status(200).json({
            shippings: formattedShippings
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching shippings', error });
    }
}

export const getShippingById = async (req, res) => {
    try {
        const shipping = await Shipping.findById(req.params.id)
            .populate({
                path: 'user',
                select: '-password'
            });
        res.status(200).json({
            shipping: shipping
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching shipping', error });
    }
}

export const createShipping = async (req, res) => {
    try {
        const userId = req.body.user_id ?? req.user._id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const shippings = await Shipping.find({ "user" : user._id})
        if (shippings.length >= 5) {
            return res.status(422).json({message: 'Maximum number of shipping address reached'})
        }

        let isFirst = false;
        if (shippings.length === 0) {
            isFirst = true;
        }

        if (!req.body.address1 || !req.body.city || !req.body.zip || !req.body.country) {
            return res.status(400).json({ message: 'Please fill all required fields!' });
        }

        const shipping = await Shipping.create({
            user: user._id,
            address1: req.body.address1,
            address2: req.body.address2,
            city: req.body.city,
            zip: req.body.zip,
            country: req.body.country,
            isDefault: isFirst
        })

        res.status(201).json({
            message: 'Shipping created successfully',
            shipping: shipping
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to create order" });
    }
}

export const updateShipping = async (req, res) => {
    try {
        const shipping = await Shipping.findById(req.params.id);
        if (!shipping) {
            return res.status(404).json({ message: 'Shipping not found' });
        }

        shipping.address1 = req.body.address1 ?? shipping.address1;
        shipping.address2 = req.body.address2 ?? shipping.address2;
        shipping.city = req.body.city ?? shipping.city;
        shipping.zip = req.body.zip ?? shipping.zip;
        shipping.country = req.body.country ?? shipping.country;

        await shipping.save();

        return res.status(200).json({
            message: 'Shipping updated successfully',
            shipping
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Failed to update shipping',
            error: error.message
        });
    }
}

export const deleteShipping = async (req, res) => {
    try {
        const shipping = await Shipping.findById(req.params.id);
        if (!shipping) {
            return res.status(404).json({message: 'Shipping not found!'});
        }
    
        const orders = await Order.find({'shipping._id': shipping._id});
        if (orders.length > 0) {
            return res.status(422).json({message: 'Cannot delete shipping address with existing orders!'});
        }
    
        if (shipping.isDefault) {
            return res.status(422).json({message: 'Cannot delete default shipping address!'});
        }
    
        await shipping.deleteOne();
    
        return res.status(200).json({
            message: 'Shipping deleted successfully'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Faild to delete shippings'
        });
    }
}

export const makeDefault = async (req, res) => {
    try {
        const shipping = await Shipping.findById(req.params.id);
        if (!shipping) {
            return res.status(404).json({message: 'Shipping not found!'});
        }
    
        const user = await User.findById(shipping.user)
        if (!user) {
            return res.status(404).json({message: 'User not found!'});
        }
    
        await Shipping.updateMany(
            { user: user._id },
            { isDefault: false }
        );
        await shipping.updateOne({'isDefault': true});
    
        return res.status(200).json({
            message: 'Default shipping updated',
            shipping
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Faild to set shipping as default'
        });
    }
}