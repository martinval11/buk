import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { Suspense } from 'react';

import HomePageMain from '@/components/HomePageMain/HomePageMain';
import { POSTS_TABLE } from '@/keys/keys';
import { supabase } from '@/lib/supabaseClient';
import Loader from '@/components/SkeletonLoader/Loader';

type PostType = {
  id: number;
  author: string;
  title: string;
  content: string;
  likes: number;
  comments: Array<Comment>;
};

type Comment = {
  author: string;
  body: string;
};

export const dynamic = 'force-dynamic'; // Prevent caching

const getPosts = async () => {
  const { data: posts, error }: PostgrestSingleResponse<PostType[]> =
    await supabase.from(POSTS_TABLE).select('*').order('created_at');

  if (error) {
    console.log(error);
  }

  return posts;
};

const Home = async () => {
  const posts: PostType[] | null = await getPosts();

  return (
    <Suspense fallback={<Loader />}>
      <HomePageMain posts={posts} />
    </Suspense>
  ) 
};

export default Home;
