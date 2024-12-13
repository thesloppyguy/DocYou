import type { Fetcher } from 'swr'
import { del, get, patch, post, put } from './base'
import type {
  CommonResponse,
  CurrentOrganizationProjectResponse,
  FileUploadConfigResponse,
  InitValidateStatusResponse,
  InvitationResponse,
  Member,
  ModerateResponse,
  OauthResponse,
  SetupStatusResponse,
  UserProfileOriginResponse,
} from '@/models/common'

type LoginSuccess = {
  result: 'success'
  data: { access_token: string;refresh_token: string }
}
type LoginFail = {
  result: 'fail'
  data: string
  code: string
  message: string
}
type LoginResponse = LoginSuccess | LoginFail
export const login: Fetcher<LoginResponse, { url: string; body: Record<string, any> }> = ({ url, body }) => {
  return post(url, { body }) as Promise<LoginResponse>
}

export const fetchNewToken: Fetcher<CommonResponse & { data: { access_token: string; refresh_token: string } }, { body: Record<string, any> }> = ({ body }) => {
  return post('/refresh-token', { body }) as Promise<CommonResponse & { data: { access_token: string; refresh_token: string } }>
}

export const setup: Fetcher<CommonResponse, { body: Record<string, any> }> = ({ body }) => {
  return post<CommonResponse>('/setup', { body })
}

export const register: Fetcher<CommonResponse, { body: Record<string, any> }> = ({ body }) => {
  return post<CommonResponse>('/register', { body })
}

export const initValidate: Fetcher<CommonResponse, { body: Record<string, any> }> = ({ body }) => {
  return post<CommonResponse>('/init', { body })
}

export const fetchInitValidateStatus = () => {
  return get<InitValidateStatusResponse>('/init')
}

export const fetchSetupStatus = () => {
  return get<SetupStatusResponse>('/setup')
}

export const fetchUserProfile: Fetcher<UserProfileOriginResponse, { url: string; params: Record<string, any> }> = ({ url, params }) => {
  return get<UserProfileOriginResponse>(url, params, { needAllResponseContent: true })
}

export const updateUserProfile: Fetcher<CommonResponse, { url: string; body: Record<string, any> }> = ({ url, body }) => {
  return post<CommonResponse>(url, { body })
}

export const logout: Fetcher<CommonResponse, { url: string; params: Record<string, any> }> = ({ url, params }) => {
  return get<CommonResponse>(url, params)
}

export const oauth: Fetcher<OauthResponse, { url: string; params: Record<string, any> }> = ({ url, params }) => {
  return get<OauthResponse>(url, { params })
}

export const oneMoreStep: Fetcher<CommonResponse, { url: string; body: Record<string, any> }> = ({ url, body }) => {
  return post<CommonResponse>(url, { body })
}

export const fetchMembers: Fetcher<{ accounts: Member[] | null }, { url: string; params: Record<string, any> }> = ({ url, params }) => {
  return get<{ accounts: Member[] | null }>(url, { params })
}

export const inviteMember: Fetcher<InvitationResponse, { url: string; body: Record<string, any> }> = ({ url, body }) => {
  return post<InvitationResponse>(url, { body })
}

export const updateMemberRole: Fetcher<CommonResponse, { url: string; body: Record<string, any> }> = ({ url, body }) => {
  return put<CommonResponse>(url, { body })
}

export const deleteMemberOrCancelInvitation: Fetcher<CommonResponse, { url: string }> = ({ url }) => {
  return del<CommonResponse>(url)
}

export const fetchFilePreview: Fetcher<{ content: string }, { fileID: string }> = ({ fileID }) => {
  return get<{ content: string }>(`/files/${fileID}/preview`)
}

export const fetchCurrentOrganizationProject: Fetcher<CurrentOrganizationProjectResponse, { url: string; params: Record<string, any> }> = ({ url, params }) => {
  return get<CurrentOrganizationProjectResponse>(url, { params })
}

export const updateCurrentWorkspace: Fetcher<CurrentOrganizationProjectResponse, { url: string; body: Record<string, any> }> = ({ url, body }) => {
  return post<CurrentOrganizationProjectResponse>(url, { body })
}

export const fetchWorkspaces: Fetcher<{ workspaces: IWorkspace[] }, { url: string; params: Record<string, any> }> = ({ url, params }) => {
  return get<{ workspaces: IWorkspace[] }>(url, { params })
}

export const switchWorkspace: Fetcher<CommonResponse & { new_tenant: IWorkspace }, { url: string; body: Record<string, any> }> = ({ url, body }) => {
  return post<CommonResponse & { new_tenant: IWorkspace }>(url, { body })
}

export const fetchDataSource: Fetcher<{ data: DataSourceNotion[] }, { url: string }> = ({ url }) => {
  return get<{ data: DataSourceNotion[] }>(url)
}

export const syncDataSourceNotion: Fetcher<CommonResponse, { url: string }> = ({ url }) => {
  return get<CommonResponse>(url)
}

export const updateDataSourceNotionAction: Fetcher<CommonResponse, { url: string }> = ({ url }) => {
  return patch<CommonResponse>(url)
}

