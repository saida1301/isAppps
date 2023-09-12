import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { colors } from '../assets/themes';

interface PickedFile {
  fileCopyUri: null | string;
  name: string;
  size: number;
  type: string;
  uri: string;
}

interface CandidateFormData {
  name: string;
  email: string;
  surname: string;
  phone: string;
  cvFile: PickedFile | null;
}

interface CandidateFormProps {
  onSubmit: (formData: CandidateFormData) => void;
}

const CandidateForm: React.FC<CandidateFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [surname, setSurname] = useState('');
  const [phone, setPhone] = useState('');
  const [file, setFile] = useState<PickedFile | null>(null);
  const {t} = useTranslation();
  const handleSubmit = () => {
    // Validation and form data checks can be added here if needed

    // Call the onSubmit function passed as a prop with the form data
    onSubmit({ name, email, surname, phone, file });
  };

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });

      setFile(result);
      console.log(result)
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('Cancelled');
      } else {
        console.log('Error: ', err);
      }
    }
  };

  return (
    <View style={styles.container}>
    <TextInput
      style={styles.input}
      placeholder={t('name')}
      value={name}
      onChangeText={setName}
    />
    <TextInput
      style={styles.input}
      placeholder={t('email')}
      value={email}
      onChangeText={setEmail}
      keyboardType="email-address"
    />
    <TextInput
      style={styles.input}
      placeholder={t('surname')}
      value={surname}
      onChangeText={setSurname}
    />
    <TextInput
      style={styles.input}
      placeholder={t('number')}
      value={phone}
      onChangeText={setPhone}
      keyboardType="phone-pad"
    />
  {file ? (
        <Text
          style={{
            color: 'white',
            padding: 10,
            marginHorizontal: 20,
            backgroundColor: colors.primary,
          }}>
          {file[0].name}
        </Text>
      ) : (
        <TouchableOpacity onPress={pickFile} style={styles.fileButton}>
        <Text style={{ padding:10, alignSelf:"center"}}>{t('add')}</Text>
        <Icon
          name="plus"
          size={16}
          color="#282828"
          style={styles.plusIcon}

        />

      </TouchableOpacity>
      
      )}
      {/* <Button title="Submit" onPress={handleSubmit} /> */}
    <Pressable onPress={handleSubmit} style={styles.submitButton}>
      <Text style={{color:"white", textAlign:"center", alignSelf:"center"}}>{t('aproved')}</Text>
    </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    width: "100%",
    maxWidth:400,
    padding: 19,
    alignItems: 'center',
    backgroundColor: '#FDFDFD',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 1,
    gap: 10,
  },
  input: {
    width: '100%',
    borderColor: 'black',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
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
    flexDirection:"row", justifyContent:"flex-start", alignItems:"flex-start", alignSelf:"flex-start"
  },
  plusIcon: {
    marginRight: 40,
    marginTop:30
  },
  submitButton: {
    backgroundColor: colors.primary, // Set the background color to blue (#007BFF)
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 10,
    marginVertical: 20,
    width:"80%"
  },
});

export default CandidateForm;