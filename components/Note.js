import React, { Component } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity  } from 'react-native';
import * as SecureStore from 'expo-secure-store';

class Note extends Component {
    constructor(props) {
        super(props)
    }

    editNote = () => {
        this.props.navigation.navigate("Edit note", { header: this.props.header, content: this.props.content, category: this.props.category, color: this.props.color })
    }

    deleteConfirm = () => {
        Alert.alert(
            "Delete?",
            "Are you sure?",
            [
                {
                    text: "Yes",
                    onPress: async () => {
                        //await SecureStore.deleteItemAsync(this.props.header)
                        let myNotes = await SecureStore.getItemAsync("myNotes")
                        if (myNotes == null) {
                            return
                        }
                        myNotes = JSON.parse(myNotes)

                        for (let i = 0; i < myNotes.notes.length; i++) {
                            let note = JSON.parse(myNotes.notes[i])
                            if (note != null) {
                                if (note.header == this.props.header) {
                                    myNotes.notes.splice(i, 1)
                                    await SecureStore.setItemAsync("myNotes", JSON.stringify({ notes: myNotes.notes}))
                                    return
                                }
                            }
                        }
                    },
                },
                {
                    text: "No",
                },
            ]
        );
    }

    render() {
        const styles = StyleSheet.create({
            box: {
                backgroundColor: this.props.color,
                borderRadius: 10,
                padding: 10,
                margin: 10,
                width: 175,
                maxHeight: 175
            },
            horizontalBox: {
                display: "flex",
                flexDirection: "row",
                alignItems: "center"            
            },
            category: {
                padding: 5,
                margin: 5,
                marginRight: "auto",
                color: 'white',
                alignSelf: 'flex-start',
                backgroundColor: '#333333',
                color: this.props.color,
                borderRadius: 5
            },
            date: {
                margin: 5,
                color: 'white'
            },
            header: {
                color: 'white',
                fontSize: 25,
                marginBottom: 10
            },
            content: {
                color: 'white'
            }
        });
        
        return (
            <TouchableOpacity 
                onLongPress={() => this.deleteConfirm()}
                onPress={() => this.editNote()}>
                <View style={styles.box}>
                    <View style={styles.horizontalBox}>
                        <Text style={styles.category}>{this.props.category}</Text>
                        <Text style={styles.date}>{this.props.date}</Text>
                    </View>
                    <Text style={styles.header}>{this.props.header}</Text>
                    <Text style={styles.content}>{this.props.content}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

export default Note;
