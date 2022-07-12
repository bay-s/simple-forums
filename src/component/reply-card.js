import React from 'react'
import {database} from '../firebase';
import { collection,addDoc,serverTimestamp,query,where,getDocs,doc,setDoc, updateDoc, arrayUnion} from 'firebase/firestore';
import { Link } from 'react-router-dom';
import img from '../default.jpg'


function ReplyCard(props){

    return(
        props.reply.map(data => {
                        if(props.reply_id === props.post_id){
            
                           return <div className='comment-card' key={data.comment_uid}>
                                                      <p className='post-texts'>{data.reply_to}</p>
                           <div className='post-info'>
                           <div className='image-wrap'>
                           <img src={data.reply_author_avatar != null  ? data.reply_author_avatar : img} />
                           </div>
                           <h4 className='username'><Link to={`/account/${data.reply_author_id}`}>{data.reply_author_name}</Link></h4>
                           </div>
                           <div className='comment-content'>
                           <p className='post-text'>{data.reply_text}</p>
                           </div>
                       <div className="action">
                       <i className="fa fa-heart" aria-hidden="true"></i>
                       <i class="fa fa-thumbs-down" aria-hidden="true"></i>
                       <a href='#0' className='reply' data-comment_id={data.comment_id} onClick={props.openReply} >Reply to this comment</a>
                       </div>
                     <form className={props.open ? 'modal-form' : 'hide'} onSubmit={props.commentReply}>
                       <div className='comment-inner'>
                       <div className='comment-title'>
                           <p>Reply </p>
                           <textarea name='commentTxt' className='isi-post' placeholder="Write something..." onChange={props.handlerChange}></textarea>
                       </div>
                       </div>
                        <div className='button-container'>
                           <button className='hvr-sweep-to-right cancel' onClick={props.Cancel}>Cancel</button>
                           <button className='hvr-sweep-to-right save'>Post</button>
                        </div>
                           </form>
                           </div>
                        }
                        
                       }) 
          )
}

export default ReplyCard;