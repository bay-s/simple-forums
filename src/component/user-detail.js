import React from 'react'
import akun from '../akun.jpg'
import {database} from '../firebase';
import { collection, getDocs,query, where,doc, deleteDoc,updateDoc,arrayUnion,arrayRemove} from 'firebase/firestore';
import UserPost from './user-post';
import { Link } from 'react-router-dom';

class UserDetailCard extends React.Component{
    constructor(){
        super()
        this.state = {
           data:[],
           modal:false,
           dataPost:[],
           loading:true,
           total_followers:null,
           total_following:null
        }
    }



    async componentDidMount() {
        const db = collection(database,"user")
        const post = collection(database,'post')
        const id = this.props.id;
        const q = query(db,where("uid","==" , id))
        const q2 = query(post,where("user_post_id","==" , id))

        // GET USER 
     getDocs(q).then(res => {
          res.docs.map(item => {
          const data = item.data()
            return this.setState({ 
              data:this.state.data = data,
              total_followers:this.state.total_followers = data.total_follower,
              total_following:this.state.total_following = data.total_following
            })  
            });
          })
        
                  //   GET ALL POST
                  await getDocs(q2).then(res => {
                    if (res) {
                        this.setState({ 
                            dataPost:this.state.dataPost = res,
                            loading:this.state.loading = false
                           })  
                    }
                      })
                
    }


    async componentDidUpdate() {
      const db = collection(database,"user")
      const post = collection(database,'post')
      const id = this.props.id;
      const q = query(db,where("uid","==" , id))
      const q2 = query(post,where("user_post_id","==" , id))
  

      // GET USER 
   getDocs(q).then(res => {
        res.docs.map(item => {
        const data = item.data()
          return this.setState({ 
            data:this.state.data = data,
            total_followers:this.state.total_followers = data.total_follower
          })  
          });
        })
      
                //   GET ALL POST
                await getDocs(q2).then(res => {
                  if (res) {
                      this.setState({ 
                          dataPost:this.state.dataPost = res,
                          loading:this.state.loading = false
                         })  
                  }
                    })
              
  }


    followNotif = (user_id) => {
      const notif_id = user_id
      const docUpdate = doc(database,'notifikasi',user_id)
  
        updateDoc(docUpdate,{
                    notif:arrayUnion({
                        pesan:`${this.props.user_name} Has been followed you`,
                        user_name:this.props.user_name,
                        user_id:notif_id,
                        user_avatar:this.props.avatar
                      })
              })
        .then(() => {alert("notif me senpai")})
        .catch((err) => {console.log(err)});  
    } 


    following_profiles = (user_id) => {
      const current_user = this.props.ID
      const docUpdate = doc(database,'user_follower',current_user)
      const user = doc(database,'user',this.props.ID)
      updateDoc(docUpdate,{
        following:arrayUnion(user_id)
        })
        updateDoc(user,{
          total_following:this.state.total_following = + 1
          })
        .then(() =>console.log("follow succes"))
        .catch(err => {alert(err.message)})
    }

    follower_profiles = (user_id) => {
      const docUpdate = doc(database,'user_follower',user_id)
      const current_user = this.props.ID
      updateDoc(docUpdate,{
        follower:arrayUnion(current_user)
        })
        .then(() =>console.log("follow succes"))
        .catch(err => {alert(err.message)})
    }
    
        follow = (e) => {
          const user_id = this.props.id
          const is_follows = e.target.dataset.follow
          const docUpdate = doc(database,'user',user_id)
          const ranID = Math.random().toString(36).substring(2,36);
          if(is_follows === 'Follow'){
            localStorage.setItem( ranID ,this.props.user_name);
             console.log(localStorage)
            // this.followNotif(user_id) 
            // this.follower_profiles(user_id)
            // this.following_profiles(user_id)
            // updateDoc(docUpdate,{
            //  total_follower:this.state.total_followers + 1
            //  })
            //  .then(() =>{
            //    alert("Follow succes")
            //    this.setState({hide:this.state.hide = false})
            //  })
            //  .catch(err => {alert(err.message)})
            console.log("KOSONG");
           }else{
console.log("ada");
             localStorage.removeItem(this.props.user_name);
            //  this.Remove(user_id)
            //  updateDoc(docUpdate,{
            //    total_follower:this.state.total_followers - 1
            //    })
            //    .then(() =>{
            //      alert("delete succes")
            //      this.setState({hide:this.state.hide = false})
            //    })
            //    .catch(err => {alert(err.message)})
 
           }
        }

    Remove = (user_id) => {
      const removeNotif = doc(database,'notifikasi',user_id)
      const removeFollowing = doc(database,'user_follower',this.props.ID)
      const user = doc(database,'user',this.props.ID)
      const removeFollower = doc(database,'user_follower',user_id)


      updateDoc(removeFollower, {
        follower:arrayRemove(user_id)
      })
      updateDoc(removeFollowing, {
        following:arrayRemove(this.props.ID)
      })
      updateDoc(user, {
        total_following:this.state.total_following = - 1
      })
        .then(() => {
      console.log("remove succes");
        })
        .catch((err) => {
          alert(err.message);
        });
    }    
    render(){

        const postCard = Array.isArray(this.state.dataPost.docs) ? this.state.dataPost.docs.map((post,index)=> {
            const posts = post.data()
            return <UserPost data={posts}/>
            }) : ""

        const is_follow = localStorage.getItem(this.props.user_name)
if(is_follow){

}
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
                <button className={is_follow ? 'hvr-sweep-to-right Following' : 'hvr-sweep-to-right  follow'} data-follow={is_follow === this.props.user_name ? 'Following' : 'Follow'}onClick={this.follow}>{is_follow === 'Follow' ? 'Following' : 'Follow'}</button>
                </div>
            
            </div>
    </div>
    {/* END USER INFO */}
    <div className='user-post-container'>
            <ul className='judul-post'>
              <li><span>POST {this.state.data.total_post}</span></li>
              <li><span>FOLLOWER {this.state.data.total_follower}</span></li>
              <li><span>FOLLOWING {this.state.data.total_following}</span></li>
            </ul>
    </div>
    <div className='latest-post'>
              {postCard}
                </div>
</div>
        )
    }
}

export default UserDetailCard;
