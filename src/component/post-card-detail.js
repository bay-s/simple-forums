import React from 'react'
import logo from '../default.jpg'
import img from '../akun.jpg'
import { Link } from 'react-router-dom'
import {database} from '../firebase';
import { collection, getDocs,query, where,doc,updateDoc,addDoc,arrayUnion,serverTimestamp, arrayRemove} from 'firebase/firestore';



class PostCardDetail extends React.Component{
constructor(){
    super()
    this.state = {
    getAvatar:[],
    month:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Okt','Nov','Dec'],
    uniqId:'',
    total:null,
    token:'',
    likes_id:[]
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
 
   


    const likes = collection(database,'post_likes')
    const queryUser = query(likes ,where("likes_post_id","==" ,this.props.data.post_id))
                 // GET USER LIKES
     
                  await getDocs(queryUser).then(res => {
                    res.docs.map(item => {
                      const data = item.data()
                      console.log(data);
                        this.setState({likes_id:this.state.likes_id = data.user_likes_id})
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

    const likes = collection(database,'post_likes')
    const queryUser = query(likes ,where("likes_post_id","==" ,this.props.data.post_id))
                 // GET USER LIKES
     
                  await getDocs(queryUser).then(res => {
                    res.docs.map(item => {
                      const data = item.data()
                        this.setState({likes_id:this.state.likes_id = data.user_likes_id})
                        });
                      })
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
  const ranID = Math.random().toString(36).substring(2,36);
  const docUpdate = doc(database,'post',id ) 
  const docUpdates = doc(database,'post_likes',id) 
  if(e.target.dataset.id === id){
    if(!e.target.classList.contains('likes')){
      this.likesNotif(id)
      updateDoc(docUpdate, {
        total_likes: this.state.total + 1
      })
      updateDoc(docUpdates,{user_likes_id:arrayUnion(this.props.user_id)})
      .then(() =>{
        alert("add likes sukses")
      })
      .catch(err => {console.log(err);}) 
        }
        else{
          updateDoc(docUpdates,{user_likes_id:arrayRemove(this.props.user_id)})
          updateDoc(docUpdate, {
            total_likes: this.state.total - 1
          })
            .then(() => {alert("remove likes sukses")})
            .catch((err) => {console.log(err)}); 
        }
    }
 
}


render(){
const  timestamp = this.props.data.timestamp.seconds
const time = new Date(timestamp*1000)
const date = `${time.getDate()} ${this.state.month[time.getMonth()]} ${time.getFullYear()}`

const post_content = this.props.data.post_content.match(/.{1,250}/g)

const likes_id = this.state.likes_id.length < 1 ? <i className="fa fa-heart"  data-id={this.props.data.post_id} onClick={this.likesPost }></i> : this.state.likes_id.map(id => {
  if(id ===  this.props.user_id){
    return <i className="fa fa-heart likes"  data-id={this.props.data.post_id} onClick={this.likesPost }></i>
  }else{
    return <i className="fa fa-heart"  data-id={this.props.data.post_id} onClick={this.likesPost }></i>
  }

})

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
{likes_id}
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