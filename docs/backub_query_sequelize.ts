// return TabStockMovement.findAll({
//   raw: true,
//   attributes: [
//     [sequelize.fn('max', sequelize.col('movement_date')), 'last_movement_Date']
//   ],
//   include: [{
//     association: 'products',
//     attributes: [
//       "tb_product_id",
//       [sequelize.fn('sum', sequelize.col('movement_value')), 'total_movement_value']
//     ],
//     where: {
//       tb_product_id: products.map((product) => (product.productId)),
//     },
//   }],
//   group: [
//     'tb_product_id'
//   ]
// })