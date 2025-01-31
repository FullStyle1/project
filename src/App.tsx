import React, { useState } from 'react';
import { UserPlus, Search, PencilLine, Trash2, X } from 'lucide-react';
import logoImage from 'Assets/Logotipo_UTCH.png';

interface Teacher {
  id: number;
  firstName: string;
  lastName: string;
  paternalLastName: string; 
  email: string;
  subject: string;
}

function App() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    paternalLastName: '',
    email: '',
    subject: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setTeachers(teachers.map(teacher => 
        teacher.id === editingId ? { ...formData, id: editingId } : teacher
      ));
      setEditingId(null);
    } else {
      setTeachers([...teachers, { id: Date.now(), ...formData }]);
    }
    setFormData({ firstName: '', lastName: '', paternalLastName: '', email: '', subject: '' });
  };

  const handleEdit = (teacher: Teacher) => {
    setEditingId(teacher.id);
    setFormData({
      firstName: teacher.firstName,
      lastName: teacher.lastName,
      paternalLastName: teacher.paternalLastName,
      email: teacher.email,
      subject: teacher.subject
    });
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Seguro que quieres eliminar este profesor?')) {
      setTeachers(teachers.filter(teacher => teacher.id !== id));
      if (editingId === id) {
        setEditingId(null);
        setFormData({ firstName: '', lastName: '', paternalLastName: '', email: '', subject: '' });
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ firstName: '', lastName: '', paternalLastName: '', email: '', subject: '' });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredTeachers = teachers.filter(teacher => 
    teacher.paternalLastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <header className="bg-green-600 text-white p-6 shadow-lg">
        <div className="container mx-auto flex items-center gap-2">
          <img src={logoImage} alt="Logo de la UTCH" />
          <h1 className="text-2xl font-bold">UTCH</h1>
          <h2 className="text-2xl font-bold">Sistema de Altas y Bajas de Maestros</h2>
        </div>
      </header>

      <main className="container mx-auto p-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Add/Edit Teacher Form */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <UserPlus className="text-green-600" />
                <h2 className="text-xl font-semibold">
                  {editingId ? 'Editar Información de Profesor' : 'Agregar un Profesor'}
                </h2>
              </div>
              {editingId && (
                <button
                  onClick={handleCancelEdit}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              )}
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  type="text"
                  placeholder="Nombre(s)"
                  className="p-2 border rounded"
                  value={formData.firstName}
                  onChange={e => setFormData({...formData, firstName: e.target.value})}
                  required
                />
                <input
                  type="text"
                  placeholder="Primer apellido"
                  className="p-2 border rounded"
                  value={formData.lastName}
                  onChange={e => setFormData({...formData, lastName: e.target.value})}
                  required
                />
                <input
                  type="text"
                  placeholder="Segundo Apellido"
                  className="p-2 border rounded"
                  value={formData.paternalLastName}
                  onChange={e => setFormData({...formData, paternalLastName: e.target.value})}
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="p-2 border rounded"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  required
                />
                <input
                  type="text"
                  placeholder="Materia que Imparte"
                  className="p-2 border rounded md:col-span-2"
                  value={formData.subject}
                  onChange={e => setFormData({...formData, subject: e.target.value})}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
              >
                {editingId ? 'Actualizar Profesor' : 'Agregar Profesor'}
              </button>
            </form>
          </div>

          {/* Search and List */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <Search className="text-green-600" />
              <h2 className="text-xl font-semibold">Buscar Profesores</h2>
            </div>
            <input
              type="text"
              placeholder="Buscar por apellido pateno..."
              className="w-full p-2 border rounded mb-4"
              value={searchTerm}
              onChange={handleSearch}
            />
            <div className="space-y-2">
              {filteredTeachers.map(teacher => (
                <div key={teacher.id} className="p-3 border rounded hover:bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">
                        {teacher.firstName} {teacher.lastName} {teacher.paternalLastName}
                      </h3>
                      <p className="text-sm text-gray-600">{teacher.subject}</p>
                      <p className="text-sm text-gray-500">{teacher.email}</p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEdit(teacher)}
                        className="text-green-600 hover:text-green-700 p-1"
                      >
                        <PencilLine size={20} />
                      </button>
                      <button 
                        onClick={() => handleDelete(teacher.id)}
                        className="text-red-600 hover:text-red-700 p-1"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {filteredTeachers.length === 0 && (
                <p className="text-center text-gray-500">No se han encontrado profesores</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;