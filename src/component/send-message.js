import React from 'react'
import {database} from '../firebase';
import { collection, arrayUnion,getDocs, doc,where, updateDoc,query} from 'firebase/firestore';
import { Link, useParams } from 'react-router-dom';
import img from '../akun.jpg'
import MessagesCard from './messages-card';


function SendMessage(props){
    const {id} = useParams();
    const ID = props.ID

    return(
     <Message id={id} ID={ID} user_name={props.user_name} avatar={props.avatar}/>
    )
}


export default SendMessage;


class Message extends React.Component{
    constructor(){
        super()
        this.state = {
            messages:'',
            username:'',
            avatar:'',
            messagesArr:[]
        }
    }

    async componentDidMount() {
        const id = this.props.id;
        const db = collection(database,'user')
        const q = query(db, where("uid", "==", id));
        const msg = collection(database,'private_message')
        const qMsg = query(msg, where("uid", "==", id));

        // GET USER
        await getDocs(q).then((res) => {
            console.log(res);
          res.docs.map((item) => {
            const data = item.data();
            console.log(data);
            return this.setState({
                username:this.state.username = data.username,
                avatar:this.state.avatar = data.images
            });
          });
        });


        // GET MESSAGE
        await getDocs(qMsg).then((res) => {
          res.docs.map((item) => {
            const data = item.data();
            console.log(data);
            return this.setState({
               messagesArr:data.messages
            });
          });
        });

    }    

    async componentDidUpdate() {
        const id = this.props.id;
        const db = collection(database,'private_message')
        const q = query(db, where("uid", "==", id));

        // GET MESSAGE
        await getDocs(q).then((res) => {
          res.docs.map((item) => {
            const data = item.data();
            console.log(data);
            return this.setState({
               messagesArr:data.messages
            });
          });
        });

    }  

    handlerChange = (e) => {
        const {name,value} = e.target
        this.setState(prev => {
          return{
       [name]:value
          }
        })
    
      }

    sendMessages = (e) => {
        e.preventDefault()
        const docUpdate = doc(database,'private_message',this.props.id)
    if(this.state.messages.length < 1 ){
      alert("COMMENT CANT BE EMPTY")
    }else{
      updateDoc(docUpdate,{
            messages:arrayUnion({
            sender_name:this.props.user_name,
            sender_avatar:this.props.avatar,
            sender_id:this.props.ID,
            sender_text:this.state.messages
          })
    })
    .then(() => {
        alert("SUKSES")
        // this.messageNotif()
    })
    .catch((err) => {console.log(err)}); 
    }
    }

    


messageNotif = () => {
    const notif_id =  this.state.ID
    const docUpdate = doc(database,'notifikasi',notif_id ) // ADD NOTIF

    updateDoc(docUpdate,{
                notif:arrayUnion({
                    pesan:`Message from ${this.props.user_name}`,
                    user_name:this.props.user_name,
                    user_id:this.props.ID,
                    user_avatar:this.props.avatar,
                  })
          })
    .then(() => {alert("notif me senpai")})
    .catch((err) => {console.log(err)}); 
  
  }

    render(){

         const messasgeCard = this.state.messagesArr.length < 1 ? "" : this.state.messagesArr.map(msg => { return <MessagesCard msg={msg} />});
        return(
        
        <div className='message-container'>
<header className='user-header'>
<img src={this.state.avatar  != null ? this.state.avatar : img} />
<h4 className='username'><Link to={`/account/${this.props.ID}`}>{this.state.username}</Link></h4>
             </header>
            <div className='private-message-container'>
             {messasgeCard}
            </div>
            <form className='private-message' onSubmit={this.sendMessages}>
<div className='message-area'>
<div className='upload-photoz'>
 <label htmlFor="upload-photo" className='upload-photo'>
 <i className="fa fa-file-image-o" aria-hidden="true"></i>
 </label>
 <input type="file" name="photos" id="upload-photo" onChange={this.ImageChange}/>
 </div>
<textarea name='messages' className='messages' onChange={this.handlerChange}></textarea>
<button type='submit' className='hvr-sweep-to-right send-message'>Send</button>          
</div>
            </form>
        </div>
        )
    }
}