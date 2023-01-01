const router = require('express').Router()
const { 
  registerUser,
  verifyEmail,
  loginUser,
  logout
} = require('../controllers/authController/authController')

const { tryCatch } = require('../middleware/tryCatch')
const { errorHandler } = require('../middleware/errorHandler')
const { authParemission, userPermission } = require('../middleware/permission')

router.post('/register', authParemission, tryCatch(registerUser))
router.get('/verify-email/:token', tryCatch(verifyEmail))
router.post('/login', authParemission, tryCatch(loginUser))
router.get('/logout', userPermission, tryCatch(logout))

router.use(errorHandler)

module.exports = router