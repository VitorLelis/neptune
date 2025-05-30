import {
  StyleSheet,
  TextInput,
  Alert,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Text, View } from '@/components/Themed';
import React, { useState } from 'react';
import RNPickerSelect from 'react-native-picker-select';
import { useDatabase } from '@/database/useDatabase';
import { useLocalSearchParams } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome6';

import stringToTime from '@/utils/stringToTime';
import eventExist from '@/utils/eventExist';
import RNDateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import {
  defaultBlue,
  defaultDark,
  defaultLight,
  pickerText,
} from '@/constants/Colors';

export default function AddSwimmersScreen() {
  const [stroke, setStroke] = useState('Freestyle');
  const [distance, setDistance] = useState('50');
  const [course, setCourse] = useState('SCM');
  const [time, setTime] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [formattedDate, setFormattedDate] = useState('');

  const database = useDatabase();
  const params = useLocalSearchParams<{ id: string }>();

  async function handleAddTime() {
    try {
      if (isNaN(Number(distance))) {
        return Alert.alert('Distance', 'It must be a Number!');
      }
      if (!time.match(/^([0-5]?\d\:)?([0-5]\d\.\d{2})$/)) {
        return Alert.alert('Time', 'Not a valid time!');
      }
      if (!eventExist(Number(distance), stroke, course)) {
        return Alert.alert('Invalid event', 'Please select a valid event');
      }

      const response = await database.getEvent({
        distance: Number(distance),
        stroke,
        course,
      });

      const eventId =
        response ||
        (
          await database.addEvent({
            distance: Number(distance),
            stroke,
            course,
          })
        ).insertedRowId;

      await database.addTime({
        swimmer_id: Number(params.id),
        event_id: Number(eventId),
        time: stringToTime(time),
        date: formattedDate,
      });

      Alert.alert('Time added!');
    } catch (error) {
      Alert.alert('Error', String(error));
    }
  }

  const showDatePickerHandler = () => {
    setShowDatePicker(true);
  };

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
      const newFormatted = selectedDate.toISOString().split('T')[0];
      setFormattedDate(newFormatted);
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={styles.card}
        lightColor={defaultLight}
        darkColor={defaultDark}
      >
        <Text style={styles.label}>DISTANCE</Text>
        <RNPickerSelect
          onValueChange={value => setDistance(value)}
          items={[
            { label: '50', value: '50' },
            { label: '100', value: '100' },
            { label: '200', value: '200' },
            { label: '400', value: '400' },
            { label: '800', value: '800' },
            { label: '1500', value: '1500' },
          ]}
          value={distance}
          style={pickerSelectStyles}
        />

        <Text style={styles.label}>STROKE</Text>
        <RNPickerSelect
          onValueChange={value => setStroke(value)}
          items={[
            { label: 'Freestyle', value: 'Freestyle' },
            { label: 'Backstroke', value: 'Backstroke' },
            { label: 'Breaststroke', value: 'Breaststroke' },
            { label: 'Butterfly', value: 'Butterfly' },
            { label: 'Individual Medley', value: 'Individual Medley' },
          ]}
          value={stroke}
          style={pickerSelectStyles}
        />

        <Text style={styles.label}>COURSE</Text>
        <RNPickerSelect
          onValueChange={value => setCourse(value)}
          items={[
            { label: 'SCM', value: 'SCM' },
            { label: 'LCM', value: 'LCM' },
          ]}
          value={course}
          style={pickerSelectStyles}
        />
        <TextInput
          style={styles.input}
          value={time}
          onChangeText={setTime}
          placeholder='Enter time (MIN:SEC.HH or SEC.HH)'
          placeholderTextColor={pickerText}
        />
        <View
          style={styles.dateRow}
          lightColor={defaultLight}
          darkColor={defaultDark}
        >
          <Text style={styles.label}>DATE: {formattedDate}</Text>
          <TouchableOpacity onPress={() => showDatePickerHandler()}>
            <FontAwesome name='calendar' color={defaultBlue} size={18} />
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <RNDateTimePicker
            value={date}
            mode='date'
            display='default'
            onChange={onDateChange}
          />
        )}

        <TouchableOpacity style={styles.roundButton} onPress={handleAddTime}>
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
  label: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
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
  dateRow: {
    borderRadius: 5,
    gap: 25,
    flexDirection: 'row',
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
    color: pickerText,
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: pickerText,
    borderRadius: 8,
    color: pickerText,
    paddingRight: 30,
  },
  placeholder: {
    color: pickerText,
  },
});
