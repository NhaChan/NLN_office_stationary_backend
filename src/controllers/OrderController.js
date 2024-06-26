const OrderService = require('../services/OrderService')

const createOrder = async (req, res) => {
    try { 
        const { paymentMethod, itemsPrice, shippingPrice, totalPrice, fullName, address, city, phone } = req.body;
        // console.log('object', req.body)
        if (!paymentMethod || !itemsPrice || shippingPrice < 0 || !totalPrice || !fullName || !address || !city || !phone) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The input is required'
            })
        } else {
        const response = await OrderService.createOrder(req.body)
        return res.status(200).json(response)
        }
    } catch (e) {
        return res.status(404).json({ 
            message: e
        })
    }
}

const getAllOrderDetails = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await OrderService.getAllOrderDetails(userId)
        return res.status(200).json(response)
    } catch (e) {
        // console.log(e)
        return res.status(404).json({
            message: e
        })
    }
}

const getDetailsOrder = async (req, res) => {
    try {
        const orderId = req.params.id
        if (!orderId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await OrderService.getOrderDetails(orderId)
        return res.status(200).json(response)
    } catch (e) {
        // console.log(e)
        return res.status(404).json({
            message: e
        })
    }
}

const cancelOrderDetails = async (req, res) => {
    try {
        const data= req.body.orderItems
        const orderId= req.body.orderId
        if (!orderId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The orderId is required'
            })
        }
        const response = await OrderService.cancelOrderDetails(orderId, data)
        return res.status(200).json(response)
    } catch (e) {
        // console.log(e)
        return res.status(404).json({
            message: e
        })
    }
}

const getAllOrder = async (req, res) => {
    try {
        const data = await OrderService.getAllOrder()
        return res.status(200).json(data)
    } catch (e) {
        // console.log(e)
        return res.status(404).json({
            message: e
        })
    }
}

const updateOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const { isDelivered } = req.body;
    
        // Gọi hàm service để cập nhật đơn hàng
        const updatedOrder = await OrderService.updateOrder(orderId, isDelivered);
    
        // Trả về phản hồi cho client
        return res.status(200).json(updatedOrder);
      } catch (error) {
        // Xử lý lỗi nếu có
        console.error('Error updating order:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }
}

module.exports = {
    createOrder,
    getAllOrderDetails,
    getDetailsOrder,
    cancelOrderDetails,
    getAllOrder,
    updateOrder
}
