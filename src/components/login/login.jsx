import '../../scss/login/login.scss'

function Login () {

  return (
  <div className="wrapper">
      <img src="https://d1nhio0ox7pgb.cloudfront.net/_img/o_collection_png/green_dark_grey/512x512/plain/tab_pane.png" alt="logo" className='logo' />
      <h1>LOGIN</h1>
    <input 
      type="text" 
      placeholder="Email"
      // value={username}
      // onChange={(nameInputValue) => setUsername(nameInputValue)}
    />  
    <input 
      type="password" 
      placeholder="Password" 
      /* value={password}
      onChange={(passwordInputValue) => setPassword(passwordInputValue)} */
    />  

    <button  > login </button>
    <a href="#"> register </a>
  </div>
  )

}
export default Login