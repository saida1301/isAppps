import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import Stories from 'react-native-story-component';

const StoryComponent = () => {
  const [watchedStories, setWatchedStories] = useState([]);

  useEffect(() => {
    loadWatchedStories();
  }, []);

  const loadWatchedStories = async () => {
    try {
      const storedWatchedStories = await AsyncStorage.getItem('watchedStories');
      if (storedWatchedStories) {
        setWatchedStories(JSON.parse(storedWatchedStories));
      }
    } catch (error) {
      console.error('Error loading watched stories:', error);
    }
  };

  const saveWatchedStories = async () => {
    try {
      await AsyncStorage.setItem('watchedStories', JSON.stringify(watchedStories));
    } catch (error) {
      console.error('Error saving watched stories:', error);
    }
  };

  const handleStoryClose = (closedStory) => {
    const { id, redirect_link } = closedStory;
    if (!watchedStories.includes(id)) {
      setWatchedStories([...watchedStories, id]);
      saveWatchedStories();
  
      // Ensure redirect_link is a string
      const link = String(redirect_link);
  
      if (link && !watchedStories.includes(id)) {
        setWatchedStories([...watchedStories, id]);
        saveWatchedStories();
  
        // Navigate to redirect_link
        try {
          Linking.openURL(link);
        } catch (error) {
          console.error('Failed to open URL:', error);
        }
      }
    }
  };

  const newData = [
    {
      id: 10,
      avatar: 'https://1is.az/back/assets/images/stories/story_4yZPf1.png',
      stories: [
        {
          id: 1,
          image: 'https://1is..az/back/assets/images/stories/story_4yZPf1.png',
          swipeText: 'Custom swipe text for this story',
          onPress: () => console.log('story 1 swiped'),
          redirect_link: "https://1is.az/",
        },
        {
          id: 2,
          image: 'https://1is.butagrup.az/back/assets/images/stories/story_4yZPf1.png',
          swipeText: 'Custom swipe text for this story',
          onPress: () => console.log('story 2 swiped'),
          redirect_link: "https://1is.az/", 
        },
      ],
    },
    // Add more data objects if needed...
  ];

  const RedirectLinkButton = ({ link }) => {
    const handleLinkPress = async () => {
      try {
        await Linking.openURL(link);
      } catch (error) {
        console.error('Failed to open URL:', error);
      }
    };

    return (
      <TouchableOpacity style={styles.redirectLinkButton} onPress={handleLinkPress}>
        <Text style={styles.redirectLinkButtonText}>Visit Link</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View>
 <Stories
        data={newData}
        duration={10}
        onStart={(openedStory) => {
          console.log(openedStory);
        }}
        onClose={handleStoryClose}
        customSwipeUpButton={(story) => (
          // Pass the individual redirect_link for each story
          <RedirectLinkButton link={newData[0]?.stories[0]?.redirect_link} />

        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  // ... (existing styles)

  redirectLinkButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  redirectLinkButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default StoryComponent;