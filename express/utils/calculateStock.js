const calculateStock = (oldQuantity, newQuantity, currentStock) => {
    const stock = currentStock + oldQuantity - newQuantity;

    if (stock < 0) {
        throw new Error("Insufficient stock");
    }

    return stock;
};

export default calculateStock;