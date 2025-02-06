import {
  View,
  Text,
  StyleSheet,
  Modal,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import color from "../misc/color";
import AudioListItem from "./../components/AudioListItem";
import { Ionicons } from "@expo/vector-icons";
import { useContext, useState } from "react";
import { AudioContext } from "../Context/AudioProvider";
import OptionModal from "../components/OptionModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { selectAudio } from "../misc/audioController";
import MiniPlayer from "../components/MiniPlayer";
import Screen from "../components/Screen";

function PlayListDetails(props) {
  const playList = props.route.params;
  const context = useContext(AudioContext);
  const [optionModalVissible, setOptionModalVissible] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [audios, setAudios] = useState(playList.audios);

  const playAudio = async (song) => {
    await selectAudio(song, context, {
      activePlayList: playList,
      isPlayListRunning: true,
    });
  };
  const colseModal = () => {
    setSelectedItem({});
    setOptionModalVissible(false);
  };
  const removeAudio = async () => {
    let isPlaying = context.isPlaying;
    let isPlayListRunning = context.isPlayListRunning;
    let soundObj = context.soundObj;
    let playbackPosition = context.playbackPosition;
    let activePlayList = context.activePlayList;
    if (
      context.isPlayListRunning &&
      context.currentAudio.id === selectedItem.id
    ) {
      await context.playbackObj.stopAsync();
      await context.playbackObj.unloadAsync();
      isPlaying = false;
      isPlayListRunning = false;
      soundObj = null;
      playbackPosition = 0;
      activePlayList = [];
    }
    const newAudios = audios.filter((audio) => audio.id !== selectedItem.id);
    const result = await AsyncStorage.getItem("playlist");
    if (result !== null) {
      const oldPlayList = JSON.parse(result);

      const updatedPlaylist = oldPlayList.filter((item) => {
        if (item.id === playList.id) {
          item.audios = newAudios;
        }
        return item;
      });

      await AsyncStorage.setItem("playlist", JSON.stringify(updatedPlaylist));
      context.updateState(context, {
        playList: updatedPlaylist,
        isPlayListRunning,
        activePlayList,
        playbackPosition,
        soundObj,
        isPlaying,
      });
    }
    setAudios(newAudios);
    colseModal();
  };
  const removePlaylist = async () => {
    let isPlaying = context.isPlaying;
    let isPlayListRunning = context.isPlayListRunning;
    let soundObj = context.soundObj;
    let playbackPosition = context.playbackPosition;
    let activePlayList = context.activePlayList;
    if (context.isPlayListRunning && activePlayList.id === playList.id) {
      await context.playbackObj.stopAsync();
      await context.playbackObj.unloadAsync();
      isPlaying = false;
      isPlayListRunning = false;
      soundObj = null;
      playbackPosition = 0;
      activePlayList = [];
    }
    const result = await AsyncStorage.getItem("playlist");
    if (result !== null) {
      const oldPlayList = JSON.parse(result);

      const updatedPlaylist = oldPlayList.filter(
        (item) => item.id !== playList.id
      );

      await AsyncStorage.setItem("playlist", JSON.stringify(updatedPlaylist));
      context.updateState(context, {
        playList: updatedPlaylist,
        isPlayListRunning,
        activePlayList,
        playbackPosition,
        soundObj,
        isPlaying,
      });
    }
    props.navigation.goBack();
  };

  return (
    <>
      <Screen>
        <View style={styles.container}>
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 15,
            }}
          >
            <Ionicons
              name="chevron-back-outline"
              size={28}
              colo="rgb(46, 46, 46, 0.89)"
              style={{ marginTop: 5 }}
              onPress={() => props.navigation.goBack()}
            />
            <Text style={styles.titles}>{playList.title}</Text>
            <TouchableOpacity onPress={removePlaylist}>
              <Text style={[styles.titles, { color: "#ff0000" }]}>Delete</Text>
            </TouchableOpacity>
          </View>
          {audios.length ? (
            <FlatList
              contentContainerStyle={styles.listContainer}
              data={audios}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={{ marginBottom: 10 }}>
                  <AudioListItem
                    title={item.filename}
                    duration={item.duration}
                    onAudioPress={() => {
                      playAudio(item);
                    }}
                    isPlaying={context.isPlaying}
                    activeListItem={item.id === context.currentAudio.id}
                    onOptionPress={() => {
                      setSelectedItem(item);
                      setOptionModalVissible(true);
                    }}
                  />
                </View>
              )}
            />
          ) : (
            <Text
              style={{
                fontWeight: "bold",
                color: color.FONT_LIGHT,
                fontSize: 24,
                paddingTop: 50,
              }}
            >
              No Audio
            </Text>
          )}
        </View>

        <OptionModal
          visible={optionModalVissible}
          onClose={colseModal}
          options={[{ title: "Remove from playList", onPress: removeAudio }]}
          currentItem={selectedItem}
        />
      </Screen>
      <MiniPlayer navigation={props.navigation} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },

  listContainer: {
    padding: 20,
  },
  titles: {
    textAlign: "center",
    fontSize: 20,
    paddingVertical: 5,
    fontWeight: "bold",
    color: color.ACTIVE_BG,
  },
});

export default PlayListDetails;
