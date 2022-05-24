import React, { Component } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as SecureStore from 'expo-secure-store';


class EditNote extends Component {
    constructor(props) {
        super(props);
        this.state = {
            header: this.props.route.params.header,
            content: this.props.route.params.content,
            category: this.props.route.params.category
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
    }

    editNote = async () => {
        if (this.isEmptyOrWhiteSpace(this.state.header) || this.isEmptyOrWhiteSpace(this.state.content)){
            console.log("Your note is empty!")
            return
        }

        // date update
        const monthNames = ["JAN", "FEBR", "MAR", "APR", "MAY", "JUNE",
        "JULY", "AUG", "SEPT", "OCT", "NOV", "DEC"
        ];
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0')
        var mm = monthNames[today.getMonth()]

        let myNotes = await SecureStore.getItemAsync("myNotes")
        if (myNotes == null) { 
            throw Error("My notes can't be null here.")
        }
        else {
            myNotes = JSON.parse(myNotes)
            var note
            for (let i = 0; i < myNotes.notes.length; i++) {
                note = myNotes.notes[i]
                note = JSON.parse(note)
                if (note != null) {
                    if (note.header == this.props.route.params.header) {
                        myNotes.notes.splice(i, 1)
                        await SecureStore.setItemAsync("myNotes", JSON.stringify({ notes: [...myNotes.notes, JSON.stringify({ header: this.state.header, content: this.state.content, category: this.state.category, color: this.props.route.params.color, date: (dd + " " + mm) })]}))
                        this.props.navigation.navigate("Your notes")
                        return
                    }
                }
            }
        }
        this.props.navigation.navigate("Your notes")
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
                    value={this.state.header}
                    onChangeText={(value) => this.setState({ header: value })}
                />
                <TextInput
                    ref={input => { this.contentInput = input }}
                    style={styles.input}
                    underlineColorAndroid="#aaaaaa"
                    multiline={true}
                    value={this.state.content}
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
                    onPress={() => this.editNote()}
                    style={styles.button}>
                    <Text style={styles.edit}>Save</Text>
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
    edit: {
        color: "white",
        fontSize: 20
    }
});

export default EditNote;


