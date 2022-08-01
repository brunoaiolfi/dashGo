import { useDisclosure, UseDisclosureReturn } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { ReactNode, useContext, createContext, useEffect } from "react";

interface SidebarDrawerProps {
    children: ReactNode;
}

type SidebarDrawerContextType = UseDisclosureReturn

const SidebarDrawerContext = createContext({} as SidebarDrawerContextType);

export function SidebarDrawerProvider({ children }: SidebarDrawerProps) {

    const disclosure = useDisclosure()

    const router = useRouter();

    useEffect(() => {
        disclosure.onClose()
    }, [router.pathname]);
    
    return (
        <SidebarDrawerContext.Provider value={disclosure}>
            {children}
        </SidebarDrawerContext.Provider>
    )
}

export const useSidebarDrawer = () => useContext(SidebarDrawerContext)