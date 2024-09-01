import { StyleSheet, TextInput, Button, Alert, Platform } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { useDatabase } from '@/database/useDatabase';
import { useLocalSearchParams } from 'expo-router';

import stringToTime from '@/utils/stringToTime';
import eventExist from '@/utils/eventExist';
import RNDateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

export default function AddSwimmersScreen() {
    const [stroke, setStroke] = useState('Freestyle');
    const [distance, setDistance] = useState('50');
    const [course, setCourse] = useState('SCM');
    const [time, setTime] = useState('');
    const [date, setDate] = useState<Date>(new Date())
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [formattedDate, setFormattedDate] = useState('')

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
        if (!eventExist(Number(distance), stroke, course)){
          return Alert.alert("Invalid event", "Please select a valid event")
        }

        const response = await database.getEvent({distance: Number(distance),stroke,course})
        
        if(!response){
            const eventId = await database.addEvent({distance: Number(distance),stroke,course})
            await database.addTime({
              swimmer_id: Number(params.id),
              event_id: Number(eventId.insertedRowId), 
              time: stringToTime(time),
              date: formattedDate
            })
        } else{
            await database.addTime({
              swimmer_id: Number(params.id),
              event_id: Number(response), 
              time: stringToTime(time),
              date: formattedDate
            })
        }

        Alert.alert("Time added!")
    } catch (error) {
        console.log(error)
    }
    
  }

  const showDatePickerHandler = () => {
    setShowDatePicker(true);
  }

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
        setDate(selectedDate);
        setFormattedDate(date.toISOString().split('T')[0])
    }
  }

  return (
    <View style={styles.container}>

      <Text>Distance</Text>
      <Picker
        selectedValue={distance}
        style={styles.picker}
        onValueChange={(itemValue) => setDistance(itemValue)}
      >
        <Picker.Item label="50" value="50" />
        <Picker.Item label="100" value="100" />
        <Picker.Item label="200" value="200" />
        <Picker.Item label="400" value="400" />
        <Picker.Item label="800" value="800" />
        <Picker.Item label="1500" value="1500" />
      </Picker>

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
        <Picker.Item label="Individual Medley" value="Individual Medley" />
      </Picker>

      <Text>Course</Text>
      <Picker
        selectedValue={course}
        style={styles.picker}
        onValueChange={(itemValue) => setCourse(itemValue)}
      >
        <Picker.Item label="SCM" value="SCM" />
        <Picker.Item label="LCM" value="LCM" />
      </Picker>

      <TextInput
        style={styles.input}
        value={time}
        onChangeText={setTime}
        placeholder="Enter time (MIN:SEC.HH or SEC.HH)"
      />

      <Text>Date</Text>
      <Button title="Select Date" onPress={showDatePickerHandler} />
      <Text>Selected Date: {formattedDate}</Text>

      {showDatePicker && (
        <RNDateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

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
