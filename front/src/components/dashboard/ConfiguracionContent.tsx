import { useState, useEffect } from 'react'
import { 
  getSystemConfigs, 
  createSystemConfig, 
  updateSystemConfig, 
  deleteSystemConfig,
  getRiskTierConfigs,
  createRiskTierConfig,
  updateRiskTierConfig,
  deleteRiskTierConfig,
  getIndustries,
  createIndustry,
  updateIndustry,
  deleteIndustry
} from '@/services/admin.service'
import type { SystemConfig, RiskTierConfig, Industry } from '@/interfaces/admin.interface'

export const ConfiguracionContent = () => {
  const [systemConfigs, setSystemConfigs] = useState<SystemConfig[]>([])
  const [riskTierConfigs, setRiskTierConfigs] = useState<RiskTierConfig[]>([])
  const [industries, setIndustries] = useState<Industry[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'system' | 'risk' | 'industries'>('system')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [systemData, riskData, industriesData] = await Promise.all([
        getSystemConfigs(),
        getRiskTierConfigs(),
        getIndustries()
      ])
      
      setSystemConfigs(systemData.payload || [])
      setRiskTierConfigs(riskData.payload || [])
      setIndustries(industriesData.payload || [])
    } catch (error) {
      console.error('Error loading configuration data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSystemConfigUpdate = async (id: string, key: string, value: number, description?: string) => {
    try {
      await updateSystemConfig(id, { key, value, description })
      await loadData()
    } catch (error) {
      console.error('Error updating system config:', error)
    }
  }

  const handleSystemConfigCreate = async (key: string, value: number, description?: string) => {
    try {
      await createSystemConfig({ key, value, description })
      await loadData()
    } catch (error) {
      console.error('Error creating system config:', error)
    }
  }

  const handleSystemConfigDelete = async (id: string) => {
    try {
      await deleteSystemConfig(id)
      await loadData()
    } catch (error) {
      console.error('Error deleting system config:', error)
    }
  }

  const handleRiskTierConfigUpdate = async (id: string, data: { tier?: 'A' | 'B' | 'C' | 'D'; spread?: number; factor?: number; allowed_terms?: number[] }) => {
    try {
      await updateRiskTierConfig(id, data)
      await loadData()
    } catch (error) {
      console.error('Error updating risk tier config:', error)
    }
  }

  const handleRiskTierConfigCreate = async (data: { tier: 'A' | 'B' | 'C' | 'D'; spread: number; factor: number; allowed_terms: number[] }) => {
    try {
      await createRiskTierConfig(data)
      await loadData()
    } catch (error) {
      console.error('Error creating risk tier config:', error)
    }
  }

  const handleRiskTierConfigDelete = async (id: string) => {
    try {
      await deleteRiskTierConfig(id)
      await loadData()
    } catch (error) {
      console.error('Error deleting risk tier config:', error)
    }
  }

  const handleIndustryUpdate = async (id: string, data: { name?: string; baseRiskTier?: 'A' | 'B' | 'C' | 'D'; description?: string }) => {
    try {
      await updateIndustry(id, data)
      await loadData()
    } catch (error) {
      console.error('Error updating industry:', error)
    }
  }

  const handleIndustryCreate = async (data: { name: string; baseRiskTier: 'A' | 'B' | 'C' | 'D'; description?: string }) => {
    try {
      await createIndustry(data)
      await loadData()
    } catch (error) {
      console.error('Error creating industry:', error)
    }
  }

  const handleIndustryDelete = async (id: string) => {
    try {
      await deleteIndustry(id)
      await loadData()
    } catch (error) {
      console.error('Error deleting industry:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex-1 bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando configuración...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-white">
      {/* Header del contenido */}
      <div className="px-8 py-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Configuración del Sistema</h1>
        <p className="text-gray-600 text-sm mt-1">Gestiona las configuraciones generales del sistema financiero</p>
      </div>

      {/* Tabs de navegación */}
      <div className="px-8 py-4 border-b border-gray-200">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('system')}
            className={`pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'system'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Configuración del Sistema
          </button>
          <button
            onClick={() => setActiveTab('risk')}
            className={`pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'risk'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Niveles de Riesgo
          </button>
          <button
            onClick={() => setActiveTab('industries')}
            className={`pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'industries'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Industrias
          </button>
        </div>
      </div>

      {/* Contenido de configuración */}
      <div className="px-8 py-6">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'system' && (
            <SystemConfigTab 
              configs={systemConfigs}
              onUpdate={handleSystemConfigUpdate}
              onCreate={handleSystemConfigCreate}
              onDelete={handleSystemConfigDelete}
            />
          )}
          
          {activeTab === 'risk' && (
            <RiskTierConfigTab 
              configs={riskTierConfigs}
              onUpdate={handleRiskTierConfigUpdate}
              onCreate={handleRiskTierConfigCreate}
              onDelete={handleRiskTierConfigDelete}
            />
          )}
          
          {activeTab === 'industries' && (
            <IndustriesTab 
              industries={industries}
              onUpdate={handleIndustryUpdate}
              onCreate={handleIndustryCreate}
              onDelete={handleIndustryDelete}
            />
          )}
        </div>
      </div>
    </div>
  )
}

// Componente de confirmación para acciones de eliminación
const ConfirmationModal = ({
  isOpen,
  message,
  onConfirm,
  onCancel
}: {
  isOpen: boolean
  message: string
  onConfirm: () => void
  onCancel: () => void
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9999] pointer-events-none">
      <div className="bg-white p-6 rounded-lg shadow-xl border-2 border-gray-300 max-w-md w-full pointer-events-auto">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Confirmar acción</h3>
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  )
}

// Componente para editar nivel de riesgo
const EditRiskTierForm = ({ 
  config, 
  onSave, 
  onCancel 
}: { 
  config: RiskTierConfig
  onSave: (data: { tier?: 'A' | 'B' | 'C' | 'D'; spread?: number; factor?: number; allowed_terms?: number[] }) => void
  onCancel: () => void
}) => {
  const [formData, setFormData] = useState({
    tier: config.tier,
    spread: config.spread,
    factor: config.factor,
    allowed_terms: [...config.allowed_terms]
  })

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-medium text-gray-900 mb-4">Editar Nivel de Riesgo</h4>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nivel de Riesgo</label>
          <select
            value={formData.tier}
            onChange={(e) => setFormData({ ...formData, tier: e.target.value as 'A' | 'B' | 'C' | 'D' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Spread (%)</label>
          <input
            type="text"
            value={formData.spread === 0 ? '' : formData.spread}
            onChange={(e) => {
              const value = e.target.value === '' ? 0 : Number(e.target.value);
              setFormData({ ...formData, spread: isNaN(value) ? 0 : value });
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: 8.5"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Factor</label>
          <input
            type="text"
            value={formData.factor === 0 ? '' : formData.factor}
            onChange={(e) => {
              const value = e.target.value === '' ? 0 : Number(e.target.value);
              setFormData({ ...formData, factor: isNaN(value) ? 0 : value });
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: 0.35"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Plazos Permitidos (meses)</label>
          <input
            type="text"
            value={formData.allowed_terms.join(',')}
            placeholder="Ej: 6,12,24,36"
            onChange={(e) => {
              const terms = e.target.value.split(',').map(t => parseInt(t.trim())).filter(t => !isNaN(t))
              setFormData({ ...formData, allowed_terms: terms })
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="flex space-x-2 mt-4">
        <button
          onClick={() => onSave(formData)}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Guardar
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}

// Componente para editar industria
const EditIndustryForm = ({ 
  industry, 
  onSave, 
  onCancel 
}: { 
  industry: Industry
  onSave: (data: { name?: string; baseRiskTier?: 'A' | 'B' | 'C' | 'D'; description?: string }) => void
  onCancel: () => void
}) => {
  const [formData, setFormData] = useState({
    name: industry.name,
    baseRiskTier: industry.baseRiskTier,
    description: industry.description || ''
  })

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-medium text-gray-900 mb-4">Editar Industria</h4>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nivel de Riesgo Base</label>
          <select
            value={formData.baseRiskTier}
            onChange={(e) => setFormData({ ...formData, baseRiskTier: e.target.value as 'A' | 'B' | 'C' | 'D' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="A">A (Bajo)</option>
            <option value="B">B (Medio-Bajo)</option>
            <option value="C">C (Medio-Alto)</option>
            <option value="D">D (Alto)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Descripción (opcional)</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>
      </div>
      <div className="flex space-x-2 mt-4">
        <button
          onClick={() => onSave(formData)}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Guardar
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}

// Componente para configuración del sistema
const SystemConfigTab = ({ 
  configs, 
  onUpdate, 
  onCreate, 
  onDelete 
}: { 
  configs: SystemConfig[]
  onUpdate: (id: string, key: string, value: number, description?: string) => void
  onCreate: (key: string, value: number, description?: string) => void
  onDelete: (id: string) => void
}) => {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [confirmationModal, setConfirmationModal] = useState<{isOpen: boolean, id: string | null}>({isOpen: false, id: null})
  const [newConfig, setNewConfig] = useState({ key: '', value: 0, description: '' })
  
  const handleDelete = (id: string) => {
    setConfirmationModal({isOpen: true, id})
  }
  
  const confirmDelete = () => {
    if (confirmationModal.id) {
      onDelete(confirmationModal.id)
      setConfirmationModal({isOpen: false, id: null})
    }
  }

  return (
    <div className="space-y-6">
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        message="¿Estás seguro de que quieres eliminar esta configuración?"
        onConfirm={confirmDelete}
        onCancel={() => setConfirmationModal({isOpen: false, id: null})}
      />
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Configuraciones del Sistema</h3>
        <button
          onClick={() => {
            if (newConfig.key && newConfig.value) {
              onCreate(newConfig.key, newConfig.value, newConfig.description)
              setNewConfig({ key: '', value: 0, description: '' })
            }
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Agregar Configuración
        </button>
      </div>

      {/* Formulario para nueva configuración */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Nueva Configuración</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Clave"
            value={newConfig.key}
            onChange={(e) => setNewConfig({ ...newConfig, key: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Valor"
            value={newConfig.value === 0 ? '' : newConfig.value}
            onChange={(e) => {
              const value = e.target.value === '' ? 0 : Number(e.target.value);
              setNewConfig({ ...newConfig, value: isNaN(value) ? 0 : value });
            }}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Descripción (opcional)"
            value={newConfig.description}
            onChange={(e) => setNewConfig({ ...newConfig, description: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Lista de configuraciones existentes */}
      <div className="space-y-4">
        {configs && configs.length > 0 ? configs.map((config) => (
          <div key={config.id} className="bg-white border rounded-lg p-4">
            {editingId === config.id ? (
              <EditSystemConfigForm
                config={config}
                onSave={(key, value, description) => {
                  onUpdate(config.id, key, value, description)
                  setEditingId(null)
                }}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <span className="font-medium text-gray-900">{config.key}</span>
                    <span className="text-gray-600">{config.value}</span>
                    {config.description && (
                      <span className="text-sm text-gray-500">{config.description}</span>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingId(config.id)}
                    className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(config.id)}
                    className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            )}
          </div>
        )) : (
          <div className="text-center py-8 text-gray-500">
            <p>No hay configuraciones del sistema disponibles.</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Componente para editar configuración del sistema
const EditSystemConfigForm = ({ 
  config, 
  onSave, 
  onCancel 
}: { 
  config: SystemConfig
  onSave: (key: string, value: number, description?: string) => void
  onCancel: () => void
}) => {
  const [formData, setFormData] = useState({
    key: config.key,
    value: config.value,
    description: config.description || ''
  })

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <input
        type="text"
        value={formData.key}
        onChange={(e) => setFormData({ ...formData, key: e.target.value })}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="number"
        value={formData.value}
        onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="flex space-x-2">
        <input
          type="text"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Descripción"
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => onSave(formData.key, formData.value, formData.description)}
          className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Guardar
        </button>
        <button
          onClick={onCancel}
          className="px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}

// Componente para niveles de riesgo
const RiskTierConfigTab = ({ 
  configs, 
  onUpdate,
  onCreate, 
  onDelete 
}: { 
  configs: RiskTierConfig[]
  onUpdate: (id: string, data: { tier?: 'A' | 'B' | 'C' | 'D'; spread?: number; factor?: number; allowed_terms?: number[] }) => void
  onCreate: (data: { tier: 'A' | 'B' | 'C' | 'D'; spread: number; factor: number; allowed_terms: number[] }) => void
  onDelete: (id: string) => void
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [confirmationModal, setConfirmationModal] = useState<{isOpen: boolean, id: string | null}>({isOpen: false, id: null})
  const [newConfig, setNewConfig] = useState({
    tier: 'A' as 'A' | 'B' | 'C' | 'D',
    spread: 0,
    factor: 0,
    allowed_terms: [] as number[]
  })

  const handleCreate = () => {
    if (newConfig.tier && newConfig.spread && newConfig.factor && newConfig.allowed_terms.length > 0) {
      onCreate(newConfig)
      setNewConfig({ tier: 'A', spread: 0, factor: 0, allowed_terms: [] })
      setShowCreateForm(false)
    }
  }

  const handleDelete = (id: string) => {
    setConfirmationModal({isOpen: true, id})
  }
  
  const confirmDelete = () => {
    if (confirmationModal.id) {
      onDelete(confirmationModal.id)
      setConfirmationModal({isOpen: false, id: null})
    }
  }

  return (
    <div className="space-y-6">
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        message="¿Estás seguro de que quieres eliminar esta configuración?"
        onConfirm={confirmDelete}
        onCancel={() => setConfirmationModal({isOpen: false, id: null})}
      />
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Configuraciones de Nivel de Riesgo</h3>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {showCreateForm ? 'Cancelar' : 'Agregar Nivel de Riesgo'}
        </button>
      </div>

      {/* Formulario para crear nueva configuración */}
      {showCreateForm && (
        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Nueva Configuración de Riesgo</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nivel de Riesgo</label>
              <select
                value={newConfig.tier}
                onChange={(e) => setNewConfig({ ...newConfig, tier: e.target.value as 'A' | 'B' | 'C' | 'D' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Spread (%)</label>
              <input
                type="text"
                value={newConfig.spread === 0 ? '' : newConfig.spread}
                onChange={(e) => {
                  const value = e.target.value === '' ? 0 : Number(e.target.value);
                  setNewConfig({ ...newConfig, spread: isNaN(value) ? 0 : value });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: 8.5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Factor</label>
              <input
                type="text"
                value={newConfig.factor === 0 ? '' : newConfig.factor}
                onChange={(e) => {
                  const value = e.target.value === '' ? 0 : Number(e.target.value);
                  setNewConfig({ ...newConfig, factor: isNaN(value) ? 0 : value });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: 0.35"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Plazos Permitidos (meses)</label>
              <input
                type="text"
                placeholder="Ej: 6,12,24,36"
                onChange={(e) => {
                  const terms = e.target.value.split(',').map(t => parseInt(t.trim())).filter(t => !isNaN(t))
                  setNewConfig({ ...newConfig, allowed_terms: terms })
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="mt-4 flex space-x-2">
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Crear
            </button>
            <button
              onClick={() => setShowCreateForm(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {configs && configs.length > 0 ? configs.map((config) => (
          <div key={config.id} className="bg-white border rounded-lg p-6">
            {editingId === config.id ? (
              <EditRiskTierForm
                config={config}
                onSave={(data) => {
                  onUpdate(config.id, data)
                  setEditingId(null)
                }}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <>
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-lg font-medium text-gray-900">
                    Nivel {config.tier}
                  </h4>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    config.tier === 'A' ? 'bg-green-100 text-green-800' :
                    config.tier === 'B' ? 'bg-blue-100 text-blue-800' :
                    config.tier === 'C' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {config.tier}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-500">Spread:</span>
                    <span className="ml-2 font-medium">{config.spread}%</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Factor:</span>
                    <span className="ml-2 font-medium">{config.factor}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Plazos permitidos:</span>
                    <div className="mt-1">
                      {config.allowed_terms.map((term, index) => (
                        <span key={index} className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded mr-1 mb-1">
                          {term} meses
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => setEditingId(config.id)}
                    className="flex-1 px-3 py-2 text-sm text-blue-600 hover:text-blue-800 border border-blue-600 rounded-md"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(config.id)}
                    className="flex-1 px-3 py-2 text-sm text-red-600 hover:text-red-800 border border-red-600 rounded-md"
                  >
                    Eliminar
                  </button>
                </div>
              </>
            )}
          </div>
        )) : (
          <div className="col-span-full text-center py-8 text-gray-500">
            <p>No hay configuraciones de nivel de riesgo disponibles.</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Componente para industrias
const IndustriesTab = ({ 
  industries, 
  onUpdate,
  onCreate, 
  onDelete 
}: { 
  industries: Industry[]
  onUpdate: (id: string, data: { name?: string; baseRiskTier?: 'A' | 'B' | 'C' | 'D'; description?: string }) => void
  onCreate: (data: { name: string; baseRiskTier: 'A' | 'B' | 'C' | 'D'; description?: string }) => void
  onDelete: (id: string) => void
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [confirmationModal, setConfirmationModal] = useState<{isOpen: boolean, id: string | null}>({isOpen: false, id: null})
  const [newIndustry, setNewIndustry] = useState({
    name: '',
    baseRiskTier: 'A' as 'A' | 'B' | 'C' | 'D',
    description: ''
  })

  const handleCreate = () => {
    if (newIndustry.name && newIndustry.baseRiskTier) {
      onCreate(newIndustry)
      setNewIndustry({ name: '', baseRiskTier: 'A', description: '' })
      setShowCreateForm(false)
    }
  }

  const handleDelete = (id: string) => {
    setConfirmationModal({isOpen: true, id})
  }
  
  const confirmDelete = () => {
    if (confirmationModal.id) {
      onDelete(confirmationModal.id)
      setConfirmationModal({isOpen: false, id: null})
    }
  }

  return (
    <div className="space-y-6">
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        message="¿Estás seguro de que quieres eliminar esta industria?"
        onConfirm={confirmDelete}
        onCancel={() => setConfirmationModal({isOpen: false, id: null})}
      />
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Industrias</h3>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {showCreateForm ? 'Cancelar' : 'Agregar Industria'}
        </button>
      </div>

      {/* Formulario para crear nueva industria */}
      {showCreateForm && (
        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Nueva Industria</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
              <input
                type="text"
                value={newIndustry.name}
                onChange={(e) => setNewIndustry({ ...newIndustry, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nombre de la industria"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nivel de Riesgo Base</label>
              <select
                value={newIndustry.baseRiskTier}
                onChange={(e) => setNewIndustry({ ...newIndustry, baseRiskTier: e.target.value as 'A' | 'B' | 'C' | 'D' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="A">A (Bajo)</option>
                <option value="B">B (Medio-Bajo)</option>
                <option value="C">C (Medio-Alto)</option>
                <option value="D">D (Alto)</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Descripción (opcional)</label>
              <textarea
                value={newIndustry.description}
                onChange={(e) => setNewIndustry({ ...newIndustry, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Descripción de la industria"
              />
            </div>
          </div>
          <div className="mt-4 flex space-x-2">
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Crear
            </button>
            <button
              onClick={() => setShowCreateForm(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {industries && industries.length > 0 ? industries.map((industry) => (
          <div key={industry.id} className="bg-white border rounded-lg p-6">
            {editingId === industry.id ? (
              <EditIndustryForm
                industry={industry}
                onSave={(data) => {
                  onUpdate(industry.id, data)
                  setEditingId(null)
                }}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <>
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-lg font-medium text-gray-900">
                    {industry.name}
                  </h4>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    industry.baseRiskTier === 'A' ? 'bg-green-100 text-green-800' :
                    industry.baseRiskTier === 'B' ? 'bg-blue-100 text-blue-800' :
                    industry.baseRiskTier === 'C' ? 'bg-yellow-100 text-yellow-800' :
                    industry.baseRiskTier === 'D' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {industry.baseRiskTier}
                  </span>
                </div>
                
                {industry.description && (
                  <p className="text-sm text-gray-600 mb-4">{industry.description}</p>
                )}

                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => setEditingId(industry.id)}
                    className="flex-1 px-3 py-2 text-sm text-blue-600 hover:text-blue-800 border border-blue-600 rounded-md"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(industry.id)}
                    className="flex-1 px-3 py-2 text-sm text-red-600 hover:text-red-800 border border-red-600 rounded-md"
                  >
                    Eliminar
                  </button>
                </div>
              </>
            )}
          </div>
        )) : (
          <div className="col-span-full text-center py-8 text-gray-500">
            <p>No hay industrias disponibles.</p>
          </div>
        )}
      </div>
    </div>
  )
}