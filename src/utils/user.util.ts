import jwt from 'jsonwebtoken'
type decodeToken = {
    userId: string, 
    name: string,
    email: string,
    iat: number,
    exp: number
}
export const decodeToken = (token: string) => {
    return jwt.decode(token.split(' ')[1]) as decodeToken
}