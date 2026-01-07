import { storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

/**
 * 파일을 Firebase Storage에 업로드하고 다운로드 URL을 반환합니다.
 * @param file 업로드할 파일 객체
 * @param folder 저장할 폴더 경로 (기본값: 'uploads')
 * @returns 이미지의 다운로드 URL
 */
export async function uploadImage(file: File, folder: string = "uploads"): Promise<string> {
  if (!file) {
    throw new Error("파일이 선택되지 않았습니다.");
  }

  // 파일명 중복 방지를 위해 타임스탬프 추가
  const filename = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
  const storageRef = ref(storage, `${folder}/${filename}`);

  try {
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("이미지 업로드 실패:", error);
    throw new Error("이미지 업로드 중 오류가 발생했습니다.");
  }
}
