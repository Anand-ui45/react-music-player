import { storeAudioForNextOpen } from "./helper";

//play audio
export const play = async (playbackObj, uri, lastPosition) => {
  try {
    if (!lastPosition) {
      return await playbackObj.loadAsync(
        { uri },
        { shouldPlay: true, progressUpdateIntervalMillis: 1000 }
      );
    }
    await playbackObj.loadAsync(
      { uri },
      { progressUpdateIntervalMillis: 1000 }
    );
    return await playbackObj.playFromPositionAsync(lastPosition);
  } catch (err) {
    console.log("error inside play helper method", err.message);
  }
};

//pause audio
export const pause = async (playbackObj) => {
  try {
    return await playbackObj.setStatusAsync({
      shouldPlay: false,
    });
  } catch (err) {
    console.log("error inside pause helper method", err.message);
  }
};

//resume audio
export const resume = async (playbackObj) => {
  try {
    return await playbackObj.playAsync();
  } catch (err) {
    console.log("error inside resume helper method", err.message);
  }
};

//select another audio
export const playNext = async (playbackObj, uri) => {
  try {
    // await playbackObj.stopAsync();
    await playbackObj.unloadAsync();
    return await play(playbackObj, uri);
  } catch (err) {
    console.log("error inside playNext helper method", err.message);
  }
};

export const selectAudio = async (audio, context, playListInfo = {}) => {
  const {
    soundObj,
    playbackObj,
    currentAudio,
    updateState,
    audioFiles,
    onPlaybackStatusUpdate,
  } = context;

  try {
    //play
    if (soundObj === null) {
      const status = await play(playbackObj, audio.uri, audio.lastPosition);
      const index = audioFiles.findIndex(({ id }) => id === audio.id);

      updateState(context, {
        currentAudio: audio,
        soundObj: status,
        isPlaying: true,
        currentAudioIndex: index,
        isPlayListRunning: false,
        activePlayList: [],
        ...playListInfo,
      });

      playbackObj.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
      return await storeAudioForNextOpen(audio, index);
    }
    //pause
    if (
      soundObj.isLoaded &&
      (soundObj.isPlaying || soundObj.isBuffering) &&
      currentAudio.id === audio.id
    ) {
      const status = await pause(playbackObj);
      // console.log(status);

      return updateState(context, {
        soundObj: status,
        isPlaying: false,
        playbackPosition: status.positionMillis,
      });
    }
    //resume
    if (
      soundObj.isLoaded &&
      !soundObj.isPlaying &&
      currentAudio.id === audio.id
    ) {
      const status = await resume(playbackObj);

      return updateState(context, { soundObj: status, isPlaying: true });
    }
    //select another audio
    if (
      soundObj.isLoaded &&
      (soundObj.isPlaying || !soundObj.isPlaying) &&
      currentAudio.id !== audio.id
    ) {
      const status = await playNext(playbackObj, audio.uri);
      const index = audioFiles.findIndex(({ id }) => id === audio.id);
      updateState(context, {
        currentAudio: audio,
        soundObj: status,
        isPlaying: true,
        currentAudioIndex: index,
        isPlayListRunning: false,
        activePlayList: [],
        ...playListInfo,
      });
      return storeAudioForNextOpen(audio, index);
    }
  } catch (err) {
    console.log("error inside select Audio helper method", err.message);
  }
};

const selectAudioFromPlayList = async (context, select) => {
  const { activePlayList, currentAudio, audioFiles, playbackObj, updateState } =
    context;
  let audio;
  let defaultIndex;
  let nextIndex;
  const indexOnPlayList = activePlayList.audios.findIndex(
    ({ id }) => id === currentAudio.id
  );
  if (select === "next") {
    nextIndex = indexOnPlayList + 1;
    defaultIndex = 0;
  }
  if (select === "previous") {
    nextIndex = indexOnPlayList - 1;
    defaultIndex = activePlayList.audios.length - 1;
  }

  audio = activePlayList.audios[nextIndex];
  if (!audio) audio = activePlayList.audios[defaultIndex];
  const indexOnAllList = audioFiles.findIndex(({ id }) => id === audio.id);
  const status = await playNext(playbackObj, audio.uri);
  return updateState(context, {
    soundObj: status,
    isPlaying: true,
    currentAudio: audio,
    currentAudioIndex: indexOnAllList,
  });
};

export const changeAudio = async (context, select) => {
  const {
    playbackObj,
    currentAudioIndex,
    totalAudioCount,
    audioFiles,
    updateState,
    onPlaybackStatusUpdate,
    isPlayListRunning,
  } = context;
  if (isPlayListRunning) return selectAudioFromPlayList(context, select);

  try {
    const { isLoaded } = await playbackObj.getStatusAsync();
    const isLastAudio = currentAudioIndex + 1 === totalAudioCount;
    const isFirstAudio = currentAudioIndex <= 0;
    let audio;
    let index;
    let status;

    //for next
    if (select === "next") {
      audio = audioFiles[currentAudioIndex + 1];
      if (!isLoaded && !isLastAudio) {
        index = currentAudioIndex + 1;
        status = await play(playbackObj, audio.uri);
        playbackObj.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
      }
      if (isLoaded && !isLastAudio) {
        index = currentAudioIndex + 1;
        status = await playNext(playbackObj, audio.uri);
      }
      if (isLastAudio) {
        index = 0;
        audio = audioFiles[index];
        if (isLoaded) {
          status = await playNext(playbackObj, audio.uri);
        } else {
          status = await play(playbackObj, audio.uri);
        }
      }
    }

    //for previous
    if (select === "previous") {
      audio = audioFiles[currentAudioIndex - 1];
      if (!isLoaded && !isFirstAudio) {
        index = currentAudioIndex - 1;
        status = await play(playbackObj, audio.uri);
        playbackObj.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
      }
      if (isLoaded && !isFirstAudio) {
        index = currentAudioIndex - 1;
        status = await playNext(playbackObj, audio.uri);
      }
      if (isFirstAudio) {
        index = totalAudioCount - 1;
        audio = audioFiles[index];
        if (isLoaded) {
          status = await playNext(playbackObj, audio.uri);
        } else {
          status = await play(playbackObj, audio.uri);
        }
      }
    }
    updateState(context, {
      currentAudio: audio,
      soundObj: status,
      isPlaying: true,
      currentAudioIndex: index,
      playbackPosition: null,
      playbackDuration: null,
    });
    await storeAudioForNextOpen(audio, index);
  } catch (error) {
    console.log("error inside changeAudio helper method", err.message);
  }
};

export const moveAudio = async (context, value, wasPlaying, setWasPlaying) => {
  const { soundObj, isPlaying, updateState, playbackObj } = context;

  try {
    await playbackObj.setPositionAsync(
      Math.floor(soundObj.durationMillis * value)
    );
    if (soundObj === null || !isPlaying) return;

    if (wasPlaying) {
      const status = await resume(playbackObj);

      updateState(context, {
        soundObj: status,
        playbackPosition: status.positionMillis,
        isPlaying: true,
      });
    }

    setWasPlaying(false);
  } catch (error) {
    console.log("error inside onSlidingComplete call back", error);
  }
};
