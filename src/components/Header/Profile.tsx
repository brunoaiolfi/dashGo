import { Avatar, Box, Flex, Text } from "@chakra-ui/react";

interface ProfileProps {
    showProfileData: boolean;
}
export function HeaderProfile({ showProfileData }: ProfileProps) {
    return (
        <Flex
            align={'right'}>
            {
                showProfileData &&
                <Box mr="4" textAlign="right">
                    <Text >Bruno Aiolfi</Text>
                    <Text color="gray.300" fontSize="sm">bruno.aiolfi154@gmail.com</Text>
                </Box>
            }
            <Avatar
                size="md"
                name="Bruno Aiolfi"
                src="https://github.com/brunoaiolfi.png"
            />
        </Flex>
    )
}