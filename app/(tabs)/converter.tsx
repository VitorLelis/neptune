import React, { useState } from 'react';
import { StyleSheet, TextInput, Button} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Text, View } from '@/components/Themed';
import { convertTime } from '@/constants/conversionUtils';

export default function ConverterScreen() {
  const [stroke, setStroke] = useState('Freestyle');
  const [distance, setDistance] = useState('50');
  const [originalCourse, setOriginalCourse] = useState('SCM');
  const [targetCourse, setTargetCourse] = useState('LCM');
  const [time, setTime] = useState('');
  const [result, setResult] = useState<string | null>(null);

  const handleConvert = () => {
    try {
      const convertedTime = convertTime(time, stroke, distance, originalCourse, targetCourse);
      setResult(convertedTime);
    } catch (error) {
      setResult('Error: ' + (error as Error).message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Time Converter</Text>

      <Text style={styles.label}>Stroke</Text>
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

      <Text style={styles.label}>Distance</Text>
      <Picker
        selectedValue={distance}
        style={styles.picker}
        onValueChange={(itemValue) => setDistance(itemValue)}
      >
        <Picker.Item label="50" value="50" />
        <Picker.Item label="100" value="100" />
      </Picker>

      <Text style={styles.label}>Original Course</Text>
      <Picker
        selectedValue={originalCourse}
        style={styles.picker}
        onValueChange={(itemValue) => setOriginalCourse(itemValue)}
      >
        <Picker.Item label="SCY" value="SCY" />
        <Picker.Item label="SCM" value="SCM" />
        <Picker.Item label="LCM" value="LCM" />
      </Picker>

      <Text style={styles.label}>Target Course</Text>
      <Picker
        selectedValue={targetCourse}
        style={styles.picker}
        onValueChange={(itemValue) => setTargetCourse(itemValue)}
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
        keyboardType="numeric"
      />

      <Button title="Convert" onPress={handleConvert} />

      {result && <Text style={styles.result}>Converted Time: {result}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginVertical: 10,
  },
  picker: {
    height: 50,
    width: 150,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    width: '100%',
    marginVertical: 20,
  },
  result: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
