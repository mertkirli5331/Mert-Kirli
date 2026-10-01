import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  User,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { DriveFile, WeekDriveFolder } from '../types';

// Initialize Firebase only once
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/drive.file');

// In-memory token cache (never stored in localStorage)
let cachedAccessToken: string | null = null;
let isSigningIn = false;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        // If logged in via Firebase session but token was lost on page reload,
        // user can click connect again to get fresh access token with popup.
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const signInWithGoogle = async (): Promise<{
  user: User;
  accessToken: string;
} | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Google Drive erişim belirteci alınamadı.');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: unknown) {
    console.error('Google Sign In Error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const signOutGoogle = async (): Promise<void> => {
  await signOut(auth);
  cachedAccessToken = null;
};

export const getAccessToken = (): string | null => {
  return cachedAccessToken;
};

// --- Google Drive REST API Methods ---

const DRIVE_API_URL = 'https://www.googleapis.com/drive/v3/files';
const DRIVE_UPLOAD_URL = 'https://www.googleapis.com/upload/drive/v3/files';

/**
 * Ensures the main root folder "Mert Kirli - Okul Portalı" exists in user's Drive.
 */
export async function getOrCreateRootFolder(token: string): Promise<string> {
  const query = encodeURIComponent(
    "name = 'Mert Kirli - Okul Portalı' and mimeType = 'application/vnd.google-apps.folder' and trashed = false"
  );
  const searchRes = await fetch(`${DRIVE_API_URL}?q=${query}&fields=files(id,name)`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!searchRes.ok) {
    throw new Error('Google Drive klasörleri okunamadı.');
  }

  const data = await searchRes.json();
  if (data.files && data.files.length > 0) {
    return data.files[0].id;
  }

  // Create root folder
  const createRes = await fetch(DRIVE_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'Mert Kirli - Okul Portalı',
      mimeType: 'application/vnd.google-apps.folder',
      description: 'Mert Kirli 30 Haftalık Okul Menüsü ve Ödev Portalı Dosyaları',
    }),
  });

  if (!createRes.ok) {
    throw new Error('Mert Kirli ana klasörü oluşturulamadı.');
  }

  const created = await createRes.json();
  return created.id;
}

/**
 * Ensures week-specific folder "Hafta XX" exists inside the root folder.
 */
export async function getOrCreateWeekFolder(
  token: string,
  weekNumber: number,
  theme?: string
): Promise<WeekDriveFolder> {
  const rootId = await getOrCreateRootFolder(token);
  const folderName = `Hafta ${weekNumber.toString().padStart(2, '0')}`;

  const query = encodeURIComponent(
    `name = '${folderName}' and '${rootId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`
  );
  const searchRes = await fetch(
    `${DRIVE_API_URL}?q=${query}&fields=files(id,name,webViewLink)`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!searchRes.ok) {
    throw new Error('Haftalık klasör kontrol edilemedi.');
  }

  const data = await searchRes.json();
  if (data.files && data.files.length > 0) {
    const file = data.files[0];
    return {
      id: file.id,
      name: file.name,
      webViewLink: file.webViewLink || `https://drive.google.com/drive/folders/${file.id}`,
    };
  }

  // Create folder for this specific week
  const desc = theme ? `${weekNumber}. Hafta Dosyaları (${theme})` : `${weekNumber}. Hafta Dosyaları`;
  const createRes = await fetch(
    `${DRIVE_API_URL}?fields=id,name,webViewLink`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [rootId],
        description: desc,
      }),
    }
  );

  if (!createRes.ok) {
    throw new Error(`${weekNumber}. Hafta klasörü oluşturulamadı.`);
  }

  const created = await createRes.json();
  return {
    id: created.id,
    name: created.name,
    webViewLink: created.webViewLink || `https://drive.google.com/drive/folders/${created.id}`,
  };
}

/**
 * List files inside the week folder.
 */
export async function listFilesForWeek(
  token: string,
  folderId: string
): Promise<DriveFile[]> {
  const query = encodeURIComponent(`'${folderId}' in parents and trashed = false`);
  const res = await fetch(
    `${DRIVE_API_URL}?q=${query}&fields=files(id,name,mimeType,webViewLink,webContentLink,iconLink,size,createdTime,modifiedTime)&orderBy=modifiedTime desc`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!res.ok) {
    throw new Error('Haftalık dosyalar listelenemedi.');
  }

  const data = await res.json();
  return data.files || [];
}

/**
 * Upload a file directly into the week folder.
 */
export async function uploadFileToWeekFolder(
  token: string,
  folderId: string,
  file: File
): Promise<DriveFile> {
  const metadata = {
    name: file.name,
    parents: [folderId],
  };

  const form = new FormData();
  form.append(
    'metadata',
    new Blob([JSON.stringify(metadata)], { type: 'application/json' })
  );
  form.append('file', file);

  const res = await fetch(
    `${DRIVE_UPLOAD_URL}?uploadType=multipart&fields=id,name,mimeType,webViewLink,webContentLink,iconLink,size,createdTime,modifiedTime`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: form,
    }
  );

  if (!res.ok) {
    throw new Error('Dosya Google Drive\'a yüklenemedi.');
  }

  return await res.json();
}

/**
 * Create a text note / summary inside the week folder.
 */
export async function createTextFileInWeekFolder(
  token: string,
  folderId: string,
  fileName: string,
  content: string
): Promise<DriveFile> {
  const metadata = {
    name: fileName.endsWith('.txt') ? fileName : `${fileName}.txt`,
    parents: [folderId],
    mimeType: 'text/plain',
  };

  const boundary = '-------mk_boundary_' + Date.now();
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: text/plain; charset=UTF-8\r\n\r\n' +
    content +
    closeDelimiter;

  const res = await fetch(
    `${DRIVE_UPLOAD_URL}?uploadType=multipart&fields=id,name,mimeType,webViewLink,webContentLink,iconLink,size,createdTime,modifiedTime`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body: multipartRequestBody,
    }
  );

  if (!res.ok) {
    throw new Error('Not Google Drive\'a kaydedilemedi.');
  }

  return await res.json();
}

/**
 * Delete a file from Google Drive.
 */
export async function deleteFileFromDrive(
  token: string,
  fileId: string
): Promise<void> {
  const res = await fetch(`${DRIVE_API_URL}/${fileId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error('Dosya Google Drive\'dan silinemedi.');
  }
}
