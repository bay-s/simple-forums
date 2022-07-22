import React from 'react'
import {database,auth,storage} from '../firebase';
import { getAuth, deleteUser } from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { collection,updateDoc,doc,query,getDocFromCache,getDocs,where} from 'firebase/firestore';
import background from '../background.jpg'

class Banner extends React.Component{
    constructor(){
        super()
        this.state = {
            images:'',
            url:'',
            hide:false,
            status:null,
            saves:true,
            banner:''
        }
    }


    componentDidMount(){ 
      const db = collection(database,"user")
      const id = this.props.ID;
      const q = query(db,where("uid","==" , id))

      // GET USER LOGIN
   getDocs(q).then(res => {
        res.docs.map(item => {
        const data = item.data()
        console.log(data);
          return this.setState({banner:this.state.banner = data.banner})  
          });
        })
      
    }

  changeBanner = (event) => {
    console.log(event.target.files);
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      console.log(img);
      this.setState({
        images: URL.createObjectURL(img),
        url:img,
        hide:!this.state.hide
      });
    }
      }
  
uploadImage = () => {
    const ID = this.props.ID
    const docUpdate = doc(database,'user',ID)
      const spaceRef = ref(storage, `images/${this.state.url.name}`);
      const uploadTask = uploadBytesResumable(spaceRef,this.state.url);
      uploadTask.on('state_changed', 
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        this.setState({status:this.state.status = progress})
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
          updateDoc(docUpdate,{banner:downloadURL})
          .then(() =>{
            alert("Change banner sukses")
            this.setState({
              saves:this.state.saves = true,
              hide:this.state.hide = false
            })
          })
          .catch(err => {
            alert(`Something wrong ${err.message}`)
            this.setState({
              saves:this.state.saves = true,
              hide:this.state.hide = false
            })
        })
        });
      }
    );
    
  }  

  uploadBanner = (e) => {
    e.preventDefault()
    alert("test")
    if(this.state.url.length < 1){
alert("empty")
    }else{
alert("test")
this.setState({saves:this.state.saves = false})
this.uploadImage() 
    }
  }

 Cancel = () => {
  this.setState({
    images:'',
    url:'',
    hide:!this.state.hide
  });
 }
    render(){
        const bannerBG = {
           backgroundImage:`url(${this.state.images})`
        }
        const normal = {
          backgroundImage:`url(${background})`
        }
        const process = {
          width:`${this.state.status}%`
        }
        const banner = {
          backgroundImage:`url(${this.state.banner})`
        }
        console.log(this.state.banner);
        return(
            <div className='banner' style={this.state.banner.length > 0 ? banner :
             this.state.images.length > 0 ? bannerBG : normal
            }>
            <div className='upload-photoz'>
            <form className='form' onSubmit={this.uploadBanner}>
            <label htmlFor="upload-photo" className='upload-photos'>
             <span>Change Banner</span>
             <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
             </label>
             <input type="file" name="photos" id="upload-photo"  onChange={this.changeBanner}/>
             <div className={this.state.hide ? 'button-container' : 'hide' }>
                <a className='hvr-sweep-to-right cancels' onClick={this.Cancel}>Cancel</a>
                {this.state.saves ?  <button type='submit' className='hvr-sweep-to-right'>Save</button> : <button className='disabled' disabled>Save</button> }
             </div>
<div class={this.state.status != null ? 'progress' : 'hide'}>
  <div class="color" style={process}></div>
</div>
            </form>
             </div>
            </div>
        )
    }
}


export default Banner;