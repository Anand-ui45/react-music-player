import React, { Component } from "react";
import { Dimensions, StatusBar } from "react-native";
import { AudioContext } from "../Context/AudioProvider";
import { RecyclerListView, LayoutProvider } from "recyclerlistview";
import AudioListItem from "../components/AudioListItem";
import Screen from "../components/Screen";
import OptionModal from "../components/OptionModal";

import { selectAudio } from "../misc/audioController";
import MiniPlayer from "../components/MiniPlayer";
import color from "../misc/color";

const { width } = Dimensions.get("window");

class AudioList extends Component {
  static contextType = AudioContext;

  constructor(props) {
    super(props);
    this.state = {
      optionModalVissible: false,
    };
    this.currentItem = {};
  }

  // Define the LayoutProvider
  layoutProvider = new LayoutProvider(
    (index) => "audio", // Define a single view type
    (type, dim) => {
      switch (type) {
        case "audio":
          dim.width = width; // Full width of the screen
          dim.height = 70; // Fixed height for each row
          break;
        default:
          dim.width = 0;
          dim.height = 0;
      }
    }
  );

  handleAudioPress = async (audio) => {
    await selectAudio(audio, this.context);
  };
  componentDidMount() {
    this.context.loadPreviousAudio();
  }

  navigateToPlayList = () => {
    this.context.updateState(this.context, {
      addToPlayList: this.currentItem,
    });

    this.props.navigation.navigate("PlayLists", { screen: "PlayList" });
  };

  // Row Renderer
  rowRenderer = (type, item, index, extendedState) => {
    return (
      <AudioListItem
        title={item.filename}
        duration={item.duration}
        isPlaying={extendedState.isPlaying}
        activeListItem={this.context.currentAudioIndex === index}
        onAudioPress={() => {
          this.handleAudioPress(item);
        }}
        onOptionPress={() => {
          this.currentItem = item;
          this.setState({ ...this.state, optionModalVissible: true });
        }}
      />
    );
  };

  render() {
    return (
      <AudioContext.Consumer>
        {({ dataProvider, isPlaying }) => {
          if (!dataProvider._data.length) return null;
          return (
            <Screen>
              <StatusBar backgroundColor={"#000"} barStyle={"light-content"} />
              <RecyclerListView
                dataProvider={dataProvider}
                layoutProvider={this.layoutProvider}
                rowRenderer={this.rowRenderer}
                extendedState={{ isPlaying }}
              />
              <OptionModal
                options={[
                  {
                    title: "Add to PlayList",
                    onPress: this.navigateToPlayList,
                  },
                ]}
                onClose={() =>
                  this.setState({ ...this.state, optionModalVissible: false })
                }
                visible={this.state.optionModalVissible}
                currentItem={this.currentItem}
              />
              <MiniPlayer navigation={this.props.navigation} />
            </Screen>
          );
        }}
      </AudioContext.Consumer>
    );
  }
}

export default AudioList;
