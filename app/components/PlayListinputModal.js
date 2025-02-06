import {
  StyleSheet,
  Modal,
  View,
  Text,
  TextInput,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import color from "../misc/color";
import { useState } from "react";

function PlayListInputModal({ visible, onClose, onSubmit }) {
  const [playListName, setPlayListName] = useState("");

  const handleSubmit = () => {
    if (!playListName.trim()) {
      onClose(); // Close modal if the input is empty
    } else {
      onSubmit(playListName); // Submit playlist name
      setPlayListName(""); // Clear the input field
      onClose(); // Close modal
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={[StyleSheet.absoluteFillObject, styles.modalBG]} />
      </TouchableWithoutFeedback>
      <View style={styles.modalContainer}>
        <View style={styles.inputContainer}>
          <Text style={{ color: color.ACTIVE_BG, fontSize: 20 }}>
            Create New Playlist
          </Text>
          <TextInput
            style={styles.input}
            placeholder="New playlist"
            value={playListName}
            onChangeText={(text) => setPlayListName(text)}
          />
          <AntDesign
            name="check"
            size={24}
            color={color.ACTIVE_FONT}
            style={styles.submitIcon}
            onPress={handleSubmit} // Use the correct handler
          />
        </View>
      </View>
    </Modal>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    width: width - 20,
    height: 200,
    borderRadius: 10,
    backgroundColor: color.ACTIVE_FONT,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
  },
  input: {
    width: width - 40,
    borderBottomWidth: 1,
    borderBottomColor: color.ACTIVE_BG,
    fontSize: 18,
    paddingVertical: 5,
    marginBottom: 15,
  },
  submitIcon: {
    padding: 10,
    backgroundColor: color.ACTIVE_BG,
    borderRadius: 10,
    marginTop: 10,
  },
  modalBG: {
    backgroundColor: color.MODAL_BG,
    opacity: 0.5,
  },
});

export default PlayListInputModal;
