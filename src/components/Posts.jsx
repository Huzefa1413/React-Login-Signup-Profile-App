import React from 'react';
import { useState } from 'react';
import profile from './assets/profile.png';
import '../index.css';
import moment from 'moment';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, deleteDoc, updateDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBMUmbLONQ_PZUUDq65jgO_eFhlTRBc1y0",
    authDomain: "react-login-signup-profile-app.firebaseapp.com",
    projectId: "react-login-signup-profile-app",
    storageBucket: "react-login-signup-profile-app.appspot.com",
    messagingSenderId: "16424328171",
    appId: "1:16424328171:web:25c8b69a4e51905ba457ae"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

const Posts = (props) => {
    const loggedUser = JSON.parse(localStorage.getItem('loginUserId'))

    const [editText, setEditText] = useState("");
    const [editing, setEditing] = useState(false);

    const deleteUserPost = async (postId) => {
        await deleteDoc(doc(db, 'users', loggedUser, "posts", postId));
    }

    const deletePost = async (postId) => {
        await deleteDoc(doc(db, "posts", props.post.postId));
    }


    const updateUserPost = async (postId, editedText) => {
        setEditing(false);
        await updateDoc(doc(db, 'users', loggedUser, "posts", postId), {
            text: editedText
        });
    }

    const updatePost = async (postId, editedText) => {
        setEditing(false);
        await updateDoc(doc(db, "posts", props.post.postId), {
            text: editedText
        });
    }

    return (
        <>
            <div className="post">
                <div className="posthead">
                    <div className="picname">
                        <img src={profile} alt="" />
                        <div className="nametime">
                            <p><b>{props.post.username}</b></p>
                            <p>{moment((props.post.createdOn?.seconds) ? props.post.createdOn?.seconds * 1000 : undefined).format('Do MMMM, h:mm a')}</p>
                        </div>
                    </div>
                </div>
                <hr />
                {(props.post.text) ?
                    <>
                        <div className={"postcontent"}>
                            {(!editing) ?
                                <p>{props.post.text}</p> :
                                <input autoFocus type="text" value={editText} onChange={(e) => { setEditText(e.target.value) }} />}
                        </div>
                        <hr />
                    </> : ""
                }
                {(props.post.img) ?
                    <>
                        <div className="image">
                            <img src={props.post.img} alt="" />
                        </div>
                        <hr />
                    </> : ""}
                {(!props.homevalue) ?
                    <div className="buttonbox">
                        <button onClick={() => { deleteUserPost(props.post.id); deletePost(props.post.id); }}>Delete</button>
                        <button className={`${(!editing) ? "" : "none"}`} onClick={() => { setEditing(true); setEditText(props.post.text) }}>Edit</button>
                        <button className={`${(editing) ? "" : "none"}`} onClick={() => { props.post.text = editText; updateUserPost(props.post.id, props.post.text); updatePost(props.post.id, props.post.text) }}>Update</button>
                    </div> : null}
            </div>
        </>

    )
}

export default Posts;