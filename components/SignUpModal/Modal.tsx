import { Modal, Button, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Toaster, toast } from 'sonner';
import { useEffect } from 'react';
import { useFormState } from 'react-dom';

import { createAccount } from '@/actions/createAccount';
import SubmitButton from '../SubmitButton/SubmitButton';
import styles from './styles.module.css';

const SignUpModal = ({
  setAuth,
}: {
  setAuth: (value: {
    message: string;
    success: boolean;
    username: string;
  }) => void;
}) => {
  const [opened, { open, close }] = useDisclosure(false);

  const [broadcast, formAction]: any = useFormState(createAccount, {
    message: '',
    success: false,
    username: '',
  });

  useEffect(() => {
    if (broadcast.success && broadcast.message) {
      toast.success(broadcast.message);
      setAuth(broadcast);
    } else if (!broadcast.success && broadcast.message) {
      toast.error(broadcast.message);
    }
  }, [broadcast, setAuth]);

  return (
    <>
      <Modal opened={opened} onClose={close} title="Sign Up" centered>
        <form action={formAction}>
          <TextInput
            label="Username"
            placeholder="Type here your username"
            name="username"
            data-cy="usernameInput"
            type="text"
            required
          />
          <TextInput
            mt="md"
            label="Password"
            placeholder="Min 8 characters"
            name="password"
            type="password"
            data-cy="passwordInput"
            minLength={8}
            maxLength={24}
            required
          />

          <SubmitButton
            valueInRequest="Creating Account..."
            defaultValue="Create Account"
            mt="xl"
            fullWidth
            dataCy="createAccountButton"
          />
        </form>
      </Modal>

      <Button onClick={open} data-cy="signUpModalButton">Sign Up</Button>

      <div className={styles.absoluteNotification}>
        {/* Prevents "Jumps" in the interface */}
        <Toaster richColors />
      </div>
    </>
  );
};

export default SignUpModal;
