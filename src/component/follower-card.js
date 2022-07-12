import React from 'react'
import { Link } from 'react-router-dom';
import img from '../akun.jpg'


function FollowerCard(props){

    return(
   <div className='follower-container'>
    <div className='post-info'>
        <div className='image-wrap'>
        <img src={props.data.follower_avatar  != null ? props.data.follower_avatar : img} />
        </div>
        <div className='post-user'>
            <h4 className='username'><Link to={`/account/${props.data.follower_id}`}>{props.data.follower_name}</Link></h4>
        </div>
    </div>
   </div>
    )
}

export default FollowerCard;