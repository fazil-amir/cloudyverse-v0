import { useState, useEffect, useRef } from "react"
import Breadcrumbs from "../../components/breadcrumbs"
import FileToolbar from "../../components/file-toolbar"
import FileSidebar from "../../components/file-sidebar"
import FileDropzone from "../../components/file-dropzone"
import FileContents from "../../components/file-contents"
import EmptyState from "../../components/empty-state"
import { rgba, Modal, Button, TextInput, Loader, Group } from "@mantine/core"

function pathToBreadcrumbs(path: string, onNav: (p: string) => void) {
  const parts = path ? path.split("/") : [];
  const crumbs = [{ title: "Home", href: "", onClick: () => onNav("") }];
  let acc = "";
  for (let i = 0; i < parts.length; ++i) {
    acc = acc ? acc + "/" + parts[i] : parts[i];
    crumbs.push({
      title: parts[i],
      href: acc,
      onClick: () => onNav(acc)
    });
  }
  return crumbs;
}

export default function Home() {
  const [currentPath, setCurrentPath] = useState("");
  const [files, setFiles] = useState<string[]>([]);
  const [folders, setFolders] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [sidebarFile, setSidebarFile] = useState<any>(null);
  const [dragActive, setDragActive] = useState(false);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [creatingFolder, setCreatingFolder] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  // Fetch files/folders for currentPath
  useEffect(() => {
    setLoading(true);
    setError("");
    fetch(`/api/platform/files?path=${encodeURIComponent(currentPath)}`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.error) setError(data.error);
        setFiles(data.files || []);
        setFolders(data.folders || []);
      })
      .catch(() => setError("Failed to load directory"))
      .finally(() => setLoading(false));
  }, [currentPath]);

  // Breadcrumbs
  const breadcrumbs = pathToBreadcrumbs(currentPath, (p) => setCurrentPath(p));

  // Handlers
  const handleOpen = (file: string, isFolder: boolean) => {
    if (isFolder) setCurrentPath(currentPath ? currentPath + "/" + file : file);
    else setSidebarFile({ name: file });
  };
  const handleCloseSidebar = () => setSidebarFile(null);
  const handleUpload = async (filesToUpload: FileList | File[]) => {
    const form = new FormData();
    for (const file of Array.from(filesToUpload)) form.append('files', file);
    await fetch(`/api/platform/files/upload?path=${encodeURIComponent(currentPath)}`, {
      method: 'POST',
      body: form,
      credentials: 'include',
    });
    // Refresh
    setLoading(true);
    fetch(`/api/platform/files?path=${encodeURIComponent(currentPath)}`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setFiles(data.files || []);
        setFolders(data.folders || []);
      })
      .finally(() => setLoading(false));
  };
  const handleNewFolder = () => setShowNewFolder(true);
  const handleCreateFolder = async () => {
    setCreatingFolder(true);
    await fetch('/api/platform/files/folder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ path: currentPath, name: newFolderName })
    });
    setShowNewFolder(false);
    setNewFolderName("");
    setCreatingFolder(false);
    // Refresh
    setLoading(true);
    fetch(`/api/platform/files?path=${encodeURIComponent(currentPath)}`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setFiles(data.files || []);
        setFolders(data.folders || []);
      })
      .finally(() => setLoading(false));
  };
  const handleSearch = (value: string) => setSearch(value);
  const handleViewChange = (v: 'grid' | 'list') => setView(v);
  const handleUncheckAll = () => setSelected([]);

  // Drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files);
    }
  };

  // Filtered files/folders
  const filteredFiles = search
    ? files.filter(f => f.toLowerCase().includes(search.toLowerCase()))
    : files;
  const filteredFolders = search
    ? folders.filter(f => f.toLowerCase().includes(search.toLowerCase()))
    : folders;

  // Map files/folders to FileItem[] with id:number, type, name
  const fileItems = [
    ...filteredFolders.map((f, i) => ({ id: i, type: 'folder' as const, name: f })),
    ...filteredFiles.map((f, i) => ({ id: filteredFolders.length + i, type: 'file' as const, name: f }))
  ];

  return (
    <div
      ref={dropRef}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <FileSidebar file={sidebarFile} open={!!sidebarFile} onClose={handleCloseSidebar} />
      <Breadcrumbs breadcrumbs={breadcrumbs.map(b => ({ title: b.title, href: '#', onClick: b.onClick }))} />
      <FileToolbar
        onUpload={() => {
          // Trigger file input click
          const input = document.createElement('input');
          input.type = 'file';
          input.multiple = true;
          input.onchange = (e) => {
            const target = e.target as HTMLInputElement;
            if (target.files && target.files.length > 0) {
              handleUpload(target.files);
            }
          };
          input.click();
        }}
        onNewFolder={handleNewFolder}
        onSearch={handleSearch}
        searchValue={search}
        view={view}
        onViewChange={handleViewChange}
        selectedCount={selected.length}
        onDelete={() => {}}
        onUncheckAll={handleUncheckAll}
      />
      <FileDropzone open={dragActive} color={rgba('#ad80ff', 0.5)}>
        <div style={{ textAlign: 'center' }}>
          <h2>Drop files to upload</h2>
        </div>
      </FileDropzone>
      <Modal opened={showNewFolder} onClose={() => setShowNewFolder(false)} title="Create New Folder" centered>
        <TextInput
          label="Folder Name"
          value={newFolderName}
          onChange={e => setNewFolderName(e.target.value)}
          placeholder="Enter folder name"
        />
        <Group mt="md">
          <Button onClick={handleCreateFolder} loading={creatingFolder} disabled={!newFolderName.trim()}>
            Create
          </Button>
          <Button variant="light" onClick={() => setShowNewFolder(false)}>
            Cancel
          </Button>
        </Group>
      </Modal>
      {loading ? (
        <Loader mt="xl" />
      ) : fileItems.length === 0 ? (
        <EmptyState
          title={search ? 'No files or folders found' : 'No files or folders in this directory'}
          description={search
            ? 'Try adjusting your search terms'
            : 'Upload some files or create a folder to get started'}
        />
      ) : (
        <FileContents
          files={fileItems}
          selected={selected}
          onSelect={id => setSelected(sel => sel.includes(id) ? sel.filter(i => i !== id) : [...sel, id])}
          onOpen={item => handleOpen(item.name, item.type === 'folder')}
          view={view}
        />
      )}
    </div>
  );
} 