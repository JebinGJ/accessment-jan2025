import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet, Image, TextInput, Pressable } from "react-native"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { routes } from '../service/routes';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface userDataType {
    email: string;
    password: string;
}

export const RegistrationScreen = ({ navigation }: any) => {
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('')

    let initialValues = {
        email: '',
        password: '',
        confirmPassword: '',
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .trim()
            .email('Invalid email format!')
            .required('Email is required!'),
        password: Yup.string()
            .trim()
            .min(8, 'Password must be at least 8 characters long!')
            .max(30, 'Password must be less than 30 characters long!')
            .matches(/[a-z]/, 'Password must contain at least one lowercase letter!')
            .matches(/[A-Z]/, 'Password must contain at least one uppercase letter!')
            .matches(/\d/, 'Password must contain at least one digit!')
            .matches(/[@$!%*?&#]/, 'Password must contain at least one special character!')
            .required('Password is required!'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), ''], 'Passwords must match')
            .required('Confirm Password is required!'),
    });

    const onSubmit = async () => {
        if (Object.keys(errors).length === 0) {
            const newUser = {
                email: values.email,
                password: values.password,
            };
            try {
                const storedData = await AsyncStorage.getItem('userDetails');
                let userDetails = storedData ? JSON.parse(storedData) : [];

                const emailExists = userDetails.some((user: userDataType) => user.email === values.email);

                if (!emailExists) {
                    userDetails.push(newUser);
                    await AsyncStorage.setItem('userDetails', JSON.stringify(userDetails));
                    setSuccessMessage('User added successfully.');
                    navigation.navigate(routes.AUTH_SCREEN)
                } else {
                    setErrorMessage('Email already exists.');
                }
            } catch (error) {
                console.error('Error accessing local storage:', error);
            }
        }
    };


    const formik = useFormik({
        initialValues,
        onSubmit,
        validationSchema,
        validateOnChange: false,
        enableReinitialize: true
    });

    const { values, errors, setFieldValue, validateField } = formik;

    useEffect(() => {
        if (values.email !== '') {
            validateField('email');
        }
    }, [values.email]);

    useEffect(() => {
        if (values.password !== '') {
            validateField('password');
        }
    }, [values.password]);

    useEffect(() => {
        if (values.confirmPassword !== '') {
            validateField('confirmPassword');
        }
    }, [values.confirmPassword]);

    useEffect(() => {
        if (errorMessage) {
            const timeoutId = setTimeout(() => {
                setErrorMessage('');
                setSuccessMessage('')
            }, 5000);
            return () => clearTimeout(timeoutId);
        }
    }, [errorMessage, successMessage]);

    const handleBack = () => {
        navigation.navigate(routes.AUTH_SCREEN)
    }

    return (
        <KeyboardAwareScrollView
            contentContainerStyle={styles.flexFill}
            keyboardShouldPersistTaps="handled"
            scrollEnabled={false}>
            <View style={styles.header}>
                <Image
                    source={{
                        uri: 'https://media.istockphoto.com/id/1208165459/vector/cartoon-pill-character.jpg?s=612x612&w=0&k=20&c=uNpY1Ko_ypHFLySC9euiefD_WAQqiAeuvwflwO5DIUM=',
                    }}
                    resizeMode="contain"
                    style={styles.img}
                />
            </View>
            <View style={styles.registerContainer}>
                <Text style={styles.title}>Register</Text>
                <TextInput
                    style={errors.email ? styles.errInput : styles.input}
                    placeholder="Email"
                    placeholderTextColor="#999"
                    value={values.email}
                    onChangeText={(text) => setFieldValue('email', text)}
                />
                <Text style={styles.errMsg}>{errors.email}</Text>
                <TextInput
                    style={errors.password ? styles.errInput : styles.input}
                    placeholder="Password"
                    placeholderTextColor="#999"
                    secureTextEntry
                    value={values.password}
                    onChangeText={(text) => setFieldValue('password', text)}
                />
                <Text style={styles.errMsg}>{errors.password}</Text>
                <TextInput
                    style={errors.confirmPassword ? styles.errInput : styles.input}
                    placeholder="Confirm password"
                    placeholderTextColor="#999"
                    secureTextEntry
                    value={values.confirmPassword}
                    onChangeText={(text) => setFieldValue('confirmPassword', text)}
                />
                <Text style={styles.errMsg}>{errors.confirmPassword}</Text>
                {errorMessage && <Text style={styles.commonErrMsg}>{errorMessage}</Text>}
                <Text style={styles.successMsg}>{successMessage}</Text>
                <Pressable style={styles.signInBtn} onPress={() => formik.handleSubmit()}>
                    <Text style={styles.signInTxt}>Sign Up</Text>
                </Pressable >
                <Pressable onPress={handleBack}>
                    <Text style={styles.backTxt}>Back</Text>
                </Pressable >
            </View>

        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    flexFill: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flex: .5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    img: {
        width: '50%',
        height: '50%',
    },
    registerContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center'
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        color:'#000',
    },
    errInput: {
        borderWidth: 1,
        borderColor: 'red',
        borderRadius: 8,
        padding: 10,
        color:'#000',
    },
    errMsg: {
        color: 'red',
        paddingVertical: 4,
        textAlign: 'left',
    },
    commonErrMsg: {
        color: 'red',
        paddingVertical: 4,
        textAlign: 'center',
    },
    signInBtn: {
        alignItems: 'center',
        paddingVertical: 15,
        backgroundColor: '#4285F4',
        borderRadius: 10,
        marginBottom: 20,
    },
    signInTxt: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    orTxt: {
        textAlign: 'center',
        fontSize: 12,
        marginBottom: 20,
    },
    backTxt: {
        textAlign: 'center',
        fontSize: 15,
        color: '#4285F4',
        textDecorationLine: 'underline'
    },
    successMsg: {
        color: 'green',
        paddingVertical: 4,
        textAlign: 'center',
    }
})