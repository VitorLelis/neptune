import React, { useState } from 'react'
import { StyleSheet, TextInput, Modal, TouchableOpacity } from 'react-native'
import RNPickerSelect from 'react-native-picker-select'
import { Text, View } from '@/components/Themed'
import { convertTime } from '@/utils/conversionUtils'
import { defaultBlue, defaultDark, defaultLight, pickerText } from '@/constants/Colors'

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
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setResult(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card} lightColor={defaultLight} darkColor={defaultDark}>
        <View style={styles.row} lightColor={defaultLight} darkColor={defaultDark}>
          <View style={styles.column} lightColor={defaultLight} darkColor={defaultDark}>
            <Text style={styles.label}>STROKE</Text>
            <RNPickerSelect
              onValueChange={(value) => setStroke(value)}
              items={[
                { label: 'Freestyle', value: 'Freestyle'},
                { label: 'Backstroke', value: 'Backstroke'},
                { label: 'Breaststroke', value: 'Breaststroke'},
                { label: 'Butterfly', value: 'Butterfly'},
              ]}
              style={pickerSelectStyles}
              value={stroke}
            />
          </View>

          <View style={styles.column} lightColor={defaultLight} darkColor={defaultDark}>
            <Text style={styles.label}>DISTANCE</Text>
            <RNPickerSelect
              onValueChange={(value) => setDistance(value)}
              items={[
                { label: '50', value: '50' },
                { label: '100', value: '100' },
                { label: '200', value: '200' },
                { label: '400', value: '400' },
                { label: '800', value: '800' },
                { label: '1500', value: '1500' },
              ]}
              style={pickerSelectStyles}
              value={distance}
            />
          </View>
        </View>

        <View style={styles.row} lightColor={defaultLight} darkColor={defaultDark}>
          <View style={styles.column} lightColor={defaultLight} darkColor={defaultDark}>
            <Text style={styles.label}>ORIGINAL COURSE</Text>
            <RNPickerSelect
              onValueChange={(value) => setOriginalCourse(value)}
              items={[
                { label: 'SCM', value: 'SCM' },
                { label: 'LCM', value: 'LCM' },
              ]}
              style={pickerSelectStyles}
              value={originalCourse}
            />
          </View>

          <View style={styles.column} lightColor={defaultLight} darkColor={defaultDark}>
            <Text style={styles.label}>TARGET COURSE</Text>
            <RNPickerSelect
              onValueChange={(value) => setTargetCourse(value)}
              items={[
                { label: 'SCM', value: 'SCM' },
                { label: 'LCM', value: 'LCM' },
              ]}
              style={pickerSelectStyles}
              value={targetCourse}
            />
          </View>
        </View>

        <View style={styles.inputContainer} lightColor={defaultLight} darkColor={defaultDark}>
          <TextInput
            style={styles.input}
            value={time}
            onChangeText={setTime}
            placeholder="Enter time (MIN:SEC.HH or SEC.HH)"
            placeholderTextColor={pickerText}
          />
          <TouchableOpacity style={styles.roundButton} onPress={handleConvert}>
            <Text style={styles.buttonText}>CONVERT</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={modalVisible}
        animationType="none"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent} lightColor={defaultLight} darkColor={defaultDark}>
            <Text style={styles.title}>RESULT</Text>
            <Text style={styles.result}>{result}</Text>
            <TouchableOpacity style={styles.roundButton} onPress={closeModal}>
              <Text style={styles.buttonText}>CLOSE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

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

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  column: {
    flex: 1,
    marginHorizontal: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  inputContainer: {
    marginTop: 20,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  result: {
    marginTop: 20,
    fontSize: 16,
    marginBottom: 20,
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

