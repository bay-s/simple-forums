import React from 'react'
import { Link } from 'react-router-dom'



function UserPost(props){
    const month = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Okt','Nov','Dec']
    const  timestamp = props.data.timestamp.seconds
    const time = new Date(timestamp*1000)
    const date = `${time.getDate()} ${month[time.getMonth()]} ${time.getFullYear()}`
    const post_contents = Array.isArray(props.data.post_content) ? props.data.post_content.match(/.{1,250}/g).map(text => {
        return <p className='post-text'>{text}</p>
        }) : ""
        
    const hide = {
        height:`${500}px`,
        overflow:'hidden'
    }
    const empty = {
    
    }
    const post_content = props.data.post_content.match(/.{1,250}/g)


    return(
        <div class="post-card">
        <div className='post' >
        <div className='post-info'>
            <div className='post-user'>
            <h2 className='post-title'><Link to={`/post-detail/${props.data.post_id}`}>{props.data.title}</Link></h2>
                <span className='date'>Post at : {date}</span>
            </div>
   <div className={this.props.isLogin ? 'actions' : 'hide'}>
    <i className="fa fa-ellipsis-h" aria-hidden="true"></i>
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


