import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface FileManagerState {
  files: string[];
  folders: string[];
  loading: boolean;
  error: string | null;
  currentPath: string;
}

const initialState: FileManagerState = {
  files: [],
  folders: [],
  loading: false,
  error: null,
  currentPath: '',
};

export const listFiles = createAsyncThunk(
  'filemanager/listFiles',
  async (path: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/platform/files?path=${encodeURIComponent(path)}`, {
        credentials: 'include',
      });
      const data = await response.json();
      if (!response.ok || data.error) {
        return rejectWithValue(data.error || 'Failed to load directory');
      }
      return { files: data.files || [], folders: data.folders || [], path };
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const uploadFiles = createAsyncThunk(
  'filemanager/uploadFiles',
  async ({ files, path }: { files: FileList | File[]; path: string }, { dispatch, rejectWithValue }) => {
    try {
      const form = new FormData();
      for (const file of Array.from(files)) form.append('files', file);
      const response = await fetch(`/api/platform/files/upload?path=${encodeURIComponent(path)}`, {
        method: 'POST',
        body: form,
        credentials: 'include',
      });
      const data = await response.json();
      if (!response.ok || data.error) {
        return rejectWithValue(data.error || 'Failed to upload files');
      }
      // Refresh file list after upload
      await dispatch(listFiles(path));
      return data;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const createFolder = createAsyncThunk(
  'filemanager/createFolder',
  async ({ name, path }: { name: string; path: string }, { dispatch, rejectWithValue }) => {
    try {
      const response = await fetch('/api/platform/files/folder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ path, name }),
      });
      const data = await response.json();
      if (!response.ok || data.error) {
        return rejectWithValue(data.error || 'Failed to create folder');
      }
      // Refresh file list after folder creation
      await dispatch(listFiles(path));
      return data;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

const fileManagerSlice = createSlice({
  name: 'filemanager',
  initialState,
  reducers: {
    setCurrentPath(state, action: PayloadAction<string>) {
      state.currentPath = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(listFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.files = action.payload.files;
        state.folders = action.payload.folders;
        state.currentPath = action.payload.path;
        state.error = null;
      })
      .addCase(listFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(uploadFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadFiles.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(uploadFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createFolder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFolder.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createFolder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCurrentPath, clearError } = fileManagerSlice.actions;
export default fileManagerSlice.reducer; 