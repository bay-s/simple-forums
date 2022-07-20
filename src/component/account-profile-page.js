import React, { useEffect, useState } from 'react'
import { Link, useParams ,useNavigate, Navigate} from 'react-router-dom'
import akun from '../akun.jpg'
import {database,auth,storage} from '../firebase';
import { getAuth, deleteUser } from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { collection, getDocs,query, where,doc, deleteDoc,getDocFromCache} from 'firebase/firestore';
import EditProfile from './edit-profile';
import UserDetailCard from './user-detail';
import UserPost from './user-post';
import FollowerCard from './follower-card';
import FollowingCard from './following-card';


function AccountPage(props){
    const [myId, setMyid]  = useState(false)
    const [banner,setBanner] = useState({
     data:{
      url:'',
      bannerImages:''
     }
    })
    const {id} = useParams()
    const ID = props.id
    const db = collection(database,"user")
    const q = query(db,where("uid","==" ,id))
let url;
let images;
   const  changeBanner = (event) => {
      console.log(event.target.files);
      if (event.target.files && event.target.files[0]) {
        let img = event.target.files[0];
        console.log(img);
        setBanner({...setBanner,
       data:{
        url:img,
        bannerImages:img
       }
        })

        console.log(banner);
        console.log(banner.data.bannerImages);
      }
    }
    useEffect(() => {
      // action on update of movies
  }, [movies]);
  
 const uploadImage = () => {
  const docUpdate = doc(database,'user',ID)
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
        this.postLikes(ranID);
        updateDoc(docUpdate,{
          total_post:total_post + 1
        })
        .then(() =>{alert("Change banner sukses")})
        .catch(err => {alert(`Something wrong ${err.message}`)})
      });
    }
  );
  

}  
    // GET USER LOGIN
 getDocs(q).then(res => {
if (res.docs.length < 1) {
  setMyid(true);
}
})

const bannerBg = {
  background:`url(${banner.bannerImages})`
}
    return(
<div className='use-profile-container'>
    <div className='user-profile'>
        <div className='banner' >
<div className='upload-photoz'>
<form className='form'>
<label htmlFor="upload-photo" className='upload-photos'>
 <span>Change Banner</span>
 <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
 </label>
 <input type="file" name="photos" id="upload-photo"  onChange={changeBanner}/>
 {/* <div className={this.state.hide ? 'button-container' : 'hide' }>
    <button className='hvr-sweep-to-right cancel' onClick={this.props.removeModal}>Cancel</button>
    <button className='hvr-sweep-to-right save'>Save</button>
 </div> */}
</form>
 </div>
        </div>
        {myId ?   <Navigate to="*" replace={true} /> : id === props.id ? <UserProfileCard id={id} ID={ID} isLogin={props.isLogin} /> : <UserDetailCard id={id} ID={ID} isLogin={props.isLogin} avatar={props.avatar} user_name={props.user_name} /> }
    
    </div>
    {/* END USER PROFILE */}
</div>
    )
}

export default AccountPage;

class UserProfileCard extends React.Component{
    constructor(){
        super()
        this.state = {
           data:[],
           modal:false,
           dataPost:[],
           loading:true,
           follower:[],
           following:[],
           option:'POST'
        }
    }

    async componentDidMount() {
        
        const db = collection(database,"user")
        const post = collection(database,'post')
        const follower = collection(database,'user_follower')
        const id = this.props.ID;
        const q = query(db,where("uid","==" , id))
        const q2 = query(post,where("user_post_id","==" , id))
        const queryFollow = query(follower,where("uid","==" , id))
        
        // GET USER LOGIN
     getDocs(q).then(res => {
          res.docs.map(item => {
          const data = item.data()
            return this.setState({ data:this.state.data = data})  
            });
          })
        
        //   GET ALL POST
          await getDocs(q2).then(res => {
              if (res) {
                  this.setState({ 
                      dataPost:this.state.dataPost = res,
                      loading:this.state. loading = false
                     })  
              }
                })
          
              // GET FOLLOWER
              await getDocs(queryFollow).then(res => {
                res.docs.map(item => {
                  const data = item.data()
                  this.setState({
                    follower:this.state.follower = data.follower,
                    following:this.state.following = data.following
                  })
                    });
                  })
            
    }

