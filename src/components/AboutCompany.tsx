import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
  TextInput,
  Button,
  Animated,
  Modal,
  Pressable,
  Alert,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {WebView} from 'react-native-webview';
import AuthHeader from './AuthHeader';
import {borderRadius, colors, fontSizes, spacing} from '../assets/themes';
import axios from 'axios';
import SuccessAnimation from '../animations/success.json';
import LottieView from 'lottie-react-native';
import ComponentStar from './ComponentStar';
import StarRatingg from './StarRatingg';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import CompanySearchScreen from './CompanySearchScreen';
import CompanyRatingScreen from './CompanyRatingScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = {
  route: any;
  isVisible: boolean;
  onClose: () => void;
};

const AboutCompany: React.FC<Props> = ({
  route,
  srcdoc,
  width,
  height,
  style,
  allowfullscreen,
  loading,
  referrerpolicy,
}: Props) => {
  const {companyId} = route.params;
  const isDarkMode = useColorScheme() === 'dark';
  const [showAbout, setShowAbout] = useState(true);
  const [fullname, setFullname] = useState('');
  const [message, setMessage] = useState('');
  const [data, setData] = useState([]);
  const [rating, setRating] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const {t} = useTranslation();

  const handleRate = (value: React.SetStateAction<number>) => {
    setRating(value);
  };
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  function decodeHTMLEntities(text) {
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
    ];

    var tagsToRemove = ['ul', 'li', 'span', 'style', 'font', 'p', 'o:p', 'style', 'br', 'a','div', 'h4', 'strong', 'ol'];

    for (var i = 0, len = entities.length; i < len; i++) {
      text = text?.replace(
        new RegExp('&' + entities[i][0] + ';', 'g'),
        entities[i][1],
      );
    }

    // Remove specified tags
    for (var i = 0, len = tagsToRemove.length; i < len; i++) {
      text = text?.replace(
        new RegExp('<' + tagsToRemove[i] + '[^>]*>', 'g'),
        '',
      );
      text = text?.replace(new RegExp('</' + tagsToRemove[i] + '>', 'g'), '');
    }

    return text;
  }
  const html = `
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body>
      <iframe srcdoc="${srcdoc}"
              width="${width}"
              height="${height}"
              style="${style}"
              allowfullscreen="${allowfullscreen}"
              referrerpolicy="${referrerpolicy}"></iframe>
    </body>
  </html>
  `;
