import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  Text,
  Pressable,
  TouchableOpacity,
  Dimensions,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import {
  Asset,
  ImagePickerResponse,
  launchImageLibrary,
} from 'react-native-image-picker';
import Modal from 'react-native-modal';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import ModalDropdown from 'react-native-modal-dropdown';
import SuccessAnimation from '../animations/success.json';
import LottieView from 'lottie-react-native';
import { borderRadius, colors, spacing } from '../assets/themes';
import SocialMediaInput from './SocialMediaInput';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
const windowWidth = Dimensions.get('window').width;

const AddCompanyModal = ({ isVisible, closeModal, addCompany, route }: any) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  const [sectors, setSectors] = useState([]);
  const [website, setWebsite] = useState('');
  const [map, setMap] = useState('');
  const [about, setAbout] = useState('');
  const [hr, setHr] = useState('');
  const [instagram, setInstagram] = useState('');
  const [facebook, setFacebook] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [twitter, setTwitter] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageUri, setSelectedImageUri] = useState(null);
  const [selectedSectorId, setSelectedSectorId] = useState(sectors[0]?.id || null);
  const [value, setValue] = useState(sectors[0]?.title_az || 'Select sector');
  const [loggedInUserId, setLoggedInUserId] = useState('');
  const [user_id, setUserId] = useState('');
  const email = useSelector(state => state.auth.email);
  const isDarkMode = useColorScheme() === 'dark'
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const {t} = useTranslation();
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
            console.log('API response:  kjnhuij', response.data);
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
console.log(user_id)
  useEffect(() => {
    const fetchSectors = async () => {
      try {
        const response = await axios.get('https://movieappi.onrender.com/sectors');
        setSectors(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSectors();
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

  const [isLoading, setIsLoading] = useState(false);
  const [nameError, setNameError] = useState('');
  const [selectedSectorIdError, setSelectedSectorIdError] = useState('');
  const [aboutError, setAboutError] = useState('');
  const [websiteError, setWebsiteError] = useState('');
  const [mapError, setMapError] = useState('');
  const [addressError, setAddressError] = useState('');
  const nameInputRef = useRef<TextInput | null>(null);
  const selectedSectorIdInputRef = useRef<TextInput | null>(null);
  const aboutInputRef = useRef<TextInput | null>(null);
  const websiteInputRef = useRef<TextInput | null>(null);
  const mapInputRef = useRef<TextInput | null>(null);
  const addressInputRef = useRef<TextInput | null>(null);
  const imageInputRef = useRef<TextInput | null>(null);
  const [imageError, setImageError] = useState('');

  const scrollToInput = (ref: React.MutableRefObject<TextInput | null>) => {
    if (ref.current) {
      ref.current.focus();
    }
  };
  const handleAddCompany = async () => {
    try {
      setIsLoading(true);
      setImageError('');
      setNameError('');
      setSelectedSectorIdError('');
      setAboutError('');
      setWebsiteError('');
      setMapError('');
      const selectedSector = sectors.find(sector => sector.id === selectedSectorId);
      if (!name) {
        setNameError(t('require'));
        nameInputRef.current?.focus();
        scrollToInput(nameInputRef);
        setIsLoading(false);
        return;
      }
      if (!selectedImage) {
        setImageError(t('require'));
        setIsLoading(false);
        scrollToInput(imageInputRef)
        return;
      }
      if (!selectedSectorId) {
        setSelectedSectorIdError(t('require'));
        // Optionally, you can scroll to the sector input if it's not in the view
 
        scrollToInput(selectedSectorIdInputRef);
        setIsLoading(false);
        return;
      }

      if (!about) {
        setAboutError(t('require'));
        aboutInputRef.current?.focus();
        setIsLoading(false);
        scrollToInput(aboutInputRef)
        return;
      }
      if (!address) {
        setAddressError(t('require'));
        addressInputRef.current?.focus();
        setIsLoading(false);
        scrollToInput(addressInputRef)
        return;
      }

      if (!website) {
        setWebsiteError(t('require'));
        websiteInputRef.current?.focus();
        setIsLoading(false);
        scrollToInput(websiteInputRef)
        return;
      }

      if (!map) {
        setMapError(t('require'));
        mapInputRef.current?.focus();
        setIsLoading(false);
        scrollToInput(mapInputRef)
        return;
      }
      if (selectedSector) {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('address', address);
        formData.append('user_id', user_id);
        formData.append('sector_id', selectedSectorId);
        formData.append('about', about);
        formData.append('website', website);
        formData.append('map', map);
        formData.append('hr', hr);
        formData.append('instagram', instagram);
        formData.append('facebook', facebook);
        formData.append('linkedin', linkedin);
        formData.append('twitter', twitter);
        if (selectedImage) {
          formData.append('image', {
            uri: selectedImage.uri,
            type: selectedImage.type,
            name: selectedImage.fileName,
          });
        }
      
        const response = await axios.post(
          'https://movieappi.onrender.com/companiy',
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          },
        );
console.log(formData)
        // Reset input fields
        setName('');
        setAddress('');
        setAbout('');
        setWebsite('');
        setMap('');
        setHr('');
        setInstagram('');
        setFacebook('');
        setLinkedin('');
        setTwitter('');
        console.log(response.data)
        // Close the modal
        closeModal();
        console.log(response.data);
        setIsSuccessModalVisible(true);
        setTimeout(() => {
          setIsSuccessModalVisible(false);
        }, 1000);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error adding company', error.response.data);
      Alert.alert('Error', 'Error adding company');
      setIsLoading(false);
    }
  };

  
  return (
    <><Modal isVisible={isVisible} onBackdropPress={closeModal}>
      <ScrollView style={[styles.modalContainer,    { backgroundColor: isDarkMode  ? "#131313" : '#F4F9FD'},]}>
        <Text style={[styles.text, {color: isDarkMode  ? "white" : '#020202'}]}>{t('name')}</Text>
        <TextInput
 style={[
  styles.input,
  {
    backgroundColor: isDarkMode ? "#1B1523" : '#FFFFFF',
    color: isDarkMode ? "#FFFFFF" : "black", // Set the text color based on the mode
  },
]}
ref={nameInputRef}
placeholderTextColor={isDarkMode ? "#FDFDFD" : "gray"}
          placeholder={t('name')}
          value={name}
          onChangeText={setName} />
 <Text style={styles.errorText}>{nameError}</Text>
        <Text style={[styles.text,{color: isDarkMode  ? "white" : '#020202'}]}>{t('sector')}</Text>
<View   ref={selectedSectorIdInputRef}>
<Picker
  style={[
    styles.dropdown,
    { backgroundColor: isDarkMode  ? "#1B1523" : '#F4F9FD' },
  ]}
  dropdownIconColor={isDarkMode ? 'white' : 'black'}
  selectedValue={value}
  onValueChange={(itemValue, itemIndex) => {
    setValue(itemValue);
    const selectedSector = sectors.find(company => company.title_az === itemValue);
    setSelectedSectorId(selectedSector?.id);
    console.log(selectedSector?.id);
  }}
>
  {sectors.map(company => (
    <Picker.Item
      key={company.id}
      label={company.title_az}
      value={company.title_az}
      color={isDarkMode ? 'white' : 'black'}
    />
  ))}
</Picker>
</View>
<Text style={styles.errorText}>{selectedSectorIdError}</Text>

        <Text style={[styles.text, {color: isDarkMode  ? "white" : '#020202'}]}>{t('unvan')}</Text>
        <TextInput
  style={[
    styles.input,
    {
      backgroundColor: isDarkMode ? "#1B1523" : '#FFFFFF',
      color: isDarkMode ? "#FFFFFF" : "black", // Set the text color based on the mode
    },
  ]}
  ref={addressInputRef}
  placeholderTextColor={isDarkMode ? "#FDFDFD" : "gray"}
          placeholder={t('unvan')}
          value={address}
          onChangeText={setAddress} />
 <Text style={styles.errorText}>{addressError}</Text>
        <Text style={[styles.text, {color: isDarkMode  ? "white" : '#020202'}]}>{t('web')}</Text>
        <TextInput
         style={[
          styles.input,
          {
            backgroundColor: isDarkMode ? "#1B1523" : '#FFFFFF',
            color: isDarkMode ? "#FFFFFF" : "black", // Set the text color based on the mode
          },
        ]}
        ref={websiteInputRef}
        placeholderTextColor={isDarkMode ? "#FDFDFD" : "gray"}
          placeholder={t('web')}
          value={website}
          onChangeText={setWebsite} />
 <Text style={styles.errorText}>{websiteError}</Text>
        <Text style={[styles.text, {color: isDarkMode  ? "white" : '#020202'}]}>{t('map_link')}</Text>
        <TextInput
 style={[
  styles.input,
  {
    backgroundColor: isDarkMode ? "#1B1523" : '#FFFFFF',
    color: isDarkMode ? "#FFFFFF" : "black", // Set the text color based on the mode
  },
]}
ref={mapInputRef}
placeholderTextColor={isDarkMode ? "#FDFDFD" : "gray"}
          placeholder={t('map_link')}
          value={map}
          onChangeText={setMap} />
 <Text style={styles.errorText}>{mapError}</Text>
        <Text style={[styles.text, {color: isDarkMode  ? "white" : '#020202'}]}>{t('about')}</Text>
        <TextInput
       style={[
        styles.input,
        {
          backgroundColor: isDarkMode ? "#1B1523" : '#FFFFFF',
          color: isDarkMode ? "#FFFFFF" : "black", // Set the text color based on the mode
        },
      ]}
      ref={aboutInputRef}
      placeholderTextColor={isDarkMode ? "#FDFDFD" : "gray"}
          placeholder={t('about')}
          value={about}
          onChangeText={setAbout} />
 <Text style={styles.errorText}>{aboutError}</Text>
        <Text style={[styles.text, {color: isDarkMode  ? "white" : '#020202'}]}>{t('hr_policy')}</Text>
        <TextInput
 style={[
  styles.input,
  {
    backgroundColor: isDarkMode ? "#1B1523" : '#FFFFFF',
    color: isDarkMode ? "#FFFFFF" : "black", // Set the text color based on the mode
  },
]}
placeholderTextColor={isDarkMode ? "#FDFDFD" : "gray"}
          placeholder={t('hr_policy')}
          value={hr}
          onChangeText={setHr} />

        <Text style={[styles.text, {color: isDarkMode  ? "white" : '#020202'}]}>{t('instagram')}</Text>
        <SocialMediaInput
  isDarkMode={isDarkMode}
  iconName="instagram"
  placeholder={t('instagram')}
  value={instagram}
  onChangeText={setInstagram}
/>


<Text style={[styles.text, { color: isDarkMode  ? "white" : '#020202' }]}>{t('facebook')}</Text>
<SocialMediaInput
  isDarkMode={isDarkMode}
  iconName="facebook"
  placeholder={t('facebook')}
  value={facebook}
  onChangeText={setFacebook}
/>


<Text style={[styles.text, { color: isDarkMode  ? "white" : '#020202' }]}>{t('linkedin')}</Text>
<SocialMediaInput
  isDarkMode={isDarkMode}
  iconName="linkedin"
  placeholder={t('linkedin')}
  value={linkedin}
  onChangeText={setLinkedin}
/>


<Text style={[styles.text, { color: isDarkMode  ? "white" : '#020202' }]}>{t('twitter')}</Text>
<SocialMediaInput
  isDarkMode={isDarkMode}
  iconName="twitter"
  placeholder={t('twitter')}
  value={twitter}
  onChangeText={setTwitter}
/>


        <Text style={[styles.text, {color: isDarkMode  ? "white" : '#020202'}]}>{t('sekiladd')}</Text>
        <Pressable onPress={handleImagePicker} style={[styles.input,    {backgroundColor: isDarkMode  ? "#1B1523" : '#F4F9FD'},]} ref={imageInputRef}>
          <Icon
            name="paperclip"
            size={24}
            color={isDarkMode ? "white" : '#F4F9FD'}
            style={styles.icon2} />
        </Pressable>

        {selectedImage && (
          <Image
            source={{ uri: selectedImage.uri }}
            style={{ width: 200, height: 200 }} />
        )}
 <Text style={styles.errorText}>{imageError}</Text>
<TouchableOpacity
  style={[
    styles.button2,
    {
      backgroundColor: isDarkMode  ? 'white' : '#F4F9FD',
    },
  ]}
  onPress={handleAddCompany}
  disabled={isLoading} // Disable button while loading
>
  {isLoading ? (
    <ActivityIndicator color={isDarkMode.toString() === 'dark' ? 'white' : 'white'} size={'small'} />
  ) : (
    <>
      <Icon
        name="paperclip"
        size={24}
        color={isDarkMode  ? 'black' : '#020202'}
        style={styles.icon3}
      />
      <Text
        style={[
          styles.buttonText,
          { color: isDarkMode ? '#1B1523' : '#020202' },
        ]}
      >
        {t('addd')}
      </Text>
    </>
  )}
</TouchableOpacity>


        <Button title={t('bagla')} onPress={closeModal} />
      </ScrollView>
    </Modal><Modal isVisible={isSuccessModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modal}>
            <LottieView
              source={SuccessAnimation}
              style={styles.animation}
              autoPlay={true}
              loop={false} />
          </View>
        </View>
      </Modal></>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: '#F4F9FD',
    padding: 10,
    borderRadius: 8,
  },
  modalContainer2: {
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
  errorText: {
    color: 'red', // You can change the color to your desired error text color
    fontSize: 14, // You can adjust the font size
    marginBottom: 5,
    marginLeft:20 // You can add some space below the error text
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: 19,
    paddingHorizontal: 14,
    marginVertical: 10,
    width: windowWidth - 100, // Adjust the width based on screen size
    height: 55,
    backgroundColor: '#FDFDFD',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FDFDFD',
    elevation: 5,
  },
  text: {
    marginHorizontal: 20,
    color: '#020202',
    fontSize: 14,
    fontWeight: '600',
  },
  dropdown: {
    borderColor: 'white',
    borderWidth: 0.5,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    alignSelf: 'center',
    paddingVertical: 19,
    paddingHorizontal: 14,
    marginVertical: 10,
    width: windowWidth - 100, // Adjust the width based on screen size
    height: 55,
    backgroundColor: '#FDFDFD',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: '#FDFDFD',
    paddingHorizontal: 14,
    paddingVertical: 19,
    borderRadius: 10,
    width: windowWidth - 100, // Adjust the width based on screen size
    height: 55,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    marginLeft: 10,

    fontSize: 16,
  },
  icon: {
    marginRight: 5,
    position: 'absolute',
    right: 10,
    top: 8,
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
  inputContainer2: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: 19,
    paddingHorizontal: 14,
    marginVertical: 10,
    width: windowWidth - 100, // Adjust the width based on screen size
    height: 55,
    backgroundColor: '#FDFDFD',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FDFDFD',
    elevation: 5,
  },
  input2: {
    flex: 1,
    height: '100%',
    color: 'black',
  },
  icon2: {
    marginRight: '90%',
    marginTop: 20,
    position: 'absolute',
    alignSelf: 'center',
    right: 10,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  icon3: {
    marginRight: '50%',
    marginTop: 20,
    position: 'absolute',
    alignSelf: 'center',
    right: 10,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  button2: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 70,
    width: 170,
    marginHorizontal: 20,
    marginBottom: 20,
    paddingTop: 40,
    paddingBottom: 10,
    paddingHorizontal: 35,
    backgroundColor: '#FDFDFD',
    borderRadius: 8,
    flexShrink: 0,
  },
});

export default AddCompanyModal;