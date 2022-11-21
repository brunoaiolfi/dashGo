import { Stack } from "@chakra-ui/react";
import { RiDashboardLine, RiContactsLine, RiInputMethodLine, RiGitMergeLine } from "react-icons/ri";
import { BsBoxSeam } from "react-icons/bs";
import { FaRegMoneyBillAlt } from "react-icons/fa";
import { NavLink } from "./NavLink";
import { NavSection } from "./NavSection";

export function SideBarNav() {
    return (
        <Stack spacing="12" align="flex-start">
            <NavSection title="GERAL" >
                <NavLink children='Dashboard' icon={RiDashboardLine} href="/dashboard" />
            </NavSection>
            <NavSection title="CADASTROS" >
                <NavLink children='Vendas' icon={FaRegMoneyBillAlt} href="/purchases" />
                <NavLink children='Clientes' icon={RiContactsLine} href="/clients" />
                <NavLink children='Estoque' icon={RiDashboardLine} href="/stock" />
                <NavLink children='Produtos' icon={BsBoxSeam} href="/products" />
            </NavSection>
        </Stack>
    )
}