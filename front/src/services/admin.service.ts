import {
  type SystemConfigResponse,
  type RiskTierConfigResponse,
  type IndustryResponse,
  type SingleSystemConfigResponse,
  type SingleRiskTierConfigResponse,
  type SingleIndustryResponse,
  type DeleteResponse,
  type CreateSystemConfigData,
  type UpdateSystemConfigData,
  type CreateRiskTierConfigData,
  type UpdateRiskTierConfigData,
  type CreateIndustryData,
  type UpdateIndustryData
} from '@/interfaces/admin.interface'

// Helper function to get auth token
const getAuthToken = (): string => {
  const token = localStorage.getItem('tokenPyme')
  if (!token) {
    throw new Error('No authentication token found')
  }
  return token
}

// Helper function to make API requests
const makeRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getAuthToken()
  
  const response = await fetch(`${import.meta.env.VITE_API_URL}/admin${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  })

  const result = await response.json()
  
  if (!response.ok) {
    throw new Error(result.message || `Error: ${response.status}`)
  }
  
  return result
}

// System Config API functions
export const getSystemConfigs = async (): Promise<SystemConfigResponse> => {
  try {
    return await makeRequest<SystemConfigResponse>('/systemconfig')
  } catch (error) {
    console.error('[getSystemConfigs]: Error fetching data:', error)
    throw error
  }
}

export const getSystemConfigById = async (id: string): Promise<SingleSystemConfigResponse> => {
  try {
    return await makeRequest<SingleSystemConfigResponse>(`/systemconfig/${id}`)
  } catch (error) {
    console.error('[getSystemConfigById]: Error fetching data:', error)
    throw error
  }
}

export const createSystemConfig = async (data: CreateSystemConfigData): Promise<SingleSystemConfigResponse> => {
  try {
    return await makeRequest<SingleSystemConfigResponse>('/systemconfig', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  } catch (error) {
    console.error('[createSystemConfig]: Error creating data:', error)
    throw error
  }
}

export const updateSystemConfig = async (id: string, data: UpdateSystemConfigData): Promise<SingleSystemConfigResponse> => {
  try {
    return await makeRequest<SingleSystemConfigResponse>(`/systemconfig/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  } catch (error) {
    console.error('[updateSystemConfig]: Error updating data:', error)
    throw error
  }
}

export const deleteSystemConfig = async (id: string): Promise<DeleteResponse> => {
  try {
    return await makeRequest<DeleteResponse>(`/systemconfig/${id}`, {
      method: 'DELETE',
    })
  } catch (error) {
    console.error('[deleteSystemConfig]: Error deleting data:', error)
    throw error
  }
}

// Risk Tier Config API functions
export const getRiskTierConfigs = async (): Promise<RiskTierConfigResponse> => {
  try {
    return await makeRequest<RiskTierConfigResponse>('/risktier')
  } catch (error) {
    console.error('[getRiskTierConfigs]: Error fetching data:', error)
    throw error
  }
}

export const getRiskTierConfigById = async (id: string): Promise<SingleRiskTierConfigResponse> => {
  try {
    return await makeRequest<SingleRiskTierConfigResponse>(`/risktier/${id}`)
  } catch (error) {
    console.error('[getRiskTierConfigById]: Error fetching data:', error)
    throw error
  }
}

export const createRiskTierConfig = async (data: CreateRiskTierConfigData): Promise<SingleRiskTierConfigResponse> => {
  try {
    return await makeRequest<SingleRiskTierConfigResponse>('/risktier', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  } catch (error) {
    console.error('[createRiskTierConfig]: Error creating data:', error)
    throw error
  }
}

export const updateRiskTierConfig = async (id: string, data: UpdateRiskTierConfigData): Promise<SingleRiskTierConfigResponse> => {
  try {
    return await makeRequest<SingleRiskTierConfigResponse>(`/risktier/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  } catch (error) {
    console.error('[updateRiskTierConfig]: Error updating data:', error)
    throw error
  }
}

export const deleteRiskTierConfig = async (id: string): Promise<DeleteResponse> => {
  try {
    return await makeRequest<DeleteResponse>(`/risktier/${id}`, {
      method: 'DELETE',
    })
  } catch (error) {
    console.error('[deleteRiskTierConfig]: Error deleting data:', error)
    throw error
  }
}

// Industry API functions
export const getIndustries = async (): Promise<IndustryResponse> => {
  try {
    return await makeRequest<IndustryResponse>('/industries')
  } catch (error) {
    console.error('[getIndustries]: Error fetching data:', error)
    throw error
  }
}

export const getIndustryById = async (id: string): Promise<SingleIndustryResponse> => {
  try {
    return await makeRequest<SingleIndustryResponse>(`/industries/${id}`)
  } catch (error) {
    console.error('[getIndustryById]: Error fetching data:', error)
    throw error
  }
}

export const createIndustry = async (data: CreateIndustryData): Promise<SingleIndustryResponse> => {
  try {
    return await makeRequest<SingleIndustryResponse>('/industries', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  } catch (error) {
    console.error('[createIndustry]: Error creating data:', error)
    throw error
  }
}

export const updateIndustry = async (id: string, data: UpdateIndustryData): Promise<SingleIndustryResponse> => {
  try {
    return await makeRequest<SingleIndustryResponse>(`/industries/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  } catch (error) {
    console.error('[updateIndustry]: Error updating data:', error)
    throw error
  }
}

export const deleteIndustry = async (id: string): Promise<DeleteResponse> => {
  try {
    return await makeRequest<DeleteResponse>(`/industries/${id}`, {
      method: 'DELETE',
    })
  } catch (error) {
    console.error('[deleteIndustry]: Error deleting data:', error)
    throw error
  }
}
