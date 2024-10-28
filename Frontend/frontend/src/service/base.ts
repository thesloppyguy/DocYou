import { API_PREFIX, PUBLIC_API_PREFIX } from '@/constant'
import Toast from '@/app/components/base/toast'
const TIME_OUT = 100000

const ContentType = {
  json: 'application/json',
  stream: 'text/event-stream',
  audio: 'audio/mpeg',
  form: 'application/x-www-form-urlencoded; charset=UTF-8',
  download: 'application/octet-stream', // for download
  upload: 'multipart/form-data', // for upload
}

const baseOptions = {
  method: 'GET',
  mode: 'cors',
  credentials: 'include', // always send cookies、HTTP Basic authentication.
  headers: new Headers({
    'Content-Type': ContentType.json,
  }),
  redirect: 'follow',
}
export type IOnError = (msg: string, code?: string) => void

type ResponseError = {
    code: string
    message: string
    status: number
  }

export type IOtherOptions = {
    isPublicAPI?: boolean
    bodyStringify?: boolean
    needAllResponseContent?: boolean
    deleteContentType?: boolean
    silent?: boolean
    onError?: IOnError
    getAbortController?: (abortController: AbortController) => void
}

type FetchOptionType = Omit<RequestInit, 'body'> & {
    params?: Record<string, any>
    body?: BodyInit | Record<string, any> | null
  }

const baseFetch = <T>(
    url: string,
    fetchOptions: FetchOptionType,
    {
      isPublicAPI = false,
      bodyStringify = true,
      needAllResponseContent,
      deleteContentType,
      getAbortController,
      silent,
    }: IOtherOptions,
  ): Promise<T> => {
    const options: typeof baseOptions & FetchOptionType = Object.assign({}, baseOptions, fetchOptions)
    if (getAbortController) {
      const abortController = new AbortController()
      getAbortController(abortController)
      options.signal = abortController.signal
    }
    if (isPublicAPI) {
      const sharedToken = globalThis.location.pathname.split('/').slice(-1)[0]
      const accessToken = localStorage.getItem('token') || JSON.stringify({ [sharedToken]: '' })
      let accessTokenJson = { [sharedToken]: '' }
      try {
        accessTokenJson = JSON.parse(accessToken)
      }
      catch {
      }
      options.headers.set('Authorization', `Bearer ${accessTokenJson[sharedToken]}`)
    }
    else {
      const accessToken = localStorage.getItem('console_token') || ''
      options.headers.set('Authorization', `Bearer ${accessToken}`)
    }
  
    if (deleteContentType) {
      options.headers.delete('Content-Type')
    }
    else {
      const contentType = options.headers.get('Content-Type')
      if (!contentType)
        options.headers.set('Content-Type', ContentType.json)
    }
  
    const urlPrefix = isPublicAPI ? PUBLIC_API_PREFIX : API_PREFIX
    let urlWithPrefix = `${urlPrefix}${url.startsWith('/') ? url : `/${url}`}`
  
    const { method, params, body } = options
    // handle query
    if (method === 'GET' && params) {
      const paramsArray: string[] = []
      Object.keys(params).forEach(key =>
        paramsArray.push(`${key}=${encodeURIComponent(params[key])}`),
      )
      if (urlWithPrefix.search(/\?/) === -1)
        urlWithPrefix += `?${paramsArray.join('&')}`
  
      else
        urlWithPrefix += `&${paramsArray.join('&')}`
  
      delete options.params
    }
  
    if (body && bodyStringify)
      options.body = JSON.stringify(body)
  
    // Handle timeout
    return Promise.race([
      new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(new Error('request timeout'))
        }, TIME_OUT)
      }),
      new Promise((resolve, reject) => {
        globalThis.fetch(urlWithPrefix, options as RequestInit)
          .then((res) => {
            const resClone = res.clone()
            // Error handler
            if (!/^(2|3)\d{2}$/.test(String(res.status))) {
              const bodyJson = res.json()
              switch (res.status) {
                case 401: {
                  if (isPublicAPI) {
                    return bodyJson.then((data: ResponseError) => {  
                      if (data.code === 'unauthorized') {
                        globalThis.location.reload()
                      }
                      return Promise.reject(data)
                    })
                  }
                  const loginUrl = `${globalThis.location.origin}/signin`
                  bodyJson.then((data: ResponseError) => {
                    if (data.code === 'init_validate_failed' && !silent)
                      Toast.notify({ type: 'error', message: data.message, duration: 4000 })
                    else if (data.code === 'not_init_validated')
                      globalThis.location.href = `${globalThis.location.origin}/init`
                    else if (data.code === 'not_setup')
                      globalThis.location.href = `${globalThis.location.origin}/install`
                    else if (location.pathname !== '/signin')
                      globalThis.location.href = loginUrl
                    else if (!silent)
                      Toast.notify({ type: 'error', message: data.message })
                  }).catch(() => {
                    // Handle any other errors
                    globalThis.location.href = loginUrl
                  })
  
                  break
                }
                case 403:
                  bodyJson.then((data: ResponseError) => {
                    if (!silent)
                      Toast.notify({ type: 'error', message: data.message })
                    if (data.code === 'already_setup')
                      globalThis.location.href = `${globalThis.location.origin}/signin`
                  })
                  break
                // fall through
                default:
                  bodyJson.then((data: ResponseError) => {
                    if (!silent)
                      Toast.notify({ type: 'error', message: data.message })
                  })
              }
              return Promise.reject(resClone)
            }
  
            // handle delete api. Delete api not return content.
            if (res.status === 204) {
              resolve({ result: 'success' })
              return
            }
  
            // return data
            if (options.headers.get('Content-type') === ContentType.download || options.headers.get('Content-type') === ContentType.audio)
              resolve(needAllResponseContent ? resClone : res.blob())
  
            else resolve(needAllResponseContent ? resClone : res.json())
          })
          .catch((err) => {
            if (!silent)
              Toast.notify({ type: 'error', message: err })
            reject(err)
          })
      }),
    ]) as Promise<T>
  }
