import {
  Button,
  Image,
  StyleSheet,
  Text,
  View,
  Linking,
  Pressable,
  useColorScheme,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';

import {colors, spacing} from '../assets/themes';
import axios from 'axios';
import moment from 'moment';
import LoadingScreen from './LoadingScreen';
import { useTranslation } from 'react-i18next';

const CvInner = ({route}: any) => {
  const isDarkMode = useColorScheme() === 'dark';
  const {cvId} = route.params;
  console.log(cvId)
  const [experiences, setexperiences] = useState([]);
  const [cities, setcities] = useState([])
  const [cv, setcv] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [education, seteducation] = useState([]);

  
  useEffect(() => {
    axios
      .get(`https://movieappi.onrender.com/educations`)
      .then(response => {
        seteducation(response.data);
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
      .get(`https://movieappi.onrender.com/cv`)
      .then(response => {
        setcv(response.data);
        console.log(response.data)
        setIsLoading(false)
      })
      .catch(error => {
        console.error('API call failed:', error);
      });
  }, []);
  const [cvIdc, setcvId] = useState();
  useEffect(() => {
    axios
      .get(`https://movieappi.onrender.com/cv/${cvId}`)
      .then(response => {
        setcvId(response.data);
        console.log(response.data)
      })
      .catch(error => {
        console.error('API call failed:', error);
      });
  }, []);
  useEffect(() => {
    axios
      .get(`https://movieappi.onrender.com/experiences`)
      .then(response => {
        setexperiences(response.data);
      })
      .catch(error => {
        console.error('API call failed:', error);
      });
  }, []);
  
const {t} = useTranslation();
  const cvss = `https://1is.az/${cvIdc?.cv}`;
  const downloadPdf = () => {
    if (cvss && /^https?:\/\//i.test(cvss)) {
      Linking.openURL(cvss);
    } else {
      console.log('Invalid or missing CV URL');
    }
  };
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
  if (isLoading) {
    return <LoadingScreen />;
  } else {
  return (
    <ScrollView>
      <View
        style={{
          backgroundColor: isDarkMode ? '#131313' : 'white',
          maxHeight: '150%',
        }}>
        <View style={{backgroundColor: isDarkMode ? '#131313' : 'white'}}>
 
        <View style={[styles.card, { backgroundColor: isDarkMode ? '#131313' : 'white', height:150 }]}>
  <View style={{ flexDirection: 'row', height:150, alignItems: 'center', justifyContent: 'center', gap: 10 }}>
    <Image
      source={{ uri: `https://1is.az/${cvIdc?.image}` }}
      style={{
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        
        marginLeft: 50,
      }}
    />

    <View style={{ justifyContent: 'center', alignItems: 'center', width: 130,  }}>
      <Text style={{ color: isDarkMode ? 'white' : 'black', fontFamily: 'Montserrat', fontSize: 16, fontWeight: '600', textTransform: 'capitalize', marginTop: 40,textAlign: 'center', }}>
        {cvIdc?.name} {cvIdc?.surname}
      </Text>
      <Text style={[styles.text, { textAlign: 'center', color: isDarkMode ? 'white' : 'black', }]}>{cvIdc?.position}</Text>
 
    </View>
    <View>
      <Pressable onPress={downloadPdf} style={styles.showAllButton}>
        <Text style={styles.showAllText}>{t('download_cv')}</Text>
        <Image
          source={require('AwesomeProject/src/assets/images/download.png')}
          style={{
            width: 15,
            height: 15,
            marginLeft: 8,
          }}
        />
      </Pressable>
    </View>
    <Text style={[styles.text, { textAlign: 'center' , marginTop:30, right:30, color: isDarkMode ? 'white' : 'black',}]}>{cvIdc?.salary}</Text>
  </View>
</View>

          <View style={[styles.container]}>
            <View style={styles.newcard}>
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                  alignSelf: 'center',
                  justifyContent: 'center',
                  paddingTop: 12,
                  fontWeight: 'bold',
                }}>
          {t('about_work')}
              </Text>
              <View>
                <View   style={[
              styles.card,
              {backgroundColor: isDarkMode ? '#131313' : 'white'},
            ]}>
                  <View style={styles.cardRow}>
                    <View
                      style={{
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}>
                      <View>
                        
    <View style={{flexDirection:"row", justifyContent:"space-between"}}>
    <View style={{flexDirection:"row"}}>
           <View style={{  padding:20, width:20,height:20, borderRadius:5,flexDirection:"row",  alignSelf:"center", alignItems:"center" , right:5, backgroundColor:"#E0D3F0",}}>
                  <Image
                    source={require('AwesomeProject/src/assets/images/bag.png')}
                    style={{
                      width: 15,
                      height: 15,
                  alignSelf:"center",
                  alignItems:"center",
             justifyContent:"center",
             alignContent:"center",
              marginLeft:-7
                    }}
                  />
            </View>
                       <View>
                       <Text style={styles.cardTitle}>{t('sahe')}</Text>
                        <Text style={[styles.cardText, {color: isDarkMode ? "white" : "black",  left:5}]}>{cvIdc?.position}</Text>
                      </View>
           </View>
           <View style={{flexDirection:"row", width: 140, }}>
           <View style={{  padding:20, width:20,height:20, borderRadius:5,flexDirection:"row",  alignSelf:"center", alignItems:"center" , right:24, backgroundColor:"#E0D3F0", left:-6}}>
                  <Image
                    source={require('AwesomeProject/src/assets/images/bag.png')}
                    style={{
                      width: 15,
                      height: 15,
                  alignSelf:"center",
                  alignItems:"center",
             justifyContent:"center",
             alignContent:"center",
              marginLeft:-7
                    }}
                  />
            </View>
                       <View>
                       <Text style={styles.cardTitle}>{t('tecrubecdf')}</Text>
                        <Text style={[styles.cardText, {color: isDarkMode ? "white" : "black", left:3}]}>
                          {
                            experiences.find(
                              experience =>
                                experience.id === cvIdc?.experience_id,
                            )?.title_az
                          }
                        </Text>
                      </View>
           </View>
    </View>
                       
                      </View>
                    </View>
                  </View>

                  <View style={styles.cardRow}>
                  <View style={styles.cardRow}>
    <View style={{flexDirection:"row", justifyContent:"space-between"}}>
    <View
    style={{
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'flex-end', 
    }}>
    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
    <View style={{  padding:20, width:20,height:20, borderRadius:5,flexDirection:"row",  right:15,   backgroundColor:"#E0D3F0",}}>
                  <Image
                    source={require('AwesomeProject/src/assets/images/cap.webp')}
                    style={{
                      width: 15,
                      height: 15,
                  alignSelf:"center",
                  alignItems:"center",
             justifyContent:"center",
             alignContent:"center",
              marginLeft:-7
                    }}
                  />
            </View>
   <View>
   <Text style={[styles.cardTitle, {left:-7}]}>{t('tehsil')}</Text>
      <Text style={[styles.cardText, { color: isDarkMode ? 'white' : 'black', left:-4 }]}>
    {
                            education.find(
                              experience =>
                                experience.id === cvIdc?.education_id,
                            )?.title_az
                          }    </Text>
   </View>
    </View>

  </View>
  <View
    style={{
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'flex-end', // Added to vertically center the image and text
    }}>
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', width: 130 }}>
    <View style={{  padding:20, width:20,height:20, borderRadius:5,flexDirection:"row",  right:5,   backgroundColor:"#E0D3F0",}}>
                  <Image
                    source={require('AwesomeProject/src/assets/images/moneymon.webp')}
                    style={{
                      width: 15,
                      height: 15,
                  alignSelf:"center",
                  alignItems:"center",
             justifyContent:"center",
             alignContent:"center",
              marginLeft:-7
                    }}
                  />
            </View>
   <View>
   <Text style={[styles.cardTitle, {marginRight:-17, left:2, padding:1}]}> {t('emek')}</Text>
      <Text style={[styles.cardText, { color: isDarkMode ? 'white' : 'black', left:8}]}>
      {cvIdc?.salary}
    </Text>
   </View>
    </View>
   
  </View>
    </View>
</View>

                  </View>
                </View>
              </View>
            </View>
            <View style={[styles.newcard, {marginTop: '50%'}]}>
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                  alignSelf: 'center',
                  justifyContent: 'center',
                  paddingTop: 12,
                  fontWeight: 'bold',
                }}>
          {t('ability')}
              </Text>
              <View>
              <View   style={[
              styles.card,
              {backgroundColor: isDarkMode ? '#131313' : 'white'},
            ]}>
  <View
    style={{
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 7,
      marginHorizontal: 91,
      marginTop: 25,
      width: 160,
      height: 34,
      backgroundColor: '#E0D3F0',
      borderRadius: 5,
    }}>
    {cvIdc?.skills ? (
      <Text style={{ color: isDarkMode ? '#FDFDFD' : '#161C2D' }}>
        {decodeHTMLEntities(cv[0].skills)}
      </Text>
    ) : (
      <Text style={{ color: isDarkMode ? '#FDFDFD' : '#161C2D' }}>
    {t('no_skill')}
      </Text>
    )}
  </View>
</View>

              </View>
            </View>
            <View style={[styles.newcard, {marginTop: '50%'}]}>
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                  alignSelf: 'center',
                  justifyContent: 'center',
                  paddingTop: 12,
                  fontWeight: 'bold',
                }}>
        {t('tehsil')}
              </Text>
              <View   style={[
              styles.card,
              {backgroundColor: isDarkMode ? '#131313' : 'white'},
            ]}>
                <View style={styles.cardRow}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <View style={{flexDirection:"row"}}>
                    <View style={{  padding:20, width:20,height:20, borderRadius:5,flexDirection:"row",  alignSelf:"center", alignItems:"center" , right:5, backgroundColor:"#E0D3F0",}}>
                  <Image
                    source={require('AwesomeProject/src/assets/images/cap.webp')}
                    style={{
                      width: 15,
                      height: 15,
                  alignSelf:"center",
                  alignItems:"center",
             justifyContent:"center",
             alignContent:"center",
              marginLeft:-7
                    }}
                  />
            </View>
            <View style={{ width: '100%', maxWidth: 300 }}> 
  <Text style={[styles.cardText, { color: isDarkMode ? "white" : '#161C2D' }]}> {decodeHTMLEntities(cvIdc?.about_education)}
  </Text>
</View>

                    </View>
                    {/* <View style={{flexDirection:"row"}}>
                    <View style={{  padding:20, width:20,height:20, borderRadius:5,flexDirection:"row",  alignSelf:"center", alignItems:"center" , right:5, backgroundColor:"#E0D3F0",}}>
                  <Image
                    source={require('AwesomeProject/src/assets/images/time.webp')}
                    style={{
                      width: 15,
                      height: 15,
                  alignSelf:"center",
                  alignItems:"center",
             justifyContent:"center",
             alignContent:"center",
              marginLeft:-7
                    }}
                  />
            </View>
                  <View >

                  <Text style={[styles.cardText, {    color: isDarkMode ? "white" : '#161C2D',}]}>
                        {
                          experiences.find(
                            experience =>
                              experience.id === cvIdc?.experience_id,
                          )?.title_az
                        }
                      </Text>
                  </View>
                    </View> */}
                  </View>
                </View>
              </View>
            </View>
            <View style={[styles.newcard, {marginTop: '50%'}]}>
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                  alignSelf: 'center',
                  justifyContent: 'center',
                  paddingTop: 12,
                  fontWeight: 'bold',
                }}>
 {t('ozel_melumatlar')}
              </Text>
              <View>
                <View   style={[
              styles.card,
              {backgroundColor: isDarkMode ? '#131313' : 'white'},
            ]}>
                      <View style={styles.cardRow}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <View style={{flexDirection:"row"}}>
                    <View style={{  padding:20, width:20,height:20, borderRadius:5,flexDirection:"row",  alignSelf:"center", alignItems:"center" , right:5, backgroundColor:"#E0D3F0",}}>
                  <Image
                    source={require('AwesomeProject/src/assets/images/bag.png')}
                    style={{
                      width: 15,
                      height: 15,
                  alignSelf:"center",
                  alignItems:"center",
             justifyContent:"center",
             alignContent:"center",
              marginLeft:-7
                    }}
                  />
            </View>
                     <View>
                     <Text style={styles.cardTitle}>{t('tarixsd')}</Text>
                     <Text style={[styles.cardText, {    color: isDarkMode ? "white" : '#161C2D', marginLeft:5}]}>
                      {moment(cvIdc?.birth_date).format('YYYY-MM-DD')}
                      </Text>
                     </View>
                    </View>
                    <View style={{flexDirection:"row"}}>
                    <View style={{  padding:20, width:20,height:20, borderRadius:5,flexDirection:"row",  alignSelf:"center", alignItems:"center" , right:5, backgroundColor:"#E0D3F0",}}>
                  <Image
                    source={require('AwesomeProject/src/assets/images/bag.png')}
                    style={{
                      width: 15,
                      height: 15,
                  alignSelf:"center",
                  alignItems:"center",
             justifyContent:"center",
             alignContent:"center",
              marginLeft:-7
                    }}
                  />
            </View>
                  <View >
                  <Text style={styles.cardTitle}>{t('unvan')}</Text>
                  <Text style={[styles.cardText, {    color: isDarkMode ? "white" : '#161C2D',marginLeft:5}]}>
                        {
                          cities.find(
                            experience =>
                              experience.id === cvIdc?.city_id,
                          )?.title_az
                        }
                      </Text>
                  </View>
                    </View>
                  </View>
                </View>
                </View>
              </View>
            </View>
            <View style={[styles.newcard, {marginTop: '50%', height:190, marginBottom:90}]}>
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                  alignSelf: 'center',
                  justifyContent: 'center',
                  paddingTop: 12,
                  fontWeight: 'bold',
                }}>
              Təcrübə
              </Text>
              <View>
              <View   style={[
              styles.card,
              {backgroundColor: isDarkMode ? '#131313' : 'white'},
            ]}>
  <View
    style={{
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 7,
      marginHorizontal: 61,
      marginTop: 25,
    
      backgroundColor: '#E0D3F0',
      borderRadius: 5,
    }}>
    {cvIdc?.work_history ? (
                  <View style={{ width: '100%', maxWidth: 700 }}> 
      <Text style={{ color: isDarkMode ? '#FDFDFD' : '#161C2D' }}>
          {decodeHTMLEntities(cvIdc.work_history)}
      </Text>
      </View>
    ) : (
      <Text style={{ color: isDarkMode ? '#FDFDFD' : '#161C2D' }}>
        Yoxdur
      </Text>
    )}
  </View>
</View>

              </View>
            </View>

          </View>
        </View>
      </View>
    </ScrollView>
  );}
};

export default CvInner;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 360,
    height: '100%',
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'column',
    borderRadius: 6,
    shadowColor: '#3C4858',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.15,
    shadowRadius: 3,
    marginBottom:70
  },
  card: {
    width: '100%',
    maxWidth: 360,
    height: 180,
    
    alignSelf: 'center',
    marginTop: 17,
    marginBottom: spacing.large,

    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  cardRow: {
    padding: 10,
    flexDirection: 'column',
  },
  cardTitle: {
    fontSize: 14,
    color: '#BDBDBD',
    left:5
  },
  cardText: {
    fontSize: 14,

  },
  cards: {
    width: '100%',
    maxWidth: 390,
    height: 160,
    color: '#fffff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  newcard: {
    width: '100%',
    maxWidth: 370,
    height: 70,
    backgroundColor: colors.primary,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  text: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    textAlign: 'center',
    marginLeft: 10,
    color: 'black',
  },
  showAllButton: {
    alignSelf: 'center',

    marginRight: 32,
    backgroundColor: '#8843E1',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  showAllText: {
    fontSize: 16,
    color: colors.white,
  },
});