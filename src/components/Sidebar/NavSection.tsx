import { Box, Icon, Link, Stack, Text } from "@chakra-ui/react";
import { ReactNode } from "react";
import { RiContactsLine, RiDashboardLine } from "react-icons/ri";

interface NavLinkProps {
    title: string;
    children: ReactNode
}
export function NavSection({ title, children }: NavLinkProps) {
    return (
        <Box >
            <Text
                fontSize="small"
                fontWeight="bold"
                color="pink.400"
            >
                {title}
            </Text>
            <Stack
                spacing="4"
                mt="8"
                align="stretch"
            >
               {children}
            </Stack>
        </Box>
    )
}