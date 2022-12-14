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
import { formattedPurchases, Purchases } from "../types/purchases";

interface ClientsListProps {
    clientsSeriesData: number[]
    clientsCategories: Date[]
    purchasesCategories: Date[],
    purchasesSeriesData: number[]
}

const Chart = dynamic(() => import('react-apexcharts'), {
    ssr: false
})

export default function Dashboard({ clientsCategories, clientsSeriesData, purchasesCategories, purchasesSeriesData, }: ClientsListProps) {

    const clientsOptions: ApexOptions = {
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
            type: 'category',
            axisBorder: {
                color: theme.colors.gray[600]
            },
            axisTicks: {
                color: theme.colors.gray[600]
            },
            categories: clientsCategories,
            tickAmount: 7
        },
    }

    const clientsSeries = [
        {
            name: 'Clientes', data: clientsSeriesData
        }
    ]

    const purchasesOptions: ApexOptions = {
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
            type: 'category',
            axisBorder: {
                color: theme.colors.gray[600]
            },
            axisTicks: {
                color: theme.colors.gray[600]
            },
            categories: purchasesCategories,
        },
    }

    const purchasesSeries = [
        {
            name: 'Vendas', data: purchasesSeriesData
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
                            options={clientsOptions}
                            series={clientsSeries}
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
                            type="line"
                            height={160}
                            options={purchasesOptions}
                            series={purchasesSeries}
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

    const clientsCategories: string[] = []
    const clientsSeriesData: number[] = [];

    try {
        const { data } = await api.get<Client[]>('/client/all')
        const clientsFormatted: formatedClient[] = data.map(({
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

        clientsFormatted.map(({ dtCreated }) => {
            if (!clientsCategories.find((el) => el === dtCreated)) {
                clientsCategories.push(dtCreated)
            }
        })

        const clientsGrouped = groupBy(clientsFormatted, 'dtCreated')

        clientsCategories.map((el) => {
            clientsSeriesData.push(clientsGrouped[el]?.length ?? 0)
        })

    } catch (error) {
        console.log(error)
    }

    const purchasesCategories: string[] = []
    const purchasesSeriesData: number[] = [];

    try {
        const { data } = await api.get<Purchases[]>('/Purchases/all')

        const purchasesFormatted: formattedPurchases[] = data.map(({
            dtCreated,
            id,
            value,
        }) => {
            return {
                id,
                value,
                dtCreated: new Date(dtCreated).toLocaleDateString('en-GB')
            }
        })

        purchasesFormatted.map(({ dtCreated }) => {
            if (
                !purchasesCategories.find((el) => el == dtCreated)
            ) {
                purchasesCategories.push(dtCreated)
            }
        })

        const PurchasesGrouped = groupBy(purchasesFormatted, 'dtCreated')

        purchasesCategories.map((el) => {
            let totalValue = 0;
            PurchasesGrouped[el]?.map(({ value }) => {
                totalValue += value
            })
            purchasesSeriesData.push(totalValue)
        })

    } catch (error) {
        console.log(error)
    }

    return {
        props: {
            clientsCategories,
            clientsSeriesData,

            purchasesCategories,
            purchasesSeriesData
        }
    }
}