import {
  ApiRequest,
  ApiResponse,
  ExtractedTextResponse,
  UploadFileRequest,
} from "@/types";
import ApiService from "./api_service";
import { getFileTypeFromFile } from "@/lib/utils";

export class RiskAnalyzeService {
  private static readonly ANALYZE_ENDPOINT = "/analyze";
  private static readonly UPLOAD_ENDPOINT = "/file-processor/process-upload";

  static async analyzeDocument(data: any): Promise<any> {
    try {
      const response = await ApiService.fetchData<ApiResponse, ApiRequest>({
        method: "POST",
        url: this.ANALYZE_ENDPOINT,
        data,
      });

      return response.data;
    } catch (error) {
      console.error("Error analyzing document:", error);
      throw error;
    }
  }

  static async analyzeDocumentWithFile(
    documentData: Omit<ApiRequest, "file_data" | "file_type" | "filename">,
    file: File
  ): Promise<ApiResponse> {
    try {
      // Convert file to base64
      const fileData = await this.fileToBase64(file);

      const requestData: ApiRequest = {
        ...documentData,
        file_data: fileData,
        file_type: getFileTypeFromFile(file),
        filename: file.name,
      };

      return await this.analyzeDocument(requestData);
    } catch (error) {
      console.error("Error analyzing document with file:", error);
      throw error;
    }
  }

  private static fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === "string") {
          const base64 = reader.result.split(",")[1];
          resolve(base64);
        } else {
          reject(new Error("Failed to convert file to base64"));
        }
      };
      reader.onerror = (error) => reject(error);
    });
  }

  static async ExtractTextFile(data: any): Promise<any> {
    try {
      const response = await ApiService.fetchData<
        ExtractedTextResponse,
        UploadFileRequest
      >({
        method: "POST",
        url: this.UPLOAD_ENDPOINT,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data,
      });

      return response.data;
    } catch (error) {
      console.error("Error Extract document:", error);
      throw error;
    }
  }
}
