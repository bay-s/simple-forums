import React from 'react'
import {database} from '../firebase';
import { collection,addDoc,serverTimestamp,query,where,getDocs,doc,setDoc, updateDoc, arrayUnion,getDocsFromCache} from 'firebase/firestore';
import { Link } from 'react-router-dom';
import img from '../default.jpg'
import ReplyCard  from './reply-card';

class DisplayComment extends React.Component{
constructor(){
    super()
    this.state = {
     comment:[],
     total_comments:null,
     commentTxt:'',
     open:false,
     view:false,
     openReply:false,
     comment_id:'',
     reply:[],
     reply_id:'',
     comment_owner:'',
     comment_user_id:''
    }
}

async componentDidMount(){
    const id = this.props.post_id
    const id2 = this.props.user_id
    const reply = collection(database,'reply')
    const qReply = query(reply,where("comment_id","==" ,'.pdt9jeyphv'))

    if(id2 === id){
        console.log("sama");
    }else{
       console.log("beda");
    }
    // GET POST COMMENT
    
    const comment = collection(database,'comment')
    const q1 = query(comment,where("post_id","==" ,id ))
    const post = collection(database,'post')
    const q = query(post,where("post_id","==" ,id ))
    // GET USER DETAIL
 
    await getDocsFromCache(q1).then(res => {
        if (res) {
        const result = JSON.stringify(res)
        return this.setState({ 
           comment:this.state.comment = result
           })  
            }
        })

 
      // GET POST
  await getDocs(q).then(res => {

  res.docs.map(item => {
        const data = JSON.stringify(item.data())
if(data){
  const totals = JSON.parse(data);
  return this.setState({
    total_comments:this.state.total_comments = totals.total_comment 
    })
}

          });
        })



            // GET COMMENT REPLY
    await  getDocsFromCache(qReply).then(res => {
      if (res) {
          res.docs.map(item => {
              const data = item.data()
              return this.setState({
                reply:this.state.reply = data.user_reply,
                reply_id:this.state.reply_id = data.comment_id
                  })
            })
          }
      })
}


async componentDidUpdate(){
  const id = this.props.post_id
  const reply = collection(database,'reply')
  const qReply = query(reply,where("comment_id","==" ,id))
  // GET POST COMMENT
  
  const comment = collection(database,'comment')

  const q1 = query(comment,where("post_id","==" ,id ))


  await getDocs(q1).then(res => {
      if (res) {
      return this.setState({ 
         comment:this.state.comment = res
         })  
          }
      })



            // GET COMMENT REPLY
            await getDocs(qReply).then(res => {
                  res.docs.map(item => {
                      const data = JSON.stringify(item.data());
              if(data){
               const datas = JSON.parse(data);
               return this.setState({
                reply:this.state.reply = datas.user_reply,
                reply_id:this.state.reply_id = datas.comment_id
                  })
              }
                    })
              })

}

  
handlerChange = (e) => {
  const {name,value} = e.target
  this.setState(prev => {
    return{
 [name]:value
    }
  })

}

commentNotif = (ranID) => {
  const notif_id =  this.state.comment_user_id
console.log(notif_id);
  const docUpdate = doc(database,'notifikasi',notif_id ) // ADD NOTIF

  updateDoc(docUpdate,{
              notif:arrayUnion({
                  pesan:`${this.props.user_name} Telah membalas komentar anda`,
                  user_name:this.props.user_name,
                  user_id:this.props.user_id,
                  user_avatar:this.props.avatar,
                  post_id:this.props.post_id,
                })
        })
  .then(() => {alert("notif me senpai")})
  .catch((err) => {console.log(err)}); 

}

commentReply = e => {
    e.preventDefault()
    const ranID = (Math.random() + 1).toString(36).substring(1);
    const docUpdate = doc(database,'reply',this.props.post_id)
    console.log(this.props.post_id);
if(this.state.commentTxt.length < 5 ){
  alert("COMMENT ATLEAST 5 CHARACTER")
}else{
  updateDoc(docUpdate,{
        user_reply:arrayUnion({
        comment_uid:ranID,
        reply_to:`${this.props.user_name} Has replied to a comment from ${this.state.comment_owner}`,
        reply_author_name:this.props.user_name,
        reply_author_avatar:this.props.avatar,
        reply_author_id:this.props.user_id,
        reply_text:this.state.commentTxt
      })
})
.then(() => {
  alert("reply sukses")
  this.setState({
    view:this.state.view = false,
    open:this.state.open = false
  })
  this.commentNotif()
})
.catch((err) => {console.log(err)}); 
}
}  

openReplyComment = (e) => {
  e.preventDefault()
  const com_id = e.target.dataset.comment_id
  const targets = e.target.parentElement.previousSibling.previousSibling.firstChild.nextSibling.textContent;
  const target_id = e.target.parentElement.previousSibling.previousSibling.firstChild.nextSibling.dataset.com_id
  this.setState({
    comment_id:this.state.comment_id = com_id,
    comment_owner:this.state.comment_owner = targets,
    comment_user_id:this.state.comment_user_id = target_id
  })
 if(e.target.classList.contains('reply')){
this.setState({open:this.state.open = true})
 }
else{
  this.setState({open:this.state.open = false})
 }
}

Cancel = (e) => {
  e.preventDefault()
  this.setState({
    open:this.state.open = false,
    openReply:this.state.openReply = false
  })
}


viewReply = (e) => {
  e.preventDefault()
  const com_id = e.target.dataset.comment_id
this.setState({comment_id:this.state.comment_id = com_id})
this.setState({view:this.state.view = true})

}

openReply = (e) => {
  e.preventDefault()
  console.log("tes");
  const com_id = e.target.dataset.comment_id
  const targets = e.target.parentElement.previousSibling.previousSibling.firstChild.nextSibling.textContent;
  const target_id = e.target.parentElement.previousSibling.previousSibling.firstChild.nextSibling.dataset.com_id
  console.log(target_id );
  console.log(targets);
  this.setState({
    comment_id:this.state.comment_id = com_id,
    comment_owner:this.state.comment_owner = targets
  })
 if(e.target.classList.contains('reply')){
this.setState({openReply:this.state.openReply = true})
 }
else{
  this.setState({open:this.state.openReply = false})
 }
}
render(){
const commentCard = Array.isArray(this.state.comment.docs) ? this.state.comment.docs.map(com => {
   const data = com.data()

 if(data.post_id === this.props.post_id){
    return <div className='comment-card'>
    <div className='post-info'>
    <div className='image-wrap'>
    <img src={data.user_avatar != null  ? data .user_avatar  : img} />
    </div>
    <h4 className='username' data-com_id={data.comment_author_id}><Link to={`/account/${data.comment_author_id}`} >{data.comment_author_name}</Link></h4>
    </div>
    <div className='comment-content'>
    <p className='post-text'>{data.comment_text}</p>
    </div>
<div className="action">
<i className="fa fa-heart" aria-hidden="true"></i>
<i class="fa fa-thumbs-down" aria-hidden="true"></i>
<a href='#0' className='reply' data-comment_id={data.comment_id} onClick={this.openReplyComment}>Reply to this comment</a>
<a href='#0' className='view' data-comment_id={data.comment_id} onClick={this.viewReply}>{this.state.reply.length < 1 ? "" : `${this.state.reply.length } Reply`}</a>
</div>
 <form className={this.state.open ? 'modal-form' : 'hide'} onSubmit={this.commentReply }>
<div className='comment-inner'>
<div className='comment-title'>
    <p>Reply</p>
    <textarea name='commentTxt' className='isi-post' placeholder="Write something..." onChange={this.handlerChange}></textarea>
</div>
</div>
 <div className={this.state.hide ? 'hide' : 'button-container' }>
    <button className='hvr-sweep-to-right cancel' onClick={this.Cancel}>Cancel</button>
    <button className='hvr-sweep-to-right save'>Post</button>
 </div>
    </form>
    </div>
 }
 
}) : ""
    return(
        <div className='comment-container'>
<h4 className='username'>{this.state.total_comments} Comments</h4>
{ this.state.comment.length == 0 ? "" : commentCard}
<div className={this.state.view ? 'reply-container' : 'hide'}>
{this.state.reply.length < 1 ? "" : <ReplyCard  reply={this.state.reply} reply_id={this.state.reply_id}  post_id={this.props.post_id} open={this.state.openReply} openReply={this.openReply} Cancel={this.Cancel} commentReply={this.commentReply} handlerChange={this.handlerChange}/> }
</div>
 </div>

    )
}

}


export default DisplayComment;



