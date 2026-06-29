import { supabase } from './supabase';

export async function uploadToS3(
  file: File,
  folder: 'courses' | 'products' | 'news' | 'avatars'
): Promise<string> {
  const { data: { session } } = await supabase.auth.getSession();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/generate-upload-url`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type,
        folder,
      }),
    }
  );

  const { presignedUrl, publicUrl } = await res.json();

  await fetch(presignedUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  });

  return publicUrl;
}

export function extractS3Key(publicUrl: string, folder: string): string | null {
  const marker = `/${folder}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return null;
  return publicUrl.slice(idx + 1);
}

export async function deleteFromS3(key: string): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession();

  await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/delete-s3-file`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify({ key }),
    }
  );
}