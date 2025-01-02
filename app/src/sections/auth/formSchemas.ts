import * as yup from 'yup'

export const signinSchema = yup.object({
    username: yup.string().required('Email or username is required'),
    password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
});