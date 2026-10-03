const express = require('express');
const router = express.Router();
const propertiesController = require('../controllers/propertiesController');
const auth = require('../middleware/auth');

router.get('/public', propertiesController.getPublicProperties);

router.get('/', auth, propertiesController.getAllProperties);
router.get('/:id', auth, propertiesController.getPropertyById);
router.post('/', auth, propertiesController.createProperty);
router.put('/:id', auth, propertiesController.updateProperty);
router.patch('/:id/toggle', auth, propertiesController.toggleProperty);
router.delete('/:id', auth, propertiesController.deletePropertyLogical);

module.exports = router;