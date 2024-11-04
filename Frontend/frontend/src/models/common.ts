export type CommonResponse = {
  result: 'success' | 'fail'
}

export type OauthResponse = {
  redirect_url: string
}

export type SetupStatusResponse = {
  status: 'Finished' | 'No Setup'
  setup_at?: Date
}

export type InitValidateStatusResponse = {
  status: 'Finished' | 'No Setup'
}

export type UserProfileResponse = {
  id: string
  name: string
  email: string
  interface_theme: string
  status: string
  access_level: string
}

export type UserProfileOriginResponse = {
  json: () => Promise<UserProfileResponse>
  bodyUsed: boolean
  headers: any
}

export type IOrganizations = {
  id: string
  name: string
  status: string
  plan: string
}
export type IProject = {
  id: string
  name: string
  status: string
  plan: string
}

export type CurrentOrganizationProjectResponse = {
  OrganizationName: string
  OrganizationPlan: string
  OrganizationStatus: string
  ProjectStatus: string
  ProjectLimit: number
  current: boolean
}

export type Member = Pick<UserProfileResponse, 'id' | 'name' | 'email' | 'status'>

export type FileUploadConfigResponse = {
  batch_count_limit: number
  image_file_size_limit?: number | string // default is 10MB
  file_size_limit: number // default is 15MB
  audio_file_size_limit?: number // default is 50MB
  video_file_size_limit?: number // default is 100MB

}

export type InvitationResult = {
  status: 'success'
  email: string
  url: string
} | {
  status: 'failed'
  email: string
  message: string
}

export type InvitationResponse = CommonResponse & {
  invitation_results: InvitationResult[]
}

export type ModerateResponse = {
  flagged: boolean
  text: string
}