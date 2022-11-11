import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useState } from 'react';
import { collection, onSnapshot, query, } from "firebase/firestore";
import { db } from '../firebaseConfig';

const Login = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([])
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
            email: "",
            password: "",
        },
        validationSchema: yup.object({
            email: yup
                .string('Enter your email')
                .email('Enter a valid email')
                .required('Email is required'),
            password: yup
                .string('Enter your password')
                .min(8, 'Password should be of minimum 8 characters length')
                .required('Password is required'),
        }),
        onSubmit: async (values) => {
            let userfind = false;
            let userid = ''
            if (users.length > 0) {
                // eslint-disable-next-line
                users.map(eachUser => {
                    if ((eachUser.email === values.email) && (eachUser.password === values.password)) {
                        userfind = true;
                        userid = eachUser.id;
                    }
                })
            }
            if (userfind) {
                localStorage.setItem('loginUserId', JSON.stringify(userid))
                navigate('/home')
            }
            else {
                alert('Incorrect Email or Password, New User? Signup')
            }
        }
    })
    return (
        <>
            <form onSubmit={formik.handleSubmit}>
                <h2 className="title">Sign in</h2>
                <div className="input-field">
                    <input name='email' type="email" placeholder="Email" value={formik.values.email} onChange={formik.handleChange} />
                </div>
                <span>{formik.touched.email && formik.errors.email}</span>
                <div className="input-field">
                    <input name='password' type="password" placeholder="Password" value={formik.values.password} onChange={formik.handleChange} />
                </div>
                <span>{formik.touched.password && formik.errors.password}</span>
                <input value="Login" type='submit' className="btn" />
                <input type="button" value='Signup Page' className='btn' onClick={() => navigate('/signup')} />
            </form>
        </>
    )
}

export default Login