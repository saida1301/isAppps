import axios from 'axios';
import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {View, TextInput, Button, Text, StyleSheet, TouchableOpacity, Alert, Pressable, Modal, useColorScheme, ActivityIndicator} from 'react-native';
import LanguageSelector from './LanguageSelector';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker';
import {useSelector} from 'react-redux';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import CheckBox from '@react-native-community/checkbox';
import { borderRadius, colors, spacing } from '../assets/themes';
import SuccessAnimation from '../animations/success.json';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const AddVacancyComponent = ({label}:any) => {
  const [company_id, setCompany_id] = useState('');
  const [city_id, setCity_id] = useState('');
  const [category_id, setCategory_id] = useState('');
 
 const isDarkMode = useColorScheme() === 'dark';
  const [position, setPosition] = useState('');
  const [min_salary, setMin_salary] = useState('');
  const [max_salary, setMax_salary] = useState('');
  const [min_age, setMin_age] = useState('');
  const [max_age, setMax_age] = useState('');
  const [requirement, setRequirement] = useState('');
  const [description, setDescription] = useState('');
  const [contact_name, setContact_name] = useState('');
  const [isSalaryTypeMonthly, setIsSalaryTypeMonthly] = useState(true);
  const [accept_type, setAccept_type] = useState('');
  const [contact_info, setContact_info] = useState('');
  const [education, seteducation] = useState([]);
  const [education_id, seteducation_id] = useState('');
  const [type, settype] = useState([]);
  const [type_id, settype_id] = useState('');
  const [user_id, setUserId] = useState('');
  const [cities, setcities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [experience, setexperience] = useState([]);
  const [experience_id, setexperience_id] = useState('');
  const [companies, setcompanies] = useState([])
  const [acceptTypes, setAcceptTypes] = useState([]); 
  const [deadline, setDeadline] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [vacancies, setVacancies] = useState([]);
  const [salary_type, setSalary_type] = useState(0);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState('+994');
  useEffect(() => {
    const fetchVacancies = async () => {
      try {
        const response = await axios.get(
          'https://movieappi.onrender.com/vacancies'
        );
        setVacancies(response.data.vacancies);
      } catch (error) {
        console.error(error);
      }
    };

    fetchVacancies();
  }, []);
  const handleDateChange = (selectedDate: Date) => {
    setDeadline(selectedDate);
    setOpen(false);
  };
  const handleSalaryTypeChange = (newValue: boolean | ((prevState: boolean) => boolean)) => {
    setIsSalaryTypeMonthly(newValue);
    setSalary_type(newValue ? 0: 1);
  };
  
  useEffect(() => {
    const fetchAcceptTypes = async () => {
      try {
        const response = await axios.get(
          'https://movieappi.onrender.com/accept'
        );
        setAcceptTypes(response.data);
       
      } catch (error) {
        console.error(error);
      }
    };

    fetchAcceptTypes();
  }, []);
  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const response = await axios.get(
          'https://movieappi.onrender.com/educations',
        );
        seteducation(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchEducation();
  }, []);
  const email = useSelector(state => state.auth.email);
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get(
          'https://movieappi.onrender.com/cities',
        );
        setcities(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCities();
  }, []);
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get(
          `https://movieappi.onrender.com/company/${user_id}`,
        );
        setcompanies(response.data);
      } catch (error) {
        console.error(error);
      }
    };
  
    if (user_id) {
      fetchCompanies();
    }
  }, [user_id]);
  const handleOpenDatePicker = () => {
    setOpen(true);
  };
  const maxDate = new Date('2023-01-01');
  const onChange = (event: any, selectedDate: Date) => {
    const currentDate = selectedDate || deadline;
    setOpen(Platform.OS === 'ios');
    setDeadline(selectedDate);
  };
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(
          'https://movieappi.onrender.com/job',
        );
        settype(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchJob();
  }, []);
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        console.log('Stored userId:', storedUserId);

        if (storedUserId) {
          setUserId(storedUserId);
        } else {
          // If userId is not found in AsyncStorage, fetch it from the API
          const response = await axios.get('https://movieappi.onrender.com/user');
          console.log('API response:', response.data);
          const data = response.data;
          const loggedInUser = data.find(user => user.email === email);

          if (loggedInUser) {
            setUserId(loggedInUser.id);
            // Save the fetched userId in AsyncStorage for future use
            await AsyncStorage.setItem('userId', loggedInUser.id.toString());
          } else {
            console.error('User not found!');
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserId();
  }, [email]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          'https://movieappi.onrender.com/categories',
        );
        setCategories(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategories();
  }, []);
  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await axios.get(
          'https://movieappi.onrender.com/experiences',
        );
        setexperience(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchExperiences();
  }, []);
  const {t} = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [positionError, setPositionError] = useState('');
  const [companyError, setCompanyError] = useState('');
  const positionInputRef = useRef<TextInput | null>(null);
  const companyIdInputRef = useRef<TextInput | null>(null);
  const handleAddVacancy = async () => {
    try {
      setIsLoading(true);
      if (!position) {
        setPositionError(t('require'));
        // Focus on the position input and scroll it into view
        positionInputRef.current?.focus(); // Use ?. to safely access focus()
        return;
      } else {
        setPositionError('');
      }

      if (!company_id) {
        setCompanyError(t('require'));
        // Focus on the company_id input and scroll it into view
        companyIdInputRef.current?.focus(); // Use ?. to safely access focus()
        return;
      } else {
        setCompanyError('');
      }

      if (positionError || companyError) {
        // Display error messages on the screen or handle them as needed
        return;
      }
      const formattedDeadline = moment(deadline).format('YYYY-MM-DD').toString();
      const vacancyData = {
        user_id: user_id,
        selected_company_id :company_id,
        city_id: city_id,
        category_id: selectedCategoryId,
        experience_id,
        education_id :education_id,
        position,
        min_salary ,
        max_salary,
        min_age,
        max_age,
        requirement,
        description,
        contact_name,
        accept_type,
        job_type_id : type_id,
        deadline :formattedDeadline,
        contact_info,
        salary_type: isSalaryTypeMonthly ? 0 : 1,
      };
      // if (!user_id || !company_id || !city_id || !selectedCategoryId || !type_id || !experience_id || !education_id || !position  || !min_age || !max_age || !requirement || !description || !contact_name || !accept_type || !contact_info || !deadline) {
      //   Alert.alert('Error', 'Please fill in all the fields.');
      //   return;
      // }
console.log(vacancyData)
      // Make a POST request to the backend endpoint to add the vacancy
      const response = await axios.post(
        'https://movieappi.onrender.com/vacanc',
        vacancyData,
      );
      console.log(response.data);
      setIsSuccessModalVisible(true);
      setTimeout(() => {
        setIsSuccessModalVisible(false);
      }, 1000);
      setIsLoading(false);
      if (response.status === 201) {
        console.log('Vacancy added successfully');
      } else {
        console.log('Failed to add vacancy');
      }
    } catch (error) {
      console.error('Error adding vacancy:', error.response.data);
      setIsLoading(false);
    }
  };

  return (
    <View>
      <TextInput
        placeholder={t('vezife_telim')}
        ref={positionInputRef}
        value={position}
        onChangeText={setPosition}
        style={[
          styles.input,
          {
            backgroundColor: isDarkMode ? "#1B1523" : "#FFFFFF",
            color: isDarkMode ? "#FFFFFF" : "black", // Set the text color based on the mode
          },
        ]}
        placeholderTextColor={isDarkMode ? "#FDFDFD" : "gray"}
      />
       <Text style={styles.errorText}>{positionError}</Text>
      <View
        style={{
          borderRadius: 10,
          flex: 1,
          backgroundColor: isDarkMode ? "#1B1523" : 'white',
          margin: 20,
          elevation: 4,
          borderWidth: 1,
          borderColor: '#ccc',
          overflow: 'hidden',
        }}>
        <Picker
          placeholder="Select a city"
          selectedValue={city_id}
          onValueChange={value => setCity_id(value)}
          dropdownIconColor={isDarkMode ? 'white' : 'black'}>
          {cities.map(category => (
            <Picker.Item
              key={category.id}
              value={category.id}
              label={category.title_az}
              color={isDarkMode ? 'white' : 'black'}
            />
          ))}
        </Picker>
 
      </View>
      <View
        style={{
          borderRadius: 10,
          flex: 1,
          marginBottom: 20,
          marginRight: 20,
          marginLeft: 20,
          backgroundColor: isDarkMode ? "#1B1523" : 'white',
          elevation: 4,
          borderWidth: 1,
          borderColor: '#ccc',
          overflow: 'hidden',
        }}>
        <Picker
          placeholder="Select a company"
          selectedValue={selectedCategoryId}
          onValueChange={value => setSelectedCategoryId(value)}
          style={{color: isDarkMode ? "white" : 'black'}} 
          dropdownIconColor={isDarkMode ? 'white' : 'black'}
        >
          {categories.map(category => (
            <Picker.Item
              key={category.id}
              value={category.id}
              label={category.title_az}
              color={isDarkMode ? 'white' : 'black'}
            />
          ))}
        </Picker>
      </View>
      <View
        style={{
          borderRadius: 10,
          flex: 1,
          marginBottom: 20,
          marginRight: 20,
          marginLeft: 20,
          backgroundColor: isDarkMode ? "#1B1523" : 'white',
          elevation: 4,
          borderWidth: 1,
          borderColor: '#ccc',
          overflow: 'hidden',
        }}>
        <Picker
          placeholder="Select a company"
          selectedValue={selectedCategoryId}
          onValueChange={value => settype_id(value)}
          style={{color: isDarkMode ? "white" : 'black'}}
          dropdownIconColor={isDarkMode ? 'white' : 'black'} 
        >
          {type.map(category => (
            <Picker.Item
              key={category.id}
              value={category.id}
              label={category.title_tr}
              color={isDarkMode ? 'white' : 'black'}
            />
          ))}
        </Picker>
      </View>
      <View style={{flexDirection:"row"}}>
      <TextInput
  placeholder={t('minsalary')}
  value={min_salary}
  onChangeText={(text) => {
    // Ensure that the input contains only numeric characters
    const numericValue = text.replace(/[^0-9]/g, '');
    setMin_salary(numericValue);
  }}
  style={[
    styles.input3,
    {
      backgroundColor: isDarkMode ? "#1B1523" : "#FFFFFF",
      color: isDarkMode ? "#FFFFFF" : "black",
    },
  ]}
  placeholderTextColor={isDarkMode ? "#FDFDFD" : "gray"}
  editable={salary_type === 1}
  keyboardType="numeric"
/>

<TextInput
  placeholder={t('maxsalary')}
  value={max_salary}
  onChangeText={(text) => {
    // Ensure that the input contains only numeric characters
    const numericValue = text.replace(/[^0-9]/g, '');
    setMax_salary(numericValue);
  }}
  style={[
    styles.input3,
    {
      backgroundColor: isDarkMode ? "#1B1523" : "#FFFFFF",
      color: isDarkMode ? "#FFFFFF" : "black",
    },
  ]}
  placeholderTextColor={isDarkMode ? "#FDFDFD" : "gray"}
  editable={salary_type === 1}
  keyboardType="numeric" // Use numeric keyboard
/>

      </View>
      <View style={styles.checkboxContainer}>
        <CheckBox value={salary_type === 0} onValueChange={handleSalaryTypeChange} />
        <Text style={[styles.checkboxLabel, {color:isDarkMode ? 'white' : 'black'},]}>{t('muhasibe')}</Text>
      </View>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          height:55,
          marginTop: 20, // Added horizontal padding to the parent view
        }}>
        <View
          style={{
            borderRadius: 10,
            flex: 1,
            marginRight: 10, // Added right margin to create space between the boxes
            backgroundColor: isDarkMode ? "#1B1523" : 'white',
            // boxShadow is not supported in React Native, so we'll use elevation for Android
            elevation: 4,
            // Additional styles to make sure the Picker is visible
            borderWidth: 1,
            borderColor: '#ccc',
            overflow: 'hidden',
          }}>
    <TextInput
  placeholder={t('minage')}
  value={min_age}
  onChangeText={(text) => {
    // Ensure that the input contains only numeric characters
    const numericValue = text.replace(/[^0-9]/g, '');
    setMin_age(numericValue);
  }}
  style={[
    styles.input2,
    {
      backgroundColor: isDarkMode ? "#1B1523" : "#FFFFFF",
      color: isDarkMode ? "#FFFFFF" : "black",
    },
  ]}
  placeholderTextColor={isDarkMode ? "#FDFDFD" : "gray"}
  keyboardType="numeric" 
