import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  TextInput,
  Button,
  Image,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  Pressable,
  Modal,
  useColorScheme,
  ActivityIndicator,
  Dimensions,
  Platform,
} from 'react-native';
import {
  Asset,
  ImagePickerResponse,
  launchImageLibrary,
} from 'react-native-image-picker';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Dropdown } from 'react-native-element-dropdown';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTranslation } from 'react-i18next';
import { borderRadius, colors, spacing } from '../assets/themes';
import SuccessAnimation from '../animations/success.json';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SearchablePicker from './SearchablePicker';
const AddTrainingComponent = ({ label }: any) => {
  const [user_id, setUserId] = useState('');
  const [title, setTitle] = useState('');
  const [about, setAbout] = useState('');
  const [price, setPrice] = useState('');
  const [redirect_link, setRedirectLink] = useState('');
  const [date, setDate] = useState(new Date());
  const [deadline, setDeadline] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageUri, setSelectedImageUri] = useState(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null
  );
  const [imageUrl, setImageUrl] = useState('');
  const email = useSelector((state) => state.auth.email);
  const {t} = useTranslation();
  const [isFocus, setIsFocus] = useState(false);
  const [trainings, settrainings] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const isDarkMode = useColorScheme() == 'dark';
  useEffect(() => {
    if (trainings.payment_type === 0) {
      setSelectedOption('0'); // Free
    } else {
      setSelectedOption('1'); // Pay
    }
  }, [trainings.payment_type]);


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
 
        const data = response.data;
        const loggedInUser = data.find(user => user.email === email);

        if (loggedInUser) {
          setUserId(loggedInUser.id);
          console.log('API response:', response.data);

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
  if (user_id) { // Ensure user_id is available before making the API call
    axios
      .get(`https://movieappi.onrender.com/company/${user_id}`)
      .then(response => {
        setCompanies(response.data);
        console.log(response.data);
      })
      .catch(error => {
        console.error('API call failed:', error);
      });
  }
}, [user_id]); // Add user_id as a dependency to this useEffect

  const handleOpenDatePicker = () => {
    setOpen(true);
  };
  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const response = await axios.get(
          'https://movieappi.onrender.com/trainings',
        );
        settrainings(response.data[0] || {});

      } catch (error) {
        console.error(error);
      }
    };

    fetchTrainings();
  }, []);

  const handleDateChange = (selectedDate: Date) => {
    setDeadline(selectedDate);
    setOpen(false);
  };
  const maxDate = new Date('2023-01-01');
  const onChange = (event: any, selectedDate: Date) => {
    const currentDate = selectedDate || deadline;
    setOpen(Platform.OS === 'ios');
    setDeadline(selectedDate);
  };
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
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const showAlert = (message: string | undefined) => {
    Alert.alert('Error', message);
  };
  
  const [imageError, setImageError] = useState('');
  const [titleError, setTitleError] = useState('');
  const [redirectLinkError, setRedirectLinkError] = useState('');
  const titleRef = useRef<TextInput | null>(null);
  const imageRef = useRef<TextInput | null>(null);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
  
      // Check if required fields are empty
      if (!title) {
        setTitleError(t('require'));
        titleRef?.current?.focus();
        setIsLoading(false);
        return;
      }
  
      if (!selectedImage) {
        setImageError(t('require'));
        imageRef?.current?.focus();
        setIsLoading(false);
        return;
      }
  
      const formData = new FormData();
      const formattedDeadline = moment(deadline).format('YYYY-MM-DD').toString();
  
      formData.append('user_id', user_id);
      formData.append('company_id', selectedCompanyId || '');
      formData.append('title', title);
      formData.append('about', about);
      formData.append('payment_type', selectedOption);
      formData.append('price', selectedOption === '1' ? price : '0');
  
      // Validate the redirect_link
      if (!isValidURL(redirect_link)) {
        setRedirectLinkError('Invalid URL');
        setIsLoading(false);
        return;
      }
  
      formData.append('redirect_link', redirect_link);
      formData.append('deadline', formattedDeadline);
  
      // Check if an image is selected
      if (selectedImage) {
        formData.append('image', {
          uri: selectedImage.uri,
          type: selectedImage.type,
          name: selectedImage.fileName,
        });
      }
  
      const response = await axios.post(
        'https://movieappi.onrender.com/training',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
  
      setRedirectLink('');
      setSelectedCompanyId(response.data.company_id);
      setIsSuccessModalVisible(true);
      setTimeout(() => {
        setIsSuccessModalVisible(false);
      }, 1000);
      setIsLoading(false);
    } catch (error) {
      console.error('Error adding training', error.response.data);
      Alert.alert('Error', 'Error adding training');
      setIsLoading(false);
    }
  };
  
  // Function to validate a URL using a regular expression
  const isValidURL = (url) => {
    const urlPattern = /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,63})(:[0-9]{1,5})?\/?(\S+)?$/;
    return urlPattern.test(url);
  };
  
  
  
  

  return (
    <>
      <View style={{ alignItems: 'center' }}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: isDarkMode ? "white" : 'black' }}>
        {t('add_information')}
        </Text>
        <TextInput
          placeholder={t('telim_add')}
          value={title}
          onChangeText={setTitle}
          style={[
            styles.container,
            {
              backgroundColor: isDarkMode ? "#1B1523" : "#FFFFFF",
              color: isDarkMode ? "#FFFFFF" : "black", // Set the text color based on the mode
            },
          ]}
          ref={titleRef}
          placeholderTextColor={isDarkMode ? "#FDFDFD" : "gray"}
        />
 <Text style={styles.errorText}>{titleError}</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input,  {backgroundColor: isDarkMode ? "#1B1523" : 'white', color: isDarkMode ? "white" : 'black'},]}
            placeholder={label}
            value={moment(deadline).format('YYYY-MM-DD').toString()}
            editable={false}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleOpenDatePicker}
          >
               <Icon name="calendar" color= {isDarkMode ? "white" : 'black'}/>
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

        <Text
          style={{
            alignSelf: 'flex-start',
            marginLeft: 20,
            color: isDarkMode ? "white" : 'black',
            fontSize: 16,
            fontWeight: '500',
          }}
        >
         {t('about_telim')}
        </Text>

        <TextInput
          value={about}
          onChangeText={setAbout}

          textAlignVertical="top"
          style={[
            styles.container3,
            {
              backgroundColor: isDarkMode ? "#1B1523" : "#FFFFFF",
              color: isDarkMode ? "#FFFFFF" : "black", // Set the text color based on the mode
            },
          ]}
          placeholderTextColor={isDarkMode ? "#FDFDFD" : "gray"}
        />

        <View style={{ flexDirection: 'row', marginHorizontal: 20 }}>
          <View style={{ marginHorizontal: 10, width: '50%' }}>
            <Text style={{ color: isDarkMode ? "white" : 'black', fontSize: 14, fontWeight: '600' }}>
            {t('sirketler')}
            </Text>
          
