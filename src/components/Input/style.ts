
import { StyleSheet } from 'react-native';
import { borderRadius, colors, fontSizes, spacing } from '../../assets/themes';

export default StyleSheet.create({
  
    inputView: {
        paddingVertical: spacing.large
    },
    inputStyle: {
        fontSize: fontSizes.medium,
        borderColor: colors.black + '60',
        borderWidth: 1,
        borderRadius:borderRadius.medium,
        paddingHorizontal: spacing.medium,
    },

    buttonStyle: {
        fontSize: fontSizes.large,
        // marginBottom: spacing.medium,
    },
    buttonView: {
        marginTop: spacing.medium
    },
    textView:{
        paddingVertical: spacing.medium,
        color: colors.black
    },
    labelStyle: {
        fontWeight: 'bold', fontSize: 16, color: 'red'
    }
   
});