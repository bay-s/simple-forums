import React from 'react'
import { Link } from 'react-router-dom';
import {database,auth,storage} from '../firebase';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { collection, addDoc ,getDocs, doc, updateDoc, deleteDoc,onSnapshot, setDoc, query, orderBy, where, serverTimestamp} from 'firebase/firestore';
import logo from '../default.jpg'
import img from '../akun.jpg'
import EditForm from './edit-horm';
import ModalLogin from './modal-login';

class EditProfile extends React.Component{
constructor(){
    super()
    this.state = {
        nameInput:'',
        avatar:'',
        url:'',
        hide:false,
        modal:false,
        modalLogin:false,
        extension:['webp','jpeg','jpg','gif','png','jiff'],
        progress:null,
        check:false
    }
}

async componentDidMount(){

}

ImageChange = event => {
  if (event.target.files && event.target.files[0]) {
    let img = event.target.files[0];
    this.setState({
      avatar: this.state.avatar = URL.createObjectURL(img),
      url:this.state.url = img
    });
  }
  };

  uploadImage = (e) => {
    e.preventDefault()
    const id = this.props.id
    this.setState({hide:this.state.hide = true})
    const spaceRef = ref(storage, `images/${this.state.url.name}`);
    const uploadTask = uploadBytesResumable(spaceRef,this.state.url);
    uploadTask.on('state_changed', 
    (snapshot) => {
      // Observe state change events such as progress, pause, and resume
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      this.setState({progress:this.state.progress = progress})
      console.log('Upload is ' + progress + '% done');
      console.log(this.state.progress);
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
  //  alert('File available at', downloadURL)
        this.setState({saveImage:!this.state.saveImage,});
        const docUpdate = doc(database,'user',id)
        updateDoc(docUpdate,{
        images:downloadURL
        })
        .then(() =>{
          alert("Edit profile pic succes")
          this.setState({hide:this.state.hide = false})
          window.location.reload()
        })
        .catch(err => {
          window.location.reload()
      alert(err.message)
        })
      });
    }
  );

  }

editModal = e => {
  e.preventDefault()
  const input = e.target.dataset.user
  if(input === 'email'){
    this.setState({
      nameInput:this.state.nameInput = input,
      modalLogin:!this.state.modalLogin
    })
  }else{
    this.setState({
      nameInput:this.state.nameInput = input,
      modal:!this.state.modal
    })
  }
}
render(){

  const styles = {
    display : 'none'
  }
  const empt = {
     
  }
  
  const process = {
    width:`${this.state.progress}%`
  }
    return(
<div className='modal-edit'>
    <div className='modal-inner'>
<div className='edit-profile-container'>
<div className='edit-profile'>
    <div className='image-wraps'>

    <img src={this.state.avatar.length < 1 ? img : this.state.avatar} />
    <p className='text'>{this.props.data.fullname}</p>
<div className='upload-photos'>
<label htmlFor="upload-photos" className='upload-photos'></label>
<input type="file" name="photos" id="upload-photos" accept="image/png, image/gif, image/jpeg" onChange={this.ImageChange}/>
</div>
    </div>
    <div className='user-name'>
      <button className='edit' data-user="fullname" onClick={this.editModal}>Edit</button>
    </div>
</div>

<div className={this.state.avatar.length < 1 ? 'hide'  : 'confirm'} style={this.state.hide ?   styles : empt}>
<button className='hvr-sweep-to-right cancel' onClick={this.props.removeModal}>Cancel</button>
<button className='hvr-sweep-to-right save' onClick={this.uploadImage}>Save</button>
</div>
<div className={this.state.hide ? 'progress-container' : 'hide'}>
<div class='progress'>
  <div class="color" style={process}></div>
</div>
</div>
<div className='profile'>
<div className='edit-profile'>
    <div className='image-wrap'>
    <p className='text'>{this.props.data.username}</p>
    </div>
    <div className='user-name'>
      <button className='edit' data-user="username"  onClick={this.editModal}>Edit</button>
    </div>
</div>
<div className='edit-profile'>
    <div className='image-wrap'>
    <p className='text'>{this.props.data.email}</p>
    </div>
    {/* <div className='user-name'>
      <button className='edit' data-user="email"  onClick={this.editModal}>Edit</button>
    </div> */}
</div>
</div>
</div>
<div className={this.state.modal ? 'modals' : "modal-container"}>
{this.state.modal ? <EditForm id={this.props.id} nameInput={this.state.nameInput} removeModal={this.props.removeModal} email={this.props.data.email}/> : ""}
<div className={this.state.modal ? 'close' : "hide"}>
<i className="fa fa-times" aria-hidden="true" onClick={this.props.removeModal}></i>
</div>
</div>


    </div>
</div>
         )
}

}

export default EditProfile;

{/* <div className={this.state.modalLogin ? 'modals' : "modal-container"}>
{this.state.modalLogin ? <ModalLogin id={this.props.id} /> : ""}
<div className={this.state.modalLogin  ? 'close' : "hide"}>
<i className="fa fa-times" aria-hidden="true" onClick={this.props.removeModal}></i>
</div>
</div> */}

