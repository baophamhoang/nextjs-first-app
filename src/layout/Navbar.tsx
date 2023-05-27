import { IconButton, Tooltip, useColorMode } from "@chakra-ui/react";
import { FaMoon, FaSun } from "react-icons/fa";
import styles from "../styles/Layout.module.css";

export default function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode();
  const isNightMode = colorMode === "dark";
  return (
    <>
      <div className={styles.Navbar}>
        <span>Place Navbar here</span>
        <div id="nav-buttons-group">
          <Tooltip label="Toggle Dark mode" fontSize="md">
            <>
              {isNightMode && (
                <IconButton
                  aria-label="Switch light/night"
                  icon={<FaSun />}
                  onClick={toggleColorMode}
                />
              )}
              {!isNightMode && (
                <IconButton
                  aria-label="Switch light/night"
                  icon={<FaMoon />}
                  onClick={toggleColorMode}
                />
              )}
            </>
          </Tooltip>
        </div>
      </div>
    </>
  );
}
