import React, {useState, useEffect} from 'react';
import {View, StyleSheet, FlatList } from 'react-native';
import ProductItem from '../../components/ProductItem';
import {DataStore} from 'aws-amplify';
import {Product} from '../../models';

const HomeScreen = ({searchValue}: {searchValue: string}) => {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        DataStore.query(Product).then(setProducts);
    }, []);

    return (
        <View style = {styles.page}>
            {/**Render Product Component */}
            <FlatList
            data={products}
            renderItem = {({item}) => <ProductItem item = {item} /> }
            showsVerticalScrollIndicator = {false} // ẩn thanh kéo bên phải
            />
        </View>
    );
};
const styles = StyleSheet.create({
    page: {
        flex: 1,
        padding: 10
    },
});

export default HomeScreen;
