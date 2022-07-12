import React from 'react'
import { Link } from 'react-router-dom'
import img from '../background.jpg'
import {database} from '../firebase';
import { collection, addDoc ,getDocs, doc, updateDoc, deleteDoc,onSnapshot, setDoc, query, orderBy, where} from 'firebase/firestore';
import PostCard from './post-card';
import logo from '../default.jpg'
import Sidebar from './sidebar';

class PostPage extends React.Component{
    constructor(){
        super()
        this.state = {
            dataPost:[],
            avatar:'',
            username:'',
            loading:true,
            getAvatar:[],
            avatar_id:[]
        }
    }

    async componentDidMount(){
        const id = this.state.avatar_id
        const db = collection(database,'post')
        const db1 = collection(database,"user")
        const q = query(db1 ,where("uid","==" , id))



  await getDocs(db).then(res => {
    if (res) {
        res.docs.map(item => {
            const data = item.data()
    return this.setState({ 
        dataPost:this.state.dataPost = res,
        loading:this.state. loading = false,
        avatar_id:this.state.avatar_id = data.user_post_id
       })  
          })
        }
    })

        // GET USER LOGIN
     getDocs(q).then(res => {
          res.docs.map(item => {
          const data = item.data()
          console.log(data);
            return this.setState({ 
                username:this.state.username = data.username,
              avatar:this.state.avatar = data.images,
              })  
            });
          })
        
                      //  GET ALL POIST


  await getDocs(db).then(res => {
    if (res) {
        res.docs.map(item => {
            const data = item.data()
    return this.setState({ 
        dataPost:this.state.dataPost = res,
        loading:this.state. loading = false,
        avatar_id:this.state.avatar_id = data.user_post_id
       })  
          })
        }
    })


    }
    render(){

        const test = {
        textOverflow: `ellipsis`
        }

        const postCard = Array.isArray(this.state.dataPost.docs) ? this.state.dataPost.docs.map((post,index)=> {
            const posts = post.data()
            return <PostCard data={posts} avatar={this.state.avatar} isLogin={this.props.isLogin}/>
            }) : ""

        return(
         <div className='post-container'>
            <div className='post-grid'>
                <div className='main-post'>
     <div className='hot'>
         <i class="fa fa-fire" aria-hidden="true"></i>
        <h2 className='post-title'>Hot Thread</h2>
    </div>

    { this.state.loading ? <div className="skeleton-card">
            <div className="card-img skeleton">
            </div>
            <div className="card-body">
                <h2 className="card-title skeleton">
                </h2>
                <p className="card-intro skeleton">   
                </p>
            </div>
        </div> : postCard
        }

                </div>
         <Sidebar />
            </div>
         </div>
        )
    }
}

export default PostPage


