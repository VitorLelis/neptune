import React, { useState } from 'react';
import { StyleSheet, TextInput, Button, Modal} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Text, View } from '@/components/Themed';
import { convertTime } from '@/utils/conversionUtils';

export default function ConverterScreen() {
  const [stroke, setStroke] = useState('Freestyle');
  const [distance, setDistance] = useState('50');
  const [originalCourse, setOriginalCourse] = useState('SCM');
  const [targetCourse, setTargetCourse] = useState('LCM');
  const [time, setTime] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleConvert = () => {
    try {
      const convertedTime = convertTime(time, stroke, distance, originalCourse, targetCourse);
      setResult(convertedTime);
    } catch (error) {
      setResult('Error: ' + (error as Error).message);
    }
    setModalVisible(true)
  };

  const closeModal = () => {
    setModalVisible(false)
    setResult(null)
  }

  return (
    <View style={styles.container}>

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
        <Picker.Item label="200" value="200" />
        <Picker.Item label="400" value="400" />
        <Picker.Item label="800" value="800" />
        <Picker.Item label="1500" value="1500" />
      </Picker>

      <Text style={styles.label}>Original Course</Text>
      <Picker
        selectedValue={originalCourse}
        style={styles.picker}
        onValueChange={(itemValue) => setOriginalCourse(itemValue)}
      >
        <Picker.Item label="SCM" value="SCM" />
        <Picker.Item label="LCM" value="LCM" />
      </Picker>

      <Text style={styles.label}>Target Course</Text>
      <Picker
        selectedValue={targetCourse}
        style={styles.picker}
        onValueChange={(itemValue) => setTargetCourse(itemValue)}
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

      <Button title="Convert" onPress={handleConvert} />

      <Modal
        visible={modalVisible}
        animationType="none"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Result</Text>
            <Text style={styles.result}>{result}</Text>
            <Button title="Close" onPress={closeModal} />
          </View>
        </View>
      </Modal>
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
    marginBottom:20
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
});
