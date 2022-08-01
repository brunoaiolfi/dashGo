import { FormControl, FormErrorMessage, FormLabel, Input, InputProps as ChakraInputProps } from '@chakra-ui/react';
import { forwardRef } from 'react';
import { FieldError } from 'react-hook-form';

interface IInputProps extends ChakraInputProps {
    label?: string;
    name: string;
    errors?: FieldError
}

const InputBase = ({ name, label, errors, ...rest  }: IInputProps, ref) => {
    return (

        <FormControl isInvalid={!!errors}>
            {
                label &&
                <FormLabel htmlFor={name}>{label}</FormLabel>
            }
            <Input
                {...rest}
                name={name}
                type={name}
                id={name}
                focusBorderColor='pink.500'
                bgColor="gray.900"
                variant={'filled'}
                _hover={{
                    bgColor: 'gray.900'
                }}
                size="lg"
                ref={ref}
            />
            {
                !!errors &&
                <FormErrorMessage>
                    {errors.message}
                </FormErrorMessage>
            }
        </FormControl>

    )
}

export const InputComponent = forwardRef(InputBase)