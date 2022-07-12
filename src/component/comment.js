import React from 'react'
import { Link } from 'react-router-dom'
import img from '../akun.jpg'
import { collection,addDoc,serverTimestamp,query,where,getDocs,doc,setDoc, updateDoc, arrayUnion,getDocsFromCache} from 'firebase/firestore';
import {database} from '../firebase';



class Comment extends React.Component{
constructor(){
    super()
    this.state = {
      hide:true,
      comment:'',
      user_post_id:'',
      total_comments:null
    }
}

async componentDidMount(){
    const id = this.props.id
    const db = collection(database,'post')
    const q = query(db ,where("user_post_id","==" , id))

    await getDocs(db).then(res => {
            res.docs.map(item => {
                const data = item.data()

    if(data.user_post_id != this.props.user_id){
        return this.setState({ 
            user_post_id:this.state.user_post_id = data.user_post_id,
            total_comments:this.state.total_comments = data.total_comment
           })  
    }
              })
        })


}
handlerChange = (e) => {
    const {name,value} = e.target
    this.setState({[name]:value})

    if(value.length > 2){
        this.setState({hide:this.state.hide = false})
    }else{
        this.setState({hide:this.state.hide = true})
    }
  }

Cancel = e => {
    e.preventDefault()
    this.setState({hide:this.state.hide = true})
}

commentNotif = (ranID) => {
    const notif_id =  this.state.user_post_id

    const docUpdate = doc(database,'notifikasi',notif_id ) // ADD NOTIF
    const time = serverTimestamp()
  
    updateDoc(docUpdate,{
                notif:arrayUnion({
                    pesan:`${this.props.name} Telah mengomentari postingan anda`,
                    user_name:this.props.name,
                    user_id:this.props.user_id,
                    user_avatar:this.props.avatar,
                    post_id:this.props.id,
                  })
          })
    .then(() => {alert("notif me senpai")})
    .catch((err) => {console.log(err)}); 
  
  }

createReply = () => {
    const db = collection(database,'reply');
    const user_id = this.props.id
    console.log(user_id);
    setDoc(doc(db,user_id ),  {
         original_reply:[],
         user_reply:[],
         comment_id:this.props.id
      })
      .then(() => {console.log("notif sukses")})  
      .catch((err) => {
        console.log(err);
      })
}

postComment = (e) => {
    e.preventDefault()
    const ranID = (Math.random() + 1).toString(36).substring(1);
    const db = collection(database,"comment")
    const id = this.props.user_id
    const post_id = this.props.id
    const docUpdate =doc(database,"post",post_id)
if (this.state.comment.length < 5) {
alert("Too short")
}else{
    this.setState({hide:this.state.hide = false})
    this.createReply()
    this.commentNotif(ranID)
    updateDoc(docUpdate,{
        total_comment:this.state.total_comments + 1
      })
      setDoc(doc(db,ranID),  {
        comment_id:ranID,
        comment_author_id:id,
        post_id: post_id,
        post_owner_id:this.state.user_post_id,
        comment_text:this.state.comment,
        comment_author_name:this.props.name,
        user_avatar:this.props.avatar,
        timestamp: serverTimestamp()
        })
        .then(() =>{
        alert("comment posted")
        this.setState({hide:this.state.hide = true})
        e.target.reset()
        })
        .catch(err => {
        alert(err.message)
        })
}
  }


render(){
    return(
        <div className='comment-container'>
    <form className='modal-form' onSubmit={this.postComment }>
<div className='comment-inner'>
<div className='comment-title'>
    <p>Post a comment</p>
<div className='post-info'>
<div className='image-wrap'>
<img src={this.props.avatar.length < 1 ? img : this.props.avatar} />
</div>
    <h4 className='username'>{this.props.name}</h4>
 </div>
 {/* END COMMENT TITLE */}
    <textarea name='comment' className='isi-post' placeholder="Write something..." onChange={this.handlerChange}></textarea>
    </div>
</div>
 <div className={this.state.hide ? 'hide' : 'button-container' }>
    <button className='hvr-sweep-to-right cancel' onClick={this.Cancel}>Cancel</button>
    <button className='hvr-sweep-to-right save'>Post</button>
 </div>
    </form>
        </div>
    )
}

}

export default Comment;