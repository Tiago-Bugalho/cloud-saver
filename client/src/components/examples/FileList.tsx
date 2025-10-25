import FileList from '../FileList';

export default function FileListExample() {
  const mockFiles = [
    {
      id: '1',
      name: 'Apresentação_Projeto.pptx',
      size: 2457600,
      mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      uploadedAt: new Date(Date.now() - 1000 * 60 * 30),
    },
    {
      id: '2',
      name: 'foto_familia.jpg',
      size: 4234567,
      mimeType: 'image/jpeg',
      uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    },
    {
      id: '3',
      name: 'relatorio_vendas.pdf',
      size: 987654,
      mimeType: 'application/pdf',
      uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    },
    {
      id: '4',
      name: 'video_tutorial.mp4',
      size: 15678900,
      mimeType: 'video/mp4',
      uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    },
  ];

  return (
    <div className="p-6">
      <FileList 
        files={mockFiles}
        onDownload={(file) => console.log('Download:', file.name)}
        onDelete={(file) => console.log('Delete:', file.name)}
      />
    </div>
  );
}
