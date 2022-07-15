import React from 'react'
import { Link } from 'react-router-dom'
import img from '../akun.jpg'



function MessagesCard(props){
return(
    <div className='message-card'>
    <div className='message-profile'>
<img src={props.msg.sender_avatar  != null ? props.msg.sender_avatar  : img} />
<h4 className='username'><Link to={`/account/${props.msg.sender_id}`}>{props.msg.sender_name}</Link></h4>
    </div>
 <div className='message-text-container'>
    <p className='message-text'>
        {props.msg.sender_text}
    </p>
 </div>
</div>
)
}

export default MessagesCard;