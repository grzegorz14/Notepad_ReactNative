import React, { Component } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as SecureStore from 'expo-secure-store';


class AddNote extends Component {
    constructor(props) {
        super(props);
        this.state = {
            header: "",
            content: "",
            category: ""
        }
        this.categories = []
        this.focusFunction = null
    }

    componentDidMount = () => {
        this.focusFunction = this.props.navigation.addListener('focus', async () => {
            await this.getCategories()
        });

        this.getCategories()
    }

    componentWillUnmount = () => {
        this.focusFunction()
    }

    getCategories = async () => {
        let myCategories = await SecureStore.getItemAsync("myCategories")
        if (myCategories == null) {
            return
        }
        myCategories = JSON.parse(myCategories)

        this.categories = []
        for (let i = 0; i < myCategories.categories.length; i++) {
            this.categories.push(myCategories.categories[i])
        }

        if (this.categories.indexOf(this.state.category) == -1) {
            this.setState({
                category: myCategories.categories[0]
            })
        }
    }

    async addNote(){
        if (this.isEmptyOrWhiteSpace(this.state.header) || this.isEmptyOrWhiteSpace(this.state.content)){
            console.log("Your note is empty!")
            return
        }

        // adds note
        const monthNames = ["JAN", "FEBR", "MAR", "APR", "MAY", "JUNE",
        "JULY", "AUG", "SEPT", "OCT", "NOV", "DEC"
        ];
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0')
        var mm = monthNames[today.getMonth()]

        let myNotes = await SecureStore.getItemAsync("myNotes")
        if (myNotes == null) { //adds first note
            await SecureStore.setItemAsync("myNotes", JSON.stringify({ notes: [JSON.stringify({ header: this.state.header, content: this.state.content, category: this.state.category, color: ('#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0')), date: (dd + " " + mm) })] }));
        }
        else {
            myNotes = JSON.parse(myNotes)
            await SecureStore.setItemAsync("myNotes",  JSON.stringify({ notes: [...myNotes.notes, JSON.stringify({ header: this.state.header, content: this.state.content, category: this.state.category, color: ('#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0')), date: (dd + " " + mm) })] }));
        }

        // clears inputs 
        this.setState({
            header: "",
            content: ""
        })
        this.headerInput.clear()
        this.contentInput.clear()
    }

    isEmptyOrWhiteSpace(str){
        return str === null || str.match(/^ *$/) !== null
    }

    render() { 
        return (
            <View style={styles.box}>
                <TextInput
                    ref={input => { this.headerInput = input }}
                    style={styles.input}
                    underlineColorAndroid="#aaaaaa"
                    placeholder="Header"
                    onChangeText={(value) => this.setState({ header: value })}
                />
                <TextInput
                    ref={input => { this.contentInput = input }}
                    style={styles.input}
                    underlineColorAndroid="#aaaaaa"
                    placeholder="Content"
                    multiline={true}
                    onChangeText={(value) => this.setState({ content: value })}
                />
                <Picker
                    style={styles.picker}
                    selectedValue={this.state.category}
                    onValueChange={(value) => this.setState({ category: value })}>
                        {this.categories.map((category, i) => {
                            return (<Picker.Item key={"category_" + i } style={styles.pickerItem} label={category} value={category} />)
                        })}
                </Picker>
                <TouchableOpacity
                    onPress={() => this.addNote()}
                    style={styles.button}>
                    <Text style={styles.add}>Add note</Text>
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
        width: 130,
        alignItems: "center",
        backgroundColor: "green"
    },
    picker: {
        height: 100,
        width: 250
    },
    pickerItem: {
        fontSize: 20,
    },
    add: {
        color: "white",
        fontSize: 20
    }
});

export default AddNote;


