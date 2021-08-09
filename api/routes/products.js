const express= require('express');
const router = express.Router();

const productsController= require('../controllers/products');
const checkAuth= require('../middleware/check-auth');



router.get('/', productsController.get_all_products);

router.post('/', checkAuth, productsController.insert_new_product);

router.get('/:productId',productsController.get_one_product);

router.patch('/:productId', checkAuth, productsController.update_one_product);

router.delete('/:productId', checkAuth, productsController.delete_product);

module.exports = router;