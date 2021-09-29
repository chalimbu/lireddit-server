import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { useField } from "formik";
import React, { InputHTMLAttributes } from "react";

type InputFielProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  placeholder: string;
  label: string
};

export const InputFiel: React.FC<InputFielProps> = (props) => {
  const [field, { error }] = useField(props);
  return (
    <FormControl isInvalid={!!error}>{/*cast empty string to false*/}
      <FormLabel htmlFor={field.name}>{props.label}</FormLabel>
      <Input {...field} id={field.name} placeholder="name" />
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
};
