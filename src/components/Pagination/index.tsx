import { Box, Button, Stack, Text, useBreakpointValue } from "@chakra-ui/react";
import { useState } from "react";
import { PaginationItem } from "./PaginationItem";

interface IPagination {
    totalCount: number;
    registerPerPage?: number;
    currentPage?: number;
    onPageChange: (page: number) => void;
}

const siblingsCount = 1;

export function Pagination({ totalCount, currentPage = 10, onPageChange, registerPerPage = 1, }: IPagination) {


    const lastPage = Math.floor(totalCount / registerPerPage);

    const previousPages = currentPage > 1
        ? generatePagesArray(currentPage - 1 - siblingsCount, currentPage - 1)
        : [];

    const nextPages = currentPage < lastPage
        ? generatePagesArray(currentPage, Math.min(currentPage + siblingsCount, lastPage))
        : [];

    function generatePagesArray(from: number, to: number) {
        return [... new Array(to - from)].map((_, index) => {
            return from + index + 1
        })
            .filter(page => page > 0)
    }

    return (
        <Stack direction={["column", "row"]} my="8" justify={"space-between"} align="center" spacing={"6"}>
            <Box>
                <strong>0</strong> - <strong>10 de 100 usuários</strong>
            </Box>

            <Stack direction="row" spacing="2">

                {
                    currentPage > (1 + siblingsCount) &&
                    <>
                        <PaginationItem onPageChange={onPageChange} number={1} />
                        {
                            currentPage > (2 + siblingsCount) &&
                            <Text color="gray.300" w="8" textAlign="center">
                                ...
                            </Text>
                        }
                    </>
                }
                
                {previousPages.length > 0 && previousPages.map(page => {
                    return <PaginationItem onPageChange={onPageChange} number={page} key={page} />
                })}

                <PaginationItem onPageChange={onPageChange} number={currentPage} isCurrent />

                {nextPages.length > 0 && nextPages.map(page => {
                    return <PaginationItem onPageChange={onPageChange} number={page} key={page} />
                })}

                {
                    (currentPage + siblingsCount) < lastPage &&
                    <>
                        {
                            currentPage + 1 + siblingsCount < (lastPage) &&
                            <Text color="gray.300" w="8" textAlign="center">
                                ...
                            </Text>
                        }
                        <PaginationItem onPageChange={onPageChange} number={lastPage} />
                    </>
                }

            </Stack>
        </Stack>
    )
}