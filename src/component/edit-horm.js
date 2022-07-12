import React from 'react'
import {database} from '../firebase';
import { doc, updateDoc} from 'firebase/firestore';
import { getAuth, updateProfile , updateEmail} from "firebase/auth";
const auth = getAuth();

class EditForm extends React.Component{
    constructor(){
        super()
        this.state = {
            username:'',
            fullname:'',
            email:'',
            hide:false
        }
    }

    
handlerChange = (e) => {
    const {name,value} = e.target
    console.log(value);
    this.setState(prev => {
      return{
   [name]:value
      }
    })
  }

  updateProfiles = (e) => {
    e.preventDefault()
    const id = this.props.id
    const auth = getAuth();
    const email = this.props.email
  const docUpdate = doc(database,'user',id)

     if (this.props.nameInput === 'username' ) {
        if (this.state.username.length < 1) {
            alert("input cant be empty")
        }else{
          this.setState({hide:this.state.hide = true})
            updateDoc(docUpdate,{
                username:this.state.username
              })
              .then(() =>{
              alert("edit username sukses")
              window.location.reload()})
              .catch(err => {alert(err.message)})
        }
     }
     if (this.props.nameInput === 'fullname' ) {
        if (this.state.fullname.length < 1) {
            alert("input cant be empty")
        }else{
          this.setState({hide:this.state.hide = true})
            updateDoc(docUpdate,{
                fullname:this.state.fullname
              })
              .then(() =>{
              alert("edit fullname sukses")
              window.location.reload()})
              .catch(err => {alert(err.message)})
        }
     }
    
  }

  render(){
    return(
 <div className='modal-edit'>
    <div className='modal-inner'>
        <form className='modal-form' onSubmit={this.updateProfiles}>
    <label className='modal-label'>
        <input type={this.props.nameInput === 'email' ? 'email' : 'text'} name={this.props.nameInput} placeholder={this.props.nameInput} onChange={this.handlerChange }/>
    </label>
<div className={!this.state.hide ? 'button-container' : 'hide'}>
<button className='hvr-sweep-to-right cancel' onClick={this.props.removeModal}>Cancel</button>
<button className='hvr-sweep-to-right save' type='submit'>Save</button>
</div>
</form>
</div>
</div>
    )
  }
}

export default EditForm;