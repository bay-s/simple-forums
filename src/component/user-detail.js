import React from 'react'
import akun from '../akun.jpg'
import {database,auth} from '../firebase';
import { collection, getDocs,query, where,doc, deleteDoc,updateDoc,arrayUnion} from 'firebase/firestore';
import UserPost from './user-post';

class UserDetailCard extends React.Component{
    constructor(){
        super()
        this.state = {
           data:[],
           modal:false,
           dataPost:[],
           loading:true,
           total_followers:null
        }
    }



    async componentDidMount() {
        const db = collection(database,"user")
        const post = collection(database,'post')
        const id = this.props.id;
        const q = query(db,where("uid","==" , id))
        const q2 = query(post,where("user_post_id","==" , id))
    console.log(id);

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


    follower_profiles = (user_id) => {
      const docUpdate = doc(database,'user_follower',user_id)

      updateDoc(docUpdate,{
        follower:arrayUnion({
          follower_name:this.props.user_name,
          follower_avatar:this.props.avatar,
          follower_id:this.props.id,
        })
        })
        .then(() =>{alert("Follow succes")})
        .catch(err => {alert(err.message)})
    }
    
        follow = (e) => {
          const user_id = this.props.id
          const docUpdate = doc(database,'user',user_id)
          if(!e.target.classList.contains('following')){
            localStorage.setItem(user_id,user_id);
            this.followNotif(user_id) 
            this.follower_profiles(user_id)
            updateDoc(docUpdate,{
             total_follower:this.state.total_followers + 1
             })
             .then(() =>{
               alert("Follow succes")
               this.setState({hide:this.state.hide = false})
             })
             .catch(err => {alert(err.message)})
           }else{
             localStorage.removeItem(user_id,user_id);
             updateDoc(docUpdate,{
               total_follower:this.state.total_followers - 1
               })
               .then(() =>{
                 alert("Follow succes")
                 this.setState({hide:this.state.hide = false})
               })
               .catch(err => {alert(err.message)})
           }
        }

    render(){

        const postCard = Array.isArray(this.state.dataPost.docs) ? this.state.dataPost.docs.map((post,index)=> {
            const posts = post.data()
            return <UserPost data={posts}/>
            }) : ""

        const is_follow = localStorage.getItem(this.props.id)
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
                <button className={is_follow ? 'hvr-sweep-to-right' : 'hvr-sweep-to-right  follow'} onClick={this.follow}>{is_follow ? 'Following' : 'Follow'}</button>
                </div>
            </div>
    </div>
    {/* END USER INFO */}
    <div className='user-post-container'>
            <ul className='judul-post'>
              <li><span>POST {this.state.data.total_post}</span></li>
              <li><span>FOLLOWER {this.state.data.follower}</span></li>
              <li><span>FOLLOWING {this.state.data.follow}</span></li>
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
