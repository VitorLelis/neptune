import { StyleSheet, TextInput, Alert, TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useState } from 'react';
import RNPickerSelect from 'react-native-picker-select'
import { useDatabase } from '@/database/useDatabase';
import { defaultBlue, defaultDark, defaultLight, pickerText } from '@/constants/Colors';

export default function AddSwimmersScreen() {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('M');
  const [year_of_birth, setYear] = useState('');

  const database = useDatabase()

  async function handleCreate(){
    try {
        if (isNaN(Number(year_of_birth))){
            return Alert.alert("Year of Birth", "It must be a Number!")
        }
        await database.createSwimmer({name,gender,year_of_birth : Number(year_of_birth)})
        Alert.alert("Swimmer created!")
    } catch (error) {
        console.log(error)
    }
    
  }

  return (
    <View style={styles.container}>
      <View style={styles.card} lightColor={defaultLight} darkColor={defaultDark}>
      <Text style={styles.label}>NAME</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter name"
        placeholderTextColor={pickerText}
      />

      <Text style={styles.label}>GENDER</Text>
      <RNPickerSelect
        onValueChange={(value) => setGender(value)}
        items={[
          { label: 'Male', value: 'M' },
          { label: 'Female', value: 'F' },
        ]}
        style={pickerSelectStyles}
        value={gender}
      />

      <Text style={styles.label}>YEAR OF BIRTH</Text>
      <TextInput
        style={styles.input}
        value={year_of_birth}
        onChangeText={setYear}
        placeholder=" Enter Year of Birth"
        placeholderTextColor={pickerText}
        keyboardType="numeric" 
      />

      <TouchableOpacity style={styles.roundButton} onPress={handleCreate}>
        <Text style={styles.buttonText}>SAVE</Text>
      </TouchableOpacity>
      </View>
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
  input: {
    height: 40,
    borderColor: pickerText,
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 8,
    marginBottom: 16,
    width: '100%',
    color: pickerText
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  card: {
    width: '100%',
    padding: 20,
    borderRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  roundButton: {
    borderRadius: 10, // Adjust this value for more or less rounding
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: defaultBlue, // You can change this to your desired color
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: defaultLight, // Text color
    fontSize: 16,
    fontWeight: 'bold',
  },
});
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: pickerText,
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: pickerText,
    borderRadius: 8,
    color: pickerText,
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});