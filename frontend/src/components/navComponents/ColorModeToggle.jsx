import { IconButton, useColorMode } from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

const ColorModeToggle = () => {
    const { colorMode, toggleColorMode } = useColorMode();

    const iconElement = colorMode === "light" ? <MoonIcon /> : <SunIcon />;

    return (
        <IconButton
            icon={iconElement}
            onClick={toggleColorMode}
            aria-label="Toggle color mode"
            variant="ghost"
        />
    );
};

export default ColorModeToggle;