import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';

import authConfig from '@config/auth';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import User from '../infra/typeorm/entities/User';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: User;
  token: string;
}

@injectable()
class AuthenticateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);

    // Boas práticas: Sempre retornar o mesmo erro na verificação entre usuario e senha
    if (!user) {
      throw new AppError('Email or password does not match', 401);
    }

    // Compara a senha digitada pelo usuario com a do BD
    const passwordCompare = await compare(password, user.password);

    if (!passwordCompare) {
      throw new AppError('Email or password does not match', 401);
    }

    delete user.password;

    /*
      Primeiro parametro -> payload
      Segundo parametro -> chave secreta
      Terceiro parametro -> configurações (subject, expiresIn)
    */

    const { secret, expiresIn } = authConfig.jwt;
    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    return {
      user,
      token,
    };
  }
}

export default AuthenticateUserService;
