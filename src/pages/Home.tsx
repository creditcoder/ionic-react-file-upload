import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonProgressBar
} from "@ionic/react";
import React from "react";
// import PdfPreview from "react-pdf-preview";

import useFirebaseUpload from "../hooks/useFirebaseUpload";

const Home: React.FC = () => {
  // setting up the hook to upload file and track its progress
  const [
    { data, isLoading, isError, progress },
    setDirName,
    setFileData
  ] = useFirebaseUpload();

  const onChangeHandler = (e: any) => {
    let fileName = e.target.files[0].name;
    let ext = fileName.substr(fileName.lastIndexOf(".") + 1);
    if (ext.length > 0) setDirName(ext);
    setFileData(e.target.files[0]);
  };

  const getFileType = (metaData: any) => {
    let fileType = "";
    if (!metaData) return fileType;

    if (metaData.contentType.indexOf("image") !== -1) fileType = "image";
    else if (metaData.contentType.indexOf("application/pdf") !== -1)
      fileType = "pdf";
    return fileType;
  };

  const FilePreview = (data: any) => {
    if (!data || !data.metaData) return null;

    if (getFileType(data.metaData) === "image")
      return <img src={data.downloadUrl} alt={data.metaData.name} />;
    // else if (getFileType(data.metaData) === "pdf")
    //   return <PdfPreview src={data.downloadUrl} />;
    else
      return (
        <a href={data.downloadUrl} target="_blank">
          {data.metaData.name}
        </a>
      );
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Ionic Firebase Upload Hook</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {/* get error from hook and display if necessary */}
        {isError && <div>ERROR: {isError.message}</div>}

        {/* get loading information from hook and display progress if necessary */}
        {isLoading && progress && (
          <IonProgressBar value={progress.value}></IonProgressBar>
        )}

        <input type="file" onChange={onChangeHandler} />

        <pre style={{ fontSize: "smaller" }}>
          {JSON.stringify(data, null, 2)}
        </pre>

        {/* {data && <FilePreview data={data} />} */}

        {data &&
          (getFileType(data.metaData) === "image" ? (
            <img src={data.downloadUrl} alt={data.metaData.name} />
          ) : (
            <a href={data.downloadUrl} target="_blank">
              {data.metaData.name}
            </a>
          ))}
      </IonContent>
    </IonPage>
  );
};

export default Home;
