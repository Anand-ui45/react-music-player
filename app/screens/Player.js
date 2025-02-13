import { StyleSheet, Text, View, Dimensions } from "react-native";
import Screen from "../components/Screen";
import color from "../misc/color";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import PlayerButton from "../components/PlayerButton";
import { useContext, useEffect, useState } from "react";
import { AudioContext } from "./../Context/AudioProvider";

import {
  changeAudio,
  moveAudio,
  pause,
  selectAudio,
} from "../misc/audioController";
import { convertTime } from "../misc/helper";

const { width } = Dimensions.get("window");

function Player() {
  const context = useContext(AudioContext);
  const { playbackPosition, playbackDuration, currentAudio } = context;
  const [currentPosition, setCurrentPosition] = useState(0);
  const [wasPlaying, setWasPlaying] = useState(false);
  const calculateSeekbar = () => {
    if (playbackPosition !== null && playbackDuration !== null) {
      return playbackPosition / playbackDuration;
    }
    if (currentAudio.lastPosition) {
      return currentAudio.lastPosition / (currentAudio.duration * 1000);
    }

    return 0;
  };
  const handlePlayPause = async () => {
    await selectAudio(context.currentAudio, context);
  };

  const handleNext = async () => {
    await changeAudio(context, "next");
  };
  const handlePrevious = async () => {
    await changeAudio(context, "previous");
  };
  const renderCrtTime = () => {
    if (!context.soundObj && currentAudio.lastPosition) {
      return convertTime(currentAudio.lastPosition / 1000);
    }
    return convertTime(context.playbackPosition / 1000);
  };
  useEffect(() => {
    context.loadPreviousAudio();
  }, []);

  if (!context.currentAudio) return null;
  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.audioCountContainer}>
          <View style={{ flexDirection: "row" }}>
            {context.isPlayListRunning && (
              <>
                <Text style={{ fontWeight: "bold", color: color.FONT_LIGHT }}>
                  From Playlist:
                </Text>
                <Text style={{ color: color.ACTIVE_BG }}>
                  {context.activePlayList.title}
                </Text>
              </>
            )}
          </View>
          <Text style={styles.audioCount}>{`${context.currentAudioIndex + 1}/${
            context.totalAudioCount
          }`}</Text>
        </View>
        <View style={styles.midBannerContainer}>
          <MaterialCommunityIcons
            name="music-circle"
            size={300}
            color={context.isPlaying ? color.ACTIVE_BG : color.FONT_MEDIUM}
          />
        </View>
        <View>
          <Text numberOfLines={1} style={styles.audioTitle}>
            {context.currentAudio.filename}
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 15,
            }}
          >
            <Text style={{ color: color.FONT_LIGHT }}>
              {currentPosition
                ? currentPosition
                : renderCrtTime()
                ? renderCrtTime()
                : "00:00"}
            </Text>
            <Text style={{ color: color.FONT_LIGHT }}>
              {convertTime(context.currentAudio.duration)}{" "}
            </Text>
          </View>
          <Slider
            style={{ width: width, height: 40 }}
            minimumValue={0}
            maximumValue={1}
            value={calculateSeekbar()}
            minimumTrackTintColor={color.ACTIVE_BG}
            maximumTrackTintColor={color.ACTIVE_BG}
            thumbTintColor={color.ACTIVE_BG}
            onValueChange={(value) => {
              setCurrentPosition(
                convertTime(value * context.currentAudio.duration)
              );
            }}
            onSlidingStart={async () => {
              try {
                setWasPlaying(true);
                // await pause(context.playbackObj);
              } catch (error) {
                console.log("error inside onSlidingStart call back", error);
              }
            }}
            onSlidingComplete={async (value) => {
              await moveAudio(context, value, wasPlaying, setWasPlaying);
              setCurrentPosition(0);
            }}
          />
          <View style={styles.audioControllerwraper}>
            <View style={styles.audioControllers}>
              <PlayerButton iconType="PREV" onPress={handlePrevious} />
              <PlayerButton
                iconType={context.isPlaying ? "PLAY" : "PAUSE"}
                style={{ margin: 15 }}
                onPress={handlePlayPause}
              />
              <PlayerButton iconType="NEXT" onPress={handleNext} />
            </View>
          </View>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  audioCount: {
    textAlign: "right",

    color: color.FONT_LIGHT,
    fontSize: 14,
  },
  midBannerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  audioCountContainer: {
    flexDirection: "row",
    paddingHorizontal: 15,
    justifyContent: "space-between",
  },
  audioTitle: {
    fontSize: 16,
    color: color.FONT,
    padding: 15,
  },
  audioControllerwraper: {
    width: width,
    justifyContent: "center",
    alignItems: "center",
  },
  audioControllers: {
    width: width - 120,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 20,
  },
});

export default Player;
