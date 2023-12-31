'use client';

import {
  Card,
  Text,
  Button,
  Group,
  Flex,
  Menu,
  rem,
  ActionIcon,
  Modal,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconDots, IconTrash, IconShare } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Toaster, toast } from 'sonner';
import { useState, useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { supabase } from '@/lib/supabaseClient';
import { POSTS_TABLE } from '@/keys/keys';
import {useLogger} from 'next-axiom';

type Post = {
  id?: number;
  author?: string;
  title?: string;
  content?: string;
  likes?: number;
  comments?: Array<Comment>;
  data: any;
};

const Post = ({ data }: Post) => {
  const { id, author, title, content, likes, comments } = data;
  const [likesCount, setLikesCount] = useState(likes);
  const [username, setUsername] = useState('');
  const [auth, setAuth] = useState(false);
  const [toastAlert, setToastAlert] = useState(false); // To prevent multiple alerts

  const [opened, { open, close }] = useDisclosure(false);
  const router = useRouter();

  const log = useLogger();

  const sendLikesCountToDB = useDebouncedCallback(async (count) => {
    const { error } = await supabase
      .from(POSTS_TABLE)
      .update({ likes: count })
      .eq('id', id)
      .select();

    if (error) {
      console.error(error);
      log.error(`Error updating likes count: ${error}`)
    }
  }, 300);

  const like = (event: any) => {
    event.preventDefault();

    if (auth && username) {
      setLikesCount(likesCount + 1);
      sendLikesCountToDB(likesCount + 1);
      return;
    }

    setToastAlert(true);
    toast.error('You need to be logged in to like posts');
    log.error('You need to be logged in to like posts');
  };

  const comment = () => {
    router.push(`/post?id=${id}`);
  };

  const deletePost = async (event: any) => {
    event.preventDefault();
    const confirmation = window.confirm(
      'Are you sure you want to delete this post?'
    );

    if (!confirmation) {
      return;
    }

    const { error } = await supabase.from(POSTS_TABLE).delete().eq('id', id);

    if (error) {
      console.error(error);
      log.error(`Error deleting post: ${error}`);
    }

    window.location.href = '/';
  };

  const copyPostLink = () => {
    navigator.clipboard.writeText(`https://buk-net.vercel.app/post?id=${id}`);
    close(); // close the modal
  };

  useEffect(() => {
    const username: any = localStorage?.getItem('username');
    const auth: any = localStorage?.getItem('auth');
    setUsername(username);
    setAuth(auth);
  }, [username]);

  return (
    <>
      <Link href={`/post?id=${id}`}>
        <Card shadow="sm" padding="lg" radius="md" mb={15} withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="space-between">
              <Text fw={500}>Posted by {author}</Text>
              <Menu withinPortal position="bottom-end" shadow="sm">
                <Menu.Target>
                  <ActionIcon
                    variant="subtle"
                    color="gray"
                    onClick={(event) => event.preventDefault()}
                  >
                    <IconDots style={{ width: rem(16), height: rem(16) }} />
                  </ActionIcon>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Item
                    leftSection={
                      <IconShare style={{ width: rem(14), height: rem(14) }} />
                    }
                    onClick={(event) => {
                      event.preventDefault();
                      open();
                    }}
                  >
                    Share
                  </Menu.Item>
                  {author === username && auth ? (
                    <Menu.Item
                      onClick={deletePost}
                      leftSection={
                        <IconTrash
                          style={{ width: rem(14), height: rem(14) }}
                        />
                      }
                      color="red"
                    >
                      Delete
                    </Menu.Item>
                  ) : null}
                </Menu.Dropdown>
              </Menu>
            </Group>
          </Card.Section>
          <Group justify="space-between" mt="md" mb="xs">
            <Text fw={500}>{title}</Text>
          </Group>

          <Text size="sm" c="dimmed">
            {content}
          </Text>

          <Flex gap={5}>
            <Button
              onClick={like}
              variant="light"
              color="blue"
              mt="md"
              radius="md"
            >
              {likesCount} Likes
            </Button>
            <Button
              onClick={comment}
              variant="light"
              color="orange"
              mt="md"
              radius="md"
            >
              {comments.length} Comments
            </Button>
          </Flex>
        </Card>
      </Link>
      <Modal opened={opened} onClose={close} title="Share Post" centered>
        <Flex direction="column" gap={5}>
          <Text>The following url is:</Text>
          <a href={`https://buk-net.vercel.app/post?id=${id}`}>
            https://buk-net.vercel.app/post?id={id}
          </a>
          <Button onClick={copyPostLink}>Copy URL and close</Button>
        </Flex>
      </Modal>
      {toastAlert ? <Toaster richColors /> : null}
    </>
  );
};

export default Post;
