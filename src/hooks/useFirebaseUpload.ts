import { useState, useEffect } from "react";
import firebase from "firebase";

var firebaseConfig = {
  apiKey: "AIzaSyCmmiyeaqjo86zIwvy0TdFFaNwlmEYkn3o",
  authDomain: "busshuttle-48ae5.firebaseapp.com",
  databaseURL: "https://busshuttle-48ae5.firebaseio.com",
  projectId: "busshuttle-48ae5",
  storageBucket: "busshuttle-48ae5.appspot.com",
  messagingSenderId: "714080369658",
  appId: "1:714080369658:web:afe9fbc951b615044a4243",
  measurementId: "G-022VWE51NY"
};

firebase.initializeApp(firebaseConfig); // Initialize Firebase

interface UploadDataResponse {
  metaData: firebase.storage.FullMetadata;
  downloadUrl: any;
}
interface ProgressResponse {
  value: number;
}

const storageRef = firebase.storage().ref(); // the firebase reference to storage

function FirebaseFileUploadApi(): [
  {
    data: UploadDataResponse | undefined;
    isLoading: boolean;
    isError: any;
    progress: ProgressResponse | null;
  },
  Function,
  Function
] {
  const [data, setData] = useState<UploadDataResponse | undefined>(); // the data from the file upload response

  const [dirName, setDirName] = useState<string>("default"); // sets remote dir name that the file to be uploaded

  const [fileData, setFileData] = useState<File | null>(); // sets properties on the file to be uploaded

  const [isLoading, setIsLoading] = useState<boolean>(false); // if we are loading a file or not

  const [isError, setIsError] = useState<any>(false); // if an error happened during the process

  const [progress, setProgress] = useState<ProgressResponse | null>(null); // used for tracking the % of upload completed

  useEffect(() => {
    // this function will be called when the any properties in the dependency array changes
    const uploadData = async () => {
      // initialize upload information
      setIsError(false);
      setIsLoading(true);

      setProgress({ value: 0 });

      if (!fileData) return;

      // wrap the whole thing in a try catch block to update the error state
      try {
        let fName = `${new Date().getTime()}-${fileData.name}`;

        // setting the firebase properties for the file upload
        let ref = storageRef.child(dirName + "/" + fName);
        let uploadTask = ref.put(fileData);

        // tracking the state of the upload to assist in updating the application UI
        uploadTask.on(
          firebase.storage.TaskEvent.STATE_CHANGED,
          _progress => {
            var value = _progress.bytesTransferred / _progress.totalBytes;
            console.log("Upload is " + value * 100 + "% done");
            setProgress({ value });
          },
          _error => {
            setIsLoading(false);
            setIsError(_error);
          },
          async () => {
            setIsError(false);
            setIsLoading(false);

            let downloadUrl = await uploadTask.snapshot.ref.getDownloadURL(); // need to get the url to download the file

            // set the data when upload has completed
            setData({
              metaData: uploadTask.snapshot.metadata,
              downloadUrl
            });

            setProgress(null); // reset progress
          }
        );
      } catch (_error) {
        setIsLoading(false);
        setIsError(_error);
      }
    };

    fileData && uploadData();
  }, [fileData]);

  return [{ data, isLoading, isError, progress }, setDirName, setFileData];
}

export default FirebaseFileUploadApi;
