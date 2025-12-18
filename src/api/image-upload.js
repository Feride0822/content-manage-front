import publicApi from "./publicAxios";

export const uploadFiles = async (files) => {
  if (!files || files?.length === 0) return [];

  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  try {
    const data = await publicApi.post(`/uploads`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Images upload", data?.data);
    return data?.data?.files?.map((file) => file.url);
  } catch (error) {
    console.error(`Error while uploading images: ${error}`);
    return [];
  }
};
