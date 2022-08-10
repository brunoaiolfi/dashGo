import { Box, Button, Stack, useBreakpointValue } from "@chakra-ui/react";
import { PaginationItem } from "./PaginationItem";

interface IPagination {
    totalCount: number;
    registerPerPage?: number;
    currentPage?: number;
    onChangePage: (page: number) => void;
}
export function Pagination({ totalCount, currentPage, onChangePage, registerPerPage, }: IPagination) {

    const lastPage = Math.ceil(totalCount / registerPerPage);

    return (
        <Stack direction={["column", "row"]} my="8" justify={"space-between"} align="center" spacing={"6"}>
            <Box>
                <strong>0</strong> - <strong>10 de 100 usuários</strong>
            </Box>

            <Stack direction="row" spacing="2">
                <PaginationItem number={1} isCurrent />
                <PaginationItem number={2} />
                <PaginationItem number={3} />
                <PaginationItem number={4} />
                <PaginationItem number={5} />
            </Stack>
        </Stack>
    )
}