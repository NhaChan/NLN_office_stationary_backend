const Order = require("../models/OrderProduct")
const Product = require("../models/ProductModel")

const createOrder = (newOrder) => {
    return new Promise(async (resolve, reject) => {
        const { orderItems, paymentMethod, itemsPrice, shippingPrice, totalPrice, fullName, address, city, phone, user, isPaid, paidAt, email } = newOrder
        try {
            const promises = orderItems.map(async (order) => {
                const productData = await Product.findOneAndUpdate(
                    {
                        _id: order.product,
                        countInStock: { $gte: order.amount }
                    },
                    {
                        $inc: {
                            countInStock: -order.amount,
                            selled: +order.amount
                        }
                    },
                    { new: true }
                )
                if (productData) {
                    return {
                        status: 'OK',
                        message: 'SUCCESS'
                    }
                }
                else {
                    return {
                        status: 'OK',
                        message: 'ERR',
                        id: order.product
                    }
                }
            })
            const results = await Promise.all(promises)
            const newData = results && results.filter((item) => item.id)
            if (newData.length) {
                const arrId = []
                newData.forEach((item) => {
                    arrId.push(item.id)
                })
                resolve({
                    status: 'ERR',
                    message: `San pham voi id: ${arrId.join(',')} khong du hang`
                })
            } else {
                const createdOrder = await Order.create({
                    orderItems,
                    shippingAddress: {
                        fullName,
                        address,
                        city, phone
                    },
                    paymentMethod,
                    itemsPrice,
                    shippingPrice,
                    totalPrice,
                    user: user,
                    isPaid, paidAt,
                    isDelivered: 'Đã đặt'
                })
                resolve({
                    status: 'OK',
                    message: 'success'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

const getAllOrderDetails = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await Order.find({
                user: id
            }).sort({ createdAt: -1, updatedAt: -1 })
            if (order === null) {
                resolve({
                    status: 'ERR',
                    message: 'The order is not defined'
                })
            }

            resolve({
                status: 'OK',
                message: 'SUCESSS',
                data: order
            })
        } catch (e) {
            // console.log('e', e)
            reject(e)
        }
    })
}

const getOrderDetails = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await Order.findById({
                _id: id
            })
            if (order === null) {
                resolve({
                    status: 'ERR',
                    message: 'The order is not defined'
                })
            }

            resolve({
                status: 'OK',
                message: 'SUCESSS',
                data: order
            })
        } catch (e) {
            // console.log('e', e)
            reject(e)
        }
    })
}

const cancelOrderDetails = async (id) => {
    try {
        const order = await Order.findByIdAndUpdate(
            id,
            { isDelivered: 'Đã hủy' },
            { new: true }
        );

        if (!order) {
            return {
                status: 'ERR',
                message: 'The order is not defined'
            };
        }

        // Trả về thông báo thành công và đối tượng order đã cập nhật
        return {
            status: 'OK',
            message: 'Order successfully canceled',
            data: order
        };
    } catch (error) {
        // Trả về thông báo lỗi nếu có
        console.error('Error canceling order:', error);
        throw error;
    }
};

// const deleteOrderDetails = (id, data) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             let order = []
//             const promises = data.map(async (order) => {
//                 const productData = await Product.findOneAndUpdate(
//                     {
//                         _id: order.product,
//                         selled: { $gte: order.amount }
//                     },
//                     {
//                         $inc: {
//                             countInStock: +order.amount,
//                             selled: -order.amount
//                         }
//                     },
//                     { new: true }
//                 )
//                 if (productData) {
//                     order = await Order.findByIdAndDelete(id)
//                     if (order === null) {
//                         resolve({
//                             status: 'ERR',
//                             message: 'The order is not defined'
//                         })
//                     }
//                 } else {
//                     return {
//                         status: 'OK',
//                         message: 'ERR',
//                         id: order.product
//                     }
//                 }
//             })
//             const results = await Promise.all(promises)
//             const newData = results && results[0] && results[0].id

//             if (newData) {
//                 resolve({
//                     status: 'ERR',
//                     message: `San pham voi id: ${newData} khong ton tai`
//                 })
//             }
//             resolve({
//                 status: 'OK',
//                 message: 'success',
//                 data: order
//             })
//         } catch (e) {
//             reject(e)
//         }
//     })
// }

const getAllOrder = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allOrder = await Order.find().sort({ createdAt: -1, updatedAt: -1 })
            resolve({
                status: 'OK',
                message: 'Success',
                data: allOrder
            })
        } catch (e) {
            reject(e)
        }
    })
}

const updateOrder = async (orderId, isDelivered) => {
    try {
        if (!['Đã đặt','Đang giao', 'Đã giao', 'Đã hủy'].includes(isDelivered)) {
            throw new Error('Invalid status');
        }
        
        const existingOrder = await Order.findById(orderId);
        if (!existingOrder) {
            return { status: 'ERR', message: 'Order not found' };
        }
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { isDelivered: isDelivered },
            { new: true }
        )

        // Trả về thông tin đơn hàng đã cập nhật
        return { status: 'OK', message: 'Order updated successfully', data: updatedOrder };
    } catch (error) {
        // Nếu có lỗi, trả về thông báo lỗi
        console.error('Error updating order:', error);
        throw error;
    }
}


module.exports = {
    createOrder,
    getAllOrderDetails,
    getOrderDetails,
    cancelOrderDetails,
    getAllOrder,
    updateOrder
}