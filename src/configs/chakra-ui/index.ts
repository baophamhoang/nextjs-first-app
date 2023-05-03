import { ThemeConfig } from "@chakra-ui/theme";
import { colorMode } from "./color-mode";
import { colors } from "./colors";

export const chakraTheme: ThemeConfig = {
  ...colors,
  ...colorMode,
};
