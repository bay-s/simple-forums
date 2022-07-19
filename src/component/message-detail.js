import React from 'react'
import {database} from '../firebase';
import { collection, arrayUnion,getDocs, doc,where, updateDoc,query} from 'firebase/firestore';
import { Link, useParams } from 'react-router-dom';
import img from '../akun.jpg'
import ReplyForm from './reply-form';

function MessageDetail(props){
    const {id} = useParams()
    const ID = props.ID

    return(
        <MessageDetailCard id={id} ID={ID} user_name={props.user_name} avatar={props.avatar} />
    )
}

export default MessageDetail;

class MessageDetailCard extends React.Component{
    constructor(){
        super()
        this.state = {
           hide:true,
           listMessage:[],
           uid:''
        }
    }

    async componentDidMount(){
        const reply_message = collection(database,'private_message');
        const id = this.props.id
        const qMsg = query(reply_message, where("message_id", "==",id));
      
                // GET SENDER MESSAGE
                await getDocs(qMsg ).then((res) => {
                  res.docs.map((item) => {
                    const data = item.data();
                    this.setState({listMessage:data})
                  });
                });
      }
      
      async componentDidUpdate(){
        const reply_message = collection(database,'private_message');
        const id = this.props.id
        const qMsg = query(reply_message, where("message_id", "==",id));
      
                // GET SENDER MESSAGE
                await getDocs(qMsg ).then((res) => {
                  res.docs.map((item) => {
                    const data = item.data();
                    this.setState({listMessage:data})
                  });
                });
      }
      

      openReply = e => {
        e.preventDefault()
        const id = e.target.dataset.uid
        this.setState({
          hide:!this.state.hide,
          uid:id
        })
      }

    render(){


        const text = this.state.listMessage == null ? "" : String(this.state.listMessage.sender_text)
        const textStr = text.match(/.{1,250}/g)
        return(
            <div className='message-list-container'>
               <div className='message-detail'>
                  <header className='message-header'>
                      <div className='post-info'>
                      <Link to={`/account/${this.state.listMessage.sender_id}`}><img src={this.state.listMessage.sender_avatar != null ? this.state.listMessage.sender_avatar : img} className='avatar' /></Link>
                      <div className='post-user'>
<h4 className='user-name'><Link to={`/account/${this.state.listMessage.sender_id}`}>{this.state.listMessage.sender_name}</Link></h4>
    <span className='date'>{this.state.listMessage.timestamp}</span>
</div> 
                      </div>
                       <h4 className='post-title'>{this.state.listMessage.sender_subject}</h4>
                  </header>
            <div className='message-content'>
    <div className='post-artikel'>
    {textStr.map(texts => {
return <p className='post-text'>{texts}</p>
}) }
        </div>
            </div>{/* END MESSAGE CONTENT  */}
<div className={this.state.listMessage.images  === '' ? 'hide' : 'message-image'}>
<img src={this.state.listMessage.images} />
</div>
            <div className='reply' data-uid={this.state.listMessage.sender_id} onClick={this.openReply}>
               <i className="fa fa-reply" aria-hidden="true"></i>
               <span>Reply</span>
            </div>
            <div className={this.state.hide ? 'hide' : 'reps'}>
          <ReplyForm id={this.props.id} ID={this.props.ID} uid={this.state.listMessage.sender_id} user_name={this.props.user_name} avatar={this.props.avatar} />
             </div>
               </div>{/* END MESSAGE DETAIL  */}
            </div>
        )
    }
}




{/* <div className='post-artikel'>
{post_content.map(text => {
return <p className='post-text'>{text}</p>
}) }
</div> */}