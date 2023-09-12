
import { StyleSheet } from 'react-native';
import { borderRadius, colors } from '../../assets/themes';

export default StyleSheet.create({
    button: {
        backgroundColor: colors.primary,
        paddingVertical: 17,
        borderRadius: borderRadius.small
    },
    buttonDis: {
        paddingVertical: 17,
        borderRadius: borderRadius.small,
        backgroundColor: colors.primary + '50'
    },
    label: {
        color: colors.white,
        textAlign: 'center',
    },

});