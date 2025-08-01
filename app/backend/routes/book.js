const express = require('express');
const router = express.Router();
const booksController = require('../controller/bookscontroller');

router.post('/insert', booksController.inserting);
router.post('/get', booksController.getting);
router.post("/getbyID", booksController.getbyID)
router.put('/update', booksController.updatebook);
router.delete("/delete",booksController.deletebook)
router.post('/col',booksController.getbycolumnname)
module.exports = router;