export const fetchPluginProviders: Fetcher<PluginProvider[] | null, string> = (url) => {
  return get<PluginProvider[] | null>(url)
}

export const invitationCheck: Fetcher<CommonResponse & { is_valid: boolean; data: { workspace_name: string; email: string; workspace_id: string } }, { url: string; params: { workspace_id?: string; email?: string; token: string } }> = ({ url, params }) => {
  return get<CommonResponse & { is_valid: boolean; data: { workspace_name: string; email: string; workspace_id: string } }>(url, { params })
}

export const activateMember: Fetcher<LoginResponse, { url: string; body: any }> = ({ url, body }) => {
  return post<LoginResponse>(url, { body })
}

export const setModelProvider: Fetcher<CommonResponse, { url: string; body: any }> = ({ url, body }) => {
  return post<CommonResponse>(url, { body })
}

export const deleteModelProvider: Fetcher<CommonResponse, { url: string; body?: any }> = ({ url, body }) => {
  return del<CommonResponse>(url, { body })
}

export const changeModelProviderPriority: Fetcher<CommonResponse, { url: string; body: any }> = ({ url, body }) => {
  return post<CommonResponse>(url, { body })
}

export const setModelProviderModel: Fetcher<CommonResponse, { url: string; body: any }> = ({ url, body }) => {
  return post<CommonResponse>(url, { body })
}

export const deleteModelProviderModel: Fetcher<CommonResponse, { url: string }> = ({ url }) => {
  return del<CommonResponse>(url)
}

export const getPayUrl: Fetcher<{ url: string }, string> = (url) => {
  return get<{ url: string }>(url)
}

export const fetchFileUploadConfig: Fetcher<FileUploadConfigResponse, { url: string }> = ({ url }) => {
  return get<FileUploadConfigResponse>(url)
}

export const fetchFreeQuotaVerify: Fetcher<{ result: string; flag: boolean; reason: string }, string> = (url) => {
  return get(url) as Promise<{ result: string; flag: boolean; reason: string }>
}

export const fetchNotionConnection: Fetcher<{ data: string }, string> = (url) => {
  return get(url) as Promise<{ data: string }>
}

export const fetchDataSourceNotionBinding: Fetcher<{ result: string }, string> = (url) => {
  return get(url) as Promise<{ result: string }>
}

export const fetchApiBasedExtensionList: Fetcher<ApiBasedExtension[], string> = (url) => {
  return get(url) as Promise<ApiBasedExtension[]>
}

export const fetchApiBasedExtensionDetail: Fetcher<ApiBasedExtension, string> = (url) => {
  return get(url) as Promise<ApiBasedExtension>
}

export const addApiBasedExtension: Fetcher<ApiBasedExtension, { url: string; body: ApiBasedExtension }> = ({ url, body }) => {
  return post(url, { body }) as Promise<ApiBasedExtension>
}

export const updateApiBasedExtension: Fetcher<ApiBasedExtension, { url: string; body: ApiBasedExtension }> = ({ url, body }) => {
  return post(url, { body }) as Promise<ApiBasedExtension>
}

export const deleteApiBasedExtension: Fetcher<{ result: string }, string> = (url) => {
  return del(url) as Promise<{ result: string }>
}

export const fetchCodeBasedExtensionList: Fetcher<CodeBasedExtension, string> = (url) => {
  return get(url) as Promise<CodeBasedExtension>
}

export const moderate = (url: string, body: { app_id: string; text: string }) => {
  return post(url, { body }) as Promise<ModerateResponse>
}

export const sendForgotPasswordEmail: Fetcher<CommonResponse & { data: string }, { url: string; body: { email: string } }> = ({ url, body }) =>
  post<CommonResponse & { data: string }>(url, { body })

export const verifyForgotPasswordToken: Fetcher<CommonResponse & { is_valid: boolean; email: string }, { url: string; body: { token: string } }> = ({ url, body }) => {
  return post(url, { body }) as Promise<CommonResponse & { is_valid: boolean; email: string }>
}

export const changePasswordWithToken: Fetcher<CommonResponse, { url: string; body: { token: string; new_password: string; password_confirm: string } }> = ({ url, body }) =>
  post<CommonResponse>(url, { body })

export const fetchRemoteFileInfo = (url: string) => {
  return get<{ file_type: string; file_length: number }>(`/remote-files/${url}`)
}
export const sendEMailLoginCode = (email: string, language = 'en-US') =>
  post<CommonResponse & { data: string }>('/email-code-login', { body: { email, language } })

export const emailLoginWithCode = (data: { email: string;code: string;token: string }) =>
  post<LoginResponse>('/email-code-login/validity', { body: data })

export const sendResetPasswordCode = (email: string, language = 'en-US') =>
  post<CommonResponse & { data: string;message?: string ;code?: string }>('/forgot-password', { body: { email, language } })

export const verifyResetPasswordCode = (body: { email: string;code: string;token: string }) =>
  post<CommonResponse & { is_valid: boolean }>('/forgot-password/validity', { body })

export const resetPassword: Fetcher<CommonResponse, { body: Record<string, any> }> = ({ body }) => {
  return post<CommonResponse>('/reset', { body })
}