import * as React from 'react';
import { Image, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
    createDrawerNavigator,
    DrawerContentScrollView,
    DrawerItemList,
    DrawerItem
} from '@react-navigation/drawer';
  
import Main from './components/Main';
import AddNote from './components/AddNote';
import AddCategory from './components/AddCategory';
import EditNote from './components/EditNote';

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
        <Drawer.Screen name="Your notes" component={Main} 
            options={{
              title: 'Your notes',
              drawerIcon: () => ( <Image style={styles.icon} source={require("./assets/notes.png")}/> ),
        }}/>
        <Drawer.Screen name="Add note" component={AddNote} 
            options={{
              title: 'Add note',
              drawerIcon: () => ( <Image style={styles.icon} source={require("./assets/add.png")}/> ),
        }}/>
        <Drawer.Screen name="Add category" component={AddCategory} 
            options={{
              title: 'Add category',
              drawerIcon: () => ( <Image style={styles.icon} source={require("./assets/addCategory.png")}/> ),
        }}/>
        <Drawer.Screen name="Edit note" component={EditNote} 
            options={{
              title: 'Edit note',
              drawerItemStyle: { display: "none" },
        }}/>
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>

      <Image style={styles.mainIcon} source={require("./assets/pencil.png")}/>

      <DrawerItemList {...props}/>

      <DrawerItem
        label="Info"
        icon={() => <Image style={styles.icon} source={require("./assets/info.png")}/>}
        onPress={() => alert("Notepad (version 2.0.0) - created by Grzegorz Szewczyk")}
      />

    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 45,
    height: 45,
    borderRadius: 50,
    borderWidth: 1
  },
  mainIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    alignSelf: "center",
    margin: 60
  }
});