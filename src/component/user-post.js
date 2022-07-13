import React from 'react'
import { Link } from 'react-router-dom'
import {database} from '../firebase';
import {doc, deleteDoc,updateDoc} from 'firebase/firestore';

function UserPost(props){
    const month = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Okt','Nov','Dec']
    const  timestamp = Array.isArray( props.data) ? props.data.timestamp.seconds : ""

    const time = new Date(timestamp*1000)
    const date = `${time.getDate()} ${month[time.getMonth()]} ${time.getFullYear()}`
    const post_contents = Array.isArray(props.data.post_content) ? props.data.post_content.match(/.{1,250}/g).map(text => {
        return <p className='post-text'>{text}</p>
        }) : ""
    
     function deletePost(e){
            const id = e.target.dataset.id
            const docDelete = doc(database,'post',id )
            const docUpdate = doc(database,'user',props.id) 
 
              if(confirm("Are you sure want to delete this post")){
                updateDoc(docUpdate,{total_likes: - 1})
                deleteDoc( docDelete)
                .then(() =>{
                  alert("delete sukses")
                })
                .catch(err => {
                  console.log(err.message);
                })
              }else{
          
              }
            }
              
    const hide = {
        height:`${500}px`,
        overflow:'hidden'
    }

    // const post_content = props.data.post_content.match(/.{1,250}/g)

    return(
props.data === undefined ? "" :         <div class="post-card">
<div className='post' >
<div className='user-post-info'>
    <div className='post-user'>
    <h2 className='post-title'><Link to={`/post-detail/${props.data.post_id}`}>{props.data.title}</Link></h2>
        <span className='date'>Post at : {date}</span>
    </div>
<div className={props.isLogin ? 'actions' : 'hide'}>
<i class="fa fa-trash delete" data-id={props.data.post_id} onClick={deletePost}></i>
</div>
</div>
<div className={props.data.post_image === null ? 'hide' : 'image-wrap'}>
<Link to={`/post-detail/${props.data.post_id}`}>
<img src={props.data.post_image} />
</Link>
</div>
<div className='post-artikel'>
{post_contents }
</div>
</div>
</div>
    )
}

export default UserPost;


