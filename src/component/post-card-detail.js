import React from 'react'
import logo from '../default.jpg'
import img from '../akun.jpg'
import { Link } from 'react-router-dom'
import {database} from '../firebase';
import { collection, getDocs,query, where,doc,updateDoc,addDoc,deleteDoc, arrayUnion,serverTimestamp} from 'firebase/firestore';



class PostCardDetail extends React.Component{
constructor(){
    super()
    this.state = {
    getAvatar:[],
    month:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Okt','Nov','Dec'],
    uniqId:'',
    total:null,
    token:''
    }
}

async componentDidMount(){
    const db = collection(database,"user")
    const id = this.props.data.user_post_id
    const q = query(db ,where("uid","==" , id))
    const post = collection(database,'post')
    

    // get uniq id
    await getDocs(post).then(res => {
        if (res) {
            res.docs.map(item => {
                const data = item.data()
  if(item.id === data.post_id){
    return this.setState({ uniqId:this.state.uniqId = data.post_id       })  
  }
    
              })
            }
        })
        const docUpdate = doc(database,'post',this.state.uniqId)

  // GET AVATAR
  await getDocs(q).then(res => {
    res.docs.map(item => {
    const data = item.data()
return this.setState({
  getAvatar:this.state.getAvatar = data.images,
  total:this.state.total = this.props.data.total_likes
})
      });
    })
 

}

async componentDidUpdate(){
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

    this.setState({total:this.state.total = this.props.data.total_likes})
}

logout = () => {
  setToken("")
  window.localStorage.removeItem("token")
}


likesNotif = (id) => {
  const notif_id = this.props.data.user_post_id
  const docUpdate = doc(database,'notifikasi',notif_id ) // ADD NOTIF

    updateDoc(docUpdate,{
              notif:arrayUnion({
                  pesan:`${this.props.user_name} Telah menyukai postingan anda`,
                  user_name:this.props.user_name,
                  user_id:this.props.user_id,
                  user_avatar:this.props.avatar,
                  post_id:id
                })
        })
  .then(() => {alert("notif me senpai")})
  .catch((err) => {console.log(err)}); 

}

likesPost = (e) => {
  const id = this.props.data.post_id
  const is_likes = localStorage.getItem(id)
  const username = this.props.data.username
  const docUpdate = doc(database,'post',id ) 
  if(e.target.dataset.id === id){
    if(!e.target.classList.contains('likes')){
            localStorage.setItem(id,id)
            updateDoc(docUpdate,{
              total_likes:this.state.total + 1
                })
                .then(() =>{
                  alert("add likes sukses")
                  this.likesNotif(id)
                })
                .catch(err => {console.log(err);}) 
        }
        else{
          localStorage.removeItem(id, id);
          updateDoc(docUpdate, {
            total_likes: this.state.total - 1
          })
            .then(() => {alert("remove likes sukses")})
            .catch((err) => {console.log(err)}); 
        }
    }
 
}

deletePost = (e) => {
  const id = e.target.dataset.id
  const docDelete = doc(database,'post',id )
    if(confirm("Are you sure want to delete this post")){
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

render(){
const  timestamp = this.props.data.timestamp.seconds
const time = new Date(timestamp*1000)
const date = `${time.getDate()} ${this.state.month[time.getMonth()]} ${time.getFullYear()}`

const post_content = this.props.data.post_content.match(/.{1,250}/g)
const is_likes = localStorage.getItem( this.props.data.post_id)


    return(
        <div class="post-card">
<div className='post-info'>
<div className='post-info-inner'>
<img src={this.state.getAvatar  != null ? this.state.getAvatar : img} />
<div className='post-user'>
    <h4 className='username'><Link to={`/account/${this.props.data.user_post_id}`}>{this.props.data.username}</Link></h4>
    <span className='date'>{date}</span>
</div>
</div>
</div>
<div className='post'>
<h2 className='post-title'>{this.props.data.title}</h2>
{/* CHECK GAMBAR */}
<div className={this.props.data.post_image.length < 1 ? 'hide' : 'image-wrap'}>
<img src={this.props.data.post_image} />
</div>
<div className='post-artikel'>
{post_content.map(text => {
return <p className='post-text'>{text}</p>
}) }
</div>
</div>
<div className="action">
<span className='total-like'>{this.props.data.total_likes} Likes</span>
<i className={is_likes ===  this.props.data.post_id ? "fa fa-heart likes" :  "fa fa-heart" } aria-hidden="true"  data-id={this.props.data.post_id} onClick={this.likesPost }></i>
<i class="fa fa-thumbs-down" aria-hidden="true"></i>

</div>
</div>
    )
}

}

export default  PostCardDetail;


// <div className='image-wrap'>
// <img src={this.state.getAvatar  != null ? this.state.getAvatar : img} />
// </div>
// <div className='post-user'>
//     <h4 className='username'><Link to={`/account/${this.props.data.user_post_id}`}>{this.props.data.username}</Link></h4>
//     <span className='date'>{date}</span>
// </div>