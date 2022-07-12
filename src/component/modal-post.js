import React from 'react'
import { Link } from 'react-router-dom';
import {database,auth,storage} from '../firebase';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { collection, addDoc ,getDocs, doc, updateDoc, deleteDoc,onSnapshot, setDoc, query, orderBy, where, serverTimestamp} from 'firebase/firestore';
import logo from '../default.jpg'


class ModalPost extends React.Component{
constructor(){
    super()
    this.state = {
        hide:true,
        title:'',
        posts:'',
        values:null,
        post_image:'',
        avatar:'',
        url:'',
        selectOption:['--Select Category--','Anime','Manga','Games','Sports','Technology'],
        progress:null
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

  selectValue= (e) => {
    const {name,value} = e.target
    console.log(e.target.value);
    this.setState(prev => {
      return{
   values:this.state.values = e.target.value
      }
    })

  }

ImageChange = event => {
    console.log(event.target.files);
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      console.log(img);
      this.setState({
        akunImages: URL.createObjectURL(img),
        url:img
      });
    }
  };

  // pushNotifikasi = (ranID) => {
  //   const db = collection(database,'reply');
  //   const user_id =  this.state.user_post_id
  //   // const user_id = this.props.id
  //   setDoc(doc(db,ranID),  {
  //        original_reply:[],
  //        user_reply:[],
  //        comment_id:ranID
  //     })
  //     .then(() => {console.log("notif sukses")})  
  //     .catch((err) => {
  //       console.log(err);
  //     })
  // }
  
 uploadImage = () => {

  const id = this.props.id
  let total_post = this.props.Post
  const ranID = (Math.random() + 1).toString(36).substring(1);
  const username = this.props.name
const db = collection(database,"post")
const docUpdate = doc(database,'user',id)
if (this.state.title.length < 10) {
    alert("CAPTION TOO SHORT")
    console.log(database.ServerValue.TIMESTAMP );
}else{
    const spaceRef = ref(storage, `images/${this.state.url.name}`);
    const uploadTask = uploadBytesResumable(spaceRef,this.state.url);
    uploadTask.on('state_changed', 
    (snapshot) => {
      // Observe state change events such as progress, pause, and resume
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      this.setState({progress:this.state.progress = progress})
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
        // this.setState({saveImage:!this.state.saveImage,});
  
        updateDoc(docUpdate,{
          total_post:total_post + 1
        })
        setDoc(doc(db,ranID),  {
          post_image:'',
          post_content:this.state.posts,
          title:this.state.title,
          post_image:downloadURL,
          post_id:ranID,
          username:username,
          user_post_id:id,
          timestamp: serverTimestamp(),
          category:this.state.values,
          total_comment:0,
          total_likes:0
        })
      .then(() =>{
        alert("add post sukses")
        this.setState({hide:this.state.hide = true})
        window.location.reload()
      })
      .catch(err => {
      alert(err.message)
      })
      });
    }
  );
  
}
}

Validasi = e => {
  e.preventDefault()

if (this.state.title.length < 10) {
  alert("Title atleast 10 long character ")
}
else if(this.state.values === null)(
  alert("Please select 1 Category")
)
else if(this.state.posts.length < 50)(
  alert("Post content atleast 50 long character")
)
else if(this.state.url.length < 1){
  alert("Post must include image")
}else{
this.setState({hide:this.state.hide = false})
this.uploadImage() 
}
}
render(){

  const process = {
    width:`${this.state.progress}%`
  }
    return(
<div className='modal-post'>
    <div className='modal-inner'>
    <div className='judul-post'>
      <h3> New Post</h3>
    </div>
    <form className='modal-form' onSubmit={this.Validasi }>
        <label className='modal-label'>
            Post Title
            <input type='text' name='title' onChange={this.handlerChange }/>
        </label>
        <select className='modal-select' value={this.state.values} onChange={this.selectValue}>
{this.state.selectOption.map(value => {
    return <option value={value}>{value}</option>
})}
</select>
<label className='modal-label'>
    Post Content
 <textarea name='posts' className='isi-post' onChange={this.handlerChange}></textarea>
 </label>
 <div className='upload-photoz'>
 <label htmlFor="upload-photo" className='upload-photo'>Select pictures</label>
 <input type="file" name="photos" id="upload-photo" onChange={this.ImageChange}/>
 </div>
 <div class={this.state.progress != null ? 'progress' : 'hide'}>
  <div class="color" style={process}></div>
</div>
 <div className={this.state.hide ? 'button-container' : 'hide' }>
    <button className='hvr-sweep-to-right cancel' onClick={this.props.removeModal}>Cancel</button>
    <button className='hvr-sweep-to-right save'>Save</button>
 </div>
 {/* <div className={this.state.hide ? 'progress-container' : 'hide'}> */}
    </form>
    </div>
</div>
         )
}

}

export default ModalPost;

