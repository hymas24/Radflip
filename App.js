
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [itemName, setItemName] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [flips, setFlips] = useState([]);

  useEffect(() => {
    loadFlips();
  }, []);

  const loadFlips = async () => {
    const data = await AsyncStorage.getItem('flips');
    if (data) setFlips(JSON.parse(data));
  };

  const saveFlips = async (data) => {
    await AsyncStorage.setItem('flips', JSON.stringify(data));
  };

  const addFlip = () => {
    if (!itemName || !buyPrice || !sellPrice) return;
    const profit = parseFloat(sellPrice) - parseFloat(buyPrice);
    const newFlip = { itemName, buyPrice, sellPrice, profit };
    const updatedFlips = [newFlip, ...flips];
    setFlips(updatedFlips);
    saveFlips(updatedFlips);
    setItemName('');
    setBuyPrice('');
    setSellPrice('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>RadFlip</Text>
      <TextInput
        style={styles.input}
        placeholder="Item Name"
        value={itemName}
        onChangeText={setItemName}
      />
      <TextInput
        style={styles.input}
        placeholder="Buy Price"
        keyboardType="numeric"
        value={buyPrice}
        onChangeText={setBuyPrice}
      />
      <TextInput
        style={styles.input}
        placeholder="Sell Price"
        keyboardType="numeric"
        value={sellPrice}
        onChangeText={setSellPrice}
      />
      <Button title="Add Flip" onPress={addFlip} />
      <FlatList
        data={flips}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <Text style={styles.flipItem}>
            {item.itemName} — Buy: £{item.buyPrice}, Sell: £{item.sellPrice}, Profit: £{item.profit}
          </Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    marginTop: 50,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    padding: 10,
    fontSize: 16,
  },
  flipItem: {
    padding: 8,
    fontSize: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
});