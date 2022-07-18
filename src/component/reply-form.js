import React from 'react'
import {database,storage} from '../firebase';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { collection,setDoc, arrayUnion,getDocs, doc,where, updateDoc,query, addDoc} from 'firebase/firestore';
import { Link, useParams } from 'react-router-dom';
import img from '../akun.jpg'


class ReplyForm extends React.Component{
constructor(){
    super()
    this.state = {
        subject:'',
        messages:'',
        images:'',
        url:'',
        danger:'',
        is_error:false,
        status:null,
        hide:true,
        sukses:false,
        submit:false
    }
}

handlerChange = (e) => {
    const {name,value} = e.target
    this.setState(prev => {
      return{
   [name]:value
      }
    })

  }

  ImageChange = event => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      this.setState({url:img});
    }
  };


  uploadImage = () => {
    const spaceRef = ref(storage, `images/${this.state.url.name}`);
    const uploadTask = uploadBytesResumable(spaceRef,this.state.url);
    uploadTask.on('state_changed', 
    (snapshot) => {
      // Observe state change events such as progress, pause, and resume
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      this.setState({ status:progress})
      switch (snapshot.state) {
        case 'paused':
          console.log('Upload is paused');
          break;
        case 'running':
          console.log('Upload is running');
          break;
      }
    }, 
    (error) => {
      // Handle unsuccessful uploads
    alert(error.message)
    }, 
    () => {
      // Handle successful uploads on complete
      // For instance, get the download URL: https://firebasestorage.googleapis.com/...
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        console.log('File available at', downloadURL);
        let url = '';
        const urlCheck = this.state.url === '' ? '' :  url = downloadURL
       this.sendMessages(url)
       this.messageNotif()
      });
    }
  );
  
}

sendMessages = (url) => {
  const docUpdate = doc(database,'user',this.props.uid)
  const ranID = Math.random().toString(36).substring(2,36);
  updateDoc(docUpdate,{
    private_message:arrayUnion({
        sender_subject:this.state.subject,
        sender_name:this.props.user_name,
        sender_avatar:this.props.avatar,
        sender_id:this.props.ID,
        sender_text:this.state.messages,
        message_id:ranID,
        images:url,
        timestamp:this.timeStamp()
      })
})
.then(() =>{
  this.createMessage(ranID,url)
  this.messageSent(ranID,url)
  this.setState({
    danger:"Message sent",
    is_error:false,
    hide:this.state.hide = true,
    sukses:this.state.sukses = true,
    submit:this.state.submit = false,
})
window.location.replace(`/account/${this.props.uid}`);
})
.catch(err => {
  this.setState({
    danger:err,
    is_error:true
  })
})
}

messageSent = (ranID,url) => {
const sentMessage = doc(database,'user',this.props.ID)
updateDoc(sentMessage,{
  sent_message:arrayUnion({
    sender_subject:this.state.subject,
    sender_name:this.props.user_name,
    sender_avatar:this.props.avatar,
    sender_id:this.props.ID,
    sender_text:this.state.messages,
    message_id:ranID,
    images:url,
    timestamp:this.timeStamp()
 })
})
}


createMessage  = (ranID,url) => {
const db = collection(database,'private_message')
setDoc(doc(db,ranID), {
  sender_subject:this.state.subject,
  sender_name:this.props.user_name,
  sender_avatar:this.props.avatar,
  sender_id:this.props.ID,
  sender_text:this.state.messages,
  message_id:ranID,
  images:url,
  timestamp:this.timeStamp()})
}

messageNotif = () => {
const notif_id =  this.props.uid
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

timeStamp = () => {
  const m = ['January','February','March','April','May','June','July','August','September','Oktober','November','December']
  const dates = new Date();
  const hours = dates.getHours() 
  const min = dates.getMinutes()
  const date = dates.getDate()
  const month = m[dates.getMonth()];
  const year = dates.getUTCFullYear()
  
  return `${date} ${month} ${year} ${hours}.${min}`;
  }


Validasi = e => {
    e.preventDefault()
  if (this.state.subject.length < 1) {
    this.setState({
        danger:"Subject are required",
        is_error:true
    })
  }
  else if(this.state.messages.length < 10)(
    this.setState({
        danger:"Messages atleast 10 character",
        is_error:true
    })
  )
else{
this.uploadImage()
this.setState({
  hide:this.state.hide = false,
  submit:this.state.submit = true
})
  }

  }


render(){

    const process = {
        width:`${this.state.status}%`
      }


    return(
        <div className='send-message'>
            <div className='modal-inner'>
            <div className='judul-post'>
              <h3>Send Message</h3>
            </div>
            <form className='modal-form' onSubmit={this.Validasi}>
                <label className='modal-label'>
                    Subject
                    <input type='text' name='subject' onChange={this.handlerChange }/>
                </label>
        <label className='modal-label'>
           Message
         <textarea name='messages' className='isi-post' onChange={this.handlerChange}></textarea>
         </label>
         <div className='upload-photoz'>
         <label htmlFor="upload-photo" className='upload-photo'>
         <i class="fa fa-camera upload-photo" aria-hidden="true"></i>
         </label>
         <input type="file" name="photos" id="upload-photo" onChange={this.ImageChange}/>
         </div>
         <div class={this.state.hide ? 'hide' : 'progress'}>
          <div class="color" style={process}></div>
        </div>
        <p className={this.state.is_error ? 'error' : 'sukses'}>
        {this.state.is_error ? this.state.danger : this.state.danger}
        </p>
         <div className='button-container'>
            {this.state.submit ?  <button type='submit' className='hvr-sweep-to-right save' disabled><i class="fa fa-stop-circle-o" aria-hidden="true"></i></button>  :  <button type='submit' className='hvr-sweep-to-right save' >Send</button>}
         </div>
            </form>
            </div>
        </div>
            )
}
}

export default ReplyForm ;