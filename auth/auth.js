var express = require('express')

const router = express.Router()

router.post('/', (req, res) => {
    const { credentials } = req.body
    console.log(" Data passed : "+credentials);

})

module.exports = router