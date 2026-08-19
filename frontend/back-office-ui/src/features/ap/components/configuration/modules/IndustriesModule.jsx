import React, { useState } from 'react';

function IndustriesModule({ data, onUpdate }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});

  const handleAddNew = () => {
    setEditingId(null);
    setFormData({});
    setShowForm(true);
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({ ...item });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!formData.id || !formData.name) {
      alert('Please fill all required fields');
      return;
    }

    let updated;
    if (editingId) {
      updated = data.map(item => item.id === editingId ? formData : item);
    } else {
      updated = [...data, formData];
    }

    onUpdate(updated);
    setShowForm(false);
    setFormData({});
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this industry?')) {
      onUpdate(data.filter(item => item.id !== id));
    }
  };

  if (showForm) {
    return (
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => setShowForm(false)}
          className="mb-4 text-blue hover:text-orange-500 transition-colors"
        >
          ◀ Back
        </button>
        <div className="bg-card-dark border border-border-dark rounded-lg p-6">
          <h2 className="text-2xl font-bold text-text-hi mb-6">
            {editingId ? 'Edit' : 'Add'} Industry
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-text-hi mb-2">ID *</label>
              <input
                type="text"
                value={formData.id || ''}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                className="w-full px-4 py-2 bg-neutral-900 border border-border-dark rounded-lg text-text-hi placeholder-text-mid focus:outline-none focus:border-blue focus:ring-2 focus:ring-blue focus:ring-opacity-20"
                placeholder="e.g., construction"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-hi mb-2">Name *</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 bg-neutral-900 border border-border-dark rounded-lg text-text-hi placeholder-text-mid focus:outline-none focus:border-blue focus:ring-2 focus:ring-blue focus:ring-opacity-20"
                placeholder="e.g., Construction"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-hi mb-2">Risk Score (1-100)</label>
              <input
                type="number"
                min="1"
                max="100"
                value={formData.riskScore || ''}
                onChange={(e) => setFormData({ ...formData, riskScore: parseInt(e.target.value) })}
                className="w-full px-4 py-2 bg-neutral-900 border border-border-dark rounded-lg text-text-hi placeholder-text-mid focus:outline-none focus:border-blue focus:ring-2 focus:ring-blue focus:ring-opacity-20"
                placeholder="75"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-hi mb-2">Compliance Rate (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.compliance || ''}
                onChange={(e) => setFormData({ ...formData, compliance: parseInt(e.target.value) })}
                className="w-full px-4 py-2 bg-neutral-900 border border-border-dark rounded-lg text-text-hi placeholder-text-mid focus:outline-none focus:border-blue focus:ring-2 focus:ring-blue focus:ring-opacity-20"
                placeholder="68"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2 bg-blue hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-text-hi rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-text-hi">Industries ({data.length})</h2>
        <button
          onClick={handleAddNew}
          className="px-4 py-2 bg-blue hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
        >
          + Add New
        </button>
      </div>

      <div className="space-y-3">
        {data.map(item => (
          <div key={item.id} className="bg-card-dark border border-border-dark rounded-lg p-4 flex justify-between items-center hover:border-blue transition-colors">
            <div>
              <h3 className="text-lg font-semibold text-text-hi">{item.name}</h3>
              <p className="text-sm text-text-mid">
                Risk Score: {item.riskScore} • Compliance: {item.compliance}%
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(item)}
                className="px-3 py-1 text-sm text-blue hover:text-orange-500 transition-colors"
              >
                ✎ Edit
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="px-3 py-1 text-sm text-red-400 hover:text-red-300 transition-colors"
              >
                🗑 Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default IndustriesModule;
