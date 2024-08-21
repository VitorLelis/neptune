import { StyleSheet, TextInput, Button, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { useDatabase } from '@/database/useDatabase';
import { useLocalSearchParams } from 'expo-router';

import stringToTime from '@/utils/stringToTime';

export default function AddSwimmersScreen() {
    const [stroke, setStroke] = useState('Freestyle');
    const [distance, setDistance] = useState('50');
    const [course, setCourse] = useState('SCM');
    const [time, setTime] = useState('');
    const [date, setDate] = useState('')

  const database = useDatabase()
  const params = useLocalSearchParams<{id :string}>();

  async function handleAddTime(){
    try {
        if (isNaN(Number(distance))){
            return Alert.alert("Distance", "It must be a Number!")
        }
        if (!time.match(/^([0-5]?\d\:)?([0-5]\d\.\d{2})$/)){
            return Alert.alert("Time", "Not a valid time!")
        }
        if (!date.match(/^\d{4}\-(0[1-9]|1[0-2])\-(0[1-9]|[12][0-9]|3[01])$/)){
            return Alert.alert("Date", "Not a valid date!")
        }
        const response = await database.getEvent({distance: Number(distance),stroke,course})
        
        if(!response){
            const eventId = await database.addEvent({distance: Number(distance),stroke,course})
            await database.addTime({
              swimmer_id: Number(params.id),
              event_id: Number(eventId.insertedRowId), 
              time: stringToTime(time),
              date})
        } else{
            await database.addTime({
              swimmer_id: Number(params.id),
              event_id: Number(response), 
              time: stringToTime(time),
              date})
        }

        Alert.alert("Time added!")
    } catch (error) {
        console.log(error)
    }
    
  }

  return (
    <View style={styles.container}>

      <TextInput
        style={styles.input}
        value={distance}
        onChangeText={setDistance}
        placeholder="Distance"
        placeholderTextColor="gray"  // To change placeholder text color
        keyboardType="numeric"  // Ensure numeric keyboard for year input
      />

      <Text>Stroke</Text>
      <Picker
        selectedValue={stroke}
        style={styles.picker}
        onValueChange={(itemValue) => setStroke(itemValue)}
      >
        <Picker.Item label="Freestyle" value="Freestyle" />
        <Picker.Item label="Backstroke" value="Backstroke" />
        <Picker.Item label="Breaststroke" value="Breaststroke" />
        <Picker.Item label="Butterfly" value="Butterfly" />
      </Picker>

      <Text>Course</Text>
      <Picker
        selectedValue={course}
        style={styles.picker}
        onValueChange={(itemValue) => setCourse(itemValue)}
      >
        <Picker.Item label="SCY" value="SCY" />
        <Picker.Item label="SCM" value="SCM" />
        <Picker.Item label="LCM" value="LCM" />
      </Picker>

      <TextInput
        style={styles.input}
        value={time}
        onChangeText={setTime}
        placeholder="Enter time (MIN:SEC.HH or SEC.HH)"
      />

      <TextInput
        style={styles.input}
        value={date}
        onChangeText={setDate}
        placeholder="Enter date (YYYY-MM-DD)"
      />

    <Button title="Save" onPress={handleAddTime} />

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
