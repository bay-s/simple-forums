import React from 'react'
import { Link } from 'react-router-dom';
import {database} from '../firebase';
import { collection,getDocs} from 'firebase/firestore';

class Sidebar extends React.Component{
constructor(){
  super()
  this.state = {
    dataPost:[],
    category:['Anime','Manga','Games','Sports','Technology','Other']
  }
}


async componentDidMount(){

  const db = collection(database,'post')

                //  GET ALL POIST

await getDocs(db).then(res => {
if (res) {
  res.docs.map(item => {
      const data = item.data()
return this.setState({ 
  dataPost:this.state.dataPost = res
 })  
    })
  }
})


}


    render(){
      const titlePost = Array.isArray(this.state.dataPost.docs) ? this.state.dataPost.docs.map((post)=> {
        const posts = post.data()
        return  <li key={posts.title} ><Link to={`/post-detail/${posts.post_id}`}>{posts.title}</Link></li>
        }) : ""
      
      return(
        <aside className='post-rigt'>
        <div className='new-post'>
         <div className='judul-post'>
           <h3> Newest Post</h3>
         </div>
         <ul className='list'>
           {titlePost}
         </ul>
        </div>
        <div className='new-post'>
        <div className='judul-post'>
           <h3>Post Recomendation</h3>
         </div>
         <ul className='list'>
             <li key="1"><a href='#0'>molestias officiis dignissimos aperiam?</a></li>
             <li  key="2"><a href='#0'> sit amet consectetur adipisicing elit</a></li>
             <li  key="3"><a href='#0'> commodi molestias officiis dignissimos </a></li>
             <li  key="4"><a href='#0'>amet consectetur adipisicin</a></li>
         </ul>
        </div>
        <div className='new-post'>
         <div className='judul-post'>
           <h3>Post Category</h3>
         </div>
         <ul className='list'>
         {this.state.category.map(cat => {
           return <li key={cat}><Link to={`/category/${cat}`} >{cat}</Link></li>
         })
        }
         </ul>
        </div>
     </aside>
    )
    }
}

export default Sidebar;