console.log(data[0]?.map)
  useEffect(() => {
    axios
      .get(`https://movieappi.onrender.com/companies/${companyId}`)
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('API call failed:', error);
      });
  }, [companyId]);
  useEffect(() => {
    fetch(`https://movieappi.onrender.com/review-users/${companyId}`)
      .then(response => response.json())
      .then(data => {
        setUserCount(data.userCount);
      })
      .catch(error => {
        console.log(error);
      });
  }, [companyId]);
  useEffect(() => {
    axios
      .get(`https://movieappi.onrender.com/ratings/${companyId}`)
      .then(response => {
        const {percentage} = response.data;
        setPercentage(percentage);
      })
      .catch(error => {
        console.error('API call failed:', error);
      });
  }, [companyId]);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    // Fetch the average rating from your API or data source
    const fetchAverageRating = async () => {
      try {
        // Make an API call to fetch the average rating for the company
        const response = await fetch(
          `https://movieappi.onrender.com/average-rating/${companyId}`,
        );
        const data = await response.json();
        const averageRating = data.averageRating;
        console.log(averageRating);
        setAverageRating(averageRating);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAverageRating();
  }, []);

  const company = data.find(c => c.id === companyId);

  const email = useSelector(state => state.auth.email);
  const [user_id, setUserId] = useState('');

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

  const handleAddReview = async () => {
    if (rating === 0) {
      // Display an alert if the rating is empty (0)
      Alert.alert(t('rates'));
      return;
    }
    try {
      const response = await axios.post(
        'https://movieappi.onrender.com/reviews',
        {
          user_id: user_id, // Pass the user_id instead of email
          company_id: companyId,
          message,
          rating,
        },
      );
      console.log(response.data);
      setIsSuccessModalVisible(true);
      setTimeout(() => {
        setIsSuccessModalVisible(false);
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleAbout = () => setShowAbout(true);
  const toggleHrStrategy = () => setShowAbout(false);
  const mapUrl = data[0]?.map.replace(/(?:&|\?)daddr=.*?(?=&|$)|\?daddr=.*?(?=&|$)/, '');
  const hrPolicyDataAvailable = !!data?.hr_po;

  return (
    <ScrollView style={{  backgroundColor: isDarkMode ? '#131313' : '#F4F9FD',}}>
      <ScrollView style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop:30
          }}>
          <Image
            source={{
              uri: `https://1is.az/${company?.image}`,
            }}
            style={{
              width: 70,
              height: 70,
              alignSelf: 'center',
              borderRadius: 35,
              resizeMode: 'contain',
              marginRight: 7,
            }}
          />

          <Text
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              fontSize:20,
              marginRight: -10,
              marginTop: -40,
              color: isDarkMode ? 'white' : 'black',
              fontWeight:"600"
            }}>
            {t('about_company')}
          </Text>
        </View>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            marginLeft: '30%',
            marginTop: -30,
          }}>
          <ComponentStar company_id={companyId} />
        </View>

        <View>
  <View
    style={{
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 20,
    }}>
    <TouchableOpacity
      onPress={toggleAbout}
      style={[
        styles.tabButton,
        showAbout ? styles.activeTabButton : null,
        showAbout ? null : styles.inactiveTabButton,
      ]}>
      <Text style={showAbout ? styles.activeTabButtonText : null}>
        {t('about')}
      </Text>
    </TouchableOpacity>

    {company?.hr && ( // Check if HR data exists before rendering the button
      <TouchableOpacity
        onPress={toggleHrStrategy}
        style={[
          styles.tabButton,
          !showAbout ? styles.activeTabButton : styles.inactiveTabButton,
          !showAbout ? null : styles.inactiveTabButton,
        ]}>
        <Text style={!showAbout ? styles.activeTabButtonText : null}>
          {t('hr_policy')}
        </Text>
      </TouchableOpacity>
    )}
  </View>

  {showAbout ? (
    <Text
      style={{
        color: isDarkMode ? 'white' : 'black',
        paddingHorizontal: 10,
      }}>
    {decodeHTMLEntities(company?.about)}

    </Text>
  ) : (
    company?.hr && ( // Check if HR data exists before rendering the text
      <Text
        style={{
          color: isDarkMode ? 'white' : 'black',
          paddingHorizontal: 10,
        }}>
        {decodeHTMLEntities(company?.hr)}
      </Text>
    )
  )}
</View>



        <View>
          <AuthHeader
            title={'Ünvan'}
            textColor={isDarkMode ? 'white' : 'black'}
          />
          <View style={{flexDirection: 'row', paddingHorizontal: 10}}>
            <Image
              source={require('AwesomeProject/src/assets/images/map.webp')}
              style={{width: 24, height: 24}}
            />
            <Text
              style={{
                color: isDarkMode ? 'white' : 'black',
                paddingHorizontal: 10,
              }}>
              {company?.address}
            </Text>
          </View>

          <View style={{paddingVertical: 12}}>
          <WebView
            scalesPageToFit={true}
            bounces={false}
            javaScriptEnabled
            source={{
              uri: `https://www.google.com/maps/place/${data[0]?.map}`,
            }}
            automaticallyAdjustContentInsets={false}
            style={{ height: 210, marginTop: 5, width: 360, marginBottom:20}}
          />
          </View>
          <View style={{flexDirection: 'row', flex: 1}}>
            <View style={{flex: 1, marginRight: 30, }}>
              <Text
                style={{
                  fontFamily: 'Montserrat', 
                  fontSize: 40, 
                  fontStyle: 'normal', 
                  fontWeight: '700', 
                  lineHeight: 40,
                  color: isDarkMode ? 'white' : 'black',
                }}>
                {percentage}%
              </Text>
              <ComponentStar company_id={companyId} />

              <Text
                style={{
                  fontFamily: 'Montserrat', // Font family: Montserrat;
                  fontSize: 40, // Font size: 40px;
                  fontStyle: 'normal', // Font style: normal;
                  fontWeight: '700', // Font weight: 700;
                  lineHeight: 40,
                  color: isDarkMode ? 'white' : 'black',
                  marginTop: 10,
                }}>
                {userCount}
              </Text>
            </View>
            <View style={{ flex: 1, marginRight: '10%', alignSelf: 'center' }}>
  {/* Wrap the CompanyRatingScreen in a fixed-width View */}
  <View style={{ width: '90%', maxWidth: 350, marginTop: '5%' }}>
  
      <CompanyRatingScreen companyId={companyId} />
    
  </View>
