import { Stack } from "@chakra-ui/react";
import { RiDashboardLine, RiContactsLine, RiInputMethodLine, RiGitMergeLine } from "react-icons/ri";
import { NavLink } from "./NavLink";
import { NavSection } from "./NavSection";

export function SideBarNav() {
    return (
        <Stack spacing="12" align="flex-start">
            <NavSection title="GERAL" >
                <NavLink children='Dashboard' icon={RiDashboardLine}  href="/dashboard"/>
                <NavLink children='Usuários' icon={RiContactsLine}  href="/users"/>
            </NavSection>

            <NavSection title="AUTOMAÇÃO" >
                <NavLink children='Formulários' icon={RiInputMethodLine}  href="/forms" />
                <NavLink children='Automação' icon={RiGitMergeLine}  href="/automation"/>
            </NavSection>
        </Stack>
    )
}