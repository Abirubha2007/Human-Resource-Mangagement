import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Briefcase, 
  User, 
  Trash2, 
  Edit2, 
  Users,
  Search
} from 'lucide-react';
import { PageHeader, Card, Button, Input, Select, Badge } from '../../components/UI';
import { Modal, ConfirmDialog } from '../../components/Modal';
import { departmentService } from '../../services/departmentService';
import { useToast } from '../../context/ToastContext';

const AdminDepartments = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [depts, setDepts] = useState([]);
  const [filteredDepts, setFilteredDepts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search filter
  const [search, setSearch] = useState('');

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('add'); // 'add' or 'edit'
  const [selectedId, setSelectedId] = useState(null);
  
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form Fields
  const [formFields, setFormFields] = useState({
    name: '',
    head: '',
    budget: ''
  });
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const loadDepartments = async () => {
    setIsLoading(true);
    try {
      const data = await departmentService.getAll();
      setDepts(data);
      setFilteredDepts(data);
    } catch (err) {
      showToast("Could not load departments list.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  // Search logic
  useEffect(() => {
    if (search.trim()) {
      const q = search.toLowerCase();
      setFilteredDepts(depts.filter(d => 
        d.name.toLowerCase().includes(q) || 
        d.head.toLowerCase().includes(q)
      ));
    } else {
      setFilteredDepts(depts);
    }
  }, [search, depts]);

  const handleOpenAdd = () => {
    setFormMode('add');
    setSelectedId(null);
    setFormFields({ name: '', head: '', budget: '' });
    setErrors({});
    setIsFormOpen(true);
  };

  const handleOpenEdit = (dept, e) => {
    e.stopPropagation();
    setFormMode('edit');
    setSelectedId(dept.id);
    setFormFields({
      name: dept.name,
      head: dept.head,
      budget: dept.budget
    });
    setErrors({});
    setIsFormOpen(true);
  };

  const validateForm = () => {
    const errs = {};
    if (!formFields.name) errs.name = "Department name is required.";
    if (!formFields.head) errs.head = "Department head is required.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      if (formMode === 'add') {
        await departmentService.create(formFields);
        showToast("Department created successfully.");
      } else {
        await departmentService.update(selectedId, formFields);
        showToast("Department details updated.");
      }
      setIsFormOpen(false);
      loadDepartments();
    } catch (err) {
      showToast("Failed to save department details.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenDelete = (id, e) => {
    e.stopPropagation();
    setSelectedId(id);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await departmentService.delete(selectedId);
      showToast("Department deleted.");
      setIsDeleteOpen(false);
      loadDepartments();
    } catch (err) {
      showToast("Deletion failed.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Page Title */}
      <PageHeader
        title="Departments Structure"
        subtitle="Manage company structural divisions, staff levels, and operational budgets."
        actions={
          <Button variant="primary" size="md" icon={Plus} onClick={handleOpenAdd}>
            Add Department
          </Button>
        }
      />

      {/* Filter panel */}
      <div className="flex items-center justify-between gap-4 p-4 bg-white border border-charcoal-100 rounded-xl shadow-subtle">
        <div className="relative flex-1 max-w-sm flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-charcoal-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs bg-charcoal-50 border border-charcoal-200 rounded-lg pl-9 pr-3 py-2.5 transition-all focus:outline-none focus:bg-white focus:border-charcoal-900 focus:ring-1 focus:ring-charcoal-900 placeholder:text-charcoal-400"
          />
        </div>
      </div>

      {/* Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, idx) => (
            <Card key={idx} className="h-44 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="shimmer h-5 w-2/3 bg-charcoal-200 rounded" />
                <div className="shimmer h-4 w-1/2 bg-charcoal-200 rounded" />
              </div>
              <div className="shimmer h-10 w-full bg-charcoal-200 rounded" />
            </Card>
          ))}
        </div>
      ) : filteredDepts.length === 0 ? (
        <div className="text-center bg-white border border-charcoal-100 p-8 rounded-xl text-charcoal-400 font-semibold shadow-subtle">
          No departments found matching your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDepts.map((dept) => (
            <Card 
              key={dept.id} 
              className="flex flex-col justify-between gap-4 hover:shadow-card transition-shadow cursor-pointer border border-charcoal-100"
              onClick={() => navigate('/admin/employees')}
            >
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-charcoal-950 font-sans">{dept.name}</h3>
                  <Badge variant="green">Active</Badge>
                </div>
                
                <div className="flex items-center gap-1 text-xs text-charcoal-450 mt-2 font-semibold">
                  <User className="w-3.5 h-3.5" />
                  <span>Lead: {dept.head}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-charcoal-50 pt-4 text-xs font-semibold">
                <div>
                  <span className="text-[10px] text-charcoal-400 block uppercase">Employees</span>
                  <span className="text-charcoal-900 flex items-center gap-1.5 mt-0.5">
                    <Users className="w-4 h-4 text-charcoal-400" />
                    {dept.employeeCount} Members
                  </span>
                </div>
                
                <div>
                  <span className="text-[10px] text-charcoal-400 block uppercase">Budget (Quarter)</span>
                  <span className="text-charcoal-900 block mt-0.5">{dept.budget}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-charcoal-50 pt-3" onClick={e => e.stopPropagation()}>
                <button
                  onClick={(e) => handleOpenEdit(dept, e)}
                  className="p-1.5 border border-charcoal-200 rounded-lg hover:bg-charcoal-50 text-charcoal-600 transition-colors"
                  title="Edit Department"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => handleOpenDelete(dept.id, e)}
                  className="p-1.5 border border-transparent rounded-lg hover:bg-red-50 text-red-650 hover:border-red-100 transition-colors"
                  title="Delete Division"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

            </Card>
          ))}
        </div>
      )}

      {/* Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={formMode === 'add' ? 'Create New Department' : 'Edit Department Details'}
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsFormOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave} isLoading={isSaving}>
              {formMode === 'add' ? 'Create Department' : 'Save Changes'}
            </Button>
          </>
        }
      >
        <form className="flex flex-col gap-4">
          <Input
            label="Department Name"
            placeholder="e.g. Quality Assurance"
            value={formFields.name}
            onChange={(e) => setFormFields(prev => ({ ...prev, name: e.target.value }))}
            error={errors.name}
          />
          <Input
            label="Department Head (Manager)"
            placeholder="Manager Full Name"
            value={formFields.head}
            onChange={(e) => setFormFields(prev => ({ ...prev, head: e.target.value }))}
            error={errors.head}
          />
          <Input
            label="Quarterly Budget Allocation"
            placeholder="e.g. ₹5,00,000"
            value={formFields.budget}
            onChange={(e) => setFormFields(prev => ({ ...prev, budget: e.target.value }))}
          />
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Department?"
        message="Are you sure you want to delete this department? Doing so will remove its budget ledger, though employees can be reassigned to other divisions."
        confirmLabel="Delete Division"
        variant="danger"
        isLoading={isDeleting}
      />

    </div>
  );
};

export default AdminDepartments;
