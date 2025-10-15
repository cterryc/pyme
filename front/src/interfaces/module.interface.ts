import type { ReactNode } from 'react'
import type { IconType } from 'react-icons'

export interface Submodule {
  id: string
  name: string
  description: string
  logo: IconType
  active: boolean
  permissionId: string
  route: string
  component?: ReactNode
}

export interface Module {
  id: string
  name: string
  description: string
  logo: IconType
  active: boolean
  permissionId: string
  submodules: Submodule[]
}
