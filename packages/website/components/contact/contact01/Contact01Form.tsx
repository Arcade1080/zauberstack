import {
  Button,
  Checkbox,
  SimpleGrid,
  Space,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import * as Yup from "yup";

type ContactForm01Props = {
  title: string;
  description: string;
};

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Please enter a valid email address."),
  message: Yup.string().min(
    6,
    "Your message should have at least 6 characters.",
  ),
});

const Contact01Form = ({ title, description }: ContactForm01Props) => {
  const form = useForm({
    initialValues: {
      firstname: "",
      lastname: "",
      email: "",
      message: "",
      termsOfService: false,
    },
    validateInputOnBlur: true,
    validate: yupResolver(validationSchema),
  });
  return (
    <>
      <Stack gap="sm" maw={500}>
        <Title size="h1">{title}</Title>
        <Text size="lg">{description}</Text>
      </Stack>
      <Space h="xl" />
      <form onSubmit={form.onSubmit((values) => console.log(values))}>
        <Stack gap="lg">
          <SimpleGrid cols={{ base: 1, sm: 2 }}>
            <TextInput
              {...form.getInputProps("firstname")}
              label="First name"
              placeholder="Your first name"
              size="md"
            />
            <TextInput
              {...form.getInputProps("lastname")}
              label="Last name"
              size="md"
              placeholder="Your last name"
            />
          </SimpleGrid>

          <TextInput
            required
            label="Email"
            size="md"
            placeholder="hello@zauberproject.com"
            {...form.getInputProps("email")}
          />

          <Textarea
            label="Your message"
            required
            {...form.getInputProps("messsage")}
            size="md"
            placeholder="Please include all relevant information"
            minRows={10}
          />
          <Checkbox
            label="You agree to our terms of service."
            {...form.getInputProps("termsOfService", { type: "checkbox" })}
          />
        </Stack>
        <Space h="xl" />
        <Button fullWidth size="md" type="submit">
          Send message
        </Button>
      </form>
    </>
  );
};

export default Contact01Form;
