const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const storage = require('local-storage')
const User = require('../../models/userModel')
const Role = require('../../models/roleModel')
const mainMail = require('../../middleware/mailer')

const registerUser = async (req, res) => {
  const { first_name, last_name, email, password, confirm_password } = req.body

  if (first_name === '' || last_name === '' || email === '' || password === '' || confirm_password === '') throw Error('Please fill all the fields')


  const userExists = await User.findOne({ email })

  if (userExists) { throw Error('User already Exists') }
  else {
    // Password Hash 
    const salt = await bcrypt.genSalt(10)
    const password_Hash = await bcrypt.hash(password, salt)

    const user = await User.create({
      first_name,
      last_name,
      email,
      password: password_Hash,
      verification: false,
    })

    if (user) {
      mainMail.main('verify-email', email)
      throw Error('Check Your Email')
    }

    if (!user) throw Error('Invalid User Data')
  }
}


const verifyEmail = async (req, res) => {
  const verify_email = await jwt.verify(req.params.token, process.env.SECRET)

  const verifyUser = await User.findOne({ email: verify_email.email })
  if (verifyUser && verifyUser.verification === true) res.send('logged');

  const verification_email = await User.updateOne({ email: verify_email.email }, { $set: { verification: true } })
  if (verification_email) res.send('logged')
  if (verifyUser && verifyUser.verification === true) throw Error('You Are Registed')
  if (!verification_email) throw Error("You can't to active your account")
}

const loginUser = async (req, res) => {
  const { email, password } = req.body

  if (email === '' || password === '') throw Error('Please Fill All The Fields')

  const user = await User.findOne({ email })

  if (!user) throw Error('Email or password is incorrect')
  if (!user.verification) throw Error('Check Your Email To Active Your Account')
  const correctPassword = await bcrypt.compare(password, user.password)
  if (user && correctPassword) {
    const token = generateToken(user.id)
    storage('token', token)
    res.json({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      token: token
    })

  }
  else {
    throw Error('Invalid Creadtials')
  }
}

const logout = async (req, res) => {
  storage.clear()
  res.send('Your are Logout')
}

const generateToken = (id) => {
  const token = jwt.sign({ id }, process.env.SECRET, {
    expiresIn: '30d'
  })

  return token
}

module.exports = {
  registerUser,
  verifyEmail,
  loginUser,
  logout
}