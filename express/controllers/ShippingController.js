import Shipping from '../models/Shipping.js'

export const getShippingsForUser = async (req, res) => {
    try {
        const userId = req.params.id ?? req.user._id;
        const shippings = Shipping.find({'user._id': userId });

        res.status(200).json({
            shippings: shippings
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching shippings', error });
    }
}

export const getShippingById = async (req, res) => {
    try {
        const shipping = Shipping.find(req.params.id).populate('user');

        res.status(200).json({
            shipping: shipping
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching shipping', error });
    }
}