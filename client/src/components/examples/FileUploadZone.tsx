import FileUploadZone from '../FileUploadZone';

export default function FileUploadZoneExample() {
  return (
    <div className="p-6">
      <FileUploadZone onFilesSelected={(files) => {
        console.log('Files selected:', files);
      }} />
    </div>
  );
}
