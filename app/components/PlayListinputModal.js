import {
  StyleSheet,
  Modal,
  View,
  Text,
  TextInput,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableOpacity,
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
          <Text style={styles.title}>Create New Playlist</Text>
          <TextInput
            style={styles.input}
            placeholder="New playlist"
            value={playListName}
            onChangeText={(text) => setPlayListName(text)}
            placeholderTextColor={color.ACTIVE_BG}
          />
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <AntDesign name="check" size={24} color="#fff" />
          </TouchableOpacity>
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
    width: width - 40,
    padding: 20,
    borderRadius: 20,
    backgroundColor: color.APP_BG,
    alignItems: "center",

    shadowColor: color.ACTIVE_BG,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 10,

    elevation: 10,
  },
  title: {
    color: color.ACTIVE_BG,
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: color.ACTIVE_BG,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    color: color.ACTIVE_FONT,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: color.ACTIVE_BG,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",

    shadowColor: color.ACTIVE_BG,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
  },
  modalBG: {
    backgroundColor: "#000",
    opacity: 0.5,
  },
});

export default PlayListInputModal;
