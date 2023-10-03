import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,TextInput, Button,FlatList} from 'react-native';
import React, {useState,useEffect} from 'react';
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getDatabase, push, ref, onValue,remove } from 'firebase/database';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD79LZtyG6K6epmEGrPXAPmB4IyWuVIUgY",
  authDomain: "shoppinglist-f974c.firebaseapp.com",
  projectId: "shoppinglist-f974c",
  storageBucket: "shoppinglist-f974c.appspot.com",
  messagingSenderId: "594109911851",
  appId: "1:594109911851:web:6d2a956c043c176185ab6e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database=getDatabase(app);

export default function App() {
  const [product, setProduct] = useState({
    title: '',
    amount: ''
    });
    const [items, setItems] = useState([]);

    const SaveItem=()=>{
      push(ref(database,'items/'),product);
      setProduct({title:'',amount:''})
    };

    useEffect(() => {
      const itemsRef = ref(database, 'items/');
      onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      const itemsArray = [];
      for(let id in data) {
        itemsArray.push({ id, ...data[id] });
      }
    setItems(itemsArray);
      })
      }, []);
      
      const deleteItem = (itemId) => {
        const itemRef = ref(database, 'items/' + itemId);
        remove(itemRef);
      };
      
  return (
    <View style={styles.container}>
      <Text style={styles.headers}>Shopping List</Text>
      <View style={styles.inputs}>
        <TextInput 
        style={styles.input}
        placeholder='Title'
        value={product.title}
        onChangeText={(text)=>setProduct((prevProduct)=>({...prevProduct,title:text}))}/>

         <TextInput 
         placeholder='Amount'
          style={styles.input}
          value={product.amount}
         onChangeText={(text)=>setProduct((prevProduct)=>({...prevProduct,amount:text}))}/>
      </View>
      <View>
        <Button title='Add Product' onPress={SaveItem} color='#FCA311'/>
      </View>
      <FlatList 
        data={items}
        keyExtractor={item => item.id}
        renderItem={({ item }) =>
          <View style={styles.itemlist}>
            <Text style={styles.listrow}>{item.title}, {item.amount}</Text>
            <Text style={styles.deletebutton} onPress={() => deleteItem(item.id)}>  Delete</Text>
          </View>}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputs:{
    width:200,
    height:150,
    justifyContent:'space-between',
    paddingTop:20
  },
  input:{
    borderColor:'black',
    borderWidth:1,
    height:60
  },
  itemlist:{
    flexDirection:'row',
  },
  listrow:{
    fontStyle:'italic',
    fontSize:18
  },
  headers:{
    paddingTop:30,
    fontSize:35
  },
  deletebutton:{
    color:'#0356fc',
    fontSize:18
  }
});
