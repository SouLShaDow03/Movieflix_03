import React, { useState } from "react";
import { storage } from "../firebase-config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import { db } from "../firebase-config"; // Import Firestore
import { collection, addDoc } from "firebase/firestore"; // Import addDoc
import Header from "./Header";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";

// Register FilePond plugins
registerPlugin(FilePondPluginFileValidateType, FilePondPluginFileValidateSize);

function MovieUpload() {
  const [movieDownloadURL, setMovieDownloadURL] = useState("");
  const [thumbnailDownloadURL, setThumbnailDownloadURL] = useState("");
  const [movieName, setMovieName] = useState("");
  const [movieOverview, setmovieOverview] = useState("");
  const [genres, setGenres] = useState("");

  // FilePond server configuration for handling uploads via Firebase
  const filePondServerConfig = {
    process: (fieldName, file, metadata, load, error, progress, abort) => {
      const storageRef = ref(storage, `movies/${movieName}.mp4`); // Use movieName for storage
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          progress(true, snapshot.bytesTransferred, snapshot.totalBytes);
        },
        (uploadError) => {
          console.error("Upload failed:", uploadError);
          error(uploadError.message);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            setMovieDownloadURL(url);
            load(url);
          });
        },
      );

      return {
        abort: () => {
          uploadTask.cancel();
          abort();
        },
      };
    },
  };

  const thumbnailServerConfig = {
    process: (fieldName, file, metadata, load, error, progress, abort) => {
      const storageRef = ref(storage, `thumbnails/${movieName}.png`); // Use movieName for storage
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          progress(true, snapshot.bytesTransferred, snapshot.totalBytes);
        },
        (uploadError) => {
          console.error("Thumbnail upload failed:", uploadError);
          error(uploadError.message);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            setThumbnailDownloadURL(url);
            load(url);
          });
        },
      );

      return {
        abort: () => {
          uploadTask.cancel();
          abort();
        },
      };
    },
  };

  const handleUpload = async () => {
    if (!movieDownloadURL || !thumbnailDownloadURL || !movieName || !genres) {
      alert(
        "Please fill in all fields and upload both the movie and thumbnail.",
      );
      return;
    }

    try {
      // Reference to the collection
      const uploadsRef = collection(db, "UPLOADS");
      const uniqueId = uuidv4();

      // Add a new document with an auto-generated ID
      await addDoc(uploadsRef, {
        id: uniqueId,
        name: movieName,
        overview: movieOverview,
        genres: genres.split(",").map((genre) => genre.trim()), // Convert comma-separated genres to array
        movieUrl: movieDownloadURL,
        thumbnailUrl: thumbnailDownloadURL,
      });

      toast.success("Movie uploaded successfully", {
        duration: 4000,
      });

      // Reset fields
      setMovieName(""); // Reset movieName field
      setmovieOverview(""); // Reset movieOverview field
      setGenres(""); // Reset genres field
      setMovieDownloadURL(""); // Reset movieDownloadURL field
      setThumbnailDownloadURL(""); // Reset thumbnailDownloadURL field
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <div className="upload-form noScrollBar absolute top-0 z-0 min-h-screen w-screen overflow-x-hidden overflow-y-scroll bg-black bg-opacity-90">
      <Header />
      <div className="relative top-52 flex max-h-[50vh] w-screen items-start justify-center font-medium text-white">
        <div className="flex h-[40vh] w-[50vh] flex-col justify-center gap-5">
          <h2>Upload Your Movie</h2>

          {/* Movie Name Input */}
          <input
            type="text"
            placeholder="Movie Name"
            value={movieName}
            onChange={(e) => setMovieName(e.target.value)}
            className="rounded bg-gray-900 p-2 ring-red-800 focus:ring-2"
          />

          {/* Movie Overview Input */}
          <input
            type="text"
            placeholder="Movie Overview"
            value={movieOverview}
            onChange={(e) => setmovieOverview(e.target.value)}
            className="rounded bg-gray-900 p-2 ring-red-800 focus:ring-2"
          />

          {/* Genres Input */}
          <input
            type="text"
            placeholder="Genres (comma separated)"
            value={genres}
            onChange={(e) => setGenres(e.target.value)}
            className="rounded bg-gray-900 p-2 ring-red-800 focus:ring-2"
          />

          {/* FilePond for movie upload */}
          <FilePond
            acceptedFileTypes={["video/*"]}
            maxFileSize="100MB"
            server={filePondServerConfig}
            allowMultiple={false}
            labelIdle='Drag & Drop your movie or <span class="filepond--label-action">Browse</span>'
          />

          {movieDownloadURL && (
            <p>
              Movie Uploaded!{" "}
              <a href={movieDownloadURL} className="text-blue-300 underline">
                View Movie
              </a>
            </p>
          )}

          {/* FilePond for thumbnail upload */}
          <h2>Upload Your Thumbnail</h2>
          <FilePond
            acceptedFileTypes={["image/*"]}
            maxFileSize="5MB"
            server={thumbnailServerConfig}
            allowMultiple={false}
            className={"rounded bg-gray-900 p-2"}
            labelIdle='Drag & Drop your thumbnail or <span class="filepond--label-action">Browse</span>'
          />

          {thumbnailDownloadURL && (
            <p>
              Thumbnail Uploaded!{" "}
              <a
                href={thumbnailDownloadURL}
                className="text-blue-300 underline"
              >
                View Thumbnail
              </a>
            </p>
          )}

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            className="mt-4 rounded bg-red-500 p-2 text-white hover:bg-red-700"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default MovieUpload;
