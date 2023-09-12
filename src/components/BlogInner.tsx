import { Image, ScrollView, StyleSheet, Text, View, useColorScheme } from 'react-native';
import React, { useEffect, useState } from 'react';

import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome'; // You can use a different icon library if desired
import axios from 'axios';


const BlogInner = ({ route }: any) => {
  const { blogId } = route.params;
  const [entries, setEntries] = useState<any[]>([]);
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get('https://movieappi.onrender.com/blogs');
        const data = response.data;
  
        const filteredBlogs = data.filter((blog: { view: number }) => blog.view > 100);
        
        // Sort filteredBlogs in descending order based on creation date
        const sortedBlogs = filteredBlogs.sort((a, b) =>
          moment(a.view).diff(moment(b.view))
        );
        
        setEntries(sortedBlogs);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };
  
    fetchBlogs();
  }, []);
  console.log(blogId)
  const blog = entries.find((c: { id: any }) => c.id === blogId);
  const isDarkMode = useColorScheme() === 'dark';
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
      ['#[\\d]+', (match) => String.fromCharCode(parseInt(match.substr(1)))],
      ['#[\\d]+;', (match) => String.fromCharCode(parseInt(match.substr(2, match.length - 3)))] , // Numeric character references like &#123;
      ['[\\w]+', ','], // Catch-all for other named entities like &something;
    ];
  
    var tagsToRemove = [
      'ul', 'li', 'span', 'style', 'font', 'p', 'o:p', 'style',
      'br', 'a', 'div', 'h4', 'strong', 'b', 'i'
    ];
  
    for (var i = 0, len = entities.length; i < len; i++) {
      var entityName = entities[i][0];
      var entityValue = entities[i][1];
      
      if (typeof entityValue === 'string') {
        text = text?.replace(new RegExp('&' + entityName + ';', 'g'), entityValue);
      } else if (typeof entityValue === 'function') {
        text = text?.replace(new RegExp('&' + entityName + ';', 'g'), entityValue(entityName));
      }
    }
  
    for (var i = 0, len = tagsToRemove.length; i < len; i++) {
      text = text?.replace(new RegExp('<' + tagsToRemove[i] + '[^>]*>', 'g'), '');
      text = text?.replace(new RegExp('</' + tagsToRemove[i] + '>', 'g'), '');
    }
  
    return text;
  }
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={[styles.blogContainer, { backgroundColor: isDarkMode ? "#0D0D0D" : "#FFFFFF" }]}>
        <Text style={[styles.title, { color: isDarkMode ? "#FDFDFD" : "#020202" }]}>{blog?.title_az}</Text>
        <Image
          source={{ uri: `https://1is.az/${blog?.image}` }}
          style={styles.image}
        />
        <Text style={[styles.content, { color: isDarkMode ? "#FDFDFD" : "#020202" }]}>{decodeHTMLEntities(blog?.content_az)}</Text>
        <View style={styles.dateContainer}>
          <Icon name="calendar" size={16} color={isDarkMode ? "#FDFDFD" : "#020202"} style={styles.calendarIcon} />
          <Text style={[styles.date, { color: isDarkMode ? "#FDFDFD" : "#020202" }]}>
            {moment(blog?.created_at).format('DD.MM.YYYY')}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  blogContainer: {
    flex: 1,
    padding: 16,

    elevation: 3, // Add elevation for a slight shadow effect
  },
  title: {
    fontWeight: "bold", // Changed to bold for better readability
    fontSize: 24, // Increased font size for the title
    marginBottom: 12,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    borderRadius: 8, // Rounded corners for the image
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  date: {
    fontSize: 14,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  calendarIcon: {
    marginRight: 5,
  },
});
export default BlogInner;