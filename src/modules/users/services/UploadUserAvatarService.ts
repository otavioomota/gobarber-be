import path from 'path';
import fs from 'fs';
import { injectable, inject } from 'tsyringe';

import uploadConfig from '@config/upload';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import User from '../infra/typeorm/entities/User';

interface IRequest {
  user_id: string;
  avatarFilename: string;
}

@injectable()
class UploadUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ user_id, avatarFilename }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('Only authenticated users can change avatar', 401);
    }

    if (user.avatar) {
      // Deletar avatar anterior
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);

      // A função stat retorna status do file caso exista, caso contrario retorna undefined;
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

      if (userAvatarFileExists) {
        // Caso o arquivo exista, a função unlink exclui o arq.
        await fs.promises.unlink(userAvatarFilePath);
      }
    }

    // Como já temos a instancia do user, podemos atribuir direto à instancia
    user.avatar = avatarFilename;

    // Salva a instancia no db, OBS: caso o id já exista no db, ele atualiza os campos.
    await this.usersRepository.save(user);
    return user;
  }
}

export default UploadUserAvatarService;
