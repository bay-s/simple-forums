import React from 'react'
import {database,auth,secondAuth } from '../firebase';
import { collection, addDoc ,getDocs, doc, updateDoc, deleteDoc,onSnapshot , setDoc} from 'firebase/firestore';
import { useParams } from 'react-router-dom';


function PrivateMessage(props){
    const {id} = useParams();

    return(
     <Message />
    )
}


export default PrivateMessage;


class Message extends React.Component{
    constructor(){
        super()
        this.state = {
            messages:''

        }
    }

    render(){
        return(
            <h1>TEST MESSAGES</h1>
        )
    }
}