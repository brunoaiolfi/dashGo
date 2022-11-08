import React, { useContext, useEffect, useState } from 'react';
import { Flex, Input, Button, Stack, FormLabel, FormControl, useFormControl, Text, HStack, IconButton, Modal, ModalBody, ModalContent, ModalOverlay, Box, Divider, Heading, Link, SimpleGrid, VStack, Avatar } from '@chakra-ui/react'
import { InputComponent } from '../components/Form/Input';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { User } from '../types/user';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import { HeaderLogo } from '../components/Logo';

interface FormLoginProps {
  email: string;
  password: string;
}

const signInFormSchema = yup.object().shape({
  email: yup.string().email('E-mail inválido!').required('E-mail é obrigatório!'),
  password: yup.string().required('Senha é obrigatória!'),
})

interface FormCreateUserProps {
  name: string;
  email: string;
  avatarUrl: string;
  password: string;
  passwordConfirmation: string;
}

const createUserSchema = yup.object().shape({
  name: yup.string().required('Nome é obrigatório!'),
  email: yup.string().email('E-mail inválido!').required('E-mail é obrigatório!'),
  password: yup.string().required('Senha é obrigatória!').min(6, 'Senha deve ter no mínimo 6 caracteres!'),
  passwordConfirmation: yup.string().oneOf([yup.ref('password'), null], 'Senhas não conferem!'),
})


export default function Login() {

  const [modalVisible, setModalVisible] = useState(false)
  const { signIn } = useAuth()

  const { register, handleSubmit, formState } = useForm<FormLoginProps>({
    resolver: yupResolver(signInFormSchema)
  })

  const { register: registerUser, handleSubmit: handleSubmitUser, formState: formStateUser, watch: watchUser } = useForm<FormCreateUserProps>({
    resolver: yupResolver(createUserSchema)
  })

  const { errors } = formState;
  const { errors: errorsUser } = formStateUser;


  function handleSignIn({ email, password }: FormLoginProps) {
    signIn({ email, password })
  }

  async function createUser({ email, password, name, avatarUrl, passwordConfirmation, }: FormCreateUserProps) {
    try {
      const { data } = await api.post<User>('/user', {
        email,
        password,
        name,
        avatarUrl,
      })

      toast.success("Usuário criado com sucesso!")
      return data;
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <Flex
        width="100vw"
        height="100vh"
        alignItems='center'
        justifyContent="center"
        display={modalVisible ? "none" : "flex"}
      >
        <Flex
          as="form"
          width="100%"
          maxWidth="360px"
          background="gray.800"
          padding="8"
          borderRadius={8}
          flexDirection="column"
          onSubmit={handleSubmit(handleSignIn)}
        >
          <Stack
            flex="1"
            spacing="4"
            alignItems="center"
            w="100%"
          >
            <HeaderLogo />
            <Divider my="6" borderColor="gray.700" />

            <InputComponent
              {...register('email', { required: true })}
              type="email"
              name="email"
              label="E-mail"
              errors={errors.email}
            />

            <InputComponent
              {...register('password', { required: true })}
              type="password"
              name="password"
              label="Senha"
              errors={errors.password}
            />

          </Stack>

          <Button
            type="submit"
            marginTop="12"
            size="lg"
            colorScheme="pink"
          >
            Entrar
          </Button>

          <Text
            as="button"
            type="button"
            onClick={() => setModalVisible(true)}
            textAlign="center"
            fontSize={14}
            marginTop={4}
          >
            Não possui conta? <Text as="span" color="pink.500"> Cadastre-se aqui.</Text>
          </Text>
        </Flex>
      </Flex>


      <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
        <ModalOverlay />
        <ModalContent alignItems="center" justifyContent="center" bg="gray.800">
          <ModalBody w={800} bg="gray.800" borderRadius={8}>

            <Box as="form" onSubmit={handleSubmitUser(createUser)} w={800} flex="1" borderRadius={8} bg="gray.800" p="8" >

              <Heading size="lg" fontWeight="normal">
                Criar usuário
              </Heading>

              <Divider my="6" borderColor="gray.700" />

              <VStack spacing="8">
                <SimpleGrid minChildWidth="240px" spacing="8" w="100%">

                  <InputComponent
                    name="name"
                    label="Nome Completo"
                    {...registerUser('name', { required: true })}
                    errors={errorsUser.name}
                  />

                  <InputComponent
                    name="email"
                    label="E-mail"
                    type="email"
                    {...registerUser('email', { required: true })}
                    errors={errorsUser.email}
                  />

                </SimpleGrid>

                <SimpleGrid minChildWidth="240px" spacing="8" w="100%">

                  <InputComponent
                    name="password"
                    label="Senha"
                    type="password"
                    {...registerUser('password', { required: true })}
                    errors={errorsUser.password}
                  />
                  <InputComponent
                    name="passwordConfirmation"
                    label="Confirme sua senha"
                    type="password"
                    {...registerUser("passwordConfirmation")}
                    errors={errorsUser.passwordConfirmation}
                  />

                </SimpleGrid>

                <SimpleGrid minChildWidth="240px" spacing="8" w="100%">

                  <InputComponent
                    name="avatarUrl"
                    label="Link do seu avatar"
                    {...registerUser('avatarUrl')}
                  />

                  <Avatar
                    border="1px solid white"
                    size="2xl"
                    ml="25%"
                    name={"User avatar"}
                    src={watchUser('avatarUrl')}
                  />
                </SimpleGrid>
              </VStack>

              <Flex mt="12" justify="flex-end">
                <HStack spacing="4">
                  <Button colorScheme="gray" onClick={() => setModalVisible(false)}> Cancelar</Button>
                  <Button type="submit" colorScheme="pink"> Salvar</Button>
                </HStack>
              </Flex>
            </Box>

          </ModalBody>
        </ModalContent>
      </Modal >
    </>

  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const {
    ['@dashGo:user']: tempUser
  } = parseCookies(ctx);

  const user = JSON.parse(tempUser ?? "{}");
  const { token } = user;

  if (token) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: true,
      }
    }
  }

  return {
    props: {}
  }
}