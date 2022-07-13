import React from 'react'
import { Link } from 'react-router-dom';
import img from '../akun.jpg'
import {database,auth} from '../firebase';
import { collection, getDocs,query, where,doc, deleteDoc,updateDoc,arrayUnion,arrayRemove} from 'firebase/firestore';

class FollowingCard extends React.Component{
constructor(){
    super()
    this.state = {
        follower:[]
    }
}


async componentDidMount(){
    const follower_id = this.props.follow_id
    console.log(follower_id);
    const user_id = this.props.user_id
    const follower = collection(database,'user')
    const queryUser = query(follower,where("uid","==" , follower_id ))
                  // GET FOLLOWER
                  await getDocs(queryUser).then(res => {
                    res.docs.map(item => {
                      const data = item.data()
                        this.setState({follower:this.state.follower = data})
                        });
                      })
}
    render(){

        return(
       this.props.follow_id == null ? "kosong" : <div className='follower-container'>
       <div className='post-info'>
           <div className='image-wrap'>
           <Link to={`/account/${this.state.follower.uid}`}>
           <img src={this.state.follower.images != null ? this.state.follower.images : img} />
           </Link>
           </div>
           <div className='post-user'>
               <h4 className='username'><Link to={`/account/${this.state.follower.uid}`}>{this.state.follower.username}</Link></h4>
           </div>
       </div>
       </div>
             )
    }
}

export default FollowingCard;

