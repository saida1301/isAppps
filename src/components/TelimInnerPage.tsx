import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  Image,
  Pressable,
  Linking,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import moment from 'moment';
import axios from 'axios';
import SimilarTrainings from './SimilarTrainings';
import CompanySearchScreen from './CompanySearchScreen';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCalendar, faDollarSign, faEye } from '@fortawesome/free-solid-svg-icons';

const TelimInnerPage = ({ route }) => {
  const { telimId } = route.params;
  const [data, setdata] = useState([]);
  const [similarTrainings, setSimilarTrainings] = useState([]);

  const getSimilarTrainings = async (title) => {
    try {
      const response = await axios.get(
        `https://movieappi.onrender.com/trainings/similar/${title}`
      );
      return response.data;
    } catch (error) {
      console.error('API call failed:', error);
      return [];
    }
  };

  useEffect(() => {
    axios
      .get(`https://movieappi.onrender.com/trainings/${telimId}`)
      .then((response) => {
        setdata(response.data);
      })
      .catch((error) => {
        console.error('API call failed:', error);
      });
    getSimilarTrainings(telimId).then((similarTrainings) => {
      setSimilarTrainings(similarTrainings);
    });
  }, []);

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
        entities[i][1]
      );
    }

    // Remove specified tags
    for (var i = 0, len = tagsToRemove.length; i < len; i++) {
      text = text?.replace(
        new RegExp('<' + tagsToRemove[i] + '[^>]*>', 'g'),
        ''
      );
      text = text?.replace(
        new RegExp('</' + tagsToRemove[i] + '>', 'g'),
        ''
      );
    }

    return text;
  }
const isDarkMode = useColorScheme() === 'dark';
const {t} = useTranslation()
  return (
    <View style={styles.container}>
      <ScrollView>
    
        <View style={[styles.contentContainer, {backgroundColor: isDarkMode ? "#131313" : "#f3f3f3"}]}>

  
          {data && (
            <View style={[styles.infoContainer, {backgroundColor: isDarkMode ? "black" : "white"}]}>
                      <Text style={[styles.title, {color: isDarkMode ? "white" : "black"}]}>{t('about_training')}</Text>
              <View style={styles.infoRow}>
              <FontAwesomeIcon
                  icon={faDollarSign}
                  size={20}
                  color={isDarkMode ? 'white' : 'black'}
                  style={styles.icon}
                />
                <View style={styles.infoTextContainer}>
                  <Text style={[styles.infoLabel, {color: isDarkMode ? "white" : "black"}]}>{t('odenis')}</Text>
                  <Text style={[styles.infoValue, {color: isDarkMode ? "white" : "black"}]}>
                    {data[0]?.payment_type === '1' ? (
                      `${data[0]?.price} azn`
                    ) : (
                      t('free')
                    )}
                  </Text>
                </View>
              </View>
              <View style={styles.infoRow}>
              <FontAwesomeIcon
  icon={faEye}
  size={20}
  color={isDarkMode ? 'white' : 'black'}
  style={styles.icon}
/>
                <View style={styles.infoTextContainer}>
                  <Text style={[styles.infoLabel, {color: isDarkMode ? "white" : "black"}]}>{t('view')}</Text>
                  <Text style={[styles.infoValue, {color: isDarkMode ? "white" : "black"}]}>{data[0]?.view}</Text>
                </View>
              </View>
              <View style={styles.infoRow}>
              <FontAwesomeIcon
  icon={faCalendar}
  size={20}
  color={isDarkMode ? 'white' : 'black'}
  style={styles.icon}
/>
                <View style={styles.infoTextContainer}>
                  <Text style={[styles.infoLabel, {color: isDarkMode ? "white" : "black"}]}>{t('bitme_tarix')}</Text>
                  <Text style={[styles.infoValue, {color: isDarkMode ? "white" : "black"}]}>
                    {moment(data[0]?.created_at).format('DD.MM.YYYY')}
                  </Text>
                </View>
              </View>
              <View style={styles.infoRow}>
              <FontAwesomeIcon
  icon={faCalendar}
  size={20}
  color={isDarkMode ? 'white' : 'black'}
  style={styles.icon}
/>
                <View style={styles.infoTextContainer}>
                  <Text style={[styles.infoLabel, {color: isDarkMode ? "white" : "black"}]}>{t('start_date')}</Text>
                  <Text style={[styles.infoValue, {color: isDarkMode ? "white" : "black"}]}>
                    {moment(data[0]?.deadline).format('DD.MM.YYYY')}
                  </Text>
                </View>
              </View>
            </View>
          )}
            <View style={{width:"100%",maxWidth:370, height:70, backgroundColor:isDarkMode ? "black" : "white",}}>
         <Text style={[styles.text, {color: isDarkMode ? "white" : "black"}]}>{t('telimat')}</Text>
         </View>
          <View style={[styles.container2, {backgroundColor: isDarkMode ? "black" : "white"}]}>
       
            {data && (
              <View>
                <Image
                  source={{ uri: `https://1is.az/${data[0]?.image}` }}
                  style={styles.image}
                />
                <Pressable
                  onPress={() => {
                    Linking.canOpenURL(data[0]?.redirect_link).then(
                      (supported) => {
                        if (supported) {
                          Linking.openURL(data[0]?.redirect_link);
                        } else {
                          Linking.openURL(
                            'https://www.google.com/search?q=' +
                              data[0]?.redirect_link
                          );
                        }
                      }
                    );
                  }}
                >
                  <Text style={styles.link}>{data[0]?.redirect_link}</Text>
                </Pressable>
                <Text style={[styles.infoValue, {color: isDarkMode ? "white" : "black"}]}>{decodeHTMLEntities(data[0]?.about)}</Text>
              </View>
            )}
          </View>
          <View style={{width:"100%",maxWidth:370, height:70, backgroundColor:isDarkMode ? "black" : "white", marginTop:20, marginBottom:"50%"}}>
         <Text style={[styles.text, {color: isDarkMode ? "white" : "black"}]}>Oxsar Telimler</Text>
         </View>

        </View>

      </ScrollView>
 
    </View>
  );
};

export default TelimInnerPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    backgroundColor: '#F4F9FD',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  title: {
    color: 'black',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
    borderBottomWidth:1,
    borderBottomColor:"black"
  },
  infoContainer: {
    backgroundColor: '#FDFDFD',
    borderRadius: 6,
    padding: 12,
    marginBottom: 20,
    marginTop:20,

  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomColor: '#E5E5E5',
    borderBottomWidth: 1,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 20,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#161C2D',
  },
  infoValue: {
    fontSize: 16,
    color: '#161C2D',
  },
  container2: {
    backgroundColor: '#FFFFFF',
    padding: 20,
marginTop:20
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#020202',
    marginBottom: 10,
    alignSelf: 'center',
  margin:16
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 10,
  },
  link: {
    fontSize: 16,
    color: '#0066CC',
    textDecorationLine: 'underline',
    marginBottom: 10,
  },
});