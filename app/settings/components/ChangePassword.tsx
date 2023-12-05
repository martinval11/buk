'use client';

import { useDisclosure } from '@mantine/hooks';
import { Button, Modal, TextInput } from '@mantine/core';
import { Toaster, toast } from 'sonner';
import { supabase } from '@/lib/supabaseClient';
import { useRef } from 'react';
import { USERS_TABLE } from '@/keys/keys';
import { encrypt } from '@/lib/security/encrypt';
import { decrypt } from '@/lib/security/decrypt';

const ChangePasswordModal = () => {
  const [opened, { open, close }] = useDisclosure(false);

  const currentPasswordRef: any = useRef<HTMLInputElement>(null);
  const newPasswordRef: any = useRef<HTMLInputElement>(null);

  const changePassword = async (event: React.FormEvent) => {
    event.preventDefault();

    const username = localStorage.getItem('username');
    const currentPassword = currentPasswordRef.current.value;
    const newPassword = newPasswordRef.current.value;

    const { data: passwordUserOnDB } = await supabase
      .from(USERS_TABLE)
      .select('password')
      .eq('username', username);

    const passwordOnDB = passwordUserOnDB[0].password;
    console.log(passwordOnDB)

    console.log(decrypt(passwordOnDB))

    if (decrypt(passwordOnDB) === currentPassword) {
      const { error } = await supabase
        .from(USERS_TABLE)
        .update({ password: encrypt(newPassword) })
        .eq('username', username);

      if (error) {
        toast.error('Something went wrong.');
        throw new Error(error.message);
      }

      toast.success('Password changed successfully.');
      return;
    }
    toast.error('Passwords do not match.');
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title="Login" centered>
        <form onSubmit={changePassword}>
          <TextInput
            mt="md"
            label="Your current password"
            placeholder="Your current password"
            name="currentPassword"
            ref={currentPasswordRef}
            data-cy="currentPasswordInput"
            required
            type="password"
          />
          <TextInput
            mt="md"
            label="New Password"
            placeholder="Your new Password"
            name="password"
            ref={newPasswordRef}
            data-cy="newPasswordInput"
            required
            type="password"
          />

          <Button
            type="submit"
            mt="xl"
            fullWidth
            data-cy="changePasswordButton"
          >
            Change Password
          </Button>
        </form>
      </Modal>

      <Button onClick={open} data-cy="changePasswordOpenModalButton">
        Change your password
      </Button>

      <Toaster richColors />
    </>
  );
};

export default ChangePasswordModal;