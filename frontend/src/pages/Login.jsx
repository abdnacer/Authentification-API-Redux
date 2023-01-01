import { useState } from "react"
import { FaSignInAlt } from "react-icons/fa"


function Login() {

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const { email, password } = formData

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()
    console.log(formData)
  }

  return (
    <>
      <section className="heading">
        <h1>
          <FaSignInAlt /> Login
        </h1>
        <p>Login and Start Setting goals</p>
      </section>

      <section className="form">
        <form onSubmit={onSubmit}>
          <div className="form-group mb-3">
            <input type="email" className="form-control" id='email' name='email' value={email} placeholder='Enter your Email' onChange={onChange} />
          </div>
          <div className="form-group mb-3">
            <input type="password" className="form-control" id='password' name='password' value={password} placeholder='Enter your Password' onChange={onChange} />
          </div>
          <div className="form-group mb-3">
            <button type="submit" className=" btn btn-dark">Submit</button>
          </div>
        </form>
      </section>
    </>
  )
}

export default Login
