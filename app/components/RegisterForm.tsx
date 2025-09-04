"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PasswordField } from '../components/PasswordField';

// Interfaz para los datos del formulario de registro
interface RegisterFormData {
  nombre: string;
  clave: string;
  claveConfirm: string;
  e_mail: string;
  telcel: string;
  nrodoc: string;
  locali: string;
  domcalle: string;
  domnro: string;
}
// Valores iniciales del formulario
const initialFormData: RegisterFormData = {
  nombre: '',
  clave: '',
  claveConfirm: '',
  e_mail: '',
  telcel: '',
  nrodoc: '',
  locali: '',
  domcalle: '',
  domnro: ''
};

export default function RegisterForm({ onCancel }: { onCancel: () => void }) {
  const [formData, setFormData] = useState<RegisterFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const [sinNumero, setSinNumero] = useState(false);


  // Manejar cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Validar el formulario
  const validateForm = (): string | null => {
    // Validar que todos los campos obligatorios estén completos
    if (!formData.nombre || !formData.clave || !formData.claveConfirm || !formData.e_mail || !formData.nrodoc) {
      return 'Todos los campos son obligatorios excepto el teléfono celular';
    }

    // Validar que las contraseñas coincidan
    if (formData.clave !== formData.claveConfirm) {
      return 'Las contraseñas no coinciden';
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.e_mail)) {
      return 'El formato del email no es válido';
    }
    //Validar localidad
    if (!formData.locali) {
      return 'La localidad es obligatoria';
    }

    // Validar formato de teléfono (opcional)
    if (formData.telcel && !/^\d{5,25}$/.test(formData.telcel)) {
      return 'El teléfono debe tener 10 dígitos';
    }

    // Validar formato de documento
    if (!/^\d{7,8}$/.test(formData.nrodoc)) {
      return 'El número de documento debe tener entre 7 y 8 dígitos';
    }

    // Validar complejidad de contraseña
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(formData.clave)) {
      return 'La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una minúscula y un número';
    }
    // Validar número de domicilio si no es "S/N"
    if (!sinNumero && (!/^\d+$/.test(formData.domnro) || parseInt(formData.domnro, 10) <= 0)) {
      return 'El número de domicilio debe ser un número positivo';
    }

    return null;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar el formulario
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Preparar los datos para enviar a la API
      const userData = {
        nombre: formData.nombre,
        clave: formData.clave,
        e_mail: formData.e_mail,
        catusu: "C", // Valor por defecto
        gposeg: 0,   // Valor por defecto
        telcel: formData.telcel || "",
        nrodoc: formData.nrodoc,
        locali: formData.locali,
        domcalle: formData.domcalle,
        domnro: sinNumero ? "S/N" : formData.domnro,
      };

      // Enviar los datos a la API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/web-usuarios/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      // Manejar respuesta
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage =
          errorData?.error || // mensaje específico del backend
          errorData?.detail || // fallback por si usa otra clave
          `Error en el registro: ${response.status} ${response.statusText}`; // mensaje genérico

        throw new Error(errorMessage);
      }

      // Registro exitoso
      setSuccess(true);
      setTimeout(() => {
        onCancel(); // Volver a la pantalla de login después de mostrar el mensaje de éxito
      }, 3000);
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      setError(error instanceof Error ? error.message : 'Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Crear Cuenta</h2>
      
      {/* Mensajes de éxito o error */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">¡Registro exitoso! Ahora puedes iniciar sesión con tus credenciales.</span>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nombre completo */}
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre completo *
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
            required
          />
        </div>
        
        {/* Email */}
        <div>
          <label htmlFor="e_mail" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            id="e_mail"
            name="e_mail"
            value={formData.e_mail}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
            required
          />
        </div>
        
        {/* Documento */}
        <div>
          <label htmlFor="nrodoc" className="block text-sm font-medium text-gray-700 mb-1">
            Número de documento *
          </label>
          <input
            type="text"
            id="nrodoc"
            name="nrodoc"
            value={formData.nrodoc}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
            required
          />
        </div>
        {/* Domicilio Calle */}
        <div>
          <label htmlFor="domcalle" className="block text-sm font-medium text-gray-700 mb-1">
            Calle *
          </label>
          <input
            type="text"
            id="domcalle"
            name="domcalle"
            value={formData.domcalle}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
            required
          />
        </div>

      {/* Domicilio Número */}
      <div>
        <label htmlFor="domnro" className="block text-sm font-medium text-gray-700 mb-1">
          Número *
        </label>
        <input
          type="text"
          id="domnro"
          name="domnro"
          value={sinNumero ? "S/N" : formData.domnro}
          onChange={handleChange}
          disabled={sinNumero}
          inputMode="numeric"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700 disabled:bg-gray-100"
          required={!sinNumero}
        />
        <div className="mt-1 flex items-center">
          <input
            id="sinNumero"
            name="sinNumero"
            type="checkbox"
            checked={sinNumero}
            onChange={() => {
              setSinNumero(prev => !prev);
              setFormData(prev => ({
                ...prev,
                domnro: prev.domnro || "S/N"
              }));
            }}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <label htmlFor="sinNumero" className="ml-2 block text-sm text-gray-700">
            Sin número
          </label>
        </div>
      </div>


        {/* Localidad */}
        <div>
          <label htmlFor="locali" className="block text-sm font-medium text-gray-700 mb-1">
            Localidad *
          </label>
          <select
            id="locali"
            name="locali"
            value={formData.locali}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
          >
            <option value="">Seleccioná una localidad</option>
            <option value='8000'>Bahía Blanca - Buenos Aires</option>
            <option value="8105">General Daniel Cerri - Buenos Aires</option>
            <option value="8109">Punta Alta - Buenos Aires</option>
            <option value="8150">Coronel Dorrego - Buenos Aires</option>
            <option value="8153">Monte Hermoso - Buenos Aires</option>
            <option value="8103">Ingeniero White - Buenos Aires</option>
            <option value="8160">Tornquist - Buenos Aires</option>
            <option value="7530">Coronel Pringles</option>
            <option value="8168">Sierra de la Ventana - Buenos Aires</option>
            <option value="8118">Cabildo - Buenos Aires</option>
            <option value="8170">Pigue - Buenos Aires</option>
            <option value="0">Otra localidad</option>
          </select>
        </div>








        
        {/* Teléfono */}
        <div>
          <label htmlFor="telcel" className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono celular
          </label>
          <input
            type="text"
            id="telcel"
            name="telcel"
            value={formData.telcel}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
          />
        </div>
        
        {/* Contraseña */}
        <PasswordField
          id="clave"
          name="clave"
          value={formData.clave}
          onChange={handleChange}
          label="Contraseña"
          required={true}
          helperText="Mínimo 8 caracteres, incluyendo mayúsculas, minúsculas y números"
        />
        {/* <div>
          <label htmlFor="clave" className="block text-sm font-medium text-gray-700 mb-1">
            Contraseña *
          </label>
          <input
            type="password"
            id="clave"
            name="clave"
            value={formData.clave}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Mínimo 8 caracteres, incluyendo mayúsculas, minúsculas y números
          </p>
        </div> */}
        
        {/* Confirmar Contraseña */}
        <PasswordField
          id="claveConfirm"
          name="claveConfirm"
          value={formData.claveConfirm}
          onChange={handleChange}
          label="Confirmar Contraseña"
          required={true}
        />
        
        {/* <div>
          <label htmlFor="claveConfirm" className="block text-sm font-medium text-gray-700 mb-1">
            Confirmar Contraseña *
          </label>
          <input
            type="password"
            id="claveConfirm"
            name="claveConfirm"
            value={formData.claveConfirm}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
            required
          />
        </div> */}
        
        {/* Botones de acción */}
        <div className="flex space-x-4 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Crear Cuenta'}
          </button>
        </div>
      </form>
    </div>
  );
}