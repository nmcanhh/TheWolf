import React, {useState, useEffect} from 'react';
import {Text, ScrollView, ActivityIndicator} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {useRoute, useNavigation} from '@react-navigation/native';
import {DataStore, Auth} from 'aws-amplify';
import {Product, CartProduct} from '../../models';

import styles from './styles';
import QuantitySelector from '../../components/QuantitySelector';
import Button from '../../components/Button';
import ImageCarousel from '../../components/ImageCarousel';

const ProductScreen = () => {
    const [product, setProduct] = useState<Product | undefined>(undefined);

    const [selectedOption, setSelectedOption] = useState<string | undefined>(undefined);

    const [quantity, setQuantity] = useState(1);

    const navigation = useNavigation();
    const route = useRoute();

    useEffect(() => {
        if (!route.params?.id) {
            return;
        }
      DataStore.query(Product, route.params.id).then(setProduct);
    }, [route.params?.id]);

    useEffect(() => {
        if (product?.options) {
            setSelectedOption(product.options[0]);
        }
    }, [product])

    const onAddToCart = async () => {
        const userData = await Auth.currentAuthenticatedUser();

        if (!product || !userData) {
            return;
        }

        const newCardProduct = new CartProduct({
          userSub: userData.attributes.sub,
          quantity,
          option: selectedOption,
          productID: product.id,
        });

       await DataStore.save(newCardProduct);
       navigation.navigate('shoppingCart');
    };

    if (!product) {
        return <ActivityIndicator/>
    }

    return (
        <ScrollView style = {styles.root}>
            <Text style = {styles.title} >{product.title}</Text>

            {/* Image carousel */}
            <ImageCarousel images={product.images}/>
            {/* Option Selector  */}
            <Picker
                selectedValue = {selectedOption}
                onValueChange = {(itemValue) => setSelectedOption(itemValue)}>
                {product.options.map(option => (
                    <Picker.Item label={option} value={option}/>
                ))}
            </Picker>

            {/* Price  */}
            <Text style = {styles.price}>
                Gi??: {product.price.toLocaleString()}$
                 {product.oldPrice && (<Text style = {styles.oldPrice}> {product.oldPrice.toLocaleString()}$</Text>)}
                </Text>

            {/* Description  */}
            <Text style = {styles.description}>{product.description}</Text>

            {/* Quantity Selector  */}
            <QuantitySelector quantity = {quantity} setQuantity = {setQuantity}/>

            {/* Button  */}
            {/* <Button text={'Add to cart'} onPress={() => {}}/>        */}
            <Button
                text={'Th??m v??o gi??? h??ng'}
                onPress={onAddToCart}
                containerStyles={{
                    backgroundColor: '#FFBA00'}}
                    />
            <Button text={'Mua ngay'} containerStyles={{
                    backgroundColor: '#fc9807'}} onPress={() => {console.warn('Mua ngay')}}/>

            </ScrollView>
    );
};


export default ProductScreen;
