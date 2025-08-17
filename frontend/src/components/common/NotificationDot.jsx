import { Box } from "@chakra-ui/react";

export default function NotificationDot({
                                            show,
                                            size = 10,   // px
                                            top = -2,    // px
                                            right = -2,  // px
                                            color = "red.400",
                                        }) {
    if (!show) return null;
    return (
        <Box
            position="absolute"
            top={`${top}px`}
            right={`${right}px`}
            w={`${size}px`}
            h={`${size}px`}
            bg={color}
            borderRadius="full"
            boxShadow="0 0 0 2px white"
            pointerEvents="none"
            zIndex={1}
        />
    );
}