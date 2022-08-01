import { Header } from "../components/Header";
import dynamic from 'next/dynamic'
import { Flex, SimpleGrid, Box, Text, Stack, FormLabel, FormControl, theme } from '@chakra-ui/react'
import { SideBar } from "../components/Sidebar";
import { useState } from "react";
import { ApexOptions } from 'apexcharts';

const options: ApexOptions = {
    chart: {
        toolbar: {
            show: false
        },
        zoom: {
            enabled: false
        },
        foreColor: theme.colors.gray[500]
    },
    grid: {
        show: false
    },
    dataLabels: {
        enabled: false
    },
    tooltip: {
        enabled: false
    },
    xaxis: {
        type: 'datetime',
        axisBorder: {
            color: theme.colors.gray[600]
        },
        axisTicks: {
            color: theme.colors.gray[600]
        },
        categories: [
            '2020-01-01T00:00:00.000Z',
            '2020-01-02T00:00:00.000Z',
            '2020-01-03T00:00:00.000Z',
            '2020-01-04T00:00:00.000Z',
            '2020-01-05T00:00:00.000Z',
            '2020-01-06T00:00:00.000Z',
            '2020-01-07T00:00:00.000Z',
            '2020-01-08T00:00:00.000Z',
            '2020-01-09T00:00:00.000Z'
        ],
    }
}

const series = [
    { name: 's1', data: [31, 120, 10, 27, 93, 5, 0, 0, 123] }
]

const Chart = dynamic(() => import('react-apexcharts'), {
    ssr: false
})

export default function Dashboard() {

    return (
        <Flex direction="column" h="100vh" >
            <Header />

            <Flex w="100%" maxWidth={1480} mx="auto" px="6" mt="8" >
                <SideBar />

                <SimpleGrid flex="1" gap="4" minChildWidth="320px" alignSelf="flex-start">
                    <Box
                        p={["6","8"]}
                        bg="gray.800"
                        borderRadius="8px"
                        pb="4"
                    >
                        <Text fontSize="lg" mb="4">Inscritos da semana</Text>
                        <Chart
                            type="area"
                            height={160}
                            options={options}
                            series={series}
                        />
                    </Box>
                    <Box
                        p={["6","8"]}
                        bg="gray.800"
                        borderRadius="8px"
                        pb="4"

                    >
                        <Text fontSize="lg" mb="4">Taxa de abertura</Text>
                        <Chart
                            type="area"
                            height={160}
                            options={options}
                            series={series}
                        />
                    </Box>

                </SimpleGrid>
            </Flex>

        </Flex>
    )
}