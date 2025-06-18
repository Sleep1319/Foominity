import { Button } from "@chakra-ui/react";
import { Links as RouterLink  } from "react-router-dom";
import React from "react";

const NavMenu = () => (
    <>
        <Button as={RouterLink} to="/review" variant="ghost">
            Review
        </Button>
        <Button as={RouterLink} to="/freeboard" variant="ghost">
            FreeBoard
        </Button>
        <Button as={RouterLink} to="/notice" variant="ghost">
            Notice
        </Button>
        <Button as={RouterLink} to="/report" variant="ghost">
            Report
        </Button>
    </>
);

export default NavMenu;