    async componentDidUpdate() {
        
      const db = collection(database,"user")
      const post = collection(database,'post')
      const id = this.props.ID;
      const q = query(db,where("uid","==" , id))
      const q2 = query(post,where("user_post_id","==" , id))

      // GET USER LOGIN
   getDocs(q).then(res => {
        res.docs.map(item => {
        const data = item.data()
          return this.setState({ data:this.state.data = data})  
          });
        })
      
      //   GET ALL POST
        await getDocs(q2).then(res => {
            if (res) {
                this.setState({ 
                    dataPost:this.state.dataPost = res,
                    loading:this.state. loading = false
                   })  
            }
              })
        
  }
            
    modals = (e) => {
        e.preventDefault()
        this.setState({modal:!this.state.modal})
        console.log(this.state.modal);
      }
          
removeModal = (e) =>{
  e.preventDefault()
  if(confirm("Are you sure want to cancel this ?")){
    this.setState({ modal:!this.state.modal})
  }else{
    console.log("tidak");
  }
}


deleteAccount = (e) => {
    const user = auth.currentUser;
    const db = collection(database,"user")
    const querys = query(db,where("uid","==" , "1234"))
    if (confirm('Are you sure you want to delete this account')) {
        // Save it!
        this.setState({ isLogin:this.props.isLogin = false})  
deleteDoc(doc(database,'user',id));
deleteUser(user).then(() => {
    // User deleted.
    console.log('User deleted.');
    }).catch((error) => {
    // An error ocurred
    alert("An error ocurred");
    });
      } else {
        // Do nothing!
        console.log('Delete canceled.');
      }
  }

  displayOption = (e) => {
    const id = e.target.dataset.name;
    this.setState({option:this.state.option = id})
  }


    render(){

        const postCard = Array.isArray(this.state.dataPost.docs) ? this.state.dataPost.docs.map((post,index)=> {
            const posts = post.data()
            return <UserPost data={posts} isLogin={this.props.isLogin} id={this.props.ID}/>
            }) : ""

        const followCard = this.state.follower != null ? this.state.follower.map(data => {
         return <FollowerCard follow_id={data} user_id={this.props.id }/>
        }) : ""

        const followingCard = this.state.following != null ? this.state.following.map(data => {
          return <FollowingCard follow_id={data} user_id={this.props.id }/>
         }) : ""
        return(
            <div className='profile-container'>
            <div className='user-info'>
                    <div className='judul-flex'>
                    <h3 className='form-judul'>Profile</h3>
                    </div>
                    <div className='profile-info'>
                        <div className='user-name-wrapper'>
                            <div className='image-wrap'>
                                <img src={this.state.data.images ? this.state.data.images : akun} />
                            </div>
                            <div className='user-name'>
                            <p className='text'>{this.state.data.username}</p>
                            </div>
                        </div>
                            <div className='user-edit'>
                            <i class="fa fa-pencil" aria-hidden="true" onClick={this.modals}></i>
                            <i class="fa fa-trash delete" aria-hidden="true" onClick={this.deleteAccount }></i>
                            </div>
                        </div>
                </div>
                {/* END USER INFO */}
                <div className='user-post-container'>
                        <ul className='judul-post'>
                          <li><span data-name="POST" onClick={this.displayOption}>POST {this.state.data.total_post}</span></li>
                          <li><span data-name="FOLLOWER" onClick={this.displayOption}>FOLLOWER {this.state.data.total_follower}</span></li>
                          <li><span data-name="FOLLOWING" onClick={this.displayOption}>FOLLOWING {this.state.data.total_following}</span></li>
                        </ul>
                </div>
                <div className='latest-post'>
               { this.state.option === 'POST' ? postCard : this.state.option === 'FOLLOWER' ? followCard : followingCard }
                </div>
<div className={this.state.modal ? 'modals' : "modal-container"}>
{this.state.modal ? <EditProfile id={this.props.id} ID={this.props.ID} data={this.state.data} removeModal={this.removeModal} avatar={this.state.data.images}/>  : ""}
<div className={this.state.modal ? 'close' : "hide"}>
<i class="fa fa-times" aria-hidden="true" onClick={this.removeModal}></i>
</div>
</div>
            </div>
        )
    }
}