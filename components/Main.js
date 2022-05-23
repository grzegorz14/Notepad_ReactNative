import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import Note from "./Note";
import * as SecureStore from 'expo-secure-store';


class Main extends Component {
    constructor(props) {
        super(props);

        this.focusFunction = null
        this.state = {
            notes: []
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
        return (
            <FlatList
                numColumns={2}
                data={this.state.notes}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => <Note navigation={this.props.navigation} header={item.header} content={item.content} category={item.category} date={item.date} color={item.color} />}
            />
        );
    }
}

export default Main;


