import type { Post } from 'src/types/content';

import { auth, db } from 'src/libs/firebase';
import { doc, getDoc, updateDoc, collection, where, getDocs, query, orderBy } from 'firebase/firestore';


type GetPostsRequest = object;

type GetPostsResponse = Promise<Post[]>;

type GetPostRequest = object;

type GetPostResponse = Promise<Post>;

class ContentApi {


  async updatePost(uid: string, postId: string, updatedContent: string): Promise<void> {
    const postRef = doc(db, 'users', uid, 'content', postId);
    await updateDoc(postRef, { htmlContent: updatedContent });
  }

  async getPosts(uid: string): Promise<Post[]> {
    const postsCollectionRef = collection(db, 'users', uid, 'content');
    // If you want to order the posts by a specific field, for example, createdAt:
    const q = query(postsCollectionRef, orderBy("createdAt", "desc")); // Adjust the field and order as needed
    const querySnapshot = await getDocs(q);
    const posts = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Post[];
    return posts;
  }

  async getPost(uid: string, title: string): Promise<Post | undefined> {
    const postsCollectionRef = collection(db, 'users', uid, 'content');
    const q = query(postsCollectionRef, where("title", "==", title)); // Adjust the field name if it's different in your Firestore
    const querySnapshot = await getDocs(q);
    const postDocs = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Post[];
    return postDocs.length > 0 ? postDocs[0] : undefined;
  }
}

export const contentApi = new ContentApi();
