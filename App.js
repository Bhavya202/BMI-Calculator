import React, { useState } from 'react';
import { StyleSheet, View, TextInput, ScrollView } from 'react-native';
import { Button, Text } from 'react-native-elements';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import moment from 'moment';

const Stack = createStackNavigator();

function BMICalculatorScreen({ navigation }) {
  const [weight, setWeight] = useState('');
  const [feet, setFeet] = useState('');
  const [inches, setInches] = useState('');
  const [name, setName] = useState('');
  const [bmi, setBMI] = useState(null);
  const [history, setHistory] = useState([]);

  const validateFields = () => {
    if (!name || !weight || !feet || !inches) {
      alert('Missing Field.. Please Fill In All Fields!!');
      return false;
    }
    if (isNaN(weight) || isNaN(feet) || isNaN(inches)) {
      alert('Invalid Input.. Weight And Height Should Be Numeric!!');
      return false;
    }
    return true;
  };

  const calculateBMI = () => {
    if (!validateFields()) return;

    const heightInInches = parseInt(feet) * 12 + parseInt(inches);
    const heightInMeters = heightInInches * 0.0254;
    const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(2);
    setBMI(bmiValue);

    const currentDate = moment().format('MMMM Do YYYY, h:mm:ss a');
    const newEntry = { name, weight, feet, inches, bmi: bmiValue, date: currentDate };
    setHistory([...history, newEntry]); // Add new entry to history
  };

  const resetCalculator = () => {
    setWeight('');
    setFeet('');
    setInches('');
    setBMI(null);
    setName('');
  };

  return (
    <LinearGradient colors={['#F0F8FF', '#F5F5DC']} style={styles.container}>
      <Text h1 style={styles.title}>BMI Calculator</Text>
      <Text style={styles.label}>Enter Your Name: </Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
      />
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Weight (kg):</Text>
        <TextInput
          style={styles.inputField}
          value={weight}
          onChangeText={setWeight}
          keyboardType="numeric"
        />
      </View>
      <View style={styles.heightContainer}>
        <View style={styles.heightInputContainer}>
          <Text style={styles.label}>Height (feet):</Text>
          <TextInput
            style={styles.inputField}
            value={feet}
            onChangeText={setFeet}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.heightInputContainer}>
          <Text style={styles.label}>Height (inches):</Text>
          <TextInput
            style={styles.inputField}
            value={inches}
            onChangeText={setInches}
            keyboardType="numeric"
          />
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Calculate BMI" onPress={calculateBMI} />
        <Button title="Reset" onPress={resetCalculator} />
      </View>
      {bmi !== null && (
        <View style={styles.resultContainer}>
          <Text h4>Your BMI: {bmi}</Text>
          <Text>
            Interpretation:
            {bmi < 18.5 ? ' Underweight' : bmi < 25 ? ' Normal weight' : ' Overweight'}
          </Text>
        </View>
      )}
      <View style={styles.historyLink}>
        <Button title="View History" onPress={() => navigation.navigate('History', { history })} />
      </View>
    </LinearGradient>
  );
}

function HistoryScreen({ route }) {
  const { history } = route.params;

  return (
    <View style={styles.container}>
      <Text h1 style={styles.title}>BMI History</Text>
      <ScrollView style={styles.scrollView}>
        {history.map((entry, index) => (
          <View style={styles.historyEntry} key={index}>
            <Text style={styles.historyText}>
              {entry.name}'s BMI: {entry.bmi} | Height: {entry.feet} ft {entry.inches} in
            </Text>
            <Text style={styles.historyText}>Date: {entry.date}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="BMICalculator">
        <Stack.Screen
          name="BMICalculator"
          component={BMICalculatorScreen}
          options={{
            title: 'BMI Calculator',
            headerStyle: {
              backgroundColor: '#F0F8FF',
            },
            headerTintColor: '#000',
          }}
        />
        <Stack.Screen
          name="History"
          component={HistoryScreen}
          options={{
            title: 'BMI History',
            headerStyle: {
              backgroundColor: '#F0F8FF',
            },
            headerTintColor: '#000',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: '#000',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  inputField: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
  },
  heightContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  heightInputContainer: {
    flex: 1,
    marginRight: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  resultContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  historyLink: {
    alignItems: 'center',
    marginTop: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
    color: '#000',
  },
  scrollView: {
    flex: 1,
  },
  historyEntry: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  historyText: {
    color: '#000',
  },
});
