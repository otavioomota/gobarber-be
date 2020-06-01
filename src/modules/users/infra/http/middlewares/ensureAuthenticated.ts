import { Request, Response, NextFunction, request } from 'express';
import { verify } from 'jsonwebtoken';

import authConfig from '@config/auth';

import AppError from '@shared/errors/AppError';

// Devemos definir o tipo pois há vários tipos de token
interface ITokenPayload {
  iat: string;
  exp: string;
  sub: string;
}

// teve que especificar os tipos dos parametros Express devido de não estar no mesmo arq do instanciamento
export default function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  // captura a variavel = 'Barear 131231231.21313.123.1';
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError('JWT token is missing', 401);
  }

  // Pega apenas o token.
  const [, token] = authHeader.split(' ');

  try {
    // Verifica se o token é valido.
    const decoded = verify(token, authConfig.jwt.secret);

    // Especificando o tipo do decoded.
    const { sub } = decoded as ITokenPayload;

    /*
      Por padrão você não consegue inserir o user ao request, já que não faz
      parte do tipo. Para isso você tem que sobrescrever a tipagem que ta na
      pasta @types.

      É importante inserir o id na request pois saberemos de quem pertence aquela
      requisição.
      */
    request.user = {
      id: sub,
    };

    return next();
  } catch (err) {
    throw new AppError('JWT token is invalid', 401);
  }
}
