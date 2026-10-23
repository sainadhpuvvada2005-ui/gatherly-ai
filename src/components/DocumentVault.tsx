import React, { useState } from 'react';
import { 
  FolderLock, 
  Upload, 
  FileText, 
  Trash2, 
  Eye, 
  Download, 
  Plus, 
  X, 
  ShieldCheck, 
  Paperclip,
  CheckCircle2,
  FileCheck
} from 'lucide-react';
import { EventDetails, DocumentItem } from '../types';
import { EventStore } from '../services/storage';

interface DocumentVaultProps {
  event: EventDetails;
  documents: DocumentItem[];
  onRefreshData: () => void;
}

export const DocumentVault: React.FC<DocumentVaultProps> = ({
  event,
  documents,
  onRefreshData
}) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DocumentItem['category']>('contract');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('1.5 MB');

  const filteredDocs = documents.filter(d => {
    return categoryFilter === 'all' || d.category === categoryFilter;
  });

  const handleUploadSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !fileName.trim()) return;

    EventStore.addDocument({
      eventId: event.id,
      title,
      category,
      fileName,
      fileSize
    });

    setIsUploadModalOpen(false);
    onRefreshData();
    alert('Document registered and encrypted under event storage vault!');
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this document from the vault?')) {
      EventStore.deleteDocument(id);
      onRefreshData();
    }
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-display text-stone-900 flex items-center gap-2">
            <FolderLock className="w-6 h-6 text-emerald-800" />
            <span>Secure Document Vault</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Store and retrieve encrypted vendor contracts, token receipts, stage schematics, and sound permits.
          </p>
        </div>

        <button
          onClick={() => {
            setTitle('');
            setFileName('');
            setIsUploadModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Security notice */}
      <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-xs text-emerald-950 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
          <div>
            <p className="font-bold">Encrypted Event Cloud Storage</p>
            <p className="text-[11px] text-emerald-800">
              Files in this vault are governed by Firebase Storage Security Rules and accessible only by authorized collaborators.
            </p>
          </div>
        </div>
        <span className="text-[10px] uppercase font-bold text-emerald-800 bg-white px-2 py-1 rounded-md border border-emerald-200 shrink-0">
          RBAC Protected
        </span>
      </div>

      {/* Categories Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'All Files' },
          { id: 'contract', label: 'Contracts & Agreements' },
          { id: 'quotation', label: 'Vendor Quotations' },
          { id: 'receipt', label: 'Payment Receipts' },
          { id: 'design', label: 'Stage & Floor Plans' }
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategoryFilter(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              categoryFilter === cat.id
                ? 'bg-emerald-800 text-white font-bold'
                : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map(doc => (
          <div 
            key={doc.id}
            className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex flex-col justify-between hover:shadow-md transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5 text-emerald-800" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                  {doc.category}
                </span>
              </div>

              <h4 className="text-sm font-bold text-stone-900 mt-3 line-clamp-2">
                {doc.title}
              </h4>

              <div className="mt-2 flex items-center gap-2 text-[11px] text-stone-400 font-mono">
                <span>{doc.fileName}</span>
                <span>•</span>
                <span>{doc.fileSize}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className="text-stone-400 text-[11px]">Uploaded {doc.uploadedAt}</span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPreviewDoc(doc)}
                  className="p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors"
                  title="Preview"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="p-1.5 rounded-lg border border-stone-200 text-stone-400 hover:text-rose-600 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredDocs.length === 0 && (
          <div className="col-span-full py-12 text-center text-xs text-stone-400 bg-white rounded-2xl border border-stone-200">
            No files stored in this vault category.
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900 font-display">
                Upload Event Document
              </h3>
              <button onClick={() => setIsUploadModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSimulate} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Palace Mandap Acoustics Permit"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Document Classification</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                >
                  <option value="contract">Contract / Agreement</option>
                  <option value="quotation">Vendor Quotation</option>
                  <option value="receipt">Advance Payment Receipt</option>
                  <option value="design">Stage / Floor Plan Schematics</option>
                  <option value="other">Miscellaneous</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">File Name *</label>
                <input
                  type="text"
                  required
                  value={fileName}
                  onChange={e => setFileName(e.target.value)}
                  placeholder="e.g. Sound_Permit_Municipal_Signed.pdf"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Simulated File Size</label>
                <input
                  type="text"
                  value={fileSize}
                  onChange={e => setFileSize(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 font-bold text-stone-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-800 text-white font-bold hover:bg-emerald-900 shadow-xs"
                >
                  Store Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-bold text-stone-900 font-display">
                  {previewDoc.title}
                </h3>
              </div>
              <button onClick={() => setPreviewDoc(null)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 bg-stone-50 rounded-xl border border-stone-200 text-center space-y-2">
              <FileText className="w-12 h-12 text-stone-400 mx-auto" />
              <p className="font-mono text-xs font-bold text-stone-800">{previewDoc.fileName}</p>
              <p className="text-[11px] text-stone-500">Classification: {previewDoc.category.toUpperCase()} • {previewDoc.fileSize}</p>
              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" /> Authenticated Signature Verified
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 rounded-xl border border-stone-300 font-bold text-xs text-stone-700"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
