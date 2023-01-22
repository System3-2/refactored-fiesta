import React from 'react'

const Form = () => {

  function handleSubmit(e) {
    e.preventDefault();
  }
  return (
    <form onSubmit={handleSubmit}>
      <div className="container">
        <h2>Join the community</h2>
        <p>Lorem ipsum, dolor sit amet consectetur<br></br> adipisicing elit. Nihil, provident.</p>

        <button className="btn">Join with Facebook</button>
        <div>
          <input type="text" placeholder='Email' />
        </div>
        <div>
          <input type="text" placeholder='Password' />
        </div>
        <button className='btn-sec'>Create New Account</button>
        <p>By Joining you agree to our Terms of<br></br> Service and Privacy Policy</p>
      </div>
    </form>
  )
}

export default Form;
