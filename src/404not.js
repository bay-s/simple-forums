import React from 'react'
import { Link } from 'react-router-dom';

class NotFound extends React.Component{

    render(){
        return(
            <>
           <div className='not-found'>
           <h1 >PAGE NOT FOUND</h1>
           <Link to='/'>  <i class="fa fa-long-arrow-left" aria-hidden="true"></i>BACK TO HOME</Link>
           </div>
            </>
        )
    }
}

export default NotFound;