</View>

          </View>

          <View></View>
          <View></View>
          <View style={{paddingVertical: 12, marginVertical: 50, bottom: 40}}>
            {/* <Text
              style={{
                color: isDarkMode ? 'white' : 'black',
                alignItems: 'flex-start',
                margin: 12,
              }}>
              Ad ve Soyad
            </Text> */}
            {/* <Text style={{color:"red"}} >{user_id}</Text> */}
            <AuthHeader
              title={t('rate_1')}
              textColor={isDarkMode ? 'white' : 'black'}
            />
            <Text
              style={{
                color: isDarkMode ? 'white' : 'black',
                alignItems: 'flex-start',
                margin: 12,
              }}>
              {t('rate_1')}
            </Text>
            <View style={styles.input}>
              <StarRatingg rating={rating} onRate={handleRate} />
            </View>

            <Text
              style={{
                color: isDarkMode ? 'white' : 'black',
                alignItems: 'flex-start',
                margin: 12,
              }}>
              {t('review')}
            </Text>
            <TextInput
              placeholder="Message"
              value={message}
              onChangeText={text => setMessage(text)}
              multiline
              style={styles.input2}
              textAlignVertical="top"
            />
            <Pressable onPress={handleAddReview} style={styles.button}>
              <Text style={styles.text}>{t('send')}</Text>
            </Pressable>
            {/* <Button title="Add Review" onPress={handleAddReview} /> */}
            <Modal
              visible={isSuccessModalVisible}
              animationType="slide"
              transparent={true}>
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
        </View>
      </ScrollView>
    </ScrollView>
  );
};

export default AboutCompany;

const styles = StyleSheet.create({
  tabButton: {
    paddingVertical: spacing.medium,
    margin: spacing.small,
    borderRadius: 5,
    color: colors.primary,
    backgroundColor: colors.white,
    width: '100%',
    maxWidth: 170,
    alignItems: 'center',
  },
  activeTabButton: {
    backgroundColor: colors.primary,
  },
  activeTabButtonText: {
    color: '#F4F9FD',
  },
  inactiveTabButton: {
    backgroundColor: '#D9D9D9',
  },
  container: {
    marginHorizontal: spacing.large,
  },
  p: {
    fontWeight: '300',
    color: '#FF3366',
  },
  text: {
    textAlign: 'center',
    justifyContent: 'center',
    marginTop: 10,
    color: 'white',
  },
  input: {
    height: 40,
    margin: 10,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    borderColor: '#8843E1',
  },
  input2: {
    height: 260,
    margin: 10,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    borderColor: '#8843E1',
  },
  modalText: {
    fontSize: fontSizes.large,
    fontWeight: 'bold',
    marginBottom: spacing.medium,
    color: colors.black,
  },
  modalButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.small,
    padding: spacing.medium,
    alignItems: 'center',
    justifyContent: 'center',
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
  modalButtonText: {
    color: colors.white,
    fontSize: fontSizes.large,
    fontWeight: 'bold',
  },
  animation: {
    width: 150,
    height: 150,
  },
  button: {
    width: 300,
    height: 40,
    backgroundColor: colors.primary,
    alignSelf: 'center',
  },
});