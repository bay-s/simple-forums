import React from 'react'
import {database} from '../firebase';
import { collection, arrayUnion,getDocs, doc,where, updateDoc,query} from 'firebase/firestore';
import img from '../akun.jpg'
import MessageCard from './message-card';
import { Link, useParams} from 'react-router-dom'


function MessageList(props){
    const {id} = useParams();
    const ID = props.ID

    return(
     <MessageListCard id={id} ID={ID} user_name={props.user_name} avatar={props.avatar}/>
    )
}


export default MessageList;


class MessageListCard extends React.Component{
  constructor(){
    super()
    this.state = {
     listMessage:[],
     listSent:[]
    }
  }

async componentDidMount(){
  const list_message = collection(database,'user');
  const id = this.props.ID
  const qMsg = query(list_message, where("uid", "==",id));
  const test =query(list_message, where("owner_id", "==",id)); 

          // GET SENDER MESSAGE
          await getDocs(qMsg ).then((res) => {
            res.docs.map((item) => {
              const data = item.data();
              console.log(data);
              return this.setState({
                listMessage:data.private_message,
                listSent:data.sent_message
              });
            });
          });

          await getDocs(test).then((res) => {
            res.docs.map((item) => {
              const data = item.data();
              console.log(data);
            });
          });
}

async componentDidUpdate(){
  const list_message = collection(database,'private_message');
  const id = this.props.ID
  const qMsg = query(list_message, where("uid", "==",id));


          // GET SENDER MESSAGE
          await getDocs(qMsg ).then((res) => {
            res.docs.map((item) => {
              const data = item.data();
              console.log(data);
              return this.setState({
                listMessage:data.private_message,
                listSent:data.sent_message
              });
            });
          });
}

  render(){


     const messasgeCard = this.state.listMessage.length < 1 ? "" : this.state.listMessage.map((msg,index) => { return <MessageCard msg={msg} key={index} index={index}/>});
console.log(this.state.listSent.length);
    return(
      <div className='message-list-container'>
         <div className='message-inner'>
         <div className='message-info'>
           <ul className='info-list'>
            <li>
            <i className="fa fa-inbox" aria-hidden="true"></i>
            <a href='#'>Inbox  <span>{this.state.listMessage == null ? "" : this.state.listMessage.length}</span></a>
            </li>
            <li>
            <i className="fa fa-envelope-open-o" aria-hidden="true"></i>
            <a href='#'>Sent <span>{this.state.listSent == null ? "" : this.state.listSent.length}</span></a>
            </li>
           </ul>
        </div>
        <div className='message-list'>
           {messasgeCard }
        </div>
         </div>
      </div>
    )
  }
}

