import { StyleSheet, TextInput, Alert, TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';
import React, { useState, useEffect } from 'react';
import RNPickerSelect from 'react-native-picker-select';
import { useDatabase } from '@/database/useDatabase';
import { useLocalSearchParams } from 'expo-router';
import {
  defaultLight,
  defaultDark,
  pickerText,
  defaultBlue,
} from '@/constants/Colors';

export default function EditSwimmerScreen() {
  const {
    id: defaultId,
    name: defaultName,
    gender: defaultGender,
    year_of_birth: defaultYear,
  } = useLocalSearchParams() as {
    id?: string;
    name?: string;
    gender?: string;
    year_of_birth?: string;
  };

  const [name, setName] = useState('');
  const [gender, setGender] = useState('M');
  const [year_of_birth, setYear] = useState('');

  const database = useDatabase();

  // Set the initial state with the search parameters
  useEffect(() => {
    setName(defaultName || '');
    setGender(defaultGender || 'M');
    setYear(defaultYear || '');
  }, [defaultName, defaultGender, defaultYear]);

  async function handleUpdate() {
    try {
      if (isNaN(Number(year_of_birth))) {
        return Alert.alert('Year of Birth', 'It must be a Number!');
      }
      await database.updateSwimmer({
        id: Number(defaultId),
        name,
        gender,
        year_of_birth: Number(year_of_birth),
      });

      Alert.alert('Swimmer updated!');
    } catch (error) {
      Alert.alert('Error', String(error));
    }
  }

  return (
    <View style={styles.container}>
      <View
        style={styles.card}
        lightColor={defaultLight}
        darkColor={defaultDark}
      >
        <Text style={styles.label}>NAME</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder='Enter name'
          placeholderTextColor={pickerText}
        />

        <Text style={styles.label}>GENDER</Text>
        <RNPickerSelect
          onValueChange={value => setGender(value)}
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
          placeholder=' Enter Year of Birth'
          placeholderTextColor={pickerText}
          keyboardType='numeric'
        />

        <TouchableOpacity style={styles.roundButton} onPress={handleUpdate}>
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
    justifyContent: 'center',
  },
  input: {
    height: 40,
    borderColor: pickerText,
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 8,
    marginBottom: 16,
    width: '100%',
    color: pickerText,
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
