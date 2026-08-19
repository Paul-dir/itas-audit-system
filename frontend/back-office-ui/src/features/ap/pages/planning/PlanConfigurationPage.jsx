import { useState } from 'react';
import { Settings, Plus, Trash2, Edit2, Check, X, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { Card, Button, Badge } from '../../components/ui/index.jsx';

export default function PlanConfigurationPage() {
  const [planningConfig, setPlanningConfig] = useState({
    auditTypes: [
      {
        id: 'desk_audit',
        name: 'Desk Audit',
        effortPerCase: 40,
        complexity: 'Low',
        skillsRequired: ['Basic Analysis', 'Document Review'],
      },
      {
        id: 'field_audit',
        name: 'Field Audit',
        effortPerCase: 120,
        complexity: 'Medium',
        skillsRequired: ['Fieldwork', 'Investigation', 'Taxpayer Engagement'],
      },
      {
        id: 'joint_audit',
        name: 'Joint Audit',
        effortPerCase: 160,
        complexity: 'High',
        skillsRequired: ['Fieldwork', 'Investigation', 'Multi-team Coordination', 'Senior Auditor'],
      },
      {
        id: 'transfer_pricing',
        name: 'Transfer Pricing',
        effortPerCase: 80,
        complexity: 'High',
        skillsRequired: ['Transfer Pricing Specialist', 'International Tax'],
      },
      {
        id: 'comprehensive',
        name: 'Comprehensive',
        effortPerCase: 200,
        complexity: 'Very High',
        skillsRequired: ['Senior Auditor', 'Advanced Analysis', 'CAAT'],
      },
      {
        id: 'issue_audit',
        name: 'Issue Audit',
        effortPerCase: 50,
        complexity: 'Medium',
        skillsRequired: ['Specialized Auditor', 'Issue Expert'],
      },
    ],
    skills: [
      { id: 'basic_analysis', name: 'Basic Analysis', level: 1, category: 'Foundation' },
      { id: 'document_review', name: 'Document Review', level: 1, category: 'Foundation' },
      { id: 'fieldwork', name: 'Fieldwork', level: 2, category: 'Execution' },
      { id: 'investigation', name: 'Investigation', level: 2, category: 'Execution' },
      { id: 'taxpayer_engagement', name: 'Taxpayer Engagement', level: 2, category: 'Execution' },
      { id: 'senior_auditor', name: 'Senior Auditor', level: 3, category: 'Leadership' },
      { id: 'advanced_analysis', name: 'Advanced Analysis', level: 3, category: 'Specialized' },
      { id: 'caat', name: 'CAAT', level: 3, category: 'Technology' },
      { id: 'tp_specialist', name: 'Transfer Pricing Specialist', level: 3, category: 'Specialized' },
      { id: 'international_tax', name: 'International Tax', level: 3, category: 'Specialized' },
      { id: 'multi_team_coord', name: 'Multi-team Coordination', level: 2, category: 'Management' },
      { id: 'issue_expert', name: 'Issue Expert', level: 3, category: 'Specialized' },
    ],
  });

  const [expandedSections, setExpandedSections] = useState({
    auditTypes: true,
    skills: false,
  });

  const [editingId, setEditingId] = useState(null);
  const [editingType, setEditingType] = useState(null);
  const [formData, setFormData] = useState({});

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const startEditAuditType = (auditType) => {
    setEditingId(auditType.id);
    setEditingType('auditType');
    setFormData({ ...auditType });
  };

  const startEditSkill = (skill) => {
    setEditingId(skill.id);
    setEditingType('skill');
    setFormData({ ...skill });
  };

  const saveAuditTypeEdit = () => {
    setPlanningConfig(prev => ({
      ...prev,
      auditTypes: prev.auditTypes.map(at =>
        at.id === editingId ? { ...at, ...formData } : at
      )
    }));
    setEditingId(null);
    setFormData({});
  };

  const saveSkillEdit = () => {
    setPlanningConfig(prev => ({
      ...prev,
      skills: prev.skills.map(s =>
        s.id === editingId ? { ...s, ...formData } : s
      )
    }));
    setEditingId(null);
    setFormData({});
  };

  const deleteAuditType = (id) => {
    setPlanningConfig(prev => ({
      ...prev,
      auditTypes: prev.auditTypes.filter(at => at.id !== id)
    }));
  };

  const deleteSkill = (id) => {
    setPlanningConfig(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s.id !== id)
    }));
  };

  const addNewAuditType = () => {
    const newId = `custom_audit_${Date.now()}`;
    setPlanningConfig(prev => ({
      ...prev,
      auditTypes: [...prev.auditTypes, {
        id: newId,
        name: 'New Audit Type',
        effortPerCase: 80,
        complexity: 'Medium',
        skillsRequired: [],
      }]
    }));
  };

  const addNewSkill = () => {
    const newId = `custom_skill_${Date.now()}`;
    setPlanningConfig(prev => ({
      ...prev,
      skills: [...prev.skills, {
        id: newId,
        name: 'New Skill',
        level: 2,
        category: 'Custom',
      }]
    }));
  };

  const complexityColors = {
    'Low': 'bg-green-50 text-green-700 border-green-200',
    'Medium': 'bg-yellow-50 text-yellow-700 border-yellow-200',
    'High': 'bg-orange-50 text-orange-700 border-orange-200',
    'Very High': 'bg-red-50 text-red-700 border-red-200',
  };

  const levelLabels = { 1: 'Foundation', 2: 'Advanced', 3: 'Expert' };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Settings size={24} className="text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Plan Configuration</h1>
        </div>
        <p className="text-gray-600 dark:text-slate-400">Manage audit types, effort estimates, and skill capacities</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Audit Types Section */}
        <div className="col-span-2 space-y-4">
          <Card>
            <div
              onClick={() => toggleSection('auditTypes')}
              className="flex items-center justify-between p-4 cursor-pointer border-b border-gray-200 dark:border-slate-600"
            >
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Audit Types</h3>
                <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  {planningConfig.auditTypes.length}
                </span>
              </div>
              {expandedSections.auditTypes ? (
                <ChevronUp size={18} className="text-gray-500 dark:text-slate-400" />
              ) : (
                <ChevronDown size={18} className="text-gray-500 dark:text-slate-400" />
              )}
            </div>

            {expandedSections.auditTypes && (
              <div className="p-4 space-y-3">
                {planningConfig.auditTypes.map(auditType => (
                  <div key={auditType.id}>
                    {editingId === auditType.id && editingType === 'auditType' ? (
                      <div className="bg-blue-50 border border-blue-300 rounded-lg p-4 space-y-3">
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                          placeholder="Audit Type Name"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="number"
                            value={formData.effortPerCase}
                            onChange={(e) => setFormData({ ...formData, effortPerCase: parseInt(e.target.value) })}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            placeholder="Effort Hours"
                          />
                          <select
                            value={formData.complexity}
                            onChange={(e) => setFormData({ ...formData, complexity: e.target.value })}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                          >
                            <option>Low</option>
                            <option>Medium</option>
                            <option>High</option>
                            <option>Very High</option>
                          </select>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="success"
                            icon={Check}
                            onClick={saveAuditTypeEdit}
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            icon={X}
                            onClick={() => { setEditingId(null); setFormData({}); }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="no-hover-effect border border-gray-200 dark:border-slate-600 rounded-lg p-4 flex items-center justify-between bg-white dark:bg-slate-700">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 dark:text-white">{auditType.name}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-sm text-gray-600 dark:text-slate-400">{auditType.effortPerCase}h effort</span>
                            <Badge
                              variant="gray"
                              className={`text-xs border ${complexityColors[auditType.complexity]}`}
                            >
                              {auditType.complexity}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            icon={Edit2}
                            onClick={() => startEditAuditType(auditType)}
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            icon={Trash2}
                            onClick={() => deleteAuditType(auditType.id)}
                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                <Button
                  size="sm"
                  variant="ghost"
                  icon={Plus}
                  onClick={addNewAuditType}
                  className="w-full text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 mt-2"
                >
                  Add Audit Type
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* Skills Section */}
        <div className="col-span-1">
          <Card>
            <div
              onClick={() => toggleSection('skills')}
              className="flex items-center justify-between p-4 cursor-pointer border-b border-gray-200 dark:border-slate-600"
            >
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Skills</h3>
                <span className="text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded">
                  {planningConfig.skills.length}
                </span>
              </div>
              {expandedSections.skills ? (
                <ChevronUp size={18} className="text-gray-500 dark:text-slate-400" />
              ) : (
                <ChevronDown size={18} className="text-gray-500 dark:text-slate-400" />
              )}
            </div>

            {expandedSections.skills && (
              <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
                {planningConfig.skills.map(skill => (
                  <div key={skill.id}>
                    {editingId === skill.id && editingType === 'skill' ? (
                      <div className="bg-blue-50 border border-blue-300 rounded-lg p-3 space-y-2">
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                          placeholder="Skill Name"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <select
                            value={formData.level}
                            onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
                            className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                          >
                            <option value={1}>Foundation</option>
                            <option value={2}>Advanced</option>
                            <option value={3}>Expert</option>
                          </select>
                          <input
                            type="text"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                            placeholder="Category"
                          />
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="xs"
                            variant="success"
                            icon={Check}
                            onClick={saveSkillEdit}
                          >
                            Save
                          </Button>
                          <Button
                            size="xs"
                            variant="ghost"
                            icon={X}
                            onClick={() => { setEditingId(null); setFormData({}); }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="no-hover-effect border border-gray-200 dark:border-slate-600 rounded-lg p-2 flex items-center justify-between bg-white dark:bg-slate-700">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{skill.name}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-xs text-gray-600 dark:text-slate-400">{levelLabels[skill.level]}</span>
                            <Badge variant="gray" className="text-xs">
                              {skill.category}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="xs"
                            variant="ghost"
                            icon={Edit2}
                            onClick={() => startEditSkill(skill)}
                          />
                          <Button
                            size="xs"
                            variant="ghost"
                            icon={Trash2}
                            onClick={() => deleteSkill(skill.id)}
                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                <Button
                  size="xs"
                  variant="ghost"
                  icon={Plus}
                  onClick={addNewSkill}
                  className="w-full text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-xs mt-2"
                >
                  Add Skill
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
        <AlertCircle size={20} className="text-blue-600 flex-shrink-0" />
        <p className="text-sm text-blue-700">
          Configuration is used when creating audit plans. Changes apply immediately to new plans.
        </p>
      </div>
    </div>
  );
}
