import React from 'react'
import { Link } from 'react-router-dom'


function NoCategory(props){

    return(
        <>
        <div className='not-found'>
        <h1 >Sorry. No posts in this category yet</h1>
        <Link to='/'>  <i class="fa fa-long-arrow-left" aria-hidden="true"></i>BACK TO HOME</Link>
        </div>
    </>
    )
}

export default NoCategory;