export function format(text: string) {
  let res = text.trim()
  if (res.startsWith('\n'))
    res = res.replace('\n', '')

  return res.replaceAll('\n', '<br/>').replaceAll('```', '')
}

// base request
export const request = <T>(url: string, options = {}, otherOptions?: IOtherOptions) => {
  return baseFetch<T>(url, options, otherOptions || {})
}

// request methods
export const get = <T>(url: string, options = {}, otherOptions?: IOtherOptions) => {
  return request<T>(url, Object.assign({}, options, { method: 'GET' }), otherOptions)
}

export const post = <T>(url: string, options = {}, otherOptions?: IOtherOptions) => {
  return request<T>(url, Object.assign({}, options, { method: 'POST' }), otherOptions)
}

export const put = <T>(url: string, options = {}, otherOptions?: IOtherOptions) => {
  return request<T>(url, Object.assign({}, options, { method: 'PUT' }), otherOptions)
}

export const putPublic = <T>(url: string, options = {}, otherOptions?: IOtherOptions) => {
  return put<T>(url, options, { ...otherOptions, isPublicAPI: true })
}

export const del = <T>(url: string, options = {}, otherOptions?: IOtherOptions) => {
  return request<T>(url, Object.assign({}, options, { method: 'DELETE' }), otherOptions)
}

export const delPublic = <T>(url: string, options = {}, otherOptions?: IOtherOptions) => {
  return del<T>(url, options, { ...otherOptions, isPublicAPI: true })
}

export const patch = <T>(url: string, options = {}, otherOptions?: IOtherOptions) => {
  return request<T>(url, Object.assign({}, options, { method: 'PATCH' }), otherOptions)
}

export const patchPublic = <T>(url: string, options = {}, otherOptions?: IOtherOptions) => {
  return patch<T>(url, options, { ...otherOptions, isPublicAPI: true })
}