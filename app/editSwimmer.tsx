import { StyleSheet, TextInput, Button, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import { Swimmer, useDatabase } from '@/database/useDatabase';
import { useLocalSearchParams } from 'expo-router';

export default function EditSwimmerScreen() {
  const { id: defaultId, name: defaultName, gender: defaultGender, year_of_birth: defaultYear } = useLocalSearchParams() as {
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
      console.log(error);
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Name"
        placeholderTextColor="gray"
      />

      <Picker
        style={styles.picker}
        selectedValue={gender}
        onValueChange={(itemValue) => setGender(itemValue)}
      >
        <Picker.Item label="Male" value="M" />
        <Picker.Item label="Female" value="F" />
      </Picker>

      <TextInput
        style={styles.input}
        value={year_of_birth}
        onChangeText={setYear}
        placeholder="Year of Birth"
        placeholderTextColor="gray"
        keyboardType="numeric"
      />

      <Button title="Save" onPress={handleUpdate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  picker: {
    height: 50,
    width: '100%',
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
    marginVertical: 10,
  },
});
