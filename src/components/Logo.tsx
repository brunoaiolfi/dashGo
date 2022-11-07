import { Text } from "@chakra-ui/react";

export function HeaderLogo() {
    return (
        <Text
            fontSize={["2xl", "3xl"]}
            fontWeight="bold"
            letterSpacing="tight"
        >
            DashGo
            <Text
                as="span"
                color={'pink.500'}
                ml="1"
            >
                .
            </Text>
        </Text>
    )
}