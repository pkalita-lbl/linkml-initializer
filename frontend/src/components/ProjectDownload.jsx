import { Alert, Center, Title } from "@mantine/core";
import React from "react";

function ProjectDownload({ filename, error }) {

  if (error) {
    return <Alert color="red">{error}</Alert>
  }

  if (!filename) {
    return <Center>Loading...</Center>
  }

  return (
    <>
      <Title order={2}>Your LinkML project is ready</Title>
      <p>Using the downloaded file, complete your project setup with these steps:</p>
          <pre>{
`unzip ${filename}
cd ${filename.replace('.zip', '')}
make setup`
          }</pre>
    </>
  )
}

export default ProjectDownload
