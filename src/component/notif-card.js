import React from 'react'
import { Link } from 'react-router-dom';


function NotifCard(props){

    return(
<div className='post-info'>
    <div className='image-wrap'>
    <Link to={`/account/${props.data.user_id}`}><img src={props.data.user_avatar} /></Link>
    </div>
    <div className='post-user'>
        <h4 className='username'><Link to={`/post-detail/${props.data.post_id}`}>{props.data.pesan}</Link></h4>
    </div>
</div>
    )
}

export default NotifCard;