/>

        </View>

        <View
          style={{
            borderRadius: 10,
            flex: 1,
            marginRight: 10, // Added right margin to create space between the boxes
            backgroundColor: isDarkMode ? "#1B1523" : '#F4F9FD',
            // boxShadow is not supported in React Native, so we'll use elevation for Android
            elevation: 4,
            // Additional styles to make sure the Picker is visible
            borderWidth: 1,
            borderColor: '#ccc',
            overflow: 'hidden',
          }}>
   <TextInput
  placeholder={t('maxage')}
  value={max_age}
  onChangeText={(text) => {
    // Ensure that the input contains only numeric characters
    const numericValue = text.replace(/[^0-9]/g, '');
    setMax_age(numericValue);
  }}
  style={[
    styles.input2,
    {
      backgroundColor: isDarkMode ? "#1B1523" : "#FFFFFF",
      color: isDarkMode ? "#FFFFFF" : "black",
    },
  ]}
  placeholderTextColor={isDarkMode ? "#FDFDFD" : "gray"}
  keyboardType="numeric" 
/>

        </View>

        <View
          style={{
            borderRadius: 10,
            flex: 1,
            backgroundColor: isDarkMode ? "#1B1523" : 'white',
            // boxShadow is not supported in React Native, so we'll use elevation for Android
            elevation: 4,
            // Additional styles to make sure the Picker is visible
            borderWidth: 1,
            borderColor: '#ccc',
            overflow: 'hidden',
          }}>
          <Picker
            placeholder="Select a company"
            selectedValue={experience_id}
            onValueChange={value => setexperience_id(value)}
            dropdownIconColor={isDarkMode ? 'white' : 'black'}
            style={{color:isDarkMode ? "white" : 'black'}} 
            >
            {experience.map(category => (
              <Picker.Item
                key={category.id}
                value={category.id}
                label={category.title_az}
              />
            ))}
          </Picker>
        </View>
      </View>
      <Text
        style={{
          color:isDarkMode ? "white" : 'black',
          fontSize: 16,
          fontWeight: 600,
          marginHorizontal: 20,
          marginTop:30, 
          marginBottom:10
        }}>
       {t('about_job')}
      </Text>
       
      <TextInput


        value={requirement}
        onChangeText={setRequirement}
        style={[
          styles.input4,
          {
            backgroundColor: isDarkMode ? "#1B1523" : "#FFFFFF",
            color: isDarkMode ? "#FFFFFF" : "black", // Set the text color based on the mode
          },
        ]}
        placeholderTextColor={isDarkMode ? "#FDFDFD" : "gray"}
        textAlignVertical="top"
      />
       <Text
        style={{
          color: isDarkMode ? "white" : 'black',
          fontSize: 16,
          fontWeight: 600,
          marginHorizontal: 20,
          marginTop:30, 
          marginBottom:10,     
          
        }}>
   {t('telebler')}
      </Text>
      <TextInput

      
        value={description}
        onChangeText={setDescription}
        style={[
          styles.input4,
          {
            backgroundColor: isDarkMode ? "#1B1523" : "#FFFFFF",
            color: isDarkMode ? "#FFFFFF" : "black", // Set the text color based on the mode
          },
        ]}
        placeholderTextColor={isDarkMode ? "#FDFDFD" : "gray"}
        textAlignVertical="top"
      />
   
      <View
  style={{
    borderRadius: 10,
    flex: 1,
    marginBottom: 20,
    marginRight: 20,
    marginLeft: 20,
    marginTop:20,
    backgroundColor: isDarkMode ? "#1B1523" : 'white',
    elevation: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    overflow: 'hidden',
  }}   ref={companyIdInputRef}>
