import {
    Alert,
    Button,
    Image,
    Linking,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
    useColorScheme,
  } from 'react-native';
  import React, {useEffect, useState} from 'react';
  
  import Ionicons from 'react-native-vector-icons/Ionicons';
  import moment from 'moment';
  import axios from 'axios';
  import { Picker } from '@react-native-picker/picker';
  import CandidateForm from './CandidateForm';
  import { borderRadius, colors, spacing } from '../assets/themes';
  import SuccessAnimation from '../animations/success.json';
  import LottieView from 'lottie-react-native';
  import { useTranslation } from 'react-i18next';
  import { useSelector } from 'react-redux';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import DocumentPicker from 'react-native-document-picker';
  import LoadingScreen from './LoadingScreen';
  const VacanciesInnerr = ({route, selectedCity}: any) => {
    const isDarkMode = useColorScheme() === 'dark';
    const date = moment().format('MMM DD YY');
    const {vacancyId} = route.params;
    const [data, setData] = useState([]);
    const [cities, setcities] = useState([]);
    const [categories, setCategories] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [experiences, settecrube] = useState([]);
    const [cvList, setCvList] = useState([]);
    const [cvId, setCvId] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [name, setname] = useState('')
    const [surname, setsurname] = useState('')
    const [mail, setmail] = useState('')
    const [phone, setPhone] = useState('');
    const [userId, setUserId] = useState('');
    const email = useSelector((state) => state.auth.email);
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
    
      // Fetch the CV list for the logged-in user from the server
      axios
        .get(`https://movieappi.onrender.com/civ/${userId}`)
        .then(response => {
          // Set the retrieved CV list to the state
          setCvList(response.data);
  console.log(response.data)
        })
        .catch(error => {
          console.error('Error retrieving CV list:', error.response.data);
        });
    }, [email]);
    
    const {t} = useTranslation();
  
    function decodeHTMLEntities(text: string) {
      var entities = [
        ['amp', '&'],
        ['apos', "'"],
        ['#x27', "'"],
        ['#x2F', '/'],
        ['#39', "'"],
        ['#47', '/'],
        ['lt', '<'],
        ['gt', '>'],
        ['nbsp', ' '],
        ['quot', '"'],
        ['uuml', 'ü'],
        ['ouml', 'ö'],
        ['ccedil', 'ç'],
        ['Uuml', 'Ü'],
        ['bull', '•'],
      ];
  
      var tagsToRemove = ['ul', 'li', 'span', 'style', 'font', 'p', 'o:p', 'style', 'br', 'a','div', 'h4', 'strong'];
  
      for (var i = 0, len = entities.length; i < len; i++) {
        text = text?.replace(
          new RegExp('&' + entities[i][0] + ';', 'g'),
          entities[i][1],
        );
      }
      for (var i = 0, len = tagsToRemove.length; i < len; i++) {
        text = text?.replace(
          new RegExp('<' + tagsToRemove[i] + '[^>]*>', 'g'),
          '',
        );
        text = text?.replace(new RegExp('</' + tagsToRemove[i] + '>', 'g'), '');
      }
  
      return text;
    }
  
    useEffect(() => {
      axios
        .get(`https://movieappi.onrender.com/vacancies/${vacancyId}`)
        .then(response => {
    console.log(response.data)
          setData(response.data);
          setIsLoading(false)
          console.log(response.data);
          
        })
        .catch(error => {
          console.error('API call failed:', error);
        });
    }, [vacancyId]);
  
    useEffect(() => {
      axios
        .get(`https://movieappi.onrender.com/categories`)
        .then(response => {
          setCategories(response.data);
        })
        .catch(error => {
          console.error('API call failed:', error);
        });
    }, []);
  
    useEffect(() => {
      axios
        .get(`https://movieappi.onrender.com/experiences`)
        .then(response => {
          settecrube(response.data);
        })
        .catch(error => {
          console.error('API call failed:', error);
        });
    }, []);
    useEffect(() => {
      axios
        .get(`https://movieappi.onrender.com/cities`)
        .then(response => {
          setcities(response.data);
        })
        .catch(error => {
          console.error('API call failed:', error);
        });
    }, []);
    useEffect(() => {
      axios
        .get(`https://movieappi.onrender.com/companies`)
        .then(response => {
          setCompanies(response.data);
        })
        .catch(error => {
          console.error('API call failed:', error);
        });
    }, []);
  
    // const [companyContactInfo, setCompanyContactInfo] = useState(data[0]?.contact_info || '');
    const [showCandidateFormModal, setShowCandidateFormModal] = useState(false);
    const [isPickerVisible, setIsPickerVisible] = useState(false);
  
    // Function to toggle the picker visibility
    const togglePicker = () => {
      setIsPickerVisible(prevState => !prevState);
    };
    // Other code...
  
    // Handle form submission for "Indi Müraciət" button
    const handleIndiMüraciət = () => {
      setShowIndiComponent(true);
      setShowAsanComponent(false);
    };
    
    const handleAsanMüraciət = () => {
      setShowAsanComponent(true);
      setShowIndiComponent(false);
    };
  
    const handleApply = () => {
      if (data[0]?.contact_info.startsWith('http')) {
        Linking.openURL(data[0]?.contact_info);
      } else {
        const mailUrl = `mailto:${data[0]?.contact_info}`;
        Linking.openURL(mailUrl);
      }
    };
  
    const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
    const handleUpload = async () => {
      try {
        const response = await fetch(`https://movieappi.onrender.com/candidat/${userId}/${vacancyId}`, {
          method: 'POST',
        });
    
        const data = await response.json();
    
        if (response.ok) {
          console.log(data.message); // Candidate added successfully
        } else {
          console.error(data.message); // Error message from the server
        }
      } catch (error) {
        console.error('Error uploading CV:', error.response.data);
      }
    };
    
    // Example usage
  
    
    const handleSubmit = async ({ name, email, surname, phone, file, cvId }: any) => {
      try {
        const formData = new FormData();
        formData.append('vacancyId', vacancyId);
        formData.append('userId', userId);
        formData.append('name', name);
        formData.append('email', email);
        formData.append('surname', surname);
        formData.append('phone', phone);
        if (file) {
          formData.append('cv', {
            uri: file[0].uri,
            name: file[0].name,
            type: file[0].type,
          });
        }
        const response = await axios.post('https://movieappi.onrender.com/candidate', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
    
        if (response.status === 201) {
          setIsSuccessModalVisible(true);
          setTimeout(() => {
            setIsSuccessModalVisible(false);
          }, 1000);
        } else {
          Alert.alert('Error', 'Failed to submit application');
        }
      } catch (error) {
        console.error('Error submitting application:', error);
        if (error.response && error.response.data && error.response.data.message) {
          Alert.alert('Error', error.response.data.message);
        } else {
          Alert.alert('Error', 'Failed to submit application');
        }
      }
    };
    
    
    
    const [isLoading, setIsLoading] = useState(true);
    
  
   
    
    
    const [showIndiComponent, setShowIndiComponent] = useState(false);
    const [showAsanComponent, setShowAsanComponent] = useState(false);
    const activeButtonStyle = {
      borderRadius: 10,
      backgroundColor: "#9559E5",
      borderWidth: 1,
      borderColor: "#9559E5",
      paddingVertical: 10,
      paddingHorizontal: 8,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginHorizontal: 10,
    };
    
    const inactiveButtonStyle = {
      borderRadius: 10,
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: "#9559E5",
      paddingVertical: 10,
      paddingHorizontal: 8,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginHorizontal: 10,
    };
    
    const activeButtonTextStyle = {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "500",
    };
    
    const inactiveButtonTextStyle = {
      color: "#9559E5",
      fontSize: 16,
      fontWeight: "500",
    };
  
    if (isLoading) {
      return <LoadingScreen />;
    } else {
    
  
    return (
  <View >
  <ScrollView style={{height:"100%",backgroundColor: isDarkMode ? '#131313' : 'white'}}>
  
        <View style={styles.vacancyDetails}>
          <View style={[styles.dot, {backgroundColor: '#8843E1'}]} />
          <Text style={styles.category}>
            {
              categories.find(category => category.id === data[0]?.category_id)
                ?.title_az
            }
          </Text>
        </View>
        <View>
          <Text
            style={[styles.title, {color: isDarkMode ? '#FDFDFD' : '#020202'}]}>
            {data[0]?.position}
          </Text>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-around', paddingLeft:23}}>
          <View>
          <Text style={styles.city}>
              {cities.find(city => city.id === data[0]?.city_id)?.title_az}
            </Text>
          </View>
          <View>
            <Text style={styles.city}>
              {
                companies.find(company => company.id === data[0]?.company_id)
                  ?.name
              }
            </Text>
          </View>
        </View>
  
        <View style={styles.container}>
        <View style={styles.card}>
  <View style={styles.cardContent}>
    <Image
      source={require('AwesomeProject/src/assets/images/whitebag.png')}
      style={{ width: 20, height: 20, alignSelf: 'center', justifyContent: 'center' }}
    />
    <View style={{ marginLeft: 10, marginBottom:20 }}>
      <Text style={{marginTop:15, alignItems:"center", alignSelf: 'center', color :"white"}}>{t('work_tecrube')}</Text>
      <Text style={{color :"white"}}>
        {
          experiences.find(
            experinece => experinece.id === data[0]?.experience_id,
          )?.title_az
        }
      </Text>
    </View>
  </View>
  </View>
  
  
          <View style={styles.card}>
    <View style={styles.cardContent}>
  
    <Image
    source={require('AwesomeProject/src/assets/images/user-group.png')}
    style={{ width: 20, height: 20, alignSelf: 'center', justifyContent: 'center' }}
  />
   <View style={{ marginLeft:20, justifyContent:"center" , marginTop:20}}>
            <Text style={{marginTop:-22, alignItems:"center", alignSelf: 'center', paddingHorizontal: 7, color :"white"}}>{t('yas')}</Text>
            <Text style={{ alignItems:"center", alignSelf: 'center', paddingHorizontal: 7, color :"white"}}>
              {data[0]?.min_age} - {data[0]?.max_age}
            </Text>
            </View>
    </View>
          </View>
        </View>
        <View style={styles.container}>
          <View style={styles.card}>
            <View style={styles.cardContent}>
            <Image
    source={require('AwesomeProject/src/assets/images/currency-dollar.png')}
    style={{ width: 25, height: 25, alignSelf: 'center', marginLeft: 1 }}
  />
     <View style={{ marginLeft:20, justifyContent:"center" , marginTop:20}}>
     <Text style={{ alignItems:"center", alignSelf: 'center',color :"white"}}>{t('maas')}</Text>
            <Text style={{ alignItems:"center", alignSelf: 'center', color :"white"}}>
              {data[0]?.salary_type === '1' ? (
                <Text style={{ alignItems:"center", alignSelf: 'center',color :"white"}}>
                  {data[0]?.min_salary} - {data[0]?.max_salary}
                </Text>
              ) : (
               <View style={{ alignItems:"center", alignSelf: 'center', }}>
                 <Text style={{ alignItems:"center", alignSelf: 'center',color :"white"}}>{t('musahibe')}</Text>
               </View>
              )}
            </Text>
     </View>
            </View>
         
          
          </View>
          <View style={styles.card}>
  <View style={styles.cardContent}>
    <Image
      source={require('AwesomeProject/src/assets/images/time.webp')}
      style={{ width: 20, height: 20, alignSelf: 'center', marginLeft: 30 }}
    />
    <View style={{ flex: 1 }}>
      <Text style={{  alignSelf: 'center', color :"white" }}>
      {t('bitme_tarix')}
      </Text>
      <Text style={{ alignSelf: 'center', color: "white" }}>
    {data[0]?.deadline <= new Date() ? (
      <Text style={{ flexWrap: 'nowrap', alignSelf: 'center' }}>
        Elanın vaxtı bitmişdir
      </Text>
    ) : (
      moment(data[0]?.deadline).format('DD.MM.YYYY')
    )}
  </Text>
  
  
    </View>
  </View>
  </View>
  
  
        </View>
        <View style={styles.card2}>
          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'center',
              paddingVertical: 20,
            }}>
                    <Image
    source={require('AwesomeProject/src/assets/images/user.png')}
    style={{ width: 25, height: 25, alignSelf:"flex-start", marginLeft:12, alignItems:"center", alignContent:"center", marginTop:5 }}
  />
            <Text
              style={{
                alignSelf: 'center',
                justifyContent: 'center',
                fontSize: 16,
                fontWeight: '600',
                marginLeft: 10,
                marginTop: 5,
                color :"white"
              }}>
              {data[0]?.contact_name}
            </Text>
          </View>
        </View>
        <View style={styles.container2}>
        <View style={styles.header}>
          <Text style={styles.headerText}>{t('vezife')}</Text>
        </View>
        <View style={styles.descriptionContainer}>
          <Text
            style={[
              styles.descriptionText,
              { color: isDarkMode ? 'white' : '#020202' },
            ]}
          >
            {decodeHTMLEntities(data[0]?.description)}
          </Text>
        </View>
      </View>
      <View style={styles.container2}>
        <View style={styles.header}>
          <Text style={styles.headerText}>{t('telebler')}</Text>
        </View>
        <View style={styles.requirementsContainer}>
          <Text
            style={[
              styles.requirementsText,
              { color: isDarkMode ? 'white' : '#020202' },
            ]}
          >
            {decodeHTMLEntities(data[0]?.requirement)}
          </Text>
        </View>
      </View>
  
  
  
  
      </ScrollView>
   
  </View>
    );}
  };
  
  export default VacanciesInnerr;
  
  const styles = StyleSheet.create({
    dot: {
      width: 5,
      height: 5,
      borderRadius: 2.5,
      margin: 10,
      alignSelf: 'center',
      justifyContent: 'center',
    },
    contentContainer: {
      marginVertical: 20,
      marginBottom:80, 
      marginTop:-60
    },
    buttonSub:{
      width:120,
      height:40,
      backgroundColor:"#9559E5",
      borderRadius:10, 
      marginBottom:75, 
      marginTop:10, alignSelf:"center"
    },
    // picker: {
    //   // ... Other styles ...
    //   width: 370,
    //   alignSelf: "center",
    //   justifyContent: "center",
    //   backgroundColor: "#E2DCEA",
    //   borderWidth: 1,
    //   borderColor: "#9559E5",
    //   borderRadius: 8,
    //   paddingHorizontal: 20,
    //   marginBottom: 10,
    //   color: "black",
    // },
    picker: {
      backgroundColor: '#E2DCEA',
      borderWidth: 1,
      borderColor: '#9559E5',
      borderRadius: 8,
      paddingHorizontal: 20,
      marginBottom: 10,
  
      width: 370, // or adjust the width as needed
      alignSelf: 'center',
    },
    
    // New style for the picker overlay
    pickerOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "transparent",
    },
    // picker: {
    //   backgroundColor: '#E2DCEA',
    //   borderWidth: 1,
    //   borderColor: '#9559E5',
    //   borderRadius: 8,
    //   paddingHorizontal: 20,
    //   marginBottom: 10,
    //   color: 'black',
    //   width:370, 
    //   alignSelf:"center"
  
    // },
    container: {
      flexDirection: 'row',
      marginHorizontal: '5%',
      justifyContent: 'space-between',
      marginVertical: 10,
      flexWrap: 'wrap',
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
    category: {
      fontSize: 16,
      color: '#8843E1',
      alignSelf: 'center',
    },
    container2: {
      marginTop: 20,
      width: '100%',
      alignItems: 'center',
    },
    header: {
      width: '90%',
      height: 75,
      backgroundColor: '#8843E1',
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerText: {
      textAlign: 'center',
      color: '#FFFFFF',
      fontSize: 20,
      fontWeight: '600',
      alignSelf:"center"
    },
    descriptionContainer: {
      marginHorizontal: 15,
      backgroundColor: '#E2DCEA',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      elevation: 5,
      paddingHorizontal: 10,
      paddingVertical: 15,
      width: '90%',
    },
    descriptionText: {
      fontSize: 14,
      fontWeight: '500',
      lineHeight: 20,
    },
    vacancyDetails: {
      padding: 7,
      backgroundColor: '#ECDBFC',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 23,
      marginRight: '20%',
      marginLeft: '20%',
      alignSelf: 'center',
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 5,
      marginTop: 10,
  
      alignSelf: 'center',
    },
    city: {
      color: '#C7C7C7',
      fontSize: 16,
      fontWeight: '600',
    },
    requirementsContainer: {
      marginHorizontal: 15,
      backgroundColor: '#E2DCEA',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      elevation: 5,
      paddingHorizontal: 10,
      paddingVertical: 15,
      width: '90%',
    },
    requirementsText: {
      fontSize: 14,
      fontWeight: '500',
      lineHeight: 20,
    },
    addToFavoritesIcon: {
      position: 'absolute',
      left: 15,
      right: 10,
      top: 0,
      alignItems: 'center',
      alignSelf: 'center',
      marginRight: 22,
      paddingVertical: 10,
    },
    card: {
      flexBasis: '47%',
      maxWidth: 170,
      height: 75,
      backgroundColor: '#9559E5',
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 13,
    },
    cardContent: {
      flexDirection: 'row', // Display the image and text side by side
      alignItems: 'center', // Center the content horizontally
      justifyContent: 'center', // Center the content vertically
    },
    card2: {
      flexBasis: '90%',
      maxWidth: 385,
      height: 70,
      backgroundColor: '#9559E5',
      flexDirection: 'column',
      marginHorizontal: '5%',
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      marginVertical: 10,
    },
    button:{
      width:150,
      height:40,
      backgroundColor:"#8843E1",
      alignSelf:"center", 
      textAlign:"center",
      justifyContent:"center", 
      alignContent:"center",
     marginBottom:90,
     marginTop:40
    }
  });