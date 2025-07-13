import { Card, Box, Checkbox, Text, Image, Badge, Container } from '@mantine/core';
import { 
  IconFolder, 
  IconFileText, 
  IconFile, 
  IconPhoto, 
  IconFileTypePdf, 
  IconFileTypeDoc, 
  IconFileTypeXls, 
  IconFileTypePpt,
  IconFileTypeZip,
  IconFileTypeTxt,
  IconFileTypeCsv,
  IconFileTypeJs,
  IconFileTypeXml,
  IconFileTypeHtml,
  IconFileTypeCss,
  IconFileTypeTs,
  IconCode,
  IconBrandPython,
  IconBrandPhp,
  IconDatabase
} from '@tabler/icons-react';
import { useRef } from 'react';
// @ts-ignore
import styles from './file-contents.module.css';

export interface FileItem {
  id: number;
  type: 'file' | 'folder';
  name: string;
  url?: string;
  size?: string;
  date?: string;
  fileType?: string; // e.g., 'pdf', 'image', 'document', etc.
}

export interface FileContentsProps {
  files: FileItem[];
  selected: number[];
  onSelect: (id: number) => void;
  onOpen: (file: FileItem) => void;
  view: 'grid' | 'list';
}

export default function FileContents({ files, selected, onSelect, onOpen, view }: FileContentsProps) {
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleClick = (item: any) => {
    if (item.type === 'folder') {
      // For folders, navigate immediately on click
      onOpen(item);
    } else {
      // For files, use the existing single/double click logic
      if (clickTimeoutRef.current) {
        // Double click detected
        clearTimeout(clickTimeoutRef.current);
        clickTimeoutRef.current = null;
        onSelect(item.id);
      } else {
        // Single click - wait to see if it becomes a double click
        clickTimeoutRef.current = setTimeout(() => {
          onOpen(item);
          clickTimeoutRef.current = null;
        }, 300); // 300ms delay to distinguish between single and double click
      }
    }
  };

  const getFileIcon = (item: FileItem) => {
    if (item.type === 'folder') {
      return <IconFolder size={48} color="#a370f7" />;
    }

    const extension = item.name.split('.').pop()?.toLowerCase();
    
    // Image files
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(extension || '')) {
      return <IconPhoto size={48} color="#228be6" />;
    }
    
    // Document files
    if (['pdf'].includes(extension || '')) {
      return <IconFileTypePdf size={48} color="#fa5252" />;
    }
    if (['doc', 'docx'].includes(extension || '')) {
      return <IconFileTypeDoc size={48} color="#228be6" />;
    }
    if (['xls', 'xlsx'].includes(extension || '')) {
      return <IconFileTypeXls size={48} color="#40c057" />;
    }
    if (['ppt', 'pptx'].includes(extension || '')) {
      return <IconFileTypePpt size={48} color="#fd7e14" />;
    }
    
    // Archive files
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension || '')) {
      return <IconFileTypeZip size={48} color="#ffd43b" />;
    }
    
    // Text files
    if (['txt'].includes(extension || '')) {
      return <IconFileTypeTxt size={48} color="#868e96" />;
    }
    if (['csv'].includes(extension || '')) {
      return <IconFileTypeCsv size={48} color="#40c057" />;
    }
    
    // Code files
    if (['json'].includes(extension || '')) {
      return <IconFileTypeJs size={48} color="#ffd43b" />;
    }
    if (['xml'].includes(extension || '')) {
      return <IconFileTypeXml size={48} color="#fd7e14" />;
    }
    if (['html', 'htm'].includes(extension || '')) {
      return <IconFileTypeHtml size={48} color="#e64980" />;
    }
    if (['css'].includes(extension || '')) {
      return <IconFileTypeCss size={48} color="#228be6" />;
    }
    if (['js'].includes(extension || '')) {
      return <IconFileTypeJs size={48} color="#ffd43b" />;
    }
    if (['ts'].includes(extension || '')) {
      return <IconFileTypeTs size={48} color="#228be6" />;
    }
    if (['py'].includes(extension || '')) {
      return <IconBrandPython size={48} color="#40c057" />;
    }
    if (['java'].includes(extension || '')) {
      return <IconCode size={48} color="#fd7e14" />;
    }
    if (['php'].includes(extension || '')) {
      return <IconBrandPhp size={48} color="#868e96" />;
    }
    if (['sql'].includes(extension || '')) {
      return <IconDatabase size={48} color="#e64980" />;
    }
    
    // Default file icon
    return <IconFile size={48} color="#868e96" />;
  };

  const getFilePreview = (item: FileItem) => {
    if (item.type === 'folder') {
      return getFileIcon(item);
    }

    const extension = item.name.split('.').pop()?.toLowerCase();
    
    // Show image preview for image files
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(extension || '') && item.url) {
      return (
        <Image 
          src={item.url} 
          alt={item.name} 
          height={100} 
          fit="cover" 
          radius="md" 
          style={{ objectFit: 'cover' }} 
        />
      );
    }
    
    // Show icon for other file types
    return getFileIcon(item);
  };

  const getFileBadge = (item: FileItem) => {
    if (item.type === 'folder') return null;
    
    const extension = item.name.split('.').pop()?.toLowerCase();
    if (!extension) return null;
    
    return (
      <Badge 
        variant="outline"
        size="xs"  
        style={{ 
          position: 'absolute', 
          top: 10, 
          right: 10, 
          zIndex: 100,
          textTransform: 'uppercase',
          fontSize: '10px'
        }}
      >
        {extension}
      </Badge>
    );
  };

  return (
    <Container pt="md"> 
      <Box className={styles.root}>
        {files.map((item) => (
          <Card
            key={item.id}
            className={`${styles.card} ${selected.includes(item.id) ? styles.selected : ''}`}
            p="lg"
            withBorder={selected.includes(item.id)}
          >
            <Checkbox
              size="xs"
              checked={selected.includes(item.id)}
              onChange={() => onSelect(item.id)}
              className={styles.checkbox}
              tabIndex={-1}
              onClick={e => e.stopPropagation()}
            />
            {getFileBadge(item)}
            <Box className={styles.cardContent} onClick={() => handleClick(item)}>
              {getFilePreview(item)}
            </Box>
            <Text size="sm" mt={4} className={styles.cardName}>
              {item.name}
            </Text>
            {item.size && (
              <Text size="xs" color="dimmed" ta="center" mt={2}>
                {item.size}
              </Text>
            )}
          </Card>
        ))}
      </Box>
    </Container>
  );
} 