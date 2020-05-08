import { uploadFile } from '@/service/file';

export default class UploadAdapter {
  loader: any;

  cancel?: () => void;

  constructor(loader: any) {
    this.loader = loader;
  }

  upload() {
    const onUploadProgress = (_: any, progressEvent: any) => {
      this.loader.uploadTotal = progressEvent.total;
      this.loader.uploaded = progressEvent.loaded;
    };
    return this.loader.file.then((file: File) => {
      const p = uploadFile(file, onUploadProgress);
      this.cancel = p.cancel;
      return p.then(resp => {
        return {
          default: resp.url,
        };
      });
    });
  }

  abort() {
    if (this.cancel) this.cancel();
  }
}
