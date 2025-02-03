import React, { useState, useEffect } from 'react';
import { Text, SafeAreaView, Pressable, StyleSheet, View, TextInput, FlatList } from "react-native";
import { routes } from "../service/routes";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAppSelector } from '../redux/Hooks';

export interface cardType {
    title: string;
    amount: number;
}

export const HomeScreen = ({ navigation }: any) => {
    const { userName } = useAppSelector((state) => state.user);
    const [data, setData] = useState<cardType[]>([]);
    const [reRender, setReRender] = useState(false);

    useEffect(() => {
        (async () => {
            const storedData = await AsyncStorage.getItem('transactions');
            if (storedData) {
                const allTransactions = JSON.parse(storedData);
                const userTransactions = allTransactions[userName] || [];
                setData(userTransactions);
            }
        })();
    }, [reRender, userName]);

    let initialValues = {
        title: '',
        amount: '',
    };

    const validationSchema = Yup.object().shape({
        title: Yup.string()
            .trim()
            .required('Title is required!'),
        amount: Yup.string()
            .trim()
            .required('Amount is required!')
            .typeError('Amount must be a number')
    });

    const onSubmit = async (values: { title: string; amount: string }) => {
        const newCard = {
            title: values.title,
            amount: values.amount,
        };

        const storedData = await AsyncStorage.getItem('transactions');
        let allTransactions = storedData ? JSON.parse(storedData) : {};
         console.log('allTransactions',allTransactions)
        if (!allTransactions[userName]) {
            allTransactions[userName] = [];
        }

        allTransactions[userName].push(newCard);
        await AsyncStorage.setItem('transactions', JSON.stringify(allTransactions));
        setData(allTransactions[userName]);
        setReRender(!reRender);
        formik.resetForm();
    };

    const formik = useFormik({
        initialValues,
        onSubmit,
        validationSchema,
        validateOnChange: false,
        enableReinitialize: true,
    });

    const { values, errors, setFieldValue } = formik;

    const handleLogout = async () => {
        navigation.replace(routes.AUTH_SCREEN);
    };

    
    const handleRemoveData = async (title: string) => {
        const storedData = await AsyncStorage.getItem('transactions');
        if (storedData) {
            let allTransactions = JSON.parse(storedData);
            const userTransactions = allTransactions[userName] || [];

            const updatedTransactions = userTransactions.filter((item: cardType) => item.title !== title);
            allTransactions[userName] = updatedTransactions;

            await AsyncStorage.setItem('transactions', JSON.stringify(allTransactions));
            setData(updatedTransactions);
            setReRender(!reRender);
        }
    };

    const renderItem = ({ item }: { item: cardType }) => {
        return (
            <View style={styles.items}>
                <View>
                    <Text style={styles.cont}>{item.title}</Text>
                    <Text style={styles.cont}>{item.amount}</Text>
                </View>
                <Pressable onPress={() => handleRemoveData(item.title)}>
                    <Text style={styles.removeCont}>Remove</Text>
                </Pressable>
            </View>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.homeContainer}>
                <Pressable onPress={handleLogout}>
                    <Text style={styles.logoutTxt}>Logout</Text>
                </Pressable>
            </View>
            <View style={{ flex: 1 }}>
                <View style={styles.adderCont}>
                    <TextInput
                        style={errors.title ? styles.errInput : styles.input}
                        placeholder="Title"
                        placeholderTextColor="#999"
                        value={values.title}
                        onChangeText={(text) => setFieldValue('title', text)}
                    />
                    <Text style={styles.errMsg}>{errors.title}</Text>
                    <TextInput
                        style={errors.amount ? styles.errInput : styles.input}
                        placeholder="Amount"
                        placeholderTextColor="#999"
                        value={values.amount}
                        onChangeText={(text) => setFieldValue('amount', text)}
                        keyboardType="numeric"
                    />
                    <Text style={styles.errMsg}>{errors.amount}</Text>
                    <View style={styles.addButtonCont}>
                        <Pressable style={styles.addDataBtn} onPress={() => formik.handleSubmit()}>
                            <Text style={styles.addBtnTxt}>Add</Text>
                        </Pressable>
                    </View>
                </View>
                <View style={styles.removerCont}>
                    <FlatList
                        data={data}
                        renderItem={renderItem}
                        keyExtractor={item => item.title}
                        onEndReachedThreshold={0.5}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    homeContainer: {
        paddingHorizontal: 20,
    },
    adderCont: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        flex: .3
    },
    removerCont: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        flex: .7
    },
    logoutTxt: {
        textAlign: 'right',
        fontSize: 18,
        color: '#000',
        fontWeight: 'bold',
    },
    errMsg: {
        color: 'red',
        paddingVertical: 4,
        textAlign: 'left',
    },
    errInput: {
        borderWidth: 1,
        borderColor: 'red',
        borderRadius: 8,
        padding: 10,
        color: '#000'
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        color: '#000'
    },
    addButtonCont: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    addDataBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4285F4',
        borderRadius: 10,
        width: 100
    },
    addBtnTxt: {
        color: '#fff',
        padding: 10,
    },
    items: {
        backgroundColor: '#4285F4',
        marginTop: 10,
        padding: 10,
        borderRadius: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    cont: {
        color: '#fff'
    },
    removeCont: {
        color: '#fff',
        fontWeight: 'bold'
    }
});