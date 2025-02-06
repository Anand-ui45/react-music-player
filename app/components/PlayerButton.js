import { AntDesign } from "@expo/vector-icons";
import color from "../misc/color";

function PlayerButton(Props) {
  const { iconType, size = 40, iconColor = color.ACTIVE_BG, onPress } = Props;
  const getIconName = (type) => {
    switch (type) {
      case "PLAY":
        return "pausecircle";
      case "PAUSE":
        return "playcircleo";
      case "NEXT":
        return "forward";
      case "PREV":
        return "banckward";
    }
  };
  return (
    <AntDesign
      onPress={onPress}
      name={getIconName(iconType)}
      size={size}
      color={iconColor}
      {...Props}
    />
  );
}

export default PlayerButton;
