import React, { useState } from 'react'
import {database} from '../firebase';
import { collection,getDocs, doc, updateDoc, query, where,getDocsFromCache} from 'firebase/firestore';
import { Navigate, useParams } from 'react-router-dom';
import logo from '../default.jpg'
import img from '../background.jpg'
import { Link } from 'react-router-dom'
import Sidebar from './sidebar';
import Comment from './comment';
import PostCardDetail from './post-card-detail';
import DisplayComment from './display-comment';

function PostDetail(props){
    const {id} = useParams()
    console.log(`POST ID IS ${id}`);
    console.log(props);
    const  user_id = props.ID
    const [myId, setMyid]  = useState(false)
    const db = collection(database,'post')
    const q = query(db,where("post_id","==" ,id))
    //  GET POIST
 getDocs(q).then(res => {
    if (res.docs.length < 1) {
        setMyid(true);
   }
})
    return(
    <div className='post-container'>
        <div className='post-grid'>
            <div className='main-post'>

 {myId ? <Navigate to="*" replace={true} /> : <PostDetailCard  key={id} id={id} user_id={user_id} avatar={props.avatar} user_name={props.name} /> }
 <Comment avatar={props.avatar} name={props.name} id={id}  user_id={user_id}/>
<>
<DisplayComment key={id} post_id={id} user_id={user_id} avatar={props.avatar} user_name={props.name} />
</>
           </div>
           <Sidebar />
        </div>   
    </div>
    )
}

export default PostDetail;


class PostDetailCard extends React.Component{
    constructor(){
        super()
        this.state = {
            dataPost:[],
            getAvatar:[],
            avatar:'',
            username:'',
            loading:true
        }
    }

    async componentDidMount(){

        const user= collection(database,"user")
        const id = this.props.id
        const db = collection(database,'post')
        const q = query(db,where("post_id","==" , id))
        const q2 = query(db ,where("uid","==" , id))
    
      // GET AVATAR
      await getDocsFromCache(q2).then(res => {
        res.docs.map(item => {
        const data = item.data()
        console.log(data);
    return this.setState({getAvatar:this.state.getAvatar = data.images})
          });
        })
    
                      //  GET POIST

  await getDocsFromCache(q).then(res => {
    if (res) {
        console.log(res);
        this.setState({ 
            dataPost:this.state.dataPost = res,
            loading:this.state. loading = false
           })  
    }
      })

    }

  componentDidUpdate(){

        const user= collection(database,"user")
        const id = this.props.id
        const db = collection(database,'post')
        const q = query(db,where("post_id","==" , id))
        const q2 = query(db ,where("uid","==" , id))
    
      // GET AVATAR
      getDocsFromCache(q2).then(res => {
        res.docs.map(item => {
        const data = item.data()
        console.log(data);
    return this.setState({getAvatar:this.state.getAvatar = data.images})
          });
        })
    
                      //  GET POIST

 getDocs(q).then(res => {
    if (res) {
        this.setState({ 
            dataPost:this.state.dataPost = res,
            loading:this.state. loading = false
           })  
    }
      })

    }


    render(){
  

    const postCard = Array.isArray(this.state.dataPost.docs) ? this.state.dataPost.docs.map((post,index)=> {
        const posts = post.data()
        return <PostCardDetail key={posts.post_id} data={posts} post_id={this.props.id} user_id={this.props.user_id} avatar={this.props.avatar} user_name={this.props.user_name} isLogin={this.state.isLogin}/>
        }) : ""
        return(
            this.state.loading ? <div className="skeleton-card">
            <div className="card-img skeleton">
            </div>
            <div className="card-body">
                <h2 className="card-title skeleton">
                </h2>
                <p className="card-intro skeleton">   
                </p>
            </div>
            </div> : postCard
        )
    }
}


