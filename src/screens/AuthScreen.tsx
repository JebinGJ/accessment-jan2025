import React, { useState, useEffect, useCallback } from 'react'
import { Text, View, StyleSheet, Image, TextInput, Pressable } from "react-native"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { routes } from '../service/routes';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { userDataType } from './RegistrationScreen';
import { useAppDispatch } from '../redux/Hooks';
import { userAction } from '../redux/reducers/UserReducer';

export const AuthScreen = ({ navigation }: any) => {
  const dispatch = useAppDispatch()
  const [errorMessage, setErrorMessage] = useState<string>('');
  let initialValues = {
    email: '',
    password: '',
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
  });

  const onSubmit = async () => {
    if (Object.keys(errors).length === 0) {
      const inputEmail = values.email;
      const inputPassword = values.password;
      const userName = values.email.split('@')[0];
      try {
        const storedData = await AsyncStorage.getItem('userDetails');
        let userDetails: userDataType[] = storedData ? JSON.parse(storedData) : [];

        const userValid = userDetails.some(
          (user: userDataType) => user.email === inputEmail && user.password === inputPassword
        );
        if (userValid) {
          dispatch(userAction.setUserName(userName))
          navigation.navigate(routes.HOME_SCREEN);
        } else {
          setErrorMessage('Invalid email or password.');
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

  const { values, errors, setFieldValue, validateField, resetForm } = formik;

  useEffect(() => {
    if (errorMessage) {
      const timeoutId = setTimeout(() => {
        setErrorMessage('');
      }, 5000);
      return () => clearTimeout(timeoutId);
    }
  }, [errorMessage]);

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

  useFocusEffect(
    useCallback(() => {
      resetForm();
    }, [resetForm])
  );

  const handleRegister = () => {
    navigation.navigate(routes.REGISTRATION_SCREEN)
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
      <View style={styles.loginContainer}>
        <Text style={styles.title}>Login</Text>
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

        <Text style={styles.forgotPassword}>Forgot Password</Text>
        <Text style={styles.commonErrMsg}>{errorMessage}</Text>
        <Pressable style={styles.signInBtn} onPress={() => formik.handleSubmit()}>
          <Text style={styles.signInTxt}>Sign In</Text>
        </Pressable >
        <Text style={styles.orTxt}>(or)</Text>
        <Pressable onPress={handleRegister}>
          <Text style={styles.registerTxt}>SignUp</Text>
        </Pressable>
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
    flex: .8,
    justifyContent: 'center',
    alignContent: 'center',
  },
  img: {
    width: '100%',
    height: '100%',
  },
  loginContainer: {
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
    color:'#000'
  },
  errInput: {
    borderWidth: 1,
    borderColor: 'red',
    borderRadius: 8,
    padding: 10,
     color:'#000'
  },
  commonErrMsg: {
    color: 'red',
    paddingVertical: 4,
    textAlign: 'center',
  },
  errMsg: {
    color: 'red',
    paddingVertical: 4,
    textAlign: 'left',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    color: '#666',
    marginBottom: 10,
  },
  signInBtn: {
    alignItems: 'center',
    paddingVertical: 15,
    backgroundColor: '#4285F4',
    borderRadius: 10,
  },
  signInTxt: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  orTxt: {
    textAlign: 'center',
    fontSize: 12,
    paddingVertical: 5,
    color:'#000'
  },
  registerTxt: {
    textAlign: 'center',
    fontSize: 15,
    color: '#4285F4',
    textDecorationLine: 'underline'
  }
})