<Picker
  selectedValue={company_id}
  onValueChange={value => setCompany_id(value)}
  style={{ color: isDarkMode ? 'white' : 'black',  }}
  dropdownIconColor={isDarkMode ? 'white' : 'black'}

>
  <Picker.Item
    label={t('choose_company')}
    value={null} // or any other value that represents the placeholder
    color={isDarkMode ? 'gray' : 'lightgray'} // optional: change text color to gray
  />
  {companies.map(company => (
    <Picker.Item
      key={company.id}
      value={company.id}
      label={company.name}
    />
  ))}
</Picker>
<Text style={styles.errorText}>{companyError}</Text>
</View>

<View
        style={{
          borderRadius: 10,
          flex: 1,
          marginBottom: 20,
          marginRight: 20,
          marginLeft: 20,
          backgroundColor: isDarkMode ? "#1B1523" : 'white',
          elevation: 4,
          borderWidth: 1,
          borderColor: '#ccc',
          overflow: 'hidden',
        }}>
        <Picker
          placeholder="Select accept type"
          selectedValue={accept_type}
          style={{color:isDarkMode ? "white" : 'black'}} 
          onValueChange={value => setAccept_type(value)}
          dropdownIconColor={isDarkMode ? 'white' : 'black'}>
          {acceptTypes.map(accept => (
            <Picker.Item
              key={accept.id}
              value={accept.id}
              label={accept.title_az} // Assuming there's a 'title' property in the accept_type data
            />
          ))}
        </Picker>
      </View>
      <Text
        style={{
          color: isDarkMode ? "white" : 'black',
          fontSize: 16,
          fontWeight: 600,
          margin: 20,
          
        }}>
  {t('contact_info')}
      </Text>
      <TextInput
        placeholder={t('sexs')}

        value={contact_name}
        onChangeText={setContact_name}
        style={[
          styles.input,
          {
            backgroundColor: isDarkMode ? "#1B1523" : "#FFFFFF",
            color: isDarkMode ? "#FFFFFF" : "black", // Set the text color based on the mode
          },
        ]}
        placeholderTextColor={isDarkMode ? "#FDFDFD" : "gray"}
      />
 <View>
    <Picker
      selectedValue={selectedCountryCode}
      onValueChange={(itemValue) => setSelectedCountryCode(itemValue)}
      style={[
        styles.input,
        {
          backgroundColor: isDarkMode ? "#1B1523" : "#FFFFFF",
          color: isDarkMode ? "#FFFFFF" : "black",
        },
      ]}
    >
      <Picker.Item label="+994" value="+994" />
      {/* Add more country codes here */}
    </Picker>
    
    <TextInput
  placeholder={t('tel')}
  value={contact_info.replace(selectedCountryCode, '')}
  onChangeText={(text) => {
    // Remove all non-numeric characters from the input
    const numericValue = text.replace(/[^0-9]/g, '');

    // Set the state with the selected country code and numeric value
    if (numericValue.length <= 10) {
      setContact_info(`${selectedCountryCode}${numericValue}`);
    }
  }}
  style={[
    styles.input,
    {
      backgroundColor: isDarkMode ? "#1B1523" : "#FFFFFF",
      color: isDarkMode ? "#FFFFFF" : "black",
    },
  ]}
  placeholderTextColor={isDarkMode ? "#FDFDFD" : "gray"}
  keyboardType="phone-pad"
