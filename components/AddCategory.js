import React, { Component } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';


class AddCategory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            category: ""
        }
    }

    async addCategory(){
        if (this.isEmptyOrWhiteSpace(this.state.category)){
            console.log("Your note is empty!")
            return
        }

        //await SecureStore.deleteItemAsync("myCategories") // clear SecureStore
        let myCategories = await SecureStore.getItemAsync("myCategories")
        if (myCategories == null) { //adds first category
            await SecureStore.setItemAsync("myCategories", JSON.stringify({ categories: [this.state.category] }));
        }
        else {
            myCategories = JSON.parse(myCategories)
            await SecureStore.setItemAsync("myCategories",  JSON.stringify({ categories: [...myCategories.categories, this.state.category] }));
        }

        // clears input
        this.setState({
            category: ""
        })
        this.categoryInput.clear()
    }

    isEmptyOrWhiteSpace(str){
        return str === null || str.match(/^ *$/) !== null
    }

    render() {
        return (
            <View style={styles.box}>
                <TextInput
                    ref={input => { this.categoryInput = input }}
                    style={styles.input}
                    underlineColorAndroid="#aaaaaa"
                    placeholder="Category"
                    onChangeText={(value) => this.setState({ category: value })}
                />
                <TouchableOpacity
                    onPress={() => this.addCategory()}
                    style={styles.button}>
                    <Text style={styles.add}>Add category</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    box: {
        padding: 20, 
        alignItems: "center"
    },
    input: {
        width: 320,
        fontSize: 20,
        marginTop: 10,
        paddingBottom: 20,
        padding: 10
    },
    button: {
        margin: 20,
        padding: 10,
        borderRadius: 10,
        width: 180,
        alignItems: "center",
        backgroundColor: "#2255aa"
    },
    add: {
        color: "white",
        fontSize: 20
    }
});

export default AddCategory;


