import AppError from '@shared/errors/AppError';

import FakeCacheRepository from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';

describe('CreateUsers', () => {
  let fakeUsersRepository: FakeUsersRepository;
  let fakeHashProvider: FakeHashProvider;
  let createUserService: CreateUserService;
  let fakeCacheProvider: FakeCacheRepository;

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheRepository();

    createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );
  });
  it('should be able to create a new user', async () => {
    const user = await createUserService.execute({
      name: 'Otávio',
      email: 'otavio@test.com',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
    expect(user.name).toBe('Otávio');
  });

  it('should not be able to create a new user with same email from another', async () => {
    const email = 'otavio@test.com';

    await createUserService.execute({
      name: 'Otávio',
      email,
      password: '123456',
    });

    await expect(
      createUserService.execute({
        name: 'Otávio',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
