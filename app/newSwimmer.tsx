import { StyleSheet, TextInput, Button, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { useDatabase } from '@/database/useDatabase';

export default function NewSwimmersScreen() {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [year_of_birth, setYear] = useState('');

  const database = useDatabase()

  async function handleCreate(){
    try {
        if (isNaN(Number(year_of_birth))){
            return Alert.alert("Year of Birth", "It must be a Number!")
        }
        const response = await database.createSwimmer({name,gender,
            year_of_birth : Number(year_of_birth)})

        Alert.alert("Swimmer created!")
    } catch (error) {
        console.log(error)
    }
    
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Name"
        placeholderTextColor="gray"  // To change placeholder text color
      />

      <Picker
        style={styles.picker}
        selectedValue={gender}
        onValueChange={(itemValue) => setGender(itemValue)}
      >
        <Picker.Item label="Select Gender" value="" />
        <Picker.Item label="Male" value="M" />
        <Picker.Item label="Female" value="F" />
      </Picker>

      <TextInput
        style={styles.input}
        value={year_of_birth}
        onChangeText={setYear}
        placeholder="Year of Birth"
        placeholderTextColor="gray"  // To change placeholder text color
        keyboardType="numeric"  // Ensure numeric keyboard for year input
      />

    <Button title="Save" onPress={handleCreate} />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20, // Added padding for better layout
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  picker: {
    height: 50,
    width: '100%', // Full width for picker
    marginBottom: 20,
    borderColor: 'gray',
    borderWidth: 1,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    width: '100%',
    marginVertical: 10, // Slightly smaller margin for tighter spacing
  },
});

