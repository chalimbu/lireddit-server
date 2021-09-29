import React from "react";
import { Formik, Form } from "formik";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Wrapper } from "../components/Wrapper";
import { InputFiel } from "../components/InputFiel";
import { Box } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={(values) => {
          console.log(values);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputFiel
              name="username"
              placeholder="username"
              label="Username"
            />
            <Box mt={4}>
              <InputFiel
                name="password"
                placeholder="password"
                label="Password"
              />
            </Box>
            <Button
              mt={4}
              type="submit"
              colorScheme="teal"
              isLoading={isSubmitting}
            >
              register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Register;
