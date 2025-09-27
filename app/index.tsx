import { ThemedText } from "@/components/themed-text";
import { View } from "react-native";

export default function HomeScreen(){
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ThemedText>Home</ThemedText>
      </View>
    );
}