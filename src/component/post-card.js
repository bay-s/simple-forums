import React from 'react'
import logo from '../default.jpg'
import img from '../akun.jpg'
import { Link } from 'react-router-dom'
import {database} from '../firebase';
import { collection, getDocs,query, where} from 'firebase/firestore';
class PostCard extends React.Component{
constructor(){
    super()
    this.state = {
    getAvatar:[],
    month:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Okt','Nov','Dec']
    }
}

async componentDidMount(){
    const db = collection(database,"user")
    const id = this.props.data.user_post_id

    const q = query(db ,where("uid","==" , id))

  // GET AVATAR
  await getDocs(q).then(res => {
    res.docs.map(item => {
    const data = item.data()
return this.setState({getAvatar:this.state.getAvatar = data.images})
      });
    })

}

render(){
const  timestamp = this.props.data.timestamp.seconds
const time = new Date(timestamp*1000)
const date = `${time.getDate()} ${this.state.month[time.getMonth()]} ${time.getFullYear()}`
const post_contents = Array.isArray(this.props.data.post_content) ? this.props.data.post_content.match(/.{1,250}/g).map(text => {
    return <p className='post-text'>{text}</p>
    }) : ""

const hide = {
    height:`${500}px`,
    overflow:'hidden'
}
const empty = {

}

    return(
        <div class="post-card">
<div className='post-info'>
    <div className='post-info-inner'>
    <img src={this.state.getAvatar.length < 1 ? img : this.state.getAvatar} />
    <div className='post-user'>
        <h4 className='username'><Link to={`/account/${this.props.data.user_post_id}`}>{this.props.data.username}</Link></h4>
        <span className='date'>{date}</span>
    </div>
    </div>
</div>
{/* style={post_contents.length > 1 ? hide : empty} */}
<div className='post' >
<h2 className='post-title'><Link to={`/post-detail/${this.props.data.post_id}`}>{this.props.data.title}</Link></h2>
{/* CHECK JIKA ADA GAMBAR TAMPILKAN */}
<div className={this.props.data.post_image === null ? 'hide' : 'image-wrap'}>
<Link to={`/post-detail/${this.props.data.post_id}`}>
<img src={this.props.data.post_image} />
</Link>
</div>
<div className='post-artikel'>
{post_contents }
</div>
</div>
</div>
    )
}

}

export default PostCard;