import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AudioContext } from "../Context/AudioProvider";
import color from "../misc/color";
import { selectAudio } from "../misc/audioController";

const MiniPlayer = ({ navigation }) => {
  const context = useContext(AudioContext);
  const { currentAudio, isPlaying } = context;

  if (!currentAudio) return null;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.navigate("Player")}
    >
      <View style={styles.details}>
        <Text style={styles.title} numberOfLines={1}>
          {currentAudio.filename}
        </Text>
      </View>
      <MaterialCommunityIcons
        name={isPlaying ? "pause-circle" : "play-circle"}
        size={40}
        color={color.ACTIVE_BG}
        onPress={async () => await selectAudio(currentAudio, context)}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: color.ACTIVE_BG_LIGHT,
    padding: 10,
    // borderTopWidth: 1,
    // borderTopColor: color.FONT_MEDIUM,
  },
  details: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontSize: 16,
    color: color.FONT,
  },
});

export default MiniPlayer;
