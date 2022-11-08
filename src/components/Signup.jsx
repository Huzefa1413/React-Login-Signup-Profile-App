import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, onSnapshot, query } from "firebase/firestore";

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

const Register = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        let unsubscribe = null;

        const getRealtimeData = async () => {
            const q = query(collection(db, "users"));
            unsubscribe = onSnapshot(q, (querySnapshot) => {
                const myusers = [];
                querySnapshot.forEach((doc) => {
                    myusers.push({ id: doc.id, ...doc.data() });
                });
                setUsers(myusers);
            });
        }
        getRealtimeData();
        return () => {
            unsubscribe();
        }
    }, [])
    const formik = useFormik({
        initialValues: {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
        validationSchema: yup.object({
            username: yup
                .string('Enter your Username')
                .required('Username is required')
                .min(5, ('Username should be of minimum 5 characters'))
                .max(50, 'Limit exceed: Maximum 50 characters allowed'),
            email: yup
                .string('Enter your email')
                .email('Enter a valid email')
                .required('Email is required'),
            password: yup
                .string('Enter your password')
                .min(8, 'Password should be of minimum 8 characters length')
                .required('Password is required'),
            confirmPassword: yup
                .string('Enter your password')
                .min(8, 'Password should be of minimum 8 characters length')
                .required('Password is required')
                .oneOf([yup.ref("password")], "Passwords do not match"),

        }),
        onSubmit: async (values) => {
            setIsLoading(true)
            let userFound = false;
            if (users.length > 0) {
                // eslint-disable-next-line
                users.map(eachUser => {
                    if ((eachUser.email === values.email) && (eachUser.password === values.password)) {
                        userFound = true;
                    }
                })
                    (userFound ? (error()) : savePost(values))
            }
        }
    })
    const error = () => {
        alert('This user already exist')
        setIsLoading(false);
    }
    const savePost = async (e) => {

        try {
            // eslint-disable-next-line
            const docRef = await addDoc(collection(db, "users"), {
                username: e.username,
                email: e.email,
                password: e.password
            });
            setIsLoading(false)
            navigate('/')
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    return (
        <>
            <form onSubmit={formik.handleSubmit}>
                <h2 className="title">Sign Up</h2>
                <div className="input-field">
                    <input name='username' type="text" placeholder="Username" value={formik.values.username} onChange={formik.handleChange} />
                </div>

                <span>{formik.touched.username && formik.errors.username}</span>
                <div className="input-field">
                    <input name='email' type="email" placeholder="Email" value={formik.values.email} onChange={formik.handleChange} />
                </div>
                <span>{formik.touched.email && formik.errors.email}</span>
                <div className="input-field">
                    <input name='password' type="password" placeholder="Password" value={formik.values.password} onChange={formik.handleChange} />
                </div>
                <span>{formik.touched.password && formik.errors.password}</span>
                <div className="input-field">
                    <input name='confirmPassword' type="password" placeholder="Confirm Password" value={formik.values.confirmPassword} onChange={formik.handleChange} />
                </div>
                <span> {formik.touched.confirmPassword && formik.errors.confirmPassword}</span>

                {
                    (!isLoading) ? (<input value="Signup" type='submit' className="btn" />) : (<div className='loader'></div>)
                }
                <input type="button" value='Login Page' className='btn' onClick={() => navigate('/')} />
            </form>
        </>
    )
}

export default Register