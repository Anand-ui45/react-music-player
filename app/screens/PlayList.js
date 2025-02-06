import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import color from "../misc/color";
import PlayListinputModal from "../components/PlayListinputModal";
import { useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AudioContext } from "../Context/AudioProvider";
import MiniPlayer from "../components/MiniPlayer";
import Screen from "../components/Screen";

let selectedPlayList = {};
function PlayList({ navigation }) {
  const [modalVissible, setModalVissible] = useState(false);

  const context = useContext(AudioContext);
  const { playList, addToPlayList, updateState } = context;
  const createPlayList = async (playListName) => {
    const result = await AsyncStorage.getItem("playlist");
    if (result !== null) {
      const audios = [];
      if (addToPlayList) {
        audios.push(addToPlayList);
      }
      const newList = {
        id: Date.now(),
        title: playListName,
        audios: audios,
      };

      const updatedList = [...playList, newList];

      updateState(context, { addToPlayList: null, playList: updatedList });
      await AsyncStorage.setItem("playlist", JSON.stringify(updatedList));
    }
    setModalVissible(false);
  };

  const renderPlayList = async () => {
    const result = await AsyncStorage.getItem("playlist");
    if (result === null) {
      const defaultPlayList = {
        id: Date.now(),
        title: "My Favorite",
        audios: [],
      };
      const newPlaylist = [...playList, defaultPlayList];
      updateState(context, { playList: [...newPlaylist] });
      return await AsyncStorage.setItem(
        "playlist",
        JSON.stringify([...newPlaylist])
      );
    }
    updateState(context, { playList: JSON.parse(result) });
  };

  const handleBannerPress = async (newPlaylist) => {
    if (addToPlayList) {
      const result = await AsyncStorage.getItem("playlist");
      let oldList = [];
      let updatedList = [];
      let sameAudio = false;

      if (result !== null) {
        oldList = JSON.parse(result);
        updatedList = oldList.filter((list) => {
          if (list.id === newPlaylist.id) {
            for (let audio of list.audios) {
              if (audio.id === addToPlayList.id) {
                sameAudio = true;
                return;
              }
            }
            list.audios = [...list.audios, addToPlayList];
          }
          return list;
        });
      }
      if (sameAudio) {
        Alert.alert(
          "Found same audio!",
          `${addToPlayList.filename} is already inside the list.`
        );
        sameAudio = false;
        return updateState(context, {
          addToPlayList: null,
        });
      }
      updateState(context, { addToPlayList: null, playList: updatedList });
      return AsyncStorage.setItem("playlist", JSON.stringify([...updatedList]));
    }
    selectedPlayList = newPlaylist;
    // setShowDetails(true);
    navigation.navigate("PlayListDetails", newPlaylist);
  };
  useEffect(() => {
    if (!playList.length) {
      renderPlayList();
    }
  }, []);

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container}>
        {playList.length
          ? playList.map((item) => (
              <TouchableOpacity
                key={item.id.toString()}
                style={styles.playListBanner}
                onPress={() => handleBannerPress(item)}
              >
                <Text>{item.title}</Text>
                <Text style={styles.audioCount}>
                  {item.audios.length > 1
                    ? `${item.audios.length} Songs`
                    : `${item.audios.length} Song`}
                </Text>
              </TouchableOpacity>
            ))
          : null}

        <TouchableOpacity
          onPress={() => {
            setModalVissible(true);
          }}
          style={{ marginTop: 15 }}
        >
          <Text style={styles.playListBtn}>+ Add New Playlist</Text>
        </TouchableOpacity>
        <PlayListinputModal
          visible={modalVissible}
          onClose={() => setModalVissible(false)}
          onSubmit={createPlayList}
        />
      </ScrollView>
      <MiniPlayer navigation={navigation} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  audioCount: {
    marginTop: 5,
    opacity: 0.5,
    fontSize: 14,
  },
  playListBanner: {
    padding: 5,
    backgroundColor: color.PLAYLIST_BANNER,
    borderRadius: 5,
    marginBottom: 10,
  },
  playListBtn: {
    color: color.ACTIVE_BG,
    letterSpacing: 1,
    fontWeight: "bold",
    padding: 5,
  },
});

export default PlayList;
