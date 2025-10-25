import StorageQuotaWidget from '../StorageQuotaWidget';

export default function StorageQuotaWidgetExample() {
  const GB = 1024 * 1024 * 1024;
  
  return (
    <div className="p-6 space-y-4 max-w-xs">
      <StorageQuotaWidget used={5.2 * GB} total={15 * GB} />
      <StorageQuotaWidget used={92 * GB} total={100 * GB} />
    </div>
  );
}
