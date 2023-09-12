import { View } from "react-native";
import React from "react";

import NavigateTo from "../components/NavigateTo"

type AuthHeader = {
    title: string,
    navigateTo?: string,
    showUnderline?: boolean,
    textColor?: string,
}

const AuthHeader = ({ title, navigateTo, showUnderline, textColor }: AuthHeader) => {
    return (
        <View>
            <NavigateTo
                showUndeline={showUnderline} 
                textStyle={{
                    textAlign: 'center',
                    color: textColor 
                }}
                title={title}
                navigateTo={navigateTo} />
        </View>
    );
};

export default AuthHeader;