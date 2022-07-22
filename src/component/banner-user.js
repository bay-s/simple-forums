import React from 'react'
import {database,auth,storage} from '../firebase';
import { getAuth, deleteUser } from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { collection,updateDoc,doc,query,getDocFromCache,getDocs,where} from 'firebase/firestore';
import background from '../background.jpg'

class BannerUser extends React.Component{
    constructor(){
        super()
        this.state = {
            images:'',
            url:'',
            hide:false,
            banner:''
        }
    }


    componentDidMount(){ 
      const db = collection(database,"user")
      const id = this.props.id;
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

    render(){
    let banner;
    if(this.state.banner.length > 0){
      banner =  {
        backgroundImage:`url(${this.state.banner})`
      }
      console.log("test");
    }else{
banner =  {
  backgroundImage:`url(${background})`
}
    }
        return(
            <div className='banner' style={banner}></div>
        )
    }
}


export default BannerUser;