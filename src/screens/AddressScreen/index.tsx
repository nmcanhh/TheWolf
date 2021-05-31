import React, { useState } from 'react';
import { View, Text, TextInput, Alert, ScrollView, KeyboardAvoidingView, Platform,  } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import countryList from 'country-list';
import {Auth, DataStore} from 'aws-amplify';
import {useNavigation, useRoute} from '@react-navigation/native';
import Button from '../../components/Button';
import styles from './styles';
import {Order, OrderProduct, CartProduct} from '../../models';

const countries = countryList.getData();

const AddressScreen = () => {
    const [country, setCountry] = useState(countries[0].code);
    const [fullname, setFullname] = useState('');
    const [phone, setPhone] = useState('');

    const [address, setAddress] = useState('');
    const [addressError, setAddressError] = useState('');

    const [city, setCity] = useState('');

    const navigation = useNavigation();

    const saveOrder = async () => {
        // get user details
        const userData = await Auth.currentAuthenticatedUser();
        // create anew order
        const newOrder = await DataStore.save(
            new Order({
                userSub: userData.attributes.sub,
                fullName: fullname, 
                phoneNumber: phone,
                country,
                city,
                address,
            }),
        );
        // fetch all cart items
        const cartItems = await DataStore.query(CartProduct, cp =>
            cp.userSub('eq', userData.attributes.sub),
        );
        // attack all cart items to the order
        await Promise.all(
            cartItems.map(cartItem =>
              DataStore.save(
                new OrderProduct({
                  quantity: cartItem.quantity,
                  option: cartItem.option,
                  productID: cartItem.productID,
                  orderID: newOrder.id,
                }),
              ),
            ),
          );
        // deleta all cart items
        await Promise.all(cartItems.map(cartItem => DataStore.delete(cartItem)));
        // redirect home
        navigation.navigate('home');
    };

    const onCheckout = () => {
        if (!!addressError) {
            Alert.alert('Fix all field errors before submiting');
            return;
        }

        if (!fullname) {
            Alert.alert('Please fill in the fullname field');
            return;
        }

        if (!phone) {
            Alert.alert('Please fill in the phone number field');
            return;
        }

        console.warn('Success. Checkout!');
        saveOrder();
    };

    const validateAddress = () => {
        if (address.length < 3) {
            setAddressError('Address is too short');
        }

        if (address.length > 10) {
            setAddressError('Address is too long');
        }
    };

    return (
        <KeyboardAvoidingView
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS == 'ios' ? 10 : 0}
        >
            <ScrollView style={styles.root}>
                <View style={styles.row}>
                    <Picker
                        selectedValue={country} onValueChange={setCountry}>
                        {countries.map(country => (
                            <Picker.Item value={country.code} label={country.name} />
                        ))}
                    </Picker>
                </View>
                {/* Full name */}
                <View style={styles.row}>
                    <Text style={styles.label}>Tên (*)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập tên"
                        value={fullname}
                        onChangeText={setFullname}
                    />
                </View>

                {/* Phone number */}
                <View style={styles.row}>
                    <Text style={styles.label}>Số điện thoại (*)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập số điện thoại"
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType={'phone-pad'} />
                </View>

                {/* Address*/}
                <View style={styles.row}>
                    <Text style={styles.label}>Địa chỉ (*)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập địa chỉ"
                        value={address}
                        onEndEditing={validateAddress}
                        onChangeText={text => {
                            setAddress(text);
                            setAddressError('');
                        }}
                    />
                    {!!addressError && (
                        <Text style={styles.errorLabel}>{addressError}</Text>
                    )}
                </View>

                {/* City*/}
                <View style={styles.row}>
                    <Text style={styles.label}>Tỉnh/thành phố (*)</Text>
                    <TextInput style={styles.input} placeholder="Nhập tỉnh/thành phố" value={city} onChangeText={setCity} />
                </View>
                <Button text='Đặt hàng' onPress={onCheckout} />
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default AddressScreen;
