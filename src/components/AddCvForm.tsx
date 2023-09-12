import {
  ActivityIndicator,
  Alert,
  Button,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import {Picker} from '@react-native-picker/picker';
import SuccessAnimation from '../animations/success.json';
import LottieView from 'lottie-react-native';
import {useSelector} from 'react-redux';
import {
  Asset,
  ImagePickerResponse,
  launchImageLibrary,
} from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import {useTranslation} from 'react-i18next';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';
import CustomTextInput from './CustomTextInput';
import { borderRadius, colors, spacing } from '../assets/themes';
import AsyncStorage from '@react-native-async-storage/async-storage';
interface PickedFile {
  fileCopyUri: null | string;
  name: string;
  size: number;
  type: string;
  uri: string;
}
const AddCvForm = ({label, onPress}: any) => {
  const isDarkMode = useColorScheme() === 'dark';
  const [user_id, setUserId] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [cities, setcities] = useState([]);
  const [city_id, setcity_id] = useState('');
  const [education, seteducation] = useState([]);
  const [education_id, seteducation_id] = useState('');
  const [experience, setexperience] = useState([]);
  const [experience_id, setexperience_id] = useState('');
  const [job, setjob] = useState([]);
  const [job_type_id, setjob_type_id] = useState('');
  const [gender, setgender] = useState([]);
  const [gender_id, setgender_id] = useState('');
  const [name, setname] = useState('');
  const [surname, setsurname] = useState('');
  const [father_name, setfather_name] = useState('');
  const [emaill, setemail] = useState('');
  const [emailll, setEmail] = useState('');
  const [position, setposition] = useState('');
  const [about_education, setabout_education] = useState('');
  const [salary, setsalary] = useState('');
  const [birth_date, setbirth_date] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [work_history, setwork_history] = useState('');
  const [skills, setskills] = useState('');
  const [contact_phone, setscontact_phone] = useState('');
  const [file, setFile] = useState<PickedFile | null>(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageUri, setSelectedImageUri] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [portfolio_job_name, setportfolio_job_name] = useState();
  const [portfolio_company, setportfolio_company] = useState();
  const [portfolio_link, setportfolio_link] = useState('');
  const [rows, setRows] = useState([
  ]);
  const [selectedCountryCode, setSelectedCountryCode] = useState('+994');
  const [nextId, setNextId] = useState(2);

  const addRow = () => {
    const newRow = { id: nextId, job: '', company: '', link: '' };
    setRows([...rows, newRow]);
    setNextId(nextId + 1);
  };

  const deleteRow = (id) => {
    const updatedRows = rows.filter((row) => row.id !== id);
    setRows(updatedRows);
  };
  const {t} = useTranslation();
  const email = useSelector(state => state.auth.email);
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
  const handleJobChange = (text: string, id: number) => {
    setRows((prevRows) =>
      prevRows.map((prevRow) =>
        prevRow.id === id ? { ...prevRow, job: text } : prevRow
      )
    );
  };

  const handleCompanyChange = (text: string, id: number) => {
    setRows((prevRows) =>
      prevRows.map((prevRow) =>
        prevRow.id === id ? { ...prevRow, company: text } : prevRow
      )
    );
  };

  const handleLinkChange = (text: string, id: number) => {
    setRows((prevRows) =>
      prevRows.map((prevRow) =>
        prevRow.id === id ? { ...prevRow, link: text } : prevRow
      )
    );
  };
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
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get('https://movieappi.onrender.com/job');
        setjob(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchJob();
  }, []);
  useEffect(() => {
    const fetchGender = async () => {
      try {
        const response = await axios.get(
          'https://movieappi.onrender.com/gender',
        );
        setgender(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchGender();
  }, []);
  const handleImagePicker = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
      },
      (response: ImagePickerResponse) => {
        if (response.assets && response.assets.length > 0) {
          const asset: Asset = response.assets[0];
          const imageName = asset.uri?.split('/').pop();
          const imagePath = imageName;
          setSelectedImageUri(imagePath);
          setSelectedImage(asset);
        }
      },
    );
  };
  const pickFile = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });

      setFile(result);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker
        console.log('Cancelled');
      } else {
        // Error!
        console.log('Error: ', err);
      }
    }
  };
  const handleOpenDatePicker = () => {
    setOpen(true);
  };
  const handleDateChange = (selectedDate: Date) => {
    setbirth_date(selectedDate);
    setOpen(false);
  };
  // console.log(file);


  const [isLoading, setIsLoading] = useState(false);
  const showAlert = (message: string | undefined) => {
    Alert.alert('Error', message);
  };
  const [nameError, setNameError] = useState('');
  const [surnameError, setSurnameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [fatherNameError, setFatherNameError] = useState('');
  const [positionError, setPositionError] = useState('');
  const [imageError, setImageError] = useState('');
  const [cvError, setCVError] = useState('');
  const nameErrorRef = useRef<TextInput | null>(null);
  const surnameErrorRef = useRef<TextInput | null>(null);
  const emailErrorRef = useRef<TextInput | null>(null);
  const fatherNameErrorRef = useRef<TextInput | null>(null);
  const positionErrorRef = useRef<TextInput | null>(null);
  const imageErrorRef = useRef<TextInput | null>(null);
  const cvErrorRef = useRef<TextInput | null>(null);

  const scrollToInput = (ref: React.MutableRefObject<TextInput | null>) => {
    if (ref.current) {
      ref.current.focus();
    }
  };
  const handleSubmit = async () => {
    try {
      // Check if required fields are empty
     
      const requiredFields = [name, surname, emailll, father_name, position, selectedImage, file];
      const isEmptyField = requiredFields.some(field => !field);

      if (isEmptyField) {
        // Handle required field validation errors
        setNameError(!name ? t('require') : '');
        setSurnameError(!surname ? t('require') : '');
        setEmailError(!emailll ? t('require') : '');
        setFatherNameError(!father_name ? t('require') : '');
        setPositionError(!position ? t('require') : '');
        setImageError(!selectedImage ? t('require') : '');
        setCVError(!file ? t('require') : '');

        if (!name) {
          nameErrorRef.current?.focus();
          scrollToInput(nameErrorRef);
        } else if (!surname) {
          surnameErrorRef.current?.focus();
          scrollToInput(surnameErrorRef)
        } else if (!emailll) {
          emailErrorRef.current?.focus();
          scrollToInput(emailErrorRef)
        } else if (!father_name) {
          fatherNameErrorRef.current?.focus();
          scrollToInput(fatherNameErrorRef)
        } else if (!position) {
          positionErrorRef.current?.focus();
          scrollToInput(positionErrorRef)
        } else if (!selectedImage) {
          imageErrorRef.current?.focus();
          scrollToInput(imageErrorRef)
        } else if (!file) {
          cvErrorRef.current?.focus();
          scrollToInput(cvErrorRef)
        }
        return;
      }
      setIsLoading(true);
  
      const formData = new FormData();
      const formattedDeadline = moment(birth_date).format('YYYY-MM-DD').toString();
  
      // Append user data to the formData
      formData.append('user_id', user_id);
      formData.append('category_id', selectedCategoryId);
      formData.append('city_id', city_id);
      formData.append('education_id', education_id);
      formData.append('experience_id', experience_id);
      formData.append('job_type_id', job_type_id);
      formData.append('gender_id', gender_id);
      formData.append('name', name);
      formData.append('surname', surname);
      formData.append('father_name', father_name);
      formData.append('email', emaill);
      formData.append('position', position);
      formData.append('about_education', about_education);
      formData.append('salary', salary);
      formData.append('birth_date', formattedDeadline);
      formData.append('work_history', work_history);
      formData.append('skills', skills);
      formData.append('contact_phone', contact_phone);
      formData.append('contact_mail', emailll);
      // Prepare portfolio data
      const portfolioData = rows.map(row => ({
        job_name: row.job,
        company: row.company,
        link: row.link,
      }));
      formData.append('portfolio', JSON.stringify(portfolioData));
  
      // Append CV file if selected
      if (file) {
        formData.append('cv', {
          uri: file[0].uri,
          name: file[0].name,
          type: file[0].type,
        });
      }
  
      // Append image if selected
      if (selectedImage) {
        formData.append('image', {
          uri: selectedImage.uri,
          type: selectedImage.type,
          name: selectedImage.fileName,
        });
      }
  
      const response = await axios.post(
        'https://movieappi.onrender.com/civi',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
  
      // Clear form fields after successful submission
      setname('');
      setsurname('');
      setabout_education('');
      setfather_name('');
      setposition('');
  
      setIsSuccessModalVisible(true);
      setTimeout(() => {
        setIsSuccessModalVisible(false);
      }, 1000);
      setIsLoading(false);
    } catch (error) {
      console.error('Error adding CV:', error.response.data);
      setIsLoading(false);
      Alert.alert('Error', 'Error adding CV');
    }
  };
  
  const maxDate = new Date('2023-01-01');
  const onChange = (event: any, selectedDate: Date) => {
    const currentDate = selectedDate || birth_date;
    setOpen(Platform.OS === 'ios');
    setbirth_date(selectedDate);
  };
  
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

  return (
    <><ScrollView
      style={{ width: '100%', height: '100%', backgroundColor: isDarkMode ? '#131313' : '#F4F9FD' }}>
      <Text
        style={{
          color: isDarkMode ? '#FDFDFD' : '#020202',
          fontSize: 16,
          fontWeight: 600,
          marginHorizontal: 20,
        }}>
        {t('information')}
      </Text>
      <TextInput
  placeholder={t('name_add')}
  value={name}
  ref={nameErrorRef}
  onChangeText={setname}
  style={[
    styles.input,
    {
      backgroundColor: isDarkMode ? "#1B1523" : '#FFFFFF',
      color: isDarkMode ? "#FFFFFF" : "black", // Set the text color based on the mode
      textAlignVertical: "center", // Center vertically
    },
  ]}
  placeholderTextColor={isDarkMode ? "#FDFDFD" : "gray"}
// Center horizontally
/>
<Text style={styles.errorText}>{nameError}</Text>


      <TextInput
        placeholder={t('surname_add')}
        value={surname}
        onChangeText={setsurname}
        style={[
          styles.input,
          {
            backgroundColor: isDarkMode ? "#1B1523" : '#FFFFFF',
            color: isDarkMode ? "#FFFFFF" : "black",
            textAlignVertical: "center", // Set the text color based on the mode
          },
        ]}
        ref={surnameErrorRef}
        placeholderTextColor={isDarkMode ? "#FDFDFD" : "gray"} />
         <Text style={styles.errorText}>{surnameError}</Text>
      <TextInput
        placeholder={t('father_add')}
        value={father_name}
        onChangeText={setfather_name}
ref={fatherNameErrorRef}
        textAlignVertical="top"
        style={[
          styles.input,
          {
            backgroundColor: isDarkMode ? "#1B1523" : '#FFFFFF',
            color: isDarkMode ? "#FFFFFF" : "black", 
            textAlignVertical: "center",// Set the text color based on the mode
          },
        ]}
        placeholderTextColor={isDarkMode ? "#FDFDFD" : "gray"} />
         <Text style={styles.errorText}>{fatherNameError}</Text>
      <TextInput
  placeholder={t('email')}
  value={emailll}
  onChangeText={setEmail}
  ref={emailErrorRef}
  style={[
    styles.input,
    {
      backgroundColor: isDarkMode ? "#1B1523" : '#FFFFFF',
      color: isDarkMode ? "#FFFFFF" : "black", // Set the text color based on the mode
      textAlignVertical: "center", // Center vertically
    },
  ]}
  placeholderTextColor={isDarkMode ? "#FDFDFD" : "gray"}
  keyboardType="email-address"
// Center horizontally
/>
<Text style={styles.errorText}>{emailError}</Text>
      <TextInput
        placeholder={t('position_add')}
        value={position}
        onChangeText={setposition}
ref={positionErrorRef}
        textAlignVertical="top"
        style={[
          styles.input,
          {
            backgroundColor: isDarkMode ? "#1B1523" : '#FFFFFF',
            color: isDarkMode ? "#FFFFFF" : "black",
            textAlignVertical: "center", // Set the text color based on the mode
          },
        ]}
        placeholderTextColor={isDarkMode ? "#FDFDFD" : "gray"} />
         <Text style={styles.errorText}>{positionError}</Text>
      <Text
        style={{
          color: isDarkMode ? "white" : 'black',
          fontSize: 16,
          fontWeight: 600,
          marginHorizontal: 20,
          marginTop: 20,
        }}>
        {t('gostericiler')}
      </Text>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          marginTop: 20, // Added horizontal padding to the parent view
        }}>


        <View
          style={{
            borderRadius: 10,
            flex: 1,
            marginRight: 10,
            backgroundColor: isDarkMode ? "#1B1523" : '#F4F9FD',
            // boxShadow is not supported in React Native, so we'll use elevation for Android
            elevation: 4,
            // Additional styles to make sure the Picker is visible
            borderWidth: 1,
            borderColor: '#ccc',
            overflow: 'hidden',
          }} >
          <Picker
            placeholder="Select a city"
            selectedValue={selectedCategoryId}
            onValueChange={value => setSelectedCategoryId(value)}
            dropdownIconColor={isDarkMode ? 'white' : 'black'}>
            {categories.map(category => (
              <Picker.Item
                key={category.id}
                value={category.id}
                label={category.title_az}
                color={isDarkMode ? 'white' : 'black'} />
            ))}
          </Picker>
        </View>
        <View
          style={{
            borderRadius: 10,
            flex: 1,
            marginRight: 10,
            backgroundColor: isDarkMode ? "#1B1523" : '#F4F9FD',
            // boxShadow is not supported in React Native, so we'll use elevation for Android
            elevation: 4,
            // Additional styles to make sure the Picker is visible
            borderWidth: 1,
            borderColor: '#ccc',
            overflow: 'hidden',
          }}>
          <Picker
            placeholder="Select a city"
            selectedValue={city_id}
            onValueChange={value => setcity_id(value)}
            dropdownIconColor={isDarkMode ? 'white' : 'black'}>
            {cities.map(category => (
              <Picker.Item
                key={category.id}
                value={category.id}
                label={category.title_az}
                color={isDarkMode ? 'white' : 'black'} />
            ))}
          </Picker>
        </View>

        <View
          style={{
            borderRadius: 10,
            flex: 1,
            backgroundColor: isDarkMode ? "#1B1523" : '#F4F9FD',
            // boxShadow is not supported in React Native, so we'll use elevation for Android
            elevation: 4,
            // Additional styles to make sure the Picker is visible
            borderWidth: 1,
            borderColor: '#ccc',
            overflow: 'hidden',
          }}>
          <Picker
            placeholder="Select education"
            selectedValue={education_id}
            onValueChange={value => seteducation_id(value)}
            dropdownIconColor={isDarkMode ? 'white' : 'black'}>
            {education.map(category => (
              <Picker.Item
                key={category.id}
                value={category.id}
                label={category.title_az}
                color={isDarkMode ? 'white' : 'black'} />
            ))}
          </Picker>
        </View>
      </View>

      <View
        style={{
          width: '100%',
          height: 60,
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          marginTop: 20, // Added horizontal padding to the parent view
        }}>
        <View
          style={{
            borderRadius: 10,
            flex: 1,
            marginRight: 10,
            backgroundColor: isDarkMode ? "#1B1523" : '#F4F9FD',
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
            dropdownIconColor={isDarkMode ? 'white' : 'black'}>
            {experience.map(category => (
              <Picker.Item
                key={category.id}
                value={category.id}
                label={category.title_az}
                color={isDarkMode ? 'white' : 'black'} />
            ))}
          </Picker>
        </View>
        <View
          style={{
            borderRadius: 10,
            flex: 1,
            marginRight: 10,
            backgroundColor: isDarkMode ? "#1B1523" : '#F4F9FD',
            // boxShadow is not supported in React Native, so we'll use elevation for Android
            elevation: 4,
            // Additional styles to make sure the Picker is visible
            borderWidth: 1,
            borderColor: '#ccc',
            overflow: 'hidden',
          }}>
          <Picker
            placeholder="Select a company"
            selectedValue={job_type_id}
            onValueChange={value => setjob_type_id(value)}
            dropdownIconColor={isDarkMode ? 'white' : 'black'}
          >
            {job.map(category => (
              <Picker.Item
                key={category.id}
                value={category.id}
                label={category.title_az}
                color={isDarkMode ? 'white' : 'black'} />
            ))}
          </Picker>
        </View>
        <View
          style={{
            borderRadius: 10,
            flex: 1,
            // Added right margin to create space between the boxes
            backgroundColor: isDarkMode ? "#1B1523" : '#F4F9FD',
            // boxShadow is not supported in React Native, so we'll use elevation for Android
            elevation: 4,
            // Additional styles to make sure the Picker is visible
            borderWidth: 1,
            borderColor: '#ccc',
            overflow: 'hidden',
          }}>
    <TextInput
  placeholder={t('minsalary')}
  value={salary}
  onChangeText={setsalary}
  placeholderTextColor={isDarkMode ? 'white' : 'black'}
  style={{
    width: '100%',
    height: 40, // Adjust the height to a suitable value
    alignSelf: 'center',
    textAlign: 'center',
    borderRadius: 10,
    textAlignVertical: 'top',
    padding: 7,
    marginTop: 8,
    color: isDarkMode ? 'white' : 'black', // Set the text color here
  }}
  keyboardType='numeric'
/>

        </View>
      </View>
      <Text
        style={{
          color: isDarkMode ? "white" : '#020202',
          fontSize: 16,
          fontWeight: 600,
          marginHorizontal: 20,
          marginTop: 20,
        }}>
        {t('sexsi')}
      </Text>
      <View style={{ flex: 1, flexDirection: 'row', marginHorizontal: 20 }}>
        <View style={{ flex: 1 }}>
          <View style={styles.inputContainers}>
            <View style={[styles.input4, { backgroundColor: isDarkMode ? "#1B1523" : 'white', borderColor: isDarkMode ? 'white' : 'black', }]}>
              <TextInput
                style={{ flex: 1, color: isDarkMode ? "white" : '#020202', paddingHorizontal: 10 }}
                placeholder={label}
                value={moment(birth_date).format('YYYY-MM-DD').toString()}
                editable={false} />
              <TouchableOpacity style={styles.iconButton} onPress={handleOpenDatePicker}>
                <Icon name="calendar" color={isDarkMode ? "white" : '#020202'} />
              </TouchableOpacity>
            </View>
          </View>

          {open && (
     <DateTimePicker
     testID="dateTimePicker"
     value={birth_date}
     mode="date"
     is24Hour={true}
     display="default"
     onChange={onChange}
     maximumDate={maxDate} // Set the maximum date limit
    />
          )}
        </View>
        <View style={{ flex: 1, marginLeft: 20 }}>
          <Picker
            placeholder="Select a company"
            selectedValue={gender_id}
            onValueChange={value => setgender_id(value)}
            style={[styles.picker, { backgroundColor: isDarkMode ? "#1B1523" : 'white' },]}
            dropdownIconColor={isDarkMode ? 'white' : 'black'}
          >
            {gender.map(category => (
              <Picker.Item
                key={category.id}
                value={category.id}
                label={category.title_az}
                color={isDarkMode ? 'white' : 'black'} />
            ))}
          </Picker>
        </View>

      </View>
      <View style={{ marginHorizontal: 20 }} ref={imageErrorRef}>
        <CustomTextInput
          placeholder={t('sekiladd')}
          value={selectedImage ? selectedImage.uri : ''}
          onPress={handleImagePicker}   />

        {selectedImage && (
          <Image
            source={{ uri: selectedImage.uri }}
            style={{ width: 200, height: 200 }} />
        )}
         <Text style={styles.errorText}>{imageError}</Text>
      </View>

      <Text
        style={{
          color: isDarkMode ? "white" : '#020202',
          fontSize: 16,
          fontWeight: 600,
          marginHorizontal: 20,
          marginTop: 20,
        }}>
        {t('about_education')}
      </Text>

      <TextInput
        style={[styles.input3, {
          backgroundColor: isDarkMode ? "#1B1523" : "#FFFFFF",
          color: isDarkMode ? "#FFFFFF" : "black", // Set the text color based on the mode
        },
      ]}
      placeholderTextColor={isDarkMode ? "#FDFDFD" : "gray"} 
        value={about_education}
        onChangeText={setabout_education}
        textAlignVertical="top" />
      <Text
        style={{
          color: isDarkMode ? "white" : '#020202',
          fontSize: 16,
          fontWeight: 600,
          marginHorizontal: 20,
          marginTop: 20,
        }}>
        {t('about_workhistory')}
      </Text>
      <TextInput
        style={[styles.input3, {
          backgroundColor: isDarkMode ? "#1B1523" : "#FFFFFF",
          color: isDarkMode ? "#FFFFFF" : "black", // Set the text color based on the mode
        },
      ]}
      placeholderTextColor={isDarkMode ? "#FDFDFD" : "gray"} 
        value={work_history}
        onChangeText={setwork_history}
        textAlignVertical="top" />
      <Text
        style={{
          color: isDarkMode ? "white" : '#020202',
          fontSize: 16,
          fontWeight: 600,
          marginHorizontal: 20,
          marginTop: 20,
        }}>
        {t('sertificate')}
      </Text>



      <TextInput style={[styles.input3,  {
          backgroundColor: isDarkMode ? "#1B1523" : "#FFFFFF",
          color: isDarkMode ? "#FFFFFF" : "black", // Set the text color based on the mode
        },
      ]}
      placeholderTextColor={isDarkMode ? "#FDFDFD" : "gray"}  value={skills} onChangeText={setskills} textAlignVertical="top" />
      <Text
        style={{
          color: isDarkMode ? "white" : '#020202',
          fontSize: 16,
          fontWeight: 600,
          marginHorizontal: 20,
          marginTop: 20,
        }}>
        {t('portfolio')}
      </Text>
      <View style={{ marginHorizontal: 20 }}>
        {rows.map((row) => (
          <View key={row.id} style={{ flexDirection: 'row', marginTop: 20 }}>
          <TextInput
  value={row.job}
  onChangeText={(text) => handleJobChange(text, row.id)}
  placeholder={t('is')}
  placeholderTextColor={isDarkMode ? '#FDFDFD' : 'black'}
  style={[
    styles.textInput,
    {
      marginRight: 10,
      backgroundColor: isDarkMode ? '#000000' : '#FFFFFF',
      color: isDarkMode ? 'white' : 'black', // Set the text color here
    },
  ]}
/>

<TextInput
  placeholderTextColor={isDarkMode ? '#FDFDFD' : 'black'}
  style={[
    styles.textInput,
    {
      marginRight: 10,
      backgroundColor: isDarkMode ? '#000000' : '#FFFFFF',
      color: isDarkMode ? 'white' : 'black', // Set the text color here
    },
  ]}
  value={row.company}
  onChangeText={(text) => handleCompanyChange(text, row.id)}
  placeholder={t('company')}
/>

<TextInput
  placeholderTextColor={isDarkMode ? '#FDFDFD' : 'black'}
  style={[
    styles.textInput,
    {
      marginRight: 10,
      backgroundColor: isDarkMode ? '#000000' : '#FFFFFF',
      color: isDarkMode ? 'white' : 'black', // Set the text color here
    },
  ]}
  value={row.link}
  onChangeText={(text) => handleLinkChange(text, row.id)}
  placeholder={t('links')}
/>


            {rows.length > 1 && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteRow(row.id)}
              >
                <Icon name="remove" size={24} color="red" />
              </TouchableOpacity>
            )}
          </View>
        ))}

        <TouchableOpacity style={styles.addButton} onPress={addRow}>
          <Text style={styles.addButtonText}>{t('add_job')}</Text>
        </TouchableOpacity>
      </View>

      <Text
        style={{
          color: isDarkMode ? "white" : '#020202',
          fontSize: 16,
          fontWeight: 600,
          marginHorizontal: 20,
          marginTop: 20,
        }}>
        {t('elaqe')}
      </Text>
      <TextInput
  placeholder={t('email_add')}
  value={emaill}
  onChangeText={setemail}
  placeholderTextColor={isDarkMode ? '#FDFDFD' : 'black'}
  style={[
    styles.input,
    {
      marginRight: 10,
      backgroundColor: isDarkMode ? "#1B1523" : '#FFFFFF',
      color: isDarkMode ? 'white' : 'black', // Set the text color here
    },
  ]}
  keyboardType="email-address"
/>





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

    </Picker>
    <TextInput
  placeholder={t('tel')}
  value={contact_phone.replace(selectedCountryCode, '')}
  onChangeText={(text) => {
    // Remove all non-numeric characters from the input
    const numericValue = text.replace(/[^0-9]/g, '');

    // Set the state with the selected country code and numeric value
    if (numericValue.length <= 10) {
      setscontact_phone(`${selectedCountryCode}${numericValue}`);
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
        <Text
          style={{
            color: isDarkMode ? "white" : '#020202',
            fontSize: 16,
            fontWeight: '600',
            marginHorizontal: '5%',
            marginTop: 20,
          }}>
        {t('cv_file')}
      </Text><View style={{ flexDirection: 'row', marginHorizontal: '5%', marginTop: 20 }}>
        <View style={{ flex: 1, marginRight: '5%' }}>
          <View
            style={{
              width: '100%',
              backgroundColor: colors.primary,
              borderRadius: 10,
              marginBottom: 20, // Add marginBottom for spacing
            }}>
            <Text style={{ color: 'white', padding: 10, textAlign: 'center' }}>
              {t('cv_text')}
            </Text>
          </View>
 <View ref={cvErrorRef}>
 {file ? (
            <Text
              style={{
                color: 'white',
                padding: 15,
                backgroundColor: colors.primary,
                textAlign: 'center',
              }}>
              {file[0].name}
            </Text>

          ) : (
            <TouchableOpacity onPress={pickFile} style={[styles.fileButton, { backgroundColor: isDarkMode ? "#1B1523" : '#F4F9FD' },]}>
              <Text style={{ padding: 10, alignSelf: "center", color: isDarkMode ? "white" : '#020202', }}>   {t('add')}</Text>
              <Icon
                name="plus"
                size={16}
                color="#282828"
                style={[styles.plusIcon, { color: isDarkMode ? "white" : '#020202' }]}
                onPress={onPress} />

            </TouchableOpacity>

          )}

<Text style={styles.errorText}>{cvError}</Text>
 </View>
        </View>
      </View><View style={{ margin: 20 }}>
      <Pressable onPress={handleSubmit} style={styles.pressableButton} disabled={isLoading}>
  {isLoading ? (
    <View style={styles.centeredContent}>
      <ActivityIndicator
        color={isDarkMode.toString() === 'dark' ? 'white' : 'white'}
        size={'small'}
      />
    </View>
  ) : (
    <Text style={[styles.buttonText, { color: 'white', textAlign: 'center' }]}>{t('add')}</Text>
  )}
</Pressable>




      </View><Modal visible={isSuccessModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modal}>
            <LottieView
              source={SuccessAnimation}
              style={styles.animation}
              autoPlay={true}
              loop={false} />
          </View>
        </View>
      </Modal>

   

    </ScrollView>
 
 </>);
};

export default AddCvForm;

const styles = StyleSheet.create({
  input: {
    width: '90%',
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
    marginTop: 20,
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  errorText: {
    color: 'red', // You can change the color to your desired error text color
    fontSize: 14, // You can adjust the font size
    marginBottom: 5,
    marginLeft:20 // You can add some space below the error text
  },
  input4: {
    flex: 1,
    height: 55,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: '#ccc',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  iconButton: {
    padding: 10,
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
    width: '90%',
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
  input2: {
    width: '40%',
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
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  button: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 17,
    width: '40%',
    height: 55,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent:"center", 
  },
  buttonText: {
    color: '#333333',
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
  },
  picker: {
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
    width: '90%',
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
    padding: 15,
    alignItems: 'center',
    borderRadius: 10,
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
    marginBottom: 60,
    alignSelf: 'center',
  },
});