"use server"
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
const secretKey = process.env.SESSION_SECRET
const encodedKey = new TextEncoder().encode(secretKey)

export async function encrypt(payload: any) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('12h')
    .sign(encodedKey)
}

export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    })
    return payload
  } catch (error) {
    console.error('Failed to verify session', error)
  }
}

export async function createSession(username: string, roles: string) {
  const expiresAt = new Date(Date.now() + 12 * 60 * 60 * 1000)
  const session = await encrypt({ username, roles, expiresAt })

  cookies().set('session', session, {
    httpOnly: true,
    secure: false,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}


export async function updateSession() {
  const session = cookies().get('session')?.value
  const payload = await decrypt(session)

  if (!session || !payload) {
    return null
  }

  const expires = new Date(Date.now() + 12 * 60 * 60 * 1000)
  cookies().set('session', session, {
    httpOnly: true,
    secure: false,
    expires: expires,
    sameSite: 'lax',
    path: '/',
  })
}


export async function deleteSession() {
  cookies().delete('session')
  redirect("/")
}

