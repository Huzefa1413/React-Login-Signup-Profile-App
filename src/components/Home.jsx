import React from 'react';
import { useState, useEffect } from 'react';
import '../index.css';
import profile from './assets/profile.png';
import photos from './assets/photos.png'
import post from './assets/post.png';
import homes from './assets/home.png';
import user from './assets/user.png'
import Posts from './Posts.jsx';
import axios from 'axios';
import { collection, addDoc, onSnapshot, query, serverTimestamp, orderBy } from "firebase/firestore";
import { Link } from 'react-router-dom';
import logout from './assets/logout.png';
import { db } from '../firebaseConfig';

const Home = () => {

    const loggedUser = JSON.parse(localStorage.getItem('loginUserId'))

    const [postText, setPostText] = useState("");
    const [userPosts, setUserPosts] = useState([]);
    const [posts, setPosts] = useState([]);
    const [image, setImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [users, setUsers] = useState([])
    const [home, setHome] = useState(true);

    const savePost = async (e) => {

        e.preventDefault();
        if (postText === "" && image === null) {
            alert("Please Write Something to Post OR Add Image to upload");
        }
        else {
            setIsLoading(true)
            if (image === null) {
                document.getElementById("postinput").value = "";
                try {
                    const docRef1 = await addDoc(collection(db, 'posts'), {
                        text: postText,
                        createdOn: serverTimestamp(),
                        username: loggedusername,
                    });
                    // eslint-disable-next-line
                    const docRef = await addDoc(collection(db, 'users', loggedUser, 'posts'), {
                        text: postText,
                        createdOn: serverTimestamp(),
                        username: loggedusername,
                        postId: docRef1.id,
                    });
                    // eslint-disable-next-line
                    const docRef2 = await addDoc(collection(db, 'myposts'), {
                        text: postText,
                        createdOn: serverTimestamp(),
                        username: loggedusername,
                    });
                    setIsLoading(false)
                } catch (e) {
                    console.error("Error adding document: ", e);
                }
                setPostText("");
            }
            else {
                if (image.type.slice(0, 5) === 'image') {
                    document.getElementById("postinput").value = "";
                    document.getElementById("image").value = "";
                    const cloudinaryData = new FormData();
                    cloudinaryData.append("file", image);
                    cloudinaryData.append("upload_preset", "myFacebookPictures")
                    cloudinaryData.append("cloud_name", "huzefa")
                    axios.post(`https://api.cloudinary.com/v1_1/huzefa/image/upload`, cloudinaryData, { headers: { 'Content-Type': 'multipart/form-data' } })
                        .then(async res => {
                            try {
                                const docRef1 = await addDoc(collection(db, 'posts'), {
                                    text: postText,
                                    createdOn: serverTimestamp(),
                                    img: res?.data?.url,
                                    username: loggedusername,
                                });
                                // eslint-disable-next-line
                                const docRef = await addDoc(collection(db, 'users', loggedUser, 'posts'), {
                                    text: postText,
                                    createdOn: serverTimestamp(),
                                    img: res?.data?.url,
                                    username: loggedusername,
                                    postId: docRef1.id,
                                });
                                // eslint-disable-next-line
                                const docRef2 = await addDoc(collection(db, 'myposts'), {
                                    text: postText,
                                    createdOn: serverTimestamp(),
                                    img: res?.data?.url,
                                    username: loggedusername,
                                });
                                setIsLoading(false)
                            } catch (e) {
                                console.error("Error adding document: ", e);
                            }
                        })
                    setImage(null);
                    setPostText("");
                }
                else {
                    alert('Only Images are allowed to upload! Invalid Image');
                    setIsLoading(false);
                }
            }
        }
    }

    useEffect(() => {
        let unsubscribe = null;

        const getRealtimeDataUser = async () => {

            const q = query(collection(db, 'users', loggedUser, 'posts'), orderBy("createdOn", "desc"));

            unsubscribe = onSnapshot(q, (querySnapshot) => {

                const posts = [];

                querySnapshot.forEach((doc) => {
                    posts.push({ id: doc.id, ...doc.data() });
                });

                setUserPosts(posts);
            });
        }

        getRealtimeDataUser();

        const getRealtimeData = async () => {

            const q = query(collection(db, 'posts'), orderBy("createdOn", "desc"));

            unsubscribe = onSnapshot(q, (querySnapshot) => {

                const posts = [];

                querySnapshot.forEach((doc) => {
                    posts.push({ id: doc.id, ...doc.data() });
                });
                setPosts(posts);
            });
        }

        getRealtimeData();

        const getUsers = async () => {
            const q = query(collection(db, "users"));
            unsubscribe = onSnapshot(q, (querySnapshot) => {
                const myusers = [];
                querySnapshot.forEach((doc) => {
                    myusers.push({ id: doc.id, ...doc.data() });
                });
                setUsers(myusers);
            });
        }
        getUsers();

        return () => {
            unsubscribe();
        }

    }, [loggedUser])
    let loggedusername;
    // eslint-disable-next-line
    users.map(eachUser => {
        if (eachUser.id === loggedUser) {
            loggedusername = eachUser.username;
        }
    })
    return (
        <>
            <div className='navbar'>
                <div>
                    <div className="logoname">Facebook</div>
                </div>
                <div className='home-profile'>
                    <div onClick={() => setHome(true)}>
                        <img src={homes} alt='Home' className={home ? 'selected' : ''} />
                        <p>Home</p>
                    </div>
                    <div onClick={() => setHome(false)}>
                        <img src={user} alt='User' className={!home ? 'selected' : ''} />
                        <p>User</p>
                    </div>
                </div>
                <div className='logoutdiv'>
                    <Link to={'/'}>
                        <img className='logoutlogo' src={logout} alt="logout" />
                        <p className='logout'>Logout</p>
                    </Link>
                </div>
            </div>

            <div className="addpost">
                <div className="top">
                    <img src={profile} alt="" />
                    <input id='postinput' type="text" placeholder="What's on your mind?" onChange={(e) => { setPostText(e.target.value) }} />
                </div>
                <hr />

                <div className="bottom">
                    <div className='button'>
                        <img src={photos} alt="" />
                        <input type="file" id='image' onChange={(e) => { setImage(e.currentTarget.files[0]) }} />
                    </div>
                    {
                        (!isLoading) ? (<div className="button" onClick={savePost}>
                            <img src={post} alt="" />
                            <p>Post</p>
                        </div>) : (<div className='loader'></div>)
                    }
                </div>
            </div>
            <hr />
            {
                (home) ?
                    posts.map((eachPost, i) => (
                        <Posts key={i} homevalue={home} post={eachPost} />
                    )) :
                    userPosts.map((eachPost, i) => (
                        <Posts key={i} homevalue={home} post={eachPost} />
                    ))
            }
        </>
    )
}

export default Home