import { IconButton, useColorMode } from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

const ColorModeToggle = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    const icon = colorMode === "light" ? <MoonIcon /> : <SunIcon />;

    return (
        <IconButton
            icon={icon}
            onClick={toggleColorMode}
            aria-label="Toggle color mode"
            variant="ghost"
        />
    );
};

export default ColorModeToggle;