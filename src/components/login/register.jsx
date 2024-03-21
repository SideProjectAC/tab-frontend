import '../../scss/login/register.scss'

function Register() {
  return (
    <div className="wrapper">
      <img src="https://d1nhio0ox7pgb.cloudfront.net/_img/o_collection_png/green_dark_grey/512x512/plain/tab_pane.png" alt="logo" className='logo' />
      <h1>REGISTER</h1>
    <input 
      type="text" 
      placeholder="Username"
      // value={username}
      // onChange={(nameInputValue) => setUsername(nameInputValue)}
    />  
    <input 
      type="text" 
      placeholder="Email" 
      /* value={password}
      onChange={(passwordInputValue) => setPassword(passwordInputValue)} */
    />  
    <input 
      type="password" 
      placeholder="Password" 
      /* value={password}
      onChange={(passwordInputValue) => setPassword(passwordInputValue)} */
    />  
    <button> register </button>
  </div>
  )
}

 export default Register