/>
  </View>

         <Text
        style={{
          color: isDarkMode ? "white" : 'black',
          fontSize: 16,
          fontWeight: 600,
          margin: 20,
          
        }}>
   {t('bitme_tarix')}
      </Text>
   

      <View style={styles.inputContainer}>
  <TextInput
    style={[
      styles.input5,
      { backgroundColor: isDarkMode ? '#1B1523' : 'white', color: isDarkMode ? 'white' : '#020202' },
    ]}
    placeholder={label}
    value={moment(deadline).format('YYYY-MM-DD').toString()}
    editable={false}
  />
  <TouchableOpacity
    style={[
      styles.button,
      { backgroundColor: isDarkMode ? '#1B1523' : 'white', borderColor: isDarkMode ? 'white' : 'black' },
    ]}
    onPress={handleOpenDatePicker}
  >
    <Icon name="calendar" color={isDarkMode ? 'white' : 'black'} />
  </TouchableOpacity>
</View>
{open && (
  <DateTimePicker
 testID="dateTimePicker"
 value={deadline}
 mode="date"
 is24Hour={true}
 display="default"
 onChange={onChange}
 maximumDate={maxDate} // Set the maximum date limit
/>
)}


<View
        style={{
          borderRadius: 10,
          flex: 1,
          marginBottom: 20,
          marginRight: 20,
          marginLeft: 20,
          backgroundColor: isDarkMode ? "#1B1523" : 'white',
          elevation: 4,
          borderWidth: 1,
          borderColor: '#ccc',
          overflow: 'hidden',
        }}>
                <Picker
            placeholder="Select education"
            dropdownIconColor={isDarkMode ? 'white' : 'black'}
            style={{color:isDarkMode ? "white" : 'black',}} 
            selectedValue={education_id}
            onValueChange={value => seteducation_id(value)}>
            {education.map(category => (
              <Picker.Item
                key={category.id}
                value={category.id}
                label={category.title_az}
              />
            ))}
          </Picker>
        </View>
        <Pressable
  onPress={handleAddVacancy}
  style={{
    borderRadius: 10,
    backgroundColor: '#9559E5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    flex: 1,
    width: '50%',
    marginHorizontal: 20,
    marginBottom: 77,
    height: 50,
    padding: 15,
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
    gap: 5,
    flexShrink: 0,
  }}
  disabled={isLoading}
