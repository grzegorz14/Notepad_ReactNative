import React, { Component } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet } from 'react-native';
import Note from "./Note";
import * as SecureStore from 'expo-secure-store';


class Main extends Component {
    constructor(props) {
        super(props);

        this.focusFunction = null
        this.state = {
            notes: [],
            search: ""
        }
    }

    componentDidMount = () => {
        this.focusFunction = this.props.navigation.addListener('focus', async () => {
            await this.getNotes()
        });

        this.getNotes()
    }

    componentWillUnmount = () => {
        this.focusFunction()
    }

    getNotes = async () => {
        //await SecureStore.deleteItemAsync("myNotes") // clear SecureStore
        let myNotes = await SecureStore.getItemAsync("myNotes")
        if (myNotes == null) {
            return
        }
        myNotes = JSON.parse(myNotes)

        let notesUpdate = []
        var note

        for (let i = 0; i < myNotes.notes.length; i++) {
            note = myNotes.notes[i]
            if (note != null) {
                note = JSON.parse(note)
                notesUpdate.push({ id: i, header: note.header, content: note.content, category: note.category, date: note.date, color: note.color })
            }
        }

        this.setState({
            notes: notesUpdate
        })
    }

    render() {
        //this.getNotes()
        return (
            <View>
                <TextInput
                    ref={input => { this.headerInput = input }}
                    style={styles.search}
                    placeholder="Search"
                    multiline={true}
                    onChangeText={(value) =>  {
                        this.setState({ search: value.trim().toLowerCase() })
                        this.getNotes()
                    }}/>
                <FlatList
                    numColumns={2}
                    data={this.state.notes.filter(note => note.header.toLowerCase().includes(this.state.search) || note.content.toLowerCase().includes(this.state.search) || note.category.toLowerCase().includes(this.state.search))}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => <Note navigation={this.props.navigation} header={item.header} content={item.content} category={item.category} date={item.date} color={item.color} />}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    box: {
        padding: 20, 
        alignItems: "center"
    },
    search: {
        width: 340,
        fontSize: 20,
        padding: 10,
        margin: 10,
        marginLeft: "auto",
        marginRight: "auto",
        borderRadius: 10,
        borderColor: "#222222",
        borderWidth: 2
    }
});

export default Main;


