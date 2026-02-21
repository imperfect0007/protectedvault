export interface VaultFile {
  file_id: string;
  type: 'note' | 'pdf';
  title: string;
  content?: string;
  original_size?: number;
  compressed_size?: number;
  created_at: string;
  updated_at: string;
}