<SearchablePicker
  items={companies.map((company) => ({
    value: company.id.toString(),
    label: company.name,
  }))}
  selectedValue={selectedCompanyId}
  onValueChange={(value) => setSelectedCompanyId(value)}
  placeholder={!isFocus ? t('choose_company') : '...'}
/>




          </View>
          <View style={{ width: '50%' }}>
            <Text style={{ color: isDarkMode ? "white" : 'black', fontSize: 14, fontWeight: '600' }}>
            {t('payment_type')}
            </Text>
            <Picker
            selectedValue={selectedOption}
            onValueChange={(itemValue) => setSelectedOption(itemValue)}
            style={{
              width: Dimensions.get('window').width * 0.42, // Adjust the multiplier as needed
              borderColor: isDarkMode ? 'white' : 'black',
              borderWidth: 1,
              color: isDarkMode ? 'white' : 'black',
              backgroundColor: isDarkMode ? '#1B1523' : 'white',
              borderRadius: 20,
            }}
            
          >
            <Picker.Item label={t('free')} value="0" color={ isDarkMode ? 'black' : 'black' } />
            <Picker.Item label={t('pay')} value="1" />
          </Picker>
          {selectedOption === '1' && (
            <TextInput
              placeholder="Price"
              value={price}
              onChangeText={setPrice}
              style={{
                flexDirection: 'row',
                paddingVertical: 19,
                alignItems: 'center', // Align vertically centered
                paddingHorizontal: 14,
                marginVertical: 10,
                width: Dimensions.get('window').width * 0.42, // Adjust the multiplier as needed
                height: 55,
                backgroundColor: isDarkMode ? '#1B1523' : 'white',
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                borderRadius: 10,
                justifyContent: 'space-between',
              }}
            placeholderTextColor={ isDarkMode ? "white" : 'black'}
            />
          )}
          </View>
        </View>
        <View>
          <Text
            style={{
              alignSelf: 'flex-start',
              color: isDarkMode ? "white" : 'black',
              fontSize: 16,
              fontWeight: '500',
            }}
          >
            {t('link')}
          </Text>
          <TextInput
            placeholder= {t('daxil_et')}
            value={redirect_link}
            onChangeText={setRedirectLink}
            style={[
              styles.container,
              {
                backgroundColor: isDarkMode ? "#1B1523" : '#FFFFFF',
                color: isDarkMode ? "#FFFFFF" : "black", // Set the text color based on the mode
              },
            ]}
            placeholderTextColor={isDarkMode ? "#FDFDFD" : "gray"}
          />
           <Text style={styles.errorText}>{titleError}</Text>
        </View>

        <View>
          <Text
            style={{
              alignSelf: 'flex-start',
              color: isDarkMode ? "white" : 'black',
              fontSize: 16,
              fontWeight: '500',
            }}
          >
            {t('add_image')}
          </Text>
          <Pressable onPress={handleImagePicker} style={[styles.container5,  {backgroundColor: isDarkMode ? "#1B1523" : 'white'},]} ref={imageRef}>
            <Text style={{ color: isDarkMode ? 'white' : 'black',}}>{t('add_image')}</Text>
          </Pressable>

          {selectedImage && (
            <Image
              source={{ uri: selectedImage.uri }}
              style={{ width: 200, height: 200 }}
            />
          )}
           <Text style={styles.errorText}>{imageError}</Text>
        </View>

        <View>
        <Pressable onPress={handleSubmit} style={styles.buttonSub} disabled={isLoading}>
  {isLoading ? (
    <View style={styles.loaderContainer}>
      <ActivityIndicator
        color={isDarkMode.toString() === 'dark' ? 'white' : 'white'}
        size={'small'}
      />
    </View>
  ) : (
    <Text
      style={{
        textAlign: 'center',
        marginTop: 8,
        fontSize: 14,
        fontWeight: '600',
        color: 'white',
      }}
    >
      {t('addd')}
    </Text>
  )}
</Pressable>

        </View>
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
    </>
  );
};

export default AddTrainingComponent;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 19,
    paddingHorizontal: 14,
    marginVertical: 10,
    width: 370,
    height: 55,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    // backgroundColor: '#FFFFFF',
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  errorText: {
    color: 'red', // You can change the color to your desired error text color
    fontSize: 14, // You can adjust the font size
    marginBottom: 5,
    marginLeft:20 // You can add some space below the error text
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  container3: {
    flexDirection: 'row',
    paddingVertical: 19,
    paddingHorizontal: 14,
    marginVertical: 10,
    width: 370,
    height: 250,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    borderRadius: 10,
  },
  container4: {
    flexDirection: 'row',
    paddingVertical: 19,
    alignItems: 'flex-start',
    paddingHorizontal: 14,
    marginVertical: 10,
    width: 170,
    height: 55,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    borderRadius: 10,
    justifyContent: 'space-between',
  },
  container5: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 14,
    marginVertical: 10,
    width: 370,
    height: 55,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    borderRadius: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
  },
  container2: {
    margin: 20,
  },
  dropdown: {
    height: 50,
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  input: {
    width: 370,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    marginLeft: 35,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    marginRight: 75,
  },
  buttonText: {
    color: '#333333',
    fontWeight: 'bold',
  },
  buttonSub: {
    width: 120,
    height: 40,
    backgroundColor: '#9559E5',
    borderRadius: 10,
    marginBottom: 75,
    marginTop: 10,
  },
});
