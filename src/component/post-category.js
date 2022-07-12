import React, { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import img from '../background.jpg'
import {database} from '../firebase';
import { collection, addDoc ,getDocs, doc, updateDoc, deleteDoc,onSnapshot, setDoc, query, orderBy, where} from 'firebase/firestore';
import logo from '../default.jpg'
import Sidebar from './sidebar';
import PostCardDetail from './post-card-detail';
import UserPost from  './user-post'
import NoCategory from './no-category'

function PostCategory (props){
const {id} = useParams()
const ID = props.ID
const avatar = props.avatar
const name = props.name
const [myId, setMyid]  = useState(false)
const db = collection(database,"post")
const q = query(db,where("category","==" ,id))

// CHECK IF CATEGORY EXIST

if(id === 'Other'){
    console.log("nothing");
}else{
    getDocs(q).then((res) => {
        if (res.docs.length < 1) {
          setMyid(true);
        }
        res.docs.map((item) => {
          const data = item.data();
        });
      });
}


return(
 <>
{myId ? <NoCategory /> : <PostCategoryCards name={name} id={ID} cat_id={id} avatar={avatar} />}
 </>
)
}

export default PostCategory;

class PostCategoryCards extends React.Component{
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
        const db_user = collection(database, "user");
        const user_id = this.props.id;
        const cat_id = this.props.cat_id;
        const db_post = collection(database, "post");
        const q = query(db_user, where("uid", "==", user_id));
        const q2 = query(db_post, where("category", "==", cat_id));

        // GET AVATAR
        await getDocs(q).then((res) => {
          res.docs.map((item) => {
            const data = item.data();
            console.log(data);
            return this.setState({
              getAvatar: (this.state.getAvatar = data.images),
            });
          });
        });

        //  GET POIST

        if (cat_id === "Other") {
          await getDocs(db_post).then((res) => {
            if (res) {
              res.docs.map((item) => {
                const data = item.data();
                return this.setState({
                  dataPost: (this.state.dataPost = res),
                  loading: (this.state.loading = false),
                  avatar_id: (this.state.avatar_id = data.user_post_id),
                });
              });
            }
          });
        } else {
            console.log("tes");
          await getDocs(q2).then((res) => {
            if (res) {
              console.log(res);
              this.setState({
                dataPost: (this.state.dataPost = res),
                loading: (this.state.loading = false),
              });
            }
          });
        }


    }
    
    async componentDidUpdate(){
        const cat_id = this.props.cat_id
        const db_post= collection(database,'post')

        const q2 = query(db_post,where("category","==" ,cat_id))

                      //  GET POIST
              
                      if (cat_id === "Other") {
                        await getDocs(db_post).then((res) => {
                          if (res) {
                            res.docs.map((item) => {
                              const data = item.data();
                              return this.setState({
                                dataPost: (this.state.dataPost = res),
                                loading: (this.state.loading = false),
                                avatar_id: (this.state.avatar_id = data.user_post_id),
                              });
                            });
                          }
                        });
                      } else {
                          console.log("tes");
                        await getDocs(q2).then((res) => {
                          if (res) {
                            console.log(res);
                            this.setState({
                              dataPost: (this.state.dataPost = res),
                              loading: (this.state.loading = false),
                            });
                          }
                        });
                      }
              
              

    }



    render(){

        const postCard = Array.isArray(this.state.dataPost.docs) ? this.state.dataPost.docs.map((post,index)=> {
            const posts = post.data()
            console.log(posts);
            return <UserPost data={posts}/>
            }) : ""
        return(
         <div className='post-container'>
            <div className='post-grid'>
                <div className='main-post'>
     <div className='hot'>
         <i class="fa fa-fire" aria-hidden="true"></i>
        <h2 className='post-title'>Category : {this.props.cat_id}</h2>
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