>
  {isLoading ? (
    <ActivityIndicator color={isDarkMode.toString() === 'dark' ? 'white' : '#020202'} size={'small'} />
  ) : (
    <Text style={{ color: 'white', fontWeight: 'bold' }}>{t('yerles')}</Text>
  )}
</Pressable>


 
   
  
<Modal visible={isSuccessModalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modal}>
              <LottieView
                source={SuccessAnimation}
                style={styles.animation}
                autoPlay={true}
                loop={false}
              />
            </View>
          </View>
        </Modal>
 
    </View>
  );
};

export default AddVacancyComponent;

const styles = StyleSheet.create({
  input: {
    backgroundColor: 'white',
    width: '100%',
    maxWidth: 370,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    color: '#020202',
    marginLeft: 20,
marginBottom:20,
   
    flex: 1, // Take remaining available space

   
   
    paddingHorizontal: 14,
  },
  input5: {
    backgroundColor: 'white',
    flex: 1, // Take remaining available space
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    color: '#020202',
    paddingHorizontal: 14, // Adjusted horizontal padding for text inside input
  },
  errorText: {
    color: 'red', // You can change the color to your desired error text color
    fontSize: 14, // You can adjust the font size
    marginBottom: 5,
    marginLeft:20 // You can add some space below the error text
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.small,
    padding: spacing.large,
    alignItems: 'center',
    justifyContent: 'center',
  },
  animation: {
    width: 150,
    height: 150,
  },
  input3: {
    backgroundColor: 'white',
    width: 175,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    color: '#020202',
    marginTop: 20,
    marginLeft: 20,
  },
  input2: {
    backgroundColor: 'white',
    width: 175,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    color: '#020202',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    marginTop: 10,
  },
  checkboxLabel: {
    marginLeft: 8,
  },
  salaryInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 55,
    marginTop: 20,
  },
  button: {
    width: 55, // Adjusted width for button
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    marginLeft: 10, // Added some spacing between input and button
    borderWidth: 1, // Added border for button
  },
  input4: {
    backgroundColor: 'white',
    width: '100%',
    maxWidth: 370,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    color: '#020202',
    marginLeft: 20,
    marginTop: 20,
  },
  buttonText: {
    color: '#333333',
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // To evenly distribute input and button
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 20, // Added horizontal padding for responsiveness
  },
  picker: {
    backgroundColor: 'white',
    borderRadius: 10,
    height: 55,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingLeft: 10,
  },
  container5: {
    flexDirection: 'row',
    paddingVertical: 19,
    paddingHorizontal: 14,
    marginVertical: 10,
    width: '100%',
    maxWidth: 370,
    height: 55,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    borderRadius: 10,
    marginRight: 20,
  },
  textInput: {
    flex: 1,
    display: 'flex',
    height: 55,
    padding: '19px 39px 19px 14px',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  addButton: {
    marginTop: 20,
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  deleteButton: {
    justifyContent: 'center',
    marginLeft: 10,
  },
  fileButton: {
    borderRadius: 10,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
    width: 120,
    height: 75,
    flexShrink: 0,
    flexDirection: 'row',
  },
  plusIcon: {
    marginRight: 40,
    marginTop: 30,
  },
  pressableButton: {
    borderRadius: 10,
    backgroundColor: '#9559E5',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    display: 'flex',
    width: 117,
    height: 40,
    alignSelf: 'center',
  },
});