
import '../../scss/login/register.scss'
import { useState } from 'react'
import { registerAPI } from '../../api/authAPI';
// import { Link, useNavigate } from 'react-router-dom';

function Register() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  // const navigate = useNavigate();

  function handleValueChange(e,setValue) {
    setValue(e.target.value);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()

    }
  }

  async function handleSubmit() {
    if (email.length === 0 || password.length === 0) {
      setLoginError('Please enter email and password')
      return
    }
    const userInfo = {
      'email': email,
      'password': password
    };

    try {
      const response = await registerAPI(userInfo);
      // console.log('Login successful:', response.data);
      const token = response.data.token
      localStorage.setItem('authToken', token) 
      // navigate('/main')



    } catch (error) {
      if (error.response) {
        console.error('Login error:', error.response.data);
        setLoginError(error.response.data.message);
      } else if (error.request) {
        console.error('Login error: No response from the server', error.request);
      } else {
        console.error('Login error:', error.message);
      }
    }
  } 
  return (
    <div className="wrapper">
      <img src="https://d1nhio0ox7pgb.cloudfront.net/_img/o_collection_png/green_dark_grey/512x512/plain/tab_pane.png" alt="logo" className='logo' />
      <h1>REGISTER</h1>
    <input 
      type="text" 
      placeholder="Email"
      value={email}
      onChange={(e) => handleValueChange(e, setEmail)}
    />  
    <input 
      type="password" 
      placeholder="Password" 
      value={password}
      onChange={(e) => handleValueChange(e, setPassword)} 
      onKeyDown={(e) => handleKeyDown(e)}
    />  
    {loginError && <p className='loginError'>{loginError}</p>}
    <button  className='submitButton'
      onClick={handleSubmit}
    > register </button>
  </div>
  )
}

 export default Register