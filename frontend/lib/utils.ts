import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getFileIcon = (type) => {
  if (type === "application/pdf") return "📄";
  if (type.includes("word") || type.includes("document")) return "📝";
  if (type === "text/plain") return "📃";
  return "📄";
};

export const getFileTypeFromMimeType = (mimeType: string): string | null => {
  const mimeToFileType: { [key: string]: string } = {
    'application/pdf': 'pdf',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'text/plain': 'txt',
  };
  
  return mimeToFileType[mimeType] || null;
};

export const getFileTypeFromFile = (file: File): string | undefined => {
  const fromMimeType = getFileTypeFromMimeType(file.type);
  if (fromMimeType) return fromMimeType;
  
  const extension = file.name.split('.').pop()?.toLowerCase();
  const validExtensions = ['pdf', 'doc', 'docx', 'txt'];
  
  return extension && validExtensions.includes(extension) ? extension : undefined;
};