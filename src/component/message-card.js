import React from 'react'
import { Link, useParams } from 'react-router-dom';
import img from '../akun.jpg'


function MessageCard(props){

    return(
     <Link to={`/message-detail/${props.msg.message_id}`}>
    <div className='message-card' key={props.index} data-index={props.index}>
     <div className='from'>
        <h4>{props.msg.sender_name}</h4>
        </div>
        <div className='message-content'>
          <p >{props.msg.sender_text}</p>
        </div>
        <div className='message-content'>
          <p className='date'>{props.msg.timestamp}</p>
        </div>
     </div>
     </Link>
    )
}

export default MessageCard;