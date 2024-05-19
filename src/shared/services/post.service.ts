import imageCompression from "browser-image-compression";
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { bucket, firestore } from "../firebase/firebaseInit";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Post } from "../interfaces/post.interface";

export class PostService {
  async imageCompressionHandler(imageFile: File) {
    // options to compress the image
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(imageFile, options);
      console.log(
        "compressedFile instanceof Blob",
        compressedFile instanceof Blob
      ); // true
      console.log(
        `compressedFile size ${compressedFile.size / 1024 / 1024} MB`
      ); // smaller than maxSizeMB

      return compressedFile;
    } catch (error) {
      console.log(error);
    }
  }

  async imageHandler(files: File[]) {
    console.log("[Trigger imageHandler]");
    const contentPhoto = await this.imageCompressionHandler(files[0]);
    if (!contentPhoto) {
      return;
    }

    const fileName = contentPhoto.name;
    const bucketRef = ref(bucket, `documents/blogPostPhotos/${fileName}`);
    await uploadBytes(bucketRef, contentPhoto).then(async (snapshot) => {
      await getDownloadURL(snapshot.ref).then((url) => {
        console.log("The URL back from firebase:" + url);
      });
      console.log("Uploaded a blob or file!");
    });
  }

  async uploadBlogPost(blogPost: Post) {
    const newDocRef = doc(collection(firestore, `blogPosts`)); // Auto-generates an ID
    const post = {
      blogId: newDocRef.id,
      blogHTML: blogPost.blogHTML,
      blogCoverPhoto: blogPost.blogCoverPhoto,
      blogCoverPhotoName: blogPost.blogCoverPhotoName,
      blogTitle: blogPost.blogTitle,
      profileId: blogPost.profileId,
      blogDate: blogPost.blogDate,
    };
    await setDoc(doc(firestore, "blogPosts", post.blogId), post);
    return post;
  }

  async uploadBlogPostPhoto(photoName: string, photo: File) {
    const bucketRef = ref(bucket, `documents/BlogCoverPhotos/${photoName}`);
    await uploadBytes(bucketRef, photo).then((snapshot) => {
      console.log("Uploaded a blob or file!", snapshot);
      if (snapshot) {
        console.log("The file has been uploaded successfully");
      }
    });

    const url = await getDownloadURL(
      ref(bucket, `documents/BlogCoverPhotos/${photoName}`)
    );
    return url;
  }

  async getPostById(blogId: string | string[]) {
    // console.log(route.params.blogId);
    const postDocRef = doc(firestore, "blogPosts", `${blogId}`);
    const postDocSnap = await getDoc(postDocRef);
    if (!postDocSnap.exists()) {
      console.log("No such document!");
    } else {
      return postDocSnap.data();
    }
  }
}
