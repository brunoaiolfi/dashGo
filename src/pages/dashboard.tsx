import { Header } from "../components/Header";
import dynamic from 'next/dynamic'
import { Flex, SimpleGrid, Box, Text, theme } from '@chakra-ui/react'
import { SideBar } from "../components/Sidebar";
import { ApexOptions } from 'apexcharts';
import { GetServerSideProps } from "next";
import { createApi } from "../services/api";
import { Client, formatedClient } from "../types/client";
import { parseCookies } from "nookies";
import groupBy from "../utils/groupBy";

interface ClientsListProps {
    seriesData: number[]
    categories: Date[]
}

const Chart = dynamic(() => import('react-apexcharts'), {
    ssr: false
})

export default function Dashboard({ categories, seriesData }: ClientsListProps) {

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
            enabled: true
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
            categories: categories,
            tickAmount: 7
        },
    }

    const series = [
        {
            name: 'Clientes', data: seriesData
        }
    ]

    return (
        <Flex direction="column" h="100vh" >
            <Header />

            <Flex w="100%" maxWidth={1480} mx="auto" px="6" mt="8" >
                <SideBar />

                <SimpleGrid
                    flex="1"
                    gap="4"
                    minChildWidth="320px"
                    alignSelf="flex-start"
                >
                    <Box
                        p={["6", "8"]}
                        bg="gray.800"
                        borderRadius="8px"
                        pb="4"
                        maxWidth={564}
                        w="100%"
                    >
                        <Text fontSize="lg" mb="4">Clientes cadastrados</Text>
                        <Chart
                            type="line"
                            height={160}
                            options={options}
                            series={series}
                        />
                    </Box>
                    <Box
                        p={["6", "8"]}
                        bg="gray.800"
                        borderRadius="8px"
                        pb="4"
                        maxWidth={564}
                        w="100%"
                    >
                        <Text fontSize="lg" mb="4">Lucro das vendas</Text>
                        <Chart
                            type="area"
                            height={160}
                            options={options}
                            series={series}
                        />
                    </Box>
                </SimpleGrid>
            </Flex>

        </Flex >
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const api = createApi(ctx);

    const {
        ['@dashGo:user']: tempUser
    } = parseCookies(ctx);

    const user = JSON.parse(tempUser ?? "{}")
    const { token } = user

    if (!token) {
        return {
            redirect: {
                destination: '/',
                permanent: true
            }
        }
    }

    const categories: Date[] = []
    const seriesData: number[] = [];

    try {
        const { data } = await api.get<Client[]>('/client/all')

        const tempClientsFormatted: formatedClient[] = data.map(({
            dtCreated,
            id,
            name,
        }) => {
            return {
                id,
                name,
                dtCreated: new Date(dtCreated).toLocaleDateString('en-GB')
            }
        })

        data.map(({ dtCreated }) => {
            if (!categories.find((el) =>
                new Date(dtCreated).toLocaleDateString('en-GB') ==
                new Date(el).toLocaleDateString('en-GB')
            )) {
                categories.push(dtCreated)
            }
        })

        const tempCategoriesFormatted: string[] = []

        tempClientsFormatted.map(({ dtCreated }) => {
            if (!tempCategoriesFormatted.find((el) => dtCreated === el)) {
                tempCategoriesFormatted.push(dtCreated)
            }
        })

        const clientsGrouped = groupBy(tempClientsFormatted, 'dtCreated')

        tempCategoriesFormatted.map((el) => {
            seriesData.push(clientsGrouped[el]?.length ?? 0)
        })

    } catch (error) {
        console.log(error)
    }

    return {
        props: {
            categories,
            seriesData
        }
    }
} 
