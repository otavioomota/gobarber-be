import User from '@modules/users/infra/typeorm/entities/User';

import IUserCreateDTO from '@modules/users/dtos/ICreateUserDTO';

export default interface IUsersRepository {
  create(data: IUserCreateDTO): Promise<User>;
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  save(user: User): Promise<